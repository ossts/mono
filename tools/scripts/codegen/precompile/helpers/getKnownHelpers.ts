import { camelCase } from 'lodash';

import { knownGlobalHelpers as builtInGlobalHelpers } from '@ossts/codegen/generators-runtime';
import {
  Dictionary,
  DictionaryWithAny,
} from '@ossts/shared/typescript/helper-types';

import { getGeneratorConfig, globals, internalCall } from '../data';

let cachedKnownHelpers = new Map<DictionaryWithAny, Dictionary<boolean>>();

/**
 * Combines internal global helpers with generator local helpers
 */
export const getKnownHelpers = async (
  generatorLocalHelpers: DictionaryWithAny = {}
) => {
  if (
    !globals.watcherInitialized &&
    cachedKnownHelpers.has(generatorLocalHelpers)
  ) {
    return cachedKnownHelpers.get(generatorLocalHelpers);
  }

  const generatorConfig = await getGeneratorConfig();

  let knownHelpers: Dictionary<boolean> = {};
  const knownHelpersSet = new Set<string>();

  for await (let [generatorName, getter] of Object.entries(
    builtInGlobalHelpers
  )) {
    const helpers = await getter();
    Object.keys(helpers).forEach((helperName) => {
      knownHelpersSet.add(`${generatorName}_${helperName}`);
    });
  }

  Object.keys(generatorLocalHelpers).forEach((name) => {
    knownHelpersSet.add(name);
  });

  if (!internalCall && generatorConfig?.helpers.globalHelpers) {
    Object.keys(generatorConfig.helpers.globalHelpers).forEach((name) => {
      knownHelpersSet.add(`${globals.generatorName}_${name}`);
    });
  }

  knownHelpers = [...knownHelpersSet].reduce<Dictionary<boolean>>(
    (acc, helperName) => {
      acc[camelCase(helperName)] = true;
      return acc;
    },
    {}
  );

  if (!globals.watcherInitialized) {
    cachedKnownHelpers.set(generatorLocalHelpers, knownHelpers);
  }

  return knownHelpers;
};
