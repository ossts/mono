import type { ParsedOperationResponseOpenAPIV3 } from '../types';

export const getOperationResponseHeader = (
  operationResponses: ParsedOperationResponseOpenAPIV3[]
): string | null => {
  const header = operationResponses.find((operationResponses) => {
    return operationResponses.in === 'header';
  });
  if (header) {
    return header.name;
  }
  return null;
};
