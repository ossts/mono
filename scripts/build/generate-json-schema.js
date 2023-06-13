const { existsSync } = require('node:fs');
const { resolve } = require('node:path');

const { writeJson } = require('fs-extra');

const { withJSONSchema } = require('./args');
const { distRootPath } = require('./paths');

const tsj = require('typescript-json-schema');

module.exports.generateJSONSchema = async () => {
  if (!withJSONSchema) return;

  const sourceFile = resolve(distRootPath, 'index.d.ts');

  if (!existsSync(sourceFile)) return;

  /** @type {import('typescript-json-schema').CompilerOptions} */
  const compilerOptions = {
    esModuleInterop: true,
    skipLibCheck: true,
    skipDefaultLibCheck: true,
  };

  /** @type {import('typescript-json-schema').PartialArgs} */
  const settings = {
    // required: true,
  };

  const program = tsj.getProgramFromFiles([sourceFile], compilerOptions);

  const schema = tsj.generateSchema(program, withJSONSchema, settings);

  const outputPath = resolve(distRootPath, 'codegen-schema.json');

  await writeJson(outputPath, schema, {
    spaces: 2,
  });
};
