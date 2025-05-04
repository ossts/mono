import type Handlebars from 'handlebars/runtime';

import type {
  AbstractGeneratorSettings,
  CodegenHandlebarsHelperWrapper,
} from '@ossts/codegen/common';
import type { ParsedModelOpenAPIV3 } from '@ossts/codegen/parsers/openapi/v3';

import type { CommonModelsGeneratorSettings } from '../../types';
import { entityToPrimaryKeyNameMapping } from './entityToPrimaryKeyNameMapping';

export const entityHasPrimaryKey: CodegenHandlebarsHelperWrapper<
  CommonModelsGeneratorSettings
> = ({ handlebarsInstance }) =>
  function (
    this: ParsedModelOpenAPIV3,
    allSettings: Map<string, AbstractGeneratorSettings>,
    options: Handlebars.HelperOptions,
  ) {
    const modelsGeneratorSettings = allSettings.get('common/models');

    if (!modelsGeneratorSettings) {
      throw new Error(`Unable to get settings for models generator`);
    }

    const entityToPrimaryKeyNameMappingHelper: Handlebars.HelperDelegate =
      entityToPrimaryKeyNameMapping({
        handlebarsInstance,
        settings: modelsGeneratorSettings,
      });

    const primaryKey = entityToPrimaryKeyNameMappingHelper.call(this, options);

    return primaryKey ? options.fn(this) : options.inverse(this);
  };
