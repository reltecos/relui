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
import { Accordion } from './Accordion';
import { useState } from 'react';

// ── Helpers ──

const defaultItems = [
  { id: 'a', title: 'Bolum A', content: <p>Icerik A</p> },
  { id: 'b', title: 'Bolum B', content: <p>Icerik B</p> },
  { id: 'c', title: 'Bolum C', content: <p>Icerik C</p> },
];

function TestAccordion(props: Partial<React.ComponentProps<typeof Accordion>> = {}) {
  return <Accordion items={defaultItems} {...props} />;
}

function ControlledAccordion(props: Partial<React.ComponentProps<typeof Accordion>> = {}) {
  const [expanded, setExpanded] = useState<string[]>([]);
  return (
    <Accordion
      items={defaultItems}
      expanded={expanded}
      onExpandChange={setExpanded}
      {...props}
    />
  );
}

describe('Accordion', () => {
  // ── Render ──

  it('tum itemler render edilir', () => {
    render(<TestAccordion />);
    expect(screen.getByText('Bolum A')).toBeInTheDocument();
    expect(screen.getByText('Bolum B')).toBeInTheDocument();
    expect(screen.getByText('Bolum C')).toBeInTheDocument();
  });

  it('varsayilan olarak hepsi kapali', () => {
    render(<TestAccordion />);
    expect(screen.queryByText('Icerik A')).not.toBeInTheDocument();
    expect(screen.queryByText('Icerik B')).not.toBeInTheDocument();
    expect(screen.queryByText('Icerik C')).not.toBeInTheDocument();
  });

  it('defaultExpanded ile belirtilen item acik baslar', () => {
    render(<TestAccordion defaultExpanded={['a']} />);
    expect(screen.getByText('Icerik A')).toBeInTheDocument();
    expect(screen.queryByText('Icerik B')).not.toBeInTheDocument();
  });

  // ── Toggle ──

  it('trigger tiklaninca icerik acilir', () => {
    render(<TestAccordion />);
    fireEvent.click(screen.getByTestId('accordion-trigger-a'));
    expect(screen.getByText('Icerik A')).toBeInTheDocument();
  });

  it('acik item tekrar tiklaninca kapanir', () => {
    render(<TestAccordion defaultExpanded={['a']} />);
    expect(screen.getByText('Icerik A')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('accordion-trigger-a'));
    expect(screen.queryByText('Icerik A')).not.toBeInTheDocument();
  });

  it('single modda baska item acinca oncekisi kapanir', () => {
    render(<TestAccordion defaultExpanded={['a']} />);
    expect(screen.getByText('Icerik A')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('accordion-trigger-b'));
    expect(screen.queryByText('Icerik A')).not.toBeInTheDocument();
    expect(screen.getByText('Icerik B')).toBeInTheDocument();
  });

  // ── Multiple Mode ──

  it('allowMultiple modda birden fazla item acilabilir', () => {
    render(<TestAccordion allowMultiple />);
    fireEvent.click(screen.getByTestId('accordion-trigger-a'));
    fireEvent.click(screen.getByTestId('accordion-trigger-b'));
    expect(screen.getByText('Icerik A')).toBeInTheDocument();
    expect(screen.getByText('Icerik B')).toBeInTheDocument();
  });

  it('allowMultiple modda acik item tiklaninca sadece o kapanir', () => {
    render(<TestAccordion allowMultiple defaultExpanded={['a', 'b']} />);
    fireEvent.click(screen.getByTestId('accordion-trigger-a'));
    expect(screen.queryByText('Icerik A')).not.toBeInTheDocument();
    expect(screen.getByText('Icerik B')).toBeInTheDocument();
  });

  // ── Disabled ──

  it('disabled item tiklaninca acilmaz', () => {
    const items = [
      { id: 'a', title: 'Disabled', content: <p>Icerik</p>, disabled: true },
    ];
    render(<Accordion items={items} />);
    fireEvent.click(screen.getByTestId('accordion-trigger-a'));
    expect(screen.queryByText('Icerik')).not.toBeInTheDocument();
  });

  it('disabled item aria-disabled set edilir', () => {
    const items = [
      { id: 'a', title: 'Disabled', content: <p>Icerik</p>, disabled: true },
    ];
    render(<Accordion items={items} />);
    expect(screen.getByTestId('accordion-trigger-a')).toBeDisabled();
  });

  // ── Controlled ──

  it('controlled mod — expanded prop ile acilir', () => {
    render(<ControlledAccordion />);
    expect(screen.queryByText('Icerik A')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('accordion-trigger-a'));
    expect(screen.getByText('Icerik A')).toBeInTheDocument();
  });

  it('controlled mod — onExpandChange cagirilir', () => {
    const onChange = vi.fn();
    render(
      <Accordion
        items={defaultItems}
        expanded={[]}
        onExpandChange={onChange}
      />,
    );
    fireEvent.click(screen.getByTestId('accordion-trigger-a'));
    expect(onChange).toHaveBeenCalledWith(['a']);
  });

  it('controlled mod — baska item acinca oncekisi kapanir (single)', () => {
    const onChange = vi.fn();
    render(
      <Accordion
        items={defaultItems}
        expanded={['a']}
        onExpandChange={onChange}
      />,
    );
    fireEvent.click(screen.getByTestId('accordion-trigger-b'));
    expect(onChange).toHaveBeenCalledWith(['b']);
  });

  // ── A11y ──

  it('trigger aria-expanded dogrulanir', () => {
    render(<TestAccordion />);
    const trigger = screen.getByTestId('accordion-trigger-a');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('trigger aria-controls content id ile eslesir', () => {
    render(<TestAccordion defaultExpanded={['a']} />);
    const trigger = screen.getByTestId('accordion-trigger-a');
    const controlsId = trigger.getAttribute('aria-controls');
    expect(controlsId).toBeTruthy();

    const content = screen.getByTestId('accordion-content-a');
    expect(content.id).toBe(controlsId);
  });

  it('content role=region ve aria-labelledby vardir', () => {
    render(<TestAccordion defaultExpanded={['a']} />);
    const content = screen.getByTestId('accordion-content-a');
    expect(content).toHaveAttribute('role', 'region');

    const labelledBy = content.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();

    const trigger = screen.getByTestId('accordion-trigger-a');
    expect(trigger.id).toBe(labelledBy);
  });

  it('trigger button type=button', () => {
    render(<TestAccordion />);
    expect(screen.getByTestId('accordion-trigger-a')).toHaveAttribute('type', 'button');
  });

  // ── Icon ──

  it('chevron ikonu render edilir', () => {
    render(<TestAccordion />);
    const trigger = screen.getByTestId('accordion-trigger-a');
    const svg = trigger.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('acik itemde ikon rotate(180deg) olur', () => {
    render(<TestAccordion defaultExpanded={['a']} />);
    const trigger = screen.getByTestId('accordion-trigger-a');
    const iconSpan = trigger.querySelector('[aria-hidden="true"]');
    expect(iconSpan).toHaveStyle({ transform: 'rotate(180deg)' });
  });

  it('kapali itemde ikon rotate(0deg) olur', () => {
    render(<TestAccordion />);
    const trigger = screen.getByTestId('accordion-trigger-a');
    const iconSpan = trigger.querySelector('[aria-hidden="true"]');
    expect(iconSpan).toHaveStyle({ transform: 'rotate(0deg)' });
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<TestAccordion className="my-accordion" />);
    const root = screen.getByTestId('accordion-root');
    expect(root.className).toContain('my-accordion');
  });

  it('style root elemana eklenir', () => {
    render(<TestAccordion style={{ padding: '20px' }} />);
    expect(screen.getByTestId('accordion-root')).toHaveStyle({ padding: '20px' });
  });

  // ── Slot API: classNames ──

  it('classNames.item item elemana eklenir', () => {
    render(
      <TestAccordion classNames={{ item: 'custom-item' }} />,
    );
    const item = screen.getByTestId('accordion-item-a');
    expect(item.className).toContain('custom-item');
  });

  it('classNames.trigger trigger elemana eklenir', () => {
    render(
      <TestAccordion classNames={{ trigger: 'custom-trigger' }} />,
    );
    const trigger = screen.getByTestId('accordion-trigger-a');
    expect(trigger.className).toContain('custom-trigger');
  });

  it('classNames.content content elemana eklenir', () => {
    render(
      <TestAccordion defaultExpanded={['a']} classNames={{ content: 'custom-content' }} />,
    );
    const content = screen.getByTestId('accordion-content-a');
    expect(content.className).toContain('custom-content');
  });

  // ── Slot API: styles ──

  it('styles.item item elemana eklenir', () => {
    render(
      <TestAccordion styles={{ item: { padding: '24px' } }} />,
    );
    expect(screen.getByTestId('accordion-item-a')).toHaveStyle({ padding: '24px' });
  });

  it('styles.trigger trigger elemana eklenir', () => {
    render(
      <TestAccordion styles={{ trigger: { fontSize: '18px' } }} />,
    );
    expect(screen.getByTestId('accordion-trigger-a')).toHaveStyle({ fontSize: '18px' });
  });

  it('styles.content content elemana eklenir', () => {
    render(
      <TestAccordion defaultExpanded={['a']} styles={{ content: { letterSpacing: '0.05em' } }} />,
    );
    expect(screen.getByTestId('accordion-content-a')).toHaveStyle({ letterSpacing: '0.05em' });
  });

  it('styles.root root elemana eklenir', () => {
    render(
      <TestAccordion styles={{ root: { padding: '20px' } }} />,
    );
    expect(screen.getByTestId('accordion-root')).toHaveStyle({ padding: '20px' });
  });

  it('styles.icon icon elemana eklenir', () => {
    render(
      <TestAccordion styles={{ icon: { opacity: '0.5' } }} />,
    );
    expect(screen.getByTestId('accordion-icon-a')).toHaveStyle({ opacity: '0.5' });
  });

  // ── ReactNode title ──

  it('title ReactNode olabilir', () => {
    const items = [
      { id: 'a', title: <strong data-testid="bold-title">Kalin Baslik</strong>, content: <p>Icerik</p> },
    ];
    render(<Accordion items={items} />);
    expect(screen.getByTestId('bold-title')).toBeInTheDocument();
  });

  // ── Root testid ──

  it('root data-testid render edilir', () => {
    render(<TestAccordion />);
    expect(screen.getByTestId('accordion-root')).toBeInTheDocument();
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<TestAccordion ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('Accordion (Compound)', () => {
  it('compound: item render edilir', () => {
    render(
      <Accordion>
        <Accordion.Item id="a">
          <Accordion.Trigger>Bolum A</Accordion.Trigger>
          <Accordion.Content>Icerik A</Accordion.Content>
        </Accordion.Item>
      </Accordion>,
    );
    expect(screen.getByTestId('accordion-item-a')).toBeInTheDocument();
    expect(screen.getByTestId('accordion-trigger-a')).toBeInTheDocument();
  });

  it('compound: trigger tiklaninca icerik acilir', () => {
    render(
      <Accordion>
        <Accordion.Item id="a">
          <Accordion.Trigger>Bolum A</Accordion.Trigger>
          <Accordion.Content>Icerik A</Accordion.Content>
        </Accordion.Item>
      </Accordion>,
    );
    expect(screen.queryByText('Icerik A')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('accordion-trigger-a'));
    expect(screen.getByText('Icerik A')).toBeInTheDocument();
  });

  it('compound: acik item tekrar tiklaninca kapanir', () => {
    render(
      <Accordion defaultExpanded={['a']}>
        <Accordion.Item id="a">
          <Accordion.Trigger>Bolum A</Accordion.Trigger>
          <Accordion.Content>Icerik A</Accordion.Content>
        </Accordion.Item>
      </Accordion>,
    );
    expect(screen.getByText('Icerik A')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('accordion-trigger-a'));
    expect(screen.queryByText('Icerik A')).not.toBeInTheDocument();
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <Accordion defaultExpanded={['a']} classNames={{ trigger: 'cmp-trigger' }}>
        <Accordion.Item id="a">
          <Accordion.Trigger>Bolum A</Accordion.Trigger>
          <Accordion.Content>Icerik A</Accordion.Content>
        </Accordion.Item>
      </Accordion>,
    );
    expect(screen.getByTestId('accordion-trigger-a').className).toContain('cmp-trigger');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <Accordion defaultExpanded={['a']} styles={{ content: { padding: '32px' } }}>
        <Accordion.Item id="a">
          <Accordion.Trigger>Bolum A</Accordion.Trigger>
          <Accordion.Content>Icerik A</Accordion.Content>
        </Accordion.Item>
      </Accordion>,
    );
    expect(screen.getByTestId('accordion-content-a')).toHaveStyle({ padding: '32px' });
  });
});
