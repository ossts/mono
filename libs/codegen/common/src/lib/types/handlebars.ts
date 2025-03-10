import type Handlebars from 'handlebars/runtime';

import type { AbstractGeneratorSettings } from './generator';

export type CodegenHandlebarsHelperWrapperParams<
  TSettings extends AbstractGeneratorSettings = AbstractGeneratorSettings
> = {
  handlebarsInstance: typeof Handlebars;
  settings: TSettings;
};

export type CodegenHandlebarsHelperWrapper<
  TSettings extends AbstractGeneratorSettings = AbstractGeneratorSettings,
  TParams extends object = object
> = (
  params: CodegenHandlebarsHelperWrapperParams<TSettings> & TParams
) => Handlebars.HelperDelegate;
