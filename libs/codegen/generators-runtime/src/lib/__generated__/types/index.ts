import type { CommonEndpointsGenerator } from '@ossts/codegen/generators/common/endpoints';
import type { CommonModelsGenerator } from '@ossts/codegen/generators/common/models';
import type { MockFakerJsGenerator } from '@ossts/codegen/generators/mock/faker-js';
import type { SchemaZodGenerator } from '@ossts/codegen/generators/schema/zod';
import type { UtilsGenerator } from '@ossts/codegen/generators/utils';

export type GeneratorsBuiltIn =
  | CommonEndpointsGenerator
  | CommonModelsGenerator
  | SchemaZodGenerator
  | UtilsGenerator
  | MockFakerJsGenerator;
