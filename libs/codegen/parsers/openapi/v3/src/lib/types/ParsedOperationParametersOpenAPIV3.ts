import type {
  ParsedOperationParameterInArrayOpenAPIV3,
  ParsedOperationParameterInObjectOpenAPIV3,
  ParsedOperationParameterOpenAPIV3,
} from '.';

export type ParsedOperationParametersOpenAPIV3 = {
  imports: string[];
} & {
  [key in `parameters${Capitalize<
    ParsedOperationParameterInArrayOpenAPIV3 | ''
  >}`]: ParsedOperationParameterOpenAPIV3[];
} & {
  [key in `parameters${Capitalize<ParsedOperationParameterInObjectOpenAPIV3>}`]: ParsedOperationParameterOpenAPIV3 | null;
};
