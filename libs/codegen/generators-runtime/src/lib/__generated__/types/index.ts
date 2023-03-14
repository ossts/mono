import type { CommonEndpointsGenerator } from '@ossts/codegen/generators/common/endpoints';
import type { CommonModelsGenerator } from '@ossts/codegen/generators/common/models';
import type { UtilsGenerator } from '@ossts/codegen/generators/utils';

export type GeneratorsBuiltIn =
  | CommonEndpointsGenerator
  | CommonModelsGenerator
  | UtilsGenerator;
