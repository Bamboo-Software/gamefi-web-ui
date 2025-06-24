import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
  mainnet,
  arbitrum,
  solana,
  optimism,
  polygon,
  avalancheFuji,
  sepolia,
} from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { siteURL } from "./config";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

// Get projectId from https://cloud.reown.com
export const projectId = import.meta.env.VITE_PROJECT_ID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const metadata = {
  name: "Lottery Jfox",
  description: "Lottery Jfox",
  url: siteURL, // origin must match your domain & subdomain
  icons: [
    "https://s3-sgp2.bamboosoft.io/igc/2025/03/04/1741076163909-Jfox.png",
  ],
};

// for custom networks visit -> https://docs.reown.com/appkit/react/core/custom-networks
export const networks = [
  mainnet,
  arbitrum,
  optimism,
  polygon,
  solana,
  avalancheFuji,
  sepolia
] as [AppKitNetwork, ...AppKitNetwork[]];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
});

// Set up Solana Adapter
export const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});