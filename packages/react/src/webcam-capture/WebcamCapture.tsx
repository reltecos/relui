/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * WebcamCapture — kamera yakalama bilesen (Dual API).
 * WebcamCapture — webcam capture component (Dual API).
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { FacingMode, WebcamState } from '@relteco/relui-core';
import { rootStyle, videoStyle, controlsStyle, controlButtonStyle, previewStyle, statusStyle } from './webcam-capture.css';
import { useWebcamCapture } from './useWebcamCapture';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type WebcamCaptureSlot = 'root' | 'video' | 'controls' | 'preview';

interface WebcamCaptureContextValue {
  state: WebcamState;
  mirror: boolean;
  facingMode: FacingMode;
  lastPhotoUrl: string | null;
  recording: boolean;
  error: string | null;
  start: () => void;
  stop: () => void;
  capturePhoto: (dataUrl: string) => void;
  startRecording: () => void;
  setFacing: (mode: FacingMode) => void;
  setMirror: (mirror: boolean) => void;
  classNames: ClassNames<WebcamCaptureSlot> | undefined;
  styles: Styles<WebcamCaptureSlot> | undefined;
}

const WebcamCaptureContext = createContext<WebcamCaptureContextValue | null>(null);

function useWebcamCaptureContext(): WebcamCaptureContextValue {
  const ctx = useContext(WebcamCaptureContext);
  if (!ctx) throw new Error('WebcamCapture compound sub-components must be used within <WebcamCapture>.');
  return ctx;
}

// ── Compound: Video ─────────────────────────────────

export interface WebcamCaptureVideoProps { className?: string; }

const WebcamCaptureVideo = forwardRef<HTMLVideoElement, WebcamCaptureVideoProps>(
  function WebcamCaptureVideo(props, ref) {
    const { className } = props;
    const ctx = useWebcamCaptureContext();
    const slot = getSlotProps('video', videoStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <video
        ref={ref}
        className={cls}
        style={{ ...slot.style, ...(ctx.mirror ? { transform: 'scaleX(-1)' } : {}) }}
        autoPlay
        playsInline
        muted
        data-testid="webcam-capture-video"
        data-state={ctx.state}
        aria-label="Webcam video"
      />
    );
  },
);

// ── Compound: Controls ──────────────────────────────

export interface WebcamCaptureControlsProps { className?: string; }

const WebcamCaptureControls = forwardRef<HTMLDivElement, WebcamCaptureControlsProps>(
  function WebcamCaptureControls(props, ref) {
    const { className } = props;
    const ctx = useWebcamCaptureContext();
    const slot = getSlotProps('controls', controlsStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="webcam-capture-controls">
        {ctx.state === 'idle' && (
          <button type="button" className={controlButtonStyle} onClick={() => ctx.start()} aria-label="Start camera" data-testid="webcam-capture-btn-start">Start</button>
        )}
        {ctx.state === 'active' && (
          <>
            <button type="button" className={controlButtonStyle} onClick={() => ctx.stop()} aria-label="Stop camera" data-testid="webcam-capture-btn-stop">Stop</button>
            <button type="button" className={controlButtonStyle} onClick={() => ctx.setMirror(!ctx.mirror)} aria-label="Toggle mirror" data-testid="webcam-capture-btn-mirror">Mirror</button>
            <button type="button" className={controlButtonStyle} onClick={() => ctx.setFacing(ctx.facingMode === 'user' ? 'environment' : 'user')} aria-label="Switch camera" data-testid="webcam-capture-btn-facing">Switch</button>
          </>
        )}
        <span className={statusStyle} data-testid="webcam-capture-status">{ctx.state}{ctx.recording ? ' (Recording)' : ''}</span>
      </div>
    );
  },
);

// ── Compound: Preview ───────────────────────────────

export interface WebcamCapturePreviewProps { className?: string; }

const WebcamCapturePreview = forwardRef<HTMLDivElement, WebcamCapturePreviewProps>(
  function WebcamCapturePreview(props, ref) {
    const { className } = props;
    const ctx = useWebcamCaptureContext();
    const slot = getSlotProps('preview', previewStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    if (!ctx.lastPhotoUrl) return null;

    return (
      <div ref={ref} data-testid="webcam-capture-preview">
        <img src={ctx.lastPhotoUrl} alt="Captured photo" className={cls} style={slot.style} data-testid="webcam-capture-preview-img" />
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface WebcamCaptureComponentProps extends SlotStyleProps<WebcamCaptureSlot> {
  defaultFacingMode?: FacingMode;
  defaultMirror?: boolean;
  onPhoto?: (dataUrl: string) => void;
  onVideo?: (blobUrl: string) => void;
  onError?: (message: string) => void;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const WebcamCaptureBase = forwardRef<HTMLDivElement, WebcamCaptureComponentProps>(
  function WebcamCapture(props, ref) {
    const { defaultFacingMode, defaultMirror, onPhoto, onVideo, onError, children, className, style: styleProp, classNames, styles } = props;

    const wc = useWebcamCapture({ defaultFacingMode, defaultMirror, onPhoto, onVideo, onError });

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: WebcamCaptureContextValue = {
      state: wc.state, mirror: wc.mirror, facingMode: wc.facingMode,
      lastPhotoUrl: wc.lastPhotoUrl, recording: wc.recording, error: wc.error,
      start: wc.start, stop: wc.stop, capturePhoto: wc.capturePhoto,
      startRecording: wc.startRecording, setFacing: wc.setFacing, setMirror: wc.setMirror,
      classNames, styles,
    };

    if (children) {
      return (
        <WebcamCaptureContext.Provider value={ctxValue}>
          <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="webcam-capture-root" role="application" aria-label="Webcam capture">
            {children}
          </div>
        </WebcamCaptureContext.Provider>
      );
    }

    return (
      <WebcamCaptureContext.Provider value={ctxValue}>
        <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="webcam-capture-root" role="application" aria-label="Webcam capture">
          <WebcamCaptureVideo />
          <WebcamCaptureControls />
        </div>
      </WebcamCaptureContext.Provider>
    );
  },
);

export const WebcamCapture = Object.assign(WebcamCaptureBase, {
  Video: WebcamCaptureVideo,
  Controls: WebcamCaptureControls,
  Preview: WebcamCapturePreview,
});
