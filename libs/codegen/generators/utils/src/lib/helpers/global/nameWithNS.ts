import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';

export const nameWithNS: CodegenHandlebarsHelperWrapper = ({
  settings: { globalNS },
}) =>
  function (
    this: unknown,
    name: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ): string {
    const options: Handlebars.HelperOptions = args.pop();
    const nameWithoutSchema = name.replace(/Schema/g, '');

    const suffix = options.data?.root?.rootNameSuffix ?? '';

    return `${nameWithoutSchema}${suffix}${globalNS}`;
  };
