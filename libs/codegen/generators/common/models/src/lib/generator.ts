import type { AbstractGeneratorWithName } from '@ossts/codegen/common';
import { AbstractGenerator } from '@ossts/codegen/common';
import { mergeObjectsWithSameShape } from '@ossts/shared/typescript/helpers';

import type {
  CommonModelsGeneratorConfig,
  CommonModelsGeneratorSettings,
} from './types';

export const commonModelsGeneratorName = 'common/models' as const;

export class CommonModelsGenerator
  extends AbstractGenerator
  implements AbstractGeneratorWithName
{
  name = commonModelsGeneratorName;

  constructor(config?: CommonModelsGeneratorConfig) {
    super();

    mergeObjectsWithSameShape(this, {}, config);
  }

  override settings?: CommonModelsGeneratorSettings;
}

export const commonModelsDefaultConfig = new CommonModelsGenerator();
