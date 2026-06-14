import { getNoteBySlug, getAllNotes, getDomainWithNotes } from "@/lib/notes";
import { notFound } from "next/navigation";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";

export function generateStaticParams() {
  const notes = getAllNotes();
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const note = getNoteBySlug(slug);
  if (!note) return {};
  return {
    title: `${note.title} · 阿杰的阅读档案`,
    description: note.excerpt,
  };
}

export default async function NotePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const note = getNoteBySlug(slug);
  if (!note) notFound();

  const domain = getDomainWithNotes(note.domainSlug);
  const domainNotes = domain?.notes || [];
  const currentIndex = domainNotes.findIndex((n) => n.slug === slug);
  const prevNote = currentIndex > 0 ? domainNotes[currentIndex - 1] : null;
  const nextNote =
    currentIndex < domainNotes.length - 1 ? domainNotes[currentIndex + 1] : null;

  const { content } = await compileMDX({
    source: note.content,
    options: { mdxOptions: { remarkPlugins: [] } },
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      <div className="text-xs text-[#555] mb-8">
        <Link href="/" className="hover:text-[#888] transition-colors">
          首页
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/domain/${note.domainSlug}`}
          className="hover:text-[#888] transition-colors"
        >
          {domain?.name || note.domain}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#888]">{note.title}</span>
      </div>

      {/* Header */}
      <header className="mb-12 pb-8 border-b border-[#222]">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href={`/domain/${note.domainSlug}`}
            className="text-[10px] tracking-[2px] uppercase text-[#e8c547] border border-[#e8c547] px-2 py-0.5 hover:bg-[#e8c547] hover:text-[#0a0a0a] transition-all"
          >
            {domain?.name || note.domain}
          </Link>
          {note.starred && <span className="text-[#e8c547]">★</span>}
        </div>
        <h1 className="text-3xl md:text-4xl font-light leading-tight mb-4">
          {note.title}
        </h1>
        {note.date && (
          <div className="text-[11px] tracking-[2px] text-[#555] uppercase">
            {note.date}
          </div>
        )}
      </header>

      {/* Content */}
      <article className="note-content">{content}</article>

      {/* Navigation */}
      <nav className="mt-16 pt-8 border-t border-[#222] flex justify-between gap-4">
        {prevNote ? (
          <Link
            href={`/note/${prevNote.slug}`}
            className="group flex-1"
          >
            <div className="text-[10px] tracking-[1px] uppercase text-[#555] mb-1">
              ← Previous
            </div>
            <div className="text-sm text-[#888] group-hover:text-[#e8c547] transition-colors">
              {prevNote.title}
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {nextNote ? (
          <Link
            href={`/note/${nextNote.slug}`}
            className="group flex-1 text-right"
          >
            <div className="text-[10px] tracking-[1px] uppercase text-[#555] mb-1">
              Next →
            </div>
            <div className="text-sm text-[#888] group-hover:text-[#e8c547] transition-colors">
              {nextNote.title}
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </nav>
    </div>
  );
}
