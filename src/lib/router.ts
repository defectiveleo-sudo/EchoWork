import { useEffect, useState } from 'react';

export type Route = '/' | '/auth' | '/dashboard' | '/changelog' | '/terms' | '/privacy';

/** Deploy base path, e.g. "/EchoWork/" on GitHub Pages or "/" locally. */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefixes an app route with the deploy base path. */
export const withBase = (path: string) => BASE + path;

const KNOWN: Route[] = ['/', '/auth', '/dashboard', '/changelog', '/terms', '/privacy'];
const EVENT = 'echo:navigate';

export function normalizePath(pathname: string): Route | null {
  if (BASE && pathname.startsWith(BASE)) pathname = pathname.slice(BASE.length) || '/';
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean.startsWith('/dashboard')) return '/dashboard';
  return (KNOWN as string[]).includes(clean) ? (clean as Route) : null;
}

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

/** Client-side navigation. `search` may be e.g. "?mode=register"; `hash` scrolls to a section id. */
export function navigate(path: Route, opts: { search?: string; hash?: string; replace?: boolean } = {}) {
  const url = withBase(path) + (opts.search ?? '') + (opts.hash ? `#${opts.hash}` : '');
  const sameRoute = normalizePath(window.location.pathname) === path;
  if (opts.replace) window.history.replaceState({}, '', url);
  else window.history.pushState({}, '', url);
  window.dispatchEvent(new Event(EVENT));

  if (opts.hash) {
    // Give the target page a moment to render before scrolling.
    const id = opts.hash;
    window.setTimeout(() => scrollToSection(id), sameRoute ? 0 : 80);
  } else if (!sameRoute) {
    window.scrollTo({ top: 0 });
  }
}

const readLocation = () => ({
  path: normalizePath(window.location.pathname),
  search: window.location.search,
});

export function useLocation() {
  const [loc, setLoc] = useState(readLocation);
  useEffect(() => {
    const update = () => setLoc(readLocation());
    window.addEventListener('popstate', update);
    window.addEventListener(EVENT, update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener(EVENT, update);
    };
  }, []);
  return loc;
}
