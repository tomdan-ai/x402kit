import axios from 'axios';

export class X402Agent {
  constructor(private wallet: any) {}

  async call(url: string, data: any) {
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 402) {
        // TODO: Handle 402 Payment Required
        console.log('Payment Required (402) detected');
        // 1. Parse payment details from headers
        // 2. Make payment using wallet
        // 3. Retry request with proof
      }
      throw error;
    }
  }
}
