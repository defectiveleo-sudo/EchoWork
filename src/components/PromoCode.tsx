import { useState } from 'react';
import { Loader2, Tag, X } from 'lucide-react';
import { fakeDelay } from '../lib/auth';

interface PromoCodeProps {
  code: string | null;
  onChange: (code: string | null) => void;
  disabled?: boolean;
}

/** "Have a promo code?" control. Codes are accepted locally; with every price at $0.00 they change nothing. */
export function PromoCode({ code, onChange, disabled = false }: PromoCodeProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  const apply = async () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setChecking(true);
    setError('');
    await fakeDelay(500);
    setChecking(false);
    if (!/^[a-z0-9_-]{3,20}$/i.test(trimmed)) {
      setError('That code is not valid');
      return;
    }
    setValue('');
    onChange(trimmed);
  };

  if (code) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-white/[0.075] bg-white/[0.03] px-4 py-2.5 text-sm">
        <span className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-echo-primary" />
          <span className="text-white/45">Code</span>
          <span className="font-semibold text-white">{code.toUpperCase()}</span>
          <span className="text-white/45">applied</span>
        </span>
        <button
          type="button"
          onClick={() => {
            onChange(null);
            setOpen(false);
          }}
          disabled={disabled}
          className="rounded-full p-1 text-white/35 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
          aria-label="Remove code"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <p className="text-sm text-white/45">
        Have a promo code?{' '}
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={disabled}
          className="font-medium text-echo-primary underline-offset-2 hover:underline"
        >
          Apply code
        </button>
      </p>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Promo code"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              apply();
            }
          }}
          disabled={disabled || checking}
          className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.045] px-4 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none"
        />
        <button
          type="button"
          onClick={apply}
          disabled={disabled || checking || !value.trim()}
          className="flex h-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm font-medium text-white/80 transition-colors hover:border-white/[0.16] hover:text-white disabled:opacity-50"
        >
          {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-300">{error}</p>}
    </div>
  );
}
