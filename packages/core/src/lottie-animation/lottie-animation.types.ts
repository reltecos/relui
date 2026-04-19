/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * LottieAnimation tipleri.
 * LottieAnimation types.
 *
 * @packageDocumentation
 */

/** Lottie keyframe / Lottie keyframe */
export interface LottieKeyframe {
  readonly frame: number;
  readonly value: number;
}

/** Lottie katman / Lottie layer */
export interface LottieLayer {
  readonly name: string;
  readonly inFrame: number;
  readonly outFrame: number;
  readonly opacity: readonly LottieKeyframe[];
  readonly positionX: readonly LottieKeyframe[];
  readonly positionY: readonly LottieKeyframe[];
  readonly scaleX: readonly LottieKeyframe[];
  readonly scaleY: readonly LottieKeyframe[];
  readonly rotation: readonly LottieKeyframe[];
}

/** Lottie veri / Lottie data */
export interface LottieData {
  readonly frameRate: number;
  readonly totalFrames: number;
  readonly width: number;
  readonly height: number;
  readonly layers: readonly LottieLayer[];
}

export type LottieAnimationEvent =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'STOP' }
  | { type: 'SET_FRAME'; frame: number }
  | { type: 'SET_SPEED'; speed: number }
  | { type: 'TOGGLE_LOOP' }
  | { type: 'SET_DATA'; data: LottieData };

export interface LottieAnimationContext {
  readonly playing: boolean;
  readonly currentFrame: number;
  readonly totalFrames: number;
  readonly speed: number;
  readonly loop: boolean;
  readonly data: LottieData | null;
}

export interface LottieAnimationConfig {
  defaultData?: LottieData;
  defaultSpeed?: number;
  defaultLoop?: boolean;
  onFrameChange?: (frame: number) => void;
}

export interface LottieAnimationAPI {
  getContext(): LottieAnimationContext;
  send(event: LottieAnimationEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
