import type { AbstractGeneratorSettings } from '@ossts/codegen/common';

import type {
  MockFakerJsGenerator,
  mockFakerJsGeneratorName,
} from '../generator';

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface MockFakerJsGeneratorSettings
  extends AbstractGeneratorSettings {}

export type MockFakerJsGeneratorName = typeof mockFakerJsGeneratorName;

export type MockFakerJsGeneratorConfig = Omit<MockFakerJsGenerator, 'name'>;
