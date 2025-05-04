import type {
  AbstractCodegenParsedClient,
  AbstractCodegenSchema,
} from '@ossts/codegen/common';

export const parse = async (
  schema: AbstractCodegenSchema,
): Promise<AbstractCodegenParsedClient> => {
  // TODO: implementation which will transform to openapi and run it's generators

  throw new Error('Not implemented yet');

  return {
    version: '1',
  };
};
