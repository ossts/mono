import type { AbstractGeneratorSettings } from '@ossts/codegen/common';

import type { UtilsGenerator, utilsGeneratorName } from '../generator';

/* eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type */
export interface UtilsGeneratorSettings extends AbstractGeneratorSettings {}

export type UtilsGeneratorName = typeof utilsGeneratorName;

export type UtilsGeneratorConfig = Omit<UtilsGenerator, 'name'>;
