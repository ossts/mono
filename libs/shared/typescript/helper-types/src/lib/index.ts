export type Dictionary<T> = {
  [key: string]: T;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DictionaryWithAny<T = any> = Dictionary<T>;
