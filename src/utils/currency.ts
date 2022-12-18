import { BigNumber } from "ethers";

export const weiToEther = (value?: BigNumber) => {
  const balanceInString = value?.toString();

  const balanceInEther =
    BigNumber.from(balanceInString)
      ?.div(BigNumber.from("10").pow(12))
      .toNumber() / 100_000;

  return balanceInEther;
};
