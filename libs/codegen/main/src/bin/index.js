#!/usr/bin/env node
const { generate } = require('../index');
const { version } = require('../package.json');
const { program } = require('./cli');

program.version(version).parse();

const options = program.opts();

generate(options);
