import React from 'react';
import { PostItem } from '../data/postsData';

interface WriteupCardProps {
  post: PostItem;
  onNavigate: (path: string) => void;
}

export const WriteupCard: React.FC<WriteupCardProps> = ({ post, onNavigate }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onNavigate(post.url);
  };

  return (
    <article
      className={`writeup-card ${post.locked ? 'writeup-card-locked' : ''}`}
      data-writeup-card
    >
      {post.image ? (
        <a
          href={post.url}
          onClick={handleClick}
          className={`writeup-card-image-link ${post.locked ? 'writeup-card-image-locked' : ''}`}
        >
          <img className="writeup-card-image" src={post.image} alt={`${post.title} cover`} loading="lazy" />
          {post.locked && <span className="writeup-image-lock-badge">[ LOCKED ]</span>}
        </a>
      ) : post.locked ? (
        <div className="writeup-lock-plate" aria-hidden="true">
          <span className="writeup-lock-icon">[ LOCKED ]</span>
        </div>
      ) : null}

      <div className="writeup-card-body">
        {post.locked ? (
          <>
            <h3>
              <a href={post.url} onClick={handleClick}>
                {post.title}
              </a>
            </h3>
            <a
              className="writeup-read-link writeup-locked-link"
              href={post.url}
              onClick={handleClick}
            >
              Locked
            </a>
          </>
        ) : (
          <>
            <div className="writeup-card-date">{post.dateFormatted}</div>
            <h3>
              <a href={post.url} onClick={handleClick}>
                {post.title}
              </a>
            </h3>
            <p>{post.excerpt}</p>
            {post.categories && post.categories.length > 0 && (
              <div className="writeup-tags">
                {post.categories.slice(0, 4).map((category, idx) => (
                  <span key={idx}>{category}</span>
                ))}
              </div>
            )}
            <a
              className="writeup-read-link"
              href={post.url}
              onClick={handleClick}
            >
              Read Writeup
            </a>
          </>
        )}
      </div>
    </article>
  );
};
