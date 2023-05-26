import { join } from 'node:path';

import { defineConfig } from 'tsup';

const { NX_WORKSPACE_ROOT = process.cwd(), UXNX_LIB_PATH = '' } = process.env;

export default defineConfig({
  clean: true,
  // Outputs `dist/a.js` and `dist/b.js`.
  entry: [join(__dirname, 'src/index.ts')],
  tsconfig: join(__dirname, 'tsconfig.lib.json'),
  outDir: join(NX_WORKSPACE_ROOT, 'dist', UXNX_LIB_PATH),
  // format: ['cjs', 'esm'], // generate cjs and esm files
  dts: true,
  sourcemap: true,
  skipNodeModulesBundle: true,
  metafile: true,
});
