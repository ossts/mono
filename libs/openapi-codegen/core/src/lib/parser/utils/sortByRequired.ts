import type { ParsedOperationParameter } from '../types';

export const sortByRequired = (
  a: ParsedOperationParameter,
  b: ParsedOperationParameter
): number => {
  const aNeedsValue = a.required && a.default === undefined;
  const bNeedsValue = b.required && b.default === undefined;
  if (aNeedsValue && !bNeedsValue) return -1;
  if (bNeedsValue && !aNeedsValue) return 1;
  return 0;
};
