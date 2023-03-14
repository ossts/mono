import { camelCase, upperFirst } from 'lodash';

import { generatorNamesBuiltIn } from '@ossts/codegen/common';
import type {
  AbstractExternalGeneratorWithName,
  AbstractGeneratorSettings,
  AbstractGeneratorWithName,
} from '@ossts/codegen/common';

import { generatorImportPaths } from '../__generated__';
import type { ResolvedGenerator } from '../types';

export const generatorNamesString: readonly string[] = generatorNamesBuiltIn;

export const resolveGeneratorParams = async <
  TGenerators extends AbstractExternalGeneratorWithName = AbstractExternalGeneratorWithName
>(
  generatorCfg: AbstractGeneratorWithName,
  generatorsSettings: AbstractGeneratorSettings | undefined
): Promise<ResolvedGenerator<TGenerators>> => {
  const isBuiltIn = generatorNamesString.includes(generatorCfg.name);

  let generator: ResolvedGenerator<TGenerators> | null = null;
  if (isBuiltIn) {
    const module = await generatorImportPaths[generatorCfg.name]();

    const { precompiledTemplates, helpers } = module;

    const GeneratorCls =
      module[`${upperFirst(camelCase(generatorCfg.name))}Generator`];

    const generatorParams: AbstractGeneratorWithName = {
      ...generatorCfg,
      settings: {
        ...generatorsSettings,
        ...generatorCfg.settings,
      },
    };

    generator = new GeneratorCls(
      generatorParams
    ) as ResolvedGenerator<TGenerators>;

    generator.templates = precompiledTemplates;
    generator.helpers = helpers;
  } else {
    generator = {} as ResolvedGenerator<TGenerators>;
    // TODO: extract required info from external generator
    throw new Error('External generators not implemented yet');
  }

  return generator;
};
