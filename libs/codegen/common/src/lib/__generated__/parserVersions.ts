// TODO: build this based on parsers and versions available
export type ParserVersionsMap<T> = {
  openapi: {
    v3: T;
  };
  graphql: {
    v1: T;
  };
};
