# Flappy Fox Web DApp

A modern decentralized application (DApp) for lottery, staking, and NFT marketplace, built with React, Vite, and TypeScript. The project supports multi-chain blockchain interaction (EVM chains & Solana), allowing users to connect wallets, stake tokens, buy/sell NFTs, and manage assets across different blockchains.

## 🚀 Features

- Multi-chain wallet connection (EVM & Solana)
- Token staking and rewards
- NFT marketplace (buy/sell NFTs)
- User profile and asset management
- Daily missions, achievements, and referral system
- Multi-language support (including Vietnamese, Chinese, Korean, etc.)
- Responsive UI with smooth page transitions

## 🔗 Chainlink Features Used

This project leverages several advanced Chainlink services to enhance security, interoperability, and fairness:

### 1. Chainlink CCIP (Cross-Chain Interoperability Protocol)
- **Purpose:** Enables secure cross-chain messaging and token transfers between supported blockchains.
- **Usage in project:** Used for cross-chain NFT and token operations, allowing users to interact seamlessly across Ethereum, BSC, and Avalanche.

### 2. Chainlink Price Feed
- **Purpose:** Provides reliable, decentralized price data for various tokens.
- **Usage in project:** Used to fetch real-time token prices for staking, rewards calculation, and NFT pricing, ensuring accurate and up-to-date values.

### 3. Chainlink VRF (Verifiable Random Function)
- **Purpose:** Supplies provably fair and tamper-proof randomness on-chain.
- **Usage in project:** Used for random reward distributions, guaranteeing fairness and transparency for all participants.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, TypeScript, Redux Toolkit
- **Blockchain:** ethers.js, viem, @reown/appkit (wallet & network connection)
- **UI:** shadcn/ui, Framer Motion, Sonner (notifications)
- **Testing:** Vitest
- **Others:** Docker, ESLint, Husky (git hooks)

## 📦 Installation & Usage

### Prerequisites

- Node.js >= 16
- pnpm (recommended)

### Setup

```sh
pnpm install
```

### Run Development Server

```sh
pnpm dev
```

### Build for Production

```sh
pnpm build
```

### Lint

```sh
pnpm lint
```

### Environment Variables

Copy `.env.example` to `.env` and update the values as needed.