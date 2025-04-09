export const shortenAddress = (address?: string, startLength = 20, endLength = 4): string => {
  if (!address) return "";
  if (address.length <= startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};
