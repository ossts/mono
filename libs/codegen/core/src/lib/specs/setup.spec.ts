// https://vitest.dev/config/#setupfiles
import { mkdirSync, readFile, writeFile } from 'node:fs';
import { dirname } from 'node:path';
import path from 'node:path';
import { promisify } from 'node:util';

import { type PathOrFileDescriptor } from 'fs-extra';

import type { AbstractCodegenParsedClient } from '@ossts/codegen/common';
import type { ParsedClientOpenAPIV3 } from '@ossts/codegen/parsers/openapi/v3';
import { emptyFn } from '@ossts/shared/typescript/helpers';

import { generate } from '..';
import { inputs } from '../debug/settings';
import { resolveRefsToParent } from '../helpers/resolveRefsToParent';
import { generatorsSettings } from './helpers.spec';

export const parsedSchemas: Record<
  'complex' | 'pet',
  ParsedClientOpenAPIV3 | null
> = {
  complex: null,
  pet: null,
};

const modelsCachePathsMapping = {
  complex: path.resolve(__dirname, '../parsed/complex.json'),
  pet: path.resolve(__dirname, '../parsed/pet.json'),
};

const readFilePromisified = promisify(readFile);

const encode = (schema: AbstractCodegenParsedClient) =>
  JSON.stringify(schema, (key, value) => {
    if (key === 'refToParent') {
      return '$$refToParent$$';
    }
    return value;
  });

beforeAll(async () => {
  try {
    const [complex, pet] = await Promise.all([
      readFilePromisified(modelsCachePathsMapping.complex, {
        encoding: 'utf-8',
      }),
      readFilePromisified(modelsCachePathsMapping.pet, {
        encoding: 'utf-8',
      }),
    ]);

    Object.assign(parsedSchemas, {
      complex: resolveRefsToParent(JSON.parse(complex)),
      pet: resolveRefsToParent(JSON.parse(pet)),
    });
  } catch (err) {
    mkdirSync(dirname(modelsCachePathsMapping.complex), {
      recursive: true,
    });

    const [complex, pet] = await Promise.all([
      await generate({
        input: inputs.complex,
        generatorsSettings,
        parseOnly: true,
      }),
      await generate({
        input: inputs.pet,
        generatorsSettings,
        parseOnly: true,
      }),
    ]);

    if (complex) {
      writeFile(modelsCachePathsMapping.complex, encode(complex), emptyFn);
    }
    if (pet) {
      writeFile(modelsCachePathsMapping.pet, encode(pet), emptyFn);
    }

    Object.assign(parsedSchemas, {
      complex,
      pet,
    });
  }
});

// https://vitest.dev/api/vi.html#vi-mock
vi.mock(import('fs-extra'), async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await importOriginal();

  return {
    ...mod,

    ensureFile: emptyFn,
    ensureFileSync: emptyFn,
    writeFile: (async (
      path: PathOrFileDescriptor,
      content: string | NodeJS.ArrayBufferView
    ) => {
      await expect(content).toMatchFileSnapshot(path.toString() + '.snap');
    }) as any,
  };
});
