import type { ParsedOperation } from './';

export interface ParsedService {
  name: string;
  operations: ParsedOperation[];
  imports: string[];
}
