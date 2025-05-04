# [1.7.0](https://github.com/ossts/mono/compare/@ossts/codegen-v1.6.0...@ossts/codegen-v1.7.0) (2025-05-04)


### Bug Fixes

* **codegen:** various various fixes to fix CI build and other workspace issues ([cba0561](https://github.com/ossts/mono/commit/cba0561a0cf63a4cc7e0d84c98a8961673131514))


### Features

* **codegen:** add AllApiAllApiEntities AllApiModels types. Sort models in alphabetic order ([2a4f04a](https://github.com/ossts/mono/commit/2a4f04a72b51214409b66623aa868cdc82470032))
* **codegen:** add initialization helper and improve generation logic for FakerJS ([0580d8c](https://github.com/ossts/mono/commit/0580d8c6deb62a102c4cf1540a77e086ed0a5b6c))
* **codegen:** add MSW generator. Various updates/improvements to generators ([9304586](https://github.com/ossts/mono/commit/93045866539cf8e651603fd50b00c1c576ec8249))
* **workspace:** migrate to latest NX version ([070d2a6](https://github.com/ossts/mono/commit/070d2a61626e3b78558bc0bddc6ed1f285f6a0e4))

# [1.6.0](https://github.com/ossts/mono/compare/@ossts/codegen-v1.5.1...@ossts/codegen-v1.6.0) (2025-03-10)


### Features

* **codegen:** add 'refToParent' in parsed schema ([b26fd3f](https://github.com/ossts/mono/commit/b26fd3ff8aac4fe58a8867bae764e630459fda10))
* **codegen:** add mock/faker-js generator with initial implementation ([a28e430](https://github.com/ossts/mono/commit/a28e43003212841e9bfc0fbdcfd2d678315e8c65))
* **codegen:** improve FakerJS generator customization by adding new settings ([942cb05](https://github.com/ossts/mono/commit/942cb058717aea5d3ac7fa84a00874642a866f95))

## [1.5.1](https://github.com/ossts/mono/compare/@ossts/codegen-v1.5.0...@ossts/codegen-v1.5.1) (2024-05-08)


### Bug Fixes

* **codegen:** remove exportAllSufix in common/endpoints required by ApiEntities to have valid names ([a1130f2](https://github.com/ossts/mono/commit/a1130f256575ee16133d0afd55049ac6eab03093))
* **codegen:** update common/endpoints exportAll default name ([7c75288](https://github.com/ossts/mono/commit/7c75288149852f1e45db424e67123a803f04f30d))

# [1.5.0](https://github.com/ossts/mono/compare/@ossts/codegen-v1.4.0...@ossts/codegen-v1.5.0) (2024-05-07)


### Features

* **codegen:** update export all logic. Add namespace for generators ([a634e68](https://github.com/ossts/mono/commit/a634e688c1b0a238cde52758da6b1aeba186cb30))

# [1.4.0](https://github.com/ossts/mono/compare/@ossts/codegen-v1.3.2...@ossts/codegen-v1.4.0) (2024-04-14)


### Features

* **codegen:** add CLI and basic implementtion of external generators. Update exports naming logic ([4fdb2c3](https://github.com/ossts/mono/commit/4fdb2c33471f44b6e1bd4965e7e0c8d5c0cf7bbb))

## [1.3.2](https://github.com/ossts/mono/compare/@ossts/codegen-v1.3.1...@ossts/codegen-v1.3.2) (2024-04-14)


### Bug Fixes

* **codegen:** update Zod arrays to wrap nested type, update enums to use nativeEnum ([069286d](https://github.com/ossts/mono/commit/069286de536d0b74d14c947fb0ace69147954119))

## [1.3.1](https://github.com/ossts/mono/compare/@ossts/codegen-v1.3.0...@ossts/codegen-v1.3.1) (2024-04-13)


### Bug Fixes

* **codegen:** fix Zod schema generation for "null" and "undefined" values ([53a8137](https://github.com/ossts/mono/commit/53a813747635b4dcdf0b88395cde23f9e5b4bb00))

# [1.3.0](https://github.com/ossts/mono/compare/@ossts/codegen-v1.2.0...@ossts/codegen-v1.3.0) (2024-04-13)


### Features

* **codegen:** add generator for "Zod" schemas ([1893cd9](https://github.com/ossts/mono/commit/1893cd9286286dd294397fae05a0e2a28be4168f))

# [1.2.0](https://github.com/ossts/mono/compare/@ossts/codegen-v1.1.0...@ossts/codegen-v1.2.0) (2023-07-03)


### Bug Fixes

* **workspace:** fix semantic release filter paths ([b856ef7](https://github.com/ossts/mono/commit/b856ef77a2606667995a7bf4003bbed8a02e8305))


### Features

* **codegen:** add 'withExportAll' option to allow import as single object ([fdd04df](https://github.com/ossts/mono/commit/fdd04df1b37488ec9ad8d6bc5f60bf081a84535f))

# [1.1.0](https://github.com/ossts/mono/compare/@ossts/codegen-v1.0.2...@ossts/codegen-v1.1.0) (2023-06-28)


### Features

* **codegen:** update/Add CLI generator options. Endpoint generator improvements ([56d09dd](https://github.com/ossts/mono/commit/56d09ddadd5873405d2abfd6fe4577eaca011faa))

## [1.0.2](https://github.com/ossts/mono/compare/@ossts/codegen-v1.0.1...@ossts/codegen-v1.0.2) (2023-06-05)


### Bug Fixes

* **codegen:** update Readme.md ([820ad9d](https://github.com/ossts/mono/commit/820ad9d97ae4d20f6ba81cedcdbdc65859c84609))

## [1.0.1](https://github.com/ossts/mono/compare/@ossts/codegen-v1.0.0...@ossts/codegen-v1.0.1) (2023-06-03)


### Bug Fixes

* **codegen:** fix package dependencies for NPM publish. Update Readme.md ([b703043](https://github.com/ossts/mono/commit/b703043c73740e3665eee8b64f748bb766012d88))

# 1.0.0 (2023-06-03)


### Bug Fixes

* **codegen:** fix build ([b52a1e4](https://github.com/ossts/mono/commit/b52a1e49e88f29aa442334bdc8023c9b3a68db27))
* **codegen:** fix vite config node externals and missing precompiled-templates on CI build ([31cad39](https://github.com/ossts/mono/commit/31cad39351221540808d7e642a01f9ee30c499bd))


### Features

* **codegen:** add cli support. Update package build logic ([fa6e464](https://github.com/ossts/mono/commit/fa6e4640d1c645d606863f8b365f0b86c7aa8e1f))
* **codegen:** setup automatic release and NPM publish with semantic-release package ([f339ee9](https://github.com/ossts/mono/commit/f339ee9dcb58fd64d0e5f95d4a0c32c8768c6ea0))
* **codegen:** update to support different parsers. Add support for parser versioning ([cd2865d](https://github.com/ossts/mono/commit/cd2865d88b240229e5afa6de386d4900a8656228))
* **workspace:** add workspace plugin with cz scopes generator. Add commitlint ([2d9e2b9](https://github.com/ossts/mono/commit/2d9e2b9ec7a83a7390732c341b38d7a18eed3988))
* **workspace:** update to NX 16.2.2 ([069c66b](https://github.com/ossts/mono/commit/069c66b449bb663d66fc2a38dd4dbb4f4e221839))
