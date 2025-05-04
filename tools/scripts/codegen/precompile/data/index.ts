import { join, sep as pathSeparator, resolve } from 'node:path';

import { camelCase } from 'lodash';
import yargsParse from 'yargs-parser';

import type {
  GeneratorHelpersExportType,
  GeneratorTemplatesExportType,
} from '@ossts/codegen/common';
import type {
  Dictionary,
  DictionaryWithAny,
} from '@ossts/shared/typescript/helper-types';

const {
  watch,
  showLogs = false,
  fileExtension = 'js',
  internalCall = false,
  _: [generatorPathArg],
} = yargsParse(process.argv.slice(2));

const isWatchMode = watch === 'true';

if (!generatorPathArg) {
  throw new Error(`Path to generator is mandatory`);
}

const generatorPath = `${generatorPathArg}`;
const generatorAbsolutePath = resolve(generatorPath);
const generatorTemplatesPath = join(generatorPath, 'templates');
const generatorPrecompiledTemplatesPath = join(
  generatorPath,
  'precompiled-templates',
);

let generatorName = generatorAbsolutePath.split(pathSeparator).at(-1);

const globals = {
  watcherInitialized: false,
  generatorName,
};

type GeneratorConfg = {
  precompiledTemplates: Record<GeneratorTemplatesExportType, DictionaryWithAny>;
  helpers: Record<GeneratorHelpersExportType, DictionaryWithAny>;
};
let generatorConfig: GeneratorConfg | null = null;

const getGeneratorConfig = async () => {
  if (generatorConfig) {
    return generatorConfig;
  }
  generatorConfig = await import(`${generatorPath}`);
  if (!generatorConfig) {
    throw new Error(
      `Unable to read generator config. Please make sure that there is an "index.{${fileExtension}}" present in generator root directory.`,
    );
  }

  return generatorConfig;
};

const exportsMap: Record<GeneratorTemplatesExportType, Dictionary<string>> = {
  entries: {},
  partials: {},
  globalPartials: {},
};

const generatorsStatsMap: Record<GeneratorTemplatesExportType, Set<string>> = {
  entries: new Set(),
  partials: new Set(),
  globalPartials: new Set(),
};

const precompiledTemplateDisableLinters = [
  '/* eslint-disable */',
  '// @ts-nocheck',
].join('\n');

export {
  globals,
  showLogs,
  internalCall,
  fileExtension,
  isWatchMode,
  generatorPath,
  generatorTemplatesPath,
  generatorPrecompiledTemplatesPath,
  exportsMap,
  generatorsStatsMap,
  precompiledTemplateDisableLinters,
  getGeneratorConfig,
};
