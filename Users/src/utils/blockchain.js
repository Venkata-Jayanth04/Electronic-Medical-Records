import Web3 from "web3";
import HealthSystemABI from "./HealthSystem.json"; // Your contract ABI JSON

const CONTRACT_ADDRESS = "0xd51876A8e81Bad826EAb7FC8c38fCdAdd8DDf71d";

export async function getWeb3() {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    return web3;
  }
  alert("Please install MetaMask!");
  return null;
}

export async function getContract(web3) {
  return new web3.eth.Contract(HealthSystemABI.abi, CONTRACT_ADDRESS);
}
