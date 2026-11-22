export interface SubmissionItem {
  id: string;
  test_id: string;
  user_id: string;
  raw_score: number | null;
  achieved_band: number | null;
  submitted_at: string;
  user_answers: Record<string, string>;
}

export interface SubmissionCreatePayload {
  test_id: string;
  user_answers: Record<string, string>;
}