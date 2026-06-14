# Reading Portfolio

个人阅读档案网站，展示飞书「阅读-知识库」中的 1282 篇读书笔记。

## 技术栈

- Next.js 16 (App Router, SSG)
- TypeScript + Tailwind CSS 4
- MDX + gray-matter
- 部署：Vercel

## 常用命令

```bash
npm run sync       # 从飞书同步笔记到 content/notes/
npm run dev        # 本地开发服务器 (localhost:3000)
npm run build      # 构建静态站点
npx vercel --prod  # 部署到生产环境
```

## 目录结构

```
content/notes/           # MDX 笔记文件（sync 脚本自动生成）
src/
  app/
    page.tsx             # 首页
    domains/page.tsx     # 领域总览
    domain/[slug]/       # 领域详情
    note/[slug]/         # 笔记详情
    about/page.tsx       # 关于页面
    globals.css          # 暗黑极简主题
  components/            # Header, Footer, DomainCard, NoteCard
  lib/notes.ts           # 数据层
scripts/
  sync-feishu.mjs        # 飞书同步脚本
```

## 领域映射

飞书 node_token → slug 的映射在 `scripts/sync-feishu.mjs` 的 `DOMAIN_TOKEN_MAP` 中。
领域定义在 `src/lib/notes.ts` 的 `DOMAINS` 数组中。

## 视觉风格

暗黑极简：深色背景 (#0a0a0a)、衬线字体、金色点缀 (#e8c547)。
CSS 变量在 `src/app/globals.css` 顶部。

## 约定

- 新增领域：同时改 `DOMAINS`（notes.ts）和 `DOMAIN_TOKEN_MAP`（sync 脚本）
- 精选笔记：飞书标题带 ⭐ 的自动标记为 starred
- 同步脚本增量运行，已有文件跳过不覆盖
