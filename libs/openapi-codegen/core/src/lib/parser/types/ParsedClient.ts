import type { OpenAPIV3 } from 'openapi-types';

import type { ParsedModel, ParsedService } from './';

export type ParsedClientServer = Omit<OpenAPIV3.ServerObject, 'variables'>;

export interface ParsedClient {
  version: string;
  servers?: ParsedClientServer[];
  models: ParsedModel[];
  services: ParsedService[];
}
