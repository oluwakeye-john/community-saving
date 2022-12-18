import { useState } from "react";
import savingsContractInstance from "../utils/ethers";
import styles from "../styles/Home.module.scss";

interface IProps {
  successCallback?: VoidFunction;
}

type State = "idle" | "loading" | "confirming";

const DepositForm = (props: IProps) => {
  const [input, setInput] = useState("");
  const [state, setState] = useState<State>("idle");

  const handleDeposit = async () => {
    try {
      setState("loading");
      await savingsContractInstance.deposit(input, confirmationCallback);
      setState("confirming");
      props.successCallback?.();
      setInput("");
    } catch (e: any) {
      alert(e?.code || e);
      setState("idle");
    }
  };

  const confirmationCallback = () => {
    alert("Deposit successful");
    setState("idle");
    props.successCallback?.();
  };

  const isValid = !!Number(input);

  return (
    <form className={styles["deposit-form"]}>
      <input
        type="number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Amount to deposit"
      />

      <button disabled={!isValid || state !== "idle"} onClick={handleDeposit}>
        {state === "idle" && "Deposit"}
        {state === "loading" && "Loading"}
        {state === "confirming" && "Confirming..."}
      </button>
    </form>
  );
};

export default DepositForm;
