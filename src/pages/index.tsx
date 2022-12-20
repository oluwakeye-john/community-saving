/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Transaction } from "../@types/transaction";
import BalanceGrid from "../components/balance-grid";
import ConnectForm from "../components/connect";
import DepositForm from "../components/deposit-form";
import Navbar from "../components/navbar";
import Seo from "../components/seo";
import TransactionTable from "../components/transaction-table";
import WithdrawForm from "../components/withdraw-form";
import styles from "../styles/Home.module.scss";
import savingsContractInstance from "../utils/contract";
import { weiToEther } from "../utils/currency";
import { transformTransaction } from "../utils/transaction";

const Home = () => {
  const [account, setAccount] = useState<string | undefined>(undefined);
  const [totalBalance, setTotalBalance] = useState(0);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userCount, setUserCount] = useState(0);

  const [amountSavedByUser, setAmountSavedByUser] = useState(0);
  const [owner, setOwner] = useState("");

  const [hasLoaded, setHasLoaded] = useState(false);

  const initialize = async () => {
    await savingsContractInstance.init();

    if (savingsContractInstance.currentAccount) {
      setAccount(savingsContractInstance.currentAccount);

      fetchPageData();
    } else {
      setHasLoaded(true);
    }
  };

  const connectWallet = async () => {
    try {
      await savingsContractInstance.connectWallet();

      if (savingsContractInstance.currentAccount) {
        setAccount(savingsContractInstance.currentAccount);

        fetchPageData();
      }
    } catch (e) {
      console.log({ e });
    }
  };

  const fetchPageData = async () => {
    try {
      const response = await Promise.all([
        await savingsContractInstance.getTotalBalance(),
        await savingsContractInstance.getTransactions(),
        await savingsContractInstance.getUserCount(),
        await savingsContractInstance.getAmountSavedByUser(),
        await savingsContractInstance.getOwner(),
      ]);

      setTotalBalance(weiToEther(response[0]));
      setTransactions(transformTransaction(response[1]));
      setUserCount(response[2] || 0);
      setAmountSavedByUser(weiToEther(response[3]));
      setOwner(response[4] || "");
    } catch (e) {
      console.log({ e });
    } finally {
      setHasLoaded(true);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      <Seo />
      <Navbar account={account} hasLoaded={hasLoaded} />
      {hasLoaded ? (
        <>
          {account ? (
            <main>
              <section>
                <h2 className={styles["section-header"]}>Savings Overview</h2>
                <BalanceGrid
                  amountSavedByUser={amountSavedByUser}
                  totalBalance={totalBalance}
                  userCount={userCount}
                />
              </section>

              <section>
                <h2 className={styles["section-header"]}>Save Now</h2>
                <DepositForm successCallback={fetchPageData} />
              </section>

              {owner === account ? (
                <section>
                  <h2 className={styles["section-header"]}>Withdraw Funds</h2>
                  <WithdrawForm successCallback={fetchPageData} />
                </section>
              ) : null}

              <section>
                <h2 className={styles["section-header"]}>
                  Recent Transactions
                </h2>
                <TransactionTable transactions={transactions} />
              </section>
            </main>
          ) : (
            <main>
              <ConnectForm handleConnect={connectWallet} />
            </main>
          )}
        </>
      ) : null}
    </>
  );
};

export default Home;
