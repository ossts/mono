import type { getModel } from '.';
import { getRef } from '.';
import type {
  OpenAPIV3Document,
  OpenAPIV3SchemaWithRef,
  ParsedModelOpenAPIV3,
} from '../types';

// Fix for circular dependency
type GetModelFn = typeof getModel;

export const getRequiredPropertiesFromComposition = (
  openApi: OpenAPIV3Document,
  required: string[],
  schemas: OpenAPIV3SchemaWithRef[],
  getModel: GetModelFn,
): ParsedModelOpenAPIV3[] => {
  return schemas
    .reduce<ParsedModelOpenAPIV3[]>((properties, schema) => {
      if ('$ref' in schema) {
        const schemaRef = getRef<OpenAPIV3SchemaWithRef>(openApi, schema);
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
