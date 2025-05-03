import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';

export const hasLength: CodegenHandlebarsHelperWrapper = () =>
  function (
    this: unknown,
    value: null | unknown[],
    options: Handlebars.HelperOptions
  ): string {
    return value?.length ? options.fn(this) : options.inverse(this);
  };
