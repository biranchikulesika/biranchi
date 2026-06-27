# Build Logs Automation — Setup Guide

Complete walkthrough for implementing automated daily build logs on your site.

---

## PREREQUISITES

- Node.js 24+ (already have)
- Supabase PostgreSQL database (already have)
- GitHub repository (already have)
- OpenAI API key (costs ~$0.10/day)

---

## INSTALLATION

### 1. Create the Scripts Directory

```bash
mkdir -p scripts
```

### 2. Copy the Scripts

Copy these 4 files into your `scripts/` directory:
- `generate-build-logs.js` — Main orchestrator
- `fetch-commits.js` — GitHub API fetcher + grouper
- `summarize-commits.js` — OpenAI integration
- `save-to-supabase.js` — Database writer

### 3. Install Dependencies

```bash
# Supabase client (for database access)
npm install @supabase/supabase-js

# Should already be installed, but verify:
npm list node-fetch
```

If `node-fetch` is missing:
```bash
npm install node-fetch@2
```

---

## ENVIRONMENT SETUP

### GitHub Token

1. Go to GitHub: Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with:
   - `repo` scope (full control of private repositories)
   - `public_repo` scope (access public repositories)
3. Copy the token

### OpenAI API Key

1. Go to https://platform.openai.com/api/keys
2. Create new secret key
3. Copy the key (you won't see it again)

### Add Secrets to GitHub

Repository Settings → Secrets and variables → Actions

Add:
- `OPENAI_API_KEY` = your OpenAI secret key
- `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service key (Settings → API)

(Other secrets like `NEXT_PUBLIC_SUPABASE_URL` should already exist)

### Local Testing Environment

Create `.env.local`:

```env
# GitHub
GITHUB_TOKEN=ghp_your_token_here

# OpenAI
OPENAI_API_KEY=sk_your_key_here

# Supabase (should already exist)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJxxxxx
```

**⚠️ CRITICAL**: Add `.env.local` to `.gitignore` — never commit secrets

---

## CREATE GITHUB ACTION WORKFLOW

Create file: `.github/workflows/build-logs.yml`

Copy the contents from `build-logs.yml` (provided separately)

Then push to GitHub:
```bash
git add .github/workflows/build-logs.yml
git commit -m "ci: add daily build logs workflow"
git push
```

---

## LOCAL TESTING

### Test 1: Fetch Commits

```bash
# Check if you can fetch commits
GITHUB_TOKEN=your_token node -e "
const { fetchLastNDaysCommits } = require('./scripts/fetch-commits.js');
fetchLastNDaysCommits(1).then(commits => {
  console.log('Found ' + commits.length + ' commits');
  console.log(commits.slice(0, 3));
});
"
```

### Test 2: Generate Logs

```bash
# Full workflow test
GITHUB_TOKEN=your_token \
OPENAI_API_KEY=your_key \
SUPABASE_URL=your_url \
SUPABASE_SERVICE_KEY=your_key \
node scripts/generate-build-logs.js
```

Expected output:
```
═══════════════════════════════════════════
   [BUILD LOGS] Daily Synthesis Starting
   Time: 2026-05-26T10:30:00.000Z
═══════════════════════════════════════════

[1/4] Fetching commits from last 24 hours...
     ✓ Found 12 commits
     ✓ Across 1 repositories: biranchi

[2/4] Grouping commits by feature area...
     ✓ Grouped into 3 feature areas:
       • TYPOGRAPHY: 4 commits
       • SPACING: 5 commits
       • DESIGN: 3 commits

[3/4] Generating AI summaries...

     Summarizing: TYPOGRAPHY (4 commits)
       Prompt: "Refined typography spacing on mobile"
       ✓ Saved to database (ID: a1b2c3d4...)

     Summarizing: SPACING (5 commits)
       Prompt: "Adjusted layout density for better rhythm"
       ✓ Saved to database (ID: e5f6g7h8...)

[4/4] Summary
     ✓ Processed: 12 commits
     ✓ Saved: 2 build log(s)

═══════════════════════════════════════════
   [BUILD LOGS] Daily Synthesis Complete
═══════════════════════════════════════════
```

### Test 3: Check Database

In Supabase dashboard:
1. Go to SQL Editor
2. Run:
```sql
SELECT id, date, title, ai_generated, created_at 
FROM build_logs 
ORDER BY created_at DESC 
LIMIT 5;
```

You should see your generated entries.

### Test 4: Check on Your Site

Visit your builder page — new entries should appear in the timeline without a site redeploy.

---

## GITHUB ACTIONS MANUAL TRIGGER

Once workflow is live:

1. Go to your repo on GitHub
2. Actions tab
3. "Generate Daily Build Logs" workflow
4. "Run workflow" button (top right)
5. Select `main` branch
6. Click "Run workflow"

Watch the logs in real-time to verify everything works.

---

## SCHEDULE & TIMING

The workflow runs at:
- **6:00 AM IST** = **00:30 UTC**

This is encoded in `build-logs.yml`:
```yaml
- cron: '30 0 * * *'  # minute=30, hour=0 (UTC)
```

To change the time, edit the cron expression:
```yaml
# Examples:
- cron: '0 6 * * *'      # 6:00 AM UTC = 11:30 AM IST
- cron: '30 0 * * 1'     # Monday only
- cron: '0 */6 * * *'    # Every 6 hours
```

---

## MONITORING & DEBUGGING

### Check Workflow Runs

GitHub → Actions → "Generate Daily Build Logs"

Click a run to see logs:
- Green check ✓ = Success
- Red X ✗ = Failed (click for error details)

### Common Errors

#### ❌ "API rate limit exceeded"
**Cause**: Too many requests to GitHub in short time  
**Solution**: Throttle commits per day in `generate-build-logs.js` — reduce `sortedGroups.slice(0, 2)` to `slice(0, 1)`

#### ❌ "SUPABASE_SERVICE_KEY is undefined"
**Cause**: Secret not added to GitHub  
**Solution**: Repository Settings → Secrets → Add `SUPABASE_SERVICE_KEY`

#### ❌ "Failed to connect to Supabase"
**Cause**: Wrong credentials or connection issue  
**Solution**: Test locally with `.env.local` first

#### ❌ "OpenAI API error: 429"
**Cause**: Rate limit on OpenAI  
**Solution**: Add delay between summarization requests (already in code: 1500ms)

#### ❌ "No commits found"
**Cause**: No code pushed in last 24 hours  
**Solution**: Normal. Workflow exits gracefully with no entries created.

---

## CONFIGURATION TWEAKS

### Add More Repositories to Monitor

Edit `scripts/fetch-commits.js`:

```javascript
const WATCHED_REPOS = [
  { owner: 'biranchikulesika', repo: 'biranchi' },
  { owner: 'biranchikulesika', repo: 'another-project' },  // ← Add here
  { owner: 'your-org', repo: 'some-repo' },
];
```

### Adjust Tone of Summaries

Edit `scripts/summarize-commits.js`, the `systemPrompt`:

```javascript
const systemPrompt = `You are a technical writer...
The Builder is:
- Your personality traits here
...`;
```

### Change Number of Daily Entries

Edit `scripts/generate-build-logs.js`:

```javascript
// Line: const sortedGroups = Object.entries(groups)...
.slice(0, 3)  // Change from 2 to 3 (creates up to 3 entries/day)
```

### Skip Certain Commit Types

Edit `scripts/fetch-commits.js`, the `isNoise()` function:

```javascript
function isNoise(message) {
  const noisePatterns = [
    /^build log/i,
    /^chore:/i,        // ← Add this to skip all chore commits
    // ... more patterns
  ];
  // ...
}
```

---

## MANUAL FALLBACK

If automated logs miss something, manually create entries:

1. Visit your admin panel
2. Create new build log entry
3. Set `source: 'manual'` 
4. Both manual + automated entries appear in timeline

---

## COST BREAKDOWN

| Service | Cost | Usage |
|---------|------|-------|
| GitHub Actions | Free | 240 min/month included |
| Supabase | Free tier | Database queries |
| OpenAI | ~$3/month | 3 summaries/day × $0.01 = ~$1/month |
| **Total** | **~$0.10/day** | - |

---

## WHAT TO EXPECT

### First Week
- Logs are a bit generic (AI learning your commits)
- Some commits grouped awkwardly
- Takes 2-3 iterations to tune prompts

### After Tuning
- Logs match your voice/tone
- Meaningful feature area grouping
- Clean narrative of your work

### Long Term
- Build log becomes a portfolio artifact
- Shows intentional, sustained development
- Natural "now page" that updates itself

---

## TROUBLESHOOTING CHECKLIST

- [ ] GitHub token has `repo` + `public_repo` scopes
- [ ] OpenAI key is active and has credits
- [ ] Secrets added to GitHub Actions environment
- [ ] `.github/workflows/build-logs.yml` is in main branch
- [ ] `scripts/` directory with all 4 files
- [ ] `@supabase/supabase-js` installed
- [ ] `node-fetch` installed
- [ ] Test workflow ran without errors
- [ ] New entries appear in Supabase
- [ ] New entries visible on builder page

---

## NEXT STEPS

1. **This week**: Set up locally, test the workflow
2. **Next week**: Deploy to GitHub, run first automated cycle
3. **After**: Monitor logs, adjust AI prompts, add more repos
4. **Eventually**: Add manual override entries when needed

---

## SUPPORT

If something breaks:

1. Check GitHub Actions logs (most detailed)
2. Run locally with `.env.local` to isolate issue
3. Test each component separately:
   - `fetch-commits.js` alone
   - `summarize-commits.js` with test data
   - `save-to-supabase.js` with test entry

---

## OPTIONAL ENHANCEMENTS

### Weekly Digest Summary
Create a second workflow that runs Sundays, summarizing the week:
```yaml
- cron: '30 0 * * 0'  # Sunday 00:30 UTC
```

### Slack Notification
Add a step that posts new logs to Slack:
```bash
curl -X POST $SLACK_WEBHOOK \
  -H 'Content-type: application/json' \
  -d "{\"text\": \"New build log: $TITLE\"}"
```

### Filter by Commit Message Pattern
Skip WIP commits:
```javascript
if (commit.message.startsWith('wip') || commit.message.startsWith('WIP')) {
  continue;
}
```

### Custom Tags
Let admin panel set custom tags instead of AI-detected ones.

---

**You're ready. Start with local testing, then push to GitHub. The Builder persona will come alive.**
