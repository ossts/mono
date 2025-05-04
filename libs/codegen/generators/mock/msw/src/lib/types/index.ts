import type { AbstractGeneratorSettings } from '@ossts/codegen/common';

import type { MockMswGenerator, mockMswGeneratorName } from '../generator';

/* eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type */
export interface MockMswGeneratorSettings extends AbstractGeneratorSettings {}

export type MockMswGeneratorName = typeof mockMswGeneratorName;

export type MockMswGeneratorConfig = Omit<MockMswGenerator, 'name'>;
