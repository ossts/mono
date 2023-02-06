import type { Config } from '../types';

export const validateConfig = ({ input, parseOnly, output }: Config) => {
  if (!input) throw new Error(`"input" is required`);

  if (!parseOnly && !output)
    throw new Error(
      `"output" can only be empty when "parseOnly" is set to "true"`
    );
};
