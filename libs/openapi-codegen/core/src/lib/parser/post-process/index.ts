import type { ParsedClient } from '../types';
import { postProcessModel } from './postProcessModel';
import { postProcessService } from './postProcessService';

export const postProcess = (client: ParsedClient): ParsedClient => {
  return {
    ...client,
    models: client.models.map((model) => postProcessModel(model)),
    services: client.services.map((service) => postProcessService(service)),
  };
};
