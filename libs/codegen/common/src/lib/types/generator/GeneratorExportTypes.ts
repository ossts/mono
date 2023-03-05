import type {
  generatorHelpersExportTypes,
  generatorTemplatesExportTypes,
} from '../../data';

export type GeneratorTemplatesExportType =
  (typeof generatorTemplatesExportTypes)[number];
export type GeneratorHelpersExportType =
  (typeof generatorHelpersExportTypes)[number];

export type GeneratorExportTypes =
  | GeneratorTemplatesExportType
  | GeneratorHelpersExportType;
