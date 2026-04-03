import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';

const API_BASE = 'http://localhost:8000';

// ─── Spreadsheet Demo Data ──────────────────────────────────────────────────

const COLUMNS = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
const ROWS = [
  [null, 'Metric', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Unit', 'Notes'],
  [null, 'Revenue', '$125,000', '$182,500', '$248,000', '$315,000', 'USD', ''],
  [null, 'New Customers', '42', '58', '74', '91', '#', ''],
  [null, 'CAC', '$890', '$820', '$760', '$710', 'USD', '=B2/B3'],
  [null, 'LTV', '$4,200', '$4,650', '$5,100', '$5,800', 'USD', '=B5/B6'],
  [null, 'Churn Rate', '3.8%', '3.2%', '2.7%', '2.3%', '%', ''],
  [null, 'LTV:CAC', '4.7x', '5.7x', '6.7x', '8.2x', 'ratio', '=B5/B4'],
  [null, 'MRR', '$10,417', '$15,208', '$20,667', '$26,250', 'USD', '=B2/12'],
  [null, 'ARR', '$125,000', '$182,500', '$248,000', '$315,000', 'USD', '=B8*12'],
  [null, 'Gross Margin', '72%', '74%', '76%', '78%', '%', ''],
  [null, 'EBITDA', '-$48,000', '-$22,000', '$12,000', '$45,000', 'USD', ''],
  [null, 'Burn Rate', '$48,000', '$22,000', '$0', '$0', 'USD/mo', ''],
  [null, 'Runway', '14 mo', '18 mo', '∞', '∞', 'months', ''],
  [null, 'NPS Score', '42', '48', '54', '61', '0-100', ''],
  [null, 'Avg Contract', '$2,976', '$3,147', '$3,351', '$3,461', 'USD', '=B2/B3'],
];

// Cells that will appear "pending" (yellow highlight) when there are pending changes
const PENDING_CELL_MAP = {
  'D4': true,
  'E4': true,
  'D7': true,
  'E7': true,
  'D5': true,
  'E5': true,
};

// ─── Welcome Message ───────────────────────────────────────────────────────

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'ai',
  text: 'Welcome to your AI spreadsheet assistant! Upload a spreadsheet above, then ask me to update formulas, create models, or explain calculations.',
  timestamp: new Date(),
};

// ─── Demo Button Prompts ───────────────────────────────────────────────────

const DEMO_PROMPTS = [
  { label: 'LTV:CAC Analysis', prompt: 'Analyze the LTV:CAC ratio across all quarters and suggest formula improvements to make it dynamic based on the churn rate.' },
  { label: 'Pricing Model', prompt: 'Build a pricing sensitivity model showing how a 10%, 20%, and 30% price increase affects MRR, ARR, and EBITDA.' },
  { label: 'Explain LTV', prompt: 'Explain how the LTV is calculated in this spreadsheet and whether the formula accounts for expansion revenue and churn correctly.' },
];

// ─── Spreadsheet Preview Component ────────────────────────────────────────

function SpreadsheetPreview({ pendingChanges, workbookName }) {
  const pendingCells = pendingChanges.reduce((acc, c) => {
    acc[c.cell_address] = true;
    return acc;
  }, {});

  const hasPending = pendingChanges.length > 0;

  function getCellClass(rowIdx, colIdx) {
    if (rowIdx === 0) return 'cell col-header';
    if (colIdx === 0) return 'cell row-header';

    const colLetter = COLUMNS[colIdx];
    const cellRef = `${colLetter}${rowIdx}`;

    const classes = ['cell'];
    if (hasPending && pendingCells[cellRef]) classes.push('pending');
    if (rowIdx === 1 && colIdx > 0) classes.push('bold');
    if (colIdx === 7 && rowIdx > 1) classes.push('formula');

    const value = ROWS[rowIdx - 1]?.[colIdx] ?? '';
    if (typeof value === 'string' && value.startsWith('-$')) classes.push('negative');
    if (value === '∞') classes.push('positive');

    return classes.join(' ');
  }

  const displayName = workbookName || 'LTV_CAC_Model_2024.xlsx';

  return (
    <div className="spreadsheet-area">
      {/* Toolbar */}
      <div className="spreadsheet-toolbar">
        <div className="toolbar-app-icon">X</div>
        <div className="toolbar-filename">
          <span>{displayName}</span>
        </div>
        <div className="toolbar-sep" />
        {hasPending && (
          <div className="toolbar-badge">{pendingChanges.length} PENDING</div>
        )}
      </div>

      {/* Formula bar */}
      <div className="spreadsheet-formula-bar">
        <div className="formula-cell-ref">{hasPending ? PENDING_CELL_MAP ? Object.keys(pendingCells)[0] || 'D4' : 'D4' : 'A1'}</div>
        <div className="formula-icon">fx</div>
        <div className="formula-content">
          {hasPending ? '=LTV_Current/CAC_Current' : 'Metric'}
        </div>
      </div>

      {/* Grid */}
      <div className="spreadsheet-grid-wrapper">
        <div className="spreadsheet-grid">
          {/* Column headers row */}
          {COLUMNS.map((col, ci) => (
            <div key={`hdr-${ci}`} className="cell col-header">
              {col}
            </div>
          ))}

          {/* Data rows */}
          {ROWS.map((row, ri) => (
            COLUMNS.map((col, ci) => {
              const value = row[ci] ?? '';
              const key = `${ri}-${ci}`;
              return (
                <div key={key} className={getCellClass(ri + 1, ci)}>
                  {ci === 0 ? ri + 1 : value}
                </div>
              );
            })
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="spreadsheet-status-bar">
        <div className="status-item">READY</div>
        <div className="status-item">Rows: <span>15</span></div>
        <div className="status-item">Cols: <span>7</span></div>
        {hasPending && (
          <div className="status-item" style={{ color: '#FFD600' }}>
            ⚡ {pendingChanges.length} change{pendingChanges.length !== 1 ? 's' : ''} pending
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Chat Tab Component ───────────────────────────────────────────────────

function ChatTab({ sessionId, setSessionId, messages, setMessages, setPendingChanges, setActiveTab, isWorkbookConnected, setIsWorkbookConnected, workbookName, setWorkbookName }) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleConnectWorkbook = async () => {
    setIsConnecting(true);
    try {
      if (!window.Excel) {
        throw new Error('Not running inside Excel');
      }

      let snapshot;
      await window.Excel.run(async (context) => {
        const sheets = context.workbook.worksheets;
        sheets.load('items/name');
        await context.sync();

        snapshot = { sheets: [] };
        for (const sheet of sheets.items) {
          const usedRange = sheet.getUsedRange();
          usedRange.load(['values', 'address']);
          await context.sync();
          snapshot.sheets.push({
            name: sheet.name,
            data: usedRange.values,
          });
        }
      });

      let wbName = 'Active Workbook';
      try {
        const url = window.Office.context.document.url;
        if (url) wbName = url.split('/').pop().split('\\').pop() || 'Active Workbook';
      } catch {}

      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snapshot),
      });

      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      const data = await res.json();
      setSessionId(data.session_id);
      setIsWorkbookConnected(true);
      setWorkbookName(wbName);

      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'ai',
        text: `✓ Connected to "${wbName}" successfully. I can see your spreadsheet data. What would you like to analyze or update?`,
        timestamp: new Date(),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'ai',
        text: `Could not connect to the Excel workbook (${err.message}). Running in demo mode — your changes will be simulated locally.`,
        timestamp: new Date(),
      }]);
      setSessionId('demo-' + Date.now());
      setIsWorkbookConnected(true);
      setWorkbookName('Demo Workbook');
    } finally {
      setIsConnecting(false);
    }
  };

  const sendMessage = useCallback(async (text) => {
    const userText = text || inputValue.trim();
    if (!userText) return;

    setInputValue('');
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'user',
      text: userText,
      timestamp: new Date(),
    }]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message: userText }),
      });

      if (!res.ok) throw new Error(`Chat failed: ${res.status}`);
      const data = await res.json();

      const newChanges = data.proposed_changes || [];

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: data.response || data.message || 'Analysis complete.',
        timestamp: new Date(),
        changeCount: newChanges.length,
      }]);

      if (newChanges.length > 0) {
        setPendingChanges(prev => [...prev, ...newChanges]);
      }
    } catch (err) {
      // Demo mode: show simulated response
      const demoResponse = getDemoResponse(userText);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: demoResponse.text,
        timestamp: new Date(),
        changeCount: demoResponse.changes.length,
      }]);
      if (demoResponse.changes.length > 0) {
        setPendingChanges(prev => [...prev, ...demoResponse.changes]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, sessionId, setMessages, setPendingChanges]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleDemoBtn = (prompt) => {
    setInputValue(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div className="chat-tab">
      {/* Connect to Workbook */}
      <div className="file-upload-zone">
        <button
          className={`file-upload-btn ${isWorkbookConnected ? 'has-file' : ''}`}
          onClick={handleConnectWorkbook}
          disabled={isConnecting}
        >
          <span className="upload-icon">
            {isConnecting ? '⟳' : isWorkbookConnected ? '✓' : '⊞'}
          </span>
          <span className="file-upload-text">
            {isWorkbookConnected ? (
              <>
                <span className="file-name">{workbookName || 'Active Workbook'}</span>
                <span className="file-hint">Click to reconnect</span>
              </>
            ) : (
              <span>{isConnecting ? 'Connecting...' : 'Connect to Workbook'}</span>
            )}
          </span>
        </button>
      </div>

      {/* Chat messages */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            <div className="message-sender">
              {msg.role === 'ai' ? '4sight AI' : 'You'}
            </div>
            <div className="message-bubble">{msg.text}</div>
            {msg.changeCount > 0 && (
              <div
                className="message-changes-note"
                onClick={() => setActiveTab('changes')}
              >
                <span>⚡</span>
                <span>{msg.changeCount} proposed change{msg.changeCount !== 1 ? 's' : ''} — view in Changes tab</span>
                <span style={{ color: '#00E676' }}>→</span>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="message ai">
            <div className="message-sender">4sight AI</div>
            <div className="loading-bubble">
              <div className="dot" />
              <div className="dot" />
              <div className="dot" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Demo buttons */}
      <div className="demo-buttons">
        <div className="demo-buttons-label">Try a demo</div>
        <div className="demo-buttons-row">
          {DEMO_PROMPTS.map((d) => (
            <button key={d.label} className="demo-btn" onClick={() => handleDemoBtn(d.prompt)}>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <div className="chat-input-row">
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder="Ask me to update formulas, create models, or explain calculations..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className="send-btn"
            onClick={() => sendMessage()}
            disabled={!inputValue.trim() || isLoading}
            title="Send (Enter)"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Changes Tab Component ────────────────────────────────────────────────

function ChangesTab({ sessionId, pendingChanges, setPendingChanges }) {

  const acceptChange = async (change) => {
    // Write value to Excel cell in real time
    if (window.Excel) {
      try {
        await window.Excel.run(async (context) => {
          const sheetName = change.sheet || 'Sheet1';
          const sheet = context.workbook.worksheets.getItem(sheetName);
          const range = sheet.getRange(change.cell_address);
          range.values = [[change.new_value]];
          await context.sync();
        });
      } catch {
        // Not in Excel context — continue silently
      }
    }
    try {
      await fetch(`${API_BASE}/api/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, change_id: change.id }),
      });
    } catch {
      // Demo mode: silently accept
    }
    setPendingChanges(prev => prev.filter(c => c.id !== change.id));
  };

  const rejectChange = async (change) => {
    try {
      await fetch(`${API_BASE}/api/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, change_id: change.id }),
      });
    } catch {
      // Demo mode: silently reject
    }
    setPendingChanges(prev => prev.filter(c => c.id !== change.id));
  };

  const acceptAll = async () => {
    // Write all values to Excel in a single run for efficiency
    if (window.Excel) {
      try {
        await window.Excel.run(async (context) => {
          for (const c of pendingChanges) {
            const sheetName = c.sheet || 'Sheet1';
            const sheet = context.workbook.worksheets.getItem(sheetName);
            const range = sheet.getRange(c.cell_address);
            range.values = [[c.new_value]];
          }
          await context.sync();
        });
      } catch {
        // Not in Excel context — continue silently
      }
    }
    for (const c of pendingChanges) {
      try {
        await fetch(`${API_BASE}/api/accept`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId, change_id: c.id }),
        });
      } catch { /* demo mode */ }
    }
    setPendingChanges([]);
  };

  const rejectAll = () => {
    setPendingChanges([]);
  };

  return (
    <div className="changes-tab">
      <div className="changes-header">
        <div className="changes-header-top">
          <div className="changes-title">
            <strong>Proposed Changes</strong>
            Accept changes to apply them instantly to the spreadsheet
          </div>
          {pendingChanges.length > 0 && (
            <div className="changes-actions">
              <button className="btn-accept-all" onClick={acceptAll}>Accept All</button>
              <button className="btn-reject-all" onClick={rejectAll}>Reject All</button>
            </div>
          )}
        </div>
        <div className="changes-tip">
          <span className="tip-icon">◑</span>
          <span>Cells highlighted in yellow on the spreadsheet show pending changes.</span>
        </div>
      </div>

      {pendingChanges.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◻</div>
          <div className="empty-title">No Pending Changes</div>
          <div className="empty-subtitle">
            Chat with 4sight AI to generate proposed changes. They'll appear here for your review.
          </div>
        </div>
      ) : (
        <div className="changes-list">
          {pendingChanges.map((change) => (
            <ChangeCard
              key={change.id}
              change={change}
              onAccept={() => acceptChange(change)}
              onReject={() => rejectChange(change)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ChangeCard({ change, onAccept, onReject }) {
  return (
    <div className="change-card">
      <div className="change-card-header">
        <div className="cell-address">{change.cell_address}</div>
        <div className={`cell-type-badge ${change.type}`}>{change.type}</div>
      </div>
      <div className="change-description">{change.description}</div>
      <div className="change-new-value">
        <span>New value:</span>
        <span className="new-value-pill">{change.new_value}</span>
      </div>
      <div className="change-card-actions">
        <button className="btn-accept" onClick={onAccept}>✓ Accept &amp; Apply</button>
        <button className="btn-reject" onClick={onReject}>✕ Reject</button>
      </div>
    </div>
  );
}

// ─── Coming Soon Tabs ─────────────────────────────────────────────────────

function ComingSoonTab({ name, icon, description }) {
  return (
    <div className="coming-soon-tab">
      <div className="coming-soon-icon">{icon}</div>
      <div className="coming-soon-title">{name} coming soon</div>
      <div className="coming-soon-sub">{description}</div>
    </div>
  );
}

// ─── Demo Mode Response Generator ────────────────────────────────────────

function getDemoResponse(message) {
  const lower = message.toLowerCase();

  if (lower.includes('ltv') && lower.includes('cac')) {
    return {
      text: `Your LTV:CAC ratio improves from 4.7x in Q1 to 8.2x in Q4 — strong signal. However, the current formulas hardcode the CAC value instead of computing it dynamically from new customers and revenue. I've proposed 4 formula updates to make these calculations dynamic and self-correcting.`,
      changes: [
        { id: 'c1', cell_address: 'D4', type: 'formula', description: 'Replace hardcoded CAC with dynamic formula dividing total acquisition spend by new customers in Q3.', new_value: '=D2/D3' },
        { id: 'c2', cell_address: 'E4', type: 'formula', description: 'Same dynamic CAC formula for Q4, linked to Q4 revenue and customer count.', new_value: '=E2/E3' },
        { id: 'c3', cell_address: 'D7', type: 'formula', description: 'Update LTV:CAC ratio in Q3 to reference the new dynamic CAC cell.', new_value: '=D5/D4' },
        { id: 'c4', cell_address: 'E7', type: 'formula', description: 'Update LTV:CAC ratio in Q4 to reference the new dynamic CAC cell.', new_value: '=E5/E4' },
      ],
    };
  }

  if (lower.includes('pricing') || lower.includes('price')) {
    return {
      text: `I've built a 3-scenario pricing sensitivity model. A 10% price increase pushes Q4 ARR to $346K (+$31K), a 20% increase to $378K (+$63K), and a 30% increase to $409.5K (+$94.5K). I'm proposing new formula cells to make this dynamic — you can adjust the percentage inputs and all downstream metrics will update automatically.`,
      changes: [
        { id: 'p1', cell_address: 'B10', type: 'value', description: 'Set base price multiplier for 10% scenario in sensitivity analysis row.', new_value: '1.10' },
        { id: 'p2', cell_address: 'C10', type: 'value', description: 'Set base price multiplier for 20% scenario.', new_value: '1.20' },
        { id: 'p3', cell_address: 'D10', type: 'formula', description: 'Dynamic ARR for 10% pricing scenario, linked to base ARR in D9.', new_value: '=D9*B10' },
      ],
    };
  }

  if (lower.includes('explain') || lower.includes('how')) {
    return {
      text: `LTV (Customer Lifetime Value) in your model is calculated as the average revenue per account divided by the churn rate — this is the standard "LTV = ARPU / Churn" formula. Currently the model appears to be using hardcoded values rather than referencing the churn rate in row 6 dynamically. I'd recommend linking LTV to churn so the model auto-updates when churn improves. I've proposed 2 formula corrections.`,
      changes: [
        { id: 'e1', cell_address: 'D5', type: 'formula', description: 'Link Q3 LTV to ARPU and Q3 churn rate for fully dynamic calculation.', new_value: '=(D2/D3)/D6' },
        { id: 'e2', cell_address: 'E5', type: 'formula', description: 'Link Q4 LTV to ARPU and Q4 churn rate for fully dynamic calculation.', new_value: '=(E2/E3)/E6' },
      ],
    };
  }

  // Generic fallback
  return {
    text: `Understood. Analyzing your spreadsheet model now.\n\nI can see you have revenue, CAC, LTV, and churn data across 4 quarters. Your key metrics look healthy with improving unit economics. What specific calculation or model would you like me to help you build or improve?`,
    changes: [],
  };
}

// ─── Panel Header ─────────────────────────────────────────────────────────

function PanelHeader({ sessionId, isWorkbookConnected }) {
  return (
    <div className="panel-header">
      <div className="panel-logo">
        <span className="logo-icon">😉</span>
        <span className="logo-text">4<span>sight</span></span>
      </div>
      <div className="panel-status">
        <div className={`status-dot${isWorkbookConnected ? '' : ' disconnected'}`} />
        {sessionId ? 'SESSION ACTIVE' : 'READY'}
      </div>
    </div>
  );
}

// ─── Tab Navigation ───────────────────────────────────────────────────────

const TABS = [
  { id: 'chat', label: 'Chat' },
  { id: 'changes', label: 'Changes' },
  { id: 'agents', label: 'Agents' },
  { id: 'rules', label: 'Rules' },
  { id: 'templates', label: 'Templates' },
];

function TabNav({ activeTab, setActiveTab, pendingCount }) {
  return (
    <div className="tab-nav">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
          {tab.id === 'changes' && pendingCount > 0 && (
            <span className="tab-badge">{pendingCount}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [isWorkbookConnected, setIsWorkbookConnected] = useState(false);
  const [workbookName, setWorkbookName] = useState(null);

  const renderTab = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <ChatTab
            sessionId={sessionId}
            setSessionId={setSessionId}
            messages={messages}
            setMessages={setMessages}
            pendingChanges={pendingChanges}
            setPendingChanges={setPendingChanges}
            setActiveTab={setActiveTab}
            isWorkbookConnected={isWorkbookConnected}
            setIsWorkbookConnected={setIsWorkbookConnected}
            workbookName={workbookName}
            setWorkbookName={setWorkbookName}
          />
        );
      case 'changes':
        return (
          <ChangesTab
            sessionId={sessionId}
            pendingChanges={pendingChanges}
            setPendingChanges={setPendingChanges}
          />
        );
      case 'agents':
        return (
          <ComingSoonTab
            name="Agents"
            icon="⬡"
            description="Autonomous agents that run scheduled analyses, monitor KPI thresholds, and update your model on a cadence."
          />
        );
      case 'rules':
        return (
          <ComingSoonTab
            name="Rules"
            icon="◈"
            description="Define guardrails and constraints — prevent formulas from breaking, enforce naming conventions, and validate inputs."
          />
        );
      case 'templates':
        return (
          <ComingSoonTab
            name="Templates"
            icon="◫"
            description="Pre-built financial models: SaaS metrics, unit economics, three-statement models, cap tables, and more."
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <SpreadsheetPreview pendingChanges={pendingChanges} workbookName={workbookName} />
      <div className="panel">
        <PanelHeader sessionId={sessionId} isWorkbookConnected={isWorkbookConnected} />
        <TabNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingCount={pendingChanges.length}
        />
        <div className="tab-content">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}

export default App;
