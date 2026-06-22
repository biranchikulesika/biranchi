const fs = require('fs');
const path = 'app/admin/(dashboard)/personas/[persona]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /const posts = await getPosts\(\);\n\s*const filteredPosts = \(posts \|\| \[\]\)\.filter\(\(p: any\) => p\.persona === dbPersonaName\);\n\s*setPersonaPosts\(filteredPosts\);/g,
  `const postsRes = await getPosts();
      const posts = postsRes.success ? postsRes.data : [];
      const filteredPosts = (posts || []).filter((p: any) => p.persona === dbPersonaName);
      setPersonaPosts(filteredPosts);`
);

content = content.replace(
  /await deletePost\(item\.rawItem\.id \|\| item\.rawItem\.slug\);/g, // Wait, there's no deletePost in personas except for the deleteEntity fn
  `/// deletePost`
);

content = content.replace(
  /await deletePost\((.*?)\)/g,
  `const res = await deletePost($1); if (!res.success) throw new Error(res.error);`
);


fs.writeFileSync(path, content);
console.log('personas/[persona]/page.tsx updated');
