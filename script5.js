const fs = require('fs');
const path = 'app/admin/(dashboard)/library/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /const \[\n\s*posts, fieldNotes, thoughtFragments, fragments, questions, journalMoments\n\s*\] = await Promise\.all\(\[\n\s*getPosts\(\),\n\s*getFieldNotes\(\),\n\s*getThoughtFragments\(\),\n\s*getFragments\(\),\n\s*getQuestions\(\),\n\s*getJournalMoments\(\)\n\s*\]\);\n\n\s*const unified: UnifiedItem\[\] = \[\];\n\n\s*\/\/ 1\. Articles \(Posts\)\n\s*\(posts \|\| \[\]\)\.forEach/g,
  `const [
        postsRes, fieldNotes, thoughtFragments, fragments, questions, journalMoments
      ] = await Promise.all([
        getPosts(),
        getFieldNotes(),
        getThoughtFragments(),
        getFragments(),
        getQuestions(),
        getJournalMoments()
      ]);

      const unified: UnifiedItem[] = [];

      const posts = postsRes.success ? postsRes.data : [];

      // 1. Articles (Posts)
      (posts || []).forEach`
);

content = content.replace(
  /await deletePost\(item\.rawItem\.id \|\| item\.rawItem\.slug\);/,
  `const res = await deletePost(item.rawItem.id || item.rawItem.slug);
          if (!res.success) throw new Error(res.error);`
);

fs.writeFileSync(path, content);
console.log('library/page.tsx updated');
