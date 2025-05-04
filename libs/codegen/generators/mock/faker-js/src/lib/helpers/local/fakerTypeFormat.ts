import type Handlebars from 'handlebars/runtime';
import { isPlainObject } from 'lodash';

import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';
import type { ParsedModelOpenAPIV3 } from '@ossts/codegen/parsers/openapi/v3';
import type { Dictionary } from '@ossts/shared/typescript/helper-types';

import type {
  MockFakerJSGeneratorGenerateFn,
  MockFakerJSGeneratorGenerateFnParams,
  MockFakerJSGeneratorGenerateParamsFn,
  MockFakerJSGeneratorGenerateParamsFnParams,
  MockFakerJSGeneratorGenerateParamsPathBased,
  MockFakerJSGeneratorGeneratePathBased,
  MockFakerJsGeneratorSettings,
} from '../../types';

export const fakerTypeFormat: CodegenHandlebarsHelperWrapper<
  MockFakerJsGeneratorSettings
> = ({ handlebarsInstance, settings: generatorSettings }) =>
  function (this: ParsedModelOpenAPIV3, options: Handlebars.HelperOptions) {
    const fullPathHelper: Handlebars.HelperDelegate =
      handlebarsInstance.helpers['utilsFullPath'];

    // here we transform value to lower case to make it match more formats
    // passed values are already transform to lower case during initialization
    const fullPath = fullPathHelper
      .call(this, options)
      .map((item: string) => item.toLowerCase());

    const paramsGeneratorFnParams: MockFakerJSGeneratorGenerateParamsFnParams =
      {
        root: options.data.root.data,
        fullPath,
        generatorSettings,
        handlebarsHelperOptions: options,
        handlebarsInstance,
      };

    /**
     * ------- Resolve params for type -------
     */
    let params = generatorSettings.fakerParamsGenerators?.generate?.(
      this,
      paramsGeneratorFnParams,
    );

    if (typeof params !== 'string') {
      params = getParamsPathBased(this, paramsGeneratorFnParams);
    }

    if (typeof params !== 'string') {
      params = getParamsTypeBased(this, paramsGeneratorFnParams);
    }

    // don't pass undefined, it will make params in faker methods
    // contain word "undefined" instead of empty value
    params = params ?? '';

    /**
     * ------- Resolve type -------
     */
    const resultGeneratorFnParams: MockFakerJSGeneratorGenerateFnParams = {
      ...paramsGeneratorFnParams,
      params,
    };

    let result = generatorSettings.fakerGenerators?.generate?.(
      this,
      resultGeneratorFnParams,
    );
    if (typeof result !== 'string') {
      result = formatPathBased(this, resultGeneratorFnParams);
    }
    if (typeof result !== 'string') {
      result = formatTypeBased(this, resultGeneratorFnParams);
    }

    /**
     * This is required to make sure that if user didn't provide any settings for
     * specific type at least some default value is generated.
     *
     * Don't move this logic into generator defaults
     * because there it can be overriden by user settings
     */
    if (typeof result !== 'string') {
      result = formatDefaultBasedOnType(this, params);
    }

    return result?.replace('$$params$$', params);
  };

const getParamsPathBased = (
  type: ParsedModelOpenAPIV3,
  resultGeneratorFnParams: MockFakerJSGeneratorGenerateParamsFnParams,
): string | undefined => {
  const { fullPath } = resultGeneratorFnParams;
  const pathBased =
    resultGeneratorFnParams.generatorSettings.fakerParamsGenerators?.pathBased;

  if (!fullPath.length || !pathBased) return;

  let finalOrIntermediateResult:
    | string
    | MockFakerJSGeneratorGenerateParamsFn
    | undefined = undefined;

  const valueByPath = fullPath.reduce<
    MockFakerJSGeneratorGenerateParamsPathBased[string]
  >((acc, val) => {
    // stop if we already found value
    if (
      acc === undefined ||
      typeof acc === 'string' ||
      typeof acc === 'function'
    )
      return acc;

    return acc[val] ?? acc;
  }, pathBased);

  if (!valueByPath || isPlainObject(valueByPath))
    return finalOrIntermediateResult;

  if (typeof valueByPath === 'string') {
    finalOrIntermediateResult = valueByPath;
  } else if (typeof valueByPath === 'function') {
    finalOrIntermediateResult =
      valueByPath(type, resultGeneratorFnParams) ?? undefined;
  }

  return finalOrIntermediateResult;
};

const getParamsTypeBased = (
  type: ParsedModelOpenAPIV3,
  resultGeneratorFnParams: MockFakerJSGeneratorGenerateParamsFnParams,
): string | undefined => {
  let finalOrIntermediateResult:
    | string
    | MockFakerJSGeneratorGenerateParamsFn
    | undefined = undefined;

  const typeBased = resultGeneratorFnParams.generatorSettings
    .fakerParamsGenerators?.typeBased as
    | Dictionary<string | MockFakerJSGeneratorGenerateParamsFn | undefined>
    | undefined;

  // More generic version should be checked first
  if (type.format) {
    finalOrIntermediateResult = typeBased?.[`${type.type}-${type.format}`];
  }

  if (!finalOrIntermediateResult) {
    finalOrIntermediateResult = typeBased?.[type.type];
  }

  if (typeof finalOrIntermediateResult === 'function') {
    finalOrIntermediateResult =
      finalOrIntermediateResult(type, resultGeneratorFnParams) ?? undefined;
  }

  return finalOrIntermediateResult;
};

const formatPathBased = (
  type: ParsedModelOpenAPIV3,
  resultGeneratorFnParams: MockFakerJSGeneratorGenerateFnParams,
): string | undefined => {
  const { fullPath } = resultGeneratorFnParams;
  const pathBased =
    resultGeneratorFnParams.generatorSettings.fakerGenerators?.pathBased;

  if (!fullPath.length || !pathBased) return;

  let finalOrIntermediateResult:
    | string
    | MockFakerJSGeneratorGenerateFn
    | undefined = undefined;

  const valueByPath = fullPath.reduce<
    MockFakerJSGeneratorGeneratePathBased[string]
  >((acc, val) => {
    // stop if we already found value
    if (
      acc === undefined ||
      typeof acc === 'string' ||
      typeof acc === 'function'
    )
      return acc;

    return acc[val] ?? acc;
  }, pathBased);

  if (!valueByPath || isPlainObject(valueByPath))
    return finalOrIntermediateResult;

  if (typeof valueByPath === 'string') {
    finalOrIntermediateResult = valueByPath;
  } else if (typeof valueByPath === 'function') {
    finalOrIntermediateResult =
      valueByPath(type, resultGeneratorFnParams) ?? undefined;
  }

  return finalOrIntermediateResult;
};

const formatTypeBased = (
  type: ParsedModelOpenAPIV3,
  resultGeneratorFnParams: MockFakerJSGeneratorGenerateFnParams,
): string | undefined => {
  let finalOrIntermediateResult:
    | string
    | MockFakerJSGeneratorGenerateFn
    | undefined = undefined;

  const typeBased = resultGeneratorFnParams.generatorSettings.fakerGenerators
    ?.typeBased as
    | Dictionary<string | MockFakerJSGeneratorGenerateFn | undefined>
    | undefined;

  // More generic version should be checked first
  if (type.format) {
    finalOrIntermediateResult = typeBased?.[`${type.type}-${type.format}`];
  }

  if (!finalOrIntermediateResult) {
    finalOrIntermediateResult = typeBased?.[type.type];
  }

  if (typeof finalOrIntermediateResult === 'function') {
    finalOrIntermediateResult =
      finalOrIntermediateResult(type, resultGeneratorFnParams) ?? undefined;
  }

  return finalOrIntermediateResult;
};

const formatDefaultBasedOnType = (
  type: ParsedModelOpenAPIV3,
  params: string,
): string => {
  // this is required to make sure that default strings have decent length
  const string = `.string.alpha(${
    params ? '$$params$$' : '{length: { min: 2, max: 10 }}'
  })`;

  switch (type.type) {
    case 'any':
    case 'string': {
      switch (type.format) {
        case 'date':
        case 'date-time':
          return '.date.anytime($$params$$).toISOString()';
      }
      return string;
    }
    case 'binary':
      return '.number.binary($$params$$)';
    case 'boolean':
      return '.datatype.boolean($$params$$)';
    case 'number':
      return '.number.int($$params$$)';
  }

  return string;
};
