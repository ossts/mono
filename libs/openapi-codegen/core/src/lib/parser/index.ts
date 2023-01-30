import { getModels, getServers, getServices } from './helpers';
import { postProcess } from './post-process';
import type { OpenAPIDocument, ParsedClient } from './types';

export const parse = (openApi: OpenAPIDocument): ParsedClient => {
  const version = openApi.info.version;
  const servers = getServers(openApi);
  const models = getModels(openApi);
  const services = getServices(openApi);

  return postProcess({
    version,
    servers,
    models,
    services,
  });
};
