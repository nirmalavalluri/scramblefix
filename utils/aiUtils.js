/**
 * aiUtils.js — ScrambleFix AI Tools
 * Calls the Anthropic API directly from the browser.
 * API key is stored in localStorage by the user (never sent to our server).
 */

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL   = 'claude-sonnet-4-20250514';

export const AI_KEY_STORAGE = 'sf_anthropic_key';

export function getStoredKey() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(AI_KEY_STORAGE) || '';
}

export function saveKey(key) {
  localStorage.setItem(AI_KEY_STORAGE, key);
}

export function clearKey() {
  localStorage.removeItem(AI_KEY_STORAGE);
}

async function callClaude(apiKey, system, userText) {
  if (!apiKey) throw new Error('NO_KEY');
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: userText }],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }
  const data = await res.json();
  return data.content[0].text;
}

export const aiRewrite = (text, apiKey) =>
  callClaude(apiKey,
    'Rewrite the text to be more engaging and compelling. Preserve the meaning. Return only the rewritten text — no commentary.',
    text
  );

export const aiGrammarFix = (text, apiKey) =>
  callClaude(apiKey,
    'Fix all grammar, spelling, and punctuation errors. Return only the corrected text — no commentary.',
    text
  );

export const aiClarityImprove = (text, apiKey) =>
  callClaude(apiKey,
    'Improve the clarity and readability. Make it easier to understand without changing the meaning. Return only the improved text.',
    text
  );

export const aiToneChange = (text, apiKey, { tone = 'professional' } = {}) =>
  callClaude(apiKey,
    `Rewrite this text in a ${tone} tone. Keep the same information. Return only the rewritten text.`,
    text
  );

export const aiSummarize = (text, apiKey) =>
  callClaude(apiKey,
    'Summarize this text in 2–3 concise sentences. Return only the summary.',
    text
  );

export const aiParaphrase = (text, apiKey) =>
  callClaude(apiKey,
    'Paraphrase this text using different words and sentence structure while keeping the same meaning. Return only the paraphrased text.',
    text
  );
