import $RefParser from '@apidevtools/json-schema-ref-parser';

import { parse } from './parser';
import type { Options } from './types';
import type { OpenAPIDocument } from './typings';

export async function generate({ input, output }: Options) {
  const openApi = (await $RefParser.bundle(
    input
  )) as unknown as OpenAPIDocument;

  const version = parseInt(openApi.openapi, 10);

  if (version !== 3) {
    throw new Error('Only OpenAPI v3 supported at the moment');
  }

  const result = parse(openApi);

  return result;
}
