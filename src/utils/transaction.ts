import { Transaction } from "../@types/transaction";
import { weiToEther } from "./currency";

export const transformTransaction = (response: any) => {
  const output: Transaction[] = response.map((item: any) => {
    const timestamp = item.timestamp?.toNumber() * 1000;
    const data: Transaction = {
      address: item.addr,
      amount: weiToEther(item.amount),
      timestamp: new Date(timestamp).toUTCString(),
    };
    return data;
  });

  return output.reverse();
};
