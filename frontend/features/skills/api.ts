import { apiFetch } from '@/lib/api/client';
import { SubmissionItem } from '@/types/submission';
import { SkillType, TestItem } from '@/types/test';

export function getTestsBySkill(skillType: SkillType): Promise<TestItem[]> {
  return apiFetch<TestItem[]>(
    `/api/tests/?skill_type=${skillType}&skip=0&limit=100`
  );
}

export function getMySubmissions(token: string): Promise<SubmissionItem[]> {
  return apiFetch<SubmissionItem[]>('/api/submissions/me?skip=0&limit=100', {
    token,
  });
}