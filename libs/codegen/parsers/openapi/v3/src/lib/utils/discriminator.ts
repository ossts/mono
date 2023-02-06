import type { OpenAPIV3 } from 'openapi-types';

import type { Dictionary } from '@ossts/shared/typescript/helper-types';

import type { ParsedModelOpenAPIV3 } from '../types';
import { stripNamespace } from './';

const inverseDictionary = (map: Dictionary<string>): Dictionary<string> => {
  const m2: Dictionary<string> = {};
  for (const key in map) {
    m2[map[key]] = key;
  }
  return m2;
};

export const findOneOfParentDiscriminator = (
  openApi: OpenAPIV3.Document,
  parent?: ParsedModelOpenAPIV3
): OpenAPIV3.DiscriminatorObject | undefined => {
  if (!openApi.components?.schemas || !parent) return;

  const schema = Object.values(openApi.components.schemas).find((schema) => {
    if ('$ref' in schema || !schema.discriminator || !schema.oneOf?.length)
      return;

    return schema.oneOf.some(
      (subSchema) =>
        '$ref' in subSchema && stripNamespace(subSchema.$ref) == parent.name
    );
  });

  if (!schema || '$ref' in schema) return;

  return schema.discriminator;
};

export const mapPropertyValue = (
  discriminator: OpenAPIV3.DiscriminatorObject,
  parent: ParsedModelOpenAPIV3
): string => {
  if (discriminator.mapping) {
    const mapping = inverseDictionary(discriminator.mapping);
    const key = Object.keys(mapping).find(
      (item) => stripNamespace(item) == parent.name
    );
    if (key && mapping[key]) {
      return mapping[key];
    }
  }
  return parent.name;
};
