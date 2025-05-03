import type {
  ParsedClientOpenAPIV3,
  ParsedModelOpenAPIV3,
} from '@ossts/codegen/parsers/openapi/v3';

export const resolveRefsToParent = (
  data: ParsedClientOpenAPIV3
): ParsedClientOpenAPIV3 => {
  data.models.forEach((model) => resolveModelRecursive(model));

  return data;
};

const resolveModelRecursive = (
  model: ParsedModelOpenAPIV3 | null,
  parent?: ParsedModelOpenAPIV3
) => {
  if (!model) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (parent && (model as any).refToParent === '$$refToParent$$') {
    model.refToParent = parent;
  }

  resolveModelRecursive(model.link, model);

  model.properties.forEach((data) => resolveModelRecursive(data, model));

  model.enums.forEach((data) => resolveModelRecursive(data, model));
};
