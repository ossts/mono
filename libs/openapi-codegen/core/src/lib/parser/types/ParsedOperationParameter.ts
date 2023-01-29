import type { LiteralUnion } from 'type-fest';

import type { ParsedModel } from './';

export type ParsedOperationParameterInArray =
  | 'path'
  | 'query'
  | 'header'
  | 'formData'
  | 'cookie';

export type ParsedOperationParameterInObject = 'body';

export type ParsedOperationParameterIn =
  | ParsedOperationParameterInArray
  | ParsedOperationParameterInObject;

export interface ParsedOperationParameter extends ParsedModel {
  in: LiteralUnion<ParsedOperationParameterIn, string>;
  prop: string;
  mediaType: string | null;
}
