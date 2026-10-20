import { animate, useMotionValue } from 'motion/react';
import { useEffect, useRef, type PointerEvent } from 'react';

const AWAY = Number.POSITIVE_INFINITY;

interface Grid {
  first: number;
  pitch: number;
}

interface Options {
  follow: boolean;
  magnify: boolean;
}

// offsetLeft ignores transforms, so lifted tiles never skew the measurement
function measure(region: HTMLElement): Grid | null {
  const tiles = region.querySelectorAll<HTMLElement>('[data-tile]');
  const head = tiles[0];
  const tail = tiles[tiles.length - 1];
  if (!head || !tail || head === tail) return null;
  const first = head.offsetLeft + head.offsetWidth / 2;
  const last = tail.offsetLeft + tail.offsetWidth / 2;
  return { first, pitch: (last - first) / (tiles.length - 1) };
}

export function useStripPointer({ follow, magnify }: Options) {
  const position = useMotionValue(AWAY);
  const labelX = useMotionValue(0);
  const labelY = useMotionValue(0);
  const labelOpacity = useMotionValue(0);
  const grid = useRef<Grid | null>(null);
  const latest = useRef({ x: 0, y: 0 });
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  useEffect(() => {
    if (!magnify) position.set(AWAY);
    if (!follow) labelOpacity.set(0);
  }, [follow, magnify, position, labelOpacity]);

  const flush = () => {
    frame.current = 0;
    const { x, y } = latest.current;
    labelX.set(x);
    labelY.set(y);
    if (magnify && grid.current) position.set((x - grid.current.first) / grid.current.pitch);
  };

  const track = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    latest.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!follow || event.pointerType !== 'mouse') return;
    grid.current ??= measure(event.currentTarget);
    track(event);
    frame.current ||= requestAnimationFrame(flush);
  };

  const onPointerEnter = (event: PointerEvent<HTMLElement>) => {
    if (!follow || event.pointerType !== 'mouse') return;
    grid.current = measure(event.currentTarget);
    track(event);
    flush();
    void animate(labelOpacity, 1, { duration: 0.15 });
  };

  const onPointerLeave = () => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    grid.current = null;
    position.set(AWAY);
    void animate(labelOpacity, 0, { duration: 0.15 });
  };

  return {
    position,
    label: { x: labelX, y: labelY, opacity: labelOpacity },
    handlers: { onPointerMove, onPointerEnter, onPointerLeave },
  };
}
