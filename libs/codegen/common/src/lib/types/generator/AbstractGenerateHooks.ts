export type AbstractGenerateHookBeforeAll<TResolvedGeneratorsMap> = (
  generatorsMap: TResolvedGeneratorsMap
) => void | boolean;

export type AbstractGenerateHookAfterAll<TResolvedGeneratorsMap> = (
  generatorsMap: TResolvedGeneratorsMap
) => void | boolean;

export type AbstractGenerateHookBeforeEach<
  TResolvedGeneratorsMap,
  TGeneratorNames extends string = string
> = (
  generatorsMap: TResolvedGeneratorsMap,
  generatorName: TGeneratorNames
) => void | boolean;

export type AbstractGenerateHookAfterEach<
  TResolvedGeneratorsMap,
  TGeneratorNames extends string = string
> = (
  generatorsMap: TResolvedGeneratorsMap,
  generatorName: TGeneratorNames
) => void | boolean;
