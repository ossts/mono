import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';
import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';

export const extractIdParamFromPath: CodegenHandlebarsHelperWrapper = () =>
  function (this: DictionaryWithAny, path: string): string {
    return [...path.matchAll(/:(\w+)?/g)].at(-1)?.[1] ?? '';
  };
