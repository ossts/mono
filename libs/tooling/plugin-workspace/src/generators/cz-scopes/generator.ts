import type { ScopesType } from 'cz-git';

import type { ProjectConfiguration, Tree } from '@nx/devkit';
import { getProjects, writeJson } from '@nx/devkit';

export default async function (tree: Tree) {
  const projectsMap: Map<
    string,
    ProjectConfiguration & {
      czScope?: {
        name: string;
        description: string;
      };
    }
  > = getProjects(tree);

  const scopes = Array.from(projectsMap.values()).reduce<ScopesType[0][]>(
    (acc, val) => {
      if (
        Object.prototype.hasOwnProperty.call(val, 'czScope') &&
        val.czScope !== undefined
      ) {
        const { name: value, description } = val.czScope;

        acc.push({
          value,
          name: `${value}: ${description}`,
        });
      }
      return acc;
    },
    [],
  );

  const sorted = scopes.sort((a, b) => {
    const nameA = typeof a === 'string' ? a : (a.value ?? a.name);
    const nameB = typeof b === 'string' ? b : (b.value ?? b.name);
    return nameA > nameB ? 1 : -1;
  });

  writeJson(tree, './__generated__/cz-scopes.json', sorted);
}
