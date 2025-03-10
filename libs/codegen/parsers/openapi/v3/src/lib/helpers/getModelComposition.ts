import type { getModel } from '.';
import { getModelProperties, getRequiredPropertiesFromComposition } from '.';
import type {
  OpenAPIV3Document,
  OpenAPIV3SchemaWithEnumExtension,
  OpenAPIV3SchemaWithRef,
  ParsedModelCompositionOpenAPIV3,
  ParsedModelOpenAPIV3,
} from '../types';

// Fix for circular dependency
type GetModelFn = typeof getModel;

export const getModelComposition = (
  openApi: OpenAPIV3Document,
  schema: OpenAPIV3SchemaWithEnumExtension,
  schemas: OpenAPIV3SchemaWithRef[],
  type: 'oneOf' | 'anyOf' | 'allOf',
  getModel: GetModelFn,
  parent: ParsedModelOpenAPIV3
): ParsedModelCompositionOpenAPIV3 => {
  const composition: ParsedModelCompositionOpenAPIV3 = {
    type,
    imports: [],
    enums: [],
    properties: [],
  };

  const properties: ParsedModelOpenAPIV3[] = [];

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
      model.refToParent = parent;
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
    const newProp: ParsedModelOpenAPIV3 = {
      name: '',
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
      refToParent: parent,
    };
    properties.forEach((item) => {
      item.refToParent = newProp;
    });

    composition.properties.push(newProp);
  }

  return composition;
};
