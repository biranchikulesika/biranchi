# Build Logs Automation — Quick Start

Automated daily synthesis of git commits into narrative build log entries.

---

## WHAT YOU GET

Every day at 6 AM IST, a GitHub Action:

1. Fetches your commits from the last 24 hours
2. Groups them by feature area (TYPOGRAPHY, SPACING, INFRA, etc.)
3. Sends top groups to OpenAI for summarization
4. Inserts structured entries into Supabase
5. Your builder page automatically displays new logs

**No manual work. No site redeploy.**

---

## THE 5-MINUTE SETUP

### 1. Add Files to Your Repo

Copy these 4 files to `scripts/`:
- `generate-build-logs.js`
- `fetch-commits.js`
- `summarize-commits.js`
- `save-to-supabase.js`

Copy this file to `.github/workflows/`:
- `build-logs.yml`

### 2. Install Dependencies

```bash
npm install @supabase/supabase-js node-fetch@2
```

### 3. Add GitHub Secrets

Go to your repo → Settings → Secrets and variables → Actions

Add:
- `OPENAI_API_KEY` = your OpenAI key
- `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service role key

### 4. Push to GitHub

```bash
git add .
git commit -m "ci: add automated build logs system"
git push
```

### 5. Test It

GitHub → Actions → "Generate Daily Build Logs" → "Run workflow"

If successful:
- Logs appear in Supabase
- Logs appear on your builder page
- No errors in GitHub Actions logs

---

## KEY FILES

| File | Purpose |
|------|---------|
| `scripts/generate-build-logs.js` | Main orchestrator (4 steps) |
| `scripts/fetch-commits.js` | GitHub API + grouping logic |
| `scripts/summarize-commits.js` | OpenAI integration |
| `scripts/save-to-supabase.js` | Database insertion |
| `.github/workflows/build-logs.yml` | GitHub Action schedule (6 AM IST) |

---

## HOW IT WORKS

```
git push (any time)
    ↓
6:00 AM IST next day
    ↓
GitHub Action fires automatically
    ↓
Fetch commits from last 24h
    ↓
Group by feature area
    ↓
Ask OpenAI: "Summarize this work"
    ↓
Save to database
    ↓
Your site fetches on next visit
    ↓
New entry appears in builder timeline
```

---

## TONE & VOICE

The AI generates entries in your **Builder persona** voice:

- Calm, technical, reflective
- Precise language, no marketing
- Systems-focused, not reactive
- Quiet confidence

Example output:
```
Title: Reduced homepage visual noise
Summary: Adjusted spacing density and unified typography 
constraints across mobile breakpoints for improved focus hierarchy.
```

---

## COST

- **GitHub Actions**: Free (included in 240 min/month)
- **OpenAI**: ~$3/month (~$0.01 per summary × 3/day)
- **Supabase**: Free tier is plenty

**Total**: ~$0.10/day

---

## WHAT'S INCLUDED

✅ **Automated**: Runs daily, no manual work  
✅ **AI-Powered**: Tone-controlled OpenAI summaries  
✅ **Database-Driven**: No git pollution  
✅ **Integrated**: Uses your existing BuildLogService  
✅ **Flexible**: Manual entries still supported  
✅ **Scalable**: Add repos by editing config  

---

## DETAILED DOCS

For complete setup, troubleshooting, and customization:

- **SETUP_GUIDE.md** — Step-by-step installation
- **DATABASE_AND_API.md** — Schema, queries, integration
- **build_logs_automation.md** — Architecture deep-dive

---

## NEXT STEPS

1. **This week**: Copy files, test locally
2. **Next week**: Deploy to GitHub
3. **After**: Monitor first week of runs, adjust AI prompts
4. **Long-term**: Add more repos, tune feature detection

---

## VERIFY IT'S WORKING

After setup, check:

1. **GitHub Actions**: New workflow appears in Actions tab
2. **Supabase**: New entries in `build_logs` table
3. **Your Site**: New logs appear on builder page
4. **Automation**: Runs daily at 6 AM IST without manual trigger

---

**The Builder persona comes alive through intentional, daily narrative.**
