import type { AbstractGeneratorSettings } from './AbstractGenerator';
import { AbstractGenerator } from './AbstractGenerator';

export * from './AbstractExternalGeneratorUxname';
export * from './AbstractGenerate';
export * from './AbstractGenerator';
export * from './GeneratorExportTypes';
export * from './other';

export type AbstractExternalGeneratorSettings = AbstractGeneratorSettings;

export abstract class AbstractExternalGenerator extends AbstractGenerator {
  override settings?: AbstractExternalGeneratorSettings;
}
