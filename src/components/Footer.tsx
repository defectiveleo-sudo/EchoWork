import { Logo } from './ui';
import { navigate, withBase, type Route } from '../lib/router';

const LINKS: { label: string; path: Route }[] = [
  { label: 'Home', path: '/' },
  { label: 'Changelog', path: '/changelog' },
  { label: 'Terms of Service', path: '/terms' },
  { label: 'Privacy Policy', path: '/privacy' },
];

export function Footer() {
  return (
    <footer className="bg-echo-surface py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center text-center lg:mb-12">
          <div className="mb-6">
            <Logo size="xl" onClick={() => navigate('/')} />
          </div>
          <p className="max-w-md text-sm text-echo-muted">
            We are not affiliated with Microsoft or Mojang AB in any way.
          </p>
          <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={withBase(l.path)}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(l.path);
                }}
                className="text-sm font-medium text-white/55 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 pt-6 text-center text-xs text-echo-muted lg:pt-8">
          <p>© 2026 Cyde. All rights reserved.</p>
          <p className="text-white/25">Demo clone · all plans $0.00 · no payments are processed.</p>
        </div>
      </div>
    </footer>
  );
}
