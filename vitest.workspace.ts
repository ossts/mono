import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  './libs/codegen/main/vite.config.ts',
  './libs/codegen/core/vite.config.ts',
  './libs/codegen/common/vite.config.ts',
  './libs/codegen/generators-runtime/vite.config.ts',
  './libs/codegen/generators/utils/vite.config.ts',
  './libs/shared/typescript/helpers/vite.config.ts',
  './libs/shared/typescript/helper-types/vite.config.ts',
  './libs/codegen/generators/common/models/vite.config.ts',
  './libs/codegen/generators/common/endpoints/vite.config.ts',
  './libs/codegen/generators/mock/msw/vite.config.ts',
  './libs/codegen/generators/schema/zod/vite.config.ts',
  './libs/codegen/parsers/openapi/v3/vite.config.ts',
  './libs/codegen/parsers/graphql/v1/vite.config.ts',
  './libs/codegen/generators/mock/faker-js/vite.config.ts',
]);
