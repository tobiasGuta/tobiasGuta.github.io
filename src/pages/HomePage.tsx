import React from 'react';
import { siteData } from '../data/siteData';
import { postsData } from '../data/postsData';
import { GitHubStatsWidget } from '../components/GitHubStatsWidget';
import { RotatingQuote } from '../components/RotatingQuote';
import { CtfActivityWidget } from '../components/CtfActivityWidget';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const profile = siteData.profile;
  const skills = siteData.skills;
  const homepage = siteData.homepage;
  const certificates = siteData.certificates;
  const latestPosts = postsData.slice(0, 3);

  return (
    <div className="page-body">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar-left">
        {/* Profile Card */}
        <div className="sidebar-box cyan-border">
          <h3>[ IDENTIFY ]</h3>
          <div className="profile-pic-wrap">
            <div className="profile-pic">
              <img
                className="profile-photo"
                src={`/${profile.photo || 'Pictures/profile.png'}`}
                alt={profile.photo_alt || 'Profile photo'}
              />
            </div>
            <div className="profile-name">
              {profile.display_name}
              <br />
              <span className="profile-role">{profile.role}</span>
            </div>
            <div className="status-text">
              <span className="online-indicator"></span>
              {profile.status_text}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="sidebar-box">
          <h3>[ SKILLZ ]</h3>
          <div className="skill-section-label">[ TECH STACK ]</div>
          <div className="skill-icon-groups" aria-label="Technical skills">
            {skills.tech_stack?.map((group: any, idx: number) => (
              <div className="skill-icon-group" key={idx}>
                <div className="skill-icon-heading">{group.group_name}</div>
                <img
                  src={`https://skillicons.dev/icons?${group.icons_query}`}
                  alt={group.alt_text}
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div className="skill-section-label skill-focus-label">[ FOCUS ]</div>
          {skills.focus_bars?.map((focus: any, idx: number) => (
            <div className="skill-item" key={idx}>
              <div className="skill-name">{focus.name}</div>
              <div className="skill-bar-bg">
                <div
                  className="skill-bar-fill"
                  style={{
                    width: `${focus.percentage}%`,
                    animationPlayState: 'running',
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Links in Sidebar */}
        <div className="sidebar-box">
          <h3>[ COMMS LINK ]</h3>
          <div className="sidebar-socials" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {siteData.social_links?.map((s: any, idx: number) => (
              <a
                key={idx}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#00FFFF',
                  textDecoration: 'none',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{s.icon || '🔗'}</span>
                <span>[{s.label || s.handle}]</span>
              </a>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* Welcome */}
        <div className="welcome-box">
          <h2>// WELCOME.TXT</h2>
          <div
            dangerouslySetInnerHTML={{
              __html:
                homepage.welcome_text ||
                'Welcome to my cybersecurity portfolio.',
            }}
          />
        </div>

        {/* Latest Activity */}
        <div className="section-block latest-activity-block">
          <div className="section-header">
            <span>▣</span>
            <h2>LATEST ACTIVITY</h2>
          </div>
          <div className="section-content">
            <div className="latest-activity-grid">
              {latestPosts.map((post) => (
                <a
                  key={post.slug}
                  className="latest-activity-item"
                  href={post.url}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(post.url);
                  }}
                >
                  <span className="latest-activity-type">WRITEUP</span>
                  <strong>{post.title}</strong>
                  <span>{post.dateFormatted}</span>
                </a>
              ))}
              <a
                className="latest-activity-item project-activity"
                href="https://github.com/tobiasGuta/DirFuzz-Mcp-Monitor"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="latest-activity-type">PROJECT</span>
                <strong>DirFuzz-Mcp-Monitor</strong>
                <span>Web security testing engine</span>
              </a>
              <a
                className="latest-activity-item project-activity"
                href="https://github.com/tobiasGuta/sub-enum"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="latest-activity-type">PROJECT</span>
                <strong>sub-enum</strong>
                <span>Subdomain recon toolkit</span>
              </a>
            </div>
          </div>
        </div>

        {/* About Me */}
        <div className="section-block">
          <div className="section-header">
            <span>💀</span>
            <h2>ABOUT.EXE — WHO IS {profile.handle} ?</h2>
          </div>
          <div className="section-content">
            <table className="info-table">
              <tbody>
                <tr>
                  <td>HANDLE</td>
                  <td>{profile.handle}</td>
                </tr>
                <tr>
                  <td>LOCATION</td>
                  <td>{profile.location}</td>
                </tr>
                <tr>
                  <td>STATUS</td>
                  <td>{profile.status}</td>
                </tr>
                <tr>
                  <td>OS OF CHOICE</td>
                  <td>{profile.os_of_choice}</td>
                </tr>
                <tr>
                  <td>CURRENT MISSION</td>
                  <td>{profile.current_mission}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Certifications / Awards */}
        <div className="section-block">
          <div className="section-header">
            <span>🏆</span>
            <h2>CERTIFICATES &amp; AWARDS</h2>
          </div>
          <div className="section-content">
            <div className="cert-list">
              {certificates?.map((cert: any, idx: number) => (
                <div className="cert-card" key={idx}>
                  <div className="cert-title">{cert.title}</div>
                  {cert.note && <div className="cert-note">{cert.note}</div>}
                  {cert.issuer && <div className="cert-issuer">{cert.issuer}</div>}
                  {cert.date && <div className="cert-date">Issued: {cert.date}</div>}
                  {cert.link && (
                    <a
                      className="cert-action"
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {cert.link_label || 'View Certificate'}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Projects teaser */}
        <div className="section-block projects-block">
          <div className="section-header projects-header">
            <span>⚡</span>
            <h2 className="projects-title">LATEST PROJECTS</h2>
          </div>
          <div className="section-content">
            <table className="info-table">
              <tbody>
                <tr>
                  <td>
                    <a
                      className="project-link"
                      href="https://github.com/tobiasGuta/DirFuzz-Mcp-Monitor"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      DirFuzz-Mcp-Monitor
                    </a>
                  </td>
                  <td>
                    Memory-efficient, high-performance web security testing and directory
                    fuzzing engine for fast local scans, manual follow-up, raw request/response
                    inspection, authorized distributed execution, and automated monitoring.
                  </td>
                </tr>
                <tr>
                  <td>
                    <a
                      className="project-link"
                      href="https://github.com/tobiasGuta/sub-enum"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      sub-enum
                    </a>
                  </td>
                  <td>
                    Professional-grade automated subdomain enumeration and reconnaissance tool
                    for bug bounty hunters and penetration testers, with a modern CLI for
                    discovery, resolution, permutation, and verification.
                  </td>
                </tr>
                <tr>
                  <td>
                    <a
                      className="project-link"
                      href="https://github.com/tobiasGuta/SMB-Samba-Compliance-Audit-Tool"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      SMB Audit Tool
                    </a>
                  </td>
                  <td>
                    Command-line SMB/Samba compliance and audit tool built on impacket for share
                    enumeration, permission testing, password policies, users/groups, active
                    sessions, sensitive-file spidering, vulnerability heuristics, and remote file
                    viewing.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR / INTEL */}
      <aside className="sidebar-right" style={{ width: '280px', flexShrink: 0 }}>
        <GitHubStatsWidget />
        <CtfActivityWidget />
        <RotatingQuote />
      </aside>
    </div>
  );
};
