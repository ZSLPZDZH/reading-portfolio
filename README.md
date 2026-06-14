# 阅读档案 · Reading Portfolio

基于飞书「阅读-知识库」构建的个人阅读档案网站，展示 1282 篇读书笔记，涵盖商业、哲学、心理学、经济学等 10 个知识领域。

**访问地址：** https://reading-portfolio-two.vercel.app

## 快速开始

```bash
# 安装依赖
npm install

# 从飞书同步笔记（首次 / 有新笔记时）
npm run sync

# 本地开发
npm run dev
# 打开 http://localhost:3000

# 构建
npm run build

# 部署到 Vercel
npx vercel --prod
```

## 技术栈

- **框架：** Next.js 16 (App Router, SSG)
- **语言：** TypeScript
- **样式：** Tailwind CSS 4（暗黑极简主题）
- **内容：** MDX + gray-matter
- **部署：** Vercel
- **数据源：** 飞书知识库（lark-cli 同步）

## 项目结构

```
content/notes/           # 1282 个 MDX 笔记文件
src/
  app/
    page.tsx             # 首页（Hero + 知识版图 + 精选笔记）
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

## 更新内容

1. 在飞书「阅读-知识库」新增笔记
2. 运行 `npm run sync`（增量同步，已有文件跳过）
3. 运行 `npm run build` 验证
4. 运行 `npx vercel --prod` 部署

## 相关链接

- [使用手册（飞书）](https://ecnurcfxtmqo.feishu.cn/docx/WbetdaceioC4Hnx84rBcitXknWi)
- [Vercel Dashboard](https://vercel.com/lpzhs-projects/reading-portfolio)
