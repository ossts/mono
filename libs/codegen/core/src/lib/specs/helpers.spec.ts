import path from 'node:path';

import type { RunnerTask } from 'vitest';

import type { AbstractGeneratorSettings } from '@ossts/codegen/common';
import type { DictionaryWithAny } from '@ossts/shared/typescript/helper-types';

export const generatorsSettings: AbstractGeneratorSettings = {
  preventCleanup: true,
};

export const generateMockOutputPath = ({ name, suite }: RunnerTask) => {
  return path.resolve(__dirname, '__snapshots__', suite?.name ?? '', name);
};

export const generateTempOutputPath = ({ name, suite }: RunnerTask) => {
  return path.resolve(__dirname, 'tmp', suite?.name ?? '', name);
};

export const encodeJSON = (data: DictionaryWithAny): string =>
  JSON.stringify(data, (key, value) => {
    if (value instanceof Map || value instanceof Set) {
      return [...value];
    }

    return value;
  });

export const disableFSMock = async () => {
  const fsExtra = await import('fs-extra');

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actualFsExtra =
    await vi.importActual<typeof import('fs-extra')>('fs-extra');

  const writeFileSpy = vi
    .spyOn(fsExtra, 'writeFile')
    .mockImplementation(actualFsExtra.writeFile);
  const ensureFileSpy = vi
    .spyOn(fsExtra, 'ensureFile')
    .mockImplementation(actualFsExtra.ensureFile);
  const ensureFileSyncSpy = vi
    .spyOn(fsExtra, 'ensureFileSync')
    .mockImplementation(actualFsExtra.ensureFileSync);

  // vi.restoreAllMocks();

  return {
    fsExtra,
    writeFileSpy,
    ensureFileSpy,
    ensureFileSyncSpy,
    reenableFSMock: () => {
      writeFileSpy.mockRestore();
      ensureFileSpy.mockRestore();
      ensureFileSyncSpy.mockRestore();
    },
  };
};
