import { getDomainWithNotes, getAllDomains } from "@/lib/notes";
import NoteCard from "@/components/NoteCard";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  const domains = getAllDomains();
  return domains.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const domain = getDomainWithNotes(slug);
  if (!domain) return {};
  return {
    title: `${domain.name} · 阿杰的阅读档案`,
    description: domain.description,
  };
}

export default async function DomainPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const domain = getDomainWithNotes(slug);
  if (!domain) notFound();

  const starredNotes = domain.notes.filter((n) => n.starred);
  const otherNotes = domain.notes.filter((n) => !n.starred);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      <div className="text-xs text-[#555] mb-8">
        <Link href="/" className="hover:text-[#888] transition-colors">
          首页
        </Link>
        <span className="mx-2">/</span>
        <Link href="/domains" className="hover:text-[#888] transition-colors">
          领域
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#888]">{domain.name}</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <div className="text-[10px] tracking-[2px] uppercase text-[#555] mb-2">
          {domain.nameEn}
        </div>
        <h1 className="text-3xl font-light mb-3">{domain.name}</h1>
        <p className="text-[#888] text-sm">{domain.description}</p>
        <div className="text-[#e8c547] text-2xl font-light mt-4">
          {domain.count} <span className="text-xs text-[#555]">books</span>
        </div>
      </div>

      {/* Starred Notes */}
      {starredNotes.length > 0 && (
        <div className="mb-12">
          <div className="text-[10px] tracking-[2px] uppercase text-[#555] mb-4">
            ★ Featured
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {starredNotes.map((note) => (
              <NoteCard key={note.slug} {...note} />
            ))}
          </div>
        </div>
      )}

      {/* All Notes */}
      <div>
        <div className="text-[10px] tracking-[2px] uppercase text-[#555] mb-4">
          All Notes · {domain.count}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherNotes.map((note) => (
            <NoteCard key={note.slug} {...note} />
          ))}
        </div>
      </div>
    </div>
  );
}
