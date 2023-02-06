import { it } from 'vitest';

import { parseReferencesBundle } from '@ossts/codegen/common';
import { mockJSONSchemaV3 } from '@ossts/codegen/common';

import { parse } from '.';

it('Should be able to parse schema into required format', async () => {
  const openApi = await parseReferencesBundle(mockJSONSchemaV3);

  const schema = await parse(openApi);

  // serialization/deserialization here is required to remove empty/undefined values
  expect(JSON.parse(JSON.stringify(schema))).toMatchSnapshot();
});
