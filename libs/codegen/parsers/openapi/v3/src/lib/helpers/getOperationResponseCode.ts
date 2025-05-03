export const getOperationResponseCode = (
  value: string | 'default'
): number | null => {
  // Since "default" can handle multiple status codes we set it to -1 to identify it later in generators
  if (value === 'default') {
    return -1;
  }

  // Check if we can parse the code and return of successful.
  if (/[0-9]+/g.test(value)) {
    const code = parseInt(value);
    if (Number.isInteger(code)) {
      return Math.abs(code);
    }
  }

  return null;
};
