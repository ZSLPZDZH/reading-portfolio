import { getAllDomains, getFeaturedNotes, getStats } from "@/lib/notes";
import DomainCard from "@/components/DomainCard";
import NoteCard from "@/components/NoteCard";
import Link from "next/link";

export default function HomePage() {
  const stats = getStats();
  const domains = getAllDomains();
  const featured = getFeaturedNotes();

  return (
    <div>
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="animate-fade-in">
          <div className="text-[#888] text-[11px] tracking-[3px] uppercase mb-4">
            Reading Archive · Since 2025
          </div>
          <h1 className="text-4xl md:text-5xl font-light leading-tight mb-6">
            阿杰的
            <br />
            <span className="text-[#e8c547]">阅读档案</span>
          </h1>
          <p className="text-[#888] text-base max-w-xl leading-relaxed mb-8">
            {stats.totalNotes}+ 篇读书笔记，横跨 {stats.totalDomains}{" "}
            个知识领域。
            <br />
            从商业战略到东方哲学，从认知科学到价值投资——
            <br />
            每一本书都是一次思维的重构。
          </p>
        </div>

        {/* Stats Row */}
        <div className="animate-fade-in-delay flex gap-12 mt-12 pt-8 border-t border-[#222]">
          <div>
            <div className="text-3xl text-[#e8c547] font-light">
              {stats.totalNotes}+
            </div>
            <div className="text-[10px] tracking-[2px] uppercase text-[#555] mt-1">
              Books Read
            </div>
          </div>
          <div>
            <div className="text-3xl text-[#e8c547] font-light">
              {stats.totalDomains}
            </div>
            <div className="text-[10px] tracking-[2px] uppercase text-[#555] mt-1">
              Domains
            </div>
          </div>
          <div>
            <div className="text-3xl text-[#e8c547] font-light">
              {stats.starredCount}
            </div>
            <div className="text-[10px] tracking-[2px] uppercase text-[#555] mt-1">
              Featured
            </div>
          </div>
        </div>
      </section>

      {/* Domain Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-[10px] tracking-[2px] uppercase text-[#555] mb-2">
              Knowledge Map
            </div>
            <h2 className="text-2xl font-light">知识版图</h2>
          </div>
          <Link
            href="/domains"
            className="text-xs text-[#888] hover:text-[#e8c547] transition-colors tracking-[1px] uppercase"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {domains.map((domain) => (
            <DomainCard key={domain.slug} {...domain} />
          ))}
        </div>
      </section>

      {/* Featured Notes */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-8">
            <div className="text-[10px] tracking-[2px] uppercase text-[#555] mb-2">
              Curated Selection
            </div>
            <h2 className="text-2xl font-light">精选笔记</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((note) => (
              <NoteCard key={note.slug} {...note} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {domains.length === 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16 text-center">
          <p className="text-[#555] text-sm">
            内容正在同步中，请运行{" "}
            <code className="bg-[#141414] px-2 py-1 text-[#e8c547]">
              npm run sync
            </code>{" "}
            从飞书拉取笔记。
          </p>
        </section>
      )}
    </div>
  );
}
