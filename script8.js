const fs = require('fs');

const file = 'app/admin/(dashboard)/compose/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const created = await createPost\(payload\);\n\s*if \(created && created\.id\) {/g,
  `const createdRes = await createPost(payload);\n          if (!createdRes.success) throw new Error(createdRes.error);\n          const created = createdRes.data;\n          if (created && created.id) {`
);

content = content.replace(
  /await updatePost\(currentPostId, payload\);/, // at line 838
  `const updateRes2 = await updatePost(currentPostId, payload);\n        if (!updateRes2.success) throw new Error(updateRes2.error);`
);

content = content.replace(
  /await createPost\(payload\);/g, // at line 840
  `const createRes2 = await createPost(payload);\n        if (!createRes2.success) throw new Error(createRes2.error);`
);

fs.writeFileSync(file, content);
console.log('Fixed compose typescript.');
