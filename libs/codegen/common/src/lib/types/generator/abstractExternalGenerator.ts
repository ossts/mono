import { AbstractGenerator } from './AbstractGenerator';
import type {
  AbstractGeneratorName,
  AbstractGeneratorSettings,
} from './AbstractGenerator';

export type AbstractExternalGeneratorSettings = AbstractGeneratorSettings;

export class AbstractExternalGenerator extends AbstractGenerator {
  override settings?: AbstractExternalGeneratorSettings;
}

/**
 * This interface should be as extend target for all external generators
 */
export type AbstractExternalGeneratorWithName = AbstractExternalGenerator &
  AbstractGeneratorName;
