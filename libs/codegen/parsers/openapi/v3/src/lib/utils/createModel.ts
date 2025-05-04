import { getType } from '../helpers';
import type { OpenAPIV3SchemaWithRef, ParsedModelOpenAPIV3 } from '../types';
import { escapeName, getPattern } from './';

export const createModel = <T extends ParsedModelOpenAPIV3>(
  schema: OpenAPIV3SchemaWithRef,
  initialValues: Partial<T> = {},
): T => {
  const model: ParsedModelOpenAPIV3 = {
    name: '',
    export: 'interface',
    type: 'any',
    base: 'any',
    template: null,
    link: null,
    deprecated: false,
    isRoot: false,
    readOnly: false,
    nullable: false,
    required: false,
    imports: [],
    enum: [],
    enums: [],
    properties: [],
    ...initialValues,
  };

  if (initialValues.name) {
    model.name = escapeName(initialValues.name);
  }

  if ('$ref' in schema) {
    const schemaRef = getType(schema.$ref);
    Object.assign<ParsedModelOpenAPIV3, Partial<ParsedModelOpenAPIV3>>(model, {
      export: 'reference',
      type: schemaRef.type,
      base: schemaRef.base,
      template: schemaRef.template,
      nullable: schemaRef.nullable,
    });
    model.imports.push(...schemaRef.imports);
    return model as T;
  }

  Object.assign<ParsedModelOpenAPIV3, Partial<ParsedModelOpenAPIV3>>(model, {
    description: schema.description,
    deprecated: !!schema.deprecated,
    readOnly: !!schema.readOnly,
    nullable: !!schema.nullable,
    // this is require to correctly handle when used for parameters, where required is boolean
    required: Array.isArray(schema.required) ? false : !!schema.required,
    format: schema.format,
    maximum: schema.maximum,
    exclusiveMaximum: schema.exclusiveMaximum,
    minimum: schema.minimum,
    exclusiveMinimum: schema.exclusiveMinimum,
    multipleOf: schema.multipleOf,
    maxLength: schema.maxLength,
    minLength: schema.minLength,
    maxItems: schema.maxItems,
    minItems: schema.minItems,
    uniqueItems: schema.uniqueItems,
    maxProperties: schema.maxProperties,
    minProperties: schema.minProperties,
    pattern: getPattern(schema.pattern),
  });

  return model as T;
};
