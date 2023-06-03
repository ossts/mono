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
    // don't move ...generatorCfg after outputPath and generatorPath
    // it overrides those options with undefined on production build
    // at least when built using `tsup`
    ...generatorCfg,
    outputPath: generatorCfg.outputPath ?? name,
    generatorPath: generatorCfg.generatorPath ?? name,
    globalName: camelCase(name.split(pathSeparator).join('_')),
    settings: {
      formatter: 'prettier',
      ...generatorCfg.settings,
    },
    name,
  };

  return config;
};
