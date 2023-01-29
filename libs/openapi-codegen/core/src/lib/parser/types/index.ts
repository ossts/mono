import type { OpenAPIV3 } from 'openapi-types';

import type { WithEnumExtension } from './extensions';

export * from './ParsedClient';
export * from './ParsedEnum';
export * from './ParsedModel';
export * from './ParsedModelComposition';
export * from './ParsedOperation';
export * from './ParsedOperationError';
export * from './ParsedOperationParameter';
export * from './ParsedOperationParameters';
export * from './ParsedOperationResponse';
export * from './ParsedSchema';
export * from './ParsedService';
export * from './ParsedType';

export * from './extensions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Dictionary<T = any> = Record<string, T>;

export type OpenAPISchemaNoRef = OpenAPIV3.SchemaObject & WithEnumExtension;
export type OpenAPISchema = OpenAPISchemaNoRef | OpenAPIV3.ReferenceObject;
export type OpenAPIRequestBody =
  | OpenAPIV3.RequestBodyObject
  | OpenAPIV3.ReferenceObject;
export type OpenAPIResponse =
  | OpenAPIV3.ResponseObject
  | OpenAPIV3.ReferenceObject;
export type OpenAPIParameter =
  | OpenAPIV3.ParameterObject
  | OpenAPIV3.ReferenceObject;

export type OpenAPIDocument = OpenAPIV3.Document;
