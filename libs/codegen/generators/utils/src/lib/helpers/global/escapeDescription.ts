import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';

export const escapeDescription: CodegenHandlebarsHelperWrapper = () =>
  function (value: string): string {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\${/g, '\\${');
  };
