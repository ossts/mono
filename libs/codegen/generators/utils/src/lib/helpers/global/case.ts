import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';
import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';

export const caseFn: CodegenHandlebarsHelperWrapper = () =>
  function (this: DictionaryWithAny, ...args: unknown[]) {
    const options = args.pop() as Handlebars.HelperOptions;
    const [value, preventBreak = false] = args;

    if (this['switch_break'] === true) return;

    if (value == this['switch_value'] || value == 'default') {
      if (!preventBreak) {
        this['switch_break'] = true;
      }
      return options.fn(this);
    }

    return;
  };
