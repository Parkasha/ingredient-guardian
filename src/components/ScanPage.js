import React, { useState, useRef } from 'react';
import { Camera, Type, Upload, Loader2, Scan, AlertCircle, X } from 'lucide-react';

const PRODUCT_TYPES = ['Food', 'Beverage', 'Condiment', 'Cosmetic/Skincare', 'Makeup', 'Medicine', 'Vitamin/Supplement', 'Baby Product', 'Household Product'];

export default function ScanPage({ onAnalysisComplete, userProfile }) {
  const [mode, setMode] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [productType, setProductType] = useState('Food');
  const [productName, setProductName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loadingStep, setLoadingStep] = useState('');
  const fileRef = useRef();

  const steps = [
    'Extracting ingredients…',
    'Cross-referencing safety databases…',
    'Analyzing health risks…',
    'Generating your safety report…',
  ];

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setImageBase64(e.target.result.split(',')[1]);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const buildPrompt = () => {
    const profileInfo = `User profile: ${userProfile.type}${userProfile.allergies.length ? `, allergies: ${userProfile.allergies.join(', ')}` : ''}${userProfile.medical.length ? `, medical conditions: ${userProfile.medical.join(', ')}` : ''}${userProfile.lifestyle.length ? `, lifestyle: ${userProfile.lifestyle.join(', ')}` : ''}`;

    if (mode === 'image') {
      return `You are an expert ingredient safety analyst. Analyze the ingredient list visible in this product image.
Product type: ${productType}
${productName ? `Product name: ${productName}` : ''}
${profileInfo}

Extract ALL ingredients you can see and analyze each one. Return ONLY valid JSON (no markdown, no preamble) in this exact structure:
{
  "productName": "string (inferred or provided)",
  "productType": "string",
  "overallScore": number (0-100),
  "scoreLabel": "Excellent|Good|Moderate Risk|Avoid",
  "summary": "2-3 sentence summary",
  "alerts": ["alert string", ...],
  "ingredients": [
    {
      "name": "ingredient name",
      "status": "safe|caution|allergen|harmful|carcinogen",
      "purpose": "what it does",
      "riskLevel": "Safe|Low Risk|Moderate Risk|High Risk",
      "tags": ["tag1", ...],
      "concerns": ["concern1", ...],
      "ageSuitability": {
        "infants": "Safe|Caution|Avoid",
        "children": "Safe|Caution|Avoid",
        "adults": "Safe|Caution|Avoid",
        "seniors": "Safe|Caution|Avoid",
        "pregnant": "Safe|Caution|Avoid"
      },
      "userRisk": "none|low|moderate|high"
    }
  ],
  "ageSummary": {"infants": "text", "children": "text", "adults": "text", "seniors": "text"},
  "counts": {"safe": n, "caution": n, "allergen": n, "harmful": n, "carcinogen": n}
}`;
    }

    return `You are an expert ingredient safety analyst. Analyze these product ingredients:
Product type: ${productType}
${productName ? `Product name: ${productName}` : ''}
Ingredients: ${textInput}
${profileInfo}

Analyze each ingredient for health risks, safety, allergens, and suitability. Return ONLY valid JSON (no markdown, no preamble) in this exact structure:
{
  "productName": "string (inferred or provided)",
  "productType": "string",
  "overallScore": number (0-100),
  "scoreLabel": "Excellent|Good|Moderate Risk|Avoid",
  "summary": "2-3 sentence summary",
  "alerts": ["alert string", ...],
  "ingredients": [
    {
      "name": "ingredient name",
      "status": "safe|caution|allergen|harmful|carcinogen",
      "purpose": "what it does",
      "riskLevel": "Safe|Low Risk|Moderate Risk|High Risk",
      "tags": ["Allergen|Irritant|Carcinogenic|Hormone Disruptor|Neurotoxin|Environmental Hazard|Pregnancy Warning|Child Safety Concern"],
      "concerns": ["concern description"],
      "ageSuitability": {
        "infants": "Safe|Caution|Avoid",
        "children": "Safe|Caution|Avoid",
        "adults": "Safe|Caution|Avoid",
        "seniors": "Safe|Caution|Avoid",
        "pregnant": "Safe|Caution|Avoid"
      },
      "userRisk": "none|low|moderate|high"
    }
  ],
  "ageSummary": {"infants": "text", "children": "text", "adults": "text", "seniors": "text"},
  "counts": {"safe": n, "caution": n, "allergen": n, "harmful": n, "carcinogen": n}
}`;
  };

  const analyze = async () => {
    if (mode === 'text' && !textInput.trim()) { setError('Please enter ingredient list'); return; }
    if (mode === 'image' && !imageBase64) { setError('Please upload a product image'); return; }
    setError('');
    setLoading(true);
    setLoadingStep(steps[0]);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        const idx = steps.indexOf(prev);
        return steps[Math.min(idx + 1, steps.length - 1)];
      });
    }, 2000);

    try {
      const messages = mode === 'image'
        ? [{ role: 'user', content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
            { type: 'text', text: buildPrompt() }
          ]}]
        : [{ role: 'user', content: buildPrompt() }];

      // Calls our secure Vercel serverless proxy — API key never touches the browser
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 4000,
          messages,
        }),
      });

      const data = await res.json();
      clearInterval(stepInterval);

      if (!res.ok) throw new Error(data.error?.message || 'API error');

      const raw = data.content?.[0]?.text || '';
      const cleaned = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      parsed.scannedAt = new Date().toISOString();
      if (imagePreview) parsed.imagePreview = imagePreview;
      onAnalysisComplete(parsed);
    } catch (e) {
      clearInterval(stepInterval);
      setError('Analysis failed: ' + e.message + '. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px', letterSpacing: '-0.02em' }}>
          Analyze Product
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Paste ingredients or upload a photo</p>
      </div>

      {/* Mode toggle */}
      <div style={{
        display: 'flex', gap: '8px', marginBottom: '24px',
        background: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
      }}>
        {[['text', <Type size={16} />, 'Type Ingredients'], ['image', <Camera size={16} />, 'Photo / Image']].map(([m, icon, label]) => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)',
            background: mode === m ? 'var(--accent)' : 'transparent',
            color: mode === m ? 'white' : 'var(--text-secondary)',
            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            transition: 'all 0.2s',
          }}>{icon}{label}</button>
        ))}
      </div>

      {/* Product info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        <div>
          <label style={{ fontSize: '12px', fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Product Name (optional)</label>
          <input value={productName} onChange={e => setProductName(e.target.value)}
            placeholder="e.g. Coca-Cola, Neutrogena SPF 50…"
            style={{
              marginTop: '6px', width: '100%', padding: '12px 14px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '15px',
              outline: 'none', transition: 'border 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Product Type</label>
          <select value={productType} onChange={e => setProductType(e.target.value)} style={{
            marginTop: '6px', width: '100%', padding: '12px 14px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '15px',
            outline: 'none',
          }}>
            {PRODUCT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Input area */}
      {mode === 'text' ? (
        <div>
          <label style={{ fontSize: '12px', fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ingredient List</label>
          <textarea value={textInput} onChange={e => setTextInput(e.target.value)}
            placeholder="Paste ingredients here…&#10;&#10;e.g. Water, Sugar, Citric Acid, Sodium Benzoate, High Fructose Corn Syrup, Natural Flavors, Red 40, Aspartame…"
            rows={7}
            style={{
              marginTop: '6px', width: '100%', padding: '14px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '15px',
              resize: 'vertical', outline: 'none', lineHeight: 1.6,
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      ) : (
        <div>
          <label style={{ fontSize: '12px', fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Product Image</label>
          {imagePreview ? (
            <div style={{ marginTop: '6px', position: 'relative' }}>
              <img src={imagePreview} alt="preview" style={{ width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', maxHeight: '220px', objectFit: 'cover' }} />
              <button onClick={() => { setImagePreview(null); setImageBase64(null); }} style={{
                position: 'absolute', top: '8px', right: '8px',
                background: 'rgba(0,0,0,0.7)', borderRadius: '50%',
                width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white',
              }}>
                <X size={14} />
              </button>
            </div>
          ) : (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => fileRef.current.click()}
              style={{
                marginTop: '6px', padding: '40px 20px', textAlign: 'center',
                border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                background: dragOver ? 'var(--accent-dim)' : 'var(--bg-card)',
                transition: 'all 0.2s',
              }}>
              <Upload size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Tap to upload or drag & drop</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Photo of ingredient label or full product</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          marginTop: '16px', padding: '12px 14px', display: 'flex', gap: '10px', alignItems: 'flex-start',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 'var(--radius-md)',
        }}>
          <AlertCircle size={16} color="var(--danger)" style={{ marginTop: '1px', flexShrink: 0 }} />
          <p style={{ color: 'var(--danger)', fontSize: '14px' }}>{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{
          marginTop: '24px', padding: '20px',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', textAlign: 'center',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <Loader2 size={28} color="var(--accent-bright)" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '4px' }}>Analyzing ingredients…</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{loadingStep}</p>
          <div style={{ marginTop: '14px', height: '4px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '4px',
              background: 'linear-gradient(90deg, var(--accent), var(--safe))',
              animation: 'shimmer 2s infinite',
              backgroundSize: '200% 100%',
            }} />
          </div>
        </div>
      )}

      {/* Submit */}
      {!loading && (
        <button onClick={analyze} style={{
          width: '100%', marginTop: '24px', padding: '18px',
          background: 'linear-gradient(135deg, var(--accent) 0%, #4f46e5 100%)',
          color: 'white', borderRadius: 'var(--radius-lg)',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: '0 8px 32px rgba(99,102,241,0.3)',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = ''; }}
        >
          <Scan size={20} />
          Analyze Now
        </button>
      )}
    </div>
  );
}
