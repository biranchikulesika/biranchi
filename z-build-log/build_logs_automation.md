# Build Logs Automation System
## Complete Implementation Guide for Biranchi

---

## CONTEXT & ARCHITECTURE

Your site already has:
- **Supabase PostgreSQL backend** with repository pattern
- **`build_logs` table** with existing schema
- **BuildLogService + BuildLogSupabaseRepository** (CRUD operations)
- **Builder page** that fetches `getBuildLogs()` and displays them in a timeline UI
- **Daily synthesis ritual** (6 AM IST = 00:30 UTC)

The automation system plugs directly into this existing pipeline.

---

## CURRENT BUILD LOG SCHEMA

```typescript
// From lib/types.ts
export interface BuildLog {
  id: string;
  title: string;
  description?: string;
  date: string;
  source: 'manual' | 'automated';
  aiGenerated: boolean;
  generatedAt?: string;
  generationModel?: string;
  relatedCommits: string[];
  relatedRepositories: string[];
  hidden: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**This is perfect.** The schema already supports:
- AI-generated flag
- Multiple repos
- Related commits
- Manual vs automated source

---

## IMPLEMENTATION PLAN

### STEP 1: GitHub Actions Workflow (6 AM IST Daily)

Create `.github/workflows/build-logs.yml`:

```yaml
name: Generate Daily Build Logs
on:
  schedule:
    - cron: '30 0 * * *'  # 6:00 AM IST = 00:30 UTC
  workflow_dispatch:

jobs:
  generate-logs:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '24'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate build logs
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: node scripts/generate-build-logs.js
```

---

### STEP 2: Commit Fetcher + Grouping Logic

Create `scripts/generate-build-logs.js`:

```javascript
const fetch = require('node-fetch');

// Config: Which repos to monitor
const WATCHED_REPOS = [
  { owner: 'biranchikulesika', repo: 'biranchi' },
  // Add other repos
];

async function fetchLastNDaysCommits(daysBack = 1) {
  const commits = [];
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - daysBack);
  
  for (const { owner, repo } of WATCHED_REPOS) {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?since=${sinceDate.toISOString()}`;
    
    const response = await fetch(url, {
      headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch ${owner}/${repo}:`, response.statusText);
      continue;
    }
    
    const data = await response.json();
    commits.push(
      ...data.map(c => ({
        repo,
        owner,
        sha: c.sha,
        message: c.commit.message,
        author: c.commit.author.name,
        date: c.commit.author.date
      }))
    );
  }
  
  return commits;
}

// Group commits intelligently
function groupCommits(commits) {
  const groups = {};
  
  for (const commit of commits) {
    // Skip meta commits
    if (commit.message.includes('build log') || commit.message.includes('chore: update')) {
      continue;
    }
    
    // Detect feature area from commit message
    const feature = detectFeatureArea(commit.message);
    
    if (!groups[feature]) {
      groups[feature] = [];
    }
    groups[feature].push(commit);
  }
  
  return groups;
}

function detectFeatureArea(message) {
  // Map keywords to feature areas
  const patterns = {
    'TYPOGRAPHY': ['typography', 'type', 'font', 'text'],
    'SPACING': ['spacing', 'padding', 'margin', 'layout'],
    'NAVIGATION': ['nav', 'header', 'sidebar', 'menu'],
    'INFRA': ['deps', 'config', 'build', 'deploy'],
    'DESIGN': ['color', 'bg-', 'border', 'shadow', 'style'],
    'CONTENT': ['content', 'copy', 'text', 'markdown'],
    'SYSTEM': ['system', 'refactor', 'architecture']
  };
  
  const lowercased = message.toLowerCase();
  
  for (const [area, keywords] of Object.entries(patterns)) {
    if (keywords.some(kw => lowercased.includes(kw))) {
      return area;
    }
  }
  
  return 'GENERAL';
}

module.exports = { fetchLastNDaysCommits, groupCommits, detectFeatureArea };
```

---

### STEP 3: AI Summarization

Create `scripts/summarize-commits.js`:

```javascript
const fetch = require('node-fetch');

async function generateLogEntry(groupedCommits, feature) {
  const commitList = groupedCommits
    .map(c => `- ${c.message.split('\n')[0]}`)
    .join('\n');
  
  const prompt = `You are generating a build log entry for a personal digital garden & CMS.

Persona: Builder - calm, technical, reflective, understated, systems-oriented.

Today's ${feature} work:
${commitList}

Generate a JSON object (ONLY JSON, no markdown, no preamble) with:
{
  "title": "One-line summary (max 60 chars)",
  "summary": "2-3 sentence explanation of what was done and why",
  "problem": "The problem this work addressed (optional, 1 sentence)",
  "action": "What was actually changed/built (1-2 sentences)",
  "result": "The outcome or benefit (1 sentence)",
  "tag": "Feature area tag (TYPOGRAPHY|SPACING|INFRA|DESIGN|SYSTEM)"
}

Requirements:
- Avoid corporate language
- Be precise and technical
- Sound reflective and intentional, not reactive
- Focus on systems and patterns, not micro-commits
- Tone: quiet, thoughtful, builder-like`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 300
    })
  });
  
  if (!response.ok) {
    console.error('OpenAI API error:', response.status);
    return null;
  }
  
  const data = await response.json();
  const content = data.choices[0].message.content;
  
  try {
    const parsed = JSON.parse(content);
    return {
      title: parsed.title,
      description: parsed.summary,
      date: new Date().toISOString().split('T')[0],
      source: 'automated',
      aiGenerated: true,
      generatedAt: new Date().toISOString(),
      generationModel: 'gpt-4o-mini',
      relatedCommits: groupedCommits.map(c => c.sha),
      relatedRepositories: [...new Set(groupedCommits.map(c => c.repo))],
      hidden: false,
      // Extended fields for builder page
      category: parsed.tag || feature,
      why: parsed.problem,
      affectedAreas: [parsed.tag || feature]
    };
  } catch (e) {
    console.error('Failed to parse AI response:', e);
    return null;
  }
}

module.exports = { generateLogEntry };
```

---

### STEP 4: Save to Supabase

Create `scripts/save-to-supabase.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');

async function saveBuildLog(logEntry) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
  
  // Check if entry already exists for today
  const today = new Date().toISOString().split('T')[0];
  
  const { data: existing } = await supabase
    .from('build_logs')
    .select('id')
    .eq('date', today)
    .eq('title', logEntry.title)
    .single();
  
  if (existing) {
    console.log('Entry already exists for today. Skipping.');
    return existing;
  }
  
  const { data, error } = await supabase
    .from('build_logs')
    .insert([{
      title: logEntry.title,
      description: logEntry.description,
      date: logEntry.date,
      source: 'automated',
      ai_generated: true,
      generated_at: logEntry.generatedAt,
      generation_model: logEntry.generationModel,
      related_commits: logEntry.relatedCommits,
      related_repositories: logEntry.relatedRepositories,
      hidden: false
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Supabase insert error:', error);
    throw error;
  }
  
  console.log('✓ Build log saved:', data.id);
  return data;
}

module.exports = { saveBuildLog };
```

---

### STEP 5: Main Orchestration Script

Create `scripts/generate-build-logs.js` (main entry):

```javascript
const { fetchLastNDaysCommits, groupCommits } = require('./fetch-commits');
const { generateLogEntry } = require('./summarize-commits');
const { saveBuildLog } = require('./save-to-supabase');

async function main() {
  console.log('[BUILD LOGS] Starting daily synthesis at', new Date().toISOString());
  
  try {
    // Step 1: Fetch commits from last 24 hours
    console.log('[1] Fetching commits...');
    const commits = await fetchLastNDaysCommits(1);
    
    if (commits.length === 0) {
      console.log('No commits found. Skipping.');
      process.exit(0);
    }
    
    console.log(`Found ${commits.length} commits across ${new Set(commits.map(c => c.repo)).size} repos`);
    
    // Step 2: Group commits by feature
    console.log('[2] Grouping commits...');
    const groups = groupCommits(commits);
    
    const features = Object.keys(groups);
    console.log(`Grouped into ${features.length} feature areas:`, features);
    
    // Step 3: Generate summaries for largest groups
    console.log('[3] Generating summaries...');
    const sortedGroups = Object.entries(groups)
      .sort(([, a], [, b]) => b.length - a.length)
      .slice(0, 3); // Top 3 feature areas
    
    for (const [feature, commits] of sortedGroups) {
      console.log(`  • Summarizing ${feature} (${commits.length} commits)`);
      
      const entry = await generateLogEntry(commits, feature);
      
      if (entry) {
        await saveBuildLog(entry);
        console.log(`    ✓ Saved: ${entry.title}`);
      } else {
        console.log(`    ✗ Failed to generate summary`);
      }
      
      // Rate limit: 1 request per second
      await new Promise(r => setTimeout(r, 1000));
    }
    
    console.log('[BUILD LOGS] Complete!');
    
  } catch (error) {
    console.error('[BUILD LOGS] Error:', error);
    process.exit(1);
  }
}

main();
```

---

## DATABASE TABLE (PostgreSQL)

Your existing `build_logs` table likely looks like:

```sql
CREATE TABLE build_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  source VARCHAR(20) DEFAULT 'manual', -- 'manual' or 'automated'
  ai_generated BOOLEAN DEFAULT FALSE,
  generated_at TIMESTAMP,
  generation_model VARCHAR(100),
  related_commits TEXT[] DEFAULT '{}',
  related_repositories TEXT[] DEFAULT '{}',
  hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

This is perfect. All columns align with your `BuildLog` interface.

---

## FRONTEND (Already Built)

Your builder page already:
- Calls `getBuildLogs()`
- Displays entries in a timeline
- Shows category, date, title, summary, why, affectedAreas
- Supports expand/collapse with animations

**No frontend changes needed.** New entries automatically appear.

---

## ENVIRONMENT VARIABLES

Add to your `.env.local` or Vercel secrets:

```env
# GitHub
GITHUB_TOKEN=ghp_xxxxx

# OpenAI
OPENAI_API_KEY=sk-xxxxx

# Supabase (should already exist)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx
```

---

## OPTIONAL ENHANCEMENTS

### 1. Manual Override Mode
Add to admin panel: ability to manually create build log entries for work that commits don't capture.

**Schema addition:**
```sql
ALTER TABLE build_logs ADD COLUMN manual_override BOOLEAN DEFAULT FALSE;
```

### 2. Build Log Tags/Categories
Instead of detecting from commits, let manual tags guide AI:

```typescript
export interface BuildLog {
  // ... existing fields
  manualTag?: string; // UI: user picks TYPOGRAPHY, INFRA, etc.
}
```

### 3. Weekly Digest Summary
Run a second workflow on Sundays that:
- Fetches all logs from the week
- Generates a meta-summary ("This week focused on...")
- Creates a single weekly entry

### 4. Commit Message Quality Check
Before processing, validate commits are reasonably descriptive. Skip single-word commits.

### 5. Repository Filtering
Allow admin to whitelist/blacklist specific repos or branches.

---

## TESTING THE WORKFLOW

### Local Test

```bash
# Set env vars
export GITHUB_TOKEN=your_token
export OPENAI_API_KEY=your_key
export SUPABASE_URL=your_url
export SUPABASE_SERVICE_KEY=your_key

# Run the script
node scripts/generate-build-logs.js
```

### GitHub Actions Test

Push a manual trigger:
```yaml
workflow_dispatch:  # Already in the workflow definition
```

In GitHub UI: Actions tab → "Generate Daily Build Logs" → "Run workflow"

---

## DEPLOYMENT CHECKLIST

- [ ] Add `.github/workflows/build-logs.yml`
- [ ] Create `scripts/` directory with the 3 scripts
- [ ] Add secrets to GitHub (GITHUB_TOKEN, OPENAI_API_KEY)
- [ ] Test locally with `node scripts/generate-build-logs.js`
- [ ] Trigger manual workflow in GitHub UI
- [ ] Verify entry appears on builder page
- [ ] Set schedule to run at 6 AM IST (00:30 UTC)
- [ ] Monitor logs for first week

---

## EXECUTION FLOW

```
6:00 AM IST
    ↓
GitHub Action fires
    ↓
Fetch last 24h commits from GitHub API
    ↓
Group by feature area
    ↓
For each group: send to OpenAI
    ↓
AI generates structured log entry
    ↓
INSERT into build_logs table
    ↓
[No git commit needed - database is source of truth]
    ↓
Builder page queries build_logs at next visit/refresh
    ↓
New entry appears in timeline
```

---

## COST ESTIMATE

- **GitHub Actions**: Free (240 min/month = 1 request per day is <1% usage)
- **OpenAI API**: ~$0.10/day (3 requests × gpt-4o-mini at ~$0.01 per request)
- **Supabase**: Already included in free tier

**Total monthly**: ~$3 in OpenAI credits

---

## TONE PROMPT REFINEMENT

If generated entries feel too generic, adjust the prompt in `summarize-commits.js`:

```javascript
const prompt = `You generate build logs for a Builder persona.

Characteristics:
- Deeply technical and systems-focused
- Reflective, not reactive
- Precise language, no marketing speak
- Emphasis on constraints, tradeoffs, learnings
- Quiet confidence

Today's work on ${feature}:
${commitList}

Generate minimal, beautiful log entry...`;
```

Iterate the language until entries match your voice.

---

## MANUAL FALLBACK

If AI misses something or commits are messy, manually create entries in admin panel with `source: 'manual'`. This allows hybrid approach:
- 80% automated from commits
- 20% manual for narrative/emotional reality

Both appear in the same timeline.

---

## SUMMARY

Your system now has:

✅ **Automated daily synthesis** — No manual work  
✅ **AI-powered summarization** — Tone-controlled prompts  
✅ **Database-driven** — No git pollution  
✅ **Already integrated** — Uses existing BuildLog service  
✅ **Ritual timing** — 6 AM creates intentionality  
✅ **Scalable** — Add repos by updating WATCHED_REPOS array  

This turns your git history into a narrative that makes the Builder persona feel **alive and intentional** rather than reactive.
