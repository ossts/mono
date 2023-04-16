import type { AbstractExternalGenerator } from './AbstractExternalGenerator';

export interface AbstractExternalGeneratorUXName
  extends AbstractExternalGenerator {
  /**
   * Name of this generator. Should have unique value across all generators.
   *
   * Use `uxname` only if you want to create custom generator inline (without creating custom extension).
   *
   * Using this name will require `name` field to be provided in `uxname` field
   */
  name: 'uxname';

  /**
   * This field should only be used when name is set to `uxname`.
   */
  uxname: string;
}
