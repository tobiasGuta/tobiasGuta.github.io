import React, { useState } from 'react';

interface Project {
  name: string;
  category: 'security' | 'ai' | 'tools';
  status: 'Work in Progress' | 'Public Tool' | 'Experimental Tool';
  statusDetail: string;
  language: string;
  description: string;
  githubUrl?: string;
}

const FEATURED_PROJECTS: Project[] = [
  {
    name: 'Reconductor',
    category: 'security',
    status: 'Work in Progress',
    statusDetail: 'Work in Progress // Active R&D',
    language: 'Go / TypeScript',
    description:
      'Autonomous reconnaissance & attack surface intelligence orchestrator. Coordinates multi-stage subdomain discovery, recursive DNS permutation, active fingerprinting, and real-time diff detection for security research.',
  },
  {
    name: 'DirFuzz-Mcp-Monitor',
    category: 'security',
    status: 'Public Tool',
    statusDetail: 'Public Release // Open Source',
    language: 'Go',
    description:
      'Memory-efficient, high-performance web security testing and directory fuzzing engine for fast local scans, manual follow-up, raw request/response inspection, and automated monitoring.',
    githubUrl: 'https://github.com/tobiasGuta/DirFuzz-Mcp-Monitor',
  },
  {
    name: 'sub-enum',
    category: 'security',
    status: 'Public Tool',
    statusDetail: 'Public Release // Open Source',
    language: 'Go',
    description:
      'Professional-grade automated subdomain enumeration and reconnaissance tool for bug bounty hunters and penetration testers, with a modern CLI for discovery, resolution, permutation, and verification.',
    githubUrl: 'https://github.com/tobiasGuta/sub-enum',
  },
  {
    name: 'SMB-Samba-Compliance-Audit-Tool',
    category: 'security',
    status: 'Public Tool',
    statusDetail: 'Public Release // Open Source',
    language: 'Python',
    description:
      'Command-line SMB/Samba compliance and audit tool built on impacket for share enumeration, permission testing, password policies, active sessions, sensitive-file spidering, and vulnerability heuristics.',
    githubUrl: 'https://github.com/tobiasGuta/SMB-Samba-Compliance-Audit-Tool',
  },
  {
    name: 'AI-Security-Lab-Runner',
    category: 'ai',
    status: 'Public Tool',
    statusDetail: 'Public Release // Open Source',
    language: 'Go',
    description:
      'Defensive-development local execution system in Go. Enables AI coding assistants, security-analysis agents, and automation scripts to safely execute commands inside disposable, restricted Docker environments.',
    githubUrl: 'https://github.com/tobiasGuta/AI-Security-Lab-Runner',
  },
  {
    name: 'ParamIntel',
    category: 'security',
    status: 'Public Tool',
    statusDetail: 'Public Release // Open Source',
    language: 'Go',
    description:
      'High-confidence HTTP parameter discovery and behavioral analysis for security research and bug bounty testing.',
    githubUrl: 'https://github.com/tobiasGuta/ParamIntel',
  },
  {
    name: 'ScopeNest',
    category: 'tools',
    status: 'Public Tool',
    statusDetail: 'Public Release // Open Source',
    language: 'Go',
    description:
      'Isolated browser contexts and process sandbox for security research, manual exploratory testing, and web exploit validation.',
    githubUrl: 'https://github.com/tobiasGuta/ScopeNest',
  },
  {
    name: 'GQLens',
    category: 'security',
    status: 'Public Tool',
    statusDetail: 'Public Release // Open Source',
    language: 'Kotlin',
    description:
      'GraphQL Attack Surface Explorer extension for Burp Suite Community, parsing introspection schemas to highlight unauthorized query nodes and access-control anomalies.',
    githubUrl: 'https://github.com/tobiasGuta/GQLens',
  },
  {
    name: 'cfunveil',
    category: 'security',
    status: 'Public Tool',
    statusDetail: 'Public Release // Open Source',
    language: 'Python',
    description:
      'CloudFlare Origin IP Discovery Tool for Bug Bounty Hunters. Chains several intelligence modules to uncover origin IPs hidden behind reverse proxies.',
    githubUrl: 'https://github.com/tobiasGuta/cfunveil',
  },
  {
    name: 'Docktop',
    category: 'tools',
    status: 'Experimental Tool',
    statusDetail: 'Experimental // CLI',
    language: 'Go',
    description:
      'A lightweight, btop-inspired terminal UI for managing Docker containers, images, networks, volumes, and MCP servers on Linux.',
    githubUrl: 'https://github.com/tobiasGuta/Docktop',
  },
  {
    name: 'firmware-researcher',
    category: 'tools',
    status: 'Experimental Tool',
    statusDetail: 'Experimental // Research',
    language: 'Go',
    description:
      'AI-assisted firmware vulnerability research tooling with evidence-driven static analysis and human oversight.',
    githubUrl: 'https://github.com/tobiasGuta/firmware-researcher',
  },
  {
    name: 'PrecisionPDF-MCP',
    category: 'ai',
    status: 'Public Tool',
    statusDetail: 'Public Release // Open Source',
    language: 'JavaScript',
    description:
      'Local PDF toolkit combining a PrecisionPDF Model Context Protocol (MCP) server for reviewable annotations with exact document search and Copilot explanations.',
    githubUrl: 'https://github.com/tobiasGuta/PrecisionPDF-MCP',
  },
];

interface WorkSectionProps {
  categoryFilter?: 'all' | 'security' | 'ai' | 'tools';
  onSelectCategory?: (cat: 'all' | 'security' | 'ai' | 'tools') => void;
}

export const WorkSection: React.FC<WorkSectionProps> = ({
  categoryFilter,
  onSelectCategory,
}) => {
  const [internalFilter, setInternalFilter] = useState<'all' | 'security' | 'ai' | 'tools'>('all');

  const filter = categoryFilter !== undefined ? categoryFilter : internalFilter;

  const handleFilterChange = (cat: 'all' | 'security' | 'ai' | 'tools') => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else {
      setInternalFilter(cat);
    }
  };

  const filtered = FEATURED_PROJECTS.filter(
    (p) => filter === 'all' || p.category === filter
  );

  return (
    <section id="work" className="atlas-section" aria-label="The Work">
      <div className="section-head">
        <div className="section-kicker">02 // THE WORK</div>
        <h2 className="section-title">The Engineering Workshop</h2>
        <p className="section-subtitle">
          An intentional collection of security tools, autonomous execution systems, protocol auditors, and experiments.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-bar" role="tablist" aria-label="Filter Projects">
        <button
          type="button"
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
          role="tab"
          aria-selected={filter === 'all'}
        >
          ALL PURSUITS ({FEATURED_PROJECTS.length})
        </button>
        <button
          type="button"
          className={`filter-btn ${filter === 'security' ? 'active' : ''}`}
          onClick={() => handleFilterChange('security')}
          role="tab"
          aria-selected={filter === 'security'}
        >
          SECURITY &amp; RECON ({FEATURED_PROJECTS.filter((p) => p.category === 'security').length})
        </button>
        <button
          type="button"
          className={`filter-btn ${filter === 'ai' ? 'active' : ''}`}
          onClick={() => handleFilterChange('ai')}
          role="tab"
          aria-selected={filter === 'ai'}
        >
          AI &amp; AGENTS ({FEATURED_PROJECTS.filter((p) => p.category === 'ai').length})
        </button>
        <button
          type="button"
          className={`filter-btn ${filter === 'tools' ? 'active' : ''}`}
          onClick={() => handleFilterChange('tools')}
          role="tab"
          aria-selected={filter === 'tools'}
        >
          SYSTEMS &amp; TOOLING ({FEATURED_PROJECTS.filter((p) => p.category === 'tools').length})
        </button>
      </div>

      {/* Curated Work Table / List */}
      <div className="curated-work-list">
        {filtered.length === 0 ? (
          <div
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              border: '1px dashed var(--color-border)',
              margin: '1.5rem 0',
              backgroundColor: 'var(--color-bg-subtle)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-ink-muted)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              [ EMPTY ARCHIVE ]
            </div>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.95rem',
                color: 'var(--color-ink-secondary)',
                maxWidth: '480px',
                margin: '0 auto',
              }}
            >
              No projects are currently cataloged under this specific classification.
            </p>
          </div>
        ) : (
          filtered.map((proj, idx) => (
          <div key={idx} className="work-row">
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: proj.status === 'Work in Progress' ? 'var(--color-terracotta)' : 'var(--color-ink-muted)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem',
                }}
              >
                {proj.statusDetail}
              </div>

              <h3 className="work-title">
                {proj.githubUrl ? (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {proj.name}
                  </a>
                ) : (
                  <span>{proj.name}</span>
                )}
                {proj.githubUrl && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)' }}>↗</span>
                )}
              </h3>
            </div>

            <div className="work-desc">{proj.description}</div>

            <div className="work-meta">
              <div>{proj.language}</div>
              {proj.githubUrl ? (
                <a
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--color-terracotta)',
                    textDecoration: 'none',
                    fontSize: '0.72rem',
                    display: 'inline-block',
                    marginTop: '0.35rem',
                    borderBottom: '1px solid var(--color-terracotta)',
                  }}
                >
                  VIEW REPOSITORY
                </a>
              ) : (
                <span
                  style={{
                    color: 'var(--color-ink-muted)',
                    fontSize: '0.72rem',
                    display: 'inline-block',
                    marginTop: '0.35rem',
                  }}
                >
                  ACTIVE R&amp;D
                </span>
              )}
            </div>
          </div>
        ))
        )}
      </div>
    </section>
  );
};
