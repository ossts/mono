import { resolve } from 'node:path';

import yargsParse from 'yargs-parser';

import type { ProjectGraphProjectNode } from '@nrwl/devkit';
import { readCachedProjectGraph, workspaceRoot } from '@nrwl/devkit';

import type { GeneratorExportType } from '@ossts/codegen/common';
import type { Dictionary } from '@ossts/shared/typescript/helper-types';

const fileExtension = 'ts';

const { watch } = yargsParse(process.argv.slice(2));

const isWatchMode = watch === 'true';

const generatorsRelativePath = 'libs/codegen/generators/';
const generatorsPath = resolve(workspaceRoot, generatorsRelativePath);

const projectGraph = readCachedProjectGraph();
let generatorsRuntimeProjectTmp: ProjectGraphProjectNode | null = null;
const generatorsProjects = Object.values(projectGraph.nodes).filter(
  (project) => {
    if (
      !generatorsRuntimeProjectTmp &&
      project.name.endsWith('generators-runtime')
    ) {
      generatorsRuntimeProjectTmp = project;
      return;
    }
    return project.data.root.startsWith(generatorsRelativePath);
  }
);

if (!generatorsRuntimeProjectTmp) {
  throw new Error(`Unable to find "generators-runtime" project`);
}
const generatorsRuntimeProject =
  generatorsRuntimeProjectTmp as ProjectGraphProjectNode;
if (!generatorsRuntimeProject.data.sourceRoot) {
  throw new Error(
    `${generatorsRuntimeProject.name} project.json sourceRoot is empty`
  );
}
const generatorsRuntimeProjectGeneratedDataPath = resolve(
  `${generatorsRuntimeProject.data.sourceRoot}`,
  'lib',
  '__generated__',
  'data'
);

const generatorsProjectsPaths = generatorsProjects.reduce((acc, project) => {
  if (!project.data?.sourceRoot) {
    throw new Error(`${project.name} project.json sourceRoot is empty`);
  }
  const relativeRootPath = project.data.root.replace(
    generatorsRelativePath,
    ''
  );

  const libPath = resolve(project.data.sourceRoot, 'lib');

  acc.set(relativeRootPath, {
    templates: resolve(libPath, 'templates'),
    precompiledTemplates: resolve(libPath, 'precompiled-templates'),
  });
  return acc;
}, new Map());

const generatorProjectNames: string[] = [...generatorsProjectsPaths.keys()];

const exportsMap = generatorProjectNames.reduce<
  Dictionary<Record<GeneratorExportType, Dictionary<string>>>
>((acc, name) => {
  acc[name] = {
    entries: {},
    partials: {},
    helpers: {},

    globalPartials: {},
    globalHelpers: {},
  };

  return acc;
}, {});

const defaultExportType: GeneratorExportType = 'partials';

const generatorsStatsMap = generatorProjectNames.reduce<
  Dictionary<Record<GeneratorExportType, Set<string>>>
>((acc, name) => {
  acc[name] = {
    entries: new Set(),
    partials: new Set(),
    helpers: new Set(),

    globalPartials: new Set(),
    globalHelpers: new Set(),
  };

  return acc;
}, {});

let knownGlobals: { helpers: Dictionary<Dictionary<boolean>> } = {
  helpers: {},
};

const precompiledTemplateDisableLinters = [
  '/* eslint-disable */',
  '// @ts-nocheck',
].join('\n');

export {
  projectGraph,
  fileExtension,
  isWatchMode,
  generatorsPath,
  generatorsProjectsPaths,
  generatorsStatsMap,
  exportsMap,
  defaultExportType,
  knownGlobals,
  precompiledTemplateDisableLinters,
  generatorsRuntimeProjectGeneratedDataPath,
};
