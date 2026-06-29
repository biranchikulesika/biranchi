import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeKatex from 'rehype-katex';

export async function compileMDX(source: string) {
  try {
    const mdxSource = await serialize(source, {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          rehypeKatex,
          [
            rehypePrettyCode,
            {
              theme: 'github-dark',
              keepBackground: false,
            },
          ],
        ],
        format: 'mdx',
      },
      parseFrontmatter: false, // We store metadata in db columns
    });
    
    return mdxSource;
  } catch (error) {
    console.error('Error compiling MDX:', error);
    throw new Error('Failed to compile MDX content');
  }
}
