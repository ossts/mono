import type { OpenAPIV3 } from 'openapi-types';

import type { OpenAPIDocument, ParsedModel } from '../types';
import { findOneOfParentDiscriminator, mapPropertyValue } from '../utils';
import type { getModel } from './';

// Fix for circular dependency
type GetModelFn = typeof getModel;

export const getModelProperties = (
  openApi: OpenAPIDocument,
  schema: OpenAPIV3.SchemaObject,
  getModel: GetModelFn,
  parent?: ParsedModel
): ParsedModel[] => {
  if (!schema.properties) return [];

  const discriminator = findOneOfParentDiscriminator(openApi, parent);

  return Object.entries(schema.properties).map(([name, prop]) => {
    const properties = getModel(openApi, prop, name);

    if ('$ref' in schema) return properties;

    properties.required = !!schema.required?.includes(name);

    if (parent && discriminator?.propertyName == name) {
      Object.assign<ParsedModel, Partial<ParsedModel>>(properties, {
        export: 'reference',
        type: 'string',
        base: `'${mapPropertyValue(discriminator, parent)}'`,
        nullable: !!schema.nullable,
      });
    }

    return properties;
  });
};
