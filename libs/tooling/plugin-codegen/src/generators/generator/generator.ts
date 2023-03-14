import type { Tree } from '@nrwl/devkit';
import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  offsetFromRoot,
  readNxJson,
  updateJson,
} from '@nrwl/devkit';
import { libraryGenerator as jsLibraryGenerator } from '@nrwl/js';

import { updateGeneratedContent } from '../update-generated-content/generator';
import type { GeneratorGeneratorSchema } from './schema';

export interface NormalizedSchema extends GeneratorGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
}

export default async function (tree: Tree, schema: GeneratorGeneratorSchema) {
  const options = normalizeOptions(tree, schema);
  const nxJson = readNxJson(tree);

  await jsLibraryGenerator(tree, {
    name: options.projectDirectory,
    buildable: true,
    skipFormat: true,
    config: 'project',
    tags: ['scope:ts', 'type:lib', 'project:codegen'].join(','),
    ...nxJson?.generators?.['@nrwl/js']?.library,
  });

  updateProjectTargets(tree, options);
  removeFiles(tree, options);
  addFiles(tree, options);

  updateGeneratedContent(tree, {
    currentGeneratorOptions: options,
  });

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

  const projectDirectory = joinPathFragments(generatorsBasePath, name);

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
  tree.delete(joinPathFragments(options.projectRoot, 'src/index.ts'));
  tree.delete(
    joinPathFragments(
      options.projectRoot,
      'src/lib',
      `${options.projectName}.ts`
    )
  );
  tree.delete(
    joinPathFragments(
      options.projectRoot,
      'src/lib',
      `${options.projectName}.spec.ts`
    )
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
    joinPathFragments(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

function updateProjectTargets(tree: Tree, options: NormalizedSchema) {
  const precompiledTemplatesPath = joinPathFragments(
    options.projectRoot,
    'src/lib/precompiled-templates'
  );

  updateJson(tree, `${options.projectRoot}/project.json`, (json) => {
    json.targets['precompile-templates'] = {
      executor: '@ossts/plugin-codegen:precompile-templates',
      outputs: ['{options.outputPath}'],
      options: {
        outputPath: precompiledTemplatesPath,
      },
    };

    return json;
  });
}
