/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useCallback, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DockLayout } from './DockLayout';
import type { DockLayoutComponentProps } from './DockLayout';
import type { DockSplitNode, DockPanelConfig } from '@relteco/relui-core';

const meta: Meta<typeof DockLayout> = {
  title: 'Window Manager/DockLayout',
  component: DockLayout,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof DockLayout>;

// ── Shared panel content renderer ───────────────────

const panelContent = (id: string, title: string) => (
  <div style={{ padding: 16, height: '100%', boxSizing: 'border-box' }}>
    <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600 }}>{title}</h3>
    <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
      Panel ID: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 3 }}>{id}</code>
    </p>
  </div>
);

// ── 1. Default — Interactive starting point ─────────

function DefaultStory() {
  const [panels, setPanels] = useState<DockPanelConfig[]>([
    { id: 'panel-1', title: 'Panel 1' },
    { id: 'panel-2', title: 'Panel 2' },
    { id: 'panel-3', title: 'Panel 3' },
  ]);
  const counterRef = useRef(4);

  const addPanel = useCallback(() => {
    const id = `panel-${counterRef.current}`;
    const title = `Panel ${counterRef.current}`;
    counterRef.current++;
    setPanels((prev) => [...prev, { id, title }]);
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '8px 16px',
        borderBottom: '1px solid #e2e8f0',
        background: '#f8fafc',
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        fontSize: 13,
        flexShrink: 0,
      }}>
        <button
          onClick={addPanel}
          style={{
            padding: '4px 12px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          + Add Panel
        </button>
        <span style={{ color: '#94a3b8', fontSize: 11 }}>
          Drag tabs to split, float, or reorder. Right-click for context menu.
        </span>
      </div>
      <div style={{ flex: 1 }}>
        <DockLayout
          panels={panels}
          renderPanel={panelContent}
        />
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <DefaultStory />,
};

// ── 2. VisualStudioLayout — Full IDE simulation ─────

function VisualStudioLayoutStory() {
  const initialRoot: DockSplitNode = {
    type: 'split',
    id: 'root',
    direction: 'horizontal',
    children: [
      {
        type: 'group',
        id: 'left-panel',
        panelIds: ['toolbox'],
        activePanelId: 'toolbox',
      },
      {
        type: 'split',
        id: 'center-split',
        direction: 'vertical',
        children: [
          {
            type: 'group',
            id: 'editors',
            panelIds: ['index-cs', 'app-cs'],
            activePanelId: 'index-cs',
          },
          {
            type: 'group',
            id: 'bottom-panel',
            panelIds: ['error-list', 'output'],
            activePanelId: 'error-list',
          },
        ],
        sizes: [0.65, 0.35],
      },
      {
        type: 'split',
        id: 'right-split',
        direction: 'vertical',
        children: [
          {
            type: 'group',
            id: 'right-top',
            panelIds: ['solution-explorer'],
            activePanelId: 'solution-explorer',
          },
          {
            type: 'group',
            id: 'right-bottom',
            panelIds: ['properties'],
            activePanelId: 'properties',
          },
        ],
        sizes: [0.5, 0.5],
      },
    ],
    sizes: [0.18, 0.58, 0.24],
  };

  const panels: DockPanelConfig[] = [
    { id: 'toolbox', title: 'Toolbox' },
    { id: 'solution-explorer', title: 'Solution Explorer' },
    { id: 'properties', title: 'Properties' },
    { id: 'index-cs', title: 'index.cs' },
    { id: 'app-cs', title: 'app.cs' },
    { id: 'error-list', title: 'Error List' },
    { id: 'output', title: 'Output' },
    { id: 'server-explorer', title: 'Server Explorer' },
    { id: 'find-results', title: 'Find Results' },
  ];

  const renderVSPanel = (id: string, title: string) => {
    switch (id) {
      case 'toolbox':
        return (
          <div style={{ padding: 8, fontSize: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: '#475569' }}>Common Controls</div>
            {['Button', 'Label', 'TextBox', 'ComboBox', 'ListBox', 'CheckBox', 'RadioButton', 'DataGridView', 'PictureBox', 'Panel'].map((ctrl) => (
              <div key={ctrl} style={{ padding: '3px 8px', cursor: 'default', borderBottom: '1px solid #f1f5f9' }}>{ctrl}</div>
            ))}
          </div>
        );
      case 'solution-explorer':
        return (
          <div style={{ padding: 8, fontSize: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: '#475569' }}>Solution 'MyApp' (2 projects)</div>
            <div style={{ paddingLeft: 8 }}>
              <div style={{ fontWeight: 500 }}>MyApp</div>
              <div style={{ paddingLeft: 16, color: '#64748b' }}>Properties</div>
              <div style={{ paddingLeft: 16, color: '#64748b' }}>References</div>
              <div style={{ paddingLeft: 16 }}>index.cs</div>
              <div style={{ paddingLeft: 16 }}>app.cs</div>
              <div style={{ paddingLeft: 16 }}>Program.cs</div>
            </div>
            <div style={{ paddingLeft: 8, marginTop: 4 }}>
              <div style={{ fontWeight: 500 }}>MyApp.Tests</div>
              <div style={{ paddingLeft: 16, color: '#64748b' }}>UnitTest1.cs</div>
            </div>
          </div>
        );
      case 'properties':
        return (
          <div style={{ padding: 8, fontSize: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: '#475569' }}>Button1 Properties</div>
            {[
              ['Name', 'Button1'],
              ['Text', 'Click Me'],
              ['Size', '100, 30'],
              ['Location', '50, 50'],
              ['BackColor', 'Control'],
              ['Font', 'Segoe UI, 9pt'],
              ['Enabled', 'True'],
              ['Visible', 'True'],
            ].map(([key, val]) => (
              <div key={key} style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', padding: '2px 0' }}>
                <span style={{ flex: 1, color: '#64748b' }}>{key}</span>
                <span>{val}</span>
              </div>
            ))}
          </div>
        );
      case 'index-cs':
        return (
          <div style={{ padding: 12, fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6, background: '#fafafa' }}>
            <div><span style={{ color: '#7c3aed' }}>using</span> System;</div>
            <div><span style={{ color: '#7c3aed' }}>using</span> System.Windows.Forms;</div>
            <div />
            <div><span style={{ color: '#7c3aed' }}>namespace</span> <span style={{ color: '#2563eb' }}>MyApp</span></div>
            <div>{'{'}</div>
            <div>{'  '}<span style={{ color: '#7c3aed' }}>public partial class</span> <span style={{ color: '#2563eb' }}>MainForm</span> : <span style={{ color: '#2563eb' }}>Form</span></div>
            <div>{'  {'}</div>
            <div>{'    '}<span style={{ color: '#7c3aed' }}>public</span> <span style={{ color: '#2563eb' }}>MainForm</span>()</div>
            <div>{'    {'}</div>
            <div>{'      '}InitializeComponent();</div>
            <div>{'    }'}</div>
            <div>{'  }'}</div>
            <div>{'}'}</div>
          </div>
        );
      case 'app-cs':
        return (
          <div style={{ padding: 12, fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6, background: '#fafafa' }}>
            <div><span style={{ color: '#7c3aed' }}>using</span> System;</div>
            <div />
            <div><span style={{ color: '#7c3aed' }}>namespace</span> <span style={{ color: '#2563eb' }}>MyApp</span></div>
            <div>{'{'}</div>
            <div>{'  '}<span style={{ color: '#7c3aed' }}>static class</span> <span style={{ color: '#2563eb' }}>Program</span></div>
            <div>{'  {'}</div>
            <div>{'    ['}STAThread{']'}</div>
            <div>{'    '}<span style={{ color: '#7c3aed' }}>static void</span> Main()</div>
            <div>{'    {'}</div>
            <div>{'      '}Application.Run(<span style={{ color: '#7c3aed' }}>new</span> MainForm());</div>
            <div>{'    }'}</div>
            <div>{'  }'}</div>
            <div>{'}'}</div>
          </div>
        );
      case 'error-list':
        return (
          <div style={{ padding: 8, fontSize: 12 }}>
            <div style={{ display: 'flex', gap: 16, padding: '4px 0', borderBottom: '1px solid #e2e8f0', fontWeight: 600, color: '#475569' }}>
              <span style={{ width: 60 }}>Code</span>
              <span style={{ flex: 1 }}>Description</span>
              <span style={{ width: 80 }}>File</span>
              <span style={{ width: 40 }}>Line</span>
            </div>
            {[
              ['CS0001', 'Syntax error, unexpected token', 'index.cs', '15'],
              ['CS0042', 'Missing assembly reference', 'app.cs', '3'],
              ['CS0103', "The name 'foo' does not exist", 'index.cs', '22'],
            ].map(([code, desc, file, line], i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '3px 0', borderBottom: '1px solid #f8fafc', color: '#ef4444' }}>
                <span style={{ width: 60, fontFamily: 'monospace' }}>{code}</span>
                <span style={{ flex: 1 }}>{desc}</span>
                <span style={{ width: 80, color: '#64748b' }}>{file}</span>
                <span style={{ width: 40, color: '#64748b' }}>{line}</span>
              </div>
            ))}
          </div>
        );
      case 'output':
        return (
          <div style={{ padding: 8, fontFamily: 'monospace', fontSize: 11, lineHeight: 1.5, color: '#475569' }}>
            <div>Build started...</div>
            <div>1&gt;------ Build started: Project: MyApp ------</div>
            <div style={{ color: '#22c55e' }}>1&gt;MyApp -&gt; bin\Debug\MyApp.exe</div>
            <div>========== Build: 1 succeeded, 0 failed ==========</div>
          </div>
        );
      case 'server-explorer':
        return (
          <div style={{ padding: 8, fontSize: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: '#475569' }}>Data Connections</div>
            <div style={{ paddingLeft: 8 }}>
              <div>localhost.MyDatabase</div>
              <div style={{ paddingLeft: 16, color: '#64748b' }}>Tables</div>
              <div style={{ paddingLeft: 16, color: '#64748b' }}>Views</div>
              <div style={{ paddingLeft: 16, color: '#64748b' }}>Stored Procedures</div>
            </div>
          </div>
        );
      case 'find-results':
        return (
          <div style={{ padding: 8, fontFamily: 'monospace', fontSize: 11, lineHeight: 1.5, color: '#475569' }}>
            <div>Find all "Button", Entire Solution, 3 result(s)</div>
            <div style={{ paddingLeft: 8 }}>index.cs(5): Button button1 = new Button();</div>
            <div style={{ paddingLeft: 8 }}>index.cs(12): button1.Text = "Click";</div>
            <div style={{ paddingLeft: 8 }}>app.cs(8): Application.Run(new MainForm());</div>
          </div>
        );
      default:
        return panelContent(id, title);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '6px 16px',
        background: '#1e293b',
        color: '#94a3b8',
        fontSize: 11,
        borderBottom: '1px solid #334155',
        flexShrink: 0,
      }}>
        Visual Studio Layout Simulation — Drag tabs to rearrange, right-click for options, double-click to maximize
      </div>
      <div style={{ flex: 1 }}>
        <DockLayout
          initialRoot={initialRoot}
          panels={panels}
          renderPanel={renderVSPanel}
        />
      </div>
    </div>
  );
}

export const VisualStudioLayout: Story = {
  render: () => <VisualStudioLayoutStory />,
};

// ── 3. DragAndDrop — Interactive tutorial ────────────

function DragAndDropStory() {
  const [log, setLog] = useState<string[]>([]);

  const addLog = useCallback((msg: string) => {
    setLog((prev) => [...prev.slice(-8), `${new Date().toLocaleTimeString()} — ${msg}`]);
  }, []);

  const initialRoot: DockSplitNode = {
    type: 'split',
    id: 'root',
    direction: 'horizontal',
    children: [
      { type: 'group', id: 'g1', panelIds: ['panel-a', 'panel-b'], activePanelId: 'panel-a' },
      { type: 'group', id: 'g2', panelIds: ['panel-c', 'panel-d'], activePanelId: 'panel-c' },
    ],
    sizes: [0.5, 0.5],
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '8px 16px',
        background: '#fef3c7',
        borderBottom: '1px solid #fbbf24',
        fontSize: 12,
        fontWeight: 500,
        color: '#92400e',
        flexShrink: 0,
      }}>
        Tutorial: Drag a tab to the edge of a group to split. Drag to center to add as tab.
        Drag to empty space to float. Right-click for context menu.
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <DockLayout
            initialRoot={initialRoot}
            panels={[
              { id: 'panel-a', title: 'Panel A' },
              { id: 'panel-b', title: 'Panel B' },
              { id: 'panel-c', title: 'Panel C' },
              { id: 'panel-d', title: 'Panel D' },
            ]}
            renderPanel={panelContent}
            onPanelClose={(id) => addLog(`Panel closed: ${id}`)}
            onActivePanelChange={(id) => addLog(`Active: ${id}`)}
            onPanelFloat={(id) => addLog(`Float: ${id}`)}
          />
        </div>
        {log.length > 0 && (
          <div style={{
            padding: 8,
            background: '#0f172a',
            borderTop: '1px solid #334155',
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#94a3b8',
            maxHeight: 120,
            overflow: 'auto',
            flexShrink: 0,
          }}>
            {log.map((entry, i) => (
              <div key={i}>{entry}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const DragAndDrop: Story = {
  render: () => <DragAndDropStory />,
};

// ── 4. FloatingPanels — Float demo ──────────────────

export const FloatingPanels: Story = {
  render: () => {
    const initialRoot: DockSplitNode = {
      type: 'split',
      id: 'root',
      direction: 'horizontal',
      children: [
        { type: 'group', id: 'main', panelIds: ['editor', 'preview'], activePanelId: 'editor' },
        { type: 'group', id: 'sidebar', panelIds: ['settings'], activePanelId: 'settings' },
      ],
      sizes: [0.7, 0.3],
    };

    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          padding: '8px 16px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          fontSize: 12,
          color: '#64748b',
          flexShrink: 0,
        }}>
          Right-click any tab and select "Float" to create a floating panel. Drag title bar to move. Use edges to resize.
        </div>
        <div style={{ flex: 1 }}>
          <DockLayout
            initialRoot={initialRoot}
            panels={[
              { id: 'editor', title: 'Editor' },
              { id: 'preview', title: 'Preview' },
              { id: 'settings', title: 'Settings' },
            ]}
            renderPanel={panelContent}
          />
        </div>
      </div>
    );
  },
};

// ── 5. ContextMenu — Right-click demo ───────────────

export const ContextMenu: Story = {
  render: () => (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '8px 16px',
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        fontSize: 12,
        color: '#64748b',
        flexShrink: 0,
      }}>
        Right-click any tab to see context menu: Float, Auto-hide (4 sides), Maximize, Close
      </div>
      <div style={{ flex: 1 }}>
        <DockLayout
          panels={[
            { id: 'files', title: 'Files' },
            { id: 'search', title: 'Search' },
            { id: 'console', title: 'Console' },
            { id: 'network', title: 'Network' },
          ]}
          renderPanel={panelContent}
        />
      </div>
    </div>
  ),
};

// ── 6. CustomSlotStyles — Dark themed ───────────────

export const CustomSlotStyles: Story = {
  render: () => {
    const initialRoot: DockSplitNode = {
      type: 'split',
      id: 'root',
      direction: 'horizontal',
      children: [
        { type: 'group', id: 'g1', panelIds: ['nav'], activePanelId: 'nav' },
        {
          type: 'split',
          id: 'vs',
          direction: 'vertical',
          children: [
            { type: 'group', id: 'g2', panelIds: ['editor', 'preview'], activePanelId: 'editor' },
            { type: 'group', id: 'g3', panelIds: ['terminal'], activePanelId: 'terminal' },
          ],
          sizes: [0.7, 0.3],
        },
      ],
      sizes: [0.22, 0.78],
    };

    const darkStyles: DockLayoutComponentProps['styles'] = {
      root: { background: '#0f172a' },
      group: { background: '#0f172a' },
      tabBar: { background: '#1e293b', borderBottom: '1px solid #334155' },
      tab: { color: '#94a3b8' },
      panelContent: { background: '#0f172a', color: '#e2e8f0', padding: '12px' },
      resizeHandle: { background: '#334155' },
      floatingPanel: { background: '#1e293b' },
      floatingTitleBar: { background: '#0f172a', borderBottom: '1px solid #334155' },
      autoHideBar: { background: '#1e293b' },
      autoHideTab: { color: '#94a3b8' },
    };

    return (
      <div style={{ height: '100vh' }}>
        <DockLayout
          initialRoot={initialRoot}
          panels={[
            { id: 'nav', title: 'Navigator', closable: false },
            { id: 'editor', title: 'main.tsx' },
            { id: 'preview', title: 'Preview' },
            { id: 'terminal', title: 'Terminal' },
          ]}
          styles={darkStyles}
          classNames={{ root: 'dark-dock' }}
          renderPanel={(id, title) => (
            <div style={{ fontFamily: 'monospace', fontSize: 13 }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#e2e8f0' }}>{title}</h3>
              {id === 'terminal' && (
                <div>
                  <div style={{ color: '#22c55e' }}>$ pnpm build</div>
                  <div style={{ color: '#94a3b8' }}>Building packages...</div>
                  <div style={{ color: '#22c55e' }}>Build completed in 2.3s</div>
                </div>
              )}
              {id === 'editor' && (
                <pre style={{ margin: 0, color: '#e2e8f0' }}>
{`import { DockLayout } from '@relteco/relui-react';

export function App() {
  return (
    <DockLayout
      panels={[...]}
      renderPanel={...}
    />
  );
}`}
                </pre>
              )}
              {id !== 'terminal' && id !== 'editor' && (
                <p style={{ color: '#64748b', margin: 0 }}>{title} content — ID: {id}</p>
              )}
            </div>
          )}
        />
      </div>
    );
  },
};
