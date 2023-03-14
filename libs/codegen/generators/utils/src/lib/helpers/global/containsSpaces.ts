import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';

export const containsSpaces: CodegenHandlebarsHelperWrapper = () =>
  function (
    this: unknown,
    value: string,
    options: Handlebars.HelperOptions
  ): string {
    return /\s+/.test(value) ? options.fn(this) : options.inverse(this);
  };
