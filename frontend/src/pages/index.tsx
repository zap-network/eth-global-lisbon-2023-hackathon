"use client"
import React from "react";
import Web3 from "web3";
import "../app/globals.css";
import "dotenv/config";
import { Web3ModalButton } from "../components/Web3ModalButton.tsx";
import { useState, useEffect } from 'react';
import { connect } from './metamask.ts';

import axios from 'axios';
import { Card, Table, Text, Row, Button } from "@nextui-org/react";
import styled from 'styled-components';
import { GiLightningHelix } from "react-icons/gi";
import { IoMdCog } from 'react-icons/io';

const IndexPage = styled.div`
    table{
        background-color: white !important;
    }
    .metamaskButton {

        font-weight: 1000;
        font-size: 1.5rem;
        width: 300px;
        height: 70px;
        border: 2px solid black;
        background: linear-gradient(to right, 
            red, 
            orange, 
            yellow, 
            green, 
            blue, 
            indigo, 
            violet);
    background-size: 1800% 1800%;
    animation: rainbow 18s ease infinite;

    @keyframes rainbow {
    0% {
    background-position: 0% 82%;
    }
    50% {
    background-position: 100% 19%;
    }
    100% {
    background-position: 0% 82%;
    }
    }
`
const TitleLeftPane = styled.div`
    float: left;
`

const TitleRightPane = styled.div`
    float: right;
`

const Title = styled.h1`
    font-weight: 1000;
    font-style: oblique;
    font-size: 2rem;
    display: flex;
    svg {
        margin-right: 20px;
    }
`

const CardLine = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-top: 30px;
    margin-bottom: 30px;
`

const POLYGON_MUMBAI_URL = "https://mumbai.polygonscan.com/tx/"
export default function Home() {
    const [web3, setWeb3] = useState<Web3>(new Web3('https://api-testnet.polygonscan.com/'));
    const [account, setAccount] = useState<string>("0x3a22c8bc68e98b0faf40f349dd2b2890fae01484");
    const [balances, setBalances] = useState<{ [account: string]: string }>({});
    const [txs, setTxs] = useState<[]>([]);
    // const { active, error, activate } = useWeb3React<Web3Provider>();

    const API_ENDPOINT = 'https://api.polygonscan.com/api';

    async function getTransactionsForAccount(account: string): Promise<any> {
        try {
            const response = await axios.get(API_ENDPOINT, {
                params: {
                    module: 'account',
                    action: 'txlist',
                    address: account,
                    startblock: 0,
                    endblock: 99999999,
                    page: 1,
                    offset: 100,
                    sort: 'asc',
                    apikey: 'CKIKS627NRN9YKDHUTUH8TRG7MNMQA8ERT',
                },
            });

            console.log(response.data.result);

            setTxs(response.data.result)
            return response.data;
        } catch (error: any) {
            console.error(`Error fetching transactions for account ${account}: ${error.message}`);
            throw error;
        }
    }

    async function getBalanceAPI(accounts: string): Promise<any> {
        try {
            const response = await axios.get(API_ENDPOINT, {
                params: {
                    module: 'account',
                    action: 'balance',
                    address: accounts,
                    startblock: 0,
                    endblock: 99999999,
                    page: 1,
                    offset: 100,
                    sort: 'asc',
                    apikey: 'CKIKS627NRN9YKDHUTUH8TRG7MNMQA8ERT',
                },
            });

            console.log(response.data.result);

            setBalances(response.data.result)
            return response.data;
        } catch (error: any) {
            console.error(`Error fetching transactions for account ${accounts}: ${error.message}`);
            throw error;
        }
    }
    useEffect(() => {
        getTransactionsForAccount(account)
        getBalanceAPI(account)

        // Fetch the list of accounts and set them in state
        // web3.eth.getAccounts().then(setAccounts);
    }, []);

    // useEffect(() => {
    //     if (web3 && accounts.length > 0) {
    //         // Create a dictionary of account balances and set it in state
    //         const balances = {} as { [account: string]: string };
    //         accounts.forEach(account => {
    //             web3.eth.getBalance(account).then(balance => {

    //                 const balanceMatic = web3.utils.fromWei(balance, 'ether');
    //                 balances[account] = balanceMatic;
    //                 setBalances(balances);
    //             });
    //         });
    //     }
    // }, [web3, accounts]);

    // Example function to get the balance of a Polygon Mumbai testnet address
    async function getBalance(address: string): Promise<string> {
        const balanceWei = await web3.eth.getBalance(address);
        const balanceMatic = web3.utils.fromWei(balanceWei, 'ether');
        return balanceMatic;
    }
    // async loadWeb3() {
    //   if (window.ethereum) {
    //     window.web3 = new Web3(window.ethereum);
    //     await window.ethereum.request({
    //       method: "eth_requestAccounts",
    //     });
    //   } else if (window.web3) {
    //     window.web3 = new Web3(window.web3.currentProvider);
    //   } else {
    //     window.alert(
    //       "Non-Ethereum browser detected. You should consider trying MetaMask!"
    //     );
    //   }
    // }

    const [walletAddress, setWalletAddress] = useState("");

    useEffect(() => {
        getCurrentWalletConnected();
        addWalletListener();
      }, [walletAddress]);
    
      const connectWallet = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
          try {
            /* MetaMask is installed */
            const accounts = await window.ethereum.request({
              method: "eth_requestAccounts",
            });
            setWalletAddress(accounts[0]);
            console.log(accounts[0]);
          } catch (err ) {
            console.error(err.message);
          }
        } else {
          /* MetaMask is not installed */
          console.log("Please install MetaMask");
        }
      };
    
      const getCurrentWalletConnected = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
          try {
            const accounts = await window.ethereum.request({
              method: "eth_accounts",
            });
            if (accounts.length > 0) {
              setWalletAddress(accounts[0]);
              console.log(accounts[0]);
            } else {
              console.log("Connect to MetaMask using the Connect button");
            }
          } catch (err) {
            console.error(err.message);
          }
        } else {
          /* MetaMask is not installed */
          console.log("Please install MetaMask");
        }
      };
    
      const addWalletListener = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
          window.ethereum.on("accountsChanged", (accounts) => {
            setWalletAddress(accounts[0]);
            console.log(accounts[0]);
          });
        } else {
          /* MetaMask is not installed */
          setWalletAddress("");
          console.log("Please install MetaMask");
        }
      };

    return (
        <IndexPage>
            {
                walletAddress != '' ?
             (<div> <TitleLeftPane><Title><GiLightningHelix size={48} color="yellow" />Zap Token </Title></TitleLeftPane>
             <TitleRightPane><IoMdCog size={48} color="yellow" /> Settings</TitleRightPane>
                        <CardLine>
                            <Card>
                                <Card.Header>
                                    <Text b>Balance</Text>
                                </Card.Header>
                                <Card.Divider />
                                <Card.Body css={{ py: "$10" }}>
                                    <Text b>
                                        {balances.toString()} MATIC
                                    </Text>
                                </Card.Body>
                            </Card>
                            <Card>
                                <Card.Header>
                                    <Text b>Current Production Rate Hour</Text>
                                </Card.Header>
                                <Card.Divider />
                                <Card.Body css={{ py: "$10" }}>
                                    <Text b>
                                        {balances.toString()} Watt/hour
                                    </Text>
                                </Card.Body>
                            </Card>
                            <Card>
                                <Card.Header>
                                    <Text b>Current Consumption Rate Hour</Text>
                                </Card.Header>
                                <Card.Divider />
                                <Card.Body css={{ py: "$10" }}>
                                    <Text b>
                                        {balances.toString()} Watt/hour
                                    </Text>
                                </Card.Body>
                            </Card>
                        </CardLine>
                        <Table striped>
                            <Table.Header>
                                <Table.Column>From</Table.Column>
                                <Table.Column>To</Table.Column>
                                <Table.Column>Value</Table.Column>
                                <Table.Column>Gas</Table.Column>
                                <Table.Column>State</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {txs.map((item, index) => (
                                    <Table.Row key={index} >
                                        <Table.Cell>
                                            <a href={`${POLYGON_MUMBAI_URL}${item['hash']}`}>
                                                {item["from"]}</a>
                                        </Table.Cell>
                                        <Table.Cell>{item["to"]}</Table.Cell>
                                        <Table.Cell>{item["value"]}</Table.Cell>
                                        <Table.Cell>{item["gas"]}</Table.Cell>
                                        <Table.Cell>{item["state"]}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                    ) :
                    (<Button className="metamaskButton" onPress={connectWallet} css={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",                      
                      }}>
                        Connect to Metamask
                    </Button>)
            }
        </IndexPage>
    )
}