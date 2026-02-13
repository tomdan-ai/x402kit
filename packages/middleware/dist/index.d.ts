import { Request, Response, NextFunction } from 'express';
interface X402Options {
    prices: Record<string, string>;
}
export declare function x402Paywall(options: X402Options): (req: Request, res: Response, next: NextFunction) => void;
export {};
