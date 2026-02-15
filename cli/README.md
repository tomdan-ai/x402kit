# @x402-kit/cli

> Scaffold tool for x402-kit — spin up Express APIs and autonomous agent projects with built-in HTTP 402 payment gating on Stacks.

[![npm version](https://img.shields.io/npm/v/@x402-kit/cli)](https://www.npmjs.com/package/@x402-kit/cli)
[![license](https://img.shields.io/npm/l/@x402-kit/cli)](./LICENSE)

## Overview

`@x402-kit/cli` is the quickest way to start building with x402-kit. One command generates a fully configured project — complete with payment middleware, agent client, and TypeScript setup — so you can go from zero to a monetized API in minutes.

## Installation

```bash
# Run directly with npx (no install required)
npx @x402-kit/cli init

# Or install globally
npm install -g @x402-kit/cli
```

## Usage

### `x402-kit init [name]`

Scaffolds a new x402-kit project.

```bash
# Interactive mode (prompts for project name)
x402-kit init

# Specify project name directly
x402-kit init my-paid-api

# Choose a template
x402-kit init my-agent --template agent
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `-t, --template <template>` | Project template: `api` or `agent` | `api` |

### Templates

#### `api` — Paid API Server

Generates an Express server with `@x402-kit/middleware` pre-configured. Includes a sample paid endpoint and routing setup.

**Generated structure:**

```text
my-paid-api/
├── index.ts          # Express server with x402Paywall middleware
├── package.json      # Pre-configured dependencies
└── tsconfig.json     # TypeScript config
```

**What you get:**

```typescript
import express from 'express';
import { x402Paywall } from '@x402-kit/middleware';

const app = express();

app.use(x402Paywall({
  prices: { '/data': '0.01 STX' },
  payTo: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  network: 'testnet'
}));

app.get('/data', (req, res) => {
  res.json({ message: 'This is paid data!' });
});

app.listen(3000);
```

#### `agent` — Autonomous Agent Client

Generates an autonomous agent that can detect 402 responses, make STX payments, and retry requests automatically.

**What you get:**

```typescript
import { X402Agent } from '@x402-kit/agent-client';
import { generateKeypair, privateKeyToAccount } from 'x402-stacks';

const { privateKey } = generateKeypair('testnet');
const account = privateKeyToAccount(privateKey, 'testnet');

const agent = new X402Agent(account);
const data = await agent.call('http://localhost:3000/data');
console.log('Paid response:', data);
```

## Quick Start

```bash
# 1. Create a new paid API
npx @x402-kit/cli init my-api --template api

# 2. Install dependencies
cd my-api && npm install

# 3. Start the server
npm start
```

In a second terminal:

```bash
# 4. Create an agent consumer
npx @x402-kit/cli init my-agent --template agent

# 5. Install & run
cd my-agent && npm install && npm start
```

Your agent will automatically pay for and consume the API. 🎉

## Commands

| Command | Description |
|---------|-------------|
| `x402-kit init [name]` | Scaffold a new x402-kit project |
| `x402-kit --version` | Print the CLI version |
| `x402-kit --help` | Show help |

## Requirements

- **Node.js** ≥ 18
- **npm** ≥ 9

## Related Packages

| Package | Description |
|---------|-------------|
| [`@x402-kit/middleware`](https://www.npmjs.com/package/@x402-kit/middleware) | Express middleware for HTTP 402 payment gating |
| [`@x402-kit/agent-client`](https://www.npmjs.com/package/@x402-kit/agent-client) | Autonomous agent client for paid API consumption |
| [`x402-stacks`](https://www.npmjs.com/package/x402-stacks) | Core x402 protocol SDK for Stacks |

## Contributing

Contributions are welcome! Please see the [main repository](https://github.com/x402-kit/x402-kit) for development setup and guidelines.

## License

MIT
