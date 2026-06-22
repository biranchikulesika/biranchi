const fs = require('fs');
let code = fs.readFileSync('app/admin/(dashboard)/compose/page.tsx', 'utf8');
code = code.replace(/\/\/ Block definitions parser[^]*?function slugify/m, 'function slugify');
fs.writeFileSync('app/admin/(dashboard)/compose/page.tsx', code);
console.log('Done');
