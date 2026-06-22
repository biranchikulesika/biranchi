import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      if (f.endsWith('.tsx') || f.endsWith('.ts')) {
        callback(dirPath);
      }
    }
  });
}

walkDir(path.join(process.cwd(), 'app'), (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace item.draft and post.draft checks mappings in UI
  content = content.replace(/item\.draft === true/g, "item.status === 'draft'");
  content = content.replace(/item\.draft === false/g, "item.status === 'published'");
  content = content.replace(/item\.draft(\s*&&)/g, "item.status === 'draft'$1");
  content = content.replace(/item\.draft(\s*\?)/g, "item.status === 'draft'$1");

  content = content.replace(/post\.draft === true/g, "post.status === 'draft'");
  content = content.replace(/post\.draft === false/g, "post.status === 'published'");
  content = content.replace(/!post\.draft/g, "post.status === 'published'");
  content = content.replace(/post\.draft(\s*&&)/g, "post.status === 'draft'$1");
  content = content.replace(/post\.draft(\s*\|\|)/g, "post.status === 'draft'$1");
  content = content.replace(/post\.draft(\s*\?)/g, "post.status === 'draft'$1");

  content = content.replace(/p\.draft !== true/g, "p.status !== 'draft'");
  content = content.replace(/p\.draft === true/g, "p.status === 'draft'");
  content = content.replace(/!p\.draft/g, "p.status === 'published'");
  content = content.replace(/p\.draft(\s*\|\|)/g, "p.status === 'draft'$1");

  content = content.replace(/fn\.draft/g, "fn.status === 'draft'");

  // Replace post.status === 'Draft' uppercase
  content = content.replace(/status === 'Draft'/g, "status === 'draft'");
  content = content.replace(/status \!== 'Draft'/g, "status !== 'draft'");
  
  // Also we want to replace `draft` assignments in form data if possible: mapping `draft` to `status`
  // Actually let's just let formData have `.status` instead of `.draft`.
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed', filePath);
  }
});
