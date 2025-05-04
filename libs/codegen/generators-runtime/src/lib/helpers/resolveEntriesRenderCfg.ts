import type {
  AbstractGeneratorWithName,
  GeneratorEntriesRenderConfig,
} from '@ossts/codegen/common';

import type { ResolvedGenerator } from '../types';

export const resolveEntriesRenderCfg = <
  TGenerators extends AbstractGeneratorWithName = AbstractGeneratorWithName,
>(
  generator: ResolvedGenerator<TGenerators>,
) => {
  if (!generator.templates) return;

  generator.resolvedEntriesRenderCfg = {};

  for (const name in generator.templates.entries) {
    if (generator.entriesRenderCfg?.[name]) {
      generator.resolvedEntriesRenderCfg[name] =
        generator.entriesRenderCfg[name];
      continue;
    }

    generator.resolvedEntriesRenderCfg[name] = parseEntryName(name);
  }
};

const parseEntryName = (name: string): GeneratorEntriesRenderConfig => {
  let dataPath = '';
  let nameFieldOrFn = '';
  let nameSuffix = '';

  if (name.includes('~~~')) {
    const [params, nameSuffixLocal] = name.split('~~~');
    const [path, nameField = 'name'] = params.split('___');

    if (path) {
      dataPath = path;
    }
    if (nameField) {
      nameFieldOrFn = nameField;
    }

    if (nameSuffixLocal) {
      nameSuffix = nameSuffixLocal;
    }
  } else {
    nameFieldOrFn = name;
  }

  return {
    dataPath,
    nameFieldOrFn,
    nameSuffix,
  };
};
