import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-[#222]">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="group">
          <span className="text-[#e8c547] tracking-[3px] text-xs uppercase">
            Reading Archive
          </span>
          <div className="text-lg mt-0.5 group-hover:text-[#e8c547] transition-colors">
            阿杰
          </div>
        </Link>
        <nav className="flex items-center gap-8 text-sm text-[#888]">
          <Link
            href="/"
            className="hover:text-[#f5f5f5] transition-colors"
          >
            首页
          </Link>
          <Link
            href="/domains"
            className="hover:text-[#f5f5f5] transition-colors"
          >
            领域
          </Link>
          <Link
            href="/about"
            className="hover:text-[#f5f5f5] transition-colors"
          >
            关于
          </Link>
        </nav>
      </div>
    </header>
  );
}
