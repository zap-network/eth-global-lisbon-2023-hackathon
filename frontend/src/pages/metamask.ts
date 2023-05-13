// import Web3 from 'web3';
// import { providers } from "ethers";
// import detectEthereumProvider from '@metamask/detect-provider';

// let provider: providers.Web3Provider | undefined = undefined;

// export const connect = async () => {
//   if (provider) {
//     return provider;
//   }

//   const ethProvider = await detectEthereumProvider();

//   if (ethProvider) {
//     provider = new providers.Web3Provider(ethProvider);
//     return provider;
//   } else {
//     throw new Error('Metamask not found');
//   }
// };

// export const getWeb3 = async () => {
//   const ethProvider = await detectEthereumProvider();

//   if (ethProvider) {
//     return new Web3(ethProvider);
//   } else {
//     throw new Error('Metamask not found');
//   }
// };
