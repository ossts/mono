import type {
  AbstractGeneratorSettings,
  CodegenHandlebarsHelperWrapper,
} from '@ossts/codegen/common';
import type { ParsedModelOpenAPIV3 } from '@ossts/codegen/parsers/openapi/v3';
import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';

const caches = new WeakMap<
  typeof Handlebars,
  Map<ParsedModelOpenAPIV3, string[]>
>();

/**
 * Returns full path for current property as `string[]`
 */
export const fullPath: CodegenHandlebarsHelperWrapper<
  AbstractGeneratorSettings
> = ({ handlebarsInstance }) => {
  // we have to create cache per handlebars instance
  // to make sure that caches won't shared between runs
  // which leads to incorrect results in test
  let cache = caches.get(handlebarsInstance);
  if (!cache) {
    cache = new Map();
    caches.set(handlebarsInstance, cache);
  }

  if (
    !(handlebarsInstance as DictionaryWithAny)[
      '__$$osstsEntityToPrimaryKeyNameMappingCacheSet$$__'
    ]
  ) {
    cache.clear();
    (handlebarsInstance as DictionaryWithAny)[
      '__$$osstsEntityToPrimaryKeyNameMappingCacheSet$$__'
    ] = true;
  }

  return function (this: ParsedModelOpenAPIV3): string[] {
    const cachedVal = cache.get(this);
    if (cachedVal) return cachedVal;

    const result = getFullPath(this, true);
    cache.set(this, result);

    return result;
  };
};

const getFullPath = (
  type: ParsedModelOpenAPIV3,
  firstCall = false,
): string[] => {
  let path: string[] = [];

  // we should only return path if deepest node has name
  if (firstCall && !type.name) return [];

  if (type.name) {
    path.push(type.name);
  }

  if (!type.isRoot) {
    if (type.refToParent) {
      const tmp = getFullPath(type.refToParent);

      if (tmp.length) {
        path = tmp.concat(path);
      }
    } else {
      // eslint-disable-next-line no-debugger
      debugger;
      throw new Error(
        'No "refToParent" available for type. This should never happen',
      );
    }
  }

  return path;
};
