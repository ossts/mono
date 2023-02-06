import type { OpenAPIV3 } from 'openapi-types';

import type { AbstractCodegenParsedClient } from '@ossts/codegen/common';

import type { ParsedModelOpenAPIV3, ParsedServiceOpenAPIV3 } from '.';

export type ParsedClientServer = Omit<OpenAPIV3.ServerObject, 'variables'>;

export interface ParsedClientOpenAPIV3 extends AbstractCodegenParsedClient {
  servers?: ParsedClientServer[];
  models: ParsedModelOpenAPIV3[];
  services: ParsedServiceOpenAPIV3[];
}
