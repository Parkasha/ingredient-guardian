import React from 'react';
import { Shield, TrendingUp, Clock, Scan, ChevronRight, AlertCircle } from 'lucide-react';

export default function DashboardPage({ history, onNavigate }) {
  const avgScore = history.length > 0
    ? Math.round(history.reduce((s, r) => s + (r.overallScore || 0), 0) / history.length)
    : null;

  const totalRisky = history.reduce((acc, r) => {
    const risky = (r.ingredients || []).filter(i => ['harmful', 'carcinogen'].includes(i.status));
    return acc + risky.length;
  }, 0);

  const getScoreColor = (score) =>
    score >= 80 ? 'var(--safe)' : score >= 60 ? 'var(--caution)' : score >= 40 ? 'var(--warning)' : 'var(--danger)';

  const formatTime = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = (now - d) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, var(--accent), var(--safe))',
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={16} color="white" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '24px', letterSpacing: '-0.02em' }}>
            Ingredient Guardian
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Your ingredient safety dashboard</p>
      </div>

      {/* Stats grid */}
      {history.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
          {[
            { label: 'Avg Score', value: avgScore || '—', color: avgScore ? getScoreColor(avgScore) : 'var(--text-muted)', icon: TrendingUp },
            { label: 'Scans', value: history.length, color: 'var(--accent-bright)', icon: Scan },
            { label: 'Risky Found', value: totalRisky, color: totalRisky > 0 ? 'var(--danger)' : 'var(--safe)', icon: AlertCircle },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '14px 10px', textAlign: 'center',
            }}>
              <Icon size={16} color={color} style={{ margin: '0 auto 6px' }} />
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color }}>{value}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick scan CTA */}
      <button onClick={() => onNavigate('scan')} style={{
        width: '100%', padding: '18px',
        background: 'linear-gradient(135deg, var(--accent) 0%, #4f46e5 100%)',
        color: 'white', borderRadius: 'var(--radius-lg)',
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        boxShadow: '0 8px 32px rgba(99,102,241,0.35)', marginBottom: '24px',
        transition: 'transform 0.15s',
      }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
        onMouseOut={e => e.currentTarget.style.transform = ''}
      >
        <Scan size={20} />
        Scan a New Product
        <ChevronRight size={18} />
      </button>

      {/* Recent scans */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px' }}>Recent Scans</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{history.length} total</span>
        </div>

        {history.length === 0 ? (
          <div style={{
            padding: '40px 24px', textAlign: 'center',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
          }}>
            <div style={{
              width: '64px', height: '64px', margin: '0 auto 16px',
              background: 'var(--accent-dim)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Scan size={28} color="var(--accent-bright)" />
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '8px' }}>No scans yet</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
              Scan your first product to see its ingredient safety report
            </p>
            <button onClick={() => onNavigate('scan')} style={{
              padding: '12px 24px', background: 'var(--accent)',
              color: 'white', borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px',
            }}>Start Scanning</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history.slice(0, 10).map((scan, i) => {
              const sc = scan.overallScore;
              const color = getScoreColor(sc);
              return (
                <div key={i} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: '14px',
                  animation: 'fadeUp 0.3s ease forwards',
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                    background: `conic-gradient(${color} 0% ${sc}%, var(--bg-secondary) ${sc}% 100%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                  }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%', background: 'var(--bg-card)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12px', color }}>{sc}</span>
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {scan.productName || 'Unknown Product'}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '3px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color, fontWeight: 600 }}>{scan.scoreLabel}</span>
                      <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{scan.productType}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <Clock size={12} color="var(--text-muted)" style={{ display: 'block', marginLeft: 'auto', marginBottom: '2px' }} />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{scan.scannedAt ? formatTime(scan.scannedAt) : '—'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  function formatTime(iso) {
    const d = new Date(iso);
    const now = new Date();
    const diff = (now - d) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  }
}
