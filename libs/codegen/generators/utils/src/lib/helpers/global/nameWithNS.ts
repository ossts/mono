import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';

export const nameWithNS: CodegenHandlebarsHelperWrapper = ({
  settings: { globalNS },
}) =>
  function (
    this: unknown,
    name: string,
    options: Handlebars.HelperOptions
  ): string {
    const nameWithoutSchema = name.replace(/Schema/g, '');

    return `${nameWithoutSchema}${globalNS}`;
  };
