import type { ParserVersionsPathsMapping } from '@ossts/codegen/common';

export const parserVersionsPathMapping: ParserVersionsPathsMapping = {
  openapi: {
    v3: () => import('@ossts/codegen/parsers/openapi/v3'),
  },
  graphql: {
    v1: () => import('@ossts/codegen/parsers/graphql/v1'),
  },
};
