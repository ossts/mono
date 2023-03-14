import type { AbstractGeneratorWithName } from '@ossts/codegen/common';
import { AbstractGenerator } from '@ossts/codegen/common';
import { mergeObjectsWithSameShape } from '@ossts/shared/typescript/helpers';

import type { UtilsGeneratorConfig, UtilsGeneratorSettings } from './types';

export const utilsGeneratorName = 'utils' as const;

export class UtilsGenerator
  extends AbstractGenerator
  implements AbstractGeneratorWithName
{
  name = utilsGeneratorName;

  constructor(config?: UtilsGeneratorConfig) {
    super();

    mergeObjectsWithSameShape(this, {}, config);
  }

  override settings?: UtilsGeneratorSettings;
}
