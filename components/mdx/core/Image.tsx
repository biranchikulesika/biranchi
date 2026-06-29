import NextImage from 'next/image';
import { getPublicUrl } from '@/lib/supabase/storage';

interface MDXImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  path?: string; // Supabase storage path
  caption?: string;
  location?: string;
}

export const Image = ({ src, path, alt, caption, location, className, ...props }: MDXImageProps) => {
  // If path is provided, resolve it using Supabase storage. Otherwise use src.
  const imageUrl = path ? getPublicUrl({ bucket: 'post-images', path }) : src;

  if (!imageUrl) {
    return <span className="text-red-500">Image missing source or path</span>;
  }

  // Determine emoji for location if provided
  const getEmojiForLocation = (loc: string): string => {
    const l = loc.toLowerCase();
    if (l.includes('platform') || l.includes('coast') || l.includes('beach') || l.includes('ocean')) return '🌊';
    if (l.includes('train') || l.includes('transit') || l.includes('rail') || l.includes('carriage') || l.includes('district') || l.includes('cuttack')) return '🚃';
    if (l.includes('bhubaneswar') || l.includes('study') || l.includes('lounge') || l.includes('town') || l.includes('puri')) return '📍';
    return '📍';
  };

  return (
    <figure className={`my-10 block w-full relative ${className || ''}`}>
      <div className="relative overflow-hidden w-full border border-border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={alt || 'Image'}
          className="w-full h-auto object-cover"
          referrerPolicy="no-referrer"
          {...props}
        />
        {location && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1 text-[10.5px] backdrop-blur-[6px] rounded-full select-none font-mono tracking-wide text-foreground bg-muted border border-border">
            <span>{getEmojiForLocation(location)}</span>
            <span>{location}</span>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2.5 text-center text-[11px] uppercase max-w-[80%] mx-auto opacity-55 leading-relaxed select-none font-mono tracking-widest text-primary">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
