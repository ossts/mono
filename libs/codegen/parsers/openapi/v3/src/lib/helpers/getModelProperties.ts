import type { OpenAPIV3 } from 'openapi-types';

import type { getModel } from '.';
import type { OpenAPIV3Document, ParsedModelOpenAPIV3 } from '../types';
import { findOneOfParentDiscriminator, mapPropertyValue } from '../utils';

// Fix for circular dependency
type GetModelFn = typeof getModel;

export const getModelProperties = (
  openApi: OpenAPIV3Document,
  schema: OpenAPIV3.SchemaObject,
  getModel: GetModelFn,
  parent?: ParsedModelOpenAPIV3
): ParsedModelOpenAPIV3[] => {
  if (!schema.properties) return [];

  const discriminator = findOneOfParentDiscriminator(openApi, parent);

  return Object.entries(schema.properties).map(([name, prop]) => {
    const properties = getModel(openApi, prop, name);

    if ('$ref' in schema) return properties;

    properties.required = !!schema.required?.includes(name);

    if (parent && discriminator?.propertyName == name) {
      Object.assign<ParsedModelOpenAPIV3, Partial<ParsedModelOpenAPIV3>>(
        properties,
        {
          export: 'reference',
          type: 'string',
          base: `'${mapPropertyValue(discriminator, parent)}'`,
          nullable: !!schema.nullable,
        }
      );
    }

    return properties;
  });
};
