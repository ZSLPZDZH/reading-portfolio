import Link from "next/link";

interface DomainCardProps {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  count: number;
}

export default function DomainCard({
  slug,
  name,
  nameEn,
  description,
  count,
}: DomainCardProps) {
  return (
    <Link
      href={`/domain/${slug}`}
      className="group block border border-[#222] p-6 hover:border-[#e8c547] transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-[10px] tracking-[2px] uppercase text-[#555]">
            {nameEn}
          </div>
          <div className="text-lg mt-1 group-hover:text-[#e8c547] transition-colors">
            {name}
          </div>
        </div>
        <div className="text-2xl text-[#e8c547] font-light">{count}</div>
      </div>
      <p className="text-xs text-[#666] leading-relaxed">{description}</p>
    </Link>
  );
}
