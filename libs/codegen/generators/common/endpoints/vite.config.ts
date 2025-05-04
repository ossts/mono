import { builtinModules } from 'node:module';

import { join } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

const nodeBuiltinModules = builtinModules.concat(
  builtinModules.map((name) => `node:${name}`),
);

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/codegen/generators/common/endpoints',

  plugins: [
    dts({
      tsconfigPath: join(__dirname, 'tsconfig.lib.json'),
    }),

    nxViteTsPaths(),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: '../../../../../',
  //    }),
  //  ],
  // },

  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    outDir: '../../../../../dist/libs/codegen/generators/common/endpoints',
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: 'codegen-generators-common-endpoints',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forgot to update your package.json as well.
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: nodeBuiltinModules,
    },
  },

  test: {
    reporters: ['default'],
    coverage: {
      reportsDirectory:
        '../../../../../coverage/libs/codegen/generators/common/endpoints',
      provider: 'v8',
    },
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
