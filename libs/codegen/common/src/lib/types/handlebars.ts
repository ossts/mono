import type Handlebars from 'handlebars/runtime';

import type { AbstractGeneratorSettings } from './generator';

export type CodegenHandlebarsHelperWrapperParams = {
  handlebarsInstance: typeof Handlebars;
  settings: AbstractGeneratorSettings;
};

export type CodegenHandlebarsHelperWrapper<TParams extends object = object> = (
  params: CodegenHandlebarsHelperWrapperParams & TParams
) => Handlebars.HelperDelegate;
