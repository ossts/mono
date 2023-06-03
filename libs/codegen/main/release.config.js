const { join } = require('node:path');

const { readJsonSync } = require('fs-extra');

const appRoot = require('app-root-path');
const generateReleaseConfig = require(`${appRoot}/scripts/generateReleaseConfig`);

const { name } = readJsonSync(`${__dirname}/package.json`);

/** @type {import('@types/semantic-release').Options} */
module.exports = generateReleaseConfig(
  name,
  'codegen-main',
  join('codegen', 'main')
);
