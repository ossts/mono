import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';

export const includes: CodegenHandlebarsHelperWrapper = () =>
  function (
    this: unknown,
    value: string | undefined,
    b: string,
    options: Handlebars.HelperOptions,
  ): string {
    return value?.includes(b) ? options.fn(this) : options.inverse(this);
  };
