import type { CommonEndpointsGenerator } from '@ossts/codegen/generators/common/endpoints';
import type { CommonModelsGenerator } from '@ossts/codegen/generators/common/models';

import type { generatorNames } from '../data';

export type BuiltInGenerators =
  | CommonEndpointsGenerator
  | CommonModelsGenerator;

export type GeneratorNameBuiltIn = (typeof generatorNames)[number];
