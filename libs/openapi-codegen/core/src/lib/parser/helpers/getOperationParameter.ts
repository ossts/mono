import type { OpenAPIV3 } from 'openapi-types';

import type {
  OpenAPIDocument,
  OpenAPISchema,
  ParsedOperationParameter,
} from '../types';
import { createModel, getPattern } from '../utils';
import { getModel, getOperationParameterName, getRef, getType } from './';

export const getOperationParameter = (
  openApi: OpenAPIDocument,
  parameter: OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject
): ParsedOperationParameter => {
  const operationParameter = createModel<ParsedOperationParameter>(
    parameter as OpenAPISchema
  );

  if ('$ref' in parameter) {
    const definitionRef = getType(parameter.$ref);
    Object.assign<ParsedOperationParameter, Partial<ParsedOperationParameter>>(
      operationParameter,
      {
        export: 'reference',
        type: definitionRef.type,
        base: definitionRef.base,
        template: definitionRef.template,
        nullable: definitionRef.nullable,
      }
    );
    operationParameter.imports.push(...definitionRef.imports);
    return operationParameter;
  }

  Object.assign<ParsedOperationParameter, Partial<ParsedOperationParameter>>(
    operationParameter,
    {
      in: parameter.in,
      prop: parameter.name,
      mediaType: null,

      name: getOperationParameterName(parameter.name),
    }
  );

  let { schema } = parameter;
  if (schema) {
    if (
      '$ref' in schema &&
      schema.$ref?.startsWith('#/components/parameters/')
    ) {
      schema = getRef<OpenAPISchema>(openApi, schema);
    }
    if ('$ref' in schema) {
      const model = getType(schema.$ref);
      Object.assign<
        ParsedOperationParameter,
        Partial<ParsedOperationParameter>
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
        ParsedOperationParameter,
        Partial<ParsedOperationParameter>
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
