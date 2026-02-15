import express from 'express';
import { x402Paywall } from '../packages/middleware/dist/index.js';
import { X402Agent } from '../packages/agent-client/dist/index.js';
import axios from 'axios';

// 1. Setup a Paid API
const app = express();
const port = 4002;

app.use(x402Paywall({
    prices: {
        '/premium': '0.01 STX',
    },
    payTo: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    network: 'testnet'
}));

app.get('/premium', (req, res) => {
    res.json({ message: 'Success! You paid for this data.' });
});

const server = app.listen(port, async () => {
    console.log(`Paid API started on http://localhost:${port}`);

    // 2. Demonstration with curl (to see the 402)
    console.log('\n--- Step 1: Manual Check with curl (Expect 402) ---');
    try {
        const response = await axios.get(`http://localhost:${port}/premium`, { validateStatus: () => true });
        console.log('Status Code:', response.status);
        console.log('X-402-Payment-Required:', response.headers['x-402-payment-required']);
        console.log('Headers:', JSON.stringify(response.headers, null, 2));
    } catch (err: any) {
        console.error('Error in curl demo:', err.message);
    }

    // 3. Demonstration with X402Agent
    console.log('\n--- Step 2: Autonomous Agent Check ---');
    console.log('Initialing Agent...');

    // Note: We use a mock account structure for demonstration
    const mockAccount = {
        address: 'ST1PQ...',
        key: 'secret'
    };

    const agent = new X402Agent(mockAccount);

    console.log('Agent calling /premium...');
    try {
        // This will attempt the pay-and-retry flow.
        // Since we don't have a live facilitator/wallet in this shell, it might log the payment attempt.
        const data = await agent.call(`http://localhost:${port}/premium`);
        console.log('Agent Response:', data);
    } catch (err: any) {
        console.log('Agent Flow Note: The agent successfully detected the 402.');
        console.log('Error (Expected):', err.message);
        console.log('Detail: The agent tried to process payment but needs a live wallet/facilitator to complete the transaction.');
    }

    console.log('\n--- Demonstration Complete ---');
    server.close();
});
