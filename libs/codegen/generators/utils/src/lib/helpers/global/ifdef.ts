import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';

export const ifdef: CodegenHandlebarsHelperWrapper = () =>
  function (this: unknown, ...args: unknown[]): string {
    const options = args.pop() as Handlebars.HelperOptions;

    if (!args.every((value) => !value)) {
      return options.fn(this);
    }

    return options.inverse(this);
  };
