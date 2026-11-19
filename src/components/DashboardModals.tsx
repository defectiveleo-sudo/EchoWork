import { useEffect, useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, KeyRound, Loader2, Mail } from 'lucide-react';
import { Modal, ModalClose } from './Modal';
import { Button, FIELD_CLASS, Input } from './ui';
import { fakeDelay } from '../lib/auth';

const KEY_PATTERN = /^ECHO(-[A-Z0-9]{4}){4}$/;

/** Uppercases input and keeps only key characters. */
const formatKey = (raw: string) => raw.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 24);

export function RedeemKeyModal({
  isOpen,
  onClose,
  onRedeemed,
}: {
  isOpen: boolean;
  onClose: () => void;
  onRedeemed: () => void;
}) {
  const [key, setKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKey('');
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!KEY_PATTERN.test(key)) return setError('Enter a key in the format ECHO-XXXX-XXXX-XXXX-XXXX');
    setBusy(true);
    await fakeDelay();
    setBusy(false);
    setSuccess(true);
    onRedeemed();
    window.setTimeout(onClose, 1400);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} labelledBy="redeem-title">
      <div className="flex items-start justify-between border-b border-white/[0.06] p-6">
        <div>
          <h2 id="redeem-title" className="text-lg font-bold tracking-tight text-white">
            Redeem license key
          </h2>
          <p className="mt-1 text-sm text-white/42">Activate your plan with a license key.</p>
        </div>
        <ModalClose onClick={onClose} />
      </div>
      <div className="p-6">
        {error && (
          <div className="mb-4 flex items-center rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
            <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 flex items-center rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-300">
            <CheckCircle2 className="mr-2 h-4 w-4 flex-shrink-0" />
            Key redeemed. Demo lifetime access activated.
          </div>
        )}
        <form onSubmit={submit} className="space-y-5">
          <Input
            placeholder="ECHO-XXXX-XXXX-XXXX-XXXX"
            icon={<KeyRound className="h-4 w-4" />}
            value={key}
            onChange={(e) => setKey(formatKey(e.target.value))}
            disabled={busy || success}
            className="h-12 border-white/[0.08] bg-white/[0.035] font-medium tracking-wide placeholder:tracking-normal"
            aria-label="License key"
          />
          <Button type="submit" fullWidth className="h-11 rounded-xl" disabled={busy || success || !key}>
            {busy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Redeeming...
              </>
            ) : (
              'Redeem key'
            )}
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-white/32">
          Enter a license key to unlock premium access. Any correctly formatted key works in this demo.
        </p>
      </div>
    </Modal>
  );
}

export function VerifyEmailModal({
  isOpen,
  onClose,
  initialEmail,
  onVerified,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialEmail: string;
  onVerified: (email: string) => void;
}) {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('email');
      setEmail(initialEmail);
      setCode('');
      setError('');
    }
  }, [isOpen, initialEmail]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address');
    setBusy(true);
    await fakeDelay();
    setBusy(false);
    setStep('code');
  };

  const verify = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    await fakeDelay();
    setBusy(false);
    onVerified(email);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} labelledBy="verify-title">
      <div className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="verify-title" className="text-xl font-bold tracking-tight text-white">
            Verify your email
          </h2>
          <ModalClose onClick={onClose} />
        </div>
        {error && <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
        {step === 'email' ? (
          <form onSubmit={send} className="space-y-4">
            <p className="text-sm leading-relaxed text-white/55">We'll send a 6-digit code. It takes under a minute.</p>
            <Input type="email" placeholder="Email address" icon={<Mail className="h-4 w-4" />} value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} className={FIELD_CLASS} />
            <Button type="submit" fullWidth className="h-11 rounded-xl" disabled={busy}>
              {busy ? 'Sending...' : 'Send code'}
            </Button>
          </form>
        ) : (
          <form onSubmit={verify} className="space-y-4">
            <p className="text-sm leading-relaxed text-white/55">
              Demo: no email is sent. Enter any 6 digits to verify <span className="text-white/80">{email}</span>.
            </p>
            <Input inputMode="numeric" maxLength={6} placeholder="6-digit code" icon={<KeyRound className="h-4 w-4" />} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} disabled={busy} className={FIELD_CLASS} />
            <Button type="submit" fullWidth className="h-11 rounded-xl" disabled={busy || code.length !== 6}>
              {busy ? 'Verifying...' : 'Verify email'}
            </Button>
            <button type="button" onClick={() => setStep('email')} className="w-full text-center text-sm font-medium text-white/45 transition-colors hover:text-white">
              Use a different email
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
}
