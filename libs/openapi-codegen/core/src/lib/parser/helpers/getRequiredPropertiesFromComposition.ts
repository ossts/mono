import type { OpenAPIDocument, OpenAPISchema, ParsedModel } from '../types';
import type { getModel } from './';
import { getRef } from './';

// Fix for circular dependency
type GetModelFn = typeof getModel;

export const getRequiredPropertiesFromComposition = (
  openApi: OpenAPIDocument,
  required: string[],
  schemas: OpenAPISchema[],
  getModel: GetModelFn
): ParsedModel[] => {
  return schemas
    .reduce<ParsedModel[]>((properties, schema) => {
      if ('$ref' in schema) {
        const schemaRef = getRef<OpenAPISchema>(openApi, schema);
        return [...properties, ...getModel(openApi, schemaRef).properties];
      }
      return [...properties, ...getModel(openApi, schema).properties];
    }, [])
    .filter((property) => {
      return !property.required && required.includes(property.name);
    })
    .map((property) => {
      return {
        ...property,
        required: true,
      };
    });
};
