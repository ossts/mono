import type { ParsedOperationOpenAPIV3 } from '.';

export interface ParsedServiceOpenAPIV3 {
  name: string;
  operations: ParsedOperationOpenAPIV3[];
  imports: string[];
}
