import 'dotenv/config';
import { fetchLastNDaysCommits, groupCommits } from '../scripts/fetch-commits.js';
import { generateLogEntry } from '../scripts/summarize-commits.js';

async function test() {
  console.log('\n═══ TEST 4: OPENAI SUMMARIZATION ═══\n');

  try {
    // Fetch and group commits
    const commits = await fetchLastNDaysCommits(1);

    if (commits.length === 0) {
      console.log('No commits found. Skipping OpenAI test.\n');
      return;
    }

    const groups = groupCommits(commits);
    const features = Object.keys(groups);

    if (features.length === 0) {
      console.log('No valid commits after filtering. Skipping.\n');
      return;
    }

    // Get the first group (largest)
    const firstFeature = Object.entries(groups)
      .sort(([, a], [, b]) => b.length - a.length)[0];

    const [feature, featureCommits] = firstFeature;

    console.log(`Sending ${featureCommits.length} commits from "${feature}" to OpenAI...\n`);
    console.log('(This takes 5-10 seconds...)\n');

    const entry = await generateLogEntry(featureCommits, feature);

    if (!entry) {
      console.log('✗ OpenAI returned null (check API key and quota)\n');
      process.exit(1);
    }

    console.log('✓ OpenAI generated summary:\n');
    console.log('Title:', entry.title);
    console.log('Summary:', entry.description);
    console.log('Problem:', entry.why || '(none)');
    console.log('Tag:', entry.category);
    console.log('Commits:', entry.relatedCommits.join(', '));
    console.log('\n');

  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

test();