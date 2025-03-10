import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';
import type {
  ParsedEnumOpenAPIV3,
  ParsedModelOpenAPIV3,
} from '@ossts/codegen/parsers/openapi/v3';

export const fakerEnumerator: CodegenHandlebarsHelperWrapper = () =>
  function (
    this: ParsedModelOpenAPIV3,
    enumerators: ParsedEnumOpenAPIV3[],
    name: string | undefined,
    options: Handlebars.HelperOptions
  ) {
    if (this.refToParent?.name && name) {
      return `faker.helpers.enumValue(${this.refToParent?.name}.${name})`;
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
