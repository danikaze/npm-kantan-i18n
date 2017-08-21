const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const padStart = require('lodash/padStart');
const repeat = require('lodash/repeat');
const packageJson = require('../package.json');

const inputFilesRoot = 'src/';
const inputFiles = '*.js';
const outputDir = path.join(__dirname, '../docs/');
const clearOutputDir = process.argv.indexOf('-c') !== -1;
const verbose = process.argv.indexOf('-v') !== -1;
const dateNow = getDate();

if (clearOutputDir) {
  out(`Clearing docs dir: ${outputDir}`);
  rimraf(outputDir, generateDocs);
} else {
  generateDocs();
}

function out(...args) {
  if (verbose) {
    // eslint-disable-next-line
    console.log.apply(null, args);
  }
}

function getDate() {
  const date = new Date();
  const YYYY = date.getFullYear();
  const MM = padStart(date.getMonth() + 1, 2, '0');
  const DD = padStart(date.getDate(), 2, '0');
  const HH = padStart(date.getHours(), 2, '0');
  const mm = padStart(date.getMinutes(), 2, '0');
  const ss = padStart(date.getSeconds(), 2, '0');
  return `${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`;
}

function generateIndex() {
  const outputPath = path.resolve(outputDir, 'README.md');
  out(`Generating documentation index ${outputPath}`);

  let contents = `# ${packageJson.name} documentation\n\n`;
  contents += getListContents(outputDir, `${path.basename(outputDir)}/`);
  contents += `\n* * *\n\n_Generated on ${dateNow}_`;
  fs.writeFileSync(outputPath, contents);
}

function getListContents(outputPath, prefix, level) {
  level = level || 0;
  const pad1 = repeat('  ', level);
  const pad2 = `  ${pad1}`;
  const relativePath = outputPath.substring(outputPath.indexOf(prefix) + prefix.length);
  const files = [];
  const dirs = [];
  let contents = level > 0 ? `${pad1}* **${path.basename(relativePath)}/**\n` : '';

  fs.readdirSync(outputPath).forEach((file) => {
    const fullPath = path.join(outputPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      dirs.push(fullPath);
    } else {
      files.push(fullPath);
    }
  });

  dirs.sort().forEach((dir) => {
    contents += getListContents(dir, prefix, level + 1);
  });

  files.sort().forEach((file) => {
    let name = path.basename(file);
    name = name.substring(0, name.indexOf('.'));
    const link = file.substring(file.indexOf(prefix) + prefix.length);
    contents += `${pad2}* [${name}](${link})\n`;
  });

  return contents;
}

function isNamespace(element) {
  return element.kind === 'namespace';
}

function getNamespaceName(templateData) {
  const namespace = templateData.filter(isNamespace);
  return namespace.length ? namespace[0].name : '';
}

const getFolder = getNamespaceName;

function editTemplateData(templateData) {
  const namespaceIndex = templateData.findIndex(isNamespace);
  if (namespaceIndex !== -1) {
    templateData.splice(namespaceIndex, 1);
  }

  return templateData;
}

function generateDocs() {
  glob(inputFiles,
    { cwd: inputFilesRoot },
    (err, files) => {
      files.forEach((file) => {
        const templateData = jsdoc2md.getTemplateDataSync({ files: `${inputFilesRoot}${file}` });
        const outputPath = path.resolve(outputDir, getFolder(templateData), `${file}.md`);
        out(`Generating documentation for ${file} -> ${outputPath} (${templateData.length})`);
        const contents = jsdoc2md.renderSync({
          separators: true,
          data: editTemplateData(templateData),
          // plugin: 'dmd-bitbucket',
        });
        mkdirp.sync(path.dirname(outputPath));
        fs.writeFileSync(outputPath, contents);
      });
      generateIndex();
      process.exit();
    });
}
