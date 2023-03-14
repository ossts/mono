import { EOL } from 'node:os';

import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';

export const escapeComment: CodegenHandlebarsHelperWrapper = () =>
  function (value: string): string {
    return value
      .replace(/\*\//g, '*')
      .replace(/\/\*/g, '*')
      .replace(/\r?\n(.*)/g, (_, w) => `${EOL} * ${w.trim()}`);
  };
