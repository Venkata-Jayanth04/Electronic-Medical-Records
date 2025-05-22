import Web3 from "web3";
import HealthSystem from "./HealthSystem.json"; // Now safe

let web3;
let contract;

const initWeb3 = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = HealthSystem.networks[networkId];

    if (!deployedNetwork) {
      alert("Smart contract not deployed to this network.");
      return;
    }

    contract = new web3.eth.Contract(
      HealthSystem.abi,
      deployedNetwork.address
    );

    console.log("Web3 initialized successfully");
    console.log("Contract Address:", deployedNetwork.address);
  } else {
    alert("Please install MetaMask.");
  }
};

export { initWeb3, web3, contract };
