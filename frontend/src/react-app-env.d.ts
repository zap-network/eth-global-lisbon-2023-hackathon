// <reference types="react-scripts" />

import Web3 from "web3";

declare global {
  interface Window {
    ethereum?: Web3;
    web3: any;
  }
}