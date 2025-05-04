import type { AbstractGeneratorSettings } from '@ossts/codegen/common';

import type { SchemaZodGenerator, schemaZodGeneratorName } from '../generator';

/* eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type */
export interface SchemaZodGeneratorSettings extends AbstractGeneratorSettings {
  /**
   * Set this to `true` to disable primitives coercion.
   *
   * @see https://zod.dev/?id=coercion-for-primitives
   */
  withoutTypeCoercion?: boolean;
}

export type SchemaZodGeneratorName = typeof schemaZodGeneratorName;

export type SchemaZodGeneratorConfig = Omit<SchemaZodGenerator, 'name'>;
