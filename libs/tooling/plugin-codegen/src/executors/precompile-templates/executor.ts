import { execSync } from 'node:child_process';

import { ensureFileSync, existsSync, writeFileSync } from 'fs-extra';
import rimraf from 'rimraf';

import { joinPathFragments } from '@nx/devkit';
import type { ExecutorContext } from '@nx/devkit';

import type { PrecompileTemplatesExecutorSchema } from './schema';

export default async function runExecutor(
  { watch }: PrecompileTemplatesExecutorSchema,
  context: ExecutorContext,
) {
  if (!context.projectName || !context.projectsConfigurations) return;

  const otherGeneratorProjectNames = Object.values(
    context.projectsConfigurations.projects,
  )
    .filter(
      (config) =>
        config.name !== context.projectName &&
        config.sourceRoot?.startsWith('libs/codegen/generators/'),
    )
    .map((config) => config.name);

  // we have to create precompiled templates for all generators
  // otherwise we would get error about missing import paths
  otherGeneratorProjectNames.forEach(
    (name) => name && ensurePrecompiledTemplatesPresent(context, name),
  );

  const { sourceRoot } =
    context.projectsConfigurations.projects[context.projectName ?? ''];

  if (!sourceRoot) return;

  const libPath = joinPathFragments(sourceRoot, 'lib');

  ensurePrecompiledTemplatesPresent(context, context.projectName, true);

  execSync(
    [
      'TS_NODE_PROJECT=tools/scripts/codegen/precompile/tsconfig.json',
      'node',
      // '--inspect-brk',
      '-r ts-node/register -r tsconfig-paths/register',
      'tools/scripts/codegen/precompile/index.ts',
      libPath,
      '--showLogs',
      '--internalCall',
      '--fileExtension=ts',
      `--watch=${watch}`,
    ].join(' '),
    {
      stdio: 'inherit',
    },
  );

  return {
    success: true,
  };
}

function ensurePrecompiledTemplatesPresent(
  context: ExecutorContext,
  projectName: string,
  forceUpdate = false,
) {
  if (!context.projectsConfigurations) return;

  const { sourceRoot } =
    context.projectsConfigurations.projects[projectName ?? ''];

  if (!sourceRoot) return;

  const libPath = joinPathFragments(sourceRoot, 'lib');

  const precompiledTemplatesPath = joinPathFragments(
    libPath,
    'precompiled-templates',
  );

  if (!forceUpdate && existsSync(precompiledTemplatesPath)) return;

  rimraf.sync(precompiledTemplatesPath);

  const precompiledTemplatesIndexPath = joinPathFragments(
    precompiledTemplatesPath,
    'index.ts',
  );

  ensureFileSync(precompiledTemplatesIndexPath);
  writeFileSync(
    precompiledTemplatesIndexPath,
    `export const precompiledTemplates = {};`,
  );
}
