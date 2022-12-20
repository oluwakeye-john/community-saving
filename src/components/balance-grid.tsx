import styles from "../styles/Home.module.scss";

interface IProps {
  totalBalance: number;
  userCount: number;
  amountSavedByUser: number;
}

const BalanceGrid = (props: IProps) => {
  const { amountSavedByUser, totalBalance, userCount } = props;

  return (
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
        <span className={styles.card__value}>{amountSavedByUser} ETH</span>
      </div>
    </div>
  );
};

export default BalanceGrid;
