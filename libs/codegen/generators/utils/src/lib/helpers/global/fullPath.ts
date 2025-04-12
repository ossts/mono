import type {
  AbstractGeneratorSettings,
  CodegenHandlebarsHelperWrapper,
} from '@ossts/codegen/common';
import type { ParsedModelOpenAPIV3 } from '@ossts/codegen/parsers/openapi/v3';

/**
 * Returns full path for current property as `string[]`
 */
export const fullPath: CodegenHandlebarsHelperWrapper<
  AbstractGeneratorSettings
> = () =>
  function (this: ParsedModelOpenAPIV3): string[] {
    return getFullPath(this, true);
  };

const getFullPath = (
  type: ParsedModelOpenAPIV3,
  firstCall = false
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
        'No "refToParent" available for type. This should never happen'
      );
    }
  }

  return path;
};
