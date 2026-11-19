import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const KEY = 'echo_demo_banner_dismissed';
const HEIGHT = '36px';

/** Thin top banner that makes the demo nature explicit. Uses the --banner-h variable the navbar offsets by. */
export function DemoBanner() {
  const [visible, setVisible] = useState(() => sessionStorage.getItem(KEY) !== '1');

  useEffect(() => {
    document.documentElement.style.setProperty('--banner-h', visible ? HEIGHT : '0px');
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-2 border-b border-white/[0.06] bg-[#0F1011]/95 px-10 text-center text-xs text-white/55 backdrop-blur"
      style={{ height: HEIGHT }}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-echo-primary" />
      <span className="truncate">
        Demo clone — every plan is <span className="font-semibold text-white">$0.00</span> and no payments are processed.
      </span>
      <button
        type="button"
        onClick={() => {
          sessionStorage.setItem(KEY, '1');
          setVisible(false);
        }}
        className="absolute right-3 rounded-full p-1 text-white/35 transition-colors hover:bg-white/[0.06] hover:text-white"
        aria-label="Dismiss demo notice"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
