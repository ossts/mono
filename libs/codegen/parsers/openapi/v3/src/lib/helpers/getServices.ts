import { getOperation, getOperationParameters } from '.';
import type { OpenAPIV3Document, ParsedServiceOpenAPIV3 } from '../types';
import { isOperation, unique } from '../utils';

/**
 * Get the OpenAPI services
 */
export const getServices = (
  openApi: OpenAPIV3Document
): ParsedServiceOpenAPIV3[] => {
  const services = new Map<string, ParsedServiceOpenAPIV3>();

  Object.entries(openApi.paths)
    // sorting will make sure that URLs with dynamic arguments will come after static URLs
    .sort()
    .forEach(([url, path]) => {
      const pathParams = getOperationParameters(
        openApi,
        path?.parameters || []
      );

      url = url.replace(/\/{(.+?)}/g, '/:$1');

      if (!path) return;

      Object.entries(path).forEach(([method, op]) => {
        // Parse all the methods for this path
        if (!isOperation(method, op)) return;

        // Each method contains an OpenAPI operation, we parse the operation
        const tags = op.tags?.length ? op.tags.filter(unique) : ['Common'];
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
          const service: ParsedServiceOpenAPIV3 = services.get(
            operation.service
          ) || {
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
