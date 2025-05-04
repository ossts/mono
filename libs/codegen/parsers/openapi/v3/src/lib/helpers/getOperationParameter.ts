import type { OpenAPIV3 } from 'openapi-types';

import { getModel, getOperationParameterName, getRef, getType } from '.';
import type {
  OpenAPIV3Document,
  OpenAPIV3SchemaWithRef,
  ParsedOperationParameterOpenAPIV3,
} from '../types';
import { createModel, getPattern } from '../utils';

export const getOperationParameter = (
  openApi: OpenAPIV3Document,
  parameter: OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject,
): ParsedOperationParameterOpenAPIV3 => {
  const operationParameter = createModel<ParsedOperationParameterOpenAPIV3>(
    parameter as OpenAPIV3SchemaWithRef,
  );

  if ('$ref' in parameter) {
    const definitionRef = getType(parameter.$ref);
    Object.assign<
      ParsedOperationParameterOpenAPIV3,
      Partial<ParsedOperationParameterOpenAPIV3>
    >(operationParameter, {
      export: 'reference',
      type: definitionRef.type,
      base: definitionRef.base,
      template: definitionRef.template,
      nullable: definitionRef.nullable,
    });
    operationParameter.imports.push(...definitionRef.imports);
    return operationParameter;
  }

  Object.assign<
    ParsedOperationParameterOpenAPIV3,
    Partial<ParsedOperationParameterOpenAPIV3>
  >(operationParameter, {
    in: parameter.in,
    prop: parameter.name,
    mediaType: null,

    name: getOperationParameterName(parameter.name),
  });

  let { schema } = parameter;
  if (schema) {
    if (
      '$ref' in schema &&
      schema.$ref?.startsWith('#/components/parameters/')
    ) {
      schema = getRef<OpenAPIV3SchemaWithRef>(openApi, schema);
    }
    if ('$ref' in schema) {
      const model = getType(schema.$ref);
      Object.assign<
        ParsedOperationParameterOpenAPIV3,
        Partial<ParsedOperationParameterOpenAPIV3>
      >(operationParameter, {
        export: 'reference',
        type: model.type,
        base: model.base,
        template: model.template,
      });
      operationParameter.imports.push(...model.imports);
      return operationParameter;
    } else {
      const model = getModel(openApi, schema);
      Object.assign<
        ParsedOperationParameterOpenAPIV3,
        Partial<ParsedOperationParameterOpenAPIV3>
      >(operationParameter, {
        export: model.export,
        type: model.type,
        base: model.base,
        template: model.template,
        link: model.link,
        readOnly: model.readOnly,
        required: operationParameter.required || model.required,
        nullable: operationParameter.nullable || model.nullable,
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
        default: model.default,
      });
      operationParameter.imports.push(...model.imports);
      operationParameter.enum.push(...model.enum);
      operationParameter.enums.push(...model.enums);
      operationParameter.properties.push(...model.properties);
      return operationParameter;
    }
  }

  return operationParameter;
};
