import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';
import type { ParsedEnumOpenAPIV3 } from '@ossts/codegen/parsers/openapi/v3';

export const zodEnumerator: CodegenHandlebarsHelperWrapper = () =>
  function (
    this: unknown,
    enumerators: ParsedEnumOpenAPIV3[],
    parentName: string | undefined,
    name: string | undefined,
    useUnionTypes: boolean,
    options: Handlebars.HelperOptions
  ) {
    if (!useUnionTypes && parentName && name) {
      return `z.nativeEnum(${parentName}.${name})`;
    }

    const enums = enumerators.map((enumerator) => enumerator.value);
    // we use union here to support enums with
    const uniqueEnums = [...new Set(enums)].map((item) => `z.literal(${item})`);
    const uniqueEnumsString = `z.union([${uniqueEnums.join(', ')}])`;

    return options.fn(uniqueEnumsString);
  };
