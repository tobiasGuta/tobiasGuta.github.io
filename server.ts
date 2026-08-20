import express from 'express';
import path from 'path';
import fs from 'fs';
import { Liquid } from 'liquidjs';
import matter from 'gray-matter';
import { marked } from 'marked';

const app = express();
const PORT = 3000;
const ROOT_DIR = process.cwd();

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

// Configure Liquid engine
const engine = new Liquid({
  root: ROOT_DIR,
  partials: [path.join(ROOT_DIR, '_includes'), ROOT_DIR],
  layouts: [path.join(ROOT_DIR, '_layouts'), ROOT_DIR],
  extname: '.html',
  dynamicPartials: false,
  jekyllInclude: true,
  strictVariables: false,
  strictFilters: false,
});

// Helper for date formatting similar to Jekyll strftime
function formatDate(val: any, formatStr?: string): string {
  if (!val) return '';
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val);

  const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsFull = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const day = d.getUTCDate();

  const fmt = formatStr || '%B %-d, %Y';
  return fmt
    .replace(/%B/g, monthsFull[month])
    .replace(/%b/g, monthsShort[month])
    .replace(/%m/g, String(month + 1).padStart(2, '0'))
    .replace(/%-m/g, String(month + 1))
    .replace(/%d/g, String(day).padStart(2, '0'))
    .replace(/%-d/g, String(day))
    .replace(/%Y/g, String(year));
}

// Register Liquid custom filters & tags
engine.registerTag('seo', {
  render: function (ctx: any) {
    const page = ctx.get('page') || {};
    const site = ctx.get('site') || {};
    const siteTitle = site.title || 'Tobias Guta Portfolio';
    const title = page.title && page.title !== 'Home' ? `${page.title} | ${siteTitle}` : siteTitle;
    const desc = page.description || site.description || 'Cybersecurity portfolio, projects, writeups, bug bounty notes, CTF walkthroughs, pentesting labs, and research.';
    return `<title>${title}</title>\n<meta name="description" content="${desc}">\n<meta property="og:title" content="${title}">\n<meta property="og:description" content="${desc}">`;
  }
});

engine.registerFilter('relative_url', (val: any) => {
  if (!val) return '';
  const str = String(val);
  if (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('//')) {
    return str;
  }
  return str.startsWith('/') ? str : `/${str}`;
});

engine.registerFilter('absolute_url', (val: any) => {
  if (!val) return '';
  const str = String(val);
  if (str.startsWith('http://') || str.startsWith('https://')) {
    return str;
  }
  return `https://whoistob1as.me${str.startsWith('/') ? str : `/${str}`}`;
});

engine.registerFilter('markdownify', (val: any) => {
  if (!val) return '';
  return marked.parse(String(val));
});

engine.registerFilter('strip_html', (val: any) => {
  if (!val) return '';
  return String(val).replace(/<[^>]*>?/gm, '');
});

engine.registerFilter('normalize_whitespace', (val: any) => {
  if (!val) return '';
  return String(val).replace(/\s+/g, ' ').trim();
});

engine.registerFilter('slugify', (val: any) => {
  if (!val) return '';
  return String(val)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
});

engine.registerFilter('truncate', (val: any, len?: number) => {
  if (!val) return '';
  const limit = typeof len === 'number' ? len : 150;
  const str = String(val);
  if (str.length <= limit) return str;
  return str.slice(0, limit) + '...';
});

engine.registerFilter('date', (val: any, formatStr?: string) => {
  return formatDate(val, formatStr);
});

// Load data files from _data directory
function loadSiteData() {
  const data: Record<string, any> = {};

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

  data.homepage = readJsonSafe(path.join(ROOT_DIR, '_data', 'homepage.json'));
  data.profile = readJsonSafe(path.join(ROOT_DIR, '_data', 'profile.json'));
  data.settings = readJsonSafe(path.join(ROOT_DIR, '_data', 'settings.json'));
  data.skills = readJsonSafe(path.join(ROOT_DIR, '_data', 'skills.json'));

  // Load certificates as map
  data.certificates = {};
  const certsDir = path.join(ROOT_DIR, '_data', 'certificates');
  if (fs.existsSync(certsDir)) {
    const files = fs.readdirSync(certsDir).filter(f => f.endsWith('.json')).sort();
    for (const f of files) {
      const key = f.replace(/\.json$/, '');
      data.certificates[key] = readJsonSafe(path.join(certsDir, f));
    }
  }

  // Load social links as map
  data.social_links = {};
  const socialsDir = path.join(ROOT_DIR, '_data', 'social_links');
  if (fs.existsSync(socialsDir)) {
    const files = fs.readdirSync(socialsDir).filter(f => f.endsWith('.json')).sort();
    for (const f of files) {
      const key = f.replace(/\.json$/, '');
      data.social_links[key] = readJsonSafe(path.join(socialsDir, f));
    }
  }

  return data;
}

interface PostItem {
  filename: string;
  title: string;
  date: string;
  dateObj: Date;
  categories: string[];
  image?: string;
  permalink?: string;
  url: string;
  locked?: boolean;
  math?: boolean;
  description?: string;
  comments?: boolean;
  rawMarkdown: string;
  contentHtml: string;
  excerpt: string;
  previous?: { url: string; title: string } | null;
  next?: { url: string; title: string } | null;
}

// Load all markdown posts from _posts directory
function loadPosts(): PostItem[] {
  const postsDir = path.join(ROOT_DIR, '_posts');
  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  const posts: PostItem[] = [];

  for (const filename of files) {
    const fullPath = path.join(postsDir, filename);
    const rawContent = fs.readFileSync(fullPath, 'utf-8');
    const { data, content } = matter(rawContent);

    // Extract date from filename if not in frontmatter
    let dateStr = data.date ? String(data.date) : '';
    if (!dateStr) {
      const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
      if (dateMatch) {
        dateStr = dateMatch[1];
      }
    }
    const dateObj = new Date(dateStr || Date.now());

    // Generate url
    let url = data.permalink || '';
    if (!url) {
      const slugName = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
      url = `/blog/${slugName}/`;
    }
    if (!url.startsWith('/')) url = `/${url}`;

    // Handle excerpt
    const plainText = content.replace(/<[^>]*>?/gm, '').replace(/[#*`_\[\]]/g, '').trim();
    const firstParagraph = plainText.split('\n\n')[0] || '';
    const excerpt = firstParagraph.slice(0, 200);

    // Process raw Liquid tags inside markdown body (like {% raw %}...{% endraw %})
    const cleanContent = content
      .replace(/{%\s*raw\s*%}/g, '')
      .replace(/{%\s*endraw\s*%}/g, '');

    const contentHtml = marked.parse(cleanContent) as string;

    const categories: string[] = Array.isArray(data.categories)
      ? data.categories
      : (typeof data.categories === 'string' ? data.categories.split(/\s*,\s*/) : []);

    posts.push({
      filename,
      title: data.title || filename.replace(/\.md$/, ''),
      date: dateStr,
      dateObj,
      categories,
      image: data.image,
      permalink: data.permalink,
      url,
      locked: Boolean(data.locked),
      math: Boolean(data.math),
      description: data.description,
      comments: data.comments !== false,
      rawMarkdown: content,
      contentHtml,
      excerpt,
    });
  }

  // Sort newest first
  posts.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

  // Link previous and next (in Jekyll, previous is older, next is newer)
  for (let i = 0; i < posts.length; i++) {
    if (i < posts.length - 1) {
      posts[i].previous = { url: posts[i + 1].url, title: posts[i + 1].title };
    } else {
      posts[i].previous = null;
    }
    if (i > 0) {
      posts[i].next = { url: posts[i - 1].url, title: posts[i - 1].title };
    } else {
      posts[i].next = null;
    }
  }

  return posts;
}

// Build site context for Liquid templates
function buildSiteContext() {
  const siteData = loadSiteData();
  const posts = loadPosts();

  // Build categories map { 'picoctf': [posts...], ... }
  const categoriesMap: Record<string, PostItem[]> = {};
  for (const post of posts) {
    for (const cat of post.categories) {
      const normalizedCat = cat.trim();
      if (!normalizedCat) continue;
      if (!categoriesMap[normalizedCat]) {
        categoriesMap[normalizedCat] = [];
      }
      categoriesMap[normalizedCat].push(post);
    }
  }

  // Convert categoriesMap to sorted array of [catName, postList] pairs
  const sortedCategories = Object.entries(categoriesMap).sort(([a], [b]) => a.localeCompare(b));

  const site = {
    title: 'Tobias Guta Portfolio',
    description: 'Cybersecurity portfolio, projects, writeups, bug bounty notes, CTF walkthroughs, pentesting labs, and research.',
    url: 'https://whoistob1as.me',
    baseurl: '',
    author: {
      name: 'Tobias Guta',
    },
    data: siteData,
    posts,
    categories: sortedCategories,
    time: new Date(),
  };

  return { site, posts };
}

// Render a template file with Liquid
async function renderLiquidFile(filePath: string, pageData: Record<string, any> = {}) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  // Strip Jekyll YAML frontmatter if present
  const { content: templateBody, data: frontmatter } = matter(raw);
  const { site, posts } = buildSiteContext();

  const page = {
    ...frontmatter,
    ...pageData,
  };

  const context = {
    site,
    page,
    content: pageData.content || '',
  };

  return await engine.parseAndRender(templateBody, context);
}

// Express static routes
app.use('/assets', express.static(path.join(ROOT_DIR, 'assets')));
app.use('/Pictures', express.static(path.join(ROOT_DIR, 'Pictures')));
app.use('/poc', express.static(path.join(ROOT_DIR, 'poc')));
app.use('/admin', express.static(path.join(ROOT_DIR, 'admin')));

// Serve robots.txt and CNAME if requested
app.get('/robots.txt', (req, res) => {
  const rPath = path.join(ROOT_DIR, 'robots.txt');
  if (fs.existsSync(rPath)) return res.sendFile(rPath);
  res.type('text/plain').send('User-agent: *\nAllow: /');
});

// Atom RSS Feed
app.get(['/feed.xml', '/feed'], (req, res) => {
  const { site, posts } = buildSiteContext();
  const latestPosts = posts.slice(0, 20);
  const feedXml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${site.title}</title>
  <subtitle>${site.description}</subtitle>
  <link href="https://whoistob1as.me/feed.xml" rel="self"/>
  <link href="https://whoistob1as.me/"/>
  <updated>${new Date().toISOString()}</updated>
  <id>https://whoistob1as.me/</id>
  <author>
    <name>${site.author.name}</name>
  </author>
  ${latestPosts.map(p => `
  <entry>
    <title>${p.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>
    <link href="https://whoistob1as.me${p.url}"/>
    <id>https://whoistob1as.me${p.url}</id>
    <updated>${p.dateObj.toISOString()}</updated>
    <summary>${p.excerpt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</summary>
  </entry>`).join('')}
</feed>`;
  res.type('application/atom+xml').send(feedXml);
});

// Home page
app.get(['/', '/index.html'], async (req, res, next) => {
  try {
    const html = await renderLiquidFile(path.join(ROOT_DIR, 'index.html'), { title: 'Home', url: '/' });
    res.send(html);
  } catch (err) {
    next(err);
  }
});

// Projects page
app.get(['/projects', '/projects.html'], async (req, res, next) => {
  try {
    const html = await renderLiquidFile(path.join(ROOT_DIR, 'projects.html'), { title: 'Projects', url: '/projects.html' });
    res.send(html);
  } catch (err) {
    next(err);
  }
});

// Writeups page
app.get(['/writeups', '/writeups.html'], async (req, res, next) => {
  try {
    const html = await renderLiquidFile(path.join(ROOT_DIR, 'writeups.html'), { title: 'Writeups', url: '/writeups.html' });
    res.send(html);
  } catch (err) {
    next(err);
  }
});

// Contact page
app.get(['/contact', '/contact.html'], async (req, res, next) => {
  try {
    const html = await renderLiquidFile(path.join(ROOT_DIR, 'contact.html'), { title: 'Contact', url: '/contact.html' });
    res.send(html);
  } catch (err) {
    next(err);
  }
});

// Hidden CTF Vault page
app.get(['/ctf', '/ctf/', '/ctf/index.html'], (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'ctf', 'index.html'));
});

// Single blog post router
app.get(['/blog/:slug', '/blog/:slug/', '/posts/:slug', '/posts/:slug/'], async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const { posts, site } = buildSiteContext();

    // Match post by permalink or slug in filename or url
    const post = posts.find(p => {
      const matchUrl = p.url.replace(/\/$/, '') === `/blog/${slug}` || p.url.replace(/\/$/, '') === `/posts/${slug}`;
      const matchSlug = p.filename.includes(slug);
      return matchUrl || matchSlug;
    });

    if (!post) {
      return next();
    }

    const layoutPath = path.join(ROOT_DIR, '_layouts', 'post.html');
    const html = await renderLiquidFile(layoutPath, {
      ...post,
      content: post.contentHtml,
    });

    res.send(html);
  } catch (err) {
    next(err);
  }
});

// 404 handler
app.use(async (req, res) => {
  try {
    res.status(404);
    const html = await renderLiquidFile(path.join(ROOT_DIR, '404.html'), { title: '404', url: req.url });
    res.send(html);
  } catch (e) {
    res.status(404).send('404 - Page Not Found');
  }
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).send(`<h1>500 Internal Server Error</h1><pre>${err?.message || err}</pre>`);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
