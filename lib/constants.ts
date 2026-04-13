export const SYSTEM_PROMPT = `You are a world-class fraud detection expert and consumer protection specialist. Analyze the following message for scam indicators.

Return your response as a valid JSON object with exactly this structure:
{
  "scam_score": <integer 0-100>,
  "verdict": "<SAFE | SUSPICIOUS | LIKELY SCAM | DEFINITE SCAM>",
  "verdict_summary": "<one sentence plain English verdict>",
  "red_flags": ["<flag 1>", "<flag 2>", ...],
  "what_they_want": "<plain English explanation of the scammer's actual goal>",
  "scam_type": "<category: phishing | romance | investment | job | advance fee | impersonation | other>",
  "what_to_do": ["<action 1>", "<action 2>", "<action 3>"],
  "safe_indicators": ["<thing that seems legitimate, if any>"]
}

Rules:
- scam_score 0-20 = likely safe
- scam_score 21-50 = suspicious, proceed with caution
- scam_score 51-80 = likely scam
- scam_score 81-100 = definite scam
- Be direct and honest. Do not soften verdicts.
- Write for a non-technical audience.
- red_flags should be specific to THIS message, not generic advice.
- what_they_want should expose the psychological manipulation being used.
- what_to_do should be concrete immediate actions.
- Return ONLY the JSON object. No preamble, no markdown, no explanation.`;

export const MIN_CHARS = 20;
export const MAX_CHARS = 5000;

export const RATE_LIMIT_MAX = 10;
export const RATE_LIMIT_WINDOW_MS = 60 * 1000;
export const RATE_LIMIT_CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

export const SCORE_THRESHOLDS = {
  safe: { min: 0, max: 20 },
  suspicious: { min: 21, max: 50 },
  likelyScam: { min: 51, max: 80 },
  definiteScam: { min: 81, max: 100 },
} as const;

export const SCAM_TYPES = [
  {
    emoji: "🎣",
    title: "Phishing Emails",
    description: "Fake login pages, password reset scams",
  },
  {
    emoji: "💕",
    title: "Romance Scams",
    description: "Online dating manipulation, catfishing",
  },
  {
    emoji: "💰",
    title: "Investment Fraud",
    description: "Crypto schemes, Ponzi promises, forex scams",
  },
  {
    emoji: "💼",
    title: "Job Offer Scams",
    description: "Fake recruiters, work-from-home traps",
  },
  {
    emoji: "🏦",
    title: "Impersonation",
    description: "Fake banks, government agencies, tech support",
  },
  {
    emoji: "📦",
    title: "Advance Fee Fraud",
    description: "Pay now to receive later, shipping fee scams",
  },
] as const;

export const SOCIAL_PROOF_STATS = [
  { value: "10,000+", label: "Scams Caught" },
  { value: "50,000+", label: "Messages Analyzed" },
  { value: "98%", label: "Accuracy Rate" },
] as const;
