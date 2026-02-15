# x402-kit 🛠️

**The Developer Experience Layer for Stacks API Monetization.**

`x402-kit` makes it incredibly easy to add HTTP 402 (Payment Required) gating to your Express APIs and build autonomous agents that can pay for those resources.

## 🌟 Features

- **One-Line Middleware**: Protect your Express routes with `@x402-kit/middleware`.
- **Autonomous Agent Client**: Pre-configured Axios wrapper in `@x402-kit/agent-client` that handles protocol negotiation and payment automatically.
- **Scaffolding CLI**: Bootstrap your entire project in seconds with `x402-kit init`.
- **Stacks Native**: Built on top of `x402-stacks` for seamless Bitcoin-layer payments.

## 🚀 Quick Start

### 1. Bootstrap a new project
```bash
npx x402-kit init
```

### 2. Protect an API route
```typescript
import { x402Paywall } from '@x402-kit/middleware';

app.get('/premium-endpoint', x402Paywall({
  prices: { '/premium-endpoint': '1 STX' },
  payTo: 'ST1PQ...'
}), (req, res) => {
  res.json({ data: "This is paid content!" });
});
```

### 3. Make a paid request from an Agent
```typescript
import { X402Agent } from '@x402-kit/agent-client';

const agent = new X402Agent(walletAccount);
const data = await agent.call('https://api.com/premium-endpoint');
```

## 📦 Project Structure

```text
/cli              - Project scaffolding tool
/packages
  /middleware     - Express payment-gating middleware
  /agent-client   - Autonomous payment-capable client
  /landing-page   - Interactive marketing and demo site
```

## 🛠️ Installation & Usage

Refer to [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on local development, linking, and production deployment.

## 🏆 Hackathon Context

This project was developed for the **Stacks x402 Challenge**. It aims to reduce friction for developers entering the Stacks ecosystem by providing high-quality tools that abstract away the complexity of 402 negotiation.

## 📄 License

MIT
