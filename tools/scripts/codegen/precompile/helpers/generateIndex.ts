import { sep as pathSeparator } from 'node:path';

import { ensureFileSync, writeFileSync } from 'fs-extra';
import { camelCase } from 'lodash';

import type { Dictionary } from '@ossts/shared/typescript/helper-types';

import {
  exportsMap,
  fileExtension,
  generatorPrecompiledTemplatesPath,
} from '../data';

export const generateIndex = (path?: string) => {
  let content = '';

  const exportsMapEntries = Object.entries(exportsMap);

  const imports: string[] = [];
  exportsMapEntries.forEach(([key, exports]) => {
    Object.entries(exports).forEach(([path, name]) => {
      imports.push(`import { ${name} } from './${path}';`);
    });
  });

  content += imports.join('\n');
  content += '\n\n';

  const precompiledTemplates = exportsMapEntries.reduce<string[]>(
    (acc, [key, exports]) =>
      acc.concat(generatePrecompiledSection(key, exports)),
    [],
  );

  content += [
    'export const precompiledTemplates = {',
    ...precompiledTemplates,
    '}\n',
  ].join('\n');

  const indexFilePath = `${generatorPrecompiledTemplatesPath}/index.${fileExtension}`;

  ensureFileSync(indexFilePath);
  writeFileSync(indexFilePath, content);
};

const generatePrecompiledSection = (
  key: string,
  exports: Dictionary<string>,
) => {
  return [
    `  ${key}: {`,
    '    ' +
      Object.entries(exports)
        .map(([path, name]) => {
          let subKey = '';

          if (key === 'entries') {
            subKey = path.split(pathSeparator).at(-1) ?? '';
          } else {
            subKey = camelCase(path.split(pathSeparator).slice(1).join('_'));
          }

          return `'${subKey}': ${name}`;
        })
        .join(',\n    '),
    `  },`,
  ];
};
