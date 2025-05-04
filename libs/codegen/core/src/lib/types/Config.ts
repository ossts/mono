import type { JSONSchema } from '@apidevtools/json-schema-ref-parser/dist/lib/types';

import type {
  AbstractCodegenParsedClient,
  AbstractExternalGeneratorWithName,
  SchemaParsers,
} from '@ossts/codegen/common';
import type { GenerateParams } from '@ossts/codegen/generators-runtime';

export interface Config<
  TGenerators extends
    AbstractExternalGeneratorWithName = AbstractExternalGeneratorWithName,
> extends Omit<GenerateParams<TGenerators>, 'parsedSchema'> {
  /**
   * Path to input file or http endpoint URL for OpenAPI schema
   */
  input: string | JSONSchema;

  /**
   * Schema type name
   *
   * Defaults to `openapi`
   */
  schemaType?: SchemaParsers;

  /**
   * Set this to `true` to only run parser logic and return result
   *
   * @TJS-ignore
   */
  parseOnly?: boolean;

  /**
   * Previously parsed schema.
   * This can be used to avoid unnecessary parsing if original schema didn't changed
   */
  parsedSchema?: AbstractCodegenParsedClient | null;
}
