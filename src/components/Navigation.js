import React from 'react';
import { Home, Search, User, LayoutDashboard } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Home', Icon: Home },
  { id: 'scan', label: 'Scan', Icon: Search },
  { id: 'profile', label: 'Profile', Icon: User },
];

export default function Navigation({ currentPage, onNavigate }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(8,8,15,0.92)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '10px 0 16px',
      zIndex: 1000,
    }}>
      {navItems.map(({ id, label, Icon }) => {
        const active = currentPage === id || (currentPage === 'results' && id === 'scan');
        return (
          <button key={id} onClick={() => onNavigate(id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            background: 'none', color: active ? 'var(--accent-bright)' : 'var(--text-muted)',
            fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 600,
            letterSpacing: '0.05em', padding: '6px 20px',
            transition: 'all 0.2s',
            borderRadius: 'var(--radius-sm)',
          }}>
            <div style={{
              padding: '6px',
              background: active ? 'var(--accent-dim)' : 'transparent',
              borderRadius: '10px',
              transition: 'all 0.2s',
            }}>
              <Icon size={20} />
            </div>
            {label}
          </button>
        );
      })}
    </nav>
  );
}
