import type Handlebars from 'handlebars/runtime';

import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';
import type { ParsedModelOpenAPIV3 } from '@ossts/codegen/parsers/openapi/v3';

export const fakerUnion: CodegenHandlebarsHelperWrapper = ({
  handlebarsInstance,
  settings,
}) =>
  function (
    this: ParsedModelOpenAPIV3,
    properties: ParsedModelOpenAPIV3[],
    options: Handlebars.HelperOptions,
  ) {
    const type = handlebarsInstance.partials['fakerType'];

    const types = properties.map((property) =>
      type(
        {
          ...property,
          hasWrapperType: true,
          parentName: this.refToParent?.name,
          settings,
        },
        options,
      ).trim(),
    );
    const uniqueTypes = [...new Set(types)];

    const uniqueTypesString = `faker.helpers.arrayElement([
      ${uniqueTypes
        .map((item) =>
          item.startsWith('{')
            ? item
            : item.startsWith('.')
              ? `faker${item}`
              : item,
        )
        .join(', ')}
    ])`;

    return options.fn(uniqueTypesString);
  };
