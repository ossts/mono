import $RefParser from '@apidevtools/json-schema-ref-parser';

import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';

import type { AbstractCodegenSchema, AbstractOpenAPISchema } from '../types';

export const parseReferencesBundle = async (
  schema: string | DictionaryWithAny,
): Promise<AbstractCodegenSchema> => {
  const openApi = (await $RefParser.bundle(
    schema,
  )) as unknown as AbstractOpenAPISchema;

  openApi.version = openApi.openapi;

  return openApi;
};
