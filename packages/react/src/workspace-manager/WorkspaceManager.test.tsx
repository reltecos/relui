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
import { WorkspaceManager } from './WorkspaceManager';
import type { WorkspacePreset } from '@relteco/relui-core';

const PRESETS: WorkspacePreset[] = [
  { id: 'p1', name: 'Default Layout', layout: '{"root":"split"}', createdAt: 1000, isDefault: true },
  { id: 'p2', name: 'Compact', layout: '{"root":"tabs"}', createdAt: 2000, isDefault: false },
];

describe('WorkspaceManager', () => {
  it('root render edilir', () => {
    render(<WorkspaceManager defaultPresets={PRESETS} />);
    expect(screen.getByTestId('workspace-manager-root')).toBeInTheDocument();
  });

  it('role application set edilir', () => {
    render(<WorkspaceManager />);
    expect(screen.getByTestId('workspace-manager-root')).toHaveAttribute('role', 'application');
  });

  it('aria-label set edilir', () => {
    render(<WorkspaceManager />);
    expect(screen.getByTestId('workspace-manager-root')).toHaveAttribute('aria-label', 'Workspace manager');
  });

  it('toolbar render edilir', () => {
    render(<WorkspaceManager />);
    expect(screen.getByTestId('workspace-manager-toolbar')).toBeInTheDocument();
  });

  it('preset list render edilir', () => {
    render(<WorkspaceManager defaultPresets={PRESETS} />);
    expect(screen.getByTestId('workspace-manager-preset-list')).toBeInTheDocument();
  });

  it('preset itemleri render edilir', () => {
    render(<WorkspaceManager defaultPresets={PRESETS} />);
    const items = screen.getAllByTestId('workspace-manager-preset-item');
    expect(items).toHaveLength(2);
  });

  it('preset isimleri gosterilir', () => {
    render(<WorkspaceManager defaultPresets={PRESETS} />);
    expect(screen.getByText('Default Layout')).toBeInTheDocument();
    expect(screen.getByText('Compact')).toBeInTheDocument();
  });

  it('default badge gosterilir', () => {
    render(<WorkspaceManager defaultPresets={PRESETS} />);
    expect(screen.getByTestId('workspace-manager-preset-badge')).toHaveTextContent('Default');
  });

  it('aktif preset isaretlenir', () => {
    render(<WorkspaceManager defaultPresets={PRESETS} />);
    const items = screen.getAllByTestId('workspace-manager-preset-item');
    expect(items[0]).toHaveAttribute('data-active', 'true');
  });

  it('preset tiklaninca secilir', () => {
    render(<WorkspaceManager defaultPresets={PRESETS} />);
    const items = screen.getAllByTestId('workspace-manager-preset-item');
    fireEvent.click(items[1] as HTMLElement);
    expect(items[1]).toHaveAttribute('data-selected', 'true');
  });

  it('Add butonu ile yeni preset eklenir', () => {
    render(<WorkspaceManager />);
    fireEvent.click(screen.getByTestId('workspace-manager-btn-add'));
    expect(screen.getByTestId('workspace-manager-preset-item')).toBeInTheDocument();
  });

  it('actions bolumu render edilir', () => {
    render(<WorkspaceManager defaultPresets={PRESETS} />);
    expect(screen.getByTestId('workspace-manager-actions')).toBeInTheDocument();
  });

  it('Load butonu render edilir', () => {
    render(<WorkspaceManager defaultPresets={PRESETS} />);
    expect(screen.getByTestId('workspace-manager-btn-load')).toBeInTheDocument();
  });

  it('Delete butonu render edilir', () => {
    render(<WorkspaceManager defaultPresets={PRESETS} />);
    expect(screen.getByTestId('workspace-manager-btn-delete')).toBeInTheDocument();
  });

  it('Set Default butonu render edilir', () => {
    render(<WorkspaceManager defaultPresets={PRESETS} />);
    expect(screen.getByTestId('workspace-manager-btn-default')).toBeInTheDocument();
  });

  it('className root elemana eklenir', () => {
    render(<WorkspaceManager className="my-wm" />);
    expect(screen.getByTestId('workspace-manager-root').className).toContain('my-wm');
  });

  it('style root elemana eklenir', () => {
    render(<WorkspaceManager style={{ padding: '16px' }} />);
    expect(screen.getByTestId('workspace-manager-root')).toHaveStyle({ padding: '16px' });
  });

  it('classNames.root root elemana eklenir', () => {
    render(<WorkspaceManager classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('workspace-manager-root').className).toContain('custom-root');
  });

  it('classNames.toolbar toolbar elemana eklenir', () => {
    render(<WorkspaceManager classNames={{ toolbar: 'custom-tb' }} />);
    expect(screen.getByTestId('workspace-manager-toolbar').className).toContain('custom-tb');
  });

  it('classNames.presetList presetList elemana eklenir', () => {
    render(<WorkspaceManager classNames={{ presetList: 'custom-pl' }} />);
    expect(screen.getByTestId('workspace-manager-preset-list').className).toContain('custom-pl');
  });

  it('classNames.actions actions elemana eklenir', () => {
    render(<WorkspaceManager classNames={{ actions: 'custom-act' }} />);
    expect(screen.getByTestId('workspace-manager-actions').className).toContain('custom-act');
  });

  it('styles.root root elemana eklenir', () => {
    render(<WorkspaceManager styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('workspace-manager-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.toolbar toolbar elemana eklenir', () => {
    render(<WorkspaceManager styles={{ toolbar: { padding: '12px' } }} />);
    expect(screen.getByTestId('workspace-manager-toolbar')).toHaveStyle({ padding: '12px' });
  });

  it('styles.presetList presetList elemana eklenir', () => {
    render(<WorkspaceManager styles={{ presetList: { padding: '20px' } }} />);
    expect(screen.getByTestId('workspace-manager-preset-list')).toHaveStyle({ padding: '20px' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<WorkspaceManager ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe('WorkspaceManager (Compound)', () => {
  it('compound: toolbar render edilir', () => {
    render(
      <WorkspaceManager>
        <WorkspaceManager.Toolbar />
      </WorkspaceManager>,
    );
    expect(screen.getByTestId('workspace-manager-toolbar')).toBeInTheDocument();
  });

  it('compound: preset list render edilir', () => {
    render(
      <WorkspaceManager defaultPresets={PRESETS}>
        <WorkspaceManager.PresetList />
      </WorkspaceManager>,
    );
    expect(screen.getAllByTestId('workspace-manager-preset-item')).toHaveLength(2);
  });

  it('compound: actions render edilir', () => {
    render(
      <WorkspaceManager>
        <WorkspaceManager.Actions />
      </WorkspaceManager>,
    );
    expect(screen.getByTestId('workspace-manager-actions')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <WorkspaceManager classNames={{ toolbar: 'cmp-tb' }}>
        <WorkspaceManager.Toolbar />
      </WorkspaceManager>,
    );
    expect(screen.getByTestId('workspace-manager-toolbar').className).toContain('cmp-tb');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <WorkspaceManager styles={{ toolbar: { padding: '30px' } }}>
        <WorkspaceManager.Toolbar />
      </WorkspaceManager>,
    );
    expect(screen.getByTestId('workspace-manager-toolbar')).toHaveStyle({ padding: '30px' });
  });

  it('WorkspaceManager.Toolbar context disinda hata firlatir', () => {
    expect(() => render(<WorkspaceManager.Toolbar />)).toThrow();
  });

  it('WorkspaceManager.PresetList context disinda hata firlatir', () => {
    expect(() => render(<WorkspaceManager.PresetList />)).toThrow();
  });
});
