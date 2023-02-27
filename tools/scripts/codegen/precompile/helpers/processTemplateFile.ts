import { parse, sep as pathSeparator, resolve } from 'node:path';

import {
  ensureFileSync,
  readFileSync,
  removeSync,
  writeFileSync,
} from 'fs-extra';
import handlebars from 'handlebars';
import { camelCase } from 'lodash';

import { getTemplateType } from '.';
import {
  exportsMap,
  fileExtension,
  generatorsProjectsPaths,
  generatorsStatsMap,
  knownGlobals,
  precompiledTemplateDisableLinters,
} from '../data';

export const processTemplateFile = (
  path: string,
  eventName?: 'add' | 'change' | 'unlink'
) => {
  const [generatorName, requiredPath] = path.split('/src/lib/templates/');
  const { templates, precompiledTemplates } =
    generatorsProjectsPaths.get(generatorName);

  const parsedPath = parse(requiredPath);
  const parsedPathSplit = parsedPath.dir.split(pathSeparator);

  let exportType = getTemplateType(requiredPath);

  const targetPathRelative = `${parsedPath.dir ? `${parsedPath.dir}/` : ''}${
    parsedPath.name
  }`;

  const targetPath = resolve(
    precompiledTemplates,
    `${targetPathRelative}.${fileExtension}`
  );
  const pathBasedNameUnderscored = parsedPathSplit.join('_');
  const camelCasedName = camelCase(
    `${pathBasedNameUnderscored}_${parsedPath.name}`
  );

  if (eventName === 'unlink') {
    removeSync(targetPath);
    delete exportsMap[generatorName][exportType][targetPathRelative];
  } else {
    exportsMap[generatorName][exportType][targetPathRelative] = camelCasedName;

    const contents = readFileSync(`${templates}/${requiredPath}`, 'utf-8');

    // we need to combine global helpers with generator local helpers
    const knownHelpers = {
      ...knownGlobals.helpers[generatorName],
    };
    generatorsStatsMap[generatorName].helpers.forEach((helper) => {
      knownHelpers[helper] = true;
    });

    const precompiledTemplate = handlebars.precompile(contents, {
      strict: true,
      noEscape: true,
      preventIndent: true,
      knownHelpersOnly: true,
      knownHelpers,
    });
    const result = `${precompiledTemplateDisableLinters}\n\nexport const ${camelCasedName} = ${precompiledTemplate};\n`;

    ensureFileSync(targetPath);
    writeFileSync(targetPath, result);
  }
};
