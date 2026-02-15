import axios, { AxiosInstance } from 'axios';
import { wrapAxiosWithPayment } from 'x402-stacks';

/**
 * X402Agent represents an autonomous agent capable of making paid API calls.
 * It automatically handles 402 Payment Required responses.
 */
export class X402Agent {
  private api: AxiosInstance;

  constructor(public account: any) {
    this.api = wrapAxiosWithPayment(axios.create(), account);
  }

  /**
   * High-level method to make a request to a paid API.
   * Payment and retries are handled automatically by the wrapped axios instance.
   */
  async call(url: string, data?: any, method: 'get' | 'post' = 'post') {
    const response = await this.api.request({
      url,
      method,
      data,
    });
    return response.data;
  }
}
