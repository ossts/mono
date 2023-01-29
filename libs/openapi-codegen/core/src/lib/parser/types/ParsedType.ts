export interface ParsedType {
  type: string;
  base: string;
  template: string | null;
  imports: string[];
  nullable: boolean;
}
