// "use client"
// import React from "react";
// import Web3 from "web3";
// import "./globals.css";
// import "dotenv/config";
// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import { use } from '@maticnetwork/maticjs'
// import { Web3ClientPlugin } from '@maticnetwork/maticjs-web3'
// import apiPost from "@/utils/apiPost";
// import apiGet from "@/utils/apiPost";

// // install web3 plugin
// use(Web3ClientPlugin)

// import axios from 'axios';

// const columns = [
//     {
//       title: 'Transaction Hash',
//       dataIndex: 'hash',
//       width: 200,
//     },
//     {
//       title: 'Value',
//       dataIndex: 'value',
//       width: 100,
//     },
//     {
//       title: 'State',
//       dataIndex: 'state',
//       width: 100,
//     },
//   ];
// export default function Home() {
//     const [web3, setWeb3] = useState<Web3>(new Web3('https://rpc-mumbai.maticvigil.com'));
//     const [accounts, setAccounts] = useState<string[]>(["0xf903ba9e006193c1527bfbe65fe2123704ea3f99"]);
//     const [balances, setBalances] = useState<{ [account: string]: string }>({});
//     const [txs, setTxs] = useState<{}>({});

//     const API_ENDPOINT = 'https://api.polygonscan.com/api';

//     async function getTransactionsForAccount(accounts: string): Promise<any> {
//       try {
//         const response = await axios.get(API_ENDPOINT, {
//           params: {
//             module: 'account',
//             action: 'txlist',
//             address: accounts,
//             startblock: 0,
//             endblock: 99999999,
//             page: 1,
//             offset: 10,
//             sort: 'asc',
//             apikey: 'CKIKS627NRN9YKDHUTUH8TRG7MNMQA8ERT',
//           },
//         });
    
//         console.log(response.data);
        
//         setTxs(response.data)
//         return response.data;
//       } catch (error: any) {
//         console.error(`Error fetching transactions for account ${accounts}: ${error.message}`);
//         throw error;
//       }
//     }
//     useEffect(() => {
//         getTransactionsForAccount(accounts.toString())

        
//         // Fetch the list of accounts and set them in state
//         // web3.eth.getAccounts().then(setAccounts);
//     }, []);

//     // useEffect(() => {
//     //     if (web3 && accounts.length > 0) {
//     //         // Create a dictionary of account balances and set it in state
//     //         const balances = {} as { [account: string]: string };
//     //         accounts.forEach(account => {
//     //             web3.eth.getBalance(account).then(balance => {
                    
//     //                 const balanceMatic = web3.utils.fromWei(balance, 'ether');
//     //                 balances[account] = balanceMatic;
//     //                 setBalances(balances);
//     //             });
//     //         });
//     //     }
//     // }, [web3, accounts]);

//     // Example function to get the balance of a Polygon Mumbai testnet address
//     async function getBalance(address: string): Promise<string> {
//         const balanceWei = await web3.eth.getBalance(address);
//         const balanceMatic = web3.utils.fromWei(balanceWei, 'ether');
//         return balanceMatic;
//     }
//     // async loadWeb3() {
//     //   if (window.ethereum) {
//     //     window.web3 = new Web3(window.ethereum);
//     //     await window.ethereum.request({
//     //       method: "eth_requestAccounts",
//     //     });
//     //   } else if (window.web3) {
//     //     window.web3 = new Web3(window.web3.currentProvider);
//     //   } else {
//     //     window.alert(
//     //       "Non-Ethereum browser detected. You should consider trying MetaMask!"
//     //     );
//     //   }
//     // }

//     async function loadBlockchainData() {
//         const web3 = window.web3;
//         // Load account
//         const accounts = await web3.eth.getAccounts();
//     }



//     // toggleDarkMode(event: { stopPropagation: () => void; }) {
//     //   event.stopPropagation();
//     //   this.setState((prevState) => {
//     //     this.setDarkModeToLocalStorage(!prevState.isDarkModeEnabled);
//     //     return { isDarkModeEnabled: !prevState.isDarkModeEnabled };
//     //   });
//     // }

//     function setDarkModeToLocalStorage(val: string) {
//         try {
//             localStorage.setItem("isDarkModeEnabled", val);
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     function getDarkModeFromLocalStorage() {
//         try {
//             const isDarkModeEnabled = localStorage.getItem("isDarkModeEnabled");
//             if (isDarkModeEnabled !== undefined || isDarkModeEnabled !== null) {
//                 if (isDarkModeEnabled === "true") return true;
//                 else return false;
//             }
//             return false;
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     // function constructor(props: {}) {
//         //     super(props);
//         //     //   this.state = {
//         //     //     isDarkModeEnabled: false,
//         //   };

//     // }

//     function componentDidMount() {
//         // loadBlockchainData();

//         //   this.setState({ isDarkModeEnabled: this.getDarkModeFromLocalStorage() });
//     }

//     // return (
//     // <div className={this.state.isDarkModeEnabled ? "bg-dark" : "bg-light"}>

//     // </div>
//     //   );

//     return (
//         <div>
//                 {/* <Table data={txs} columns={columns} width={500} height={400} /> */}
//                 <Table>
//                     </Table>

//             <table>
//                 <thead>
//                     <tr>
//                         <th>Account</th>
//                         <th>Balance</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {accounts.map(account => (
//                         <tr key={account}>
//                             <td>{account}</td>
//                             <td>{web3 ? balances[account] : '-'}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             <h1>About us</h1>
//             <p>Click <Link href="/">here</Link> to go back to the home page.</p>
//         </div>

//     )
// }