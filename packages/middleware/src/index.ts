import { Request, Response, NextFunction } from 'express';
import { paymentMiddleware, STXtoMicroSTX } from 'x402-stacks';

export interface X402Options {
  prices: Record<string, string>;
  payTo: string;
  network?: 'mainnet' | 'testnet';
  facilitatorUrl?: string;
}

/**
 * x402Paywall middleware for Express.
 * Protects routes based on the provided prices map.
 */
export function x402Paywall(options: X402Options) {
  const { prices, payTo, network = 'testnet', facilitatorUrl = 'https://facilitator.stacksx402.xyz' } = options;

  // Pre-calculate microSTX prices to avoid parsing on every request
  const microPrices: Record<string, string | bigint> = {};
  for (const [path, priceStr] of Object.entries(prices)) {
    const amount = parseFloat(priceStr.split(' ')[0]);
    microPrices[path] = STXtoMicroSTX(amount);
  }

  return (req: Request, res: Response, next: NextFunction) => {
    const amount = microPrices[req.path];

    if (amount !== undefined) {
      // Use x402-stacks paymentMiddleware for the specific amount
      return paymentMiddleware({
        amount,
        payTo,
        network,
        facilitatorUrl
      })(req, res, next);
    }

    // No price defined for this route, proceed
    next();
  };
}
