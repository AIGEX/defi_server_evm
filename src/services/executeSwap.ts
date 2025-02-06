import { PinoLogger } from "@/PinoLogger";
import type { SwapServiceServer } from "@/generated/swap";

import bs58 from "bs58";

const logger = PinoLogger.getInstance();

export const executeSwap: SwapServiceServer["executeSwap"] = async (call, callback) => {
    const { userId, fromToken, toToken, amount, maxSlippage } = call.request;

    logger.debug({ userId, fromToken, toToken, amount, maxSlippage });

    // @ts-ignore
    const walletInfo = await storage.getCurrentWalletInfo(userId);

    if (!walletInfo || (!walletInfo?.address && !walletInfo?.private_key && !walletInfo?.name)) {
        callback(new Error(`No active wallet found for user ${userId}`));
        return;
    }

    try {
        const givenMaxSlippage = Math.min(maxSlippage * 100, 10000);

        // @ts-ignore
        const quoteResponse = await getQuoteFrom1inch({ fromToken, toToken, amount: actualFromTokenAmount, givenMaxSlippage });

        if (!quoteResponse) {
            logger.error("Failed to quote");
            callback(new Error("Failed to quote"));
            return;
        }

        // @ts-ignore
        const swapResponse = await getSwapTransactionFromUniswap({
            quoteResponse,
            walletAddress: walletInfo.address,
            givenMaxSlippage,
        });

        if (!swapResponse) {
            callback(new Error("Failed to get swap transaction"));
            return;
        }

        // sign

        // @ts-ignore
        const txHash = await sendTransaction(swapResponse);

        callback(null, {
            code: 0,
            message: `https://solscan.io/tx/${txHash}/`,
            txHash: txHash,
        });
    } catch (error) {
        logger.error(error);
        callback(new Error("Failed to execute swap"));
    }
};
