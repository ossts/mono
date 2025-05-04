import type {
  AbstractGeneratorSettings,
  CodegenHandlebarsHelperWrapper,
} from '@ossts/codegen/common';
import type { ParsedModelOpenAPIV3 } from '@ossts/codegen/parsers/openapi/v3';

/**
 * Sets "property" to specific "value" on root
 */
export const setRootProperty: CodegenHandlebarsHelperWrapper<
  AbstractGeneratorSettings
> = () =>
  function (
    this: ParsedModelOpenAPIV3,
    property: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    options: Handlebars.HelperOptions,
  ): void {
    const { data: { root } = {} } = options;

    if (root) {
      root[property] = value;
    }
  };
