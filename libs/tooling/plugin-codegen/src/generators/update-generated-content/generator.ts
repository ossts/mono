import { sep as pathSeparator } from 'node:path';

import type { Tree } from '@nx/devkit';
import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  readCachedProjectGraph,
} from '@nx/devkit';

import type { Dictionary } from '@ossts/shared/typescript/helper-types';

import type { NormalizedSchema as GeneratorGeneratorNormalizedSchema } from '../generator/generator';
import type { UpdateGeneratedContentGeneratorSchema } from './schema';

interface NormalizedSchema extends UpdateGeneratedContentGeneratorSchema {
  projectRoot: string;
  currentGeneratorOptions?: GeneratorGeneratorNormalizedSchema;
}

export async function updateGeneratedContent(
  tree: Tree,
  options: UpdateGeneratedContentGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);

  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

function normalizeOptions(
  tree: Tree,
  options: UpdateGeneratedContentGeneratorSchema
): NormalizedSchema {
  const projectRoot = joinPathFragments(
    getWorkspaceLayout(tree).libsDir,
    'codegen'
  );

  return {
    ...options,
    projectRoot,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const { nodes: projectNodes } = readCachedProjectGraph();

  const projectNodesValues = Object.values(projectNodes);
  const parsersRootPaths = projectNodesValues
    .filter((node) => node.data.root.startsWith('libs/codegen/parsers'))
    .map((node) => node.data.root);
  const parsers = parsersRootPaths.reduce<Dictionary<string[]>>((acc, path) => {
    const [, , , name, version] = path.split(pathSeparator);

    if (!acc[name]) {
      acc[name] = [];
    }

    acc[name].push(version);

    return acc;
  }, {});

  const generatorBasePath = 'libs/codegen/generators/';
  const generatorsRootPaths = projectNodesValues
    .filter((node) => node.data.root.startsWith(generatorBasePath))
    .map((node) => node.data.root);
  if (
    options.currentGeneratorOptions &&
    !generatorsRootPaths.includes(options.currentGeneratorOptions.projectRoot)
  ) {
    generatorsRootPaths.push(options.currentGeneratorOptions.projectRoot);
  }

  const generators = generatorsRootPaths.reduce<ReturnType<typeof names>[]>(
    (acc, path) => {
      const name = path.replace(new RegExp(`^${generatorBasePath}`), '');

      acc.push(names(name));

      return acc;
    },
    []
  );

  const templateOptions = {
    ...options,
    parsers,
    generators,
    template: '',
  };
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

export default updateGeneratedContent;
