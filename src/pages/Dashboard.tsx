import { useEffect, useState } from 'react';
import { ArrowRight, CreditCard, Download, ExternalLink, Key, Lock, LogOut, Mail, RefreshCw } from 'lucide-react';
import { Button, Card, FIELD_CLASS, Input } from '../components/ui';
import { UpgradeModal } from '../components/UpgradeModal';
import { RedeemKeyModal, VerifyEmailModal } from '../components/DashboardModals';
import { useToast } from '../components/Toast';
import { fakeDelay, useAuth, type DemoUser } from '../lib/auth';
import { RELEASES, SUPPORTED_VERSIONS, formatDate } from '../lib/content';
import { planLabel } from '../lib/plans';
import { navigate, withBase } from '../lib/router';

type Tab = 'DOWNLOAD' | 'ACCOUNT';
const HWID_COOLDOWN_DAYS = 7;

const tabFromPath = (): Tab => (window.location.pathname.startsWith(withBase('/dashboard/account')) ? 'ACCOUNT' : 'DOWNLOAD');

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 rounded-full px-5 text-sm font-medium transition-colors ${active ? 'bg-white text-black' : 'text-white/45 hover:text-white'}`}
    >
      {children}
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3.5">
      <span className="text-sm text-white/40">{label}</span>
      <span className="truncate text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

const INSTALL_STEPS = [
  {
    title: 'Install Fabric',
    body: (
      <>
        Run the{' '}
        <a href="https://fabricmc.net/use/" target="_blank" rel="noopener noreferrer" className="text-white/75 underline decoration-white/25 underline-offset-4 hover:decoration-white/70">
          Fabric installer
        </a>{' '}
        and pick your Minecraft version.
      </>
    ),
  },
  {
    title: 'Add mods',
    body: (
      <>
        Put Fabric API and Echo Client in{' '}
        <code className="rounded bg-white/[0.06] px-1 py-px font-mono text-[11px] text-white/75">.minecraft/mods</code>
      </>
    ),
  },
  {
    title: 'Launch game',
    body: (
      <>
        Select the Fabric profile and press{' '}
        <kbd className="rounded border border-white/[0.1] bg-white/[0.06] px-1 py-px font-mono text-[11px] text-white/75">RSHIFT</kbd>{' '}
        <span className="whitespace-nowrap">in-game.</span>
      </>
    ),
  },
];

function DownloadTab({ user, onVerify, onGetAccess }: { user: DemoUser; onVerify: () => void; onGetAccess: () => void }) {
  const toast = useToast();
  const [downloading, setDownloading] = useState(false);
  const latest = RELEASES[0];
  const hasAccess = !!user.plan;

  const download = async () => {
    setDownloading(true);
    await fakeDelay(800);
    setDownloading(false);
    toast(`Demo: v${latest.version} is not a real build, so there is nothing to download.`);
  };

  const latestItems = latest.sections.flatMap((s) => s.items).slice(0, 3);

  return (
    <div className="space-y-4">
      {!user.emailVerified && (
        <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:flex">
              <Mail className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-white">Verify your email to unlock downloads</p>
              <p className="mt-0.5 text-sm text-white/50">We'll send a 6-digit code. It takes under a minute.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onVerify}
            className="group flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-white/90 sm:w-auto"
          >
            Verify email
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.45fr_0.85fr]">
        <Card className="flex flex-col p-5 sm:p-6">
          <div className="mb-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="min-w-0 text-xl font-bold tracking-tight text-white sm:text-2xl">Download Echo Client</h2>
              <span className="flex shrink-0 items-center gap-1 rounded-lg border border-white/[0.075] bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-white/70">
                v{latest.version}
                <span className="hidden text-white/50 sm:inline">· Latest</span>
              </span>
            </div>
            <p className="mt-2 text-sm text-white/50">
              Fabric mod for Minecraft <span className="whitespace-nowrap">{SUPPORTED_VERSIONS}</span>.
            </p>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/[0.075] bg-white/[0.03] px-3 py-2.5 sm:p-3">
              <p className="mb-1 text-[11px] text-white/50 sm:text-xs">Loader</p>
              <p className="text-[13px] font-semibold text-white sm:text-sm">Fabric</p>
            </div>
            <a
              href="https://modrinth.com/mod/fabric-api"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-white/[0.075] bg-white/[0.03] px-3 py-2.5 transition-colors hover:border-white/[0.16] hover:bg-white/[0.05] sm:p-3"
            >
              <p className="mb-1 text-[11px] text-white/50 sm:text-xs">Requires</p>
              <p className="flex items-center gap-1 text-[13px] font-semibold text-white sm:text-sm">
                <span className="underline decoration-white/25 underline-offset-4 group-hover:decoration-white/70">Fabric API</span>
                <ExternalLink className="h-3.5 w-3.5 text-white/40 transition-colors group-hover:text-white/80" />
              </p>
            </a>
          </div>

          <div className="mt-auto">
            {hasAccess && !user.emailVerified ? (
              <button
                type="button"
                onClick={onVerify}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.06] px-6 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.09] hover:text-white sm:w-auto"
              >
                <Lock className="h-4 w-4" />
                Verify email to download
              </button>
            ) : (
              <div className="flex h-12 w-full sm:w-[13.5rem]">
                <Button
                  size="lg"
                  className="group h-12 w-full overflow-hidden rounded-xl px-8 transition-[width,background-color] duration-300 sm:w-[11.25rem] sm:hover:w-[13.5rem]"
                  onClick={hasAccess ? download : onGetAccess}
                  disabled={downloading}
                >
                  <span className="whitespace-nowrap">{hasAccess ? 'Download Client' : 'Get Access'}</span>
                  {downloading ? (
                    <RefreshCw className="ml-2 h-4 w-4 shrink-0 animate-spin" />
                  ) : (
                    <Download className="ml-0 h-4 w-4 max-w-0 shrink-0 opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-4 group-hover:opacity-100" />
                  )}
                </Button>
              </div>
            )}
            <p className="mt-3 text-xs text-white/45">Released {formatDate(latest.date)} · Windows, macOS, Linux</p>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h3 className="mb-1 text-lg font-bold text-white">Install guide</h3>
          <p className="mb-5 text-sm text-white/50">Three steps, about two minutes.</p>
          <ol>
            {INSTALL_STEPS.map((step, i) => (
              <li key={step.title} className="relative flex gap-3.5 pb-5 last:pb-0">
                {i < INSTALL_STEPS.length - 1 && <span className="absolute bottom-0 left-[11.5px] top-7 w-px bg-white/[0.08]" />}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04] text-[11px] font-semibold tabular-nums text-white/70">
                  {i + 1}
                </span>
                <div className="pt-0.5">
                  <p className="text-sm font-semibold text-white">{step.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <h3 className="mb-1 text-lg font-bold text-white">Latest update</h3>
          <p className="mb-5 text-sm text-white/50">Released on {formatDate(latest.date)}</p>
          <ul className="space-y-3 text-sm text-white/60">
            {latestItems.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => navigate('/changelog')}
            className="mt-5 text-sm font-medium text-echo-primary underline-offset-2 hover:underline"
          >
            View full changelog
          </button>
        </Card>
        <Card className="p-5 sm:p-6">
          <h3 className="mb-1 text-lg font-bold text-white">Account status</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
              <p className="text-xs text-white/50">Plan</p>
              <p className={`mt-1 text-sm font-semibold ${hasAccess ? 'text-echo-primary' : 'text-white/60'}`}>{planLabel(user.plan)}</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
              <p className="text-xs text-white/50">HWID</p>
              <p className="mt-1 text-sm font-semibold text-white">{user.hwid ? 'Set' : 'Not set'}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function AccountTab({ user }: { user: DemoUser }) {
  const { update } = useAuth();
  const toast = useToast();
  const [security, setSecurity] = useState<'PASSWORD' | 'HWID'>('PASSWORD');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [pwBusy, setPwBusy] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwDone, setPwDone] = useState(false);
  const [hwidBusy, setHwidBusy] = useState(false);
  const [linking, setLinking] = useState(false);

  const daysUntilReset = user.hwidResetAt
    ? Math.max(0, HWID_COOLDOWN_DAYS - Math.floor((Date.now() - Date.parse(user.hwidResetAt)) / 864e5))
    : 0;

  const changePassword = async () => {
    setPwError('');
    setPwDone(false);
    if (pw.length < 6) return setPwError('Password must be at least 6 characters');
    if (pw !== pw2) return setPwError('Passwords do not match');
    setPwBusy(true);
    await fakeDelay();
    setPwBusy(false);
    setPw('');
    setPw2('');
    setPwDone(true);
  };

  const resetHwid = async () => {
    setHwidBusy(true);
    await fakeDelay();
    setHwidBusy(false);
    update({ hwid: null, hwidResetAt: new Date().toISOString() });
    toast('HWID reset. It will be set again after your next launch.');
  };

  const toggleDiscord = async () => {
    setLinking(true);
    await fakeDelay(700);
    setLinking(false);
    update({ discordLinked: !user.discordLinked });
    toast(user.discordLinked ? 'Discord account unlinked (demo).' : 'Discord account linked (demo).');
  };

  const profile: [string, string][] = [
    ['Username', user.username],
    ['User ID', `user_${user.username.toLowerCase().slice(0, 6)}`],
    ['UID', `#${String(user.userNumber).padStart(4, '0')}`],
    ['Email', user.emailVerified ? 'Verified' : 'Not verified'],
    ['Member since', formatDate(user.createdAt.slice(0, 10))],
  ];

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="p-6">
        <h2 className="mb-5 text-xl font-bold text-white">Profile</h2>
        <div className="space-y-2.5">
          {profile.map(([k, v]) => (
            <Row key={k} label={k} value={v} />
          ))}
          <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] p-3.5">
            <div>
              <p className="text-sm text-white/40">Discord</p>
              <p className="mt-1 text-xs text-white/35">{user.discordLinked ? 'Linked' : 'Not linked'}</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-full border-white/[0.08]" onClick={toggleDiscord} disabled={linking}>
              {linking ? '...' : user.discordLinked ? 'Unlink' : 'Link'}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="self-start p-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Security</h2>
            <p className="mt-1 text-sm text-white/42">Manage your password and hardware binding.</p>
          </div>
          <div className="flex w-fit rounded-xl border border-white/[0.075] bg-white/[0.035] p-1">
            {(['PASSWORD', 'HWID'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSecurity(t)}
                className={`h-8 rounded-lg px-4 text-xs font-medium transition-colors ${security === t ? 'bg-white text-black' : 'text-white/45 hover:text-white/70'}`}
              >
                {t === 'PASSWORD' ? 'Password' : 'HWID'}
              </button>
            ))}
          </div>
        </div>

        {security === 'PASSWORD' ? (
          <div className="space-y-4">
            <Input type="password" placeholder="New password" icon={<Lock className="h-4 w-4" />} value={pw} onChange={(e) => setPw(e.target.value)} disabled={pwBusy} className={FIELD_CLASS} autoComplete="new-password" />
            <Input type="password" placeholder="Confirm password" icon={<Lock className="h-4 w-4" />} value={pw2} onChange={(e) => setPw2(e.target.value)} disabled={pwBusy} className={FIELD_CLASS} autoComplete="new-password" />
            {pwError && <p className="text-sm text-red-300">{pwError}</p>}
            {pwDone && <p className="text-sm text-green-300">Password changed successfully.</p>}
            <Button className="h-11 rounded-xl" onClick={changePassword} disabled={pwBusy}>
              {pwBusy ? 'Updating...' : 'Update password'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/35">Hardware ID</p>
              <div className="truncate rounded-xl border border-white/[0.06] bg-black/30 px-4 py-3 text-xs font-medium text-white/55">
                {user.hwid ?? 'Not set'}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="outline" className="h-11 rounded-xl border-white/[0.08]" onClick={resetHwid} disabled={hwidBusy || !user.hwid || daysUntilReset > 0}>
                <RefreshCw className={`mr-2 h-4 w-4 ${hwidBusy ? 'animate-spin' : ''}`} />
                {hwidBusy ? 'Resetting...' : 'Reset HWID'}
              </Button>
              {!user.hwid && daysUntilReset === 0 && (
                <>
                  <p className="text-xs text-white/35">Your HWID will be set after first launch.</p>
                  <button
                    type="button"
                    onClick={() => update({ hwid: crypto.randomUUID?.() ?? 'a3f1c9e2-7b4d-4e8a-9c21-5d6f0b8e4a17' })}
                    className="text-xs font-medium text-echo-primary underline-offset-2 hover:underline"
                  >
                    Simulate first launch
                  </button>
                </>
              )}
              {daysUntilReset > 0 && <p className="text-xs text-white/35">Next reset available in {daysUntilReset} days.</p>}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export function Dashboard() {
  const { user, signOut, update } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>(tabFromPath);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);

  useEffect(() => {
    if (!user) navigate('/auth', { replace: true });
  }, [user]);

  useEffect(() => {
    const onPop = () => setTab(tabFromPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  if (!user) return null;

  const switchTab = (t: Tab) => {
    setTab(t);
    window.history.replaceState({}, '', withBase(t === 'ACCOUNT' ? '/dashboard/account' : '/dashboard/download'));
  };

  const memberLabel =
    user.plan === 'lifetime' ? 'Lifetime Member' : user.plan === 'quarterly' ? '3 Month Member' : user.plan ? 'Premium Member' : 'Free Plan';

  return (
    <div className="min-h-screen bg-echo-bg px-4 pb-8 pt-[calc(6rem+var(--banner-h,0px))] sm:px-6 lg:px-8">
      <RedeemKeyModal isOpen={redeemOpen} onClose={() => setRedeemOpen(false)} onRedeemed={() => update({ plan: 'lifetime' })} />
      <UpgradeModal isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} currentPlan={user.plan} />
      <VerifyEmailModal
        isOpen={verifyOpen}
        onClose={() => setVerifyOpen(false)}
        initialEmail={user.email}
        onVerified={(email) => {
          update({ email, emailVerified: true });
          toast('Email verified.');
        }}
      />

      <div className="mx-auto flex max-w-6xl flex-col">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-white">Dashboard</h1>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-echo-primary text-xs font-bold text-black">
                {user.username.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{user.username}</p>
                <p className="text-xs text-white/40">{memberLabel}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {!user.plan && (
              <Button variant="outline" size="sm" onClick={() => setRedeemOpen(true)} className="rounded-full border-white/[0.08] text-white/70 hover:text-white">
                <Key className="mr-2 h-3 w-3" />
                Redeem Key
              </Button>
            )}
            {user.plan !== 'lifetime' && (
              <Button size="sm" onClick={() => setUpgradeOpen(true)} className="rounded-full">
                <CreditCard className="mr-2 h-3 w-3" />
                Buy Now
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                signOut();
                navigate('/');
              }}
              className="rounded-full text-white/55 hover:text-white"
            >
              <LogOut className="mr-2 h-3 w-3" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-white/[0.075] bg-[#181818] p-1">
          <TabButton active={tab === 'DOWNLOAD'} onClick={() => switchTab('DOWNLOAD')}>
            Download
          </TabButton>
          <TabButton active={tab === 'ACCOUNT'} onClick={() => switchTab('ACCOUNT')}>
            Account
          </TabButton>
        </div>

        {tab === 'DOWNLOAD' ? (
          <DownloadTab user={user} onVerify={() => setVerifyOpen(true)} onGetAccess={() => setUpgradeOpen(true)} />
        ) : (
          <AccountTab user={user} />
        )}
      </div>
    </div>
  );
}
