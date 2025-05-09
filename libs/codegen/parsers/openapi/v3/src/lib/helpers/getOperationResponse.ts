import { getContent, getModel, getRef, getType } from '.';
import type {
  OpenAPIV3Document,
  OpenAPIV3ResponseWithRef,
  OpenAPIV3SchemaWithRef,
  ParsedOperationResponseOpenAPIV3,
} from '../types';
import { getPattern } from '../utils';

export const getOperationResponse = (
  openApi: OpenAPIV3Document,
  response: OpenAPIV3ResponseWithRef,
  responseCode: number,
): ParsedOperationResponseOpenAPIV3 => {
  const operationResponse: ParsedOperationResponseOpenAPIV3 = {
    in: 'response',
    name: '',
    code: responseCode,
    export: 'generic',
    type: 'any',
    base: 'any',
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
  };

  if ('$ref' in response) return operationResponse;

  Object.assign<
    ParsedOperationResponseOpenAPIV3,
    Partial<ParsedOperationResponseOpenAPIV3>
  >(operationResponse, {
    description: response.description,
  });

  if (response.content) {
    const content = getContent(openApi, response.content);

    if (content?.schema) {
      if ('$ref' in content.schema) {
        if (content.schema.$ref?.startsWith('#/components/responses/')) {
          content.schema = getRef<OpenAPIV3SchemaWithRef>(
            openApi,
            content.schema,
          );
        }

        if ('$ref' in content.schema) {
          const model = getType(content.schema.$ref);
          operationResponse.export = 'reference';
          operationResponse.type = model.type;
          operationResponse.base = model.base;
          operationResponse.template = model.template;
          operationResponse.imports.push(...model.imports);
        }

        return operationResponse;
      }

      const model = getModel(openApi, content.schema);
      operationResponse.export = model.export;
      operationResponse.type = model.type;
      operationResponse.base = model.base;
      operationResponse.template = model.template;
      operationResponse.link = model.link;
      operationResponse.readOnly = model.readOnly;
      operationResponse.required = model.required;
      operationResponse.nullable = model.nullable;
      operationResponse.format = model.format;
      operationResponse.maximum = model.maximum;
      operationResponse.exclusiveMaximum = model.exclusiveMaximum;
      operationResponse.minimum = model.minimum;
      operationResponse.exclusiveMinimum = model.exclusiveMinimum;
      operationResponse.multipleOf = model.multipleOf;
      operationResponse.maxLength = model.maxLength;
      operationResponse.minLength = model.minLength;
      operationResponse.maxItems = model.maxItems;
      operationResponse.minItems = model.minItems;
      operationResponse.uniqueItems = model.uniqueItems;
      operationResponse.maxProperties = model.maxProperties;
      operationResponse.minProperties = model.minProperties;
      operationResponse.pattern = getPattern(model.pattern);
      operationResponse.imports.push(...model.imports);
      operationResponse.enum.push(...model.enum);
      operationResponse.enums.push(...model.enums);
      operationResponse.properties.push(...model.properties);

      return operationResponse;
    }
  }

  // We support basic properties from response headers, since both
  // fetch and XHR client just support string types.
  if (response.headers) {
    for (const name in response.headers) {
      if (Object.prototype.hasOwnProperty.call(response.headers, name)) {
        operationResponse.in = 'header';
        operationResponse.name = name;
        operationResponse.type = 'string';
        operationResponse.base = 'string';
      }
    }
  }

  return operationResponse;
};
