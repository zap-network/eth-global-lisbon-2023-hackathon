"use client"
import React from "react";
import Web3 from "web3";
import "../app/globals.css";
import { Swap, getSwapsForAccount } from "../../client/src/contracts/SwapSubgraph"
import "dotenv/config";
import { Web3ModalButton } from "../components/Web3ModalButton.tsx";
import { useState, useEffect } from 'react';
import { connect } from './metamask.ts';
import FormModal from '../components/FormModal';


import axios from 'axios';
import { Card, Table, Text, Row, Button } from "@nextui-org/react";
import styled from 'styled-components';
import { GiLightningHelix } from "react-icons/gi";
import { IoMdCog } from 'react-icons/io';

// import erc20ABI from '../../../contracts/zap.abi';
// const { erc20ABI } = require('../../../contracts/zap.abi');
const erc20ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "burnToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "subtractedValue",
                "type": "uint256"
            }
        ],
        "name": "decreaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "addedValue",
                "type": "uint256"
            }
        ],
        "name": "increaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "issueToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

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

const web3 = new Web3('https://rpc-mumbai.maticvigil.com/')
const contractAddress = '0x3092ef862A180D0f44C5E537EfE05Cd7DCbB28A7';
const POLYGON_MUMBAI_URL = "https://mumbai.polygonscan.com/tx/"

export default function Home() {
    const [account, setAccount] = useState<string>("");
    const [balances, setBalances] = useState<string>("");
    const [txs, setTxs] = useState<Swap[]>([]);

    const [configs, setConfigs] = useState<{}>({});

    const API_ENDPOINT = 'https://api.polygonscan.com/api';

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

    async function getConfigs(): Promise<any> {
        try {
            const response = await axios.get("http://localhost:8082/config");

            console.log(response.data.result);

            setConfigs(response.data.result)
            return response.data;
        } catch (error: any) {
            console.error(`Error fetching configs ${error.message}`);
            throw error;
        }
    }

    useEffect(() => {
        if (account != "") {
            const intervalId = setInterval(() => {
                getSwapsForAccount(account).then((swaps) => {
                    setTxs(swaps)
                })
                getBalanceAPI(account)
            }, 1000);
        }
    }, []);

    async function getBalance(address: string): Promise<string> {

        const contract = new web3.eth.Contract(erc20ABI, contractAddress);
        const balanceWei = await contract.methods.balanceOf(address).call();
        // const balanceWei = await web3.eth.getBalance(address);

        return web3.utils.fromWei(balanceWei, 'ether');;
    }

    useEffect(() => {
        getCurrentWalletConnected();
        addWalletListener();
        getConfigs();
    }, [account]);

    const connectWallet = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            try {
                /* MetaMask is installed */
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                updateAccount(accounts[0]);
            } catch (err) {
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
                    updateAccount(accounts[0])
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

    function updateAccount(account: string) {
        setAccount(account);
        console.log(account);

        // getBalanceAPI(account)
        getBalance(account).then(setBalances)
    }
    const addWalletListener = async () => {
        if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
            window.ethereum.on("accountsChanged", (accounts: any[]) => {
                updateAccount(accounts[0])
            });
        } else {
            /* MetaMask is not installed */
            setAccount("");
            setBalances("")
            console.log("Please install MetaMask");
        }
    };

    function openModal() {

    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => {
        setIsModalOpen(true);
      };
    
      const handleCloseModal = () => {
        setIsModalOpen(false);
      };

    return (
        <IndexPage>
            {
                account != '' ?
                    (<div> <TitleLeftPane><Title><GiLightningHelix size={48} color="yellow" />Zap Token </Title></TitleLeftPane>
                        <TitleRightPane onPress={openModal}><IoMdCog size={48} color="yellow" /> Settings
                        <Button onPress={handleOpenModal}>Open Modal</Button>
    {isModalOpen && <FormModal />}
                        </TitleRightPane>
                        <CardLine>
                            <Card>
                                <Card.Header>
                                    <Text b>Balance</Text>
                                </Card.Header>
                                <Card.Divider />
                                <Card.Body css={{ py: "$10" }}>
                                    <Text b>
                                        {balances.toString()} ZAP
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
                                        {configs} Watt/hour
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
                                        {configs} Watt/hour
                                    </Text>
                                </Card.Body>
                            </Card>
                        </CardLine>
                        {/* { txs ? (txs > 0 ? */}
                        <Table striped>
                            <Table.Header>
                                <Table.Column>Swapped from</Table.Column>
                                <Table.Column>Swapped To</Table.Column>
                                <Table.Column>Price</Table.Column>
                                <Table.Column>Gas</Table.Column>
                                <Table.Column>Value USD</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {txs.map((item, index) => (
                                    <Table.Row key={index} >
                                        <Table.Cell>
                                            <a href={`${POLYGON_MUMBAI_URL}${item.transaction.id}`}>
                                                {!item.amount0.startsWith('-') ? item.amount0 + ' ' + item.pool.token0.symbol : item.amount1 + ' ' + item.pool.token1.symbol}</a>
                                        </Table.Cell>
                                        <Table.Cell>{item.amount0.startsWith('-') ? (item.amount0 + ' ' + item.pool.token0.symbol).substring(1) : (item.amount1 + ' ' + item.pool.token1.symbol).substring(1)}</Table.Cell>
                                        <Table.Cell>{item.amount0}</Table.Cell>
                                        <Table.Cell>{item.transaction.gasUsed}</Table.Cell>
                                        <Table.Cell>{item.amountUSD}</Table.Cell>
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