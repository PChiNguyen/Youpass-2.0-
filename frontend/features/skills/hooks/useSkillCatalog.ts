'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { SkillType, TestItem } from '@/types/test';
import { getMySubmissions, getTestsBySkill } from '../api';

interface UseSkillCatalogOptions {
  skillType: SkillType;
  fixedCategory?: string;
}

export function useSkillCatalog({
  skillType,
  fixedCategory,
}: UseSkillCatalogOptions) {
  const token = useAuthStore((state) => state.token);

  const [tests, setTests] = useState<TestItem[]>([]);
  const [completedBands, setCompletedBands] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusTab, setStatusTab] = useState<'all' | 'uncompleted' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>(fixedCategory ?? 'all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const testsData = await getTestsBySkill(skillType);
      setTests(testsData);

      if (token) {
        try {
          const submissions = await getMySubmissions(token);
          const bandMap: Record<string, number> = {};
          for (const sub of submissions) {
            if (sub.achieved_band !== null) {
              bandMap[sub.test_id] = Math.max(
                bandMap[sub.test_id] ?? 0,
                sub.achieved_band
              );
            } else if (!(sub.test_id in bandMap)) {
              bandMap[sub.test_id] = 0;
            }
          }
          setCompletedBands(bandMap);
        } catch {
          // If token is expired, still show the public test catalog
        }
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Could not connect to the backend API. Is FastAPI running?';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [skillType, token]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const activeCategory = fixedCategory ?? categoryFilter;

  const filteredTests = tests.filter((test) => {
    if (activeCategory !== 'all' && test.category !== activeCategory) {
      return false;
    }

    const isCompleted = test.id in completedBands;
    if (statusTab === 'completed' && !isCompleted) return false;
    if (statusTab === 'uncompleted' && isCompleted) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!test.title.toLowerCase().includes(q)) return false;
    }

    return true;
  });

  return {
    filteredTests,
    completedBands,
    loading,
    error,
    statusTab,
    setStatusTab,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    reload: fetchTests,
  };
}