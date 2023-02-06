import type { LiteralUnion } from 'type-fest';

import type { ParsedModelOpenAPIV3 } from '.';

export type ParsedOperationParameterInArrayOpenAPIV3 =
  | 'path'
  | 'query'
  | 'header'
  | 'formData'
  | 'cookie';

export type ParsedOperationParameterInObjectOpenAPIV3 = 'body';

export type ParsedOperationParameterInOpenAPIV3 =
  | ParsedOperationParameterInArrayOpenAPIV3
  | ParsedOperationParameterInObjectOpenAPIV3;

export interface ParsedOperationParameterOpenAPIV3
  extends ParsedModelOpenAPIV3 {
  in: LiteralUnion<ParsedOperationParameterInOpenAPIV3, string>;
  prop: string;
  mediaType: string | null;
}
