import type { OpenAPIV3 } from 'openapi-types';

import type {
  OpenAPIDocument,
  OpenAPIResponse,
  ParsedOperationResponse,
} from '../types';
import { getOperationResponse, getOperationResponseCode, getRef } from './';

export const getOperationResponses = (
  openApi: OpenAPIDocument,
  responses: OpenAPIV3.ResponsesObject
): ParsedOperationResponse[] => {
  const operationResponses: ParsedOperationResponse[] = [];

  // Iterate over each response code and get the
  // status code and response message (if any).
  Object.entries(responses).forEach(([code, responseOrRef]) => {
    const response = getRef<OpenAPIResponse>(openApi, responseOrRef);
    const responseCode = getOperationResponseCode(code);

    if (responseCode) {
      const operationResponse = getOperationResponse(
        openApi,
        response,
        responseCode
      );
      operationResponses.push(operationResponse);
    }
  });

  // Sort the responses to 2XX success codes come before 4XX and 5XX error codes.
  return operationResponses.sort((a, b): number => {
    return a.code < b.code ? -1 : a.code > b.code ? 1 : 0;
  });
};
