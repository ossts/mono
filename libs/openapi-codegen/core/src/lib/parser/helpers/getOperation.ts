import type { OpenAPIV3 } from 'openapi-types';

import type {
  OpenAPIDocument,
  OpenAPIRequestBody,
  ParsedOperation,
  ParsedOperationParameters,
} from '../types';
import { sortByRequired } from '../utils';
import {
  getOperationErrors,
  getOperationName,
  getOperationParameters,
  getOperationRequestBody,
  getOperationResponseHeader,
  getOperationResponses,
  getOperationResults,
  getRef,
  getServiceName,
} from './';

export const getOperation = (
  openApi: OpenAPIDocument,
  url: string,
  method: string,
  tag: string,
  op: OpenAPIV3.OperationObject,
  pathParams: ParsedOperationParameters
): ParsedOperation => {
  const serviceName = getServiceName(tag);
  const operationName = getOperationName(url, method, op.operationId);

  // Create a new operation object for this method.
  const operation: ParsedOperation = {
    service: serviceName,
    name: operationName,
    summary: op.summary || null,
    description: op.description || null,
    deprecated: op.deprecated === true,
    method: method.toUpperCase(),
    path: url,
    parameters: [...pathParams.parameters],
    parametersPath: [...pathParams.parametersPath],
    parametersQuery: [...pathParams.parametersQuery],
    parametersFormData: [...pathParams.parametersFormData],
    parametersHeader: [...pathParams.parametersHeader],
    parametersCookie: [...pathParams.parametersCookie],
    parametersBody: pathParams.parametersBody,
    imports: [],
    errors: [],
    results: [],
    responseHeader: null,
  };

  // Parse the operation parameters (path, query, body, etc).
  if (op.parameters) {
    const parameters = getOperationParameters(openApi, op.parameters);
    operation.imports.push(...parameters.imports);
    operation.parameters.push(...parameters.parameters);
    operation.parametersPath.push(...parameters.parametersPath);
    operation.parametersQuery.push(...parameters.parametersQuery);
    operation.parametersFormData.push(...parameters.parametersFormData);
    operation.parametersHeader.push(...parameters.parametersHeader);
    operation.parametersCookie.push(...parameters.parametersCookie);
    operation.parametersBody = parameters.parametersBody;
  }

  if (op.requestBody) {
    const requestBodyDef = getRef<OpenAPIRequestBody>(openApi, op.requestBody);
    const requestBody = getOperationRequestBody(openApi, requestBodyDef);
    operation.imports.push(...requestBody.imports);
    operation.parameters.push(requestBody);
    operation.parametersBody = requestBody;
  }

  // Parse the operation responses.
  if (op.responses) {
    const operationResponses = getOperationResponses(openApi, op.responses);
    const operationResults = getOperationResults(operationResponses);
    operation.errors = getOperationErrors(operationResponses);
    operation.responseHeader = getOperationResponseHeader(operationResults);

    operationResults.forEach((operationResult) => {
      operation.results.push(operationResult);
      operation.imports.push(...operationResult.imports);
    });
  }

  operation.parameters = operation.parameters.sort(sortByRequired);

  return operation;
};
