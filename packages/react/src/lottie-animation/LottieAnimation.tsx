/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * LottieAnimation — Lottie animasyon oynatici bilesen (Dual API).
 * LottieAnimation — Lottie animation player component (Dual API).
 *
 * Props-based: `<LottieAnimation data={lottieData} autoPlay />`
 * Compound:
 * ```tsx
 * <LottieAnimation data={lottieData}>
 *   <LottieAnimation.Canvas />
 *   <LottieAnimation.Controls />
 * </LottieAnimation>
 * ```
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { LottieData } from '@relteco/relui-core';
import {
  rootStyle,
  canvasStyle,
  controlsStyle,
  controlButtonStyle,
  progressStyle,
  progressBarStyle,
} from './lottie-animation.css';
import { useLottieAnimation } from './useLottieAnimation';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type LottieAnimationSlot = 'root' | 'canvas' | 'controls';

interface LottieAnimationContextValue {
  playing: boolean;
  currentFrame: number;
  totalFrames: number;
  speed: number;
  loop: boolean;
  data: LottieData | null;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setFrame: (frame: number) => void;
  toggleLoop: () => void;
  classNames: ClassNames<LottieAnimationSlot> | undefined;
  styles: Styles<LottieAnimationSlot> | undefined;
}

const LottieAnimationContext = createContext<LottieAnimationContextValue | null>(null);

function useLottieAnimationContext(): LottieAnimationContextValue {
  const ctx = useContext(LottieAnimationContext);
  if (!ctx) throw new Error('LottieAnimation compound sub-components must be used within <LottieAnimation>.');
  return ctx;
}

// ── Compound: Canvas ────────────────────────────────

export interface LottieAnimationCanvasProps { className?: string; }

const LottieAnimationCanvas = forwardRef<HTMLCanvasElement, LottieAnimationCanvasProps>(
  function LottieAnimationCanvas(props, ref) {
    const { className } = props;
    const ctx = useLottieAnimationContext();
    const slot = getSlotProps('canvas', canvasStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const w = ctx.data?.width ?? 200;
    const h = ctx.data?.height ?? 200;

    return (
      <canvas
        ref={ref}
        className={cls}
        style={slot.style}
        width={w}
        height={h}
        data-testid="lottie-animation-canvas"
        aria-label="Animation canvas"
      />
    );
  },
);

// ── Compound: Controls ──────────────────────────────

export interface LottieAnimationControlsProps { className?: string; }

const LottieAnimationControls = forwardRef<HTMLDivElement, LottieAnimationControlsProps>(
  function LottieAnimationControls(props, ref) {
    const { className } = props;
    const ctx = useLottieAnimationContext();
    const slot = getSlotProps('controls', controlsStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const pct = ctx.totalFrames > 0 ? (ctx.currentFrame / (ctx.totalFrames - 1)) * 100 : 0;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="lottie-animation-controls">
        <button type="button" className={controlButtonStyle} onClick={() => ctx.playing ? ctx.pause() : ctx.play()} aria-label={ctx.playing ? 'Pause' : 'Play'} data-testid="lottie-animation-btn-play">
          {ctx.playing ? '\u23F8' : '\u25B6'}
        </button>
        <button type="button" className={controlButtonStyle} onClick={() => ctx.stop()} aria-label="Stop" data-testid="lottie-animation-btn-stop">{'\u23F9'}</button>
        <div className={progressStyle} data-testid="lottie-animation-progress">
          <div className={progressBarStyle} style={{ width: `${pct}%` }} data-testid="lottie-animation-progress-bar" />
        </div>
        <button type="button" className={controlButtonStyle} onClick={() => ctx.toggleLoop()} data-active={ctx.loop} aria-label="Toggle loop" data-testid="lottie-animation-btn-loop">
          {'\u21BB'}
        </button>
        <span data-testid="lottie-animation-frame-info">{ctx.currentFrame}/{ctx.totalFrames}</span>
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface LottieAnimationComponentProps extends SlotStyleProps<LottieAnimationSlot> {
  data?: LottieData;
  autoPlay?: boolean;
  speed?: number;
  loop?: boolean;
  onFrameChange?: (frame: number) => void;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const LottieAnimationBase = forwardRef<HTMLDivElement, LottieAnimationComponentProps>(
  function LottieAnimation(props, ref) {
    const { data, speed, loop: loopProp, onFrameChange, children, className, style: styleProp, classNames, styles } = props;

    const anim = useLottieAnimation({
      defaultData: data ?? undefined,
      defaultSpeed: speed,
      defaultLoop: loopProp,
      onFrameChange,
    });

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: LottieAnimationContextValue = {
      playing: anim.playing, currentFrame: anim.currentFrame, totalFrames: anim.totalFrames,
      speed: anim.speed, loop: anim.loop, data: anim.data,
      play: anim.play, pause: anim.pause, stop: anim.stop,
      setFrame: anim.setFrame, toggleLoop: anim.toggleLoop,
      classNames, styles,
    };

    if (children) {
      return (
        <LottieAnimationContext.Provider value={ctxValue}>
          <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="lottie-animation-root" role="application" aria-label="Lottie animation">
            {children}
          </div>
        </LottieAnimationContext.Provider>
      );
    }

    const canvasSlot = getSlotProps('canvas', canvasStyle, classNames, styles);
    const controlsSlot = getSlotProps('controls', controlsStyle, classNames, styles);
    const w = anim.data?.width ?? 200;
    const h = anim.data?.height ?? 200;
    const pct = anim.totalFrames > 0 ? (anim.currentFrame / (anim.totalFrames - 1)) * 100 : 0;

    return (
      <LottieAnimationContext.Provider value={ctxValue}>
        <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="lottie-animation-root" role="application" aria-label="Lottie animation">
          <canvas className={canvasSlot.className} style={canvasSlot.style} width={w} height={h} data-testid="lottie-animation-canvas" aria-label="Animation canvas" />
          <div className={controlsSlot.className} style={controlsSlot.style} data-testid="lottie-animation-controls">
            <button type="button" className={controlButtonStyle} onClick={() => anim.playing ? anim.pause() : anim.play()} aria-label={anim.playing ? 'Pause' : 'Play'} data-testid="lottie-animation-btn-play">
              {anim.playing ? '\u23F8' : '\u25B6'}
            </button>
            <button type="button" className={controlButtonStyle} onClick={() => anim.stop()} aria-label="Stop" data-testid="lottie-animation-btn-stop">{'\u23F9'}</button>
            <div className={progressStyle} data-testid="lottie-animation-progress">
              <div className={progressBarStyle} style={{ width: `${pct}%` }} data-testid="lottie-animation-progress-bar" />
            </div>
            <button type="button" className={controlButtonStyle} onClick={() => anim.toggleLoop()} aria-label="Toggle loop" data-testid="lottie-animation-btn-loop">{'\u21BB'}</button>
            <span data-testid="lottie-animation-frame-info">{anim.currentFrame}/{anim.totalFrames}</span>
          </div>
        </div>
      </LottieAnimationContext.Provider>
    );
  },
);

export const LottieAnimation = Object.assign(LottieAnimationBase, {
  Canvas: LottieAnimationCanvas,
  Controls: LottieAnimationControls,
});
