import type { AbstractExternalGeneratorSettings } from './AbstractExternalGenerator';
import { AbstractGenerator } from './AbstractGenerator';

// export * from './AbstractExternalGenerator';
export * from './AbstractExternalGeneratorUxname';
export * from './AbstractGenerate';
export * from './AbstractGenerator';
export * from './GeneratorExportTypes';
export * from './other';

export abstract class AbstractExternalGenerator extends AbstractGenerator {
  override settings?: AbstractExternalGeneratorSettings;
}
