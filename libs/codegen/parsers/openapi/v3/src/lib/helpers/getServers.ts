import type { OpenAPIV3Document, ParsedClientServer } from '../types';

export const getServers = (
  openApi: OpenAPIV3Document
): ParsedClientServer[] | undefined => {
  const { servers } = openApi;

  if (!servers) return;

  return servers.map((server) => {
    const variables = server.variables || {};

    return Object.entries(variables).reduce<ParsedClientServer>(
      (acc, [key, value]) => {
        acc.url.replace(`{${key}}`, value.default);

        return acc;
      },
      {
        url: server.url.replace(/\/$/g, ''),
        description: server.description,
      }
    );
  });
};
