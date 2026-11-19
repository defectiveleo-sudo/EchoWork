import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Tailwind max-width class */
  width?: string;
  labelledBy?: string;
}

/** Shared modal shell: dimmed blurred backdrop, Escape / backdrop click to close, scroll lock. */
export function Modal({ isOpen, onClose, children, width = 'max-w-md', labelledBy }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex animate-fade-in items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`max-h-[90vh] w-full ${width} animate-modal-in overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#181818] shadow-[0_24px_80px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.04)]`}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalClose({ onClick, label = 'Close' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full p-1 text-white/35 transition-colors hover:bg-white/[0.06] hover:text-white"
      aria-label={label}
    >
      <X className="h-5 w-5" />
    </button>
  );
}
