import chokidar from 'chokidar';
import rimraf from 'rimraf';

import {
  generatorPrecompiledTemplatesPath,
  generatorTemplatesPath,
  globals,
  isWatchMode,
  showLogs,
} from './data';
import {
  generateIndex,
  processTemplateFile,
  processTemplateFileStats,
} from './helpers';

rimraf.sync(generatorPrecompiledTemplatesPath);

const filesBeforeReadyEvent = new Set<string>();

const watcher = chokidar.watch('**/*.hbs', {
  cwd: generatorTemplatesPath,
});

watcher.on('ready', async () => {
  filesBeforeReadyEvent.forEach((name) => processTemplateFileStats(name));

  // we need to run in sequence to take advantage of caching for globalHelpers
  for await (const file of filesBeforeReadyEvent) {
    await processTemplateFile(file);
  }

  filesBeforeReadyEvent.clear();

  generateIndex();

  globals.watcherInitialized = true;

  if (!isWatchMode) {
    return watcher.close();
  }
  if (showLogs) {
    console.log('Updated', new Date().toLocaleTimeString());
  }
});

watcher.on('all', async (eventName, path) => {
  if (eventName !== 'add' && eventName !== 'change' && eventName !== 'unlink')
    return;

  if (!globals.watcherInitialized) {
    filesBeforeReadyEvent.add(path);
    return;
  }

  processTemplateFileStats(path, eventName);

  await processTemplateFile(path, eventName);

  generateIndex();
  if (showLogs) {
    console.log('Updated', new Date().toLocaleTimeString());
  }
});
