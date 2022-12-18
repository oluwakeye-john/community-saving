/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { useEffect, useState } from "react";
import { Transaction } from "../@types/transaction";
import DepositForm from "../components/deposit-form";
import TransactionTable from "../components/transaction-table";
import WithdrawForm from "../components/withdraw-form";
import styles from "../styles/Home.module.scss";
import { shortenAddress } from "../utils/address";
import { weiToEther } from "../utils/currency";
import savingsContractInstance from "../utils/ethers";

const Home = () => {
  const [account, setAccount] = useState<string | undefined>(undefined);
  const [totalBalance, setTotalBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [amountSavedByUser, setAmountSavedByUser] = useState(0);
  const [owner, setOwner] = useState("");

  const initialize = async () => {
    await savingsContractInstance.init();

    if (savingsContractInstance.currentAccount) {
      setAccount(savingsContractInstance.currentAccount);

      fetchPageData();
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

      const balance = response[0];
      setTotalBalance(weiToEther(balance));

      const tx = response[1];
      const output: Transaction[] = tx.map((item: any) => {
        const timestamp = item.timestamp?.toNumber() * 1000;
        const data: Transaction = {
          address: item.addr,
          amount: weiToEther(item.amount),
          timestamp: new Date(timestamp).toUTCString(),
        };
        return data;
      });
      setTransactions(output.reverse());

      setUserCount(response[2] || 0);
      setAmountSavedByUser(weiToEther(response[3]));
      setOwner(response[4] || "");
    } catch (e) {
      console.log({ e });
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      <Head>
        <title>Community Saving</title>
        <meta
          name="description"
          content="A decentralized application that allows users to save collectively towards a target."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/dollar.png" type="image/x-icon" />
      </Head>

      <nav className={styles.navbar}>
        <span className={styles.navbar__label}>💰 Community Savings</span>

        <div className={styles.navbar__right}>
          {account ? (
            <>
              <span className={styles.badge}>{shortenAddress(account)}</span>
              <img
                alt="avatar"
                className={styles.avatar}
                src="https://crypto-sbarzotti.com/api/avatar/crypto%20sbarzotti"
              />
            </>
          ) : null}
        </div>
      </nav>

      {account ? (
        <main>
          <section>
            <h2 className={styles["section-header"]}>Savings Overview</h2>
            <div className={styles["balance-grid"]}>
              <div className={styles.card}>
                <span className={styles.card__label}>Available Balance</span>
                <span className={styles.card__value}>{totalBalance} ETH</span>
              </div>

              <div className={styles.card}>
                <span className={styles.card__label}>Active Savers</span>
                <span className={styles.card__value}>{userCount}</span>
              </div>

              <div className={styles.card}>
                <span className={styles.card__label}>Amount Saved By You</span>
                <span className={styles.card__value}>
                  {amountSavedByUser} ETH
                </span>
              </div>
            </div>
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
            <h2 className={styles["section-header"]}>Recent Transactions</h2>
            <TransactionTable transactions={transactions} />
          </section>
        </main>
      ) : (
        <main>
          <div className={styles["connect-form"]}>
            <h1>
              A <strong>Decentralized </strong> Application that allows users to
              save collectively towards a target.
            </h1>
            <button onClick={connectWallet}>Connect Metamask</button>
          </div>
        </main>
      )}
    </>
  );
};

export default Home;
