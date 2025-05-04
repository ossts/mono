import type { OpenAPIV3 } from 'openapi-types';

import { getOperationResponse, getOperationResponseCode, getRef } from '.';
import type {
  OpenAPIV3Document,
  OpenAPIV3ResponseWithRef,
  ParsedOperationResponseOpenAPIV3,
} from '../types';

export const getOperationResponses = (
  openApi: OpenAPIV3Document,
  responses: OpenAPIV3.ResponsesObject,
): ParsedOperationResponseOpenAPIV3[] => {
  const operationResponses: ParsedOperationResponseOpenAPIV3[] = [];

  // Iterate over each response code and get the
  // status code and response message (if any).
  Object.entries(responses).forEach(([code, responseOrRef]) => {
    const response = getRef<OpenAPIV3ResponseWithRef>(openApi, responseOrRef);
    const responseCode = getOperationResponseCode(code);

    if (responseCode) {
      const operationResponse = getOperationResponse(
        openApi,
        response,
        responseCode,
      );
      operationResponses.push(operationResponse);
    }
  });

  // Sort the responses to 2XX success codes come before 4XX and 5XX error codes.
  return operationResponses.sort((a, b): number => {
    return a.code < b.code ? -1 : a.code > b.code ? 1 : 0;
  });
};
