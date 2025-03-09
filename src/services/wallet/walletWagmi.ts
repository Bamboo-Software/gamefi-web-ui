// import { formatUnits } from "viem";

// interface EthereumProvider {
//   request: (request: { method: string; params?: any[] }) => Promise<any>;
// }

// export const signMessage = (
//   provider: EthereumProvider,
//   address: string
// ): Promise<string> => {
//   if (!provider) return Promise.reject("No provider available");

//   return provider.request({
//     method: "personal_sign",
//     params: ["Hello from Jfox", address],
//   });
// };

// export const getBalance = async (
//   provider: EthereumProvider,
//   address: string
// ): Promise<string> => {
//   if (!provider) return Promise.reject("No provider available");

//   const balance = await provider.request({
//     method: "eth_getBalance",
//     params: [address, "latest"],
//   });

//   const ethBalance = formatUnits(BigInt(balance), 18); 
//   return ethBalance;
// };
