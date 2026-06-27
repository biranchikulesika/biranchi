/**
 * Summarize Commits with NVIDIA NIM API
 * * Takes a group of related commits and generates a structured
 * build log entry matching the Builder persona voice.
 */

async function generateLogEntry(commits, feature) {
  // Format commits for the prompt
  const commitList = commits
    .map(c => `- ${c.message.split('\n')[0].trim()}`)
    .join('\n');

  // Craft the system prompt to enforce Builder persona
  const systemPrompt = `You are a technical writer generating build logs for a Builder persona.

The Builder is:
- Deeply technical and systems-focused
- Reflective and intentional, not reactive
- Precise language, no marketing or hype
- Emphasis on constraints, tradeoffs, and learnings
- Quiet confidence and understated tone
- Focused on clarity and long-term usefulness

You ONLY respond with valid JSON. No markdown, no preamble, no code blocks.`;

  const userPrompt = `Generate a build log entry for this work:

Feature Area: ${feature}

Related Commits:
${commitList}

Return ONLY a JSON object (no markdown, no explanation):
{
  "title": "One-line summary (max 60 characters, be specific)",
  "summary": "2-3 sentences explaining what was done and why it matters",
  "problem": "The specific problem this addresses (1 sentence, optional)",
  "action": "What was actually changed/built (1-2 sentences, technical)",
  "result": "The concrete outcome or improvement (1 sentence)",
  "tag": "Feature area: TYPOGRAPHY|SPACING|NAVIGATION|INFRA|DESIGN|CONTENT|SYSTEM|DATABASE|API"
}

Requirements:
- Title should be specific, not generic ("Reduced homepage density" not "Improved UI")
- Summary should explain the WHY, not just the WHAT
- Avoid corporate language or buzzwords
- Sound reflective and thoughtful
- Be technically precise
- Focus on systems and patterns, not individual fixes`;

  try {
    // NVIDIA NIM API handles requests using the standard OpenAI payload layout
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Pick an available, high-performance chat/reasoning model from your dashboard
        model: 'deepseek-ai/deepseek-v4-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 400,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`       ✗ NVIDIA API error (${response.status}):`, error.error?.message || error);
      return null;
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();

    // Parse the JSON response
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      console.error(`       ✗ Failed to parse AI response as JSON`);
      console.error(`       Response was: ${content.substring(0, 100)}...`);
      return null;
    }

    // Build the complete log entry
    const logEntry = {
      // UI fields (for builder page)
      title: parsed.title || 'Build work completed',
      description: parsed.summary || '',
      date: new Date().toISOString().split('T')[0],
      category: parsed.tag || feature,
      summary: parsed.summary || '',
      why: parsed.problem || '',
      affectedAreas: [parsed.tag || feature],

      // Database fields
      source: 'automated',
      aiGenerated: true,
      generatedAt: new Date().toISOString(),
      generationModel: 'deepseek-v4-flash',
      relatedCommits: commits.map(c => c.sha),
      relatedRepositories: [...new Set(commits.map(c => c.repo))],
      hidden: false,

      // Raw AI output (for reference)
      _aiGenerated: parsed
    };

    return logEntry;

  } catch (error) {
    console.error(`       ✗ NVIDIA request failed:`, error.message);
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
    description: `Completed ${commits.length} commits in ${feature}`,
    date: new Date().toISOString().split('T')[0],
    category: feature,
    summary: `Updated ${feature} systems with ${commits.length} changes.`,
    why: '',
    affectedAreas: [feature],
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