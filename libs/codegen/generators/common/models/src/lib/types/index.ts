import type { AbstractGeneratorSettings } from '@ossts/codegen/common';
import type { Dictionary } from '@ossts/shared/typescript/helper-types';

import type {
  CommonModelsGenerator,
  commonModelsGeneratorName,
} from '../generator';

/* eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type */
export interface CommonModelsGeneratorSettings
  extends AbstractGeneratorSettings {
  modelOnlySetting?: boolean;

  /**
   * Default to `id`
   */
  primaryKeyName?: string;

  entityToPrimaryKeyNameMapping?: Dictionary<string>;
}

export type CommonModelsGeneratorName = typeof commonModelsGeneratorName;

export type CommonModelsGeneratorConfig = Omit<CommonModelsGenerator, 'name'>;
