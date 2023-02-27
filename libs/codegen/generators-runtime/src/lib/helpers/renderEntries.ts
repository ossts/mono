import { resolve as resolvePath } from 'node:path';

import { ensureFile, ensureFileSync, writeFile } from 'fs-extra';
import Handlebars from 'handlebars';
import { get as getNested, isPlainObject } from 'lodash';

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

  if (sequential) {
    for (const generator of generators.values()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (beforeEach?.(generators as any, generator.name) === false) continue;
      rootFileNames.push(generator.outputPath ?? generator.globalName);
      await render(generator, {
        output,
        ...other,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      afterEach?.(generators as any, generator.name);
    }
  } else {
    const promises: Promise<void>[] = [];
    for (const generator of generators.values()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (beforeEach?.(generators as any, generator.name) === false) continue;
      rootFileNames.push(generator.outputPath ?? generator.globalName);
      promises.push(
        render(generator, {
          output,
          ...other,
        })
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      afterEach?.(generators as any, generator.name);
    }
    await Promise.all(promises);
  }

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
  {
    parsedSchema,
    output,
  }: Pick<GenerateParams, 'output' | 'suppressWarnings' | 'parsedSchema'>
) =>
  new Promise<void>((resolve) => {
    if (!generator.templates) return;

    const promises: Promise<void>[] = [];

    for (const name in generator.templates.entries) {
      const config = generator.resolvedEntriesRenderCfg?.[name];
      if (!config) continue;

      const tpl = Handlebars.template(generator.templates.entries[name]);

      const data = config.dataPath
        ? getNested(parsedSchema, config.dataPath)
        : parsedSchema;

      if (!data) {
        throw new Error(
          `No data available in client for path "${config.dataPath}"`
        );
      }

      const dataAsArray = Array.isArray(data) ? data : [data];

      const basePath = resolvePath(
        output ?? '',
        generator.outputPath ?? generator.globalName
      );

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

        const content = tpl(data);

        const dist = resolvePath(basePath, `${fileName}.ts`);

        ensureFileSync(dist);
        promises.push(writeFile(dist, content));
      });

      const indexDist = resolvePath(basePath, 'index.ts');
      const content = fileNames
        .map((name) => `export * from './${name}';`)
        .join('\n');

      ensureFileSync(indexDist);
      promises.push(writeFile(indexDist, content + '\n'));
    }

    Promise.all(promises).then(() => resolve());
  });
