import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

export const getInfuraProvider = (mainnet?: boolean) => {
  const provider = new ethers.providers.JsonRpcProvider(
    // `https://${mainnet ? "mainnet" : "rinkeby"}.infura.io/v3/${
    //   process.env.INFURA_API_KEY
    // }`
    "http://35.157.223.196:8545"
    // "http://localhost:8545"
  );
  return provider;
};

export const getEthersAccount = (mainnet?: boolean) => {
  const provider = getInfuraProvider(mainnet);
  const wallet = new ethers.Wallet(process.env.ACCOUNT_PRIVATE_KEY);
  return wallet.connect(provider);
};
