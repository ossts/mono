import path from 'node:path';

import type { PathOrFileDescriptor } from 'fs-extra';
import type { Test } from 'vitest';
import { describe, it } from 'vitest';

import type { AbstractGeneratorSettings } from '@ossts/codegen/common';
import { mockJSONSchemaV3 } from '@ossts/codegen/common';
import { emptyFn } from '@ossts/shared/typescript/helpers';

import { generate } from '..';

const generatorsSettings: AbstractGeneratorSettings = {
  preventCleanup: true,
};

const generateMockOutputPath = ({ name, suite: { name: suiteName } }: Test) => {
  return path.resolve(__dirname, '__snapshots__', suiteName, name);
};

// https://vitest.dev/api/vi.html#vi-mock
vi.mock('fs-extra', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await importOriginal<typeof import('fs-extra')>();

  return {
    ...mod,

    ensureFile: emptyFn,
    ensureFileSync: emptyFn,
    writeFile: async (
      path: PathOrFileDescriptor,
      content: string | NodeJS.ArrayBufferView
    ) => {
      expect(content).toMatchFileSnapshot(path.toString());
    },
  };
});

describe('Basic', () => {
  it.only('Should work with default parameters', async ({ meta }) => {
    await generate({
      input: mockJSONSchemaV3,
      output: generateMockOutputPath(meta),
      generatorsSettings,
    });
  });
});
