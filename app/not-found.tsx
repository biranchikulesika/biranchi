import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-medium">page not found</h1>
        <div className="space-y-2 opacity-70 text-sm">
          <p>The requested destination could not be resolved.</p>
          <p>This address does not point to any active document.</p>
        </div>
        <div className="pt-8">
          <Link href="/" className="inline-block px-6 py-2 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-medium hover:opacity-80 transition-opacity text-sm">
            return home
          </Link>
        </div>
      </div>
    </div>
  );
}
