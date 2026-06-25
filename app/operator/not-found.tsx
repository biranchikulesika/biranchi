import Link from 'next/link';

export default function OperatorNotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-black text-[#00ff00] font-mono">
      <div className="w-full max-w-3xl border border-[#00ff00]/30 bg-black/50 p-8 shadow-[0_0_15px_rgba(0,255,0,0.1)] text-center">
        <h1 className="text-xl mb-6 font-bold">&gt; page not found_</h1>
        <div className="space-y-2 opacity-80 text-sm">
          <p>Exception: Invalid command path execution failure.</p>
          <p>The target system directory is missing or inaccessible.</p>
          <p>Please re-initialize terminal sequence.</p>
        </div>
        <div className="mt-10">
          <Link href="/operator" className="inline-block px-4 py-2 bg-[#00ff00]/10 hover:bg-[#00ff00]/30 border border-[#00ff00]/50 transition-colors uppercase tracking-widest text-sm">
            [ return to console ]
          </Link>
        </div>
      </div>
    </div>
  );
}
