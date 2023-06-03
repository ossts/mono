/**
 * Checks whether value is present in tuple.
 *
 * Same as as array's include but for tuples, to make code typesafe.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tupleIncludes = <T>(values: readonly T[], x: any): x is T =>
  values.includes(x);
