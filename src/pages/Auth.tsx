import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, KeyRound, Lock, Mail, User } from 'lucide-react';
import { Alert, Button, FIELD_CLASS, Input, Logo } from '../components/ui';
import { navigate, withBase } from '../lib/router';
import { fakeDelay, useAuth } from '../lib/auth';
import { useToast } from '../components/Toast';

type Mode = 'login' | 'register';
type ResetStep = 'details' | 'code' | 'done';

/**
 * Demo authentication. Credentials never leave the browser and passwords are not stored:
 * signing in simply creates a local demo profile.
 */
export function Auth({ search }: { search: string }) {
  const { user, signIn } = useAuth();
  const toast = useToast();
  const [mode, setMode] = useState<Mode>(() =>
    new URLSearchParams(search).get('mode') === 'register' ? 'register' : 'login',
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [accept, setAccept] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [resetting, setResetting] = useState(false);
  const [resetStep, setResetStep] = useState<ResetStep>('details');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    setMode(new URLSearchParams(search).get('mode') === 'register' ? 'register' : 'login');
  }, [search]);

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user]);

  const isLogin = mode === 'login';

  const switchMode = (m: Mode) => {
    setError('');
    navigate('/auth', { search: m === 'register' ? '?mode=register' : '', replace: true });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) return setError('Username and password are required');
    if (!isLogin) {
      if (!email.trim()) return setError('An email address is required');
      if (password.length < 6) return setError('Password must be at least 6 characters');
      if (!accept) return setError('Please accept the Terms of Service');
    }
    setBusy(true);
    await fakeDelay(700);
    signIn(username.trim(), email.trim());
  };

  const requestReset = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !email.trim()) return setError('Username and email are required');
    setBusy(true);
    await fakeDelay();
    setBusy(false);
    setResetStep('code');
  };

  const completeReset = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(resetCode)) return setError('Enter the 6-digit code');
    if (newPassword.length < 6) return setError('Password must be at least 6 characters');
    setBusy(true);
    await fakeDelay();
    setBusy(false);
    setResetStep('done');
  };

  const exitReset = () => {
    setResetting(false);
    setResetStep('details');
    setResetCode('');
    setNewPassword('');
    setError('');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-echo-bg px-4 py-28">
      <div className="relative z-10 mx-auto w-full max-w-[29rem]">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-sm font-medium text-white/40 transition-colors hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </button>

        <div className="overflow-hidden rounded-2xl border border-white/[0.075] bg-[#181818] shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
          <div className="p-7 md:p-9">
            {resetting ? (
              <>
                <div className="mb-7">
                  <Logo size="lg" />
                </div>
                <h1 className="mb-6 text-3xl font-bold tracking-tight text-white">Reset password</h1>

                {resetStep === 'details' && (
                  <form onSubmit={requestReset} className="space-y-4">
                    {error && <Alert tone="error">{error}</Alert>}
                    <p className="text-sm leading-relaxed text-white/55">
                      Enter your username and the email on your account. We'll send you a 6-digit code.
                    </p>
                    <Input placeholder="Username" icon={<User className="h-4 w-4" />} value={username} onChange={(e) => setUsername(e.target.value)} disabled={busy} className={FIELD_CLASS} autoComplete="username" />
                    <Input type="email" placeholder="Email address" icon={<Mail className="h-4 w-4" />} value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} className={FIELD_CLASS} autoComplete="email" />
                    <Button type="submit" className="h-12 w-full rounded-xl text-base font-semibold" disabled={busy}>
                      {busy ? 'Sending...' : 'Send reset code'}
                    </Button>
                    <p className="text-center text-sm text-white/45">
                      No longer have access to your email?{' '}
                      <button type="button" onClick={() => toast('Support links are disabled in this demo.')} className="font-medium text-white/75 hover:text-white">
                        Open a ticket in our Discord
                      </button>
                    </p>
                  </form>
                )}

                {resetStep === 'code' && (
                  <form onSubmit={completeReset} className="space-y-4">
                    {error && <Alert tone="error">{error}</Alert>}
                    <p className="text-sm leading-relaxed text-white/55">
                      Demo: no email is actually sent. Enter any 6 digits and a new password.
                    </p>
                    <Input inputMode="numeric" maxLength={6} placeholder="6-digit code" icon={<KeyRound className="h-4 w-4" />} value={resetCode} onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))} disabled={busy} className={FIELD_CLASS} />
                    <Input type="password" placeholder="New password" icon={<Lock className="h-4 w-4" />} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={busy} className={FIELD_CLASS} autoComplete="new-password" />
                    <Button type="submit" className="h-12 w-full rounded-xl text-base font-semibold" disabled={busy}>
                      {busy ? 'Resetting...' : 'Reset password'}
                    </Button>
                    <button type="button" onClick={() => setResetStep('details')} className="w-full text-center text-sm font-medium text-white/45 transition-colors hover:text-white">
                      Didn't get the code? Go back
                    </button>
                  </form>
                )}

                {resetStep === 'done' && (
                  <div className="space-y-4">
                    <Alert tone="success">Your password has been reset (demo).</Alert>
                    <p className="text-sm leading-relaxed text-white/55">You can now sign in with your new password.</p>
                  </div>
                )}

                <button type="button" onClick={exitReset} className="mt-6 flex items-center text-sm font-medium text-white/45 transition-colors hover:text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to sign in
                </button>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <div className="mb-7">
                    <Logo size="lg" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-white">
                    {isLogin ? 'Welcome back' : 'Create your account'}
                  </h1>
                </div>

                <form onSubmit={submit} className="space-y-4" noValidate>
                  {error && <Alert tone="error">{error}</Alert>}
                  <Input placeholder="Username" icon={<User className="h-4 w-4" />} value={username} onChange={(e) => setUsername(e.target.value)} disabled={busy} className={FIELD_CLASS} autoComplete="username" />
                  {!isLogin && (
                    <Input type="email" placeholder="Email address" icon={<Mail className="h-4 w-4" />} value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} className={FIELD_CLASS} autoComplete="email" />
                  )}
                  <Input type="password" placeholder="Password" icon={<Lock className="h-4 w-4" />} value={password} onChange={(e) => setPassword(e.target.value)} disabled={busy} className={FIELD_CLASS} autoComplete={isLogin ? 'current-password' : 'new-password'} />

                  {isLogin ? (
                    <div className="flex justify-end">
                      <button type="button" onClick={() => { setError(''); setResetting(true); }} className="text-sm font-medium text-white/45 transition-colors hover:text-white">
                        Forgot password?
                      </button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer items-start gap-3 text-sm text-white/55">
                      <input
                        type="checkbox"
                        checked={accept}
                        onChange={(e) => setAccept(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/5 accent-white"
                      />
                      <span>
                        I agree to the{' '}
                        <a href={withBase('/terms')} onClick={(e) => { e.preventDefault(); navigate('/terms'); }} className="font-medium text-white/80 hover:text-white">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href={withBase('/privacy')} onClick={(e) => { e.preventDefault(); navigate('/privacy'); }} className="font-medium text-white/80 hover:text-white">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  )}

                  <Button type="submit" className="h-12 w-full rounded-xl text-base font-semibold" disabled={busy}>
                    {busy ? (isLogin ? 'Signing in...' : 'Creating account...') : isLogin ? 'Sign in' : 'Create account'}
                  </Button>
                </form>

                <div className="mt-7 border-t border-white/[0.07] pt-7 text-center text-sm text-white/45">
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <button type="button" onClick={() => switchMode(isLogin ? 'register' : 'login')} className="font-semibold text-white transition-colors hover:text-echo-primary">
                    {isLogin ? 'Create one' : 'Sign in'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
