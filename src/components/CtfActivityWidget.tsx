import React from 'react';
import { ctfData } from '../data/ctfData';

export const CtfActivityWidget: React.FC = () => {
  return (
    <div className="sidebar-box activity-box" id="ctf-activity-feed" style={{ marginTop: '16px' }}>
      <h3>[ ACTIVITY ]</h3>
      <div className="activity-list" style={{ maxHeight: '360px', overflowY: 'auto' }}>
        {ctfData.slice(0, 8).map((item, index) => {
          const meta = [item.platform, item.category, item.date].filter(Boolean).join(' • ');
          return (
            <div key={index} className="activity-item" style={{ marginBottom: '10px' }}>
              <div className="action" style={{ color: '#FFFF00', fontSize: '12px' }}>
                ✓ {item.challenge}
              </div>
              <div className="time" style={{ color: '#00FFFF', fontSize: '11px', marginTop: '2px' }}>
                {meta}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
