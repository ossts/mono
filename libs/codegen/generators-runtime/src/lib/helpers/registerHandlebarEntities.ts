import Handlebars from 'handlebars';
import { camelCase } from 'lodash';

import type { AbstractGeneratorWithName } from '@ossts/codegen/common';

import type { ResolvedGenerator, ResolvedGeneratorsMap } from '../types';

export const registerHandlebarsEntities = <
  TGenerators extends AbstractGeneratorWithName = AbstractGeneratorWithName
>(
  generator: ResolvedGenerator<TGenerators>,
  allGenerators: ResolvedGeneratorsMap<TGenerators>
) => {
  const handlebarsInstance = Handlebars.create();

  generator.handlebarsInstance = handlebarsInstance;

  // ------- Register local generator entities -------
  if (generator.templates) {
    for (const name in generator.templates.partials) {
      handlebarsInstance.registerPartial(
        name,
        handlebarsInstance.template(generator.templates.partials[name])
      );
    }
  }
  if (generator.helpers) {
    for (const name in generator.helpers.localHelpers) {
      handlebarsInstance.registerHelper(
        name,
        generator.helpers.localHelpers[name]
      );
    }
  }

  // ------- Register GLOBALS -------
  for (const [, currentGenerator] of allGenerators) {
    if (currentGenerator.templates) {
      for (const name in currentGenerator.templates.globalPartials) {
        handlebarsInstance.registerPartial(
          camelCase(`${currentGenerator.globalName}_${name}`),
          handlebarsInstance.template(
            currentGenerator.templates.globalPartials[name]
          )
        );
      }
    }
    if (currentGenerator.helpers) {
      for (const name in currentGenerator.helpers.globalHelpers) {
        handlebarsInstance.registerHelper(
          camelCase(`${currentGenerator.globalName}_${name}`),
          currentGenerator.helpers.globalHelpers[name]
        );
      }
    }
  }

  generator.handlebarsInstance = handlebarsInstance;
};
