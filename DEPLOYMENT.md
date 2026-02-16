# Deploying & Using x402kit 🚀

This guide explains how to use `x402kit` in your own projects, whether you're developing locally or ready for production.

## 1. Local Development (Testing the CLI)

To use the `x402kit` CLI globally on your machine without publishing to npm:

```bash
# 1. Build the monorepo
npm run build

# 2. Go to the CLI package
cd cli

# 3. Link it globally
npm link

# 4. Now you can use it anywhere!
mkdir my-new-app && cd my-new-app
x402kit init
```

## 2. Using Packages Locally

If you want to use `@x402kit/middleware` or `@x402kit/agent-client` in another local project:

```bash
# In the package directory (e.g., packages/middleware)
npm link

# In your external project
npm link @x402kit/middleware
```

## 3. Publishing to npm

When you're ready to share your tools with the world:

1.  **Login**: `npm login`
2.  **Run the publishing script**:
    ```bash
    ./publish-all.sh
    ```
    This script will build all packages and publish them in the correct dependency order:
    1. `@x402kit/middleware`
    2. `@x402kit/agent-client`
    3. `@x402kit/cli`

Alternatively, you can publish manually:
    ```bash
    # Publish core packages first
    cd packages/middleware && npm publish --access public
    cd ../agent-client && npm publish --access public
    
    # Then publish the CLI
    cd ../../cli && npm publish --access public
    ```

## 4. Real-World Integration Example

### Backend (API Provider)
1. Install: `npm install @x402kit/middleware`
2. Usage:
```typescript
import { x402Paywall } from '@x402kit/middleware';

app.use(x402Paywall({
  prices: { '/api/data': '0.1 STX' },
  payTo: 'YOUR_STX_ADDRESS'
}));
```

### Frontend/Agent (Consumer)
1. Install: `npm install @x402kit/agent-client`
2. Usage:
```typescript
import { X402Agent } from '@x402kit/agent-client';

const agent = new X402Agent(userWalletAccount);
const data = await agent.call('https://api.com/api/data');
```

## 5. Deployment Checklist
- [ ] Ensure `payTo` addresses are correct (Mainnet vs Testnet).
- [ ] Verify you have a Stacks Facilitator URL (defaults to stacksx402.xyz).
- [ ] Set up environment variables for private keys (NEVER hardcode keys).

## 6. Troubleshooting & CI/CD

### Publishing Failures (403 Forbidden)
If you see `E403` errors during publishing, it usually means your session is expired or requires 2FA.

**Recommended Fix (Granular Access Token)**:
To allow scripts to publish without manual OTP entry:
1.  Generate a **Granular Access Token** on npmjs.com (Read & Write permissions).
2.  Enable "Bypass 2FA for publishing".
3.  Add the token to your project's `.npmrc` file:
    ```bash
    //registry.npmjs.org/:_authToken=YOUR_TOKEN_HERE
    ```
4.  Run `./publish-all.sh` again.
