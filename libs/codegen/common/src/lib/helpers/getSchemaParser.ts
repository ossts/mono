import { satisfies } from 'semver';

import type { Dictionary } from '@ossts/shared/typescript/helper-types';

import { parserVersionsSemverMapping } from '../data';
import type {
  GenericParserModuleExport,
  GenericParserModuleExportParseFn,
  ParserVersionsPathsMapping,
  SchemaParsers,
} from '../types';

export const getSchemaParser = async (
  schemaType: SchemaParsers,
  schemaVersion: string,
  parserVersionsPathMapping: ParserVersionsPathsMapping,
): Promise<GenericParserModuleExportParseFn> => {
  const schemaParsers = parserVersionsSemverMapping[schemaType];

  const requiredParserVersion = Object.entries(schemaParsers).find(
    ([version, semver]) => satisfies(schemaVersion, semver),
  );

  if (!requiredParserVersion) {
    throw new Error(
      `No parser available for "${schemaType}" schema version "${schemaVersion}".\nAvailable parsers are: \n${JSON.stringify(
        schemaParsers,
        null,
        2,
      )}`,
    );
  }

  const loadParserVersion = requiredParserVersion[0];

  return (
    parserVersionsPathMapping[
      schemaType
    ] as Dictionary<GenericParserModuleExport>
  )[loadParserVersion].parse;
};
