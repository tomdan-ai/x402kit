import { X402Agent } from '@x402-kit/agent-client';
import { generateKeypair, privateKeyToAccount } from 'x402-stacks';

async function main() {
  // Generate a temporary account for demonstration
  const { privateKey } = generateKeypair('testnet');
  const account = privateKeyToAccount(privateKey, 'testnet');
  
  const agent = new X402Agent(account);

  console.log('Agent starting...');
  try {
    const data = await agent.call('http://localhost:3000/data');
    console.log('Response from paid API:', data);
  } catch (error) {
    console.error('Agent failed to call API:', error.message);
  }
}

main();
