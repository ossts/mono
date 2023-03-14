import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';

export * from './knownGlobalHelpers';

export const generatorImportPaths: Record<
  string,
  () => Promise<DictionaryWithAny>
> = {
  'common/endpoints': () =>
    import('@ossts/codegen/generators/common/endpoints'),
  'common/models': () => import('@ossts/codegen/generators/common/models'),
  utils: () => import('@ossts/codegen/generators/utils'),
};
