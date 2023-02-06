import type { JSONSchema } from '@apidevtools/json-schema-ref-parser/dist/lib/types';

import type { AbstractCodegenSchema, SchemaParsers } from '../types';
import { parseReferencesBundle } from './parseReferencesBundle';

export const getSchema = async (
  input: string | JSONSchema,
  schemaType: SchemaParsers
): Promise<AbstractCodegenSchema> => {
  switch (schemaType) {
    case 'openapi':
      return await parseReferencesBundle(input);
    default:
      throw new Error(`No schema resolver available for type "${schemaType}"`);
  }
};
