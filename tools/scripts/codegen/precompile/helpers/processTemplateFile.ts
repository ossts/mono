import { parse, sep as pathSeparator, resolve } from 'node:path';

import {
  ensureFileSync,
  readFileSync,
  removeSync,
  writeFileSync,
} from 'fs-extra';
import handlebars from 'handlebars';
import { camelCase } from 'lodash';

import { getKnownHelpers, getTemplateType } from '.';
import {
  exportsMap,
  fileExtension,
  generatorPrecompiledTemplatesPath,
  generatorTemplatesPath,
  getGeneratorConfig,
  precompiledTemplateDisableLinters,
} from '../data';

export const processTemplateFile = async (
  path: string,
  eventName?: 'add' | 'change' | 'unlink'
) => {
  const generatorConfig = await getGeneratorConfig();

  const parsedPath = parse(path);
  const parsedPathSplit = parsedPath.dir.split(pathSeparator);

  let exportType = getTemplateType(path);

  const targetPathRelative = `${parsedPath.dir ? `${parsedPath.dir}/` : ''}${
    parsedPath.name
  }`;

  const targetPath = resolve(
    generatorPrecompiledTemplatesPath,
    `${targetPathRelative}.${fileExtension}`
  );
  const pathBasedNameUnderscored = parsedPathSplit.join('_');
  const camelCasedName = camelCase(
    `${pathBasedNameUnderscored}_${parsedPath.name}`
  );

  if (eventName === 'unlink') {
    removeSync(targetPath);
    delete exportsMap[exportType][targetPathRelative];
  } else {
    exportsMap[exportType][targetPathRelative] = camelCasedName;

    const contents = readFileSync(`${generatorTemplatesPath}/${path}`, 'utf-8');

    const knownHelpers = await getKnownHelpers(
      generatorConfig?.helpers.localHelpers
    );

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
