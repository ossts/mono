import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';
import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';

export const ifDetail: CodegenHandlebarsHelperWrapper = () =>
  function (this: DictionaryWithAny, ...args: unknown[]): string {
    const options = args.pop() as Handlebars.HelperOptions;

    const val: DictionaryWithAny = args[0] ?? this;

    if (
      val['parameters']?.find(
        (item: DictionaryWithAny) => item['in'] === 'path'
      )
    ) {
      return options.fn(this);
    }

    return options.inverse(this);
  };
