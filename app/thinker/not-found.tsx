import Link from 'next/link';

export default function ThinkerNotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-[#fdfbf7] text-[#2c2c2a] selection:bg-[#d6cfc4]">
      <div className="w-full max-w-2xl text-center space-y-12">
        <h1 className="text-3xl font-serif lowercase italic opacity-80">page not found</h1>
        
        <div className="space-y-4 max-w-lg mx-auto font-serif text-lg leading-relaxed opacity-90">
          <p>This thought remains unmapped, resting quietly in the margins.</p>
          <p>A missing page from the ledger of ideas.</p>
          <p>Perhaps it is an unspoken premise waiting to be discovered.</p>
        </div>
        
        <div className="pt-16 flex justify-center">
          <Link 
            href="/thinker" 
            className="text-sm uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity font-sans"
          >
            Close Notebook
          </Link>
        </div>
      </div>
    </div>
  );
}
