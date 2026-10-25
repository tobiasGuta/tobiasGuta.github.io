import React, { useEffect, useState } from 'react';

interface Repo {
  name: string;
  description: string;
  html_url: string;
  homepage: string | null;
  language: string;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
  archived: boolean;
}

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Repo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [countText, setCountText] = useState<string>('Loading repositories...');
  const [sourceText, setSourceText] = useState<string>('Trying generated project data first.');

  const formatDate = (value: string) => {
    if (!value) return 'unknown';
    return new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(value));
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const res = await fetch('/assets/data/projects.json');
        if (!res.ok) throw new Error('Static data unavailable');
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.projects;
        if (!Array.isArray(list)) throw new Error('Invalid project format');

        if (isMounted) {
          const filtered = list
            .filter((r: any) => !r.fork && !r.archived)
            .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
          setProjects(filtered);
          setCountText(`${filtered.length} public projects loaded`);
          setSourceText(data.generated_at ? `Loaded from generated static data (${formatDate(data.generated_at)}).` : 'Loaded from static project data.');
          setLoading(false);
        }
      } catch {
        try {
          const apiRes = await fetch('https://api.github.com/users/tobiasGuta/repos?sort=updated&per_page=100');
          if (!apiRes.ok) throw new Error('GitHub API error');
          const apiData = await apiRes.json();
          if (isMounted && Array.isArray(apiData)) {
            const filtered = apiData
              .filter((r: any) => !r.fork && !r.archived)
              .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
            setProjects(filtered);
            setCountText(`${filtered.length} public projects loaded`);
            setSourceText('Loaded live from the public GitHub API.');
            setLoading(false);
          }
        } catch {
          if (isMounted) {
            setCountText('Unable to load projects');
            setSourceText('Generated data and live GitHub API fallback both failed.');
            setLoading(false);
          }
        }
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="projects-page">
      <section className="section-block projects-block">
        <div className="section-header projects-header">
          <span>⚡</span>
          <h2 className="projects-title">AUTO PROJECT INDEX</h2>
        </div>
        <div className="section-content">
          <div className="projects-toolbar">
            <div>
              <div className="projects-count" id="projects-count">
                {countText}
              </div>
              <div className="projects-source" id="projects-source">
                {sourceText}
              </div>
            </div>
            <a
              className="project-link projects-profile-link"
              href="https://github.com/tobiasGuta"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Profile
            </a>
          </div>

          <div className="projects-grid" id="projects-grid" aria-live="polite">
            {loading && (
              <div className="project-loading">Scanning public repositories...</div>
            )}
            {!loading && projects.length === 0 && (
              <div className="project-loading">No public projects found.</div>
            )}
            {!loading &&
              projects.map((repo, idx) => (
                <article className="project-card" key={idx}>
                  <div className="project-card-topline">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-card-title"
                    >
                      {repo.name}
                    </a>
                    <span className="project-language">{repo.language || 'Code'}</span>
                  </div>
                  <p>{repo.description || 'No description yet.'}</p>
                  <div className="project-meta">
                    <span>★ {repo.stargazers_count}</span>
                    <span>⑂ {repo.forks_count}</span>
                    <span>Updated {formatDate(repo.updated_at)}</span>
                  </div>
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="project-topics">
                      {repo.topics.slice(0, 5).map((t, i) => (
                        <span key={i}>{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="project-card-actions">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-card-link project-access"
                    >
                      ACCESS PROJECT <span aria-hidden="true">→</span>
                    </a>
                    {repo.homepage && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-card-link"
                      >
                        Live
                      </a>
                    )}
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
};
