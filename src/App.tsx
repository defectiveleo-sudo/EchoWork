import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoBanner } from './components/DemoBanner';
import { Button } from './components/ui';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Changelog } from './pages/Changelog';
import { Privacy, Terms } from './pages/Legal';
import { navigate, scrollToSection, useLocation, type Route } from './lib/router';

const TITLES: Record<Route, string> = {
  '/': 'Echo Client | Dominate 1.21.11–26.3',
  '/auth': 'Sign in | Echo Client',
  '/dashboard': 'Dashboard | Echo Client',
  '/changelog': 'Changelog | Echo Client',
  '/terms': 'Terms of Service | Echo Client',
  '/privacy': 'Privacy Policy | Echo Client',
};

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-echo-bg px-4 text-center">
      <p className="mb-3 text-sm font-semibold text-echo-primary">404</p>
      <h1 className="mb-4 text-4xl font-black tracking-tighter text-white md:text-5xl">Page not found</h1>
      <p className="mb-8 text-white/50">The page you're looking for doesn't exist.</p>
      <Button onClick={() => navigate('/')} className="rounded-full">
        Back to home
      </Button>
    </div>
  );
}

export default function App() {
  const { path, search } = useLocation();

  useEffect(() => {
    document.title = path ? TITLES[path] : 'Not found | Echo Client';
  }, [path]);

  // Honour /#pricing style deep links on first load.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) window.setTimeout(() => scrollToSection(hash), 120);
  }, []);

  let page;
  switch (path) {
    case '/':
      page = <Landing />;
      break;
    case '/auth':
      page = <Auth search={search} />;
      break;
    case '/dashboard':
      page = <Dashboard />;
      break;
    case '/changelog':
      page = <Changelog />;
      break;
    case '/terms':
      page = <Terms />;
      break;
    case '/privacy':
      page = <Privacy />;
      break;
    default:
      page = <NotFound />;
  }

  const showFooter = path !== '/auth' && path !== '/dashboard' && path !== null;

  return (
    <>
      <DemoBanner />
      <Navbar current={path} />
      <main>{page}</main>
      {showFooter && <Footer />}
    </>
  );
}
