import React, { useEffect, useState } from 'react';
import { Shield, Zap, Heart, ChevronRight, Scan, Star } from 'lucide-react';

export default function LandingPage({ onStart }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-primary)', overflow: 'hidden', position: 'relative',
    }}>
      {/* Background blobs */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        animation: 'blob 8s infinite ease-in-out',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '100px', left: '-150px',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
        animation: 'blob 10s infinite ease-in-out 2s',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <header style={{ padding: '24px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, var(--accent), var(--safe))',
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px' }}>
            Ingredient Guardian
          </span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          background: 'rgba(34,197,94,0.1)', padding: '4px 10px',
          borderRadius: '20px', border: '1px solid rgba(34,197,94,0.2)',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--safe)' }} />
          <span style={{ fontSize: '11px', color: 'var(--safe)', fontWeight: 600 }}>AI Powered</span>
        </div>
      </header>

      {/* Hero */}
      <main style={{ flex: 1, padding: '40px 24px 32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Badge */}
        <div style={{
          opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.6s ease',
          display: 'inline-flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-start',
          background: 'var(--accent-dim)', border: '1px solid rgba(99,102,241,0.3)',
          padding: '6px 12px', borderRadius: '20px',
        }}>
          <Star size={12} color="var(--accent-bright)" fill="var(--accent-bright)" />
          <span style={{ fontSize: '12px', color: 'var(--accent-bright)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            Know What You Consume
          </span>
        </div>

        {/* Headline */}
        <div style={{
          opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease 0.1s',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(36px, 10vw, 52px)', lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}>
            Scan. Analyze.<br />
            <span style={{
              background: 'linear-gradient(135deg, var(--accent-bright) 0%, var(--safe) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Stay Safe.</span>
          </h1>
          <p style={{
            marginTop: '16px', color: 'var(--text-secondary)',
            fontSize: '16px', lineHeight: 1.6, maxWidth: '380px',
          }}>
            AI-powered ingredient analysis for food, cosmetics, medicines & more. Get instant safety scores.
          </p>
        </div>

        {/* Feature pills */}
        <div style={{
          opacity: mounted ? 1 : 0, transition: 'all 0.6s ease 0.2s',
          display: 'flex', flexWrap: 'wrap', gap: '8px',
        }}>
          {['🍎 Food', '💄 Cosmetics', '💊 Medicine', '🧴 Skincare', '👶 Baby Products'].map(tag => (
            <span key={tag} style={{
              padding: '6px 12px', background: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: '20px',
              fontSize: '13px', color: 'var(--text-secondary)',
            }}>{tag}</span>
          ))}
        </div>

        {/* Score preview card */}
        <div style={{
          opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s ease 0.3s',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', padding: '20px', position: 'relative', overflow: 'hidden',
        }}>
          {/* Glow accent */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: '120px', height: '120px',
            background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)',
          }} />
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Example Analysis</p>
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'conic-gradient(var(--safe) 0% 78%, var(--bg-secondary) 78% 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--safe)' }}>78</span>
              </div>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px' }}>Greek Yogurt</p>
              <p style={{ color: 'var(--safe)', fontSize: '13px', fontWeight: 500 }}>Good — Low Risk</p>
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <span style={{ padding: '2px 8px', background: 'var(--safe-dim)', color: 'var(--safe)', fontSize: '11px', borderRadius: '20px' }}>🟢 5 Safe</span>
                <span style={{ padding: '2px 8px', background: 'var(--caution-dim)', color: 'var(--caution)', fontSize: '11px', borderRadius: '20px' }}>🟡 1 Caution</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          opacity: mounted ? 1 : 0, transition: 'all 0.6s ease 0.4s',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px',
        }}>
          {[['10K+', 'Ingredients', Shield], ['9', 'Product Types', Scan], ['<3s', 'Analysis', Zap]].map(([val, label, Icon]) => (
            <div key={label} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '14px 10px', textAlign: 'center',
            }}>
              <Icon size={16} color="var(--accent-bright)" style={{ margin: '0 auto 6px' }} />
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px' }}>{val}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{label}</p>
            </div>
          ))}
        </div>
      </main>

      {/* CTA */}
      <div style={{
        padding: '0 24px 40px',
        opacity: mounted ? 1 : 0, transition: 'all 0.6s ease 0.5s',
      }}>
        <button onClick={onStart} style={{
          width: '100%', padding: '18px',
          background: 'linear-gradient(135deg, var(--accent) 0%, #4f46e5 100%)',
          color: 'white', borderRadius: 'var(--radius-lg)',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.5)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.4)'; }}
        >
          <Scan size={20} />
          Start Analyzing Ingredients
          <ChevronRight size={18} />
        </button>
        <p style={{ textAlign: 'center', marginTop: '12px', color: 'var(--text-muted)', fontSize: '12px' }}>
          Free • No signup required • AI-powered
        </p>
      </div>
    </div>
  );
}
