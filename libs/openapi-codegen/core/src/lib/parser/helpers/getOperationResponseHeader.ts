import type { ParsedOperationResponse } from '../types';

export const getOperationResponseHeader = (
  operationResponses: ParsedOperationResponse[]
): string | null => {
  const header = operationResponses.find((operationResponses) => {
    return operationResponses.in === 'header';
  });
  if (header) {
    return header.name;
  }
  return null;
};
