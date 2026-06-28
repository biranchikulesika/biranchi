/**
 * Summarize Commits with AI API
 * * Takes a group of related commits and generates a structured
 * build log entry matching the Builder persona voice.
 * Now supports switching AI models via environment variables.
 */

async function generateLogEntry(commits, feature) {
  // Format commits for the prompt
  const commitList = commits
    .map(c => `- ${c.message.split('\n')[0].trim()}`)
    .join('\n');

  // Provider configuration based on Environment Variables
  // Supported providers: 'nvidia', 'openai', or custom 'base_url'
  const provider = process.env.AI_PROVIDER?.toLowerCase() || 'nvidia';
  const apiKey = process.env.AI_API_KEY || process.env.NVIDIA_API_KEY || process.env.OPENAI_API_KEY;
  const model = process.env.AI_MODEL || 'deepseek-ai/deepseek-v4-flash';
  
  let baseUrl = 'https://integrate.api.nvidia.com/v1/chat/completions';
  if (provider === 'openai') {
    baseUrl = 'https://api.openai.com/v1/chat/completions';
  } else if (process.env.AI_BASE_URL) {
    baseUrl = process.env.AI_BASE_URL;
  }

  // Craft the system prompt to enforce Builder persona and filtering
  const systemPrompt = `You are a technical writer generating build logs for a Builder persona.

The Builder is:
- Deeply technical and systems-focused
- Reflective and intentional, not reactive
- Precise language, no marketing or hype
- Emphasis on constraints, tradeoffs, and learnings
- Quiet confidence and understated tone
- Focused on clarity and long-term usefulness

CRITICAL INSTRUCTION:
Review the provided commits. If the commits represent ONLY minor changes such as typo fixes, code formatting, trivial refactors, or automated dependency bumps, you MUST reject them by returning exactly:
{ "skip": true }

If the work is substantial enough to log, return a valid JSON object matching this schema exactly:
{
  "skip": false,
  "tag": "One or two word category (e.g. TYPOGRAPHY, DATABASE, INFRA, UI SYSTEM)",
  "title": "One-line summary (max 60 characters, be specific)",
  "short_summary": "1-2 sentences summarizing what was done and the immediate outcome.",
  "long_summary": "A longer, detailed explanation of the problem, what was changed/built technically, and the concrete results. Format as a reflective, technical narrative. (3-5 sentences)"
}

You ONLY respond with valid JSON. No markdown, no preamble, no code blocks.`;

  const userPrompt = `Generate a build log entry for this work.

Feature Area: ${feature}

Related Commits:
${commitList}

Remember: Return ONLY a valid JSON object. Evaluate if these commits are worth logging.`;

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 600,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error(`       ✗ API error (${response.status}):`, error.error?.message || error);
      return null;
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    // Clean up potential markdown formatting from AI if it disobeys instructions
    if (content.startsWith('\`\`\`json')) {
      content = content.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
    } else if (content.startsWith('\`\`\`')) {
      content = content.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
    }

    // Parse the JSON response
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      console.error(`       ✗ Failed to parse AI response as JSON`);
      console.error(`       Response was: ${content.substring(0, 100)}...`);
      return null;
    }

    if (parsed.skip === true) {
      console.log(`       → AI determined commits are minor/noise. Skipping log generation.`);
      return null;
    }

    // Build the complete log entry matching the updated schema
    const logEntry = {
      // UI fields
      title: parsed.title || 'Build work completed',
      category: parsed.tag || feature,
      short_summary: parsed.short_summary || '',
      long_summary: parsed.long_summary || '',
      date: new Date().toISOString().split('T')[0],

      // Database fields
      source: 'automated',
      aiGenerated: true,
      generatedAt: new Date().toISOString(),
      generationModel: model,
      relatedCommits: commits.map(c => c.sha),
      relatedRepositories: [...new Set(commits.map(c => c.repo))],
      hidden: false,

      // Raw AI output (for reference)
      _aiGenerated: parsed
    };

    return logEntry;

  } catch (error) {
    console.error(`       ✗ Request failed:`, error.message);
    return null;
  }
}

/**
 * Alternative: Local summarization (fallback)
 * If API is down or you want cost-free option
 */
function generateLogEntryLocal(commits, feature) {
  const firstCommit = commits[0].message.split('\n')[0];

  return {
    title: firstCommit.substring(0, 60),
    category: feature,
    short_summary: `Completed ${commits.length} commits in ${feature}`,
    long_summary: `Updated ${feature} systems with ${commits.length} changes. Local fallback generation used.`,
    date: new Date().toISOString().split('T')[0],
    source: 'automated',
    aiGenerated: false,
    relatedCommits: commits.map(c => c.sha),
    relatedRepositories: [...new Set(commits.map(c => c.repo))],
    hidden: false
  };
}

export {
  generateLogEntry,
  generateLogEntryLocal
};