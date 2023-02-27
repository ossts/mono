import { ensureFileSync, writeFileSync } from 'fs-extra';

import { Dictionary } from '@ossts/shared/typescript/helper-types';

import {
  fileExtension,
  generatorsRuntimeProjectGeneratedDataPath,
  generatorsStatsMap,
} from '../data';

const statsFilePath = `${generatorsRuntimeProjectGeneratedDataPath}/precompiledTemplatesStats.${fileExtension}`;

export const generateStats = () => {
  const statsSections = Object.entries(generatorsStatsMap).reduce<
    Dictionary<Dictionary<string[]>>
  >((acc, [generatorName, generatorStats]) => {
    acc[generatorName] = {};

    Object.entries(generatorStats).forEach(([key, value]) => {
      acc[generatorName][key] = [...value];
    });

    return acc;
  }, {});

  // prettier-ignore
  let content = `export const generatorTemplatesStats = ${JSON.stringify(
    statsSections,
    null,
    2
  )}\n`;

  ensureFileSync(statsFilePath);
  writeFileSync(statsFilePath, content);
};
