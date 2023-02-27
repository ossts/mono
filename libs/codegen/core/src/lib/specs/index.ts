import type { AbstractExternalGeneratorWithName } from '@ossts/codegen/common';
import { AbstractExternalGenerator } from '@ossts/codegen/common';
import { mergeObjectsWithSameShape } from '@ossts/shared/typescript/helpers';

import { generateWithCustom } from '..';

export const testExternalGeneratorName = 'test/external' as const;
class TestExternalGenerator
  extends AbstractExternalGenerator
  implements AbstractExternalGeneratorWithName
{
  name = testExternalGeneratorName;

  constructor(config?: TestExternalGeneratorConfig) {
    super();

    mergeObjectsWithSameShape(
      this,
      {
        generatorPath: 'test/external/custom/path',
        outputPath: 'test/external/output/path',
      },
      config
    );
  }
}
const textExternalGeneratorDefaultConfig = new TestExternalGenerator();
type TestExternalGeneratorConfig = Omit<TestExternalGenerator, 'name'>;

// TODO: write test for all those cases
generateWithCustom<TestExternalGenerator>({
  input: '',
  generators: [
    '*',
    {
      name: 'common/models',
    },
    {
      name: 'common/endpoints',
    },
    // example of external generator
    {
      name: 'test/external',
      generatorPath: 'test/external',
    },
    // create generator with constructor
    new TestExternalGenerator({
      generatorPath: 'test/external',
    }),
    // example of external generator with defaultConfig
    {
      ...textExternalGeneratorDefaultConfig,
      // Name here is required to allow TypeScript correctly identify object type
      // For some reason it cannot correctly identify shape while using spread
      name: textExternalGeneratorDefaultConfig.name,
    },
    // example of using uxname
    {
      name: 'uxname',
      uxname: 'this-can-be-anything',
      generatorPath: 'path/to/generator',
    },
  ],
});
