# Swift Protocol

An advanced decentralized exchange with custom protocol fees built on Solana.

## Overview

Swift Protocol is a high-performance decentralized exchange interface that leverages cutting-edge aggregation technology to deliver optimal token swaps on the Solana blockchain. The protocol implements a streamlined fee structure to ensure sustainability while maintaining competitive rates.

## Features

- Lightning-fast token swaps with automatic best price discovery
- Optimized 0.3% protocol fee structure for sustainability
- Real-time price quotes and intelligent execution path routing
- Seamless wallet integration with popular Solana wallets
- Advanced aggregation technology for superior liquidity
- Full Solana Devnet support for testing and development
- Sleek, modern UI for an exceptional user experience

## Technology Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Blockchain**: Solana, Jupiter Aggregation APIs
- **Wallet Integration**: Solana Wallet Adapter
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A Solana wallet (Phantom, Solflare, etc.)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/swift-protocol.git
cd swift-protocol
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following:

```
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_JUPITER_API=https://quote-api.jup.ag/v6
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Connect your Solana wallet using the "Connect Wallet" button
2. Select tokens to swap from the dropdown menus
3. Enter the amount you want to swap
4. Adjust slippage tolerance if needed (default is 0.5%)
5. Click the "Swap" button to execute the transaction

## Customizing the Fee

The protocol fee is set to 0.3% by default. To change this, modify the `CUSTOM_FEE_BPS` value in `lib/jupiter.ts`. The fee is specified in basis points (1% = 100 basis points).

## Mainnet Deployment

To deploy to Solana Mainnet:

1. Update the `NEXT_PUBLIC_SOLANA_NETWORK` environment variable to `mainnet-beta`
2. Update the `FEE_RECIPIENT` address in `lib/jupiter.ts` to your actual fee collection wallet

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Jupiter](https://jup.ag/) for their powerful swap infrastructure
- [Solana](https://solana.com/) for the high-performance blockchain platform
- [Next.js](https://nextjs.org/) for the React framework
