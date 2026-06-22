const fs = require('fs');
const path = 'app/admin/(dashboard)/compose/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// checkSlugExists fix
content = content.replace(
  /const isConflict = await checkSlugExists\(clean, currentId, currentPersona\);/,
  `const conflictRes = await checkSlugExists(clean, currentId, currentPersona);
  const isConflict = conflictRes.success ? conflictRes.data : false;`
);

content = content.replace(
  /if \(!\(await checkSlugExists\(candidate, currentId, currentPersona\)\)\) \{/,
  `const res1 = await checkSlugExists(candidate, currentId, currentPersona);
  if (!(res1.success ? res1.data : false)) {`
);

content = content.replace(
  /if \(!\(await checkSlugExists\(nextCandidate, currentId, currentPersona\)\)\) \{/,
  `const res2 = await checkSlugExists(nextCandidate, currentId, currentPersona);
    if (!(res2.success ? res2.data : false)) {`
);

fs.writeFileSync(path, content);
console.log('compose/page.tsx updated with checkSlugExists');
