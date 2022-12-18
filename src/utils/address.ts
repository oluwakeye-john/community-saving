export const shortenAddress = (address: string) => {
  return `${address.slice(0, 8)}...${address.slice(-8)}`;
};
