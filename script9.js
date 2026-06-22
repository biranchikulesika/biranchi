const fs = require('fs');

const file = 'app/admin/(dashboard)/compose/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const updateRes = const updateRes2 = await updatePost\(currentPostId, payload\);\n\s*if \(!updateRes2\.success\) throw new Error\("error" in updateRes2 \? updateRes2\.error : "Error"\);\n\s*if \(!updateRes\.success\) throw new Error\("error" in updateRes \? updateRes\.error : "Error"\);/g,
  `const updateRes = await updatePost(currentPostId, payload);
          if (!updateRes.success) throw new Error("error" in updateRes ? updateRes.error : "Error");`
);

content = content.replace(
  /try {\n\s*if \(currentPostId\) {\n\s*await updatePost\(currentPostId, payload\);/g,
  `try {
      if (currentPostId) {
        const upRes = await updatePost(currentPostId, payload);
        if (!upRes.success) throw new Error("error" in upRes ? upRes.error : "Error");`
);

fs.writeFileSync(file, content);
console.log('Fixed syntax error in compose/page.tsx');
