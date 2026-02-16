# @x402kit/middleware

> One-line Express middleware for HTTP 402 payment gating on Stacks — monetize any API route with STX micropayments.

[![npm version](https://img.shields.io/npm/v/@x402kit/middleware)](https://www.npmjs.com/package/@x402kit/middleware)
[![license](https://img.shields.io/npm/l/@x402kit/middleware)](./LICENSE)

## Overview

`@x402kit/middleware` wraps the [x402-stacks](https://www.npmjs.com/package/x402-stacks) protocol into a single Express middleware call. Define per-route STX prices in a config object, and every matching request is automatically gated behind an HTTP 402 payment flow — receipt verification, replay protection, and all.

## Installation

```bash
npm install @x402kit/middleware
```

> **Peer dependency:** requires `express` ≥ 4.

## Quick Start

```typescript
import express from 'express';
import { x402Paywall } from '@x402kit/middleware';

const app = express();

app.use(x402Paywall({
  prices: {
    '/premium': '0.01 STX',
    '/data':    '0.05 STX',
  },
  payTo: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  network: 'testnet',
}));

app.get('/premium', (req, res) => {
  res.json({ message: 'Paid premium content' });
});

app.get('/data', (req, res) => {
  res.json({ data: [1, 2, 3] });
});

app.get('/', (req, res) => {
  res.send('Free homepage — no payment required');
});

app.listen(3000, () => console.log('Listening on :3000'));
```

Any request to `/premium` or `/data` will receive an HTTP 402 response unless a valid payment receipt is provided. Routes not listed in `prices` pass through normally.

## API Reference

### `x402Paywall(options): express.RequestHandler`

Returns an Express middleware function.

#### `X402Options`

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `prices` | `Record<string, string>` | ✅ | — | Map of route paths to STX price strings (e.g. `'0.01 STX'`) |
| `payTo` | `string` | ✅ | — | Stacks address that receives payments |
| `network` | `'mainnet' \| 'testnet'` | — | `'testnet'` | Stacks network to use |
| `facilitatorUrl` | `string` | — | `'https://facilitator.stacksx402.xyz'` | URL of the x402 facilitator service |

### How It Works

1. An incoming request hits the middleware.
2. The middleware checks if the request path has a price defined in `prices`.
3. **If yes** — it delegates to the `x402-stacks` `paymentMiddleware`, which returns an HTTP 402 with payment instructions or validates the payment receipt attached to the request.
4. **If no** — the request passes through to the next handler untouched.

```
Client Request
     │
     ▼
x402Paywall middleware
     │
     ├── Path in prices? ──▶ paymentMiddleware (x402-stacks)
     │                            │
     │                            ├── Valid receipt? → next()
     │                            └── No receipt?    → 402 response
     │
     └── Path NOT in prices? ──▶ next()
```

## Examples

### Per-endpoint pricing

```typescript
app.use(x402Paywall({
  prices: {
    '/api/sentiment':  '0.001 STX',  // cheap
    '/api/summarize':  '0.01 STX',   // moderate
    '/api/train':      '1.00 STX',   // expensive
  },
  payTo: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  network: 'mainnet',
}));
```

### Custom facilitator

```typescript
app.use(x402Paywall({
  prices: { '/data': '0.01 STX' },
  payTo: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  facilitatorUrl: 'https://my-facilitator.example.com',
}));
```

### With existing middleware stack

```typescript
app.use(cors());
app.use(express.json());
app.use(x402Paywall({
  prices: { '/premium': '0.01 STX' },
  payTo: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
}));
// Routes defined below are gated
```

## Requirements

- **Node.js** ≥ 18
- **Express** ≥ 4
- **x402-stacks** ≥ 2 (installed automatically)

## Related Packages

| Package | Description |
|---------|-------------|
| [`@x402kit/cli`](https://www.npmjs.com/package/@x402kit/cli) | Scaffold tool for generating x402kit projects |
| [`@x402kit/agent-client`](https://www.npmjs.com/package/@x402kit/agent-client) | Autonomous agent client that pays for API access automatically |
| [`x402-stacks`](https://www.npmjs.com/package/x402-stacks) | Core x402 protocol SDK for Stacks |

## Contributing

Contributions are welcome! Please see the [main repository](https://github.com/tomdan-ai/x402kit) for development setup and guidelines.

## License

MIT
