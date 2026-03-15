/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Tabs } from './Tabs';
import type { TabItem } from '@relteco/relui-core';

const defaultItems: TabItem[] = [
  { value: 'home', label: 'Ana Sayfa' },
  { value: 'profile', label: 'Profil' },
  { value: 'settings', label: 'Ayarlar' },
];

const defaultPanels = [
  { value: 'home', children: <div>Home content</div> },
  { value: 'profile', children: <div>Profile content</div> },
  { value: 'settings', children: <div>Settings content</div> },
];

describe('Tabs', () => {
  // ── Render ─────────────────────────────────────────────────────

  it('render edilir', () => {
    render(<Tabs items={defaultItems} defaultValue="home" panels={defaultPanels} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('tab etiketleri goruntulenir', () => {
    render(<Tabs items={defaultItems} defaultValue="home" panels={defaultPanels} />);
    expect(screen.getByText('Ana Sayfa')).toBeInTheDocument();
    expect(screen.getByText('Profil')).toBeInTheDocument();
    expect(screen.getByText('Ayarlar')).toBeInTheDocument();
  });

  it('secili tab active state alir', () => {
    render(<Tabs items={defaultItems} defaultValue="home" panels={defaultPanels} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('data-state', 'active');
    expect(tabs[1]).toHaveAttribute('data-state', 'inactive');
  });

  it('secili paneli gosterir, digerlerini gizler', () => {
    render(<Tabs items={defaultItems} defaultValue="home" panels={defaultPanels} />);
    expect(screen.getByText('Home content')).toBeInTheDocument();
    const panels = screen.getAllByRole('tabpanel', { hidden: true });
    const visiblePanels = panels.filter((p) => !p.hasAttribute('hidden'));
    expect(visiblePanels).toHaveLength(1);
  });

  it('ref forwarding calisir', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Tabs ref={ref} items={defaultItems} defaultValue="home" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // ── Tab Selection ──────────────────────────────────────────────

  it('tab tiklaninca secilir', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs items={defaultItems} defaultValue="home" panels={defaultPanels} onValueChange={onValueChange} />,
    );
    fireEvent.click(screen.getByText('Profil'));
    expect(onValueChange).toHaveBeenCalledWith('profile');
  });

  it('ayni taba tekrar tiklaninca onValueChange cagirilmaz', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs items={defaultItems} defaultValue="home" panels={defaultPanels} onValueChange={onValueChange} />,
    );
    fireEvent.click(screen.getByText('Ana Sayfa'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('disabled tab tiklanamaz', () => {
    const items: TabItem[] = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
    ];
    const onValueChange = vi.fn();
    render(<Tabs items={items} defaultValue="a" onValueChange={onValueChange} />);
    fireEvent.click(screen.getByText('B'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  // ── Keyboard Navigation (Horizontal) ──────────────────────────

  it('ArrowRight ile sonraki tab secilir (automatic)', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs items={defaultItems} defaultValue="home" panels={defaultPanels} onValueChange={onValueChange} />,
    );
    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(onValueChange).toHaveBeenCalledWith('profile');
  });

  it('ArrowLeft ile onceki tab secilir (automatic)', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs items={defaultItems} defaultValue="profile" panels={defaultPanels} onValueChange={onValueChange} />,
    );
    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
    expect(onValueChange).toHaveBeenCalledWith('home');
  });

  it('Home ile ilk tab secilir', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs items={defaultItems} defaultValue="settings" panels={defaultPanels} onValueChange={onValueChange} />,
    );
    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'Home' });
    expect(onValueChange).toHaveBeenCalledWith('home');
  });

  it('End ile son tab secilir', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs items={defaultItems} defaultValue="home" panels={defaultPanels} onValueChange={onValueChange} />,
    );
    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'End' });
    expect(onValueChange).toHaveBeenCalledWith('settings');
  });

  // ── Keyboard Navigation (Vertical) ────────────────────────────

  it('vertical modda ArrowDown ile sonraki tab secilir', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs
        items={defaultItems}
        defaultValue="home"
        orientation="vertical"
        onValueChange={onValueChange}
      />,
    );
    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'ArrowDown' });
    expect(onValueChange).toHaveBeenCalledWith('profile');
  });

  it('vertical modda ArrowUp ile onceki tab secilir', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs
        items={defaultItems}
        defaultValue="profile"
        orientation="vertical"
        onValueChange={onValueChange}
      />,
    );
    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'ArrowUp' });
    expect(onValueChange).toHaveBeenCalledWith('home');
  });

  // ── Manual Activation Mode ────────────────────────────────────

  it('manual modda ArrowRight focus verir ama secmez', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs
        items={defaultItems}
        defaultValue="home"
        activationMode="manual"
        onValueChange={onValueChange}
      />,
    );
    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('manual modda Enter ile secer', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs
        items={defaultItems}
        defaultValue="home"
        activationMode="manual"
        onValueChange={onValueChange}
      />,
    );
    const tablist = screen.getByRole('tablist');
    // Focus'u sonraki tab'a taşı
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    // Enter ile seç
    fireEvent.keyDown(tablist, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith('profile');
  });

  it('manual modda Space ile secer', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs
        items={defaultItems}
        defaultValue="home"
        activationMode="manual"
        onValueChange={onValueChange}
      />,
    );
    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    fireEvent.keyDown(tablist, { key: ' ' });
    expect(onValueChange).toHaveBeenCalledWith('profile');
  });

  // ── Closable Tabs ──────────────────────────────────────────────

  it('closable tab kapatma butonu gosterir', () => {
    const items: TabItem[] = [
      { value: 'a', label: 'Tab A', closable: true },
      { value: 'b', label: 'Tab B' },
    ];
    render(<Tabs items={items} defaultValue="a" />);
    expect(screen.getByRole('button', { name: 'Tab A kapat' })).toBeInTheDocument();
  });

  it('closable olmayan tabda kapatma butonu yok', () => {
    render(<Tabs items={defaultItems} defaultValue="home" />);
    expect(screen.queryByRole('button', { name: /kapat/ })).not.toBeInTheDocument();
  });

  it('kapatma butonuna tiklaninca onClose cagirilir', () => {
    const items: TabItem[] = [
      { value: 'a', label: 'Tab A', closable: true },
      { value: 'b', label: 'Tab B' },
    ];
    const onClose = vi.fn();
    render(<Tabs items={items} defaultValue="a" onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Tab A kapat' }));
    expect(onClose).toHaveBeenCalledWith('a');
  });

  it('kapatma butonu tiklama tab secimini degistirmez', () => {
    const items: TabItem[] = [
      { value: 'a', label: 'Tab A' },
      { value: 'b', label: 'Tab B', closable: true },
    ];
    const onValueChange = vi.fn();
    render(<Tabs items={items} defaultValue="a" onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Tab B kapat' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  // ── A11y ──────────────────────────────────────────────────────

  it('tablist rolunu tasir', () => {
    render(<Tabs items={defaultItems} defaultValue="home" />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('aria-orientation dogru', () => {
    render(<Tabs items={defaultItems} defaultValue="home" />);
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('vertical aria-orientation', () => {
    render(<Tabs items={defaultItems} defaultValue="home" orientation="vertical" />);
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('tab aria-selected dogru', () => {
    render(<Tabs items={defaultItems} defaultValue="home" panels={defaultPanels} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('tab aria-controls tabpanel id ile eslesiir', () => {
    render(<Tabs items={defaultItems} defaultValue="home" panels={defaultPanels} id="my-tabs" />);
    const tab = screen.getAllByRole('tab')[0];
    const panelId = tab?.getAttribute('aria-controls');
    expect(panelId).toBe('my-tabs-panel-home');
    const panel = screen.getAllByRole('tabpanel', { hidden: true })[0];
    expect(panel).toHaveAttribute('id', panelId);
  });

  it('tabpanel aria-labelledby tab id ile eslesiir', () => {
    render(<Tabs items={defaultItems} defaultValue="home" panels={defaultPanels} id="my-tabs" />);
    const tab = screen.getAllByRole('tab')[0];
    const tabId = tab?.getAttribute('id');
    const panel = screen.getAllByRole('tabpanel', { hidden: true })[0];
    expect(panel).toHaveAttribute('aria-labelledby', tabId);
  });

  it('roving tabindex: secili tab tabIndex=0, digerleri -1', () => {
    render(<Tabs items={defaultItems} defaultValue="home" panels={defaultPanels} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('tabindex', '0');
    expect(tabs[1]).toHaveAttribute('tabindex', '-1');
    expect(tabs[2]).toHaveAttribute('tabindex', '-1');
  });

  it('disabled tab aria-disabled alir', () => {
    const items: TabItem[] = [
      { value: 'a', label: 'A', disabled: true },
      { value: 'b', label: 'B' },
    ];
    render(<Tabs items={items} defaultValue="b" />);
    expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-disabled', 'true');
  });

  it('aria-label tablist e aktarilir', () => {
    render(<Tabs items={defaultItems} defaultValue="home" aria-label="Navigasyon" />);
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-label', 'Navigasyon');
  });

  // ── Variants ──────────────────────────────────────────────────

  it('line varyant render edilir', () => {
    render(<Tabs items={defaultItems} defaultValue="home" variant="line" />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('enclosed varyant render edilir', () => {
    render(<Tabs items={defaultItems} defaultValue="home" variant="enclosed" />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('outline varyant render edilir', () => {
    render(<Tabs items={defaultItems} defaultValue="home" variant="outline" />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('pills varyant render edilir', () => {
    render(<Tabs items={defaultItems} defaultValue="home" variant="pills" />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  // ── Sizes ──────────────────────────────────────────────────────

  it('xs boyut render edilir', () => {
    render(<Tabs items={defaultItems} defaultValue="home" size="xs" />);
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('xl boyut render edilir', () => {
    render(<Tabs items={defaultItems} defaultValue="home" size="xl" />);
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  // ── Grow ──────────────────────────────────────────────────────

  it('grow prop ile tablar esit genisler', () => {
    render(<Tabs items={defaultItems} defaultValue="home" grow />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveStyle({ flex: '1 1 0%' });
  });

  // ── renderPanel ────────────────────────────────────────────────

  it('renderPanel ile custom panel render edilir', () => {
    render(
      <Tabs
        items={defaultItems}
        defaultValue="home"
        renderPanel={(value) => <div>Custom: {value}</div>}
      />,
    );
    expect(screen.getByText('Custom: home')).toBeInTheDocument();
  });

  // ── Disabled ──────────────────────────────────────────────────

  it('disabled durumda tablist data-disabled alir', () => {
    render(<Tabs items={defaultItems} defaultValue="home" disabled />);
    expect(screen.getByRole('tablist')).toHaveAttribute('data-disabled', '');
  });

  // ── Slot API (classNames + styles) ────────────────────────────

  it('classNames.root uygulanir', () => {
    render(
      <Tabs items={defaultItems} defaultValue="home" classNames={{ root: 'custom-root' }} />,
    );
    const root = screen.getByRole('tablist').parentElement;
    expect(root?.className).toContain('custom-root');
  });

  it('classNames.list uygulanir', () => {
    render(
      <Tabs items={defaultItems} defaultValue="home" classNames={{ list: 'custom-list' }} />,
    );
    expect(screen.getByRole('tablist').className).toContain('custom-list');
  });

  it('classNames.tab uygulanir', () => {
    render(
      <Tabs items={defaultItems} defaultValue="home" classNames={{ tab: 'custom-tab' }} />,
    );
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]?.className).toContain('custom-tab');
  });

  it('classNames.panel uygulanir', () => {
    render(
      <Tabs
        items={defaultItems}
        defaultValue="home"
        panels={defaultPanels}
        classNames={{ panel: 'custom-panel' }}
      />,
    );
    const panels = screen.getAllByRole('tabpanel', { hidden: true });
    expect(panels[0]?.className).toContain('custom-panel');
  });

  it('styles.tab uygulanir', () => {
    render(
      <Tabs
        items={defaultItems}
        defaultValue="home"
        styles={{ tab: { padding: '20px' } }}
      />,
    );
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveStyle({ padding: '20px' });
  });

  it('styles.panel uygulanir', () => {
    render(
      <Tabs
        items={defaultItems}
        defaultValue="home"
        panels={defaultPanels}
        styles={{ panel: { padding: '30px' } }}
      />,
    );
    const panel = screen.getAllByRole('tabpanel', { hidden: true }).find((p) => !p.hasAttribute('hidden'));
    expect(panel).toHaveStyle({ padding: '30px' });
  });

  it('className prop root ile merge edilir', () => {
    render(
      <Tabs items={defaultItems} defaultValue="home" className="extra-class" />,
    );
    const root = screen.getByRole('tablist').parentElement;
    expect(root?.className).toContain('extra-class');
  });
});

// ── Compound API ──

describe('Tabs (Compound)', () => {
  it('compound: list render edilir', () => {
    render(
      <Tabs items={defaultItems} defaultValue="home">
        <Tabs.List aria-label="Nav">
          <Tabs.Tab value="home">Ana Sayfa</Tabs.Tab>
          <Tabs.Tab value="profile">Profil</Tabs.Tab>
          <Tabs.Tab value="settings">Ayarlar</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="home">Home content</Tabs.Panel>
        <Tabs.Panel value="profile">Profile content</Tabs.Panel>
        <Tabs.Panel value="settings">Settings content</Tabs.Panel>
      </Tabs>,
    );
    expect(screen.getByTestId('tabs-list')).toBeInTheDocument();
    expect(screen.getAllByTestId('tabs-tab')).toHaveLength(3);
  });

  it('compound: tab tiklaninca secilir', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs items={defaultItems} defaultValue="home" onValueChange={onValueChange}>
        <Tabs.List aria-label="Nav">
          <Tabs.Tab value="home">Ana Sayfa</Tabs.Tab>
          <Tabs.Tab value="profile">Profil</Tabs.Tab>
        </Tabs.List>
      </Tabs>,
    );
    fireEvent.click(screen.getByText('Profil'));
    expect(onValueChange).toHaveBeenCalledWith('profile');
  });

  it('compound: panel render edilir', () => {
    render(
      <Tabs items={defaultItems} defaultValue="home">
        <Tabs.List aria-label="Nav">
          <Tabs.Tab value="home">Ana Sayfa</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="home">Home icerik</Tabs.Panel>
        <Tabs.Panel value="profile">Profile icerik</Tabs.Panel>
      </Tabs>,
    );
    expect(screen.getByText('Home icerik')).toBeInTheDocument();
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <Tabs items={defaultItems} defaultValue="home" classNames={{ tab: 'cmp-tab' }}>
        <Tabs.List aria-label="Nav">
          <Tabs.Tab value="home">Ana Sayfa</Tabs.Tab>
        </Tabs.List>
      </Tabs>,
    );
    expect(screen.getByTestId('tabs-tab').className).toContain('cmp-tab');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <Tabs items={defaultItems} defaultValue="home" styles={{ panel: { padding: '50px' } }}>
        <Tabs.List aria-label="Nav">
          <Tabs.Tab value="home">Ana Sayfa</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="home">Icerik</Tabs.Panel>
      </Tabs>,
    );
    expect(screen.getByTestId('tabs-panel')).toHaveStyle({ padding: '50px' });
  });
});
