import { OpenAPIV3 } from 'openapi-types';

const httpMethods = Object.values(OpenAPIV3.HttpMethods) as string[];

export const isOperation = (
  key: unknown,
  operation: unknown
): operation is OpenAPIV3.OperationObject =>
  httpMethods.includes(key as string);
