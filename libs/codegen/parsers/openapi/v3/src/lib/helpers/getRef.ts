import type { OpenAPIV3 } from 'openapi-types';

import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';

import type { OpenAPIV3Document } from '../types';

const ESCAPED_REF_SLASH = /~1/g;
const ESCAPED_REF_TILDE = /~0/g;

export const getRef = <T extends object>(
  openApi: OpenAPIV3Document,
  item: T | OpenAPIV3.ReferenceObject,
): T => {
  if ('$ref' in item) {
    // Fetch the paths to the definitions, this converts:
    // "#/components/schemas/Form" to ["components", "schemas", "Form"]
    const paths = item.$ref
      .replace(/^#/g, '')
      .split('/')
      .filter((item) => item);

    // Try to find the reference by walking down the path,
    // if we cannot find it, then we throw an error.
    let result: DictionaryWithAny = openApi;
    paths.forEach((path) => {
      const decodedPath = decodeURIComponent(
        path.replace(ESCAPED_REF_SLASH, '/').replace(ESCAPED_REF_TILDE, '~'),
      );
      if (Object.prototype.hasOwnProperty.call(result, decodedPath)) {
        result = result[decodedPath];
      } else {
        throw new Error(`Could not find reference: "${item.$ref}"`);
      }
    });
    return result as T;
  }
  return item as T;
};
