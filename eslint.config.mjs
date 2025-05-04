import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import nxEslintPlugin from '@nx/eslint-plugin';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: ['**/dist'],
  },
  { plugins: { '@nx': nxEslintPlugin } },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: 'scope:react',
              onlyDependOnLibsWithTags: [
                'scope:react',
                'scope:react,nextjs',
                'scope:ts',
              ],
            },
            {
              sourceTag: 'scope:nextjs',
              onlyDependOnLibsWithTags: [
                'scope:nextjs',
                'scope:react',
                'scope:react,nextjs',
                'scope:ts',
              ],
            },
            {
              sourceTag: 'scope:react,nextjs',
              onlyDependOnLibsWithTags: [
                'scope:react',
                'scope:nextjs',
                'scope:ts',
              ],
            },
            {
              sourceTag: 'scope:ts',
              onlyDependOnLibsWithTags: ['scope:ts'],
            },
            {
              sourceTag: 'scope:cy',
              onlyDependOnLibsWithTags: ['scope:cy', 'scope:ts'],
            },
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:module', 'type:lib'],
            },
            {
              sourceTag: 'type:e2e',
              onlyDependOnLibsWithTags: ['type:app', 'type:lib'],
            },
            {
              sourceTag: 'type:module',
              onlyDependOnLibsWithTags: ['type:module', 'type:lib'],
            },
            {
              sourceTag: 'type:publishable-lib',
              onlyDependOnLibsWithTags: ['type:lib'],
            },
            {
              sourceTag: 'type:lib',
              onlyDependOnLibsWithTags: ['type:lib'],
            },
            {
              sourceTag: 'project:shared',
              onlyDependOnLibsWithTags: ['project:shared'],
            },
            {
              sourceTag: 'project:codegen',
              onlyDependOnLibsWithTags: ['project:codegen', 'project:shared'],
            },
          ],
        },
      ],
    },
  },
  ...compat
    .config({
      extends: ['plugin:@nx/typescript'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
      rules: {
        ...config.rules,
        'no-extra-semi': 'off',
      },
    })),
  ...compat
    .config({
      extends: ['plugin:@nx/javascript'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
      rules: {
        ...config.rules,
        'no-extra-semi': 'off',
      },
    })),
  {
    files: ['**/*.json'],
    // Override or add rules here
    rules: {},
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
];
