# Build Logs System — Database & API Reference

---

## DATABASE SCHEMA

Your existing `build_logs` table in Supabase PostgreSQL:

```sql
CREATE TABLE build_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  source VARCHAR(20) DEFAULT 'manual',
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

### Column Reference

| Column | Type | Purpose | Example |
|--------|------|---------|---------|
| `id` | UUID | Primary key | `a1b2c3d4-...` |
| `title` | TEXT | One-line summary | `"Reduced homepage visual noise"` |
| `description` | TEXT | Detailed explanation | `"Adjusted spacing density..."` |
| `date` | DATE | When the work happened | `2026-05-26` |
| `source` | VARCHAR | `manual` or `automated` | `"automated"` |
| `ai_generated` | BOOLEAN | Was AI used? | `true` |
| `generated_at` | TIMESTAMP | When AI generated it | `2026-05-26T00:30:00Z` |
| `generation_model` | VARCHAR | Which AI model | `"gpt-4o-mini"` |
| `related_commits` | TEXT[] | GitHub commit SHAs | `["a1b2c3d", "e5f6g7h"]` |
| `related_repositories` | TEXT[] | Repos involved | `["biranchi", "other-project"]` |
| `hidden` | BOOLEAN | Soft delete flag | `false` |
| `created_at` | TIMESTAMP | Record creation time | `2026-05-26T00:30:00Z` |
| `updated_at` | TIMESTAMP | Last modification time | `2026-05-26T00:30:00Z` |

---

## TYPESCRIPT INTERFACE

From `lib/types.ts`:

```typescript
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

---

## SERVICE LAYER (CRUD)

Your existing `BuildLogService` (`lib/services/buildLog.service.ts`):

```typescript
class BuildLogService {
  async getAll(): Promise<BuildLog[]>
  async getById(id: string): Promise<BuildLog | null>
  async create(data: Omit<BuildLog, "id">): Promise<BuildLog | null>
  async update(id: string, data: Partial<BuildLog>): Promise<BuildLog | null>
  async delete(id: string): Promise<boolean>
  async hide(id: string): Promise<BuildLog | null>
  async unhide(id: string): Promise<BuildLog | null>
}
```

---

## AUTOMATION PAYLOADS

### Input: From GitHub

Commit data fetched from GitHub API:

```typescript
interface GitHubCommit {
  repo: string;
  owner: string;
  sha: string;           // First 7 chars
  message: string;       // Full commit message
  author: string;        // Commit author name
  date: string;          // ISO timestamp
  url: string;           // GitHub URL
}
```

### Processing: Grouped Commits

After grouping by feature area:

```typescript
interface GroupedCommits {
  [featureArea: string]: GitHubCommit[];
}

// Example:
{
  "TYPOGRAPHY": [
    { repo: "biranchi", sha: "a1b2c3d", message: "Fix mobile font sizing", ... },
    { repo: "biranchi", sha: "e5f6g7h", message: "Reduce typography density", ... }
  ],
  "SPACING": [
    { repo: "biranchi", sha: "i9j0k1l", message: "Adjust grid gaps", ... }
  ]
}
```

### Output: AI-Generated Entry

What OpenAI generates:

```typescript
interface AIGeneratedEntry {
  title: string;
  summary: string;
  problem: string;
  action: string;
  result: string;
  tag: string;  // TYPOGRAPHY | SPACING | INFRA | etc.
}

// Example:
{
  "title": "Refined typography spacing on mobile",
  "summary": "Adjusted font sizes and line-height across mobile breakpoints...",
  "problem": "Typography felt cramped and inconsistent on smaller screens",
  "action": "Unified letter-spacing and adjusted fluid text sizing...",
  "result": "Improved readability and visual hierarchy on devices < 768px",
  "tag": "TYPOGRAPHY"
}
```

### Database Insert: Final BuildLog

What gets saved to `build_logs` table:

```typescript
interface BuildLogRecord {
  title: "Refined typography spacing on mobile",
  description: "Adjusted font sizes and line-height across mobile...",
  date: "2026-05-26",
  source: "automated",
  ai_generated: true,
  generated_at: "2026-05-26T00:30:00Z",
  generation_model: "gpt-4o-mini",
  related_commits: ["a1b2c3d", "e5f6g7h"],
  related_repositories: ["biranchi"],
  hidden: false,
  created_at: "2026-05-26T00:30:00Z",
  updated_at: "2026-05-26T00:30:00Z"
}
```

---

## BUILDER PAGE INTEGRATION

Your builder page (`app/builder/page.tsx`) fetches logs:

```typescript
const buildLogsData = await getBuildLogs();
// Returns: BuildLog[]

// Maps to local types:
interface LogEntry {
  id: string;
  date: string;
  category?: string;      // Maps from BuildLog.title
  source?: string;        // 'manual' or 'automated'
  title: string;
  summary?: string;       // Maps from BuildLog.description
  description?: string;
  why?: string;           // User-facing context
  affectedAreas: string[];
}
```

The page renders:
```tsx
{/* Collapsed view */}
[ DATE ] [ TAG ]
Title

{/* Expanded view */}
Problem: ...
Action: ...
Result: ...
Affected Areas: [ TAG ] [ TAG ]
```

---

## QUERIES

From `lib/queries.ts`:

```typescript
// Fetch all build logs (called on builder page)
export async function getBuildLogs() {
  return safeArray(() => new BuildLogService().getAll());
}

// Fetch single log by ID
export async function getBuildLog(id: string) {
  return safeSingle(() => new BuildLogService().getById(id));
}
```

These are called from the builder page with:
```typescript
const logsData = await getBuildLogs();
```

---

## AUTOMATION WORKFLOW FLOW

```
GitHub Action (6 AM UTC)
  ↓
fetch(/repos/.../commits?since=...)
  ↓
[ GitHubCommit ]
  ↓
groupCommits(commits)
  ↓
{ "TYPOGRAPHY": [...], "SPACING": [...] }
  ↓
For each group:
  generateLogEntry(commits, feature)
    ↓
    POST https://api.openai.com/v1/chat/completions
    ↓
    AIGeneratedEntry
  ↓
saveBuildLog(entry)
  ↓
INSERT INTO build_logs (title, description, ...)
  ↓
BuildLog { id, date, ... }
  ↓
[database updated]
  ↓
[no site redeploy needed]
  ↓
[next page visit fetches new logs]
```

---

## RESPONSE EXAMPLES

### API Response: GET /api/build-logs

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Refined typography spacing on mobile",
    "description": "Adjusted font sizes and line-height across mobile breakpoints for better readability.",
    "date": "2026-05-26",
    "source": "automated",
    "aiGenerated": true,
    "generatedAt": "2026-05-26T00:30:00.000Z",
    "generationModel": "gpt-4o-mini",
    "relatedCommits": ["a1b2c3d", "e5f6g7h"],
    "relatedRepositories": ["biranchi"],
    "hidden": false,
    "createdAt": "2026-05-26T00:30:00.000Z",
    "updatedAt": "2026-05-26T00:30:00.000Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "title": "Adjusted layout density for better visual rhythm",
    "description": "Reduced spacing variance across components and unified gap behaviors.",
    "date": "2026-05-26",
    "source": "automated",
    "aiGenerated": true,
    "generatedAt": "2026-05-26T00:30:00.000Z",
    "generationModel": "gpt-4o-mini",
    "relatedCommits": ["i9j0k1l", "m3n4o5p"],
    "relatedRepositories": ["biranchi"],
    "hidden": false,
    "createdAt": "2026-05-26T00:30:00.000Z",
    "updatedAt": "2026-05-26T00:30:00.000Z"
  }
]
```

### Database Query

```sql
SELECT 
  date,
  source,
  ai_generated,
  title,
  array_length(related_commits, 1) as commit_count
FROM build_logs
WHERE hidden = FALSE
ORDER BY date DESC
LIMIT 10;
```

Output:
```
    date    | source  | ai_generated |                title                | commit_count
------------+---------+--------------+-------------------------------------+--------------
 2026-05-26 | auto    | true         | Refined typography spacing          |            2
 2026-05-26 | auto    | true         | Adjusted layout density             |            2
 2026-05-25 | manual  | false        | Fixed deployment pipeline           |            1
 2026-05-24 | auto    | true         | Infrastructure and performance      |            5
```

---

## MUTATION EXAMPLES

### Create Manual Entry (Admin Panel)

```typescript
const newEntry = await new BuildLogService().create({
  title: "Killed an entire layout direction",
  description: "Removed the sidebar experiment after realizing it decreased content discoverability.",
  date: "2026-05-26",
  source: "manual",
  aiGenerated: false,
  relatedCommits: ["xyz123"],
  relatedRepositories: ["biranchi"],
  hidden: false
});
```

### Update Entry

```typescript
await new BuildLogService().update(id, {
  description: "Updated description with more context",
  hidden: false
});
```

### Hide Entry (Soft Delete)

```typescript
await new BuildLogService().hide(id);
```

### Delete Entry (Hard Delete)

```typescript
await new BuildLogService().delete(id);
```

---

## FIELDS FOR EXTENDED FEATURES

If you want to add to the schema later:

```sql
-- For AI confidence scoring
ALTER TABLE build_logs ADD COLUMN ai_confidence FLOAT;

-- For manual review workflow
ALTER TABLE build_logs ADD COLUMN needs_review BOOLEAN DEFAULT FALSE;
ALTER TABLE build_logs ADD COLUMN reviewed_by UUID REFERENCES auth.users;

-- For tags/filtering
ALTER TABLE build_logs ADD COLUMN tags TEXT[] DEFAULT '{}';

-- For weekly/monthly archives
ALTER TABLE build_logs ADD COLUMN is_digest BOOLEAN DEFAULT FALSE;
ALTER TABLE build_logs ADD COLUMN digest_of_date DATE;
```

---

## INDEXES FOR PERFORMANCE

If you have thousands of logs, add indexes:

```sql
CREATE INDEX idx_build_logs_date ON build_logs(date DESC);
CREATE INDEX idx_build_logs_source ON build_logs(source);
CREATE INDEX idx_build_logs_hidden ON build_logs(hidden);
CREATE INDEX idx_build_logs_ai_generated ON build_logs(ai_generated);
```

---

## ERROR HANDLING

Automation script gracefully handles:

| Error | Response | Action |
|-------|----------|--------|
| No commits found | Exit 0 | Skip, no entries created |
| GitHub API rate limited | Log warning | Continue with other repos |
| OpenAI API down | Return null | Skip that entry, continue |
| Supabase connection fails | Throw error | GitHub Action logs error, exits 1 |
| Duplicate entry (same title/date) | Skip insert | No duplicate created |
| AI returns invalid JSON | Log error, continue | Skip that entry |

---

## MONITORING QUERIES

### Check Automation Status

```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total,
  SUM(CASE WHEN ai_generated THEN 1 ELSE 0 END) as ai_count,
  SUM(CASE WHEN source = 'manual' THEN 1 ELSE 0 END) as manual_count
FROM build_logs
WHERE hidden = FALSE
GROUP BY DATE(created_at)
ORDER BY date DESC
LIMIT 30;
```

### Find AI-Generated Entries

```sql
SELECT id, date, title, generation_model, ai_confidence
FROM build_logs
WHERE ai_generated = TRUE AND hidden = FALSE
ORDER BY date DESC
LIMIT 20;
```

### Find Entries Needing Review

```sql
SELECT id, date, title, ai_generated, source
FROM build_logs
WHERE hidden = FALSE
AND (
  generation_model IS NOT NULL
  OR ai_generated = TRUE
)
ORDER BY created_at DESC
LIMIT 10;
```

---

## MIGRATION PATH

If changing the schema, create migration:

```sql
-- Add new column
ALTER TABLE build_logs ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;

-- Update existing records
UPDATE build_logs SET metadata = jsonb_build_object(
  'feature_area', 'GENERAL',
  'commit_count', 1
)
WHERE metadata IS NULL;

-- Create index for new column
CREATE INDEX idx_build_logs_metadata ON build_logs USING GIN(metadata);
```

Then update `BuildLog` interface and repository mapper.

---

This schema is intentionally simple and flexible, allowing growth without major restructuring.
