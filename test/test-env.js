import 'dotenv/config';

console.log('\n═══ ENVIRONMENT VARIABLES ═══\n');

console.log('GITHUB_TOKEN exists:', !!process.env.GITHUB_TOKEN);
console.log('NVIDIA_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('SUPABASE_URL:', !!process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_KEY exists:', !!process.env.SUPABASE_SERVICE_KEY);

console.log('\n');