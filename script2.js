const fs = require('fs');
const path = 'app/admin/(dashboard)/compose/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /const posts = await getPosts\(\);/g,
  `const postsResponse = await getPosts();\n      const posts = postsResponse.success ? postsResponse.data : [];`
);

content = content.replace(
  /const result = await validateCustomSlug\(customUrlVal, currentPostId, formData\.persona\);/,
  `const resultObj = await validateCustomSlug(customUrlVal, currentPostId, formData.persona);\n            const result = resultObj;` // validateCustomSlug is a local function right?
);

// handleSavePost (updatePost / createPost)
content = content.replace(
  /await updatePost\(currentPostId, payload\);/,
  `const updateRes = await updatePost(currentPostId, payload);\n        if (!updateRes.success) throw new Error(updateRes.error);`
);

content = content.replace(
  /const res = await createPost\(payload\);\n\s*if \(res && res\.id\) \{/,
  `const res = await createPost(payload);\n        if (!res.success) throw new Error(res.error);\n        if (res.data && res.data.id) {\n          const data = res.data;`
);

content = content.replace(
  /setCurrentPostId\(res\.id\);\n\s*setInitialSlug\(payload\.slug \|\| ''\);/,
  `setCurrentPostId(data.id);\n          setInitialSlug(payload.slug || '');`
);

fs.writeFileSync(path, content);
console.log('compose/page.tsx updated');
