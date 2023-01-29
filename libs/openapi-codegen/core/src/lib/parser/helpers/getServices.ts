import type { OpenAPIDocument, ParsedService } from '../types';
import { isOperation, unique } from '../utils';
import { getOperation, getOperationParameters } from './';

/**
 * Get the OpenAPI services
 */
export const getServices = (openApi: OpenAPIDocument): ParsedService[] => {
  const services = new Map<string, ParsedService>();

  Object.entries(openApi.paths).forEach(([url, path]) => {
    const pathParams = getOperationParameters(openApi, path?.parameters || []);

    if (!path) return;

    Object.entries(path).forEach(([method, op]) => {
      // Parse all the methods for this path
      if (!isOperation(method, op)) return;

      // Each method contains an OpenAPI operation, we parse the operation
      const tags = op.tags?.length ? op.tags.filter(unique) : ['Default'];
      tags.forEach((tag) => {
        const operation = getOperation(
          openApi,
          url,
          method,
          tag,
          op,
          pathParams
        );

        // If we have already declared a service, then we should fetch that and
        // append the new method to it. Otherwise we should create a new service object.
        const service: ParsedService = services.get(operation.service) || {
          name: operation.service,
          operations: [],
          imports: [],
        };

        // Push the operation in the service
        service.operations.push(operation);
        service.imports.push(...operation.imports);
        services.set(operation.service, service);
      });
    });
  });

  return Array.from(services.values());
};
