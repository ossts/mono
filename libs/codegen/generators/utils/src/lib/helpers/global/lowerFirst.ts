import { lowerFirst as lowerFirstLodash } from 'lodash';

import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';

export const lowerFirst: CodegenHandlebarsHelperWrapper = () =>
  lowerFirstLodash;
