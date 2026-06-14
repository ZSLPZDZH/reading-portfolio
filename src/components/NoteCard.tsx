import Link from "next/link";

interface NoteCardProps {
  slug: string;
  title: string;
  domain: string;
  date: string;
  starred: boolean;
  excerpt: string;
}

export default function NoteCard({
  slug,
  title,
  date,
  starred,
  excerpt,
}: NoteCardProps) {
  return (
    <Link
      href={`/note/${slug}`}
      className="group block border border-[#222] p-5 hover:border-[#e8c547] transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-base leading-snug group-hover:text-[#e8c547] transition-colors flex-1 pr-2">
          {title}
        </h3>
        {starred && <span className="text-[#e8c547] text-sm">★</span>}
      </div>
      {date && (
        <div className="text-[10px] tracking-[1px] text-[#555] uppercase mb-3">
          {date}
        </div>
      )}
      <p className="text-xs text-[#666] leading-relaxed line-clamp-3">
        {excerpt}
      </p>
    </Link>
  );
}
