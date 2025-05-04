import type {
  ParsedOperationErrorOpenAPIV3,
  ParsedOperationResponseOpenAPIV3,
} from '../types';

export const getOperationErrors = (
  operationResponses: ParsedOperationResponseOpenAPIV3[],
): ParsedOperationErrorOpenAPIV3[] => {
  return operationResponses
    .filter((operationResponse) => {
      return operationResponse.code >= 300 && operationResponse.description;
    })
    .map((response) => ({
      code: response.code,
      description: response.description ?? '',
    }));
};
