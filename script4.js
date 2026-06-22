const fs = require('fs');
const path = 'app/admin/(dashboard)/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /const \[data, qData, iData\] = await Promise\.all\(\[\n\s*getPosts\(\),\n\s*getQuestions\(\),\n\s*getNewsletterIssues\(\)\n\s*\]\);\n\s*setPosts\(data \|\| \[\]\);/g,
  `const [dataRes, qData, iData] = await Promise.all([
        getPosts(),
        getQuestions(),
        getNewsletterIssues()
      ]);
      const data = dataRes.success ? dataRes.data : [];
      setPosts(data || []);`
);

fs.writeFileSync(path, content);
console.log('page.tsx updated');
