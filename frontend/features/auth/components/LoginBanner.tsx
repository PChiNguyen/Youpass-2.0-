import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function LoginBanner() {
  return (
    <div className="lg:col-span-5 relative p-8 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#3b2d54] via-[#241e3a] to-[#161324] border-b lg:border-b-0 lg:border-r border-gray-700/40">
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-purple-900/40">
            YP
          </div>
          <span className="font-extrabold text-white tracking-tight text-lg">
            YouPass 2.0
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full transition-all backdrop-blur-md border border-white/10"
        >
          Back to website <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="relative z-10 my-auto py-12 text-center lg:text-left space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5" /> IELTS Adaptive Testing
        </div>
        <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
          Mastering Skills,
          <br />
          Achieving Bands.
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed">
          Experience authentic Cambridge exam simulations with automated scoring
          and AI diagnostic feedback.
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-2 pt-4">
        <span className="w-7 h-1.5 rounded-full bg-purple-500 transition-all" />
        <span className="w-2 h-1.5 rounded-full bg-gray-600" />
        <span className="w-2 h-1.5 rounded-full bg-gray-600" />
      </div>
    </div>
  );
}