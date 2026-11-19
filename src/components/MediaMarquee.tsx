import type { CSSProperties } from 'react';

/**
 * Infinite gameplay-clip marquee. The original streams video clips; this demo draws lightweight
 * CSS "voxel scenes" in their place so no third-party media is copied and nothing heavy loads.
 */
interface Scene {
  sky: string;
  ground: string;
  groundDark: string;
  horizon: number; // % from top
  blocks: { x: number; w: number; h: number; c: string }[];
  item: string;
}

const SCENES: Scene[] = [
  { sky: 'linear-gradient(#7fb2ff,#cfe3ff)', ground: '#e3d6a4', groundDark: '#cdbd86', horizon: 55, blocks: [{ x: 8, w: 22, h: 30, c: '#b9a27a' }, { x: 62, w: 30, h: 38, c: '#a88e66' }], item: '#5ad1e6' },
  { sky: 'linear-gradient(#8fc0ff,#e8f1ff)', ground: '#6fae4a', groundDark: '#5a9339', horizon: 60, blocks: [{ x: 20, w: 60, h: 22, c: '#c9c9c9' }, { x: 30, w: 10, h: 34, c: '#a83a3a' }], item: '#8b5a2b' },
  { sky: 'linear-gradient(#12121a,#2a2236)', ground: '#3b2b2b', groundDark: '#2b1f1f', horizon: 58, blocks: [{ x: 45, w: 12, h: 28, c: '#5b3fa0' }], item: '#5ad1e6' },
  { sky: 'linear-gradient(#ff9a6b,#ffd9a0)', ground: '#7aa957', groundDark: '#5f8d40', horizon: 62, blocks: [{ x: 5, w: 18, h: 40, c: '#6b4a2b' }, { x: 70, w: 18, h: 26, c: '#6b4a2b' }], item: '#c0c0c0' },
  { sky: 'linear-gradient(#5a0f0f,#a3322a)', ground: '#6e2323', groundDark: '#561a1a', horizon: 57, blocks: [{ x: 25, w: 15, h: 30, c: '#2b1010' }, { x: 60, w: 25, h: 18, c: '#e0a030' }], item: '#5ad1e6' },
  { sky: 'linear-gradient(#a7d0ff,#f2f8ff)', ground: '#f4f6fb', groundDark: '#dfe4ee', horizon: 60, blocks: [{ x: 40, w: 22, h: 32, c: '#4f6f8f' }], item: '#9b9b9b' },
  { sky: 'linear-gradient(#6aa4f5,#bcd8ff)', ground: '#8a8a8a', groundDark: '#747474', horizon: 52, blocks: [{ x: 10, w: 80, h: 16, c: '#a0a0a0' }, { x: 48, w: 8, h: 30, c: '#2f6fd1' }], item: '#5ad1e6' },
  { sky: 'linear-gradient(#0c1424,#1d2b45)', ground: '#2d4a2a', groundDark: '#22381f', horizon: 60, blocks: [{ x: 58, w: 14, h: 24, c: '#ffd76a' }], item: '#c0c0c0' },
];

function Tile({ scene }: { scene: Scene }) {
  const ground: CSSProperties = {
    top: `${scene.horizon}%`,
    backgroundColor: scene.ground,
    backgroundImage: `linear-gradient(90deg, ${scene.groundDark} 1px, transparent 1px), linear-gradient(${scene.groundDark} 1px, transparent 1px)`,
    backgroundSize: '28px 14px',
  };
  return (
    <div
      className="relative h-56 w-[24rem] shrink-0 overflow-hidden rounded-lg border border-white/10 opacity-90 md:h-72 md:w-[32rem]"
      style={{ background: scene.sky }}
      aria-hidden="true"
    >
      {scene.blocks.map((b, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${b.x}%`,
            width: `${b.w}%`,
            height: `${b.h}%`,
            bottom: `${100 - scene.horizon}%`,
            background: b.c,
            boxShadow: 'inset -10px -10px 0 rgba(0,0,0,0.18)',
          }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0" style={ground} />
      {/* held item */}
      <div
        className="absolute -bottom-6 right-10 h-40 w-10 rotate-[35deg] rounded-sm md:h-52"
        style={{ background: `linear-gradient(${scene.item}, ${scene.item} 70%, #6b4a2b 70%)`, boxShadow: 'inset -6px 0 0 rgba(0,0,0,0.25)' }}
      />
      {/* crosshair */}
      <div className="absolute left-1/2 top-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-white/80" />
      <div className="absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 bg-white/80" />
      {/* hotbar */}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-px rounded-sm bg-black/50 p-px">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className={`h-4 w-4 border ${i === 0 ? 'border-white' : 'border-white/20'} bg-black/30`} />
        ))}
      </div>
    </div>
  );
}

export function MediaMarquee() {
  const tiles = [...SCENES, ...SCENES];
  return (
    <section className="relative -mt-1 overflow-hidden pb-16" aria-label="Gameplay preview">
      <div className="media-marquee flex w-max animate-marquee gap-4 hover:[animation-play-state:paused] motion-reduce:animate-none">
        {tiles.map((s, i) => (
          <Tile key={i} scene={s} />
        ))}
      </div>
    </section>
  );
}
