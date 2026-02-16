import express from 'express';
import { x402Paywall } from '@x402kit/middleware';

const app = express();
const port = 3000;

app.use(x402Paywall({
  prices: {
    '/data': '0.01 STX',
  },
  payTo: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // Example address
  network: 'testnet'
}));

app.get('/data', (req, res) => {
  res.json({ message: 'This is paid data!' });
});

app.get('/', (req, res) => {
  res.send('Welcome to your x402kit API!');
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
