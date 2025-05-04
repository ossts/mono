import type {
  ParsedModelOpenAPIV3,
  ParsedOperationResponseOpenAPIV3,
} from '../types';

const areEqual = (
  a: ParsedModelOpenAPIV3,
  b: ParsedModelOpenAPIV3,
): boolean => {
  const equal =
    a.type === b.type && a.base === b.base && a.template === b.template;
  if (equal && a.link && b.link) {
    return areEqual(a.link, b.link);
  }
  return equal;
};

export const getOperationResults = (
  operationResponses: ParsedOperationResponseOpenAPIV3[],
): ParsedOperationResponseOpenAPIV3[] => {
  const operationResults: ParsedOperationResponseOpenAPIV3[] = [];

  // Filter out success response codes, but skip "204 No Content"
  // -1 - required to identify "default" response which can handle multiple codes
  operationResponses.forEach((operationResponse) => {
    const { code } = operationResponse;
    if ((code && code !== 204 && code >= 200 && code < 300) || code === -1) {
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
