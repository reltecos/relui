/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * SplashScreen — uygulama acilis ekrani bilesen (Dual API).
 * SplashScreen — application splash screen component (Dual API).
 *
 * Props-based: `<SplashScreen visible={true} title="MyApp" progress={60} />`
 * Compound:    `<SplashScreen visible={true}><SplashScreen.Logo>...</SplashScreen.Logo>...</SplashScreen>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useRef, useEffect, useReducer, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  splashScreenRootStyle,
  splashScreenRootClosingStyle,
  splashScreenContentStyle,
  splashScreenLogoStyle,
  splashScreenTitleStyle,
  splashScreenMessageStyle,
  splashScreenProgressTrackStyle,
  splashScreenProgressFillStyle,
  splashScreenVersionStyle,
} from './splash-screen.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
import { createSplashScreen, type SplashScreenAPI } from '@relteco/relui-core';

// ── Slot ──────────────────────────────────────────────

/**
 * SplashScreen slot isimleri / SplashScreen slot names.
 */
export type SplashScreenSlot =
  | 'root'
  | 'content'
  | 'logo'
  | 'title'
  | 'message'
  | 'progressTrack'
  | 'progressFill'
  | 'version';

// ── Context (Compound API) ──────────────────────────

interface SplashScreenContextValue {
  classNames: ClassNames<SplashScreenSlot> | undefined;
  styles: Styles<SplashScreenSlot> | undefined;
}

const SplashScreenContext = createContext<SplashScreenContextValue | null>(null);

function useSplashScreenContext(): SplashScreenContextValue {
  const ctx = useContext(SplashScreenContext);
  if (!ctx) throw new Error('SplashScreen compound sub-components must be used within <SplashScreen>.');
  return ctx;
}

// ── Compound: SplashScreen.Logo ─────────────────────

/** SplashScreen.Logo props */
export interface SplashScreenLogoProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const SplashScreenLogo = forwardRef<HTMLDivElement, SplashScreenLogoProps>(
  function SplashScreenLogo(props, ref) {
    const { children, className } = props;
    const ctx = useSplashScreenContext();
    const slot = getSlotProps('logo', splashScreenLogoStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="splash-logo">
        {children}
      </div>
    );
  },
);

// ── Compound: SplashScreen.Title ────────────────────

/** SplashScreen.Title props */
export interface SplashScreenTitleProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const SplashScreenTitle = forwardRef<HTMLHeadingElement, SplashScreenTitleProps>(
  function SplashScreenTitle(props, ref) {
    const { children, className } = props;
    const ctx = useSplashScreenContext();
    const slot = getSlotProps('title', splashScreenTitleStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <h1 ref={ref} className={cls} style={slot.style} data-testid="splash-title">
        {children}
      </h1>
    );
  },
);

// ── Compound: SplashScreen.Progress ─────────────────

/** SplashScreen.Progress props */
export interface SplashScreenProgressProps {
  /** Ilerleme degeri (0-100) / Progress value (0-100) */
  value?: number;
  /** Ek className / Additional className */
  className?: string;
}

const SplashScreenProgress = forwardRef<HTMLDivElement, SplashScreenProgressProps>(
  function SplashScreenProgress(props, ref) {
    const { value = 0, className } = props;
    const ctx = useSplashScreenContext();
    const trackSlot = getSlotProps('progressTrack', splashScreenProgressTrackStyle, ctx.classNames, ctx.styles);
    const fillSlot = getSlotProps('progressFill', splashScreenProgressFillStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${trackSlot.className} ${className}` : trackSlot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={trackSlot.style}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        data-testid="splash-progress"
      >
        <div
          className={fillSlot.className}
          style={{ ...fillSlot.style, width: `${value}%` }}
          data-testid="splash-progress-fill"
        />
      </div>
    );
  },
);

// ── Compound: SplashScreen.Version ──────────────────

/** SplashScreen.Version props */
export interface SplashScreenVersionProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const SplashScreenVersion = forwardRef<HTMLDivElement, SplashScreenVersionProps>(
  function SplashScreenVersion(props, ref) {
    const { children, className } = props;
    const ctx = useSplashScreenContext();
    const slot = getSlotProps('version', splashScreenVersionStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="splash-version">
        {children}
      </div>
    );
  },
);

// ── Component Props ─────────────────────────────────

export interface SplashScreenComponentProps extends SlotStyleProps<SplashScreenSlot> {
  /** Gorunur mu / Is visible */
  visible: boolean;
  /** Uygulama basligi / Application title */
  title?: string;
  /** Logo elementi / Logo element */
  logo?: React.ReactNode;
  /** Yukleme ilerlemesi (0-100) / Loading progress (0-100) */
  progress?: number;
  /** Durum mesaji / Status message */
  message?: string;
  /** Versiyon bilgisi / Version info */
  version?: string;
  /** Progress 100 olunca otomatik kapat / Auto-close on progress 100 */
  autoClose?: boolean;
  /** Otomatik kapatma gecikmesi ms / Auto-close delay ms */
  autoCloseDelay?: number;
  /** Tamamlaninca callback / On complete callback */
  onComplete?: () => void;
  /** Gorunurluk degisince callback / On visibility change callback */
  onVisibleChange?: (visible: boolean) => void;
  /** Progress bar goster / Show progress bar */
  showProgress?: boolean;
  /** Portal hedefi / Portal container */
  portalContainer?: HTMLElement;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

/**
 * SplashScreen bilesen — Dual API (props-based + compound).
 * SplashScreen component — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <SplashScreen
 *   visible={loading}
 *   title="MyApp"
 *   progress={loadProgress}
 *   message="Moduller yukleniyor..."
 *   version="v1.0.0"
 *   onComplete={() => setLoading(false)}
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <SplashScreen visible={true}>
 *   <SplashScreen.Logo><img src="/logo.png" /></SplashScreen.Logo>
 *   <SplashScreen.Title>MyApp</SplashScreen.Title>
 *   <SplashScreen.Progress value={60} />
 *   <SplashScreen.Version>v1.0.0</SplashScreen.Version>
 * </SplashScreen>
 * ```
 */
const SplashScreenBase = forwardRef<HTMLDivElement, SplashScreenComponentProps>(
  function SplashScreen(props, ref) {
    const {
      visible,
      title,
      logo,
      progress,
      message,
      version,
      children,
      autoClose = true,
      autoCloseDelay = 500,
      onComplete,
      onVisibleChange,
      showProgress = true,
      portalContainer,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const [, forceRender] = useReducer((c: number) => c + 1, 0);

    // ── Core API ──
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;
    const onVisibleChangeRef = useRef(onVisibleChange);
    onVisibleChangeRef.current = onVisibleChange;

    const apiRef = useRef<SplashScreenAPI | null>(null);
    if (!apiRef.current) {
      apiRef.current = createSplashScreen({
        visible: false,
        autoClose,
        autoCloseDelay,
        onComplete: () => onCompleteRef.current?.(),
        onVisibleChange: (v) => onVisibleChangeRef.current?.(v),
      });
    }
    const api = apiRef.current;

    // ── Prop sync: visible ──
    const prevVisibleRef = useRef<boolean | undefined>(undefined);
    if (visible !== prevVisibleRef.current) {
      if (visible) {
        api.send({ type: 'OPEN' });
      } else {
        api.send({ type: 'CLOSE' });
      }
      prevVisibleRef.current = visible;
    }

    // ── Prop sync: progress ──
    const prevProgressRef = useRef<number | undefined>(undefined);
    if (progress !== undefined && progress !== prevProgressRef.current) {
      api.send({ type: 'SET_PROGRESS', value: progress });
      prevProgressRef.current = progress;
    }

    // ── Prop sync: message ──
    const prevMessageRef = useRef<string | undefined>(undefined);
    if (message !== undefined && message !== prevMessageRef.current) {
      api.send({ type: 'SET_MESSAGE', message });
      prevMessageRef.current = message;
    }

    // ── Subscribe ──
    useEffect(() => {
      return api.subscribe(() => forceRender());
    }, [api]);

    // ── Closing animation state ──
    const [closing, setClosing] = useState(false);
    const prevCtxVisible = useRef(false);

    const ctx = api.getContext();

    useEffect(() => {
      if (prevCtxVisible.current && !ctx.visible) {
        setClosing(true);
        const timer = setTimeout(() => setClosing(false), 400);
        return () => clearTimeout(timer);
      }
      prevCtxVisible.current = ctx.visible;
    }, [ctx.visible]);

    // ── Portal target ──
    const anchorRef = useRef<HTMLSpanElement>(null);
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

    useEffect(() => {
      if (portalContainer) {
        setPortalTarget(portalContainer);
        return;
      }
      const anchor = anchorRef.current;
      if (!anchor) return;
      const themeContainer = anchor.closest('[data-theme]') as HTMLElement | null;
      setPortalTarget(themeContainer ?? document.body);
    }, [portalContainer]);

    // ── Render ──
    const anchor = <span ref={anchorRef} style={{ display: 'none' }} data-testid="splash-anchor" />;

    if (!ctx.visible && !closing) return anchor;

    const ctxValue: SplashScreenContextValue = { classNames, styles };

    // ── Compound API ──
    if (children) {
      const rootSlotC = getSlotProps('root', splashScreenRootStyle, classNames, styles);
      const contentSlotC = getSlotProps('content', splashScreenContentStyle, classNames, styles);
      const rootClassNameC = [
        rootSlotC.className,
        closing ? splashScreenRootClosingStyle : '',
        className,
      ]
        .filter(Boolean)
        .join(' ');

      const compoundContent = (
        <SplashScreenContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassNameC}
            style={{ ...rootSlotC.style, ...styleProp }}
            role="status"
            aria-label="Yukleniyor"
            data-testid="splash-root"
          >
            <div
              className={contentSlotC.className}
              style={contentSlotC.style}
              data-testid="splash-content"
            >
              {children}
            </div>
          </div>
        </SplashScreenContext.Provider>
      );

      if (!portalTarget) return anchor;

      return (
        <>
          {anchor}
          {createPortal(compoundContent, portalTarget)}
        </>
      );
    }

    // ── Props-based API ──
    // ── Slots ──
    const rootSlot = getSlotProps('root', splashScreenRootStyle, classNames, styles);
    const contentSlot = getSlotProps('content', splashScreenContentStyle, classNames, styles);
    const logoSlot = getSlotProps('logo', splashScreenLogoStyle, classNames, styles);
    const titleSlot = getSlotProps('title', splashScreenTitleStyle, classNames, styles);
    const messageSlot = getSlotProps('message', splashScreenMessageStyle, classNames, styles);
    const trackSlot = getSlotProps('progressTrack', splashScreenProgressTrackStyle, classNames, styles);
    const fillSlot = getSlotProps('progressFill', splashScreenProgressFillStyle, classNames, styles);
    const versionSlot = getSlotProps('version', splashScreenVersionStyle, classNames, styles);

    const rootClassName = [
      rootSlot.className,
      closing ? splashScreenRootClosingStyle : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const content = (
      <div
        ref={ref}
        className={rootClassName}
        style={{ ...rootSlot.style, ...styleProp }}
        role="status"
        aria-label={title ?? 'Yukleniyor'}
        data-testid="splash-root"
      >
        <div
          className={contentSlot.className}
          style={contentSlot.style}
          data-testid="splash-content"
        >
          {logo && (
            <div
              className={logoSlot.className}
              style={logoSlot.style}
              data-testid="splash-logo"
            >
              {logo}
            </div>
          )}

          {title && (
            <h1
              className={titleSlot.className}
              style={titleSlot.style}
              data-testid="splash-title"
            >
              {title}
            </h1>
          )}

          {showProgress && (
            <div
              className={trackSlot.className}
              style={trackSlot.style}
              role="progressbar"
              aria-valuenow={ctx.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              data-testid="splash-progress"
            >
              <div
                className={fillSlot.className}
                style={{ ...fillSlot.style, width: `${ctx.progress}%` }}
                data-testid="splash-progress-fill"
              />
            </div>
          )}

          {ctx.message && (
            <div
              className={messageSlot.className}
              style={messageSlot.style}
              data-testid="splash-message"
            >
              {ctx.message}
            </div>
          )}

          {version && (
            <div
              className={versionSlot.className}
              style={versionSlot.style}
              data-testid="splash-version"
            >
              {version}
            </div>
          )}
        </div>
      </div>
    );

    if (!portalTarget) return anchor;

    return (
      <>
        {anchor}
        {createPortal(content, portalTarget)}
      </>
    );
  },
);

/**
 * SplashScreen bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <SplashScreen visible={true} title="MyApp" progress={60} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <SplashScreen visible={true}>
 *   <SplashScreen.Logo><img src="/logo.png" /></SplashScreen.Logo>
 *   <SplashScreen.Title>MyApp</SplashScreen.Title>
 *   <SplashScreen.Progress value={60} />
 *   <SplashScreen.Version>v1.0.0</SplashScreen.Version>
 * </SplashScreen>
 * ```
 */
export const SplashScreen = Object.assign(SplashScreenBase, {
  Logo: SplashScreenLogo,
  Title: SplashScreenTitle,
  Progress: SplashScreenProgress,
  Version: SplashScreenVersion,
});
