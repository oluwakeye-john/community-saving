import { useState } from "react";
import styles from "../styles/Home.module.scss";
import savingsContractInstance from "../utils/contract";

interface IProps {
  successCallback?: VoidFunction;
}

const WithdrawForm = (props: IProps) => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    try {
      setLoading(true);
      await savingsContractInstance.withdraw(amount, address);
      props.successCallback?.();
    } catch (e: any) {
      alert(e?.code || e);
    } finally {
      setLoading(false);
    }
  };

  const isValid = !!amount && !!address;

  return (
    <form className={styles["deposit-form"]}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount to withdraw"
      />

      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Destination Address"
      />

      <button disabled={!isValid || loading} onClick={handleWithdraw}>
        {loading ? "Loading..." : "Withdraw"}
      </button>
    </form>
  );
};

export default WithdrawForm;
