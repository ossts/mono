import { AbstractGenerator } from './AbstractGenerator';
import type {
  AbstractGeneratorName,
  AbstractGeneratorSettings,
} from './AbstractGenerator';

export type AbstractExternalGeneratorSettings = AbstractGeneratorSettings;

export abstract class AbstractExternalGenerator extends AbstractGenerator {
  override settings?: AbstractExternalGeneratorSettings;

  /**
   * This should point to path with export of precompiled Handlebars templates.
   */
  override generatorPath?: string = '';
}

/**
 * This interface should be as extend target for all external generators
 */
export type AbstractExternalGeneratorWithName = AbstractExternalGenerator &
  AbstractGeneratorName;
