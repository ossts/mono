import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';

export type GeneratorEntriesRenderConfigNameFieldExtractor = (
  data: DictionaryWithAny
) => string;

export type GeneratorEntriesRenderConfig = {
  /**
   * Path to data for entry template,
   * e.g. `models` or `services.operations`.
   *
   * Set to empty string `''` to pass whole parsed schema object.
   */
  dataPath: string;

  /**
   * Path to name field for entry, relative to `dataPath` or function that should return name of entry
   */
  nameFieldOrFn: string | GeneratorEntriesRenderConfigNameFieldExtractor;

  /**
   * Optional suffix to add after name field.
   *
   * Only applicable if `nameFieldOrFn` is `string`
   */
  nameSuffix?: string;

  /**
   * Set to true if file content shouldn't be reexported in index.ts
   */
  doNotAddToIndex?: boolean;
};
