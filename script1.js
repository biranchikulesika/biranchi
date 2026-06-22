const fs = require('fs');

const path = 'app/admin/(dashboard)/posts/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// loadData
content = content.replace(
  /const data = await getPosts\(\);\n\s*setItems\(data \|\| \[\]\);/,
  `const response = await getPosts();
    if (response.success) {
      setItems(response.data || []);
    } else {
      setDbError(response.error);
    }`
);

// autoSave Create
content = content.replace(
  /const res = await createPost\(payload\);\n\s*if \(res && res\.id\) {/,
  `const res = await createPost(payload);
          if (res.success && res.data && res.data.id) {
            const data = res.data;`
);

content = content.replace(
  /setEditingId\(res\.id\);\n\s*lastSavedData\.current = \{ \.\.\.formData, id: res\.id, draft: true, slug: payload\.slug \};\n\s*setFormData\(prev => \(\{ \.\.\.prev, id: res\.id, draft: true, slug: payload\.slug \}\)\);/,
  `setEditingId(data.id);
            lastSavedData.current = { ...formData, id: data.id, draft: true, slug: payload.slug };
            setFormData(prev => ({ ...prev, id: data.id, draft: true, slug: payload.slug }));`
);

// autoSave Update
content = content.replace(
  /await updatePost\(editingId, payload\);/,
  `const res = await updatePost(editingId, payload);\n          if (!res.success) throw new Error(res.error);`
);

// handlePublish Update
content = content.replace(
  /const res = await updatePost\(editingId, payload\);\n\s*lastSavedData\.current = res;/,
  `const res = await updatePost(editingId, payload);
        if (!res.success) throw new Error(res.error);
        lastSavedData.current = res.data;`
);

// handlePublish Create
content = content.replace(
  /const res = await createPost\(payload\);\n\s*lastSavedData\.current = res;/,
  `const res = await createPost(payload);
        if (!res.success) throw new Error(res.error);
        lastSavedData.current = res.data;`
);

// handleSaveDraftManual Update
content = content.replace(
  /const res = await updatePost\(editingId, payload\);\n\s*lastSavedData\.current = res;\n\s*setFormData\(res\);/,
  `const res = await updatePost(editingId, payload);
        if (!res.success) throw new Error(res.error);
        lastSavedData.current = res.data;
        setFormData(res.data);`
);

// handleSaveDraftManual Create
content = content.replace(
  /const res = await createPost\(payload\);\n\s*if \(res\) {\n\s*setEditingId\(res\.id\);\n\s*lastSavedData\.current = res;\n\s*setFormData\(res\);\n\s*}/,
  `const res = await createPost(payload);
        if (!res.success) throw new Error(res.error);
        if (res.data) {
          setEditingId(res.data.id);
          lastSavedData.current = res.data;
          setFormData(res.data);
        }`
);

fs.writeFileSync(path, content);
console.log('posts/page.tsx updated');
