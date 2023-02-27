import type { CommonEndpointsGenerator } from '@ossts/codegen/generators/common/endpoints';
import type { CommonModelsGenerator } from '@ossts/codegen/generators/common/models';

export type BuiltInGenerators =
  | CommonModelsGenerator
  | CommonEndpointsGenerator;
