import type { ParserVersionsMap, schemaParsers } from '../__generated__';
import type {
  AbstractCodegenParsedClient,
  AbstractCodegenSchema,
} from './abstract';

/**
 * Union of all available schema parsers
 */
export type SchemaParsers = (typeof schemaParsers)[number];

export type GenericParserModuleExportParseFn = (
  schema: AbstractCodegenSchema
) => Promise<AbstractCodegenParsedClient>;

export type GenericParserModuleExport = {
  parse: GenericParserModuleExportParseFn;
};

export type ParserVersionsPathsMapping = ParserVersionsMap<
  () => Promise<GenericParserModuleExport>
>;
