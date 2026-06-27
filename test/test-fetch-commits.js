// Load environment variables
import 'dotenv/config';

import { fetchLastNDaysCommits } from '../scripts/fetch-commits.js';

async function test() {
  console.log('\n═══ TEST 2: FETCH COMMITS ═══\n');
  console.log('Fetching commits from last 24 hours...\n');

  try {
    const commits = await fetchLastNDaysCommits(1);

    console.log(`✓ Found ${commits.length} commits\n`);

    if (commits.length === 0) {
      console.log('(No commits in last 24 hours - this is normal)\n');
      return;
    }

    // Show first 3 commits
    console.log('Sample commits:\n');
    commits.slice(0, 3).forEach((c, i) => {
      console.log(`${i + 1}. Repo: ${c.repo}`);
      console.log(`   SHA: ${c.sha}`);
      console.log(`   Message: ${c.message.split('\n')[0]}`);
      console.log('');
    });

  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

test();