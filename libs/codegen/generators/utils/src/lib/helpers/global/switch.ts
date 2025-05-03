import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';
import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';

export const switchFn: CodegenHandlebarsHelperWrapper = () =>
  function (this: DictionaryWithAny, ...args: unknown[]) {
    const options = args.pop() as Handlebars.HelperOptions;
    const [value] = args;

    this['switch_value'] = value;
    this['switch_break'] = false;

    return options.fn(this);
  };
