import type { ParserVersionsMap } from '../__generated__';

export * from './generatorExportTypes';

export const parserVersionsSemverMapping: ParserVersionsMap<string> = {
  openapi: {
    v3: '3.x',
  },
  graphql: {
    v1: '1.x',
  },
};
