import './LetterIllustration.css';

interface LetterIllustrationProps {
  variant: string;
  className?: string;
}

const COLORS: Record<string, { primary: string; secondary: string; accent: string }> = {
  appreciation: { primary: '#E8B4B8', secondary: '#F5E6E8', accent: '#C97B84' },
  congratulations: { primary: '#F4D03F', secondary: '#FCF3CF', accent: '#D4AC0D' },
  'missing-you': { primary: '#AED6F1', secondary: '#EBF5FB', accent: '#5DADE2' },
  encouragement: { primary: '#A9DFBF', secondary: '#E8F8F5', accent: '#52BE80' },
  'check-in': { primary: '#D7BDE2', secondary: '#F5EEF8', accent: '#AF7AC5' },
  'milestone-birthday': { primary: '#F8B4D9', secondary: '#FDEEF4', accent: '#E75480' },
  apology: { primary: '#D5DBDB', secondary: '#F2F4F4', accent: '#85929E' },
  inspiration: { primary: '#FAD7A0', secondary: '#FEF9E7', accent: '#F39C12' },
  memory: { primary: '#AED6F1', secondary: '#EBF5FB', accent: '#3498DB' },
  success: { primary: '#82E0AA', secondary: '#E8F8F5', accent: '#27AE60' },
  'thank-you': { primary: '#F5B7B1', secondary: '#FDEDEC', accent: '#E74C3C' },
  'new-beginning': { primary: '#A3E4D7', secondary: '#E8F8F5', accent: '#1ABC9C' },
  friendship: { primary: '#F1948A', secondary: '#FDEDEC', accent: '#E74C3C' },
  creative: { primary: '#BB8FCE', secondary: '#F5EEF8', accent: '#8E44AD' },
  'end-of-year': { primary: '#85C1E9', secondary: '#EBF5FB', accent: '#2980B9' },
  'future-student': { primary: '#F9E79F', secondary: '#FEF9E7', accent: '#D4AC0D' },
};

const DEFAULT_COLORS = { primary: '#D4C4B0', secondary: '#F5F0EB', accent: '#8B7355' };

export function LetterIllustration({ variant, className = '' }: LetterIllustrationProps) {
  const colors = COLORS[variant] || DEFAULT_COLORS;

  return (
    <div className={`letter-illustration ${className}`} style={{ background: colors.secondary }}>
      <svg viewBox="0 0 200 160" className="letter-illustration__svg" aria-hidden="true">
        <defs>
          <linearGradient id={`grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.accent} stopOpacity="0.6" />
          </linearGradient>
        </defs>

        <rect x="40" y="30" width="120" height="100" rx="6" fill="white" opacity="0.9" className="letter-illustration__envelope" />
        <path
          d="M40 30 L100 75 L160 30"
          fill="none"
          stroke={colors.accent}
          strokeWidth="2"
          opacity="0.5"
          className="letter-illustration__flap"
        />
        <rect x="55" y="55" width="90" height="4" rx="2" fill={colors.primary} opacity="0.6" />
        <rect x="55" y="68" width="70" height="3" rx="1.5" fill={colors.primary} opacity="0.4" />
        <rect x="55" y="78" width="80" height="3" rx="1.5" fill={colors.primary} opacity="0.4" />
        <rect x="55" y="88" width="60" height="3" rx="1.5" fill={colors.primary} opacity="0.4" />

        <circle cx="155" cy="45" r="18" fill={`url(#grad-${variant})`} className="letter-illustration__orb" />
        <circle cx="45" cy="120" r="10" fill={colors.primary} opacity="0.3" className="letter-illustration__dot" />
        <circle cx="170" cy="115" r="6" fill={colors.accent} opacity="0.25" className="letter-illustration__dot letter-illustration__dot--delay" />
      </svg>
    </div>
  );
}
