# @ossts/codegen

Library for code generation with support for 3rd party generators (coming later).

The development of this package was inspired by awesome job done by developers of this package [OpenAPI Typescript Codegen](https://github.com/ferdikoomen/openapi-typescript-codegen/), but it has limited capabilities on what can be generated. This package would allow writing custom generators based on parsed schema.

## Installation

```sh
# npm
npm install --save-dev @ossts/codegen

# yarn
yarn add -D @ossts/codegen

# pnpm
pnpm add -D @ossts/codegen
```

## Usage

```sh
yarn codegen -i path/to/openapi-spec.json
```
