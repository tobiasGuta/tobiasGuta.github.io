import React, { useEffect, useState } from 'react';

interface GitStats {
  repos: number | string;
  stars: number | string;
  topLang: string;
}

export const GitHubStatsWidget: React.FC = () => {
  const [stats, setStats] = useState<GitStats>({
    repos: '...',
    stars: '...',
    topLang: '...',
  });

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const res = await fetch('https://api.github.com/users/tobiasGuta/repos?per_page=100');
        if (!res.ok) throw new Error('API Error');
        const repos = await res.json();

        let totalStars = 0;
        const langCounts: Record<string, number> = {};
        let originalRepos = 0;

        if (Array.isArray(repos)) {
          repos.forEach((repo: any) => {
            if (!repo.fork) {
              originalRepos++;
              totalStars += repo.stargazers_count || 0;
              if (repo.language) {
                langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
              }
            }
          });
        }

        let topLang = 'N/A';
        let maxCount = 0;
        for (const [lang, count] of Object.entries(langCounts)) {
          if (count > maxCount) {
            maxCount = count;
            topLang = lang;
          }
        }

        if (isMounted) {
          setStats({
            repos: originalRepos,
            stars: totalStars,
            topLang: topLang || 'Go',
          });
        }
      } catch {
        if (isMounted) {
          setStats({
            repos: 18,
            stars: 6,
            topLang: 'Go',
          });
        }
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="sidebar-box github-stats-box" style={{ marginTop: '16px' }}>
      <h3>[ GITHUB INTEL ]</h3>
      <table className="info-table" style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td>PUBLIC REPOS</td>
            <td id="git-repos-count">{stats.repos}</td>
          </tr>
          <tr>
            <td>TOTAL STARS</td>
            <td id="git-stars-count">{stats.stars}</td>
          </tr>
          <tr>
            <td>TOP LANGUAGE</td>
            <td id="git-top-lang">{stats.topLang}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
