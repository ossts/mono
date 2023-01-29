import type {
  OpenAPIDocument,
  OpenAPISchema,
  OpenAPISchemaNoRef,
  ParsedModel,
  ParsedModelComposition,
} from '../types';
import type { getModel } from './';
import { getModelProperties, getRequiredPropertiesFromComposition } from './';

// Fix for circular dependency
type GetModelFn = typeof getModel;

export const getModelComposition = (
  openApi: OpenAPIDocument,
  schema: OpenAPISchemaNoRef,
  schemas: OpenAPISchema[],
  type: 'oneOf' | 'anyOf' | 'allOf',
  getModel: GetModelFn
): ParsedModelComposition => {
  const composition: ParsedModelComposition = {
    type,
    imports: [],
    enums: [],
    properties: [],
  };

  const properties: ParsedModel[] = [];

  schemas
    .map((schema) => getModel(openApi, schema))
    .filter((model) => {
      const hasProperties = model.properties.length;
      const hasEnums = model.enums.length;
      const isObject = model.type === 'any';
      const isDictionary = model.export === 'dictionary';
      const isEmpty = isObject && !hasProperties && !hasEnums;
      return !isEmpty || isDictionary;
    })
    .forEach((model) => {
      composition.imports.push(...model.imports);
      composition.enums.push(...model.enums);
      composition.properties.push(model);
    });

  if (schema.required) {
    const requiredProperties = getRequiredPropertiesFromComposition(
      openApi,
      schema.required,
      schemas,
      getModel
    );
    requiredProperties.forEach((requiredProperty) => {
      composition.imports.push(...requiredProperty.imports);
      composition.enums.push(...requiredProperty.enums);
    });
    properties.push(...requiredProperties);
  }

  if (schema.properties) {
    const modelProperties = getModelProperties(openApi, schema, getModel);
    modelProperties.forEach((modelProperty) => {
      composition.imports.push(...modelProperty.imports);
      composition.enums.push(...modelProperty.enums);
      if (modelProperty.export === 'enum') {
        composition.enums.push(modelProperty);
      }
    });
    properties.push(...modelProperties);
  }

  if (properties.length) {
    composition.properties.push({
      name: 'properties',
      export: 'interface',
      type: 'any',
      base: 'any',
      template: null,
      link: null,
      description: '',
      isRoot: false,
      readOnly: false,
      nullable: false,
      required: false,
      imports: [],
      enum: [],
      enums: [],
      properties,
    });
  }

  return composition;
};
