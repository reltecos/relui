/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * LottieAnimation state machine.
 *
 * @packageDocumentation
 */

import type {
  LottieData,
  LottieKeyframe,
  LottieAnimationConfig,
  LottieAnimationContext,
  LottieAnimationEvent,
  LottieAnimationAPI,
} from './lottie-animation.types';

/** Keyframe arasi lineer interpolasyon / Linear keyframe interpolation */
export function interpolateKeyframes(keyframes: readonly LottieKeyframe[], frame: number): number {
  if (keyframes.length === 0) return 0;
  if (keyframes.length === 1) return keyframes[0]?.value ?? 0;

  const first = keyframes[0];
  const last = keyframes[keyframes.length - 1];
  if (!first || !last) return 0;
  if (frame <= first.frame) return first.value;
  if (frame >= last.frame) return last.value;

  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (!a || !b) continue;
    if (frame >= a.frame && frame <= b.frame) {
      const t = b.frame === a.frame ? 0 : (frame - a.frame) / (b.frame - a.frame);
      return a.value + (b.value - a.value) * t;
    }
  }
  return last.value;
}

export function createLottieAnimation(config: LottieAnimationConfig = {}): LottieAnimationAPI {
  const { defaultData = null, defaultSpeed = 1, defaultLoop = true, onFrameChange } = config;

  let playing = false;
  let currentFrame = 0;
  let speed = Math.max(0.1, defaultSpeed);
  let loop = defaultLoop;
  let data: LottieData | null = defaultData;

  const listeners = new Set<() => void>();
  function notify(): void { listeners.forEach((fn) => fn()); }

  function getTotalFrames(): number { return data?.totalFrames ?? 0; }

  function send(event: LottieAnimationEvent): void {
    switch (event.type) {
      case 'PLAY': {
        if (playing) return;
        playing = true;
        notify();
        break;
      }
      case 'PAUSE': {
        if (!playing) return;
        playing = false;
        notify();
        break;
      }
      case 'STOP': {
        playing = false;
        currentFrame = 0;
        onFrameChange?.(0);
        notify();
        break;
      }
      case 'SET_FRAME': {
        const max = getTotalFrames();
        const f = Math.max(0, Math.min(event.frame, max > 0 ? max - 1 : 0));
        if (f === currentFrame) return;
        currentFrame = f;
        onFrameChange?.(currentFrame);
        notify();
        break;
      }
      case 'SET_SPEED': {
        const s = Math.max(0.1, Math.min(event.speed, 10));
        if (s === speed) return;
        speed = s;
        notify();
        break;
      }
      case 'TOGGLE_LOOP': {
        loop = !loop;
        notify();
        break;
      }
      case 'SET_DATA': {
        data = event.data;
        currentFrame = 0;
        playing = false;
        onFrameChange?.(0);
        notify();
        break;
      }
    }
  }

  return {
    getContext(): LottieAnimationContext {
      return { playing, currentFrame, totalFrames: getTotalFrames(), speed, loop, data };
    },
    send,
    subscribe(cb: () => void): () => void {
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    },
    destroy(): void { listeners.clear(); },
  };
}
