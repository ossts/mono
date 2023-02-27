import type { AbstractExternalGeneratorWithName } from '@ossts/codegen/common';
import { getSchema, getSchemaParser } from '@ossts/codegen/common';
import { runGenerators } from '@ossts/codegen/generators-runtime';

import { parserVersionsPathMapping } from './helpers';
import { validateConfig } from './helpers/validateConfig';
import type { Config } from './types';

export const generateWithCustom = async <
  TGenerators extends AbstractExternalGeneratorWithName = AbstractExternalGeneratorWithName
>(
  config: Config<TGenerators>
) => {
  validateConfig(config);

  const {
    input,
    schemaType = 'openapi',
    parseOnly,
    ...generatorConfig
  } = config;

  const schema = await getSchema(input, schemaType);
  const { version } = schema;

  const parse = await getSchemaParser(
    schemaType,
    version,
    parserVersionsPathMapping
  );

  const parsedSchema = await parse(schema);

  if (parseOnly) return parsedSchema;

  await runGenerators<TGenerators>({
    ...generatorConfig,
    parsedSchema,
  });

  return;
};

type FakeExternalGenerator = { name: 'uxname'; uxname: '' };
export const generate = (config: Config<FakeExternalGenerator>) =>
  generateWithCustom(config);
