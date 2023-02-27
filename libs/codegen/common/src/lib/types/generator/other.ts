export type GeneratorEntriesRenderConfigNameFieldExtractor = (
  data: unknown
) => string;

export type GeneratorEntriesRenderConfig = {
  /**
   * Path to data for entry template,
   * e.g. `models` or `services.operations`
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
};
