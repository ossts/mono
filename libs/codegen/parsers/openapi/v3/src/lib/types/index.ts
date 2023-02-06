import type { OpenAPIV3 } from 'openapi-types';

import type { WithEnumExtensionOpenAPIV3 } from './extensions';

export * from './ParsedClientOpenAPIV3';
export * from './ParsedEnumOpenAPIV3';
export * from './ParsedModelOpenAPIV3';
export * from './ParsedModelCompositionOpenAPIV3';
export * from './ParsedOperationOpenAPIV3';
export * from './ParsedOperationErrorOpenAPIV3';
export * from './ParsedOperationParameterOpenAPIV3';
export * from './ParsedOperationParametersOpenAPIV3';
export * from './ParsedOperationResponseOpenAPIV3';
export * from './ParsedSchemaOpenAPIV3';
export * from './ParsedServiceOpenAPIV3';
export * from './ParsedTypeOpenAPIV3';

export * from './extensions';

export type OpenAPIV3SchemaWithEnumExtension = OpenAPIV3.SchemaObject &
  WithEnumExtensionOpenAPIV3;
export type OpenAPIV3SchemaWithRef =
  | OpenAPIV3SchemaWithEnumExtension
  | OpenAPIV3.ReferenceObject;
export type OpenAPIV3RequestBodyWithRef =
  | OpenAPIV3.RequestBodyObject
  | OpenAPIV3.ReferenceObject;
export type OpenAPIV3ResponseWithRef =
  | OpenAPIV3.ResponseObject
  | OpenAPIV3.ReferenceObject;
export type OpenAPIV3ParameterWithRef =
  | OpenAPIV3.ParameterObject
  | OpenAPIV3.ReferenceObject;

export type OpenAPIV3Document = OpenAPIV3.Document;
