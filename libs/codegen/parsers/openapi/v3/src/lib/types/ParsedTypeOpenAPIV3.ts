export interface ParsedTypeOpenAPIV3 {
  type: string;
  base: string;
  template: string | null;
  imports: string[];
  nullable: boolean;
}
