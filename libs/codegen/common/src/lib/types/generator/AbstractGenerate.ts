import type { AbstractGeneratorWithAll } from '.';
import type { AbstractCodegenParsedClient } from '..';
import type {
  AbstractGenerateHookAfterAll,
  AbstractGenerateHookAfterEach,
  AbstractGenerateHookBeforeAll,
  AbstractGenerateHookBeforeEach,
} from './AbstractGenerateHooks';

/**
 * Parameters for main generator `generate` function
 */
export interface AbstractGenerateParams<
  TGenerators extends AbstractGeneratorWithAll = AbstractGeneratorWithAll,
  TResolvedGeneratorsMap = unknown,
  TGeneratorNames extends string = string
> {
  /**
   * Parsed schema
   */
  parsedSchema: AbstractCodegenParsedClient;

  /**
   * Destination path to which generators results should be written.
   *
   * Defaults to `codegen`
   */
  output?: string;

  /**
   * Generators that should be used.
   *
   * Set to `*` or `all` to include all built-in generators
   */
  generators: TGenerators[];

  /**
   * Set to true to prevent any warnings on all generators.
   *
   * This can be overridden on generator level
   */
  suppressWarnings?: boolean;

  /**
   * Set this to true to make all generators run in sequence.
   *
   * This may be useful if result of one generator depends on generator before it.
   *
   * Some commands (i.e. `before`, `after`) set this flag to `true` if not set explicitly
   */
  sequential?: boolean;

  /**
   * This function is called before any generator is called.
   *
   * Return `false` to prevent any generator from running
   */
  beforeAll?: AbstractGenerateHookBeforeAll<TResolvedGeneratorsMap>;

  /**
   * This function is called after all generators finished processing.
   *
   * This may be used to add additional logic based on results
   */
  afterAll?: AbstractGenerateHookAfterAll<TResolvedGeneratorsMap>;

  /**
   * This function is called before each generator is called.
   *
   * Return `false` to prevent this generator from running
   */
  beforeEach?: AbstractGenerateHookBeforeEach<
    TResolvedGeneratorsMap,
    TGeneratorNames
  >;

  /**
   * This function is called after each generator is called.
   *
   * This may be used to add additional logic based on results
   */
  afterEach?: AbstractGenerateHookAfterEach<
    TResolvedGeneratorsMap,
    TGeneratorNames
  >;
}
