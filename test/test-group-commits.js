import 'dotenv/config';
import { fetchLastNDaysCommits, groupCommits } from '../scripts/fetch-commits.js';

async function test() {
  console.log('\n═══ TEST 3: GROUP COMMITS ═══\n');

  try {
    // Fetch commits
    const commits = await fetchLastNDaysCommits(1);

    if (commits.length === 0) {
      console.log('No commits found. Skipping group test.\n');
      return;
    }

    // Group them
    const groups = groupCommits(commits);
    const features = Object.keys(groups);

    console.log(`Grouped ${commits.length} commits into ${features.length} features:\n`);

    features.forEach(feature => {
      const count = groups[feature].length;
      const messages = groups[feature]
        .map(c => c.message.split('\n')[0])
        .join('\n       ');

      console.log(`${feature} (${count} commits)`);
      console.log(`  - ${messages}\n`);
    });

  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

test();