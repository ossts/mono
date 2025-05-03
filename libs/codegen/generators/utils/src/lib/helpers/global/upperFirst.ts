import { upperFirst as upperFirstLodash } from 'lodash';

import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';

export const upperFirst: CodegenHandlebarsHelperWrapper = () =>
  upperFirstLodash;
