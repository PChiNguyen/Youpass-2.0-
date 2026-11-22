
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  target_overall: number | null;
  target_reading: number | null;
  target_listening: number | null;
  target_writing: number | null;
  target_speaking: number | null;
  exam_date: string | null;
}

export interface UserGoalsUpdate {
  target_overall: number;
  target_reading: number;
  target_listening: number;
  target_writing: number;
  target_speaking: number;
}