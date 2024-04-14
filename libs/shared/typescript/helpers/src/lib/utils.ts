/**
 * A reusable empty function.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptyFn = () => {};

/**
 * A reusable identity function that simply returns its first argument.
 */
const identityFn = <T>(val: T) => val;

export { emptyFn, identityFn };
