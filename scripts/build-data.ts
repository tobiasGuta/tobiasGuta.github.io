import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const ROOT_DIR = process.cwd();

marked.setOptions({
  gfm: true,
  breaks: true,
});

function loadSiteData() {
  const readJsonSafe = (filePath: string) => {
    try {
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
    } catch (e) {
      console.warn(`Failed to parse ${filePath}`, e);
    }
    return {};
  };

  const homepage = readJsonSafe(path.join(ROOT_DIR, '_data', 'homepage.json'));
  const profile = readJsonSafe(path.join(ROOT_DIR, '_data', 'profile.json'));
  const settings = readJsonSafe(path.join(ROOT_DIR, '_data', 'settings.json'));
  const skills = readJsonSafe(path.join(ROOT_DIR, '_data', 'skills.json'));

  const certificates: any[] = [];
  const certsDir = path.join(ROOT_DIR, '_data', 'certificates');
  if (fs.existsSync(certsDir)) {
    const files = fs.readdirSync(certsDir).filter(f => f.endsWith('.json')).sort();
    for (const f of files) {
      certificates.push(readJsonSafe(path.join(certsDir, f)));
    }
  }

  const social_links: any[] = [];
  const socialsDir = path.join(ROOT_DIR, '_data', 'social_links');
  if (fs.existsSync(socialsDir)) {
    const files = fs.readdirSync(socialsDir).filter(f => f.endsWith('.json')).sort();
    for (const f of files) {
      social_links.push(readJsonSafe(path.join(socialsDir, f)));
    }
  }

  return { homepage, profile, settings, skills, certificates, social_links };
}

function loadPosts() {
  const postsDir = path.join(ROOT_DIR, '_posts');
  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md')).sort();
  const posts: any[] = [];

  for (const filename of files) {
    const fullPath = path.join(postsDir, filename);
    const rawContent = fs.readFileSync(fullPath, 'utf-8');
    const { data, content } = matter(rawContent);

    let dateStr = data.date ? String(data.date) : '';
    if (!dateStr) {
      const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
      if (dateMatch) {
        dateStr = dateMatch[1];
      }
    }
    const dateObj = new Date(dateStr || Date.now());

    let slug = '';
    let url = data.permalink || '';
    if (!url) {
      const slugName = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
      url = `/blog/${slugName}/`;
      slug = slugName;
    } else {
      slug = url.replace(/^\/blog\//, '').replace(/^\/posts\//, '').replace(/\/$/, '');
    }
    if (!url.startsWith('/')) url = `/${url}`;

    // Normalize mojibake in markdown content
    let normalizedContent = content
      .replace(/ðŸ“–/g, '📖')
      .replace(/ðŸ‘»/g, '👻')
      .replace(/ðŸ ›/g, '🐛')
      .replace(/ðŸ\x90›/g, '🐛')
      .replace(/ðŸ“‰/g, '📉')
      .replace(/ðŸ§/g, '🧠')
      .replace(/ðŸš§/g, '🚧')
      .replace(/ðŸš€/g, '🚀')
      .replace(/ðŸ›[\s\S]?ï¸\s*/g, '🛠️')
      .replace(/ðŸ\x9b[\s\S]?ï¸\s*/g, '🛠️')
      .replace(/ðŸ ¢/g, '🏢')
      .replace(/ðŸ\x8f¢/g, '🏢')
      .replace(/ðŸ’¡/g, '💡')
      .replace(/ðŸ”—/g, '🔗')
      .replace(/Â·/g, '·')
      .replace(/Â /g, ' ');

    // Clean plain text for excerpt (remove blockquotes, headings, images, badges, code)
    let excerpt = '';
    if (data.description && typeof data.description === 'string' && data.description.trim().length > 25) {
      excerpt = data.description.trim();
    } else {
      const cleanLines = normalizedContent
        .split('\n')
        .map(l => l.trim())
        .filter(l => {
          if (!l) return false;
          if (l.startsWith('#')) return false; // skip headers
          if (l.startsWith('![')) return false; // skip images
          if (l.startsWith('```')) return false; // skip code fences
          if (l === '---' || l === '***') return false; // skip dividers
          if (l.includes('▃▅') || l.includes('Start Challenge')) return false; // skip ASCII badges
          return true;
        })
        .map(l => l.replace(/^>\s*/, '').replace(/[#*`_\[\]]/g, '').trim())
        .filter(l => l.length > 20);

      const combined = cleanLines.slice(0, 3).join(' ').replace(/\s+/g, ' ').trim();
      excerpt = combined.length > 220 ? combined.slice(0, 217).trim() + '...' : combined;
    }
    if (!excerpt) {
      excerpt = `${data.title || filename.replace(/\.md$/, '')} — Technical field notes and security walkthrough.`;
    }

    // Remove liquid tags
    const cleanContent = normalizedContent
      .replace(/\{%\s*raw\s*%\}/g, '')
      .replace(/\{%\s*endraw\s*%\}/g, '');

    const contentHtml = marked.parse(cleanContent) as string;

    const categories: string[] = Array.isArray(data.categories)
      ? data.categories
      : (typeof data.categories === 'string' ? data.categories.split(/\s*,\s*/) : []);

    posts.push({
      filename,
      slug,
      title: (data.title || filename.replace(/\.md$/, '')).replace(/Â·/g, '·'),
      date: dateStr,
      dateFormatted: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
      dateFormattedLong: dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
      timestamp: dateObj.getTime(),
      categories,
      image: data.image || '',
      permalink: data.permalink || url,
      url,
      locked: Boolean(data.locked),
      math: Boolean(data.math),
      description: data.description || '',
      comments: data.comments !== false,
      rawMarkdown: normalizedContent,
      contentHtml,
      excerpt,
    });
  }

  // Sort newest first
  posts.sort((a, b) => b.timestamp - a.timestamp);

  // Link previous and next
  for (let i = 0; i < posts.length; i++) {
    if (i < posts.length - 1) {
      posts[i].previous = { url: posts[i + 1].url, slug: posts[i + 1].slug, title: posts[i + 1].title };
    } else {
      posts[i].previous = null;
    }
    if (i > 0) {
      posts[i].next = { url: posts[i - 1].url, slug: posts[i - 1].slug, title: posts[i - 1].title };
    } else {
      posts[i].next = null;
    }
  }

  return posts;
}

const outDir = path.join(ROOT_DIR, 'src', 'data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const siteData = loadSiteData();
const posts = loadPosts();

fs.writeFileSync(
  path.join(outDir, 'siteData.ts'),
  `export const siteData = ${JSON.stringify(siteData, null, 2)};\n`
);

fs.writeFileSync(
  path.join(outDir, 'postsData.ts'),
  `export interface PostItem {
  filename: string;
  slug: string;
  title: string;
  date: string;
  dateFormatted: string;
  dateFormattedLong: string;
  timestamp: number;
  categories: string[];
  image?: string;
  permalink: string;
  url: string;
  locked: boolean;
  math: boolean;
  description?: string;
  comments: boolean;
  rawMarkdown: string;
  contentHtml: string;
  excerpt: string;
  previous?: { url: string; slug: string; title: string } | null;
  next?: { url: string; slug: string; title: string } | null;
}

export const postsData: PostItem[] = ${JSON.stringify(posts, null, 2)};
`
);

console.log(`Successfully generated siteData.ts and postsData.ts with ${posts.length} posts!`);
