import { resolve as resolvePath } from 'node:path';

import { ensureFile, ensureFileSync, writeFile } from 'fs-extra';
import { camelCase, get as getNested, isPlainObject } from 'lodash';
import prettier from 'prettier';
import rimraf from 'rimraf';

import type { AbstractExternalGeneratorWithName } from '@ossts/codegen/common';
import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';

import type {
  GenerateParams,
  ResolvedGenerator,
  ResolvedGeneratorsMap,
} from '../types';

export const renderEntries = async <
  TGenerators extends AbstractExternalGeneratorWithName = AbstractExternalGeneratorWithName
>(
  generators: ResolvedGeneratorsMap<TGenerators>,
  {
    output,
    sequential,
    beforeEach,
    afterEach,
    ...other
  }: Pick<
    GenerateParams,
    | 'output'
    | 'suppressWarnings'
    | 'parsedSchema'
    | 'sequential'
    | 'beforeEach'
    | 'afterEach'
  >
) => {
  const rootFileNames: string[] = [];

  const prettierOptions = (await prettier.resolveConfig(process.cwd())) ?? {};

  const promises: Promise<void>[] = [];
  for (const generator of generators.values()) {
    if (
      generator.helpersOnly ||
      !Object.keys(generator.templates?.entries ?? {}).length
    )
      continue;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (beforeEach?.(generators as any, generator.name) === false) continue;

    rootFileNames.push(generator.outputPath);
    const promise = render(generator, prettierOptions, {
      output,
      ...other,
    });
    promises.push(promise);

    if (sequential) await promise;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    afterEach?.(generators as any, generator.name);
  }
  await Promise.all(promises);

  const indexDist = resolvePath(output ?? '', 'index.ts');
  const content = rootFileNames
    .map((name) => `export * from './${name}';`)
    .join('\n');

  await ensureFile(indexDist);
  await writeFile(indexDist, content + '\n');
};

const render = <
  TGenerators extends AbstractExternalGeneratorWithName = AbstractExternalGeneratorWithName
>(
  generator: ResolvedGenerator<TGenerators>,
  prettierOptions: prettier.Options,
  {
    parsedSchema,
    output,
  }: Pick<GenerateParams, 'output' | 'suppressWarnings' | 'parsedSchema'>
) =>
  new Promise<void>((resolve) => {
    const { handlebarsInstance } = generator;
    if (!generator.templates || !handlebarsInstance) return;

    const promises: Promise<void>[] = [];
    const { templates, settings = {} } = generator;

    for (const name in templates.entries) {
      const config = generator.resolvedEntriesRenderCfg?.[name];
      if (!config) continue;

      const tpl = handlebarsInstance.template(templates.entries[name]);

      const data = config.dataPath
        ? getNested(parsedSchema, config.dataPath)
        : parsedSchema;

      if (!data) {
        throw new Error(
          `No data available in client for path "${config.dataPath}"`
        );
      }

      const dataAsArray = Array.isArray(data) ? data : [data];

      const basePath = resolvePath(output ?? '', generator.outputPath);

      rimraf.sync(basePath);

      const fileNames: string[] = [];

      dataAsArray.forEach((data: DictionaryWithAny) => {
        if (!isPlainObject(data)) {
          throw new Error(
            `Data in client for path "${config.dataPath}" should return object or array of objects`
          );
        }

        let fileName = '';

        if (typeof config.nameFieldOrFn === 'string') {
          fileName = getNested(data, config.nameFieldOrFn);
          fileName += config.nameSuffix;
        } else {
          fileName = config.nameFieldOrFn(data);
        }

        fileNames.push(fileName);

        const content = tpl({
          data,
          settings,
        });

        let formattedContent = content;

        if (settings.formatter === 'prettier') {
          formattedContent = prettier.format(content, {
            parser: 'typescript',
            ...prettierOptions,
          });
        } else if (typeof settings.formatter === 'function') {
          formattedContent = settings.formatter(content);
        }

        const dist = resolvePath(basePath, `${fileName}.ts`);

        ensureFileSync(dist);
        promises.push(writeFile(dist, formattedContent));
      });

      const indexDist = resolvePath(basePath, 'index.ts');
      const content = fileNames
        .map((name) => {
          let content = `export * from './${name}';`;

          if (generator.settings?.createExportAllWithSuffix) {
            content += `\nexport * as ${camelCase(
              name + '_' + generator.settings.createExportAllWithSuffix
            )} from './${name}';`;
          }

          return content;
        })
        .join('\n');

      ensureFileSync(indexDist);
      promises.push(writeFile(indexDist, content + '\n'));
    }

    Promise.all(promises).then(() => resolve());
  });
