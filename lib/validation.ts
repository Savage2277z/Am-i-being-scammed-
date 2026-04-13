import { MIN_CHARS, MAX_CHARS } from "./constants";

export function validateMessageText(text: unknown): {
  valid: boolean;
  error?: string;
} {
  if (typeof text !== "string") {
    return { valid: false, error: "Message text must be a string." };
  }

  const trimmed = text.trim();

  if (trimmed.length < MIN_CHARS) {
    return {
      valid: false,
      error: `Message must be at least ${MIN_CHARS} characters. Please paste the full message you received.`,
    };
  }

  if (trimmed.length > MAX_CHARS) {
    return {
      valid: false,
      error: `Message must be under ${MAX_CHARS} characters. Please shorten the text.`,
    };
  }

  return { valid: true };
}
