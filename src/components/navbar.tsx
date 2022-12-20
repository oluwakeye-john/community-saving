/* eslint-disable @next/next/no-img-element */
import styles from "../styles/Home.module.scss";
import { shortenAddress } from "../utils/address";

interface IProps {
  account?: string;
  hasLoaded: boolean;
}

const Navbar = (props: IProps) => {
  const { account, hasLoaded } = props;

  return (
    <nav className={styles.navbar}>
      <span className={styles.navbar__label}>💰 Community Saving</span>

      <div className={styles.navbar__right}>
        {hasLoaded && account ? (
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
  );
};

export default Navbar;
