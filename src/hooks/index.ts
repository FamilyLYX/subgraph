import {
  Contract,
  InterfaceAbi,
  JsonRpcProvider,
  JsonRpcSigner,
  Provider,
  Signer,
} from "ethers";
const rpcProvider = new JsonRpcProvider("https://rpc.testnet.lukso.network");

export const useContract = (
  target: string,
  abi: InterfaceAbi,
  provider: JsonRpcProvider | JsonRpcSigner = rpcProvider
) => new Contract(target, abi, provider);
