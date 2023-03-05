import { parse, sep as pathSeparator } from 'node:path';

import type { GeneratorTemplatesExportType } from '@ossts/codegen/common';
import { generatorTemplatesExportTypes } from '@ossts/codegen/common';

export const getTemplateType = (path: string): GeneratorTemplatesExportType => {
  const parsedPath = parse(path);
  const parsedPathSplit = parsedPath.dir.split(pathSeparator);

  const parsedPathType = parsedPathSplit[0] as GeneratorTemplatesExportType;

  if (!generatorTemplatesExportTypes.includes(parsedPathType)) {
    throw new Error(
      `Unsupported template type "${parsedPathType}". Allowed values are "${JSON.stringify(
        generatorTemplatesExportTypes
      )}"`
    );
  }
  return parsedPathType;
};
