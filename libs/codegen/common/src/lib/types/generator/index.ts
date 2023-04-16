import type {
  AbstractGeneratorName,
  AbstractGeneratorSettings,
} from './AbstractGenerator';
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

/**
 * This interface should be as extend target for all external generators
 */
export type AbstractExternalGeneratorWithName = AbstractExternalGenerator &
  AbstractGeneratorName;
