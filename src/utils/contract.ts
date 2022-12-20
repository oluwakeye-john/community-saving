import { ethers, Contract, BigNumber } from "ethers";
import { constants } from "../constants";
import contractAbi from "../contracts/build/CommunitySavings.json";

class SavingsContract {
  hasInitialized: boolean = false;
  contractAddress = constants.contractAddress;

  contract?: Contract;
  provider?: ethers.providers.Web3Provider;

  signer?: ethers.providers.JsonRpcSigner;

  currentAccount?: string;

  public async init() {
    if (!window.ethereum) return;
    this.provider = new ethers.providers.Web3Provider(window.ethereum);

    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });

    window.ethereum.on("disconnect", () => {
      window.location.reload();
    });

    const connectedAccounts = await this.provider.listAccounts();
    if (!connectedAccounts.length) return;

    this.currentAccount = connectedAccounts[0];
    this.setupContract();
  }

  private setupContract() {
    if (!this.provider) return;

    this.signer = this.provider.getSigner();

    const contract = new Contract(
      this.contractAddress,
      contractAbi,
      this.signer
    );
    this.contract = contract;
    this.hasInitialized = true;
  }

  public async connectWallet() {
    if (!this.provider) return;

    const accounts = await this.provider.send("eth_requestAccounts", []);
    const account = accounts[0];

    this.currentAccount = account;
    this.setupContract();
  }

  public getContractAddress() {
    if (!this.contract) return;

    return this.contract.address;
  }

  public async getTotalBalance(): Promise<BigNumber | undefined> {
    if (!this.contract) return;

    return await this.contract.totalBalance();
  }

  public async getTransactions(): Promise<any> {
    if (!this.contract) return;

    return await this.contract.getTransactions();
  }

  public async getOwner(): Promise<string | undefined> {
    if (!this.contract) return;

    return await this.contract?.owner();
  }

  public async getUserCount(): Promise<number | undefined> {
    if (!this.contract) return;

    const response = await this.contract?.getUserCount();
    return response.toString();
  }

  public async getAmountSavedByUser(): Promise<BigNumber | undefined> {
    if (!this.contract) return;

    return await this.contract?.getAmountSavedByUser();
  }

  public async deposit(amount: string, confirmationCallback?: VoidFunction) {
    if (!this.contract) return;

    const tx = await this.signer?.sendTransaction({
      to: this.contractAddress,
      value: ethers.utils.parseUnits(amount, "ether"),
    });

    if (!tx) return;

    this.waitToConfirmation(tx, confirmationCallback);
    return tx;
  }

  public async withdraw(amount: string, destAddr: string) {
    if (!this.contract) return;

    const formattedAmount = ethers.utils.parseUnits(amount, "ether");

    await this.contract?.withdraw(formattedAmount.toString(), destAddr);
  }

  public async waitToConfirmation(
    tx: ethers.providers.TransactionResponse,
    confirmationCallback?: VoidFunction
  ) {
    await tx?.wait();
    confirmationCallback?.();
  }
}

const savingsContractInstance = new SavingsContract();
export default savingsContractInstance;
