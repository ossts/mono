import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';

export const notEquals: CodegenHandlebarsHelperWrapper = () =>
  function (
    this: unknown,
    a: string,
    b: string,
    options: Handlebars.HelperOptions
  ): string {
    return a !== b ? options.fn(this) : options.inverse(this);
  };
