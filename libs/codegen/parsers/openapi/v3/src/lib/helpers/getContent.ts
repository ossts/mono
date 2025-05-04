import { isNil } from 'lodash';
import type { OpenAPIV3 } from 'openapi-types';

import type { Dictionary } from '@ossts/shared/typescript/helper-types';

import type { OpenAPIV3Document } from '../types';

export interface Content {
  mediaType: string;
  schema: OpenAPIV3.MediaTypeObject['schema'];
}

const BASIC_MEDIA_TYPES = [
  'application/json-patch+json',
  'application/json',
  'application/x-www-form-urlencoded',
  'text/json',
  'text/plain',
  'multipart/form-data',
  'multipart/mixed',
  'multipart/related',
  'multipart/batch',
];

export const getContent = (
  openApi: OpenAPIV3Document,
  content: Dictionary<OpenAPIV3.MediaTypeObject>,
): Content | null => {
  const basicMediaTypeWithSchema = Object.keys(content)
    .filter((mediaType) => {
      const cleanMediaType = mediaType.split(';')[0].trim();
      return BASIC_MEDIA_TYPES.includes(cleanMediaType);
    })
    .find((mediaType) => !isNil(content[mediaType]?.schema));
  if (basicMediaTypeWithSchema) {
    return {
      mediaType: basicMediaTypeWithSchema,
      schema: content[basicMediaTypeWithSchema].schema,
    };
  }

  const firstMediaTypeWithSchema = Object.keys(content).find(
    (mediaType) => !isNil(content[mediaType]?.schema),
  );
  if (firstMediaTypeWithSchema) {
    return {
      mediaType: firstMediaTypeWithSchema,
      schema: content[firstMediaTypeWithSchema].schema,
    };
  }
  return null;
};
