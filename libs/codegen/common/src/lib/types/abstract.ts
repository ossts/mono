/**
 * Basic interface for all schemas
 */
export interface AbstractCodegenSchema {
  version: string;
}

/**
 * Basic interface for all OpenAPI schemas
 */
export interface AbstractOpenAPISchema extends AbstractCodegenSchema {
  openapi: string;
}

/**
 * Basic interface for all parsed clients
 */
export interface AbstractCodegenParsedClient {
  version: string;
}
