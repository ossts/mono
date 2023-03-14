import type { GeneratorHelpersExportType } from '@ossts/codegen/common';
import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';

// import * as localHelpers from './local';
import * as globalHelpers from './global';

export const helpers: Record<GeneratorHelpersExportType, DictionaryWithAny> = {
  localHelpers: {},
  globalHelpers,
};
