import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button, Logo } from './ui';
import { navigate, scrollToSection, withBase, type Route } from '../lib/router';
import { useAuth } from '../lib/auth';

const LINKS = [
  { label: 'Overview', sectionId: 'overview' },
  { label: 'Pricing', sectionId: 'pricing' },
  { label: 'FAQ', sectionId: 'faq' },
];

export function Navbar({ current }: { current: Route | null }) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const onDashboard = current === '/dashboard';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const goSection = (id: string) => {
    setMenuOpen(false);
    if (current === '/') {
      scrollToSection(id);
      window.history.replaceState({}, '', withBase(id === 'overview' ? '/' : `/#${id}`));
    } else {
      navigate('/', { hash: id === 'overview' ? undefined : id });
    }
  };

  const go = (path: Route, search?: string) => {
    setMenuOpen(false);
    navigate(path, { search });
  };

  return (
    <>
      <nav
        className={`fixed left-1/2 top-[calc(1.5rem+var(--banner-h,0px))] z-50 flex h-14 w-[90%] max-w-4xl -translate-x-1/2 items-center justify-between rounded-full px-6 transition-all duration-300 ease-in-out ${
          scrolled
            ? 'border border-white/10 bg-black/60 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl'
            : 'border border-transparent bg-transparent'
        }`}
      >
        <Logo onClick={() => goSection('overview')} />

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center space-x-1 md:flex">
          {LINKS.map((l) => (
            <button
              key={l.label}
              type="button"
              onClick={() => goSection(l.sectionId)}
              className="rounded-full px-4 py-1.5 font-sans text-sm font-medium text-echo-text transition-colors hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {!user && !onDashboard && (
            <>
              <button
                type="button"
                onClick={() => go('/auth')}
                className="px-3 font-sans text-sm font-medium text-echo-text transition-colors hover:text-white"
              >
                Log In
              </button>
              <Button size="sm" onClick={() => go('/auth', '?mode=register')} className="h-8 rounded-full text-xs">
                Get Access
              </Button>
            </>
          )}
          {user && !onDashboard && (
            <Button size="sm" onClick={() => go('/dashboard')} className="h-8 rounded-full text-xs">
              Dashboard
            </Button>
          )}
          {onDashboard && (
            <div className="flex items-center" title="Connected">
              <span className="mr-2 h-2 w-2 rounded-full bg-green-500" />
            </div>
          )}
        </div>

        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="text-white focus:outline-none"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex animate-fade-in flex-col items-center justify-center space-y-8 bg-black/90 backdrop-blur-xl">
          {LINKS.map((l) => (
            <button
              key={l.label}
              type="button"
              onClick={() => goSection(l.sectionId)}
              className="font-sans text-2xl font-medium text-white transition-colors hover:text-echo-primary"
            >
              {l.label}
            </button>
          ))}
          <div className="mt-8 flex w-64 flex-col gap-4">
            {user ? (
              <Button onClick={() => go('/dashboard')} fullWidth className="h-12 rounded-xl">
                Dashboard
              </Button>
            ) : (
              <>
                <Button onClick={() => go('/auth')} variant="outline" fullWidth className="h-12 rounded-xl">
                  Log In
                </Button>
                <Button onClick={() => go('/auth', '?mode=register')} fullWidth className="h-12 rounded-xl">
                  Get Access
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
