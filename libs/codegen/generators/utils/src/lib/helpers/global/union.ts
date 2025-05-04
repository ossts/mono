import type Handlebars from 'handlebars/runtime';

import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';
import type { ParsedModelOpenAPIV3 } from '@ossts/codegen/parsers/openapi/v3';

export const union: CodegenHandlebarsHelperWrapper = ({
  handlebarsInstance,
  settings,
}) =>
  function (
    this: unknown,
    properties: ParsedModelOpenAPIV3[],
    parent: string | undefined,
    options: Handlebars.HelperOptions,
  ) {
    const type = handlebarsInstance.partials['utilsType'];
    const types = properties.map((property) =>
      type(
        {
          ...property,
          parent,
          settings,
        },
        options,
      ),
    );
    const uniqueTypes = [...new Set(types)];
    let uniqueTypesString = uniqueTypes.join(' | ');
    if (uniqueTypes.length > 1) {
      uniqueTypesString = `(${uniqueTypesString})`;
    }
    return options.fn(uniqueTypesString);
  };
