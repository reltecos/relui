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
import { FAB } from './FAB';
import type { FabAction } from '@relteco/relui-core';

// ── Helpers ──────────────────────────────────────────────

function makeActions(): FabAction[] {
  return [
    { id: 'add', label: 'Add item' },
    { id: 'edit', label: 'Edit item' },
    { id: 'share', label: 'Share' },
    { id: 'delete', label: 'Delete', disabled: true },
  ];
}

// ── Render ─────────────────────────────────────────────

describe('FAB render', () => {
  it('FAB render eder', () => {
    render(<FAB />);
    expect(screen.getByTestId('fab')).toBeInTheDocument();
  });

  it('ana buton render eder', () => {
    render(<FAB />);
    expect(screen.getByTestId('fab-button')).toBeInTheDocument();
  });

  it('varsayilan plus ikon render eder', () => {
    render(<FAB />);
    const btn = screen.getByTestId('fab-button');
    expect(btn.querySelector('svg')).toBeInTheDocument();
  });

  it('ozel ikon render eder', () => {
    render(<FAB icon={<span data-testid="custom-icon">+</span>} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('ref destekler', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<FAB ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('id prop destekler', () => {
    render(<FAB id="my-fab" />);
    expect(document.getElementById('my-fab')).toBeInTheDocument();
  });
});

// ── Open/Close ─────────────────────────────────────────

describe('FAB open/close', () => {
  it('varsayilan kapali render eder', () => {
    render(<FAB actions={makeActions()} />);
    expect(screen.queryByTestId('fab-action-add')).not.toBeInTheDocument();
  });

  it('tiklaninca acilir', () => {
    render(<FAB actions={makeActions()} />);
    fireEvent.click(screen.getByTestId('fab-button'));
    expect(screen.getByTestId('fab-action-add')).toBeInTheDocument();
    expect(screen.getByTestId('fab-action-edit')).toBeInTheDocument();
  });

  it('tekrar tiklaninca kapanir', () => {
    render(<FAB actions={makeActions()} />);
    fireEvent.click(screen.getByTestId('fab-button'));
    expect(screen.getByTestId('fab-action-add')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('fab-button'));
    expect(screen.queryByTestId('fab-action-add')).not.toBeInTheDocument();
  });

  it('controlled open ile acilir', () => {
    render(<FAB actions={makeActions()} open={true} />);
    expect(screen.getByTestId('fab-action-add')).toBeInTheDocument();
  });

  it('onOpenChange callback cagrilir', () => {
    const onOpenChange = vi.fn();
    render(<FAB actions={makeActions()} onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByTestId('fab-button'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});

// ── Actions ────────────────────────────────────────────

describe('FAB actions', () => {
  it('acik iken aksiyonlar render eder', () => {
    render(<FAB actions={makeActions()} open={true} />);
    expect(screen.getByTestId('fab-action-add')).toBeInTheDocument();
    expect(screen.getByTestId('fab-action-edit')).toBeInTheDocument();
    expect(screen.getByTestId('fab-action-share')).toBeInTheDocument();
    expect(screen.getByTestId('fab-action-delete')).toBeInTheDocument();
  });

  it('aksiyon label render eder', () => {
    render(<FAB actions={makeActions()} open={true} />);
    expect(screen.getByText('Add item')).toBeInTheDocument();
    expect(screen.getByText('Edit item')).toBeInTheDocument();
  });

  it('aksiyon tiklaninca onSelectAction cagrilir', () => {
    const onSelectAction = vi.fn();
    render(<FAB actions={makeActions()} open={true} onSelectAction={onSelectAction} />);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Add item' }));
    expect(onSelectAction).toHaveBeenCalledWith('add');
  });

  it('aksiyon tiklaninca kapanir', () => {
    render(<FAB actions={makeActions()} open={true} />);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Add item' }));
    expect(screen.queryByTestId('fab-action-add')).not.toBeInTheDocument();
  });

  it('disabled aksiyon aria-disabled tasir', () => {
    render(<FAB actions={makeActions()} open={true} />);
    const deleteBtn = screen.getByRole('menuitem', { name: 'Delete' });
    expect(deleteBtn).toHaveAttribute('aria-disabled', 'true');
  });

  it('aksiyonsuz FAB speed dial gostermez', () => {
    render(<FAB open={true} />);
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });
});

// ── Overlay ────────────────────────────────────────────

describe('FAB overlay', () => {
  it('showOverlay=false iken overlay yok', () => {
    render(<FAB actions={makeActions()} open={true} />);
    expect(screen.queryByTestId('fab-overlay')).not.toBeInTheDocument();
  });

  it('showOverlay=true + acik iken overlay render eder', () => {
    render(<FAB actions={makeActions()} open={true} showOverlay />);
    expect(screen.getByTestId('fab-overlay')).toBeInTheDocument();
  });

  it('overlay tiklaninca kapanir', () => {
    render(<FAB actions={makeActions()} open={true} showOverlay />);
    fireEvent.click(screen.getByTestId('fab-overlay'));
    expect(screen.queryByTestId('fab-overlay')).not.toBeInTheDocument();
  });
});

// ── Positions ──────────────────────────────────────────

describe('FAB positions', () => {
  it.each(['bottom-right', 'bottom-left', 'top-right', 'top-left'] as const)(
    '%s pozisyonu render eder',
    (pos) => {
      render(<FAB position={pos} />);
      expect(screen.getByTestId('fab')).toBeInTheDocument();
    },
  );
});

// ── Sizes ──────────────────────────────────────────────

describe('FAB sizes', () => {
  it.each(['sm', 'md', 'lg'] as const)('%s boyutu render eder', (size) => {
    render(<FAB size={size} />);
    expect(screen.getByTestId('fab')).toBeInTheDocument();
  });
});

// ── Variants ──────────────────────────────────────────

describe('FAB variants', () => {
  it.each(['filled', 'secondary', 'danger'] as const)('%s variant render eder', (v) => {
    render(<FAB variant={v} />);
    expect(screen.getByTestId('fab')).toBeInTheDocument();
  });
});

// ── A11y ──────────────────────────────────────────────

describe('FAB a11y', () => {
  it('button type=button', () => {
    render(<FAB />);
    expect(screen.getByTestId('fab-button')).toHaveAttribute('type', 'button');
  });

  it('kapali iken aria-expanded false', () => {
    render(<FAB actions={makeActions()} />);
    expect(screen.getByTestId('fab-button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('acik iken aria-expanded true', () => {
    render(<FAB actions={makeActions()} open={true} />);
    expect(screen.getByTestId('fab-button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('varsayilan aria-label', () => {
    render(<FAB />);
    expect(screen.getByTestId('fab-button')).toHaveAttribute('aria-label', 'Open actions');
  });

  it('ozel aria-label', () => {
    render(<FAB aria-label="Ekle menusu" />);
    expect(screen.getByTestId('fab-button')).toHaveAttribute('aria-label', 'Ekle menusu');
  });

  it('aksiyonlar varken aria-haspopup', () => {
    render(<FAB actions={makeActions()} />);
    expect(screen.getByTestId('fab-button')).toHaveAttribute('aria-haspopup', 'true');
  });

  it('aksiyon butonlari role=menuitem', () => {
    render(<FAB actions={makeActions()} open={true} />);
    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems.length).toBe(4);
  });
});

// ── Slot API ──────────────────────────────────────────

describe('FAB slot API', () => {
  it('className root slot', () => {
    render(<FAB className="custom-fab" />);
    expect(screen.getByTestId('fab').className).toContain('custom-fab');
  });

  it('style root slot', () => {
    render(<FAB style={{ opacity: 0.5 }} />);
    expect(screen.getByTestId('fab').style.opacity).toBe('0.5');
  });

  it('classNames.root slot', () => {
    render(<FAB classNames={{ root: 'my-fab' }} />);
    expect(screen.getByTestId('fab').className).toContain('my-fab');
  });

  it('styles.root slot', () => {
    render(<FAB styles={{ root: { fontSize: '20px' } }} />);
    expect(screen.getByTestId('fab').style.fontSize).toBe('20px');
  });
});

// ── Custom renderActionIcon ─────────────────────────────

describe('FAB renderActionIcon', () => {
  it('ozel aksiyon ikonu render eder', () => {
    render(
      <FAB
        actions={makeActions()}
        open={true}
        renderActionIcon={(action) => (
          <span data-testid={`icon-${action.id}`}>icon</span>
        )}
      />,
    );
    expect(screen.getByTestId('icon-add')).toBeInTheDocument();
    expect(screen.getByTestId('icon-edit')).toBeInTheDocument();
  });
});

// ── Compound API ──────────────────────────────────────────

describe('FAB (Compound)', () => {
  it('compound: FAB.Icon render edilir', () => {
    render(
      <FAB>
        <FAB.Icon><span data-testid="custom-plus">+</span></FAB.Icon>
      </FAB>,
    );
    expect(screen.getByTestId('fab-icon')).toBeInTheDocument();
    expect(screen.getByTestId('custom-plus')).toBeInTheDocument();
  });

  it('compound: FAB.Label render edilir', () => {
    render(
      <FAB>
        <FAB.Icon><span>+</span></FAB.Icon>
        <FAB.Label>Ekle</FAB.Label>
      </FAB>,
    );
    expect(screen.getByTestId('fab-label')).toBeInTheDocument();
    expect(screen.getByTestId('fab-label')).toHaveTextContent('Ekle');
  });

  it('compound: children ile buton render edilir', () => {
    render(
      <FAB>
        <FAB.Icon><span>+</span></FAB.Icon>
      </FAB>,
    );
    expect(screen.getByTestId('fab')).toBeInTheDocument();
    expect(screen.getByTestId('fab-button')).toBeInTheDocument();
  });

  it('compound: tiklaninca toggle calisir', () => {
    const onOpenChange = vi.fn();
    render(
      <FAB actions={makeActions()} onOpenChange={onOpenChange}>
        <FAB.Icon><span>+</span></FAB.Icon>
      </FAB>,
    );
    fireEvent.click(screen.getByTestId('fab-button'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('compound: context disinda hata firlatir', () => {
    expect(() => {
      render(<FAB.Icon><span>+</span></FAB.Icon>);
    }).toThrow('FAB compound sub-components must be used within <FAB>.');
  });
});
