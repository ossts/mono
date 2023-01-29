import type { ParsedModel, ParsedOperationResponse } from '../types';

const areEqual = (a: ParsedModel, b: ParsedModel): boolean => {
  const equal =
    a.type === b.type && a.base === b.base && a.template === b.template;
  if (equal && a.link && b.link) {
    return areEqual(a.link, b.link);
  }
  return equal;
};

export const getOperationResults = (
  operationResponses: ParsedOperationResponse[]
): ParsedOperationResponse[] => {
  const operationResults: ParsedOperationResponse[] = [];

  // Filter out success response codes, but skip "204 No Content"
  operationResponses.forEach((operationResponse) => {
    const { code } = operationResponse;
    if (code && code !== 204 && code >= 200 && code < 300) {
      operationResults.push(operationResponse);
    }
  });

  if (!operationResults.length) {
    operationResults.push({
      in: 'response',
      name: '',
      code: 200,
      description: '',
      export: 'generic',
      type: 'void',
      base: 'void',
      template: null,
      link: null,
      isRoot: false,
      readOnly: false,
      required: false,
      nullable: false,
      imports: [],
      enum: [],
      enums: [],
      properties: [],
    });
  }

  return operationResults.filter((operationResult, index, arr) => {
    return (
      arr.findIndex((item) => {
        return areEqual(item, operationResult);
      }) === index
    );
  });
};
