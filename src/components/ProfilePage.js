import React, { useState } from 'react';
import { Check, User, Baby, Heart, Activity } from 'lucide-react';

const PROFILE_TYPES = ['Adult', 'Child', 'Baby', 'Pregnant', 'Elderly'];
const ALLERGIES = ['Nuts', 'Dairy', 'Soy', 'Gluten', 'Shellfish', 'Egg', 'Sesame', 'Fish'];
const MEDICAL = ['Diabetes', 'High Blood Pressure', 'Kidney Disease', 'Liver Disease', 'Heart Disease'];
const LIFESTYLE = ['Vegan', 'Vegetarian', 'Halal', 'Kosher', 'Organic Only'];

function ToggleChip({ label, active, onClick, color = 'var(--accent)' }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 14px', borderRadius: '20px', fontSize: '13px',
      fontFamily: 'var(--font-display)', fontWeight: 600,
      background: active ? color + '22' : 'var(--bg-card)',
      color: active ? color : 'var(--text-secondary)',
      border: `1px solid ${active ? color + '55' : 'var(--border)'}`,
      display: 'flex', alignItems: 'center', gap: '5px',
      transition: 'all 0.2s',
    }}>
      {active && <Check size={12} />}
      {label}
    </button>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <div style={{ width: '28px', height: '28px', background: 'var(--accent-dim)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={14} color="var(--accent-bright)" />
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function ProfilePage({ profile, onUpdate }) {
  const [saved, setSaved] = useState(false);

  const toggle = (field, value) => {
    const arr = profile[field] || [];
    onUpdate({
      ...profile,
      [field]: arr.includes(value) ? arr.filter(x => x !== value) : [...arr, value],
    });
  };

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px', letterSpacing: '-0.02em' }}>My Profile</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Personalize your safety analysis</p>
      </div>

      <Section title="Who are you scanning for?" icon={User}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {PROFILE_TYPES.map(type => (
            <ToggleChip
              key={type} label={type}
              active={profile.type === type}
              onClick={() => onUpdate({ ...profile, type })}
              color="var(--accent)"
            />
          ))}
        </div>
      </Section>

      <Section title="Allergies" icon={Activity}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {ALLERGIES.map(a => (
            <ToggleChip
              key={a} label={a}
              active={profile.allergies?.includes(a)}
              onClick={() => toggle('allergies', a)}
              color="var(--warning)"
            />
          ))}
        </div>
      </Section>

      <Section title="Medical Conditions" icon={Heart}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {MEDICAL.map(m => (
            <ToggleChip
              key={m} label={m}
              active={profile.medical?.includes(m)}
              onClick={() => toggle('medical', m)}
              color="var(--danger)"
            />
          ))}
        </div>
      </Section>

      <Section title="Lifestyle Preferences" icon={Baby}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {LIFESTYLE.map(l => (
            <ToggleChip
              key={l} label={l}
              active={profile.lifestyle?.includes(l)}
              onClick={() => toggle('lifestyle', l)}
              color="var(--safe)"
            />
          ))}
        </div>
      </Section>

      {/* Summary */}
      <div style={{
        padding: '14px', background: 'var(--accent-dim)',
        border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius-md)',
      }}>
        <p style={{ fontSize: '13px', color: 'var(--accent-bright)', lineHeight: 1.5 }}>
          <strong>Active Profile:</strong> {profile.type}
          {profile.allergies?.length > 0 && ` • Allergies: ${profile.allergies.join(', ')}`}
          {profile.medical?.length > 0 && ` • Conditions: ${profile.medical.join(', ')}`}
          {profile.lifestyle?.length > 0 && ` • ${profile.lifestyle.join(', ')}`}
        </p>
      </div>

      <button onClick={save} style={{
        padding: '16px', width: '100%',
        background: saved ? 'var(--safe)' : 'linear-gradient(135deg, var(--accent), #4f46e5)',
        color: 'white', borderRadius: 'var(--radius-lg)',
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        transition: 'all 0.3s', boxShadow: '0 6px 24px rgba(99,102,241,0.3)',
      }}>
        {saved ? <><Check size={18} /> Profile Saved!</> : 'Save Profile'}
      </button>
    </div>
  );
}
