import fs from 'fs';
const file = 'app/admin/(dashboard)/compose/page.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/<textarea /g, '<textarea data-block-id={block.id} ');
fs.writeFileSync(file, content);
console.log('Done');
