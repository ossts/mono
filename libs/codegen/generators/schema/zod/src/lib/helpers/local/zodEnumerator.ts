import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';
import type { ParsedEnumOpenAPIV3 } from '@ossts/codegen/parsers/openapi/v3';

export const zodEnumerator: CodegenHandlebarsHelperWrapper = () =>
  function (
    this: unknown,
    enumerators: ParsedEnumOpenAPIV3[],
    parent: string | undefined,
    name: string | undefined,
    useUnionTypes: boolean,
    options: Handlebars.HelperOptions
  ) {
    if (!useUnionTypes && parent && name) {
      return `${parent}.${name}`;
    }

    const enums = enumerators.map((enumerator) => enumerator.value);
    const uniqueEnums = [...new Set(enums)];
    const uniqueEnumsString = `.enum([${uniqueEnums.join(', ')}])`;

    return options.fn(uniqueEnumsString);
  };
