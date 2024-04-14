const fs = require('node:fs');
const readline = require('node:readline');

const extractImportNameRegExp = new RegExp(
  /import.*?(?:from)?\s*'(.*?)';$/,
  'gm'
);

/**
 * Reads file line by line and extracts imports
 *
 * @param {string} path Path to file from which imports should be extracted
 * @returns {string[]}
 */
module.exports.extractImports = async (path) => {
  const fileStream = fs.createReadStream(path);

  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const requiredImports = new Set();

  let isMultilineImport = false;
  for await (const line of rl) {
    const trimmedLine = line.trim();
    if (!trimmedLine.length) continue;

    if (!trimmedLine.startsWith('import') && !isMultilineImport) break;

    if (trimmedLine.endsWith(`';`)) {
      isMultilineImport = false;
      extractImportNameRegExp.lastIndex = 0;
      requiredImports.add(extractImportNameRegExp.exec(line)[1]);
    } else {
      isMultilineImport = true;
      continue;
    }
  }

  return [...requiredImports];
};
