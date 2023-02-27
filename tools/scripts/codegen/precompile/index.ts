import chokidar from 'chokidar';
import rimraf from 'rimraf';

import { generatorsPath, generatorsProjectsPaths, isWatchMode } from './data';
import {
  generateIndex,
  processTemplateFile,
  processTemplateFileStats,
} from './helpers';
import { generateKnownGlobalHelpers, generateStats } from './helpers';

// TODO: add NX caching mechanism for this if possible

for (const paths of generatorsProjectsPaths.values()) {
  rimraf.sync(paths.precompiledTemplates);
}

const filesBeforeReadyEvent = new Set<string>();

let isReady = false;

const watcher = chokidar.watch('**/*.hbs', {
  cwd: generatorsPath,
});

watcher.on('ready', () => {
  isReady = true;

  filesBeforeReadyEvent.forEach((name) => processTemplateFileStats(name));

  generateStats();
  generateKnownGlobalHelpers();

  filesBeforeReadyEvent.forEach((name) => processTemplateFile(name));
  filesBeforeReadyEvent.clear();

  generateIndex();

  if (!isWatchMode) {
    watcher.close();
  }
});

watcher.on('all', (eventName, path, stats) => {
  if (eventName !== 'add' && eventName !== 'change' && eventName !== 'unlink')
    return;

  if (!isReady) {
    filesBeforeReadyEvent.add(path);
    return;
  }

  processTemplateFileStats(path, eventName);

  generateStats();
  generateKnownGlobalHelpers(path);

  processTemplateFile(path, eventName);

  generateIndex();
});
