import type { ParsedOperationParameterOpenAPIV3 } from '../types';

export const sortByRequired = (
  a: ParsedOperationParameterOpenAPIV3,
  b: ParsedOperationParameterOpenAPIV3
): number => {
  const aNeedsValue = a.required && a.default === undefined;
  const bNeedsValue = b.required && b.default === undefined;
  if (aNeedsValue && !bNeedsValue) return -1;
  if (bNeedsValue && !aNeedsValue) return 1;
  return 0;
};
