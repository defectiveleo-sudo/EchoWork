import type { ReactNode } from 'react';
import { Package } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { RELEASES, formatDate } from '../lib/content';

/** Renders "*italic*" segments inside a string. */
function italics(text: string): ReactNode[] {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') && part.endsWith('*') ? <em key={i}>{part.slice(1, -1)}</em> : part,
  );
}

/** "Module: description" → bold module name; plain items stay plain. */
function ChangeItem({ text, emphasize }: { text: string; emphasize: boolean }) {
  const idx = text.indexOf(': ');
  if (idx > 0 && idx < 32) {
    return (
      <>
        <strong className="font-semibold text-white">{text.slice(0, idx)}</strong>: {italics(text.slice(idx + 2))}
      </>
    );
  }
  return emphasize ? <strong className="font-semibold text-white">{text}</strong> : <>{italics(text)}</>;
}

export function Changelog() {
  return (
    <div className="min-h-screen bg-echo-bg px-4 pb-24 pt-[calc(7rem+var(--banner-h,0px))] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h1 className="mb-4 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text pb-1 text-4xl font-black tracking-tighter text-transparent md:text-5xl">
            What's new
          </h1>
          <p className="mb-14 text-base text-white/50 md:text-lg">Consistent content updates for Echo Client.</p>
        </Reveal>

        <div className="space-y-8">
          {RELEASES.map((r) => (
            <Reveal key={r.version}>
              <article className="flex flex-col gap-3 md:flex-row md:gap-5">
                <div className="flex shrink-0 items-baseline gap-3 md:block md:w-36 md:pt-3 md:text-right">
                  <p className="text-sm font-semibold text-white">{formatDate(r.date)}</p>
                  <p className="text-xs font-semibold text-echo-primary md:mt-1">{r.version}</p>
                </div>
                <div className="min-w-0 flex-1 rounded-2xl border border-white/[0.075] bg-[#181818] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04]">
                      <Package className="h-4 w-4 text-echo-primary" />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold tracking-tight text-white">Released version {r.version}</h2>
                      <p className="text-sm text-white/40">{formatDate(r.date)}</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {r.sections.map((s) => {
                      const single = s.items.length === 1 && s.title === 'Fixed';
                      return (
                        <div key={s.title}>
                          <h3 className="mb-3 text-base font-bold text-white">{s.title}</h3>
                          {single ? (
                            <p className="text-sm text-white/60">{s.items[0]}</p>
                          ) : (
                            <ul className="space-y-3">
                              {s.items.map((item) => (
                                <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/60">
                                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/40" />
                                  <span>
                                    <ChangeItem text={item} emphasize={s.items.length === 1} />
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
