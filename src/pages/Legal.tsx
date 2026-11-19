import type { ReactNode } from 'react';

interface LegalSection {
  title: string;
  body: ReactNode;
}

function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: LegalSection[] }) {
  return (
    <div className="min-h-screen bg-echo-bg px-4 pb-24 pt-[calc(7rem+var(--banner-h,0px))] sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <h1 className="mb-4 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text pb-1 text-4xl font-black tracking-tighter text-transparent md:text-5xl">
          {title}
        </h1>
        <p className="mb-14 text-sm text-white/40">Last updated: {updated}</p>
        <div className="space-y-12">
          {sections.map((s, i) => (
            <section key={s.title}>
              <h2 className="mb-4 text-xl font-bold tracking-tight text-white">
                {i + 1}. {s.title}
              </h2>
              <div className="space-y-4 text-[15px] leading-relaxed text-white/60">{s.body}</div>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((t) => (
        <li key={t} className="flex gap-3">
          <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-white/40" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

const UPDATED = 'November 19, 2026';

const TERMS: LegalSection[] = [
  {
    title: 'About This Demo',
    body: (
      <p>
        This website is a front-end demonstration clone built for design and development purposes. It is not a
        commercial service. By using it you acknowledge that no product is sold, no account is created on any server and
        no software is distributed.
      </p>
    ),
  },
  {
    title: 'Pricing',
    body: (
      <p>
        Every plan shown on this site — Monthly, 3 months and Lifetime — is listed at $0.00. The "Upgrade your plan"
        flow is simulated: selecting a plan and pressing "Continue to payment" never opens a payment page, never creates
        a checkout session and never charges you.
      </p>
    ),
  },
  {
    title: 'Accounts',
    body: (
      <p>
        "Accounts" exist only in your browser's local storage. Passwords are not stored or transmitted, and you can
        remove all demo data at any time by signing out or clearing your browser storage.
      </p>
    ),
  },
  {
    title: 'Acceptable Use',
    body: (
      <>
        <p>You agree not to:</p>
        <Bullets
          items={[
            'Present this demo as a real product or service.',
            'Use it to collect real credentials or payment information from anyone.',
            'Use it in any way that violates applicable laws or third-party rights.',
          ]}
        />
      </>
    ),
  },
  {
    title: 'Third-Party Services and Disclaimer',
    body: (
      <p>
        We are not affiliated with, endorsed by, or associated with Microsoft or Mojang AB. Minecraft is a trademark of
        Mojang AB. No payment provider is integrated with this demo.
      </p>
    ),
  },
  {
    title: 'Disclaimer of Warranties',
    body: (
      <p>
        The demo is provided "as is" and "as available" without warranties of any kind, whether express or implied.
      </p>
    ),
  },
  {
    title: 'Changes to These Terms',
    body: <p>These terms may be updated from time to time. Changes are reflected by the "Last updated" date above.</p>,
  },
];

const PRIVACY: LegalSection[] = [
  {
    title: 'Overview',
    body: (
      <p>
        This demo is a static front-end. It has no backend, so it does not send the information you type into any
        form to a server.
      </p>
    ),
  },
  {
    title: 'Information Stored Locally',
    body: (
      <>
        <p>To make the dashboard interactive, the following is kept in your browser's local storage only:</p>
        <Bullets
          items={[
            'Your demo username and the email you entered (if any).',
            'Demo state such as the selected plan, email-verified flag and linked-Discord flag.',
          ]}
        />
        <p>Passwords are never stored.</p>
      </>
    ),
  },
  {
    title: 'Payments',
    body: (
      <p>
        No payment information is requested, collected or processed. All plans cost $0.00 and no payment provider is
        connected.
      </p>
    ),
  },
  {
    title: 'Cookies and Analytics',
    body: <p>This demo does not use tracking cookies, advertising pixels or analytics scripts.</p>,
  },
  {
    title: 'Your Choices',
    body: <p>Sign out from the dashboard or clear your browser's site data to remove everything stored by this demo.</p>,
  },
];

export const Terms = () => <LegalPage title="Terms of Service" updated={UPDATED} sections={TERMS} />;
export const Privacy = () => <LegalPage title="Privacy Policy" updated={UPDATED} sections={PRIVACY} />;
