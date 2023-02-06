import type {
  ParsedOperationErrorOpenAPIV3,
  ParsedOperationParametersOpenAPIV3,
  ParsedOperationResponseOpenAPIV3,
} from '.';

export interface ParsedOperationOpenAPIV3
  extends ParsedOperationParametersOpenAPIV3 {
  service: string;
  name: string;
  summary: string | null;
  description: string | null;
  deprecated: boolean;
  method: string;
  path: string;
  errors: ParsedOperationErrorOpenAPIV3[];
  results: ParsedOperationResponseOpenAPIV3[];
  responseHeader: string | null;
}
