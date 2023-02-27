import { parse, sep as pathSeparator } from 'node:path';

import { camelCase } from 'lodash';

import { getTemplateType } from '.';
import { generatorsStatsMap } from '../data';

export const processTemplateFileStats = (
  path: string,
  eventName?: 'add' | 'change' | 'unlink'
) => {
  const [generatorName, requiredPath] = path.split('/src/lib/templates/');

  const parsedPath = parse(requiredPath);

  let exportType = getTemplateType(requiredPath);

  let name = '';
  if (exportType === 'entries') {
    name = parsedPath.name;
  } else {
    const nameSplit = parsedPath.dir.split(pathSeparator).slice(1);
    nameSplit.push(parsedPath.name);
    name = camelCase(nameSplit.join('__'));
  }

  if (eventName === 'unlink') {
    generatorsStatsMap[generatorName][exportType].delete(name);
  } else {
    generatorsStatsMap[generatorName][exportType].add(name);
  }
};
