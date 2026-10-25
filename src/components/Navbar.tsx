import React from 'react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const isCurrent = (path: string) => {
    if (path === '/' && (currentPath === '/' || currentPath === '/index.html')) return true;
    if (path === '/projects' && (currentPath === '/projects' || currentPath === '/projects.html')) return true;
    if (path === '/writeups' && (currentPath === '/writeups' || currentPath === '/writeups.html' || currentPath.startsWith('/blog/') || currentPath.startsWith('/posts/'))) return true;
    if (path === '/contact' && (currentPath === '/contact' || currentPath === '/contact.html')) return true;
    return false;
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <a
        href="/"
        aria-current={isCurrent('/') ? 'page' : undefined}
        onClick={(e) => handleClick(e, '/')}
      >
        [ HOME ]
      </a>
      <a
        href="/projects"
        aria-current={isCurrent('/projects') ? 'page' : undefined}
        onClick={(e) => handleClick(e, '/projects')}
      >
        [ PROJECTS ]
      </a>
      <a
        href="/writeups"
        aria-current={isCurrent('/writeups') ? 'page' : undefined}
        onClick={(e) => handleClick(e, '/writeups')}
      >
        [ WRITEUPS ]
      </a>
      <a
        href="/contact"
        aria-current={isCurrent('/contact') ? 'page' : undefined}
        onClick={(e) => handleClick(e, '/contact')}
      >
        [ CONTACT ]
      </a>
    </nav>
  );
};
