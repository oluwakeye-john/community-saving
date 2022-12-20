import { useEffect, useState } from "react";
import styles from "../styles/Home.module.scss";

interface IProps {
  handleConnect: VoidFunction;
}

const ConnectForm = (props: IProps) => {
  const [hasWalletExtension, setHasWalletExtension] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      setHasWalletExtension(true);
    }
  }, []);

  const handleConnect = () => {
    if (hasWalletExtension) {
      props.handleConnect();
    } else {
      window.open("https://metamask.io/download/", "_blank");
    }
  };

  return (
    <section className={styles["connect-form"]}>
      <h1>
        A <strong>Decentralized </strong> Application that allows users to save
        collectively towards a target.
      </h1>
      <button onClick={handleConnect}>Connect Metamask</button>
    </section>
  );
};

export default ConnectForm;
