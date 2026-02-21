export const T = {
  // Colors
  bg: '#0E0A07',
  bgCard: '#17100C',
  bgElevated: '#1F1510',
  border: 'rgba(240,230,211,0.08)',
  borderStrong: 'rgba(240,230,211,0.18)',

  cream: '#F0E6D3',
  creamDim: 'rgba(240,230,211,0.5)',
  creamFaint: 'rgba(240,230,211,0.1)',

  ember: '#E8622A',      // primary accent
  emberDim: 'rgba(232,98,42,0.2)',
  emberGlow: 'rgba(232,98,42,0.08)',
  gold: '#C8943E',
  green: '#4CAF50',
  greenDim: 'rgba(76,175,80,0.15)',

  // Typography
  fontDisplay: "'Instrument Serif', serif",
  fontUI: "'Syne', sans-serif",
  fontMono: "'DM Mono', monospace",
};

export const card = {
  background: T.bgCard,
  border: `1px solid ${T.border}`,
  borderRadius: '16px',
  padding: '24px',
};

export const btnPrimary = {
  background: T.ember,
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  padding: '14px 28px',
  fontSize: '15px',
  fontFamily: T.fontUI,
  fontWeight: '600',
  cursor: 'pointer',
  width: '100%',
  letterSpacing: '0.3px',
};

export const btnGhost = {
  background: 'transparent',
  color: T.creamDim,
  border: `1px solid ${T.border}`,
  borderRadius: '12px',
  padding: '12px 24px',
  fontSize: '14px',
  fontFamily: T.fontUI,
  cursor: 'pointer',
  width: '100%',
};

export const input = {
  background: T.bgElevated,
  border: `1px solid ${T.border}`,
  borderRadius: '10px',
  padding: '13px 16px',
  fontSize: '14px',
  fontFamily: T.fontUI,
  color: T.cream,
  width: '100%',
  outline: 'none',
};

export const label = {
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  color: T.creamDim,
  display: 'block',
  marginBottom: '8px',
};