import type { JSONSchema } from '@apidevtools/json-schema-ref-parser/dist/lib/types';

import type { SchemaParsers } from '@ossts/codegen/common';

export interface Config {
  /**
   * Path to input file or http endpoint URL for OpenAPI schema
   */
  input: string | JSONSchema;

  /**
   * Destination path to which generators results should be written.
   *
   * Defaults to `codegen`
   */
  output?: string;

  /**
   * Schema type name
   *
   * Defaults to `openapi`
   */
  schemaType?: SchemaParsers;

  /**
   * Set this to `true` to only run parser logic and return result
   */
  parseOnly?: boolean;
}
