import { resolve as resolvePath } from 'node:path';

import { ensureFile, ensureFileSync, writeFile } from 'fs-extra';
import { get as getNested, isPlainObject, upperFirst } from 'lodash';
import prettier from 'prettier';
import rimraf from 'rimraf';

import type { AbstractExternalGeneratorWithName } from '@ossts/codegen/common';
import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';

import type {
  AllGeneratorsSettings,
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
    'output' | 'parsedSchema' | 'sequential' | 'beforeEach' | 'afterEach'
  >
) => {
  const rootFileNames: string[] = [];

  const prettierOptions = (await prettier.resolveConfig(process.cwd())) ?? {};

  const promises: Promise<void>[] = [];

  const allSettings: AllGeneratorsSettings = new Map();

  for (const generator of generators.values()) {
    allSettings.set(generator.name, generator.settings ?? {});
  }

  for (const generator of generators.values()) {
    if (
      generator.helpersOnly ||
      !Object.keys(generator.templates?.entries ?? {}).length
    )
      continue;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (beforeEach?.(generators as any, generator.name) === false) continue;

    rootFileNames.push(generator.outputPath);
    const promise = render(generator, allSettings, prettierOptions, {
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
  allSettings: AllGeneratorsSettings,
  prettierOptions: prettier.Options,
  { parsedSchema, output }: Pick<GenerateParams, 'output' | 'parsedSchema'>
) =>
  new Promise<void>((resolve) => {
    const { handlebarsInstance } = generator;
    if (!generator.templates || !handlebarsInstance) return;

    const promises: Promise<void>[] = [];
    const { templates, settings = {} } = generator;

    const generatorNS = generator.settings?.globalNS;

    const basePath = resolvePath(output ?? '', generator.outputPath);

    if (!generator.settings?.preventCleanup) {
      rimraf.sync(basePath);
    }

    const fileNames: string[] = [];

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

      dataAsArray.forEach((data: DictionaryWithAny) => {
        if (!isPlainObject(data)) {
          throw new Error(
            `Data in client for path "${config.dataPath}" should return object or array of objects`
          );
        }

        let fileName = '';

        if (typeof config.nameFieldOrFn === 'string') {
          fileName = getNested(data, config.nameFieldOrFn);
          if (!fileName) {
            throw new Error(
              `No data available for key "${config.nameFieldOrFn}"`
            );
          }
          if (config.nameSuffix) {
            fileName += config.nameSuffix;
          }
        } else {
          fileName = config.nameFieldOrFn(data);
        }

        if (!config.doNotAddToIndex) {
          fileNames.push(fileName);
        }

        const content = tpl({
          data,
          settings,
          allSettings,
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

        const dist = resolvePath(basePath, `${fileName}${generatorNS}.ts`);

        ensureFileSync(dist);
        promises.push(writeFile(dist, formattedContent));
      });
    }

    const indexDist = resolvePath(basePath, 'index.ts');
    const importAllNames = new Set();
    let content = fileNames
      .map((name) => {
        let content = `export * from './${name}${generatorNS}';`;

        if (
          generator.settings?.withEntryExportAll ||
          generator.settings?.withExportAll
        ) {
          let importAllName = `${name}${upperFirst(generatorNS)}${
            generator.settings?.exportAllSuffix
          }`;
          if (!generator.settings.preventExportNameCapitalization) {
            importAllName = upperFirst(importAllName);
          }

          content += `\nimport * as ${importAllName} from './${name}';`;
          if (generator.settings?.withEntryExportAll) {
            content += `\nexport { ${importAllName} }`;
          }

          importAllNames.add(importAllName);
        }

        return content;
      })
      .join('\n\n');

    if (generator.settings?.withExportAll) {
      let name = '',
        typeName = '';

      if (generator.settings.withExportAll === true) {
        name = `all${upperFirst(generatorNS)}${
          generator.settings.exportAllSuffix
        }`;
        typeName = upperFirst(name);
      } else {
        ({ name } = generator.settings.withExportAll);
        typeName =
          generator.settings.withExportAll.typeName ?? upperFirst(name);
      }

      content += `\n\nexport const ${name} = {\n`;
      content += [...importAllNames].map((name) => `  ${name},`).join('\n');
      content += '\n};';

      content += `\n\nexport type ${typeName} = typeof ${name};`;
    }

    ensureFileSync(indexDist);
    promises.push(writeFile(indexDist, content + '\n'));

    Promise.all(promises).then(() => resolve());
  });
