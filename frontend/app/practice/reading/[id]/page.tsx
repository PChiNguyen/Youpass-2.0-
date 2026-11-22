import { Suspense } from 'react';
import ReadingPracticeView from '@/features/practice/components/ReadingPracticeView';

async function ReadingPracticeLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ReadingPracticeView testId={id} />;
}

export default function ReadingPracticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-gray-50 flex items-center justify-center text-sm font-semibold text-gray-500">
          Loading IELTS Reading test...
        </div>
      }
    >
      <ReadingPracticeLoader params={params} />
    </Suspense>
  );
}