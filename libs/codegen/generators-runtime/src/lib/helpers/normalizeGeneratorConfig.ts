import { sep as pathSeparator } from 'node:path';

import { camelCase } from 'lodash';

import type {
  AbstractExternalGeneratorUXName,
  AbstractExternalGeneratorWithName,
  AbstractGeneratorWithName,
} from '@ossts/codegen/common';

import type { ResolvedGenerator } from '../types';

export const normalizeGeneratorConfigs = <
  TGenerators extends AbstractExternalGeneratorWithName = AbstractExternalGeneratorWithName
>(
  generatorCfg: AbstractGeneratorWithName | AbstractExternalGeneratorUXName
): ResolvedGenerator<TGenerators> => {
  let name: string;

  if ('uxname' in generatorCfg) {
    name = generatorCfg.uxname;
  } else {
    name = generatorCfg.name;
  }

  const config: ResolvedGenerator<TGenerators> = {
    outputPath: name,
    generatorPath: name,
    globalName: camelCase(name.split(pathSeparator).join('_')),
    ...generatorCfg,
    name,
  };

  return config;
};
