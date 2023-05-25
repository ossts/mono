import type { ParserVersionsPathsMapping } from '@ossts/codegen/common';
import * as graphqlV1 from '@ossts/codegen/parsers/graphql/v1';
import * as openapiV3 from '@ossts/codegen/parsers/openapi/v3';

export const parserVersionsPathMapping: ParserVersionsPathsMapping = {
  openapi: {
    v3: openapiV3,
  },
  graphql: {
    v1: graphqlV1,
  },
};
