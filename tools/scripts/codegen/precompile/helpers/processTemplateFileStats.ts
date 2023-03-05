import { parse, sep as pathSeparator } from 'node:path';

import { camelCase } from 'lodash';

import { getTemplateType } from '.';
import { generatorsStatsMap } from '../data';

export const processTemplateFileStats = (
  path: string,
  eventName?: 'add' | 'change' | 'unlink'
) => {
  const parsedPath = parse(path);

  const exportType = getTemplateType(path);

  let name = '';
  if (exportType === 'entries') {
    name = parsedPath.name;
  } else {
    const nameSplit = parsedPath.dir.split(pathSeparator);
    nameSplit.push(parsedPath.name);
    name = camelCase(nameSplit.join('_'));
  }

  if (eventName === 'unlink') {
    generatorsStatsMap[exportType].delete(name);
  } else {
    generatorsStatsMap[exportType].add(name);
  }
};
