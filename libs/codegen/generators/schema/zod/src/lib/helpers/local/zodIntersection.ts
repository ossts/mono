import type Handlebars from 'handlebars/runtime';

import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';
import type { ParsedModelOpenAPIV3 } from '@ossts/codegen/parsers/openapi/v3';

export const zodIntersection: CodegenHandlebarsHelperWrapper = ({
  handlebarsInstance,
  settings,
}) =>
  function (
    this: unknown,
    properties: ParsedModelOpenAPIV3[],
    parentName: string | undefined,
    options: Handlebars.HelperOptions,
  ) {
    const type = handlebarsInstance.partials['zodType'];
    const types = properties.map((property) =>
      type(
        {
          ...property,
          hasWrapperType: true,
          parentName,
          settings,
        },
        options,
      ),
    );

    const uniqueTypes = [...new Set(types)];
    let uniqueTypesString = uniqueTypes
      .map((item) =>
        item.startsWith('{') ? item : item.startsWith('.') ? `z${item}` : item,
      )
      .join(', ');
    if (uniqueTypes.length > 1) {
      uniqueTypesString = `z.intersection([${uniqueTypesString}])`;
    }
    return options.fn(uniqueTypesString);
  };
