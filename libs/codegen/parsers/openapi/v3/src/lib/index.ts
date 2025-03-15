import type { AbstractCodegenSchema } from '@ossts/codegen/common';

import { getModels, getServers, getServices } from './helpers';
import { postProcess } from './post-process';
import type { ParsedClientOpenAPIV3 } from './types';
import { isOpenAPIV3Document } from './utils';

export const parse = async (
  openApi: AbstractCodegenSchema
): Promise<ParsedClientOpenAPIV3> => {
  if (!isOpenAPIV3Document(openApi)) {
    throw new Error(`Provided config is not a valid OpenAPIV3 Document`);
  }

  const version = openApi.info.version;
  const servers = getServers(openApi);
  const models = getModels(openApi).sort((a, b) => (a.name > b.name ? 1 : -1));
  const services = getServices(openApi);

  return postProcess({
    version,
    servers,
    models,
    services,
  });
};
