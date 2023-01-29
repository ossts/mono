import type {
  ParsedOperationParameter,
  ParsedOperationParameterInArray,
  ParsedOperationParameterInObject,
} from './';

export type ParsedOperationParameters = {
  imports: string[];
} & {
  [key in `parameters${Capitalize<
    ParsedOperationParameterInArray | ''
  >}`]: ParsedOperationParameter[];
} & {
  [key in `parameters${Capitalize<ParsedOperationParameterInObject>}`]: ParsedOperationParameter | null;
};
