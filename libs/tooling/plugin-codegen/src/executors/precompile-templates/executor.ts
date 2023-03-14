import { execSync } from 'node:child_process';

import { ensureFileSync, writeFileSync } from 'fs-extra';
import rimraf from 'rimraf';

import { joinPathFragments } from '@nrwl/devkit';
import type { ExecutorContext } from '@nrwl/devkit';

import type { PrecompileTemplatesExecutorSchema } from './schema';

export default async function runExecutor(
  { watch }: PrecompileTemplatesExecutorSchema,
  context: ExecutorContext
) {
  if (!context.projectName || !context.projectsConfigurations) return;

  const { sourceRoot } =
    context.projectsConfigurations.projects[context.projectName ?? ''];

  if (!sourceRoot) return;

  const libPath = joinPathFragments(sourceRoot, 'lib');

  const precompiledTemplatesPath = joinPathFragments(
    libPath,
    'precompiled-templates'
  );

  rimraf.sync(precompiledTemplatesPath);

  const precompiledTemplatesIndexPath = joinPathFragments(
    precompiledTemplatesPath,
    'index.ts'
  );

  ensureFileSync(precompiledTemplatesIndexPath);
  writeFileSync(
    precompiledTemplatesIndexPath,
    `export const precompiledTemplates = {};`
  );

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
    }
  );

  return {
    success: true,
  };
}
