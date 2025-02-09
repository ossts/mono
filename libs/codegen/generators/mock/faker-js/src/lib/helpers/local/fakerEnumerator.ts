import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';
import type { ParsedEnumOpenAPIV3 } from '@ossts/codegen/parsers/openapi/v3';

export const fakerEnumerator: CodegenHandlebarsHelperWrapper = () =>
  function (
    this: unknown,
    enumerators: ParsedEnumOpenAPIV3[],
    parentName: string | undefined,
    name: string | undefined,
    options: Handlebars.HelperOptions
  ) {
    if (parentName && name) {
      return `faker.helpers.enumValue(${parentName}.${name})`;
    }

    const enums = enumerators.map((enumerator) => enumerator.value);
    const uniqueEnums = [...new Set(enums)].map(
      (item) => `faker.helpers.fake(${item})`
    );
    const uniqueEnumsString = `faker.helpers.arrayElement([${uniqueEnums.join(
      ', '
    )}])`;

    return options.fn(uniqueEnumsString);
  };
