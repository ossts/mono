import type { OpenAPIDocument, OpenAPISchema, ParsedModel } from '../types';
import { createModel } from '../utils';
import {
  extendEnum,
  getEnum,
  getModelComposition,
  getModelDefault,
  getModelProperties,
  getType,
} from './';

export const getModel = (
  openApi: OpenAPIDocument,
  schema: OpenAPISchema,
  name = '',
  isRoot = false
): ParsedModel => {
  const model = createModel(schema, {
    name,
    isRoot,
  });

  if ('$ref' in schema) return model;

  if (schema.enum && schema.type !== 'boolean') {
    const enumerators = getEnum(schema.enum);
    const extendedEnumerators = extendEnum(enumerators, schema);
    if (extendedEnumerators.length) {
      model.export = 'enum';
      model.type = 'string';
      model.base = 'string';
      model.enum.push(...extendedEnumerators);
      model.default = getModelDefault(schema, model);
      return model;
    }
  }

  if (schema.type === 'array' && schema.items) {
    if ('$ref' in schema.items) {
      const arrayItems = getType(schema.items.$ref);
      model.export = 'array';
      model.type = arrayItems.type;
      model.base = arrayItems.base;
      model.template = arrayItems.template;
      model.imports.push(...arrayItems.imports);
      model.default = getModelDefault(schema, model);
      return model;
    } else {
      const arrayItems = getModel(openApi, schema.items);
      model.export = 'array';
      model.type = arrayItems.type;
      model.base = arrayItems.base;
      model.template = arrayItems.template;
      model.link = arrayItems;
      model.imports.push(...arrayItems.imports);
      model.default = getModelDefault(schema, model);
      return model;
    }
  }

  if (
    schema.type === 'object' &&
    (typeof schema.additionalProperties === 'object' ||
      schema.additionalProperties === true)
  ) {
    const ap =
      typeof schema.additionalProperties === 'object'
        ? schema.additionalProperties
        : {};
    if ('$ref' in ap) {
      const additionalProperties = getType(ap.$ref);
      model.export = 'dictionary';
      model.type = additionalProperties.type;
      model.base = additionalProperties.base;
      model.template = additionalProperties.template;
      model.imports.push(...additionalProperties.imports);
      model.default = getModelDefault(schema, model);
      return model;
    } else {
      const additionalProperties = getModel(openApi, ap);
      model.export = 'dictionary';
      model.type = additionalProperties.type;
      model.base = additionalProperties.base;
      model.template = additionalProperties.template;
      model.link = additionalProperties;
      model.imports.push(...additionalProperties.imports);
      model.default = getModelDefault(schema, model);
      return model;
    }
  }

  if (schema.oneOf?.length) {
    const composition = getModelComposition(
      openApi,
      schema,
      schema.oneOf,
      'oneOf',
      getModel
    );
    model.export = composition.type;
    model.imports.push(...composition.imports);
    model.properties.push(...composition.properties);
    model.enums.push(...composition.enums);
    return model;
  }

  if (schema.anyOf?.length) {
    const composition = getModelComposition(
      openApi,
      schema,
      schema.anyOf,
      'anyOf',
      getModel
    );
    model.export = composition.type;
    model.imports.push(...composition.imports);
    model.properties.push(...composition.properties);
    model.enums.push(...composition.enums);
    return model;
  }

  if (schema.allOf?.length) {
    const composition = getModelComposition(
      openApi,
      schema,
      schema.allOf,
      'allOf',
      getModel
    );
    model.export = composition.type;
    model.imports.push(...composition.imports);
    model.properties.push(...composition.properties);
    model.enums.push(...composition.enums);
    return model;
  }

  if (schema.type === 'object') {
    if (schema.properties) {
      model.export = 'interface';
      model.type = 'any';
      model.base = 'any';
      model.default = getModelDefault(schema, model);

      const modelProperties = getModelProperties(
        openApi,
        schema,
        getModel,
        model
      );
      modelProperties.forEach((modelProperty) => {
        model.imports.push(...modelProperty.imports);
        model.enums.push(...modelProperty.enums);
        model.properties.push(modelProperty);
        if (modelProperty.export === 'enum') {
          model.enums.push(modelProperty);
        }
      });
      return model;
    } else {
      const additionalProperties = getModel(openApi, {});
      model.export = 'dictionary';
      model.type = additionalProperties.type;
      model.base = additionalProperties.base;
      model.template = additionalProperties.template;
      model.link = additionalProperties;
      model.imports.push(...additionalProperties.imports);
      model.default = getModelDefault(schema, model);
      return model;
    }
  }

  // If the schema has a type than it can be a basic or generic type.
  if (schema.type) {
    const definitionType = getType(schema.type, schema.format);
    model.export = 'generic';
    model.type = definitionType.type;
    model.base = definitionType.base;
    model.template = definitionType.template;
    model.nullable = definitionType.nullable || model.nullable;
    model.imports.push(...definitionType.imports);
    model.default = getModelDefault(schema, model);
    return model;
  }

  return model;
};
