export type PlanId = 'monthly' | 'quarterly' | 'lifetime';

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  /** Price in cents. Always 0: this is a demo with no real purchases. */
  priceCents: 0;
  suffix: string;
  /** Short note shown under the price in the upgrade modal */
  modalNote: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export const PLANS: Plan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    description: 'Flexible access with automatic renewal.',
    priceCents: 0,
    suffix: '/month',
    modalNote: 'Cancel anytime',
    features: ['Premium features', 'Cancel anytime', 'Auto-renewal'],
    cta: 'Subscribe',
    highlighted: true,
  },
  {
    id: 'quarterly',
    name: '3 months',
    description: 'Pay once for three months, no subscription.',
    priceCents: 0,
    suffix: 'one-time',
    modalNote: `${formatPrice(0)}/mo · no auto-renewal`,
    features: ['Premium features for 3 months', 'No auto-renewal', 'Cheaper than 3 monthly payments'],
    cta: 'Buy 3 months',
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    description: 'One purchase for permanent access.',
    priceCents: 0,
    suffix: 'one-time',
    modalNote: 'Pay once, keep forever',
    features: ['Premium features forever', 'No recurring payments', 'All future updates'],
    cta: 'Purchase lifetime',
  },
];

export const planLabel = (id: PlanId | null) =>
  id === 'lifetime' ? 'Lifetime' : id === 'quarterly' ? '3 Months' : id === 'monthly' ? 'Monthly' : 'Free';

export const PRICING_FOOTNOTE =
  'Prices in USD. Every plan is $0.00 — this is a front-end demo and no payment is ever processed.';
