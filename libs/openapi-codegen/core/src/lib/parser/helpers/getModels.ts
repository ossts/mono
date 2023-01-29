import type { OpenAPIDocument, ParsedModel } from '../types';
import { getModel, getType, reservedWords } from './';

export const getModels = (openApi: OpenAPIDocument): ParsedModel[] => {
  if (!openApi.components?.schemas) return [];

  return Object.entries(openApi.components.schemas).map(([name, schema]) => {
    const type = getType(name);

    return getModel(
      openApi,
      schema,
      type.base.replace(reservedWords, '_$1'),
      true
    );
  });
};
