import type { AbstractGeneratorSettings } from '@ossts/codegen/common';

import type {
  CommonModelsGenerator,
  commonModelsGeneratorName,
} from '../generator';

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface CommonModelsGeneratorSettings
  extends AbstractGeneratorSettings {
  modelOnlySetting?: boolean;
}

export type CommonModelsGeneratorName = typeof commonModelsGeneratorName;

export type CommonModelsGeneratorConfig = Omit<CommonModelsGenerator, 'name'>;
