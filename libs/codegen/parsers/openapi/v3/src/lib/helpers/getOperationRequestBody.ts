import { getContent, getModel, getType } from '.';
import type {
  OpenAPIV3Document,
  OpenAPIV3RequestBodyWithRef,
  ParsedOperationParameterOpenAPIV3,
} from '../types';
import { getPattern } from '../utils';

export const getOperationRequestBody = (
  openApi: OpenAPIV3Document,
  body: OpenAPIV3RequestBodyWithRef
): ParsedOperationParameterOpenAPIV3 => {
  const requestBody: ParsedOperationParameterOpenAPIV3 = {
    in: 'body',
    export: 'interface',
    prop: 'requestBody',
    name: 'requestBody',
    type: 'any',
    base: 'any',
    template: null,
    link: null,
    default: undefined,
    isRoot: false,
    readOnly: false,
    imports: [],
    enum: [],
    enums: [],
    properties: [],
    mediaType: null,
    nullable: false,
    required: false,
  };

  if ('$ref' in body) return requestBody;

  Object.assign<
    ParsedOperationParameterOpenAPIV3,
    Partial<ParsedOperationParameterOpenAPIV3>
  >(requestBody, {
    description: body.description,
    required: !!body.required,
  });

  const content = getContent(openApi, body.content);

  if (!content) return requestBody;

  requestBody.mediaType = content.mediaType;
  switch (requestBody.mediaType) {
    case 'application/x-www-form-urlencoded':
    case 'multipart/form-data':
      requestBody.in = 'formData';
      requestBody.name = 'formData';
      requestBody.prop = 'formData';
      break;
  }

  if (!content.schema) return requestBody;

  if ('$ref' in content.schema) {
    const model = getType(content.schema.$ref);
    Object.assign<
      ParsedOperationParameterOpenAPIV3,
      Partial<ParsedOperationParameterOpenAPIV3>
    >(requestBody, {
      export: 'reference',
      type: model.type,
      base: model.base,
      template: model.template,
    });
    requestBody.imports.push(...model.imports);
    return requestBody;
  }

  const model = getModel(openApi, content.schema);
  Object.assign<
    ParsedOperationParameterOpenAPIV3,
    Partial<ParsedOperationParameterOpenAPIV3>
  >(requestBody, {
    export: model.export,
    type: model.type,
    base: model.base,
    template: model.template,
    link: model.link,
    readOnly: model.readOnly,
    required: requestBody.required || model.required,
    nullable: requestBody.nullable || model.nullable,
    format: model.format,
    maximum: model.maximum,
    exclusiveMaximum: model.exclusiveMaximum,
    minimum: model.minimum,
    exclusiveMinimum: model.exclusiveMinimum,
    multipleOf: model.multipleOf,
    maxLength: model.maxLength,
    minLength: model.minLength,
    maxItems: model.maxItems,
    minItems: model.minItems,
    uniqueItems: model.uniqueItems,
    maxProperties: model.maxProperties,
    minProperties: model.minProperties,
    pattern: getPattern(model.pattern),
  });
  requestBody.imports.push(...model.imports);
  requestBody.enum.push(...model.enum);
  requestBody.enums.push(...model.enums);
  requestBody.properties.push(...model.properties);

  return requestBody;
};
