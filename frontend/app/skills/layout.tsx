'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Headphones, PenTool, Sparkles } from 'lucide-react';

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isReadingActive = pathname.startsWith('/skills/reading');

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-4">
            <Link
              href="/skills"
              className="block bg-white border border-gray-200 rounded-3xl p-5 shadow-sm hover:border-blue-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 text-blue-600 p-2.5 rounded-2xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-sm">Skills Hub</h4>
                  <p className="text-xs text-gray-500 font-medium">
                    IELTS Practice Library
                  </p>
                </div>
              </div>
            </Link>

            {/* Reading Section */}
            <div
              className={`rounded-3xl p-5 transition-all ${
                isReadingActive
                  ? 'bg-blue-50/30 border-2 border-blue-500 shadow-sm'
                  : 'bg-white border border-gray-100 hover:border-blue-200 shadow-sm'
              }`}
            >
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
                  All Passages
                </Link>

                <div className="pl-4 space-y-1 border-l-2 border-blue-200 ml-3 my-1">
                  <Link
                    href="/skills/reading/passage1"
                    className={`block px-3 py-1.5 rounded-xl transition-colors ${
                      pathname === '/skills/reading/passage1'
                        ? 'bg-blue-100 text-blue-800 font-bold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    Passage 1
                  </Link>
                  <Link
                    href="/skills/reading/passage2"
                    className={`block px-3 py-1.5 rounded-xl transition-colors ${
                      pathname === '/skills/reading/passage2'
                        ? 'bg-blue-100 text-blue-800 font-bold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    Passage 2
                  </Link>
                  <Link
                    href="/skills/reading/passage3"
                    className={`block px-3 py-1.5 rounded-xl transition-colors ${
                      pathname === '/skills/reading/passage3'
                        ? 'bg-blue-100 text-blue-800 font-bold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    Passage 3
                  </Link>
                </div>
              </div>
            </div>

            {/* Upcoming Skills */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-3 opacity-75">
              <div className="flex items-center justify-between text-sm font-black text-gray-700">
                <span className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-amber-500" /> Listening
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  Soon
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-black text-gray-700">
                <span className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-red-500" /> Writing
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  Soon
                </span>
              </div>
            </div>
          </aside>

          {/* Right Dynamic Content Area */}
          <div className="lg:col-span-9">{children}</div>
        </div>
      </div>
    </div>
  );
}