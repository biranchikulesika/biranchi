const fs = require('fs');

function fixErrors(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /throw new Error\(([a-zA-Z0-9_]+)\.error\);/g,
    `throw new Error("error" in $1 ? $1.error : "Error");`
  );
  content = content.replace(
    /setDbError\(response\.error\);/g,
    `setDbError("error" in response ? response.error : "Error");`
  );
  fs.writeFileSync(filePath, content);
}

fixErrors('app/admin/(dashboard)/compose/page.tsx');
fixErrors('app/admin/(dashboard)/posts/page.tsx');
fixErrors('app/admin/(dashboard)/library/page.tsx');
fixErrors('app/admin/(dashboard)/personas/[persona]/page.tsx');

console.log('Fixed typescript union errors.');
