import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';

export const startsWith: CodegenHandlebarsHelperWrapper = () =>
  function (
    this: unknown,
    value: string,
    b: string,
    options: Handlebars.HelperOptions,
  ): string {
    return value.startsWith(b) ? options.fn(this) : options.inverse(this);
  };
