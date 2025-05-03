import { mockJSONSchemaV3, petStoreSchema } from '@ossts/codegen/common';

export const inputs = {
  complex: mockJSONSchemaV3,
  pet: petStoreSchema,
};

// using those configuration presets based on schema type make it easier
// to switch between them and load desired configuration
export const entityToPrimaryKeyNameDefaultMapping = {
  complex: {
    '*': '',
    File: 'id',
    ModelWithPattern: 'id',
  },
  pet: {
    ApiResponse: '',
  },
};
