import { useEffect, useRef, useState } from 'react';
import { Check, Info, Loader2 } from 'lucide-react';
import { Modal, ModalClose } from './Modal';
import { Button } from './ui';
import { PaymentMethodPicker, type PaymentMethod } from './PaymentMethodPicker';
import { PromoCode } from './PromoCode';
import { PLANS, formatPrice, type PlanId } from '../lib/plans';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: PlanId | null;
  currentPlan?: PlanId | null;
}

type Status = 'idle' | 'processing' | 'done';

/**
 * "Upgrade your plan" modal.
 *
 * FRONT-END DEMO ONLY: every plan costs $0.00, "Continue to payment" never redirects,
 * creates no checkout session, contacts no payment provider and collects no payment details.
 */
export function UpgradeModal({ isOpen, onClose, initialPlan = null, currentPlan = null }: UpgradeModalProps) {
  const [selected, setSelected] = useState<PlanId>(initialPlan ?? 'monthly');
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [promo, setPromo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>('idle');
  const timer = useRef<number | undefined>(undefined);

  // Reset every time the modal opens; a short skeleton mirrors the original "loading prices" state.
  useEffect(() => {
    if (!isOpen) return;
    setSelected(initialPlan ?? (currentPlan === 'monthly' ? 'lifetime' : 'monthly'));
    setStatus('idle');
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(t);
  }, [isOpen, initialPlan, currentPlan]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const ownsLifetime = currentPlan === 'lifetime';
  const processing = status === 'processing';

  const continueToPayment = () => {
    // Visual response only. Intentionally no navigation, no fetch, no checkout.
    setStatus('processing');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus('done'), 1200);
  };

  const plan = PLANS.find((p) => p.id === selected)!;

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="max-w-2xl" labelledBy="upgrade-title">
      <div className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="upgrade-title" className="text-xl font-bold tracking-tight text-white">
            Upgrade your plan
          </h2>
          <ModalClose onClick={onClose} label="Close payment modal" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Plan">
          {PLANS.map((p) => {
            const isSelected = selected === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => {
                  setSelected(p.id);
                  if (status === 'done') setStatus('idle');
                }}
                disabled={processing || ownsLifetime}
                className={`rounded-xl border bg-white/[0.02] p-4 text-left transition-colors disabled:opacity-40 ${
                  isSelected ? 'border-echo-primary' : 'border-white/[0.075] hover:border-white/[0.14]'
                }`}
              >
                <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-white/70'}`}>{p.name}</span>
                {loading ? (
                  <div className="mt-2 h-7 w-24 animate-pulse rounded bg-white/5" />
                ) : (
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-white">{formatPrice(p.priceCents)}</span>
                    <span className="text-xs text-white/40">{p.suffix}</span>
                  </div>
                )}
                <span className="mt-1 block text-xs text-white/40">{p.modalNote}</span>
              </button>
            );
          })}
        </div>

        {selected === 'quarterly' && (
          <p className="mt-3 text-xs text-white/45">
            One payment for 3 months of access. Nothing renews, buy again whenever you want more time.
          </p>
        )}

        <p className="mb-2 mt-5 text-sm font-semibold text-white">Payment method</p>
        <PaymentMethodPicker value={method} onChange={setMethod} disabled={processing} />

        <div className="mt-4">
          <PromoCode code={promo} onChange={setPromo} disabled={processing} />
        </div>

        <Button
          fullWidth
          className={`mt-5 h-11 rounded-xl ${status === 'done' ? 'ring-2 ring-echo-primary/50' : ''}`}
          onClick={continueToPayment}
          disabled={processing || loading || ownsLifetime}
        >
          {ownsLifetime ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Lifetime owned
            </>
          ) : processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Continue to payment'
          )}
        </Button>

        {status === 'done' && (
          <div
            role="status"
            className="mt-3 flex animate-fade-in items-start gap-2.5 rounded-xl border border-echo-primary/25 bg-echo-primary/10 p-3 text-sm text-echo-primary"
          >
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Demo mode: you selected <strong className="font-semibold">{plan.name}</strong> at{' '}
              {formatPrice(plan.priceCents)}. No checkout was created, no payment page was opened and nothing was
              charged.
            </span>
          </div>
        )}

        <p className="mt-3 text-center text-xs text-white/35">
          Prices in USD. All plans are $0.00 — this demo never processes payments.
        </p>
      </div>
    </Modal>
  );
}
