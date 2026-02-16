import { useState, useEffect, useMemo } from 'react';
import { authenticate } from '@stacks/connect';
import { AppConfig, UserSession } from '@stacks/auth';

function TerminalDemo({ walletAddress }: { walletAddress: string | null }) {
  const [lines, setLines] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const getDemoLines = (address: string | null) => [
    { text: "> Initializing X402Agent...", delay: 500 },
    { text: `> Account: ${address || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'}`, delay: 600 },
    { text: "> Target: https://api.alpha.com/v1/inference", delay: 800 },
    { text: "> Sending GET request...", delay: 600 },
    { text: "> ERROR: 402 Payment Required", color: "#ef4444", delay: 1000 },
    { text: "> Protocol detected: x402-stacks (v2)", delay: 800 },
    { text: "> Payment Request: 0.05 STX", delay: 500 },
    { text: "> [WALLET] Signing transaction via Connected Account...", delay: 1200 },
    { text: "> [FACILITATOR] Notifying network of payment proof...", delay: 1000 },
    { text: "> Transaction confirmed: 0x4f...92a1", delay: 800 },
    { text: "> Retrying original request with Authorization header...", delay: 700 },
    { text: "> Success! Response received (200 OK)", delay: 600 },
    { text: "> Result: { 'status': 'complete', 'output': '...' }", color: "#10b981", delay: 500 },
  ];

  const startDemo = async () => {
    if (isRunning) return;
    setLines([]);
    setIsDone(false);
    setIsRunning(true);

    const demoLines = getDemoLines(walletAddress);

    for (const line of demoLines) {
      await new Promise(resolve => setTimeout(resolve, line.delay));
      setLines(prev => [...prev, line.text]);
    }
    setIsDone(true);
    setIsRunning(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '4rem auto' }}>
      <div className="terminal">
        <div className="terminal-header">
          <div className="terminal-dot" style={{ background: '#ef4444' }}></div>
          <div className="terminal-dot" style={{ background: '#fbbf24' }}></div>
          <div className="terminal-dot" style={{ background: '#10b981' }}></div>
          <span style={{ marginLeft: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>x402kit-agent-sim</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {lines.map((line, i) => (
            <div key={i} className="terminal-line" style={{ color: line.startsWith('> ERROR') ? '#ef4444' : (line.startsWith('> Success') || line.startsWith('> Result') ? '#10b981' : '#10b981') }}>
              {line}
            </div>
          ))}
          {!isRunning && !isDone && <div style={{ color: 'var(--text-secondary)' }}>Click 'Run Agent' to start simulation...</div>}
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={startDemo} disabled={isRunning}>
            {isRunning ? 'Running...' : 'Run Agent Demo'}
          </button>
          {isDone && <button className="btn btn-secondary" onClick={() => { setLines([]); setIsDone(false); }}>Reset</button>}
        </div>
      </div>
    </div>
  );
}

function ConnectWallet({ onConnect, walletAddress, userSession }: { onConnect: (address: string) => void, walletAddress: string | null, userSession: UserSession }) {
  const handleConnect = () => {
    authenticate({
      appDetails: {
        name: 'x402kit',
        icon: window.location.origin + '/favicon.svg',
      },
      userSession: userSession as any,
      onFinish: () => {
        const userData = userSession.loadUserData();
        const address = userData.profile.stxAddress.testnet || userData.profile.stxAddress.mainnet;
        onConnect(address);
      },
      onCancel: () => {
        console.log('Connect cancelled');
      }
    });
  };

  const handleDisconnect = () => {
    userSession.signUserOut();
    window.location.reload();
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      {walletAddress ? (
        <>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {walletAddress.slice(0, 5)}...{walletAddress.slice(-5)}
          </span>
          <button className="btn btn-secondary" onClick={handleDisconnect} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
            Logout
          </button>
        </>
      ) : (
        <button className="btn btn-secondary" onClick={handleConnect}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}

function App() {
  const [copied, setCopied] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const userSession = useMemo(() => {
    const appConfig = new AppConfig(['store_write', 'publish_data']);
    return new UserSession({ appConfig });
  }, []);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const address = userData.profile.stxAddress.testnet || userData.profile.stxAddress.mainnet;
      setWalletAddress(address);
    }
  }, [userSession]);

  const copyCommand = () => {
    navigator.clipboard.writeText('npx x402kit init my-project');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app">
      {/* Navigation */}
      <nav style={{ padding: '1rem 0', position: 'sticky', top: 0, backdropFilter: 'blur(10px)', zIndex: 100, borderBottom: '1px solid var(--glass-border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--accent-primary)' }}>◆</span> x402kit
          </div>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="#features">Features</a>
            <a href="#demo">Playground</a>
            <a href="#docs">Docs</a>
            <ConnectWallet onConnect={setWalletAddress} walletAddress={walletAddress} userSession={userSession} />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '8rem 0' }}>
        <div className="container">
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ background: 'var(--glass-bg)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', border: '1px solid var(--glass-border)' }}>
              🚀 Day 6 Update: CLI & Wallet Integration Live
            </span>
          </div>
          <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', lineHeight: 1.1, fontWeight: 800 }}>
            The Web3 Monetization <br />
            <span className="accent-text">Execution Layer</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 3rem' }}>
            Plug-and-play middleware for developers. Autonomous payment clients for AI agents.
            Built on Stacks to unlock the Bitcoin economy.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
            <div className="glass-card" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={copyCommand}>
              <code style={{ background: 'transparent', fontSize: '1.1rem', color: '#60a5fa' }}>$ npx x402kit init</code>
              <span style={{ color: 'var(--text-secondary)' }}>{copied ? 'Copied' : '📋'}</span>
            </div>
            <a href="#demo" className="btn btn-primary" style={{ height: '54px' }}>Try the Demo</a>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Agent Playground</h2>
            <p style={{ color: 'var(--text-secondary)' }}> {walletAddress ? `Authenticated as ${walletAddress.slice(0, 10)}...` : 'Using a simulated account. Connect your wallet to customize the demo.'}</p>
          </div>
          <TerminalDemo walletAddress={walletAddress} />
        </div>
      </section>

      {/* The Problem & Solution */}
      <section id="features">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>The Friction</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Integrating Stacks payments currently requires deep knowledge of protocol negotiation, receipt verification, and non-blocking transaction handling.
              </p>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                For AI agents, this complexity is an adoption wall. They need a standard, autonomous way to purchase API resources.
              </p>
            </div>
            <div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>The Kit</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                <strong style={{ color: 'white' }}>Middleware:</strong> One-line Express protection with route-level pricing.
              </p>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'white' }}>Agent Client:</strong> Pre-configured Axios instance that detects 402s, pays, and retries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Link */}
      <section id="docs" style={{ textAlign: 'center', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ready for Production?</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
            Read the guide on how to deploy x402kit and start monetizing your services today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="https://github.com/tomdan-ai/x402kit" className="btn btn-primary" target="_blank" rel="noreferrer">
              Check GitHub
            </a>
            <a href="#demo" className="btn btn-secondary">Read Docs</a>
          </div>
        </div>
      </section>

      <footer style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-secondary)', borderTop: '1px solid var(--glass-border)' }}>
        <div className="container">
          <div style={{ marginBottom: '1rem', fontWeight: 600, color: 'white' }}>x402kit</div>
          <div>&copy; 2026. Built with ❤️ for the Stacks Ecosystem.</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
