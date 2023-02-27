import { parse, sep as pathSeparator } from 'node:path';

import { camelCase } from 'lodash';

import type { GeneratorExportType } from '@ossts/codegen/common';
import { generatorExportTypes } from '@ossts/codegen/common';

import { defaultExportType } from '../data';

export const getTemplateType = (path: string): GeneratorExportType => {
  const parsedPath = parse(path);
  const parsedPathSplit = parsedPath.dir.split(pathSeparator);

  const parsedPathType = camelCase(parsedPathSplit[0]) as GeneratorExportType;
  let exportType = defaultExportType;
  if (generatorExportTypes.includes(parsedPathType)) {
    exportType = parsedPathType;
  }

  return exportType;
};
