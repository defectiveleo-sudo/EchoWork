import type { ReactNode } from 'react';

export type PaymentMethod = 'card' | 'crypto';

/** Small badge chip used for the decorative method marks. Purely visual — nothing is integrated. */
function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-6 min-w-8 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5">
      {children}
    </span>
  );
}

const CARD_MARKS: ReactNode[] = [
  <span key="visa" className="text-[10px] font-black italic tracking-tight text-[#5B7BFF]">VISA</span>,
  <span key="mc" className="flex">
    <span className="h-3 w-3 rounded-full bg-[#EB001B]" />
    <span className="-ml-1.5 h-3 w-3 rounded-full bg-[#F79E1B] mix-blend-screen" />
  </span>,
  <span key="apple" className="text-[10px] font-semibold text-white">Apple Pay</span>,
  <span key="google" className="text-[10px] font-semibold text-white">G Pay</span>,
  <span key="pp" className="text-[10px] font-bold italic text-white">PayPal</span>,
];

const CRYPTO_MARKS: [string, string][] = [
  ['₿', '#F7931A'],
  ['Ξ', '#A5A9FF'],
  ['₮', '#26A17B'],
  ['◎', '#9945FF'],
  ['Ł', '#BFC5CC'],
  ['ɱ', '#FF6600'],
];

const OPTIONS: { id: PaymentMethod; label: string; marks: ReactNode }[] = [
  { id: 'card', label: 'Card', marks: CARD_MARKS.map((m, i) => <Chip key={i}>{m}</Chip>) },
  {
    id: 'crypto',
    label: 'Crypto',
    marks: (
      <>
        {CRYPTO_MARKS.map(([sym, color]) => (
          <Chip key={sym}>
            <span className="text-xs font-bold" style={{ color }}>
              {sym}
            </span>
          </Chip>
        ))}
        <Chip>
          <span className="text-[11px] font-semibold text-white/55">+12</span>
        </Chip>
      </>
    ),
  },
];

interface Props {
  value: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
  disabled?: boolean;
}

export function PaymentMethodPicker({ value, onChange, disabled = false }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
      {OPTIONS.map((o) => {
        const selected = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.id)}
            disabled={disabled}
            className={`w-full min-w-0 rounded-xl border bg-white/[0.02] p-3 text-left transition-colors ${
              selected ? 'border-echo-primary' : 'border-white/[0.075] hover:border-white/[0.14]'
            }`}
          >
            <span className="mb-2 flex items-baseline gap-1.5">
              <span className={`text-sm font-semibold ${selected ? 'text-white' : 'text-white/70'}`}>{o.label}</span>
              <span className="text-xs text-white/35">demo only</span>
            </span>
            <span className="flex flex-wrap gap-1">{o.marks}</span>
          </button>
        );
      })}
    </div>
  );
}
