import { lowerCase as lowerCaseLodash } from 'lodash';

import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';

export const lowerCase: CodegenHandlebarsHelperWrapper = () => lowerCaseLodash;
