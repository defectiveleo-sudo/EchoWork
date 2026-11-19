import { Check } from 'lucide-react';
import { Button } from './ui';
import { formatPrice, type Plan } from '../lib/plans';

export function PricingCard({ plan, onSelect }: { plan: Plan; onSelect: () => void }) {
  const hl = plan.highlighted;
  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border bg-[#181818] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] transition-colors ${
        hl ? 'border-echo-primary/45 hover:border-echo-primary/65' : 'border-white/[0.075] hover:border-white/[0.13]'
      }`}
    >
      <div className="mb-8">
        <h3 className="mb-2 text-2xl font-bold tracking-tight text-white">{plan.name}</h3>
        <p className="mb-7 text-sm leading-relaxed text-white/55">{plan.description}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight text-white">{formatPrice(plan.priceCents)}</span>
          <span className="text-white/45">{plan.suffix}</span>
        </div>
      </div>
      <ul className="mb-9 space-y-3.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-sm font-medium text-white/70">
            <Check className="h-4 w-4 flex-shrink-0 text-echo-primary" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Button
        fullWidth
        variant={hl ? 'primary' : 'outline'}
        onClick={onSelect}
        className={`mt-auto rounded-xl ${hl ? '' : 'border-white/[0.08] bg-white/[0.035] text-white/80 hover:bg-white/[0.06] hover:text-white'}`}
      >
        {plan.cta}
      </Button>
    </div>
  );
}
