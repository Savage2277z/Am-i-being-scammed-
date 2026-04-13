export interface AnalysisResult {
  scam_score: number;
  verdict: "SAFE" | "SUSPICIOUS" | "LIKELY SCAM" | "DEFINITE SCAM";
  verdict_summary: string;
  red_flags: string[];
  what_they_want: string;
  scam_type:
    | "phishing"
    | "romance"
    | "investment"
    | "job"
    | "advance fee"
    | "impersonation"
    | "other";
  what_to_do: string[];
  safe_indicators: string[];
}

export interface AnalysisResponse {
  success: true;
  result: AnalysisResult;
}

export interface AnalysisError {
  error: string;
  retryAfter?: number;
}

export type ApiResponse = AnalysisResponse | AnalysisError;
