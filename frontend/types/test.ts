export type SkillType = 'listening' | 'reading' | 'writing' | 'speaking';

export type QuestionType =
  | 'true_false_not_given'
  | 'yes_no_not_given'
  | 'multiple_choice'
  | 'multiple_choice_many'
  | 'gap_filling'
  | 'sentence_completion'
  | 'summary_completion'
  | 'matching_information'
  | 'matching_headings'
  | 'matching_features';

export interface TestMeta {
  attempts_count?: number;
  duration_minutes?: number;
  cover_gradient?: string;
  question_types?: string[];
}

export interface TestPassage {
  title: string;
  paragraphs: string[];
}

export interface QuestionGroup {
  id: string;
  title: string;
  type: string;
  instructions: string;
  question_ids: string[];
}

export interface TestQuestion {
  id: string;
  number: number;
  type: QuestionType | string;
  prompt: string;
  options?: string[];
  correct_answer?: string;
}

export interface TestContent {
  meta?: TestMeta;
  passage?: TestPassage;
  audio_url?: string;
  transcript?: string[];
  question_groups?: QuestionGroup[];
  questions?: TestQuestion[];
}

export interface TestItem {
  id: string;
  title: string;
  skill_type: SkillType;
  category: string | null;
  content: TestContent;
}