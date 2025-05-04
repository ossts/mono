import type Handlebars from 'handlebars/runtime';

import type { AbstractGeneratorSettings } from '@ossts/codegen/common';
import type {
  ParsedModelOpenAPIV3,
  ParsedModelOpenAPIV3TypeWithoutGeneric,
  ParsedSchemaOpenAPIV3FormatWithoutGeneric,
} from '@ossts/codegen/parsers/openapi/v3';

import type {
  MockFakerJsGenerator,
  mockFakerJsGeneratorName,
} from '../generator';

export interface MockFakerJSGeneratorGenerateParamsFnParams {
  /**
   * Root of currently process item
   */
  root: ParsedModelOpenAPIV3;
  /**
   * Full path to current property
   *
   * e.g. `['ModelUser', 'fullName']`
   */
  fullPath: string[];
  /**
   * Settings that FakerJS generator has been called with
   */
  generatorSettings: MockFakerJsGeneratorSettings;
  /**
   * Settings that current Handlebar helpers has been called with
   */
  handlebarsHelperOptions: Handlebars.HelperOptions;
  /**
   * Reference to Handlebars instance
   */
  handlebarsInstance: typeof Handlebars;
}

export interface MockFakerJSGeneratorGenerateFnParams
  extends MockFakerJSGeneratorGenerateParamsFnParams {
  /**
   * Params generated based on provided configuration.
   *
   * This is controlled using `fakerParamsGenerators` setting.
   *
   * There will be empty string if no parameters available.
   */
  params: string;
}

export type MockFakerJSGeneratorGenerateFn<
  T extends
    MockFakerJSGeneratorGenerateParamsFnParams = MockFakerJSGeneratorGenerateFnParams,
> = (
  /**
   * Currently processed item
   */
  target: ParsedModelOpenAPIV3,

  params: T,
) => string | null | undefined | void;

export type MockFakerJSGeneratorGeneratePathBased = {
  [k: string]:
    | undefined
    | string
    | MockFakerJSGeneratorGenerateFn
    | MockFakerJSGeneratorGeneratePathBased;
};

export type MockFakerJSGeneratorGenerateTypeBased = Partial<
  Record<
    | ParsedModelOpenAPIV3TypeWithoutGeneric
    | `${ParsedModelOpenAPIV3TypeWithoutGeneric}-${ParsedSchemaOpenAPIV3FormatWithoutGeneric}`,
    string | MockFakerJSGeneratorGenerateFn
  >
>;

export type MockFakerJSGeneratorGenerateParamsFn =
  MockFakerJSGeneratorGenerateFn<MockFakerJSGeneratorGenerateParamsFnParams>;

export type MockFakerJSGeneratorGenerateParamsPathBased = {
  [k: string]:
    | undefined
    | string
    | MockFakerJSGeneratorGenerateParamsFn
    | MockFakerJSGeneratorGenerateParamsPathBased;
};

export type MockFakerJSGeneratorGenerateParamsTypeBased = Partial<
  Record<
    | ParsedModelOpenAPIV3TypeWithoutGeneric
    | `${ParsedModelOpenAPIV3TypeWithoutGeneric}-${ParsedSchemaOpenAPIV3FormatWithoutGeneric}`,
    string | MockFakerJSGeneratorGenerateParamsFn
  >
>;

/* eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type */
export interface MockFakerJsGeneratorSettings
  extends AbstractGeneratorSettings {
  fakerGenerators?: {
    /**
     * Function which receives all available settings and should return FakerJS method to use as a `string`, excluding FakerJS root element.
     *
     * e.g.
     *
     * `'.number.int()'`
     *
     * or
     *
     * `'.string.alpha({ length: { min: 5, max: 10 } })'`
     *
     * This method has highest priority!
     */
    generate?: MockFakerJSGeneratorGenerateFn;

    /**
     * Mapping of FakerJS method to use based on current item path
     *
     * e.g. `fullname: '.person.fullName()'`
     *
     * or `UserModel: {firstName: 'person.firstName('female')', lastName: 'person.lastName('male')'}`
     *
     * This will be executed only if `fakerGenerators.generate` doesn't return any results
     */
    pathBased?: MockFakerJSGeneratorGeneratePathBased;

    /**
     * Mapping of FakerJS method to use based on current item params `type`,
     *
     * e.g. `number: '.number.int()'`
     *
     * or `[type]-[format]`, e.g. `'number-int32': '.number.int()'`
     *
     * This will be executed only if `fakerGenerators.pathBased` doesn't return any results
     */
    typeBased?: MockFakerJSGeneratorGenerateTypeBased;
  };

  fakerParamsGenerators?: {
    /**
     * Function which receives all available settings and should return FakerJS params  to use as a `string`.
     *
     * e.g.
     *
     * `'{ length: { min: 5, max: 10 } }'`
     *
     * This method has highest priority!
     */
    generate?: MockFakerJSGeneratorGenerateParamsFn;

    /**
     * Mapping of FakerJS method params to use based on current item path
     *
     * e.g. `fullname: '{ gender: "male" }'`
     *
     * or `UserModel: {firstName: '{ gender: "male" }', lastName: '{gender: "female"}'}`
     *
     * This will be executed only if `fakerParamsGenerators.generate` doesn't return any results
     */
    pathBased?: MockFakerJSGeneratorGenerateParamsPathBased;

    /**
     * Mapping of FakerJS method params to use based on current item params `type`,
     *
     * e.g. `number: '{ min: 0, max: 10 }'`
     *
     * or `[type]-[format]`, e.g. `'number-int32': '{min: 0, max: 10}'`
     *
     * This will be executed only if `fakerParamsGenerators.pathBased` doesn't return any results
     */
    typeBased?: MockFakerJSGeneratorGenerateParamsTypeBased;
  };
}

export type MockFakerJsGeneratorName = typeof mockFakerJsGeneratorName;

export type MockFakerJsGeneratorConfig = Omit<MockFakerJsGenerator, 'name'>;
