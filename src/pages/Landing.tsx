import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui';
import { Reveal } from '../components/Reveal';
import { FaqItem } from '../components/FaqItem';
import { PricingCard } from '../components/PricingCard';
import { MediaMarquee } from '../components/MediaMarquee';
import { UpgradeModal } from '../components/UpgradeModal';
import { CREATORS, FAQ } from '../lib/content';
import { PLANS, PRICING_FOOTNOTE, type PlanId } from '../lib/plans';
import { navigate, scrollToSection } from '../lib/router';
import { useAuth } from '../lib/auth';

function CreatorLink({ name, url, color }: (typeof CREATORS)[number]) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3 text-lg font-bold tracking-tight text-white/80 transition-colors hover:text-[var(--brand)] md:text-xl"
      style={{ ['--brand' as string]: color }}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-black text-white/70 grayscale transition-all duration-200 group-hover:bg-[var(--brand)] group-hover:text-black group-hover:grayscale-0"
        aria-hidden="true"
      >
        {name.slice(0, 1)}
      </span>
      <span>{name}</span>
    </a>
  );
}

export function Landing() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<string | null>('1');
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradePlan, setUpgradePlan] = useState<PlanId | null>(null);

  const selectPlan = (id: PlanId) => {
    if (!user) return navigate('/auth', { search: '?mode=register' });
    setUpgradePlan(id);
    setUpgradeOpen(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-echo-bg selection:bg-echo-primary selection:text-black">
      {/* Hero */}
      <section id="overview" className="relative overflow-hidden px-4 pb-10 pt-[calc(7rem+var(--banner-h,0px))] sm:px-6 lg:px-8 lg:pb-12 lg:pt-[calc(9rem+var(--banner-h,0px))]">
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <Reveal>
              <h1 className="mb-6 bg-gradient-to-b from-white via-white to-white/50 bg-clip-text pb-2 text-5xl font-black tracking-tighter text-transparent md:text-7xl lg:text-8xl">
                The unseen advantage.
              </h1>
              <p className="mx-auto mb-10 max-w-2xl font-sans text-lg leading-relaxed text-echo-muted md:text-xl">
                Your go-to client for undetected cheating.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <div className="flex h-12 w-[13.5rem] justify-center sm:w-[10.75rem]">
                  <Button
                    size="lg"
                    className="group h-12 w-[13.5rem] overflow-hidden rounded-full px-8 text-base transition-[width,background-color] duration-300 sm:w-[9.25rem] sm:hover:w-[10.75rem]"
                    onClick={() => (user ? navigate('/dashboard') : navigate('/auth', { search: '?mode=register' }))}
                  >
                    <span className="whitespace-nowrap">{user ? 'Dashboard' : 'Get Started'}</span>
                    <ArrowRight className="ml-0 h-4 w-4 max-w-0 shrink-0 opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-4 group-hover:opacity-100" />
                  </Button>
                </div>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-[13.5rem] rounded-full bg-white/[0.01] px-8 text-base backdrop-blur-sm sm:w-auto"
                  onClick={() => scrollToSection('pricing')}
                >
                  See Pricing
                </Button>
              </div>
              <div className="mt-12 flex flex-col items-center gap-5">
                <p className="text-sm font-medium text-white/40">Trusted by large creators</p>
                <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                  {CREATORS.map((c) => (
                    <CreatorLink key={c.name} {...c} />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <MediaMarquee />

      {/* Pricing */}
      <section id="pricing" className="relative scroll-mt-24 overflow-hidden bg-echo-bg py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-14 text-center">
              <h2 className="mb-5 bg-gradient-to-b from-white via-white to-white/70 bg-clip-text pb-1 text-4xl font-black tracking-tighter text-transparent md:text-6xl">
                Choose your plan
              </h2>
              <p className="text-base text-white/50 md:text-lg">
                Get Echo Client monthly, for 3 months, or unlock the permanent experience.
              </p>
            </div>
          </Reveal>
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {PLANS.map((p, i) => (
              <Reveal key={p.id} delay={100 + i * 100} className="h-full">
                <PricingCard plan={p} onSelect={() => selectPlan(p.id)} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={300}>
            <p className="mt-8 text-center text-sm text-white/45">{PRICING_FOOTNOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 bg-echo-bg py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="mb-12 text-4xl font-black tracking-tighter text-white md:text-5xl">Got any questions?</h2>
          </Reveal>
          <Reveal delay={150}>
            {FAQ.map((f) => (
              <FaqItem
                key={f.id}
                id={f.id}
                question={f.question}
                answer={f.answer}
                isOpen={openFaq === f.id}
                onToggle={() => setOpenFaq(openFaq === f.id ? null : f.id)}
              />
            ))}
          </Reveal>
        </div>
      </section>

      <UpgradeModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        initialPlan={upgradePlan}
        currentPlan={user?.plan ?? null}
      />
    </div>
  );
}
