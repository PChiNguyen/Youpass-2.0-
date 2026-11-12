'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Headphones, PenTool, MessageSquarePlus } from 'lucide-react';

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Helper checks for active skill sections
  const isReadingActive = pathname.startsWith('/skills/reading');
  const isListeningActive = pathname.startsWith('/skills/listening');
  const isWritingActive = pathname.startsWith('/skills/writing');

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Main Grid: Sidebar (Col 3) + Dynamic Content (Col 9) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Tests Box (No hover effects, static clean look) */}
            <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 text-red-600 p-2.5 rounded-2xl">
                  <MessageSquarePlus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-sm">Tests</h4>
                  <p className="text-xs text-gray-500 font-medium">Real Exam Reviews</p>
                </div>
              </div>
            </div>

            {/* Reading Section */}
            <div className={`rounded-3xl p-5 transition-all ${
              isReadingActive 
                ? 'bg-blue-50/30 border-2 border-blue-500 shadow-sm' 
                : 'bg-white border border-gray-100 hover:border-blue-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-2.5 font-black text-gray-900 text-sm border-b border-gray-100 pb-3">
                <BookOpen className="w-4 h-4 text-blue-600" /> Reading
              </div>
              
              <div className="space-y-1 text-xs font-semibold pt-3">
                <Link 
                  href="/skills/reading"
                  className={`block px-3 py-2 rounded-xl transition-colors font-bold ${
                    pathname === '/skills/reading' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'text-gray-900 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  ○ Single Exercises
                </Link>
                
                {/* Nested Passages */}
                <div className="pl-4 space-y-1 border-l-2 border-blue-200 ml-3 my-1">
                  <Link 
                    href="/skills/reading/passage1" 
                    className={`block px-3 py-1.5 rounded-xl transition-colors ${
                      pathname === '/skills/reading/passage1' ? 'bg-blue-100 text-blue-800 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    ○ Passage 1
                  </Link>
                  <Link 
                    href="/skills/reading/passage2" 
                    className={`block px-3 py-1.5 rounded-xl transition-colors ${
                      pathname === '/skills/reading/passage2' ? 'bg-blue-100 text-blue-800 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    ○ Passage 2
                  </Link>
                  <Link 
                    href="/skills/reading/passage3" 
                    className={`block px-3 py-1.5 rounded-xl transition-colors ${
                      pathname === '/skills/reading/passage3' ? 'bg-blue-100 text-blue-800 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    ○ Passage 3
                  </Link>
                </div>

                <Link 
                  href="/skills/reading/full-tests" 
                  className={`block px-3 py-2 rounded-xl transition-colors ${
                    pathname === '/skills/reading/full-tests' ? 'bg-blue-100 text-blue-800 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  ○ Full Tests
                </Link>
              </div>
            </div>

            {/* Listening Section */}
            <div className={`rounded-3xl p-5 transition-all ${
              isListeningActive 
                ? 'bg-amber-50/30 border-2 border-amber-500 shadow-sm' 
                : 'bg-white border border-gray-100 hover:border-amber-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-2.5 font-black text-gray-900 text-sm border-b border-gray-100 pb-3">
                <Headphones className="w-4 h-4 text-amber-500" /> Listening
              </div>
              
              <div className="space-y-1 text-xs font-semibold pt-3">
                <Link 
                  href="/skills/listening" 
                  className={`block px-3 py-2 rounded-xl transition-colors font-bold ${
                    pathname === '/skills/listening' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'text-gray-900 hover:bg-gray-50 hover:text-amber-600'
                  }`}
                >
                  ○ Single Exercises
                </Link>

                {/* Nested Sections */}
                <div className="pl-4 space-y-1 border-l-2 border-amber-200 ml-3 my-1">
                  <Link 
                    href="/skills/listening/section1" 
                    className={`block px-3 py-1.5 rounded-xl transition-colors ${
                      pathname === '/skills/listening/section1' ? 'bg-amber-100 text-amber-800 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-amber-600'
                    }`}
                  >
                    ○ Section 1
                  </Link>
                  <Link 
                    href="/skills/listening/section2" 
                    className={`block px-3 py-1.5 rounded-xl transition-colors ${
                      pathname === '/skills/listening/section2' ? 'bg-amber-100 text-amber-800 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-amber-600'
                    }`}
                  >
                    ○ Section 2
                  </Link>
                  <Link 
                    href="/skills/listening/section3" 
                    className={`block px-3 py-1.5 rounded-xl transition-colors ${
                      pathname === '/skills/listening/section3' ? 'bg-amber-100 text-amber-800 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-amber-600'
                    }`}
                  >
                    ○ Section 3
                  </Link>
                  <Link 
                    href="/skills/listening/section4" 
                    className={`block px-3 py-1.5 rounded-xl transition-colors ${
                      pathname === '/skills/listening/section4' ? 'bg-amber-100 text-amber-800 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-amber-600'
                    }`}
                  >
                    ○ Section 4
                  </Link>
                </div>

                <Link 
                  href="/skills/listening/full-tests" 
                  className={`block px-3 py-2 rounded-xl transition-colors ${
                    pathname === '/skills/listening/full-tests' ? 'bg-amber-100 text-amber-800 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-amber-600'
                  }`}
                >
                  ○ Full Tests
                </Link>
                <Link 
                  href="/skills/listening/dictation" 
                  className={`block px-3 py-2 rounded-xl transition-colors ${
                    pathname === '/skills/listening/dictation' ? 'bg-amber-100 text-amber-800 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-amber-600'
                  }`}
                >
                  ○ Dictation
                </Link>
              </div>
            </div>

            {/* Writing Section */}
            <div className={`rounded-3xl p-5 transition-all ${
              isWritingActive 
                ? 'bg-red-50/30 border-2 border-red-500 shadow-sm' 
                : 'bg-white border border-gray-100 hover:border-red-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-2.5 font-black text-gray-900 text-sm border-b border-gray-100 pb-3">
                <PenTool className="w-4 h-4 text-red-500" /> Writing
              </div>
              <div className="space-y-1 text-xs font-semibold pt-3">
                <Link 
                  href="/skills/writing" 
                  className={`block px-3 py-2 rounded-xl transition-colors ${
                    pathname === '/skills/writing' ? 'bg-red-100 text-red-800 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-red-600'
                  }`}
                >
                  ○ Single Exercises
                </Link>
              </div>
            </div>

          </div>

          {/* Right Dynamic Content Area */}
          <div className="lg:col-span-9">
            {children}
          </div>

        </div>

      </div>
    </div>
  );
}