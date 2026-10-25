import React, { useState, useEffect } from 'react';

export interface FieldInfo {
  id: 'security' | 'ai' | 'philosophy' | 'making';
  name: string;
  subtitle: string;
  description: string;
  actionLabel: string;
  cx: number;
  cy: number;
  labelX: number;
  labelY: number;
  labelAnchor: 'start' | 'middle' | 'end';
  tag: string;
}

const FIELDS: FieldInfo[] = [
  {
    id: 'security',
    name: 'SECURITY',
    subtitle: 'Offensive Systems, Vulnerability Research & Reconnaissance',
    description: 'Understanding systems through their assumptions, boundaries, and failures.',
    actionLabel: 'EXPLORE SECURITY & RECON ↗',
    cx: 220,
    cy: 68,
    labelX: 220,
    labelY: 46,
    labelAnchor: 'middle',
    tag: 'SEC // 01',
  },
  {
    id: 'making',
    name: 'MAKING',
    subtitle: 'Hardware, Tool Crafting, Sandboxes & Systems',
    description: 'Building software, experimenting with electronics, and learning by doing.',
    actionLabel: 'EXPLORE SYSTEMS & TOOLING ↗',
    cx: 326,
    cy: 114,
    labelX: 342,
    labelY: 104,
    labelAnchor: 'start',
    tag: 'ENG // 02',
  },
  {
    id: 'ai',
    name: 'ARTIFICIAL INTELLIGENCE',
    subtitle: 'Machine Learning, Autonomous Agents & Cognition',
    description: 'Exploring how machines learn, reason, and interact with the world.',
    actionLabel: 'EXPLORE AI & AGENTS ↗',
    cx: 374,
    cy: 220,
    labelX: 390,
    labelY: 224,
    labelAnchor: 'start',
    tag: 'COG // 03',
  },
  {
    id: 'philosophy',
    name: 'PHILOSOPHY',
    subtitle: 'Epistemology, Ethics of Technology & Intellectual History',
    description: 'Questions about knowledge, understanding, technology, and human experience.',
    actionLabel: 'READ COMMONPLACE BOOK ↗',
    cx: 114,
    cy: 326,
    labelX: 102,
    labelY: 346,
    labelAnchor: 'end',
    tag: 'EPI // 04',
  },
];

interface InterestAtlasProps {
  onSelectField?: (fieldId: 'security' | 'ai' | 'philosophy' | 'making') => void;
}

export const InterestAtlas: React.FC<InterestAtlasProps> = ({ onSelectField }) => {
  // hovered or focused field
  const [activeFieldId, setActiveFieldId] = useState<'security' | 'ai' | 'philosophy' | 'making' | null>('security');

  const currentField = FIELDS.find((f) => f.id === activeFieldId) || FIELDS[0];

  const handleFieldActivate = (fieldId: 'security' | 'ai' | 'philosophy' | 'making') => {
    setActiveFieldId(fieldId);
    if (onSelectField) {
      onSelectField(fieldId);
    }
  };

  return (
    <div className="atlas-diagram-container" role="region" aria-label="Interactive Knowledge Navigator">
      {/* Visual Circular Knowledge Diagram */}
      <div className="diagram-svg-wrap">
        <svg
          viewBox="0 0 440 440"
          className="w-full h-full knowledge-svg"
          style={{ overflow: 'visible' }}
          role="img"
          aria-label="Circular Knowledge Map diagram of Security, Artificial Intelligence, Philosophy, and Making"
        >
          <desc>
            A circular knowledge map diagram showing the interconnected fields of Security, Making, Artificial Intelligence, and Philosophy with center monogram TG.
          </desc>

          {/* Guide Rings */}
          {/* Inner ring */}
          <circle
            cx="220"
            cy="220"
            r="60"
            fill="none"
            stroke="#8F9D93"
            strokeWidth="0.8"
            opacity="0.75"
          />

          {/* Intermediate dashed ring */}
          <circle
            cx="220"
            cy="220"
            r="105"
            fill="none"
            stroke="#8F9D93"
            strokeWidth="1"
            strokeDasharray="3 4"
            opacity="0.85"
          />

          {/* Middle ring */}
          <circle
            cx="220"
            cy="220"
            r="152"
            fill="none"
            stroke="#5D6C60"
            strokeWidth="1"
            opacity="0.8"
          />

          {/* Outer ring */}
          <circle
            cx="220"
            cy="220"
            r="185"
            fill="none"
            stroke="#5D6C60"
            strokeWidth="1.2"
          />

          {/* Radial Crosshair Axes */}
          <line
            x1="20"
            y1="220"
            x2="420"
            y2="220"
            stroke="#8F9D93"
            strokeWidth="0.8"
            opacity="0.7"
          />
          <line
            x1="220"
            y1="20"
            x2="220"
            y2="420"
            stroke="#8F9D93"
            strokeWidth="0.8"
            opacity="0.7"
          />
          <line
            x1="70"
            y1="70"
            x2="370"
            y2="370"
            stroke="#8F9D93"
            strokeWidth="0.8"
            opacity="0.65"
          />
          <line
            x1="70"
            y1="370"
            x2="370"
            y2="70"
            stroke="#8F9D93"
            strokeWidth="0.8"
            opacity="0.65"
          />

          {/* Base Radial Connection Lines */}
          {FIELDS.map((f) => {
            const isActive = activeFieldId === f.id;
            return (
              <line
                key={`line-${f.id}`}
                x1="220"
                y1="220"
                x2={f.cx}
                y2={f.cy}
                stroke={isActive ? '#B75C3E' : '#8F9D93'}
                strokeWidth={isActive ? '1.8' : '1'}
                strokeDasharray={isActive ? '3 3' : 'none'}
                opacity={activeFieldId && !isActive ? 0.35 : 1}
                style={{
                  transition: 'stroke 0.2s ease, stroke-width 0.2s ease, opacity 0.2s ease',
                }}
              />
            );
          })}

          {/* Active Field Connection Halo & Outer Radii */}
          {currentField && activeFieldId && (
            <g className="active-highlight-group">
              {/* Highlight halo around active node */}
              <circle
                cx={currentField.cx}
                cy={currentField.cy}
                r="14"
                fill="var(--color-terracotta)"
                fillOpacity="0.15"
                stroke="var(--color-terracotta)"
                strokeWidth="1.2"
                style={{
                  transition: 'all 0.2s ease-out',
                }}
              />
              <circle
                cx={currentField.cx}
                cy={currentField.cy}
                r="20"
                fill="none"
                stroke="var(--color-terracotta)"
                strokeWidth="0.6"
                strokeDasharray="2 3"
                opacity="0.6"
              />
            </g>
          )}

          {/* Center Hub: TG Disc */}
          <circle
            cx="220"
            cy="220"
            r="38"
            fill="var(--color-forest)"
            stroke="var(--color-border)"
            strokeWidth="1.5"
            tabIndex={0}
            role="button"
            aria-label="Center hub: Tobias Guta Curiosity Atlas. Click to view all fields."
            onClick={() => setActiveFieldId('security')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveFieldId('security');
              }
            }}
            style={{ cursor: 'pointer' }}
          />
          <text
            x="220"
            y="226"
            textAnchor="middle"
            fill="var(--color-bg)"
            fontFamily="JetBrains Mono, monospace"
            fontSize="18"
            fontWeight="600"
            letterSpacing="1px"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            TG
          </text>

          {/* Interactive Field Nodes */}
          {FIELDS.map((field) => {
            const isActive = activeFieldId === field.id;
            const isDimmed = activeFieldId !== null && !isActive;

            return (
              <g
                key={field.id}
                className={`atlas-field-node ${isActive ? 'is-active' : ''} ${isDimmed ? 'is-dimmed' : ''}`}
                style={{
                  cursor: 'pointer',
                  opacity: isDimmed ? 0.38 : 1,
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                  outline: 'none',
                }}
                onClick={() => handleFieldActivate(field.id)}
                onMouseEnter={() => setActiveFieldId(field.id)}
                onFocus={() => setActiveFieldId(field.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleFieldActivate(field.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={isActive}
                aria-label={`${field.name}: ${field.subtitle}. Click to explore.`}
              >
                {/* Node Target Area (invisible larger hit box for comfortable touch & mouse) */}
                <circle
                  cx={field.cx}
                  cy={field.cy}
                  r="24"
                  fill="transparent"
                />

                {/* Visible Node Disc */}
                <circle
                  cx={field.cx}
                  cy={field.cy}
                  r={isActive ? 7 : 5}
                  fill={isActive ? 'var(--color-terracotta)' : 'var(--color-terracotta-dark)'}
                  stroke="var(--color-bg)"
                  strokeWidth="1.5"
                  style={{
                    transition: 'r 0.18s ease, fill 0.18s ease',
                  }}
                />

                {/* Node Text Label */}
                <text
                  x={field.labelX}
                  y={field.labelY}
                  textAnchor={field.labelAnchor}
                  fill={isActive ? 'var(--color-terracotta)' : 'var(--color-ink)'}
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="12"
                  fontWeight={isActive ? '600' : '500'}
                  letterSpacing="0.08em"
                  style={{
                    transition: 'fill 0.18s ease',
                    userSelect: 'none',
                  }}
                >
                  {field.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="diagram-caption" aria-hidden="true">
        A SMALL MAP OF INTERCONNECTED INTERESTS — FIG. 01
      </div>

      {/* Accessible Mobile & Touch Selector Strip */}
      <div
        className="atlas-mobile-chips"
        role="tablist"
        aria-label="Select knowledge discipline"
      >
        {FIELDS.map((f) => (
          <button
            key={`btn-${f.id}`}
            type="button"
            className={`atlas-chip-btn ${activeFieldId === f.id ? 'active' : ''}`}
            onClick={() => handleFieldActivate(f.id)}
            onFocus={() => setActiveFieldId(f.id)}
            role="tab"
            aria-selected={activeFieldId === f.id}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Editorial Information Panel */}
      <div
        className="atlas-node-drawer"
        role="region"
        aria-live="polite"
        aria-label={`Selected Field: ${currentField.name}`}
      >
        <div className="drawer-header-meta">
          <span className="drawer-kicker">
            FOCUS // {currentField.name}
          </span>
          <span className="drawer-tag">
            {currentField.tag}
          </span>
        </div>

        <h3 className="drawer-title">
          {currentField.subtitle}
        </h3>

        <p className="drawer-description">
          "{currentField.description}"
        </p>

        <div className="drawer-actions">
          <button
            type="button"
            className="drawer-action-btn"
            onClick={() => handleFieldActivate(currentField.id)}
            aria-label={`${currentField.actionLabel} in Curiosity Atlas`}
          >
            {currentField.actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
