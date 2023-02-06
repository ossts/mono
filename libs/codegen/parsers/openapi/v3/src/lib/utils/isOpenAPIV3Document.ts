import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';

import type { OpenAPIV3Document } from '../types';

export const isOpenAPIV3Document = (
  openApi: DictionaryWithAny
): openApi is OpenAPIV3Document => parseInt(openApi['version'], 10) === 3;
