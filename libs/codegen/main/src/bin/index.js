#!/usr/bin/env node
const { generate } = require('../index');
const { version } = require('../package.json');
const { createProgram } = require('./cli');

const { options } = createProgram(version);

generate(options);
