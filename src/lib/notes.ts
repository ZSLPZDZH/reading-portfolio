import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Note {
  slug: string;
  title: string;
  domain: string;
  domainSlug: string;
  date: string;
  starred: boolean;
  excerpt: string;
  content: string;
}

export interface Domain {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  count: number;
  notes: Note[];
}

const DOMAINS = [
  {
    slug: "business",
    name: "商业",
    nameEn: "Business",
    description: "创业、管理、商业模式与战略思考",
  },
  {
    slug: "philosophy",
    name: "哲学",
    nameEn: "Philosophy",
    description: "存在主义、伦理学、东方智慧与西方哲学",
  },
  {
    slug: "psychology",
    name: "心理学",
    nameEn: "Psychology",
    description: "认知科学、人格心理、群体行为与亲密关系",
  },
  {
    slug: "economics",
    name: "经济学",
    nameEn: "Economics",
    description: "宏观经济、行为经济学与决策科学",
  },
  {
    slug: "culture",
    name: "文化与认知",
    nameEn: "Culture & Cognition",
    description: "社会文化、媒体传播与认知进化",
  },
  {
    slug: "ai-tech",
    name: "AI 与科技",
    nameEn: "AI & Technology",
    description: "人工智能、科技伦理与数字化未来",
  },
  {
    slug: "growth",
    name: "个体成长",
    nameEn: "Personal Growth",
    description: "习惯养成、思维模型与自我管理",
  },
  {
    slug: "biography",
    name: "传记",
    nameEn: "Biography",
    description: "伟大人物的生命故事与思想历程",
  },
  {
    slug: "investment",
    name: "投资",
    nameEn: "Investment",
    description: "价值投资、财务思维与风险管理",
  },
  {
    slug: "literature",
    name: "文学",
    nameEn: "Literature",
    description: "经典文学、当代小说与叙事艺术",
  },
  {
    slug: "chinese-classics",
    name: "儒释道",
    nameEn: "Chinese Classics",
    description: "儒家、道家、佛学与中国传统智慧",
  },
  {
    slug: "politics",
    name: "政策与国家",
    nameEn: "Politics & Society",
    description: "政治经济学、国家治理与文明演进",
  },
  {
    slug: "science",
    name: "科学",
    nameEn: "Science",
    description: "数学、物理、生物学与科学思维",
  },
  {
    slug: "medicine",
    name: "中医",
    nameEn: "Traditional Medicine",
    description: "黄帝内经、伤寒论与中医基础理论",
  },
  {
    slug: "other",
    name: "其它",
    nameEn: "Other",
    description: "跨领域思考与杂记",
  },
];

const NOTES_DIR = path.join(process.cwd(), "content", "notes");

export function getDomainDefinitions() {
  return DOMAINS;
}

export function getAllNotes(): Note[] {
  if (!fs.existsSync(NOTES_DIR)) return [];

  const files = fs.readdirSync(NOTES_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const filePath = path.join(NOTES_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        slug: filename.replace(/\.mdx$/, ""),
        title: data.title || "Untitled",
        domain: data.domain || "other",
        domainSlug: data.domain || "other",
        date: data.date || "",
        starred: data.starred || false,
        excerpt: data.excerpt || content.slice(0, 200) + "...",
        content,
      };
    })
    .sort((a, b) => {
      if (a.date && b.date) return b.date.localeCompare(a.date);
      return a.title.localeCompare(b.title);
    });
}

export function getNotesByDomain(domainSlug: string): Note[] {
  return getAllNotes().filter((n) => n.domainSlug === domainSlug);
}

export function getDomainWithNotes(domainSlug: string): Domain | null {
  const domainDef = DOMAINS.find((d) => d.slug === domainSlug);
  if (!domainDef) return null;

  const notes = getNotesByDomain(domainSlug);
  return { ...domainDef, count: notes.length, notes };
}

export function getAllDomains(): Domain[] {
  const allNotes = getAllNotes();
  return DOMAINS.map((d) => ({
    ...d,
    count: allNotes.filter((n) => n.domainSlug === d.slug).length,
    notes: allNotes.filter((n) => n.domainSlug === d.slug),
  })).filter((d) => d.count > 0);
}

export function getNoteBySlug(slug: string): Note | null {
  const filePath = path.join(NOTES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title || "Untitled",
    domain: data.domain || "other",
    domainSlug: data.domain || "other",
    date: data.date || "",
    starred: data.starred || false,
    excerpt: data.excerpt || "",
    content,
  };
}

export function getFeaturedNotes(): Note[] {
  return getAllNotes()
    .filter((n) => n.starred)
    .slice(0, 12);
}

export function getStats() {
  const allNotes = getAllNotes();
  const domains = getAllDomains();
  return {
    totalNotes: allNotes.length,
    totalDomains: domains.length,
    starredCount: allNotes.filter((n) => n.starred).length,
  };
}
