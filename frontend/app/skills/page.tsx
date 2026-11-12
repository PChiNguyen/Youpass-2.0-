'use client';

import { Sparkles, MessageSquarePlus, ArrowRight } from 'lucide-react';

export default function SkillsHomePage() {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm space-y-8 flex flex-col items-center text-center">
      
      {/* Top Badge Banner */}
      <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200 text-xs font-extrabold">
        <Sparkles className="w-4 h-4 text-green-600" /> YouPass Collect - Dự án cộng đồng
      </div>

      {/* Main Title & Description */}
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
          CÙNG YouPass Collect đề thi thật — dự án đồng nơi mọi người cùng nhau chia sẻ đề thi mà chính bạn đã gặp.
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Sau khi thi IELTS, chúng mình hãy cùng chung tay review đề, tạo nên thư viện “đề thi thật có bảo chứng” cho cộng đồng người học IELTS Việt Nam bạn nhé!
        </p>
      </div>

      {/* Illustration Card / Mascot Placeholder */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 rounded-3xl p-8 w-full max-w-lg flex flex-col items-center justify-center space-y-4 shadow-inner">
        <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-md animate-bounce">
          📄
        </div>
        <div className="space-y-1">
          <h3 className="font-black text-gray-900 text-lg">ĐỀ THI THẬT</h3>
          <p className="text-xs text-gray-500">Chia sẻ và cập nhật đề mới nhất mỗi ngày</p>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => alert('Feature to submit real exam reviews coming soon!')}
        className="bg-red-500 hover:bg-red-600 text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all text-sm flex items-center gap-2"
      >
        <MessageSquarePlus className="w-4 h-4" /> Review đề thi thật <ArrowRight className="w-4 h-4" />
      </button>

    </div>
  );
} 

