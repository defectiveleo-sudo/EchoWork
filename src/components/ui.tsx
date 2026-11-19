import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-white text-black hover:bg-gray-200',
  secondary: 'bg-white/5 text-echo-white border border-white/5 hover:bg-white/10 hover:border-white/10',
  outline: 'bg-transparent border border-echo-border text-echo-text hover:border-echo-white hover:text-echo-white',
  ghost: 'bg-transparent border-transparent text-echo-text hover:text-echo-primary hover:bg-white/5',
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-4 text-xs',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-8 text-base',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-2xl font-sans font-medium transition-all focus:outline-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    />
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
}

export const FIELD_CLASS =
  'h-12 border-white/[0.08] bg-white/[0.045] text-white placeholder:text-white/30 focus:border-white/20 focus:ring-0';

export function Input({ label, icon, className = '', ...props }: InputProps) {
  return (
    <div className="w-full space-y-2">
      {label && <label className="text-xs font-medium uppercase tracking-wide text-echo-muted">{label}</label>}
      <div className="group relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-echo-muted group-focus-within:text-echo-primary">
            {icon}
          </div>
        )}
        <input
          className={`w-full rounded-xl border border-white/5 bg-white/[0.03] py-3 pr-4 font-sans text-sm text-echo-white placeholder-echo-muted/50 focus:border-echo-primary/50 focus:outline-none focus:ring-1 focus:ring-echo-primary/50 ${icon ? 'pl-11' : 'px-4'} ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}

export function Logo({ size = 'md', onClick }: { size?: 'md' | 'lg' | 'xl'; onClick?: () => void }) {
  const text = { md: 'text-lg tracking-tight', lg: 'text-2xl tracking-tighter', xl: 'text-3xl tracking-tighter' }[size];
  const gap = size === 'md' ? 'gap-2' : 'gap-3';
  const content = (
    <>
      <img src={`${import.meta.env.BASE_URL}logo_white.svg`} alt="" className="h-8 w-8 object-contain" />
      <span className={`font-sans font-bold text-white ${text}`}>echo</span>
    </>
  );
  return onClick ? (
    <button type="button" onClick={onClick} className={`inline-flex items-center ${gap}`} aria-label="echo home">
      {content}
    </button>
  ) : (
    <div className={`inline-flex items-center ${gap}`}>{content}</div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-2xl border border-white/[0.075] bg-[#181818] shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] ${className}`}
    >
      {children}
    </section>
  );
}

export function Alert({ tone, children }: { tone: 'error' | 'info' | 'success'; children: ReactNode }) {
  const cls = {
    error: 'border-red-500/20 bg-red-500/10 text-red-300',
    info: 'border-echo-primary/25 bg-echo-primary/10 text-echo-primary',
    success: 'border-green-500/20 bg-green-500/10 text-green-300',
  }[tone];
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`rounded-xl border p-3 text-sm ${cls}`}>
      {children}
    </div>
  );
}
