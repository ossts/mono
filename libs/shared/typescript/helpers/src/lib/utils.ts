/**
 * A reusable empty function.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const emptyFn = (...args: any[]): any => {};

/**
 * A reusable identity function that simply returns its first argument.
 */
const identityFn = <T>(val: T) => val;

export { emptyFn, identityFn };
