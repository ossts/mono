import type { AbstractExternalGeneratorWithName } from '@ossts/codegen/common';

import {
  normalizeGeneratorConfigs,
  resolveEntriesRenderCfg,
  resolveGeneratorTemplates,
} from '.';
import { generatorNames, generatorsDefaultConfigs } from '../__generated__';
import type {
  GeneratorsWithAll,
  ResolvedGenerator,
  ResolvedGeneratorsMap,
} from '../types';
import { registerHandlebarsEntities } from './registerHandlebarEntities';

/**
 * Prepares generator configuration and templates
 */
export const resolveGenerators = async <
  TGenerators extends AbstractExternalGeneratorWithName = AbstractExternalGeneratorWithName
>(
  generatorsCfg: (GeneratorsWithAll | TGenerators)[]
): Promise<ResolvedGeneratorsMap<TGenerators>> => {
  const generatorsMap: ResolvedGeneratorsMap<TGenerators> = new Map();

  let includesAll = false;

  const checkGeneratorNameAlreadyRegistered = (name: string) => {
    if (!generatorsMap.has(name)) return;

    throw new Error(`Multiple configurations provided for generator "${name}"`);
  };

  const generatorConfigs: ResolvedGenerator<TGenerators>[] = [];

  generatorsCfg.forEach((generatorCfg, index) => {
    if (generatorCfg === '*' || generatorCfg === 'all') {
      includesAll = true;
      return;
    }

    if (!('name' in generatorCfg)) {
      throw new Error(
        `"name" field is required, but missing for generator at index "${index}"`
      );
    }

    checkGeneratorNameAlreadyRegistered(generatorCfg.name);

    const normalizedCfg = normalizeGeneratorConfigs(generatorCfg);
    generatorConfigs.push(normalizedCfg);

    generatorsMap.set(normalizedCfg.name, normalizedCfg);
  });

  if (includesAll) {
    generatorNames.forEach((name) => {
      // we need to skip all built-in generators which were listed explicitly
      // in the list of generators
      if (generatorsMap.has(name)) return;

      const generatorCfg = generatorsDefaultConfigs[name];

      const normalizedCfg = normalizeGeneratorConfigs(generatorCfg);
      generatorConfigs.push(normalizedCfg);

      generatorsMap.set(normalizedCfg.name, normalizedCfg);
    });
  }

  const resolveTemplatesPromises = generatorConfigs.map((generatorCfg) =>
    resolveGeneratorTemplates(generatorCfg)
  );

  await Promise.all(resolveTemplatesPromises);

  generatorConfigs.forEach((generator) => {
    registerHandlebarsEntities(generator);
    resolveEntriesRenderCfg(generator);
  });

  return generatorsMap;
};
