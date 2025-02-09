import type Handlebars from 'handlebars/runtime';

import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';
import type { ParsedModelOpenAPIV3 } from '@ossts/codegen/parsers/openapi/v3';

export const fakerIntersection: CodegenHandlebarsHelperWrapper = ({
  handlebarsInstance,
  settings,
}) =>
  function (
    this: unknown,
    properties: ParsedModelOpenAPIV3[],
    parentName: string | undefined,
    options: Handlebars.HelperOptions
  ) {
    const type = handlebarsInstance.partials['fakerType'];
    const types = properties.map((property) =>
      type({
        ...property,
        hasWrapperType: true,
        parentName,
        settings,
      })
    );

    const uniqueTypes = [...new Set(types)];

    let uniqueTypesString = uniqueTypes
      .map((item) =>
        item.trim().startsWith('{')
          ? item
          : item.startsWith('.')
          ? `faker${item}`
          : item
      )
      .join(', ...');
    if (uniqueTypes.length > 1) {
      uniqueTypesString = `({
        ...${uniqueTypesString}
      })`;
    }
    return options.fn(uniqueTypesString);
  };
