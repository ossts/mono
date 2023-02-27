import { ensureFileSync, writeFileSync } from 'fs-extra';

import type { GeneratorExportType } from '@ossts/codegen/common';
import { Dictionary } from '@ossts/shared/typescript/helper-types';

import {
  fileExtension,
  generatorsRuntimeProjectGeneratedDataPath,
  generatorsStatsMap,
  knownGlobals,
} from '../data';
import { getTemplateType } from './getTemplateType';

const helperTypes: GeneratorExportType[] = ['globalHelpers'];

const helpersFilePath = `${generatorsRuntimeProjectGeneratedDataPath}/knownGlobalHelpers.${fileExtension}`;

export const generateKnownGlobalHelpers = (path?: string) => {
  // if path is not passed - it's an initial call, so run generate
  let type = helperTypes[0];

  if (path) {
    const [, requiredPath] = path.split('/src/lib/templates/');
    type = getTemplateType(requiredPath);
  }

  const isHelper = helperTypes.includes(type);
  if (!isHelper) return;

  const newKnownGlobalHelpers: Dictionary<Dictionary<boolean>> = {};

  Object.entries(generatorsStatsMap).forEach(
    ([generatorName, generatorStats]) => {
      if (!newKnownGlobalHelpers[generatorName]) {
        newKnownGlobalHelpers[generatorName] = {};
      }

      helperTypes.forEach((type) => {
        generatorStats[type].forEach((helperName: string) => {
          newKnownGlobalHelpers[generatorName][helperName] = true;
        });
      });
    }
  );

  knownGlobals.helpers = newKnownGlobalHelpers;

  const content = `export const knownGlobalHelpers = ${JSON.stringify(
    newKnownGlobalHelpers,
    null,
    2
  )}\n`;

  ensureFileSync(helpersFilePath);
  writeFileSync(helpersFilePath, content);
};
