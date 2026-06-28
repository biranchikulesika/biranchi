const fs = require('fs');

const path = './lib/supabase/database.types.ts';
let content = fs.readFileSync(path, 'utf8');

// Replace Omit<..., 'createdAt' | 'updatedAt'> with Omit<..., 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
content = content.replace(
  /Insert:\s*Omit<Database\['public'\]\['Tables'\]\['([^']+)'\]\['Row'\],\s*'createdAt'\s*\|\s*'updatedAt'>;/g,
  "Insert: Omit<Database['public']['Tables']['$1']['Row'], 'id' | 'createdAt' | 'updatedAt'> & { id?: string };"
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed Insert types!');
