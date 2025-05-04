import { getModel, getType, reservedWords } from '.';
import type { OpenAPIV3Document, ParsedModelOpenAPIV3 } from '../types';

export const getModels = (
  openApi: OpenAPIV3Document,
): ParsedModelOpenAPIV3[] => {
  if (!openApi.components?.schemas) return [];

  return Object.entries(openApi.components.schemas).map(([name, schema]) => {
    const type = getType(name);

    return getModel(
      openApi,
      schema,
      type.base.replace(reservedWords, '_$1'),
      true,
    );
  });
};
