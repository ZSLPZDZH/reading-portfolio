import { getAllDomains } from "@/lib/notes";
import DomainCard from "@/components/DomainCard";

export const metadata = {
  title: "知识版图 · 阿杰的阅读档案",
};

export default function DomainsPage() {
  const domains = getAllDomains();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-12">
        <div className="text-[10px] tracking-[2px] uppercase text-[#555] mb-2">
          Knowledge Map
        </div>
        <h1 className="text-3xl font-light">知识版图</h1>
        <p className="text-[#888] text-sm mt-2">
          {domains.length} 个知识领域，{domains.reduce((s, d) => s + d.count, 0)}+ 篇读书笔记
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {domains.map((domain) => (
          <DomainCard key={domain.slug} {...domain} />
        ))}
      </div>
    </div>
  );
}
