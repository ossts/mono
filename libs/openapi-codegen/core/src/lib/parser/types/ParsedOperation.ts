import type {
  ParsedOperationError,
  ParsedOperationParameters,
  ParsedOperationResponse,
} from './';

export interface ParsedOperation extends ParsedOperationParameters {
  service: string;
  name: string;
  summary: string | null;
  description: string | null;
  deprecated: boolean;
  method: string;
  path: string;
  errors: ParsedOperationError[];
  results: ParsedOperationResponse[];
  responseHeader: string | null;
}
