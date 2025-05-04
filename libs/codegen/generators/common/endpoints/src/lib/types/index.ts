import type { AbstractGeneratorSettings } from '@ossts/codegen/common';

import type {
  CommonEndpointsGenerator,
  commonEndpointsGeneratorName,
} from '../generator';

/* eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type */
export interface CommonEndpointsGeneratorSettings
  extends AbstractGeneratorSettings {}

export type CommonEndpointsGeneratorName = typeof commonEndpointsGeneratorName;

export type CommonEndpointsGeneratorConfig = Omit<
  CommonEndpointsGenerator,
  'name'
>;
