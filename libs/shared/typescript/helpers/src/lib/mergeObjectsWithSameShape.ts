/**
 * Merges multiple object of same shape into target object
 */
export const mergeObjectsWithSameShape = <T extends object>(
  target: T,
  source: T,
  ...other: (T | undefined)[]
) => Object.assign(target, source, ...other);
