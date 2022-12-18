import { Transaction } from "../@types/transaction";
import styles from "../styles/Home.module.scss";

interface IProps {
  transactions: Transaction[];
}

const TransactionTable = ({ transactions }: IProps) => {
  return (
    <div className={styles["table-wrapper"]}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>S/N</th>
            <th>Address</th>
            <th>Transaction value</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((item, index) => {
            return (
              <tr key={index}>
                <th>#{index + 1}</th>
                <td>{item.address}</td>
                <td
                  className={
                    styles[item.amount >= 0 ? "green-text" : "red-text"]
                  }
                >
                  {item.amount} ETH
                </td>
                <td>{item.timestamp}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
