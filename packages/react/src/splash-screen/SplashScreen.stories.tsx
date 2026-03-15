/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useRef, useEffect } from 'react';
import { SplashScreen } from './SplashScreen';

export default {
  title: 'Feedback/SplashScreen',
  component: SplashScreen,
  tags: ['autodocs'],
};

// ── Default ──

function DefaultDemo() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setProgress(0);
    setMessage('Baslatiliyor...');
    setVisible(true);

    let p = 0;
    intervalRef.current = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      setProgress(Math.min(p, 100));

      if (p < 30) setMessage('Moduller yukleniyor...');
      else if (p < 60) setMessage('Veritabani baglaniyor...');
      else if (p < 90) setMessage('Arayuz hazirlaniyor...');
      else setMessage('Tamamlandi!');
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <button
        onClick={start}
        style={{
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
          backgroundColor: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Splash Ekranini Goster
      </button>

      <SplashScreen
        visible={visible}
        title="MyApp"
        progress={progress}
        message={message}
        version="v1.0.0"
        onComplete={() => setVisible(false)}
      />
    </div>
  );
}

export const Default = () => <DefaultDemo />;

// ── WithLogo ──

function WithLogoDemo() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setProgress(0);
    setVisible(true);

    let p = 0;
    intervalRef.current = setInterval(() => {
      p += Math.random() * 20 + 5;
      if (p >= 100) {
        p = 100;
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      setProgress(Math.min(p, 100));
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const logoSvg = (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect width="80" height="80" rx="16" fill="#3b82f6" />
      <text
        x="40"
        y="50"
        textAnchor="middle"
        fill="#fff"
        fontWeight="700"
        fontSize="28"
        fontFamily="system-ui, sans-serif"
      >
        R
      </text>
    </svg>
  );

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <button
        onClick={start}
        style={{
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
          backgroundColor: '#8b5cf6',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Logo ile Splash
      </button>

      <SplashScreen
        visible={visible}
        title="RelUI Studio"
        logo={logoSvg}
        progress={progress}
        message="Uygulama hazirlaniyor..."
        version="v2.0.0-beta"
        onComplete={() => setVisible(false)}
      />
    </div>
  );
}

export const WithLogo = () => <WithLogoDemo />;

// ── CustomSlotStyles ──

function CustomSlotStylesDemo() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setProgress(0);
    setVisible(true);

    let p = 0;
    intervalRef.current = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      setProgress(Math.min(p, 100));
    }, 350);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <button
        onClick={start}
        style={{
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
          backgroundColor: '#059669',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Koyu Tema Splash
      </button>

      <SplashScreen
        visible={visible}
        title="DarkApp"
        progress={progress}
        message="Sistem baslatiliyor..."
        version="v3.1.0"
        onComplete={() => setVisible(false)}
        styles={{
          root: { backgroundColor: '#0f172a' },
          title: { color: '#e2e8f0' },
          message: { color: '#64748b' },
          progressTrack: { backgroundColor: '#1e293b' },
          progressFill: { backgroundColor: '#10b981' },
          version: { color: '#475569' },
        }}
      />
    </div>
  );
}

export const CustomSlotStyles = () => <CustomSlotStylesDemo />;

// ── Compound ──

function CompoundDemo() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setProgress(0);
    setVisible(true);

    let p = 0;
    intervalRef.current = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimeout(() => setVisible(false), 500);
      }
      setProgress(Math.min(p, 100));
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <button
        onClick={start}
        style={{
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
          backgroundColor: '#6366f1',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Compound Splash
      </button>

      <SplashScreen visible={visible}>
        <SplashScreen.Logo>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <rect width="60" height="60" rx="12" fill="#6366f1" />
            <text x="30" y="38" textAnchor="middle" fill="#fff" fontWeight="700" fontSize="22" fontFamily="system-ui">C</text>
          </svg>
        </SplashScreen.Logo>
        <SplashScreen.Title>CompoundApp</SplashScreen.Title>
        <SplashScreen.Progress value={progress} />
        <SplashScreen.Version>v1.0.0-compound</SplashScreen.Version>
      </SplashScreen>
    </div>
  );
}

export const Compound = () => <CompoundDemo />;

// ── WithMessage ──

function WithMessageDemo() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setProgress(0);
    setMessage('Baslangic kontrolleri yapiliyor...');
    setVisible(true);

    const messages = [
      'Baslangic kontrolleri yapiliyor...',
      'Veritabani baglantiları kuruluyor...',
      'Kullanici ayarlari yukleniyor...',
      'Eklentiler baslatiliyor...',
      'Tema ayarlari uygulanıyor...',
      'Son kontroller...',
      'Hazir!',
    ];

    let p = 0;
    intervalRef.current = setInterval(() => {
      p += Math.random() * 12 + 4;
      if (p >= 100) {
        p = 100;
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      setProgress(Math.min(p, 100));
      const msgIndex = Math.min(Math.floor((p / 100) * messages.length), messages.length - 1);
      setMessage(messages[msgIndex]);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <button
        onClick={start}
        style={{
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
          backgroundColor: '#f59e0b',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Detayli Mesajli Splash
      </button>

      <SplashScreen
        visible={visible}
        title="Enterprise Suite"
        progress={progress}
        message={message}
        version="v4.2.1"
        onComplete={() => setVisible(false)}
      />
    </div>
  );
}

export const WithMessage = () => <WithMessageDemo />;

// ── Playground ──

function PlaygroundDemo() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [autoProgress, setAutoProgress] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setProgress(0);
    setVisible(true);

    if (autoProgress) {
      let p = 0;
      intervalRef.current = setInterval(() => {
        p += Math.random() * 10 + 3;
        if (p >= 100) {
          p = 100;
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
        setProgress(Math.min(p, 100));
      }, 400);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            type="checkbox"
            checked={autoProgress}
            onChange={(e) => setAutoProgress(e.target.checked)}
          />
          Otomatik ilerleme
        </label>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          onClick={start}
          style={{
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 600,
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          Splash Baslat
        </button>
        {!autoProgress && visible && (
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            style={{ flex: 1 }}
          />
        )}
      </div>

      <SplashScreen
        visible={visible}
        title="Playground App"
        progress={progress}
        message={`Yukleniyor... %${Math.round(progress)}`}
        version="v1.0.0"
        onComplete={() => setVisible(false)}
      />
    </div>
  );
}

export const Playground = () => <PlaygroundDemo />;
