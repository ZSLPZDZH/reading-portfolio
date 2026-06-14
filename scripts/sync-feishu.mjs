/**
 * Sync Feishu Wiki → MDX files
 * Usage: node scripts/sync-feishu.mjs
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const SPACE_ID = "7570533065685057540";
const CONTENT_DIR = "content/notes";

// Domain mapping: Feishu node_token → domain slug
const DOMAIN_TOKEN_MAP = {
  Z5s4wigDXitYmpkdvbKcGiZYnRu: "culture",
  UV4vwdle1iVjm1kDOTlc46u6nnb: "psychology",
  BwakwFsSoiezuPkvUo0cIlyEn1c: "ai-tech",
  EkKiwv2RqiMyhNkfJDcca0dvnnf: "growth",
  KhZOwgTosi5OWpk6ipjcJR53nAg: "chinese-classics",
  MoeJwV4eZiWbwhkXYNPcHHmnnng: "biography",
  HANewjPsEiEExPk4seocFD5FnLg: "investment",
  AI0DwfDdPi0hLOksLTBcyQ29nge: "literature",
  MOJxwvbLFiWQbyk9rXOcEah4n4b: "politics",
};

function run(cmd) {
  try {
    return execSync(cmd, { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 });
  } catch (e) {
    return null;
  }
}

function parseJson(output) {
  try {
    const lines = output.trim().split("\n");
    // Find the JSON part (skip any warnings/deprecation notices)
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith("{")) {
        return JSON.parse(lines.slice(i).join("\n"));
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchAllNodes(spaceId, parentNodeToken = null) {
  const allNodes = [];
  let pageToken = "";

  while (true) {
    let cmd = `lark-cli wiki +node-list --space-id ${spaceId} --format json`;
    if (parentNodeToken) cmd += ` --parent-node-token ${parentNodeToken}`;
    if (pageToken) cmd += ` --page-token "${pageToken}"`;

    const output = run(cmd);
    if (!output) break;

    const data = parseJson(output);
    if (!data || !data.data || !data.data.nodes) break;

    allNodes.push(...data.data.nodes);

    if (data.data.has_more && data.data.page_token) {
      pageToken = data.data.page_token;
    } else {
      break;
    }
  }

  return allNodes;
}

async function fetchDocContent(objToken) {
  const output = run(`lark-cli docs +fetch --doc ${objToken} --format json`);
  if (!output) return null;

  const data = parseJson(output);
  if (!data || !data.ok || !data.data) return null;
  return data.data;
}

function sanitizeTitle(title) {
  return title
    .replace(/^0*\d+/, "") // remove leading numbers
    .replace(/[⭐★]/g, "") // remove stars
    .replace(/[《》]/g, "") // remove book brackets
    .replace(/[（）()]/g, "") // remove parentheses
    .replace(/^\s+|\s+$/g, "") // trim
    .replace(/\s+/g, "-") // spaces to hyphens
    .replace(/[^a-zA-Z0-9一-鿿\-]/g, "") // keep only alphanumeric, Chinese, hyphens
    .toLowerCase();
}

function extractDate(title) {
  const match = title.match(/[（(](\d+)\.(\d+)[）)]/);
  if (match) {
    const month = match[1].padStart(2, "0");
    const day = match[2].padStart(2, "0");
    return `2025-${month}-${day}`;
  }
  return "";
}

function extractExcerpt(markdown) {
  const lines = markdown
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("#") && !l.startsWith(">"));
  return lines
    .slice(0, 3)
    .join(" ")
    .replace(/[《》★⭐]/g, "")
    .slice(0, 200);
}

function sanitizeMarkdownForMDX(md) {
  // Escape angle brackets that MDX would interpret as JSX
  // < followed by digit or space+digit (e.g., R0<1, < 3)
  // > preceded by digit (e.g., R0>1)
  return md
    .replace(/(\w)<(\d)/g, "$1&lt;$2")
    .replace(/(\w)>(\d)/g, "$1&gt;$2")
    .replace(/<(\s+\d)/g, "&lt;$1")
    .replace(/(\d)>(\s)/g, "$1&gt;$2");
}

function buildFrontmatter(meta) {
  const escape = (s) => (s || "").replace(/"/g, '\\"').replace(/\n/g, " ");
  return [
    "---",
    `title: "${escape(meta.title)}"`,
    `domain: "${meta.domain}"`,
    `date: "${meta.date}"`,
    `starred: ${meta.starred}`,
    `excerpt: "${escape(meta.excerpt)}"`,
    "---",
    "",
  ].join("\n");
}

async function main() {
  console.log("=== Feishu Wiki → MDX Sync ===\n");

  // Step 1: Get all root-level nodes
  console.log("Step 1: Fetching root-level nodes...");
  const rootNodes = await fetchAllNodes(SPACE_ID);
  console.log(`  Found ${rootNodes.length} root nodes`);

  // Step 2: Get domain children
  console.log("Step 2: Fetching domain children...");
  const domainTokens = new Set(Object.keys(DOMAIN_TOKEN_MAP));
  const childNodes = [];

  for (const [nodeToken, domainSlug] of Object.entries(DOMAIN_TOKEN_MAP)) {
    process.stdout.write(`  Fetching ${domainSlug}...`);
    const children = await fetchAllNodes(SPACE_ID, nodeToken);
    children.forEach((n) => {
      n._domain = domainSlug;
    });
    childNodes.push(...children);
    console.log(` ${children.length} notes`);
  }
  console.log(`  Total domain children: ${childNodes.length}`);

  // Step 3: Merge and deduplicate
  console.log("Step 3: Merging and deduplicating...");
  const notesByObjToken = {};

  // Add domain children first (they have explicit domain)
  childNodes.forEach((n) => {
    if (n.obj_type !== "docx") return;
    const key = n.obj_token;
    if (!notesByObjToken[key]) {
      notesByObjToken[key] = {
        obj_token: n.obj_token,
        title: n.title,
        domain: n._domain || "other",
        node_token: n.node_token,
      };
    }
  });

  // Add root-level notes (uncategorized)
  rootNodes.forEach((n) => {
    if (n.obj_type !== "docx") return;
    if (domainTokens.has(n.node_token)) return;
    const key = n.obj_token;
    if (!notesByObjToken[key]) {
      notesByObjToken[key] = {
        obj_token: n.obj_token,
        title: n.title,
        domain: "other",
        node_token: n.node_token,
      };
    }
  });

  const allNotes = Object.values(notesByObjToken);
  console.log(`  Total unique notes: ${allNotes.length}`);

  // Step 4: Fetch content and write MDX files
  console.log("Step 4: Fetching content and writing MDX files...");
  fs.mkdirSync(CONTENT_DIR, { recursive: true });

  let synced = 0;
  let skipped = 0;
  let failed = 0;

  for (const note of allNotes) {
    const filename = note.obj_token;
    const filepath = path.join(CONTENT_DIR, `${filename}.mdx`);

    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      skipped++;
      continue;
    }

    const doc = await fetchDocContent(note.obj_token);
    if (!doc || !doc.markdown) {
      failed++;
      console.log(`  FAILED: ${note.title}`);
      continue;
    }

    let markdown = doc.markdown
      .replace(/<image[^>]*\/>/g, "") // Remove image tags
      .replace(/<[^>]+>/g, "") // Remove HTML tags
      .trim();

    // Sanitize for MDX compatibility
    markdown = sanitizeMarkdownForMDX(markdown);

    const date = extractDate(note.title);
    const starred = note.title.includes("⭐");
    const excerpt = extractExcerpt(markdown);

    // Clean title for display
    const cleanTitle = note.title
      .replace(/^\d+/, "")
      .replace(/[⭐★]/g, "")
      .trim();

    const frontmatter = buildFrontmatter({
      title: cleanTitle,
      domain: note.domain,
      date,
      starred,
      excerpt,
    });

    fs.writeFileSync(filepath, frontmatter + markdown);
    synced++;

    if (synced % 20 === 0) {
      console.log(`  Progress: ${synced} synced...`);
    }
  }

  console.log(`\n=== Sync Complete ===`);
  console.log(`  Synced: ${synced}`);
  console.log(`  Skipped: ${skipped} (already exists)`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total: ${allNotes.length}`);
}

main().catch(console.error);
