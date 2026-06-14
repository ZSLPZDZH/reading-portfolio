import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-[10px] tracking-[2px] uppercase text-[#555] mb-4">
        About
      </div>
      <h1 className="text-3xl font-light mb-8">关于</h1>

      <div className="space-y-6 text-[#d4d4d4] leading-[1.9]">
        <p>
          我是阿杰，UX 设计师出身，AI 爱好者。
        </p>
        <p>
          这个网站记录了我从 2025 年 2 月开始的阅读旅程。495+ 本书，横跨商业、哲学、心理学、经济学、科技、文学等领域——每一本都认真读完，写下核心观点、深度分析和学习心得。
        </p>
        <p>
          我相信阅读的本质不是「读完」，而是「重构认知」。每本书都是一个思维模型，当你把足够多的模型编织在一起，看世界的方式会发生根本性的变化。
        </p>
        <p>
          这个档案，是我认知体系的可视化。
        </p>

        <blockquote className="border-l-3 border-[#e8c547] pl-4 text-[#888] italic mt-8">
          「专注、极致、口碑、快」<br />
          <span className="text-xs">— 雷军</span>
        </blockquote>
      </div>

      <div className="mt-12 pt-8 border-t border-[#222]">
        <Link
          href="/"
          className="text-xs text-[#888] hover:text-[#e8c547] transition-colors tracking-[1px] uppercase"
        >
          ← Back to Archive
        </Link>
      </div>
    </div>
  );
}
