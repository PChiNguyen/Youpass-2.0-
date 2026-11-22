import { apiFetch } from '@/lib/api/client';
import { SubmissionCreatePayload, SubmissionItem } from '@/types/submission';
import { TestItem } from '@/types/test';

export function getTestById(testId: string): Promise<TestItem> {
  return apiFetch<TestItem>(`/api/tests/${testId}`);
}

export function submitTestAnswers(
  payload: SubmissionCreatePayload,
  token: string
): Promise<SubmissionItem> {
  return apiFetch<SubmissionItem>('/api/submissions/', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}