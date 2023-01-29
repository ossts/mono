import { getType } from '../helpers';
import type { OpenAPISchema, ParsedModel } from '../types';
import { escapeName, getPattern } from './';

export const createModel = <T extends ParsedModel>(
  schema: OpenAPISchema,
  initialValues: Partial<T> = {}
): T => {
  const model: ParsedModel = {
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
    Object.assign<ParsedModel, Partial<ParsedModel>>(model, {
      export: 'reference',
      type: schemaRef.type,
      base: schemaRef.base,
      template: schemaRef.template,
      nullable: schemaRef.nullable,
    });
    model.imports.push(...schemaRef.imports);
    return model as T;
  }

  Object.assign<ParsedModel, Partial<ParsedModel>>(model, {
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
