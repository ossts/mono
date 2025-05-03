import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';
import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';

export const ifList: CodegenHandlebarsHelperWrapper = () =>
  function (this: DictionaryWithAny, ...args: unknown[]): string {
    const options = args.pop() as Handlebars.HelperOptions;

    const val: DictionaryWithAny = args[0] ?? this;

    if (
      val['results'][0].export === 'array' &&
      // checking for imports should eliminate generic values and inline interfaces
      // which current implementation doesn't support anyway
      val['results'][0].imports.length
    ) {
      return options.fn(this);
    }

    return options.inverse(this);
  };
