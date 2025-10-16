# MEV-Protected Memecoin Trader

A decentralized trading application using **Nitrolite (ERC-7824)** state channels for MEV-protected memecoin trading on BNB Chain.

## 🎯 What This Does

This app allows you to trade memecoins **without MEV bots front-running your trades**. It uses state channels to execute trades off-chain, then settles the final result on-chain.

## 🛡️ MEV Protection

Traditional DEX trades are visible in the public mempool before execution, allowing MEV bots to:
- Front-run your buy orders (buying before you)
- Sandwich attack your trades (buying before, selling after)
- Extract value from your transactions

**With Nitrolite state channels:**
- ✅ Trades happen off-chain
- ✅ No public mempool visibility
- ✅ Only final settlement on-chain
- ✅ MEV bots can't see or intercept your trades

## 📋 Important Note About Current Implementation

The code has been corrected based on the **actual Nitrolite architecture**. However, please note:

### What's Working:
- ✅ Wallet connection
- ✅ Nitrolite client initialization
- ✅ Trade message creation and signing
- ✅ Proper TypeScript types

### What Needs Integration:
The Nitrolite SDK's **RPC component** and **application session management** aren't fully documented yet. To complete this integration, you'll need to:

1. **Review the Nitrolite examples:**
   - [Snake Game Example](https://github.com/erc7824/nitrolite)
   - [FlashBid Auction](https://yellow.com/news/flashbid-debuts-as-zero-gas-auction-platform-using-erc-7824-state-channels)

2. **Check the SDK README:**
   - Located at `node_modules/@erc7824/nitrolite/README.md`
   - Contains actual API methods and usage patterns

3. **Contact Yellow Network:**
   - Join their Discord/Telegram for developer support
   - Ask about trading application examples

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MetaMask wallet
- A channel created at [apps.yellow.com](https://apps.yellow.com)

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 How to Use

### Step 1: Create a Channel
1. Visit [apps.yellow.com](https://apps.yellow.com)
2. Create a new state channel
3. Copy your channel ID

### Step 2: Connect Wallet
1. Click "Connect MetaMask" in the app
2. Approve the connection

### Step 3: Initialize Nitrolite
1. Paste your channel ID
2. Click "Initialize State Channel"
3. Wait for confirmation

### Step 4: Trade
1. Enter token address you want to buy
2. Set amount of BNB to spend
3. Set minimum tokens expected
4. Set max slippage tolerance
5. Click "Execute MEV-Protected Trade"

## 🏗️ Architecture

```
User Wallet
    ↓
Nitrolite Client (TypeScript SDK)
    ↓
Off-chain State Channel (MEV Protected)
    ↓
ClearNode (Broker/Settlement)
    ↓
BNB Chain (Final Settlement)
```

## 📚 Key Files

- **`src/lib/nitrolite.ts`**: MemeTrader class with Nitrolite integration
- **`src/components/MemeTrader.tsx`**: React UI component
- **`src/app/page.tsx`**: Main page

## 🔧 Technical Details

### State Channels Lifecycle

1. **Channel Creation**: Lock funds in custody contract
2. **Off-Chain Trading**: Exchange signed messages between participants
3. **Settlement**: Submit final state to blockchain

### Trade Message Structure

```typescript
{
  type: 'SWAP',
  channelId: string,
  tokenIn: 'BNB',
  tokenOut: string, // Token address
  amountIn: string,
  minAmountOut: string,
  slippage: number,
  timestamp: number,
  nonce: number,
}
```

## 🔐 Security

- All trades are signed with your private key
- Messages use cryptographic signatures for verification
- State channels have built-in dispute resolution
- Only you can execute trades from your channel

## 🤝 Resources

- [ERC-7824 Specification](https://erc7824.org/)
- [Nitrolite GitHub](https://github.com/erc7824/nitrolite)
- [Yellow Network](https://yellow.org/build)
- [FlashBid Example](https://yellow.com/news/flashbid-debuts-as-zero-gas-auction-platform-using-erc-7824-state-channels)

## 🐛 Known Issues / TODO

- [ ] Complete RPC message routing implementation
- [ ] Add actual DEX integration (PancakeSwap/Uniswap)
- [ ] Implement channel asset management
- [ ] Add transaction history
- [ ] Add token price feeds
- [ ] Implement stop-loss / take-profit
- [ ] Add multi-chain support

## 📞 Support

For questions about Nitrolite integration:
- Check the [Nitrolite documentation](https://erc7824.org/)
- Join Yellow Network's community channels

## ⚠️ Disclaimer

This is experimental software. Always test with small amounts first. Not financial advice. DYOR.

## 📄 License

MIT
