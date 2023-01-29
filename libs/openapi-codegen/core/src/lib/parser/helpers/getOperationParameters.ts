import type { OpenAPIV3 } from 'openapi-types';

import type {
  OpenAPIDocument,
  OpenAPIParameter,
  ParsedOperationParameters,
} from '../types';
import { getOperationParameter, getRef } from './';

export const getOperationParameters = (
  openApi: OpenAPIDocument,
  parameters: OpenAPIParameter[]
): ParsedOperationParameters => {
  const operationParameters: ParsedOperationParameters = {
    imports: [],
    parameters: [],
    parametersPath: [],
    parametersQuery: [],
    parametersFormData: [],
    parametersCookie: [],
    parametersHeader: [],
    parametersBody: null, // Not used in V3 -> @see requestBody
  };

  // Iterate over the parameters
  parameters.forEach((parameterOrReference) => {
    const parameterDef = getRef<OpenAPIV3.ParameterObject>(
      openApi,
      parameterOrReference
    );
    const parameter = getOperationParameter(openApi, parameterDef);

    // We ignore the "api-version" param, since we do not want to add this
    // as the first / default parameter for each of the service calls.
    if (parameter.prop !== 'api-version') {
      switch (parameterDef.in) {
        case 'path':
          operationParameters.parametersPath.push(parameter);
          operationParameters.parameters.push(parameter);
          operationParameters.imports.push(...parameter.imports);
          break;

        case 'query':
          operationParameters.parametersQuery.push(parameter);
          operationParameters.parameters.push(parameter);
          operationParameters.imports.push(...parameter.imports);
          break;

        case 'formData':
          operationParameters.parametersFormData.push(parameter);
          operationParameters.parameters.push(parameter);
          operationParameters.imports.push(...parameter.imports);
          break;

        case 'cookie':
          operationParameters.parametersCookie.push(parameter);
          operationParameters.parameters.push(parameter);
          operationParameters.imports.push(...parameter.imports);
          break;

        case 'header':
          operationParameters.parametersHeader.push(parameter);
          operationParameters.parameters.push(parameter);
          operationParameters.imports.push(...parameter.imports);
          break;
      }
    }
  });
  return operationParameters;
};
