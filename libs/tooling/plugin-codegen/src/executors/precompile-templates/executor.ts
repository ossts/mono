import { execSync } from 'node:child_process';

import { joinPathFragments } from '@nrwl/devkit';
import type { ExecutorContext } from '@nrwl/devkit';

import type { PrecompileTemplatesExecutorSchema } from './schema';

export default async function runExecutor(
  options: PrecompileTemplatesExecutorSchema,
  context: ExecutorContext
) {
  if (!context.projectName || !context.projectsConfigurations) return;

  const { sourceRoot } =
    context.projectsConfigurations.projects[context.projectName ?? ''];

  if (!sourceRoot) return;

  const libPath = joinPathFragments(sourceRoot, 'lib');

  execSync(
    [
      'TS_NODE_PROJECT=tools/scripts/codegen/precompile/tsconfig.json',
      'node',
      // '--inspect-brk',
      '-r ts-node/register -r tsconfig-paths/register',
      'tools/scripts/codegen/precompile/index.ts',
      libPath,
      '--internalCall',
      '--fileExtension=ts',
    ].join(' '),
    {
      stdio: 'inherit',
    }
  );

  return {
    success: true,
  };
}
