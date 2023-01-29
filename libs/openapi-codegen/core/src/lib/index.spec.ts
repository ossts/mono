import { resolve } from 'node:path';

import { it } from 'vitest';

import { generate } from './';

it('Should be able to parse schema into required format', async () => {
  const schema = await generate({
    input: resolve(__dirname, './__mocks__/schema.json'),
    output: '',
  });

  // serialization/deserialization here is required to remove empty/undefined values
  expect(JSON.parse(JSON.stringify(schema))).toMatchSnapshot();
});
