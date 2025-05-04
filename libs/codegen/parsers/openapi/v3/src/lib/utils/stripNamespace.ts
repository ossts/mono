const stripNamespaceRegExpNames = [
  'schemas',
  'responses',
  'parameters',
  'examples',
  'requestBodies',
  'headers',
  'securitySchemes',
  'links',
  'callbacks',
];

const stripNamespaceRegExp = new RegExp(
  `^#/components/(${stripNamespaceRegExpNames.join('|')})/`,
);

/**
 * Strip (OpenAPI) namespaces fom values.
 */
export const stripNamespace = (value: string): string => {
  return value.trim().replace(stripNamespaceRegExp, '');
};
