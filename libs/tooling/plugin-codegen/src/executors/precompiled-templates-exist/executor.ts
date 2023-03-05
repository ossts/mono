import { writeFileSync } from 'node:fs';

import { ensureFileSync, readFileSync } from 'fs-extra';

import { joinPathFragments } from '@nrwl/devkit';
import type { ExecutorContext } from '@nrwl/devkit';

import type { PrecompiledTemplatesExistExecutorSchema } from './schema';

export default async function runExecutor(
  options: PrecompiledTemplatesExistExecutorSchema,
  context: ExecutorContext
) {
  if (!context.projectName || !context.projectsConfigurations) return;

  const { sourceRoot } =
    context.projectsConfigurations.projects[context.projectName ?? ''];

  if (!sourceRoot) return;

  const precompiledTemplatesIndex = joinPathFragments(
    sourceRoot,
    'lib/precompiled-templates/index.ts'
  );

  try {
    const content = readFileSync(precompiledTemplatesIndex, 'utf-8');
    if (!content.includes('export const precompiledTemplates')) {
      throw new Error('');
    }
  } catch (err) {
    ensureFileSync(precompiledTemplatesIndex);
    writeFileSync(
      precompiledTemplatesIndex,
      `export const precompiledTemplates = {};`
    );
  }

  return {
    success: true,
  };
}
