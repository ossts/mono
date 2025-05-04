import type { ParsedClientOpenAPIV3 } from '../types';
import { postProcessModel } from './postProcessModel';
import { postProcessService } from './postProcessService';

export const postProcess = (
  client: ParsedClientOpenAPIV3,
): ParsedClientOpenAPIV3 => {
  return {
    ...client,
    models: client.models.map((model) => postProcessModel(model)),
    services: client.services.map((service) => postProcessService(service)),
  };
};
