import Handlebars from 'handlebars';

import type { AbstractGeneratorWithName } from '@ossts/codegen/common';

import type { ResolvedGenerator } from '../types';

export const registerHandlebarsEntities = <
  TGenerators extends AbstractGeneratorWithName = AbstractGeneratorWithName
>(
  generator: ResolvedGenerator<TGenerators>
) => {
  const handlebarsInstance = Handlebars.create();

  generator.handlebarsInstance = handlebarsInstance;

  if (!generator.templates) return;

  // ------- Register local generator entities -------
  for (const name in generator.templates.partials) {
    handlebarsInstance.registerPartial(
      name,
      generator.templates.partials[name]
    );
  }
  for (const name in generator.templates.helpers) {
    handlebarsInstance.registerPartial(name, generator.templates.helpers[name]);
  }

  // ------- Register GLOBALS -------
  for (const name in generator.templates.globalPartials) {
    handlebarsInstance.registerPartial(
      `${generator.globalName}__${name}`,
      generator.templates.globalPartials[name]
    );
  }
  for (const name in generator.templates.globalHelpers) {
    handlebarsInstance.registerHelper(
      `${generator.globalName}__${name}`,
      generator.templates.globalHelpers[name]
    );
  }

  generator.handlebarsInstance = handlebarsInstance;
};
