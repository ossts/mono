import { mergeObjectsWithSameShape } from '@ossts/shared/typescript/helpers';

import type { AbstractExternalGeneratorWithName } from './AbstractExternalGenerator';
import {
  AbstractExternalGenerator,
  type AbstractExternalGeneratorSettings,
} from './AbstractExternalGenerator';

/* eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type */
export interface DefaultExternalGeneratorSettings
  extends AbstractExternalGeneratorSettings {}

export type DefaultExternalGeneratorConfig = Omit<
  DefaultExternalGenerator,
  'name'
>;

export class DefaultExternalGenerator
  extends AbstractExternalGenerator
  implements AbstractExternalGeneratorWithName
{
  name = 'abstract-external-generator';

  constructor(config?: DefaultExternalGeneratorConfig) {
    super();

    mergeObjectsWithSameShape(
      this,
      {
        generatorPath: '',
      },
      config,
    );
  }

  declare settings?: DefaultExternalGeneratorSettings;
}
