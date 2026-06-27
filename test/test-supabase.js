import 'dotenv/config';
import { saveBuildLog } from '../scripts/save-to-supabase.js';

async function test() {
  console.log('\n═══ TEST 5: SAVE TO SUPABASE ═══\n');

  // Create a test entry
  const testEntry = {
    title: 'Test Entry — Delete Me',
    description: 'This is a test entry created during local testing.',
    date: new Date().toISOString().split('T')[0],
    category: 'TEST',
    summary: 'Testing database connection',
    why: '',
    affectedAreas: ['TEST'],
    source: 'automated',
    aiGenerated: false,
    relatedCommits: ['test123'],
    relatedRepositories: ['test'],
    hidden: false
  };

  console.log('Saving test entry to Supabase...\n');
  console.log('Entry:', testEntry.title);

  try {
    const saved = await saveBuildLog(testEntry);

    if (!saved) {
      console.log('\n✗ Failed to save (returned null)\n');
      process.exit(1);
    }

    console.log('\n✓ Successfully saved!\n');
    console.log('Saved ID:', saved.id);
    console.log('Created at:', saved.created_at);
    console.log('\nNow check your Supabase dashboard:');
    console.log('1. Go to your project');
    console.log('2. Click "SQL Editor"');
    console.log('3. Run: SELECT * FROM build_logs ORDER BY created_at DESC LIMIT 1;');
    console.log('4. You should see your test entry');
    console.log('\n⚠️  Don\'t forget to delete the test entry from Supabase!\n');

  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

test();