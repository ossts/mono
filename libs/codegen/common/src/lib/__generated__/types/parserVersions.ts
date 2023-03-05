export type ParserVersionsMap<T> = {
  graphql: { v1: T };
  openapi: { v3: T };
};
