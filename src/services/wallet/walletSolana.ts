import {
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  Connection,
  // Signer,
} from "@solana/web3.js";

interface SolanaProvider {
  signMessage: (message: Uint8Array) => Promise<Uint8Array>;
  sendTransaction: (
    transaction: Transaction,
    connection: Connection
  ) => Promise<string>;
}

export const signMessage = async (
  provider: SolanaProvider,
  // address?: string,
): Promise<string> => {
  if (!provider) return Promise.reject("No provider available");

  const encodedMessage = new TextEncoder().encode("Hello Reown Jfox!");
  const sig = await provider.signMessage(encodedMessage);

  return Buffer.from(sig).toString("hex");
};

export const getBalance = async (
  provider: SolanaProvider,
  connection: Connection,
  address: string
): Promise<string> => {
  if (!address || !connection) throw new Error("User is disconnected");

  const wallet = new PublicKey(address);
  const balance = await connection.getBalance(wallet);

  if (balance !== undefined) {
    return `${balance / LAMPORTS_PER_SOL}`;
  } else {
    return "-";
  }
};
