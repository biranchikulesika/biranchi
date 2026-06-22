import fs from 'fs';
import path from 'path';

function getAllFiles(dirPath, filesConfig) {
  const files = fs.readdirSync(dirPath);

  filesConfig = filesConfig || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      filesConfig = getAllFiles(dirPath + "/" + file, filesConfig)
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        filesConfig.push(path.join(dirPath, "/", file))
      }
    }
  });

  return filesConfig;
}

const adminDir = path.join(process.cwd(), 'app');
const filesToProcess = getAllFiles(adminDir);

filesToProcess.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/\\n/g, '\n').replace(/;;/g, ';');
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Fixed syntax in', file);
  }
});
