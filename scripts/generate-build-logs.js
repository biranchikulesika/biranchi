/**
 * Generate Daily Build Logs
 * * Workflow:
 * 1. Fetch commits from last 24 hours across watched repos
 * 2. Group commits by feature area
 * 3. Send top groups to OpenAI for summarization
 * 4. Insert results into Supabase build_logs table
 * * Runs daily at 6 AM IST (00:30 UTC)
 */

// Explicitly initialize dotenv at the top using runtime path mapping
import dotenv from 'dotenv';
dotenv.config();

import { fetchLastNDaysCommits, groupCommits } from './fetch-commits.js';
import { generateLogEntry } from './summarize-commits.js';
import { saveBuildLog } from './save-to-supabase.js';

async function main() {
  console.log('\n═══════════════════════════════════════════');
  console.log('   [BUILD LOGS] Daily Synthesis Starting');
  console.log(`   Time: ${new Date().toISOString()}`);
  console.log('═══════════════════════════════════════════\n');

  try {
    // ─── STEP 1: FETCH COMMITS ───────────────────────────────
    console.log('[1/4] Fetching commits from last 24 hours...');
    const commits = await fetchLastNDaysCommits(1);

    if (commits.length === 0) {
      console.log('     No commits found. Skipping synthesis.');
      console.log('═══════════════════════════════════════════\n');
      return; // Graceful return prevents low-level win/async.c event assertion crash
    }

    console.log(`     ✓ Found ${commits.length} commits`);
    const repos = new Set(commits.map(c => c.repo));
    console.log(`     ✓ Across ${repos.size} repositories: ${Array.from(repos).join(', ')}\n`);

    // ─── STEP 2: GROUP COMMITS ──────────────────────────────
    console.log('[2/4] Grouping commits by feature area...');
    const groups = groupCommits(commits);
    const features = Object.keys(groups);

    if (features.length === 0) {
      console.log('     No valid commits after filtering. Skipping.');
      console.log('═══════════════════════════════════════════\n');
      return; // Graceful return
    }

    console.log(`     ✓ Grouped into ${features.length} feature areas:`);
    features.forEach(f => {
      console.log(`       • ${f}: ${groups[f].length} commits`);
    });
    console.log('');

    // ─── STEP 3: GENERATE SUMMARIES ──────────────────────────
    console.log('[3/4] Generating AI summaries...');

    // Sort by commit count (prioritize areas with most work)
    const sortedGroups = Object.entries(groups)
      .sort(([, a], [, b]) => b.length - a.length)
      .slice(0, 2); // Top 2 areas (1-2 entries per day is good pacing)

    const savedEntries = [];

    for (let i = 0; i < sortedGroups.length; i++) {
      const [feature, featureCommits] = sortedGroups[i];
      console.log(`\n     Summarizing: ${feature} (${featureCommits.length} commits)`);

      try {
        const entry = await generateLogEntry(featureCommits, feature);

        if (entry) {
          console.log(`       Prompt: "${entry.title}"`);

          // ─── STEP 4: SAVE TO SUPABASE ───────────────────
          const saved = await saveBuildLog(entry);
          savedEntries.push(saved);
          console.log(`       ✓ Saved to database (ID: ${saved.id.slice(0, 8)}...)`);
        } else {
          console.log(`       ✗ Failed to generate summary`);
        }

        // Rate limiting: OpenAI / NVIDIA friendly
        if (i < sortedGroups.length - 1) {
          await new Promise(r => setTimeout(r, 1500));
        }
      } catch (error) {
        console.log(`       ✗ Error: ${error.message}`);
      }
    }

    // ─── COMPLETION REPORT ──────────────────────────────────
    console.log('\n[4/4] Summary');
    console.log(`     ✓ Processed: ${commits.length} commits`);
    console.log(`     ✓ Saved: ${savedEntries.length} build log(s)`);
    console.log('\n═══════════════════════════════════════════');
    console.log('   [BUILD LOGS] Daily Synthesis Complete');
    console.log('═══════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n[ERROR] Daily synthesis failed:', error.message);
    console.error(error.stack);
    console.log('\n═══════════════════════════════════════════\n');
    process.exit(1);
  }
}

main();