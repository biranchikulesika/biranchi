import Link from 'next/link';

export default function WandererNotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-[#eef1ed] text-[#4a5d4e]">
      <div className="w-full max-w-lg text-center space-y-8">
        <h1 className="text-4xl font-light tracking-wide">page not found</h1>
        <div className="space-y-3 opacity-80 text-lg leading-relaxed font-light">
          <p>You have stepped past the edge of the map.</p>
          <p>This is a path that hasn't been traveled yet, a sudden fork in the road.</p>
          <p>Take a breath and find your bearings.</p>
        </div>
        <div className="pt-12">
          <Link href="/wanderer" className="inline-block px-8 py-3 rounded-full border border-[#4a5d4e]/30 hover:bg-[#4a5d4e]/10 transition-colors font-medium tracking-wide text-sm uppercase">
            return to camp
          </Link>
        </div>
      </div>
    </div>
  );
}
