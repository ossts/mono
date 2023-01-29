import type { ParsedOperationError, ParsedOperationResponse } from '../types';

export const getOperationErrors = (
  operationResponses: ParsedOperationResponse[]
): ParsedOperationError[] => {
  return operationResponses
    .filter((operationResponse) => {
      return operationResponse.code >= 300 && operationResponse.description;
    })
    .map((response) => ({
      code: response.code,
      description: response.description ?? '',
    }));
};
