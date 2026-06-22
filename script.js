import fs from 'fs';
const file = 'lib/schemas.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\.passthrough\(\)/g, '');
fs.writeFileSync(file, content);
console.log('Done');
