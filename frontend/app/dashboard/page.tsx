'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';
import { BookOpen, LogOut, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const token = useAuthStore((state) => state.token);
  const logoutStore = useAuthStore((state) => state.logout);
  const router = useRouter();
  
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Route Protection Guard: If there is no token, bounce back to login!
  useEffect(() => {
    if (!token) {
      router.push('/');
      return;
    }

    // 2. Fetch tests (using mock data here so you can test UI immediately)
    const loadTests = async () => {
      try {
        // When your backend is active, you can uncomment this fetch:
        /*
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/tests/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch practice tests');
        const data = await response.json();
        setTests(data);
        */

        // Mock data for immediate visual verification:
        const mockTests = [
          {
            id: '1',
            title: 'Cambridge 19 - Reading Test 1',
            skill_type: 'reading',
            category: 'Academic Passage 1',
          },
          {
            id: '2',
            title: 'Cambridge 19 - Listening Test 1',
            skill_type: 'listening',
            category: 'Section 1',
          },
        ];
        setTests(mockTests);
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading tests');
      } finally {
        setLoading(false);
      }
    };

    loadTests();
  }, [token, router]);

  const handleLogout = () => {
    logoutStore();     // Clears the token from Zustand global state
    router.push('/');  // Redirects back to the login page
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">YouPass 2.0 Dashboard</h1>
            <p className="text-sm text-gray-500">Select an IELTS practice test below to begin.</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          /* Tests Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tests.length === 0 ? (
              <p className="text-gray-500 col-span-2 text-center py-8">No practice tests available yet.</p>
            ) : (
              tests.map((test) => (
                <div key={test.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{test.title}</h3>
                      <p className="text-xs text-gray-500 uppercase">{test.skill_type} Module • {test.category}</p>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                    Start Test
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}