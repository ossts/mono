import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';

export const isPrimitive: CodegenHandlebarsHelperWrapper = () =>
  function (
    this: unknown,
    a: string,
    options: Handlebars.HelperOptions,
  ): string {
    return ['number', 'boolean', 'string', 'binary'].includes(a)
      ? options.fn(this)
      : options.inverse(this);
  };
