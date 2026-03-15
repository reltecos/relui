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
import { Cascader } from './Cascader';
import type { CascaderOption } from '@relteco/relui-core';

// ── Test verileri ───────────────────────────────────────────────────

const sampleOptions: CascaderOption[] = [
  {
    value: 'tr',
    label: 'Türkiye',
    children: [
      {
        value: 'ist',
        label: 'İstanbul',
        children: [
          { value: 'kad', label: 'Kadıköy' },
          { value: 'bes', label: 'Beşiktaş' },
        ],
      },
      { value: 'ank', label: 'Ankara' },
    ],
  },
  {
    value: 'us',
    label: 'ABD',
    children: [
      { value: 'ny', label: 'New York' },
      { value: 'la', label: 'Los Angeles' },
    ],
  },
  { value: 'de', label: 'Almanya' },
];

// ── Render ──────────────────────────────────────────────────────────

describe('Cascader', () => {
  it('render edilir', () => {
    render(<Cascader options={sampleOptions} placeholder="Konum seçin" />);
    expect(screen.getByText('Konum seçin')).toBeInTheDocument();
  });

  it('trigger combobox role ine sahip', () => {
    render(<Cascader options={sampleOptions} placeholder="Seç" />);
    const trigger = screen.getByRole('combobox');

    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('defaultValue ile secili deger gosterir (full mode)', () => {
    render(
      <Cascader
        options={sampleOptions}
        defaultValue={['tr', 'ist']}
      />,
    );

    expect(screen.getByText('Türkiye / İstanbul')).toBeInTheDocument();
  });

  it('defaultValue ile secili deger gosterir (last mode)', () => {
    render(
      <Cascader
        options={sampleOptions}
        defaultValue={['tr', 'ist']}
        displayMode="last"
      />,
    );

    expect(screen.getByText('İstanbul')).toBeInTheDocument();
  });

  it('custom separator ile gosterir', () => {
    render(
      <Cascader
        options={sampleOptions}
        defaultValue={['tr', 'ist']}
        separator=" > "
      />,
    );

    expect(screen.getByText('Türkiye > İstanbul')).toBeInTheDocument();
  });

  // ── Dropdown aç/kapa ───────────────────────────────────────────

  it('click ile dropdown acar', () => {
    render(<Cascader options={sampleOptions} placeholder="Seç" />);
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Türkiye')).toBeInTheDocument();
    expect(screen.getByText('ABD')).toBeInTheDocument();
    expect(screen.getByText('Almanya')).toBeInTheDocument();
  });

  it('ikinci click ile kapatir', () => {
    render(<Cascader options={sampleOptions} placeholder="Seç" />);
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('Escape ile kapatir', () => {
    render(<Cascader options={sampleOptions} placeholder="Seç" />);
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'Escape' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  // ── Expand & Select ───────────────────────────────────────────

  it('secenege tiklarken children varsa expand eder', () => {
    render(<Cascader options={sampleOptions} placeholder="Seç" />);
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);

    // Türkiye — children var, expand olmalı
    const turkey = screen.getByText('Türkiye');
    fireEvent.click(turkey);

    // Alt seviye seçenekleri görünmeli
    expect(screen.getByText('İstanbul')).toBeInTheDocument();
    expect(screen.getByText('Ankara')).toBeInTheDocument();
  });

  it('yaprak dugume tiklaninca secer ve kapatir', () => {
    const handleChange = vi.fn();
    render(
      <Cascader
        options={sampleOptions}
        placeholder="Seç"
        onValueChange={handleChange}
      />,
    );
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);
    fireEvent.click(screen.getByText('Almanya'));

    expect(handleChange).toHaveBeenCalledWith(['de']);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('derin secim: Türkiye → Ankara', () => {
    const handleChange = vi.fn();
    render(
      <Cascader
        options={sampleOptions}
        placeholder="Seç"
        onValueChange={handleChange}
      />,
    );
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);
    fireEvent.click(screen.getByText('Türkiye'));
    fireEvent.click(screen.getByText('Ankara'));

    expect(handleChange).toHaveBeenCalledWith(['tr', 'ank']);
  });

  it('uc seviye secim: Türkiye → İstanbul → Kadıköy', () => {
    const handleChange = vi.fn();
    render(
      <Cascader
        options={sampleOptions}
        placeholder="Seç"
        onValueChange={handleChange}
      />,
    );
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);
    fireEvent.click(screen.getByText('Türkiye'));
    fireEvent.click(screen.getByText('İstanbul'));
    fireEvent.click(screen.getByText('Kadıköy'));

    expect(handleChange).toHaveBeenCalledWith(['tr', 'ist', 'kad']);
    expect(screen.getByText('Türkiye / İstanbul / Kadıköy')).toBeInTheDocument();
  });

  // ── Keyboard ──────────────────────────────────────────────────

  it('ArrowDown ile acar', () => {
    render(<Cascader options={sampleOptions} placeholder="Seç" />);
    const trigger = screen.getByRole('combobox');

    fireEvent.keyDown(trigger, { key: 'ArrowDown' });

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('Enter ile acar', () => {
    render(<Cascader options={sampleOptions} placeholder="Seç" />);
    const trigger = screen.getByRole('combobox');

    fireEvent.keyDown(trigger, { key: 'Enter' });

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('ArrowRight ile alt seviyeye gecer', () => {
    render(<Cascader options={sampleOptions} placeholder="Seç" />);
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);
    // Highlight ilk seçenekte (Türkiye)
    fireEvent.keyDown(trigger, { key: 'ArrowRight' });

    // Alt seviye açılmalı
    expect(screen.getByText('İstanbul')).toBeInTheDocument();
    expect(screen.getByText('Ankara')).toBeInTheDocument();
  });

  // ── Disabled & ReadOnly ───────────────────────────────────────

  it('disabled durumda acilamaz', () => {
    render(<Cascader options={sampleOptions} placeholder="Seç" disabled />);
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('data-disabled', '');
  });

  it('readOnly durumda acilamaz', () => {
    render(<Cascader options={sampleOptions} placeholder="Seç" readOnly />);
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('data-readonly', '');
  });

  // ── Props forwarding ──────────────────────────────────────────

  it('id dogru iletilir', () => {
    const { container } = render(
      <Cascader options={sampleOptions} id="my-cascader" />,
    );

    expect(container.querySelector('#my-cascader')).toBeInTheDocument();
  });

  it('className dogru iletilir', () => {
    const { container } = render(
      <Cascader options={sampleOptions} className="custom" />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass('custom');
  });

  it('aria-label dogru set edilir', () => {
    render(<Cascader options={sampleOptions} aria-label="Konum" />);

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-label', 'Konum');
  });

  it('name ile hidden input render eder', () => {
    const { container } = render(
      <Cascader
        options={sampleOptions}
        name="location"
        defaultValue={['tr', 'ist']}
      />,
    );

    const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hidden).toBeInTheDocument();
    expect(hidden.name).toBe('location');
    expect(hidden.value).toBe('tr,ist');
  });

  // ── onOpenChange ──────────────────────────────────────────────

  it('onOpenChange acma/kapama callback', () => {
    const handleOpen = vi.fn();
    render(
      <Cascader
        options={sampleOptions}
        placeholder="Seç"
        onOpenChange={handleOpen}
      />,
    );
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);
    expect(handleOpen).toHaveBeenCalledWith(true);

    fireEvent.click(trigger);
    expect(handleOpen).toHaveBeenCalledWith(false);
  });
});

// ── classNames & styles ────────────────────────────────────────────

describe('Cascader — classNames & styles', () => {
  it('classNames.root uygulanir', () => {
    const { container } = render(
      <Cascader options={sampleOptions} classNames={{ root: 'slot-root' }} />,
    );

    expect(container.firstElementChild).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    const { container } = render(
      <Cascader options={sampleOptions} styles={{ root: { padding: '10px' } }} />,
    );

    expect(container.firstElementChild).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    const { container } = render(
      <Cascader options={sampleOptions} className="legacy" classNames={{ root: 'slot-root' }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass('legacy');
    expect(root).toHaveClass('slot-root');
  });

  it('classNames.trigger uygulanir', () => {
    render(
      <Cascader options={sampleOptions} classNames={{ trigger: 'my-trigger' }} />,
    );

    expect(screen.getByRole('combobox')).toHaveClass('my-trigger');
  });

  it('styles.trigger uygulanir', () => {
    render(
      <Cascader options={sampleOptions} styles={{ trigger: { fontSize: '20px' } }} />,
    );

    expect(screen.getByRole('combobox')).toHaveStyle({ fontSize: '20px' });
  });

  it('classNames.panel uygulanir', () => {
    const { container } = render(
      <Cascader options={sampleOptions} classNames={{ panel: 'my-panel' }} />,
    );

    // Panel görünür olması için aç
    fireEvent.click(screen.getByRole('combobox'));

    const panel = container.querySelector('.my-panel');
    expect(panel).toBeInTheDocument();
  });

  it('classNames.option uygulanir', () => {
    render(
      <Cascader options={sampleOptions} classNames={{ option: 'my-option' }} />,
    );

    fireEvent.click(screen.getByRole('combobox'));

    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveClass('my-option');
  });
});

// ── Compound API ──

describe('Cascader (Compound)', () => {
  it('compound: root render edilir', () => {
    render(
      <Cascader options={sampleOptions}>
        <Cascader.Trigger>
          <span>Konum secin</span>
        </Cascader.Trigger>
        <Cascader.Panel />
      </Cascader>,
    );
    expect(screen.getByTestId('cascader-root')).toBeInTheDocument();
  });

  it('compound: trigger render edilir', () => {
    render(
      <Cascader options={sampleOptions}>
        <Cascader.Trigger>
          <span>Konum secin</span>
        </Cascader.Trigger>
        <Cascader.Panel />
      </Cascader>,
    );
    expect(screen.getByTestId('cascader-trigger')).toBeInTheDocument();
  });

  it('compound: panel acilir', () => {
    render(
      <Cascader options={sampleOptions}>
        <Cascader.Trigger>
          <span>Konum secin</span>
        </Cascader.Trigger>
        <Cascader.Panel />
      </Cascader>,
    );
    fireEvent.click(screen.getByTestId('cascader-trigger'));
    expect(screen.getByTestId('cascader-panel')).toBeInTheDocument();
  });

  it('compound: secim yapilir', () => {
    const handleChange = vi.fn();
    render(
      <Cascader options={sampleOptions} onValueChange={handleChange}>
        <Cascader.Trigger>
          <span>Konum secin</span>
        </Cascader.Trigger>
        <Cascader.Panel />
      </Cascader>,
    );
    fireEvent.click(screen.getByTestId('cascader-trigger'));
    fireEvent.click(screen.getByText('Almanya'));
    expect(handleChange).toHaveBeenCalledWith(['de']);
  });

  it('compound: derin secim yapar', () => {
    const handleChange = vi.fn();
    render(
      <Cascader options={sampleOptions} onValueChange={handleChange}>
        <Cascader.Trigger>
          <span>Konum secin</span>
        </Cascader.Trigger>
        <Cascader.Panel />
      </Cascader>,
    );
    fireEvent.click(screen.getByTestId('cascader-trigger'));
    fireEvent.click(screen.getByText('Türkiye'));
    fireEvent.click(screen.getByText('Ankara'));
    expect(handleChange).toHaveBeenCalledWith(['tr', 'ank']);
  });
});
