import { generatorNamesBuiltIn, generatorsAll } from '@ossts/codegen/common';
import type {
  AbstractExternalGeneratorWithName,
  AbstractGeneratorSettings,
  AbstractGeneratorWithName,
} from '@ossts/codegen/common';
import { tupleIncludes } from '@ossts/shared/typescript/helpers';

import {
  normalizeGeneratorConfigs,
  resolveEntriesRenderCfg,
  resolveGeneratorParams,
} from '.';
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
  generatorsCfg: (GeneratorsWithAll | TGenerators)[],
  generatorsSettings: AbstractGeneratorSettings | undefined
): Promise<ResolvedGeneratorsMap<TGenerators>> => {
  const generatorsMap: ResolvedGeneratorsMap<TGenerators> = new Map();
  const generatorCfgMap = new Map<string, AbstractGeneratorWithName>();

  let includesAll = false;

  generatorsCfg.forEach((generatorCfg, index) => {
    if (tupleIncludes(generatorsAll, generatorCfg)) {
      includesAll = true;
      return;
    }

    if (!('name' in generatorCfg)) {
      throw new Error(
        `"name" field is required, but missing for generator at index "${index}"`
      );
    }

    if (generatorCfgMap.has(generatorCfg.name)) {
      throw new Error(
        `Multiple configurations provided for generator "${name}"`
      );
    }

    generatorCfgMap.set(generatorCfg.name, generatorCfg);
  });

  if (includesAll) {
    generatorNamesBuiltIn.forEach((name) => {
      // we need to skip all built-in generators which were listed explicitly
      // in the list of generators
      if (generatorCfgMap.has(name)) return;

      generatorCfgMap.set(name, {
        name,
      });
    });
  }

  await resolveGeneratorsConfigs(
    generatorsMap,
    generatorCfgMap,
    generatorsSettings
  );

  return generatorsMap;
};

/**
 * Recursively resolves generator configs for `generatorCfgMap`
 * and its dependencies specified in `dependsOn` field
 */
const resolveGeneratorsConfigs = async <
  TGenerators extends AbstractExternalGeneratorWithName = AbstractExternalGeneratorWithName
>(
  generatorsMap: ResolvedGeneratorsMap<TGenerators>,
  generatorCfgMap: Map<string, AbstractGeneratorWithName>,
  generatorsSettings: AbstractGeneratorSettings | undefined
) => {
  const resolveTemplatesPromises = [...generatorCfgMap.values()].map(
    (generatorCfg) =>
      resolveGeneratorParams<TGenerators>(generatorCfg, generatorsSettings)
  );

  const generatorConfigs: ResolvedGenerator<TGenerators>[] = await Promise.all(
    resolveTemplatesPromises
  );

  const dependsOnGenerators = new Set<string>();
  generatorConfigs.forEach((generatorCfg) => {
    generatorCfg.dependsOn?.forEach((name) => dependsOnGenerators.add(name));
  });

  generatorCfgMap.clear();

  for (const name of dependsOnGenerators) {
    // ignore generator listed explicitly
    if (generatorsMap.has(name)) continue;

    generatorCfgMap.set(name, {
      name,
    });
  }

  // we have to resolve dependencies first, otherwise templates may have missing
  // global helpers or global templates
  if (generatorCfgMap.size) {
    await resolveGeneratorsConfigs(
      generatorsMap,
      generatorCfgMap,
      generatorsSettings
    );
  }

  generatorConfigs.forEach((generatorCfg) => {
    const normalizedCfg = normalizeGeneratorConfigs<TGenerators>(generatorCfg);

    generatorsMap.set(normalizedCfg.name, normalizedCfg);

    if (normalizedCfg.helpersOnly) return;

    registerHandlebarsEntities(normalizedCfg, generatorsMap);
    resolveEntriesRenderCfg(normalizedCfg);
  });
};
