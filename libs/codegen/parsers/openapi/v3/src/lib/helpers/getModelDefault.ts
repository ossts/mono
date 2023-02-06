import type {
  OpenAPIV3SchemaWithEnumExtension,
  ParsedModelOpenAPIV3,
} from '../types';

export const getModelDefault = (
  schema: OpenAPIV3SchemaWithEnumExtension,
  model?: ParsedModelOpenAPIV3
): string | undefined => {
  if (schema.default === undefined) {
    return undefined;
  }

  if (schema.default === null) {
    return 'null';
  }

  const type = schema.type || typeof schema.default;

  switch (type) {
    case 'integer':
    case 'bigint':
    case 'number':
      if (model?.export === 'enum' && model.enum?.[schema.default]) {
        return model.enum[schema.default].value;
      }
      return schema.default;

    case 'boolean':
      return JSON.stringify(schema.default);

    case 'string':
      return `'${schema.default}'`;

    case 'object':
      try {
        return JSON.stringify(schema.default, null, 4);
      } catch (e) {
        // Ignore
      }
  }

  return undefined;
};
