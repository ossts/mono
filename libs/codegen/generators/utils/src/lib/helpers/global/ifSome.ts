import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';

export const ifSome: CodegenHandlebarsHelperWrapper = () =>
  function (this: unknown, ...args: unknown[]): string {
    const options = args.pop() as Handlebars.HelperOptions;

    if (args.some((value) => !!value)) {
      return options.fn(this);
    }

    return options.inverse(this);
  };
