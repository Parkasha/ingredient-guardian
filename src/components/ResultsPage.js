import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, XCircle, ScanLine, Share2 } from 'lucide-react';

const STATUS_CONFIG = {
  safe:       { emoji: '🟢', label: 'Safe',              color: 'var(--safe)',      bg: 'var(--safe-dim)' },
  caution:    { emoji: '🟡', label: 'Use With Caution',  color: 'var(--caution)',   bg: 'var(--caution-dim)' },
  allergen:   { emoji: '🟠', label: 'Potential Allergen',color: 'var(--warning)',   bg: 'var(--warning-dim)' },
  harmful:    { emoji: '🔴', label: 'Harmful',           color: 'var(--danger)',    bg: 'var(--danger-dim)' },
  carcinogen: { emoji: '⚫', label: 'Potential Carcinogen',color: 'var(--carcinogen)',bg: 'var(--carcinogen-dim)' },
};

const AGE_COLOR = { Safe: 'var(--safe)', Caution: 'var(--caution)', Avoid: 'var(--danger)' };

function ScoreRing({ score, label }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? 'var(--safe)' : score >= 60 ? 'var(--caution)' : score >= 40 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ position: 'relative', width: '130px', height: '130px' }}>
        <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="65" cy="65" r={r} fill="none" stroke="var(--bg-secondary)" strokeWidth="10" />
          <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '32px', color }}>{score}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ 100</span>
        </div>
      </div>
      <div style={{
        padding: '5px 16px', background: color + '22', border: `1px solid ${color}44`,
        borderRadius: '20px',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color }}>{label}</span>
      </div>
    </div>
  );
}

function IngredientCard({ ingredient, userProfile }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[ingredient.status] || STATUS_CONFIG.safe;

  const tagColors = {
    'Allergen': 'var(--warning)', 'Carcinogenic': 'var(--carcinogen)',
    'Hormone Disruptor': '#ec4899', 'Neurotoxin': '#f97316',
    'Irritant': 'var(--caution)', 'Environmental Hazard': '#10b981',
    'Pregnancy Warning': '#f43f5e', 'Child Safety Concern': '#8b5cf6',
  };

  return (
    <div style={{
      background: 'var(--bg-card)', border: `1px solid ${expanded ? cfg.color + '44' : 'var(--border)'}`,
      borderRadius: 'var(--radius-md)', overflow: 'hidden', transition: 'border-color 0.2s',
    }}>
      <button onClick={() => setExpanded(!expanded)} style={{
        width: '100%', padding: '14px 16px', background: 'none',
        display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          fontSize: '18px',
        }}>{cfg.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {ingredient.name}
          </p>
          <div style={{ display: 'flex', gap: '6px', marginTop: '3px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
            {ingredient.userRisk && ingredient.userRisk !== 'none' && (
              <span style={{
                fontSize: '11px', padding: '1px 7px',
                background: ingredient.userRisk === 'high' ? 'var(--danger-dim)' : 'var(--caution-dim)',
                color: ingredient.userRisk === 'high' ? 'var(--danger)' : 'var(--caution)',
                borderRadius: '20px', fontWeight: 600,
              }}>⚠ Your Risk</span>
            )}
          </div>
        </div>
        <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {expanded && (
        <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${cfg.color}22` }}>
          {ingredient.purpose && (
            <div style={{ padding: '10px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '3px' }}>PURPOSE</p>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{ingredient.purpose}</p>
            </div>
          )}

          {ingredient.tags?.length > 0 && (
            <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {ingredient.tags.map(tag => (
                <span key={tag} style={{
                  padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                  background: (tagColors[tag] || 'var(--accent)') + '22',
                  color: tagColors[tag] || 'var(--accent)',
                  border: `1px solid ${(tagColors[tag] || 'var(--accent)') + '44'}`,
                }}>{tag}</span>
              ))}
            </div>
          )}

          {ingredient.concerns?.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>CONCERNS</p>
              {ingredient.concerns.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                  <AlertTriangle size={13} color="var(--caution)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{c}</p>
                </div>
              ))}
            </div>
          )}

          {ingredient.ageSuitability && (
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px' }}>AGE SUITABILITY</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                {Object.entries(ingredient.ageSuitability).map(([group, rating]) => (
                  <div key={group} style={{
                    padding: '6px 10px', background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{group}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: AGE_COLOR[rating] || 'var(--text-secondary)' }}>{rating}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResultsPage({ result, onScanAgain, userProfile }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!result) return (
    <div style={{ padding: '40px 24px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-secondary)' }}>No analysis yet. Scan a product first!</p>
      <button onClick={onScanAgain} style={{
        marginTop: '16px', padding: '12px 24px',
        background: 'var(--accent)', color: 'white', borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-display)', fontWeight: 700,
      }}>Scan Product</button>
    </div>
  );

  const { productName, productType, overallScore, scoreLabel, summary, alerts = [], ingredients = [], counts = {}, ageSummary } = result;

  const tabs = ['overview', 'ingredients', 'age groups'];

  const filteredIngredients = {
    all: ingredients,
    risky: ingredients.filter(i => ['harmful', 'carcinogen', 'allergen'].includes(i.status)),
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto' }}>
      {/* Hero score card */}
      <div style={{
        margin: '20px 16px 0',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(99,102,241,0.08) 100%)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)',
        padding: '24px 20px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)' }} />
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <ScoreRing score={overallScore} label={scoreLabel} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{productType}</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', marginTop: '2px', lineHeight: 1.2 }}>{productName || 'Product Analysis'}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '8px', lineHeight: 1.5 }}>{summary}</p>
          </div>
        </div>

        {/* Counts */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            ['🟢', counts.safe || 0, 'Safe', 'var(--safe)'],
            ['🟡', counts.caution || 0, 'Caution', 'var(--caution)'],
            ['🟠', counts.allergen || 0, 'Allergen', 'var(--warning)'],
            ['🔴', counts.harmful || 0, 'Harmful', 'var(--danger)'],
            ['⚫', counts.carcinogen || 0, 'Carc.', 'var(--carcinogen)'],
          ].map(([e, n, l, c]) => (
            <div key={l} style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '4px 10px', background: c + '15', borderRadius: '20px',
              border: `1px solid ${c}33`,
            }}>
              <span style={{ fontSize: '12px' }}>{e}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: c }}>{n}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={{ margin: '12px 16px 0' }}>
          {alerts.map((alert, i) => (
            <div key={i} style={{
              padding: '10px 14px', marginBottom: '8px',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 'var(--radius-md)', display: 'flex', gap: '10px', alignItems: 'center',
            }}>
              <span style={{ fontSize: '16px' }}>🚨</span>
              <p style={{ fontSize: '13px', color: 'var(--danger)', fontWeight: 500 }}>{alert}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{
          display: 'flex', background: 'var(--bg-card)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '4px',
        }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: '9px 4px',
              background: activeTab === tab ? 'var(--accent)' : 'transparent',
              color: activeTab === tab ? 'white' : 'var(--text-muted)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '12px',
              textTransform: 'capitalize', transition: 'all 0.2s',
            }}>{tab}</button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ padding: '16px' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px' }}>Risky Ingredients</h3>
            {filteredIngredients.risky.length === 0 ? (
              <div style={{
                padding: '24px', textAlign: 'center',
                background: 'var(--safe-dim)', border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: 'var(--radius-md)',
              }}>
                <CheckCircle size={32} color="var(--safe)" style={{ margin: '0 auto 8px' }} />
                <p style={{ color: 'var(--safe)', fontWeight: 600 }}>No high-risk ingredients found!</p>
              </div>
            ) : (
              filteredIngredients.risky.map((ing, i) => <IngredientCard key={i} ingredient={ing} userProfile={userProfile} />)
            )}
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '4px' }}>
              {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} analyzed
            </p>
            {ingredients.map((ing, i) => <IngredientCard key={i} ingredient={ing} userProfile={userProfile} />)}
          </div>
        )}

        {activeTab === 'age groups' && ageSummary && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(ageSummary).map(([group, text]) => (
              <div key={group} style={{
                padding: '14px', background: 'var(--bg-card)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', textTransform: 'capitalize', marginBottom: '6px' }}>
                  {group === 'infants' ? '👶 Infants (0–2)' :
                   group === 'children' ? '🧒 Children (3–12)' :
                   group === 'adults' ? '🧑 Adults' : '👴 Seniors (65+)'}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ padding: '0 16px 24px', display: 'flex', gap: '10px' }}>
        <button onClick={onScanAgain} style={{
          flex: 1, padding: '14px',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          color: 'var(--text-primary)', borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}>
          <ScanLine size={16} /> Scan Again
        </button>
        <button onClick={() => {
          const text = `${productName || 'Product'} Safety Score: ${overallScore}/100 (${scoreLabel})\n\nAnalyzed by Ingredient Guardian`;
          if (navigator.share) navigator.share({ text });
          else navigator.clipboard?.writeText(text);
        }} style={{
          padding: '14px 20px',
          background: 'var(--accent-dim)', border: '1px solid rgba(99,102,241,0.3)',
          color: 'var(--accent-bright)', borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <Share2 size={16} /> Share
        </button>
      </div>
    </div>
  );
}
