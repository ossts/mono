import { getSchema, getSchemaParser } from '@ossts/codegen/common';

import { parserVersionsPathMapping } from './helpers';
import { validateConfig } from './helpers/validateConfig';
import type { Config } from './types';

export const generate = async (config: Config) => {
  validateConfig(config);

  const {
    input,
    output = 'codegen',
    schemaType = 'openapi',
    parseOnly,
  } = config;

  const schema = await getSchema(input, schemaType);
  const { version } = schema;

  const parse = await getSchemaParser(
    schemaType,
    version,
    parserVersionsPathMapping
  );

  const result = await parse(schema);

  if (parseOnly) return result;

  // TODO: run generators
  // TODO: output results
  return;
};
