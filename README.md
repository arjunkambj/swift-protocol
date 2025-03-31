# Swift Protocol

Swift Protocol is a decentralized application for token swaps on the Solana blockchain, using Jupiter aggregator for liquidity and optimal swap routes.

## Features

- Connect Solana wallets (Phantom, Solflare, etc.)
- Swap tokens on Solana with real-time market data
- Transaction history stored in Supabase
- Modern and responsive UI
- Slippage control for trading preferences

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Blockchain**: Solana, Jupiter Aggregator API
- **Wallet Integration**: Solana Wallet Adapter
- **Database**: Supabase

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/swift-protocol.git
cd swift-protocol
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Create a `.env.local` file based on `.env.example` and add your credentials:

```
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Set up Supabase:

   - Create a new Supabase project
   - Create a `swap_transactions` table with these columns:
     - `id` (uuid, primary key)
     - `fromToken` (text)
     - `toToken` (text)
     - `fromAmount` (float8)
     - `toAmount` (float8)
     - `walletAddress` (text)
     - `txSignature` (text)
     - `timestamp` (bigint)

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Connect your Solana wallet using the "Connect Wallet" button
2. Select the tokens you want to swap from the dropdown menus
3. Enter the amount you want to swap
4. Review the swap details and rate
5. Click "Swap" to execute the transaction

## License

MIT

## Acknowledgments

- [Jupiter](https://jup.ag/) for their powerful swap infrastructure
- [Solana](https://solana.com/) for the high-performance blockchain platform
- [Next.js](https://nextjs.org/) for the React framework
