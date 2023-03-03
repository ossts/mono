import * as path from 'path';

import type { Tree } from '@nrwl/devkit';
import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  readNxJson,
} from '@nrwl/devkit';
import { libraryGenerator as jsLibraryGenerator } from '@nrwl/js';

import type { GeneratorGeneratorSchema } from './schema';

interface NormalizedSchema extends GeneratorGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
}

export default async function (tree: Tree, options: GeneratorGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  const nxJson = readNxJson(tree);

  await jsLibraryGenerator(tree, {
    name: normalizedOptions.projectDirectory,
    buildable: true,
    skipFormat: true,
    config: 'project',
    tags: ['scope:ts', 'type:lib', 'project:codegen'].join(','),
    ...nxJson?.generators?.['@nrwl/js']?.library,
  });
  removeFiles(tree, normalizedOptions);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

function normalizeOptions(
  tree: Tree,
  options: GeneratorGeneratorSchema
): NormalizedSchema {
  const generatorsBasePath = 'codegen/generators';
  if (options.directory?.startsWith(generatorsBasePath)) {
    throw new Error(
      `Generator "directory" should be relative to "${generatorsBasePath}"`
    );
  }
  if (!options.directory && options.name.startsWith(generatorsBasePath)) {
    throw new Error(
      `Generator "name" should be relative to "${generatorsBasePath}"`
    );
  }

  options.name =
    (options.directory ? `${options.directory}/` : '') + options.name;
  options.directory = undefined;

  const name = names(options.name).fileName;

  const projectDirectory = path.join(generatorsBasePath, name);

  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
  };
}

function removeFiles(tree: Tree, options: NormalizedSchema) {
  tree.delete(path.join(options.projectRoot, 'src/index.ts'));
  tree.delete(
    path.join(options.projectRoot, 'src/lib', `${options.projectName}.ts`)
  );
  tree.delete(
    path.join(options.projectRoot, 'src/lib', `${options.projectName}.spec.ts`)
  );
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };

  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}
