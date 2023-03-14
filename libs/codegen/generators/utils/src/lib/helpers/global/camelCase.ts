import { camelCase as camelCaseLodash } from 'lodash';

import type { CodegenHandlebarsHelperWrapper } from '@ossts/codegen/common';

export const camelCase: CodegenHandlebarsHelperWrapper = () => camelCaseLodash;
