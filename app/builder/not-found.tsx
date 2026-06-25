import Link from 'next/link';

export default function BuilderNotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-900 text-slate-300 p-6 font-mono relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
      <div className="relative z-10 w-full max-w-2xl border border-slate-700 bg-slate-800/80 backdrop-blur-md p-12 shadow-2xl text-center">
        <h1 className="text-2xl text-slate-100 mb-6">page not found</h1>
        <div className="space-y-2 text-sm leading-relaxed text-slate-400">
          <p>The requested blueprint could not be located in the current schematic.</p>
          <p>We are missing the cornerstone for this specific structure.</p>
          <p>Please review the architecture and verify the building blocks.</p>
        </div>
        <div className="mt-12 pt-6 border-t border-slate-700">
          <Link href="/" className="inline-block px-4 py-2 border border-slate-500 hover:bg-slate-700 hover:text-slate-100 transition-colors text-slate-300 text-sm">
            return to workbench
          </Link>
        </div>
      </div>
    </div>
  );
}
