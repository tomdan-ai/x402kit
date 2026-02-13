"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.X402Agent = void 0;
const axios_1 = __importDefault(require("axios"));
class X402Agent {
    wallet;
    constructor(wallet) {
        this.wallet = wallet;
    }
    async call(url, data) {
        try {
            const response = await axios_1.default.post(url, data);
            return response.data;
        }
        catch (error) {
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
exports.X402Agent = X402Agent;
//# sourceMappingURL=index.js.map