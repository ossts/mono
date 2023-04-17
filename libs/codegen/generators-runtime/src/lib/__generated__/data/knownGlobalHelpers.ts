export const knownGlobalHelpers = {
  commonEndpoints: async () =>
    (await import('@ossts/codegen/generators/common/endpoints')).helpers
      .globalHelpers,
  commonModels: async () =>
    (await import('@ossts/codegen/generators/common/models')).helpers
      .globalHelpers,
  utils: async () =>
    (await import('@ossts/codegen/generators/utils')).helpers.globalHelpers,
};
