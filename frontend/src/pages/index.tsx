"use client"
import React from "react";
import Web3 from "web3";
import "../app/globals.css";
import { Swap, getSwapsForAccount } from "../../client/src/contracts/SwapSubgraph"
import "dotenv/config";
import { useState, useEffect } from 'react';
import { Modal, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { Button, Text, Card, Table } from "@nextui-org/react";
import styled from 'styled-components';
import { BsFillLightningChargeFill } from "react-icons/bs";
import { IoMdCog } from 'react-icons/io';
import Link from "next/link";

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
const Container = styled.div`
    
`
const TitleContainer = styled.div`
    width: 100%;
    overflow: hidden;

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

    const {
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        console.log(data);

        let productionRateHourInput = document.getElementById('productionRateHourInput')?.value
        let consumptionRateHourInput = document.getElementById('consumptionRateHourInput')?.value

        let request = {
            "currentProductionRateHour": productionRateHourInput,
            "currentConsumptionRateHour": consumptionRateHourInput,
        }
        saveConfigs(request)
        handleCloseModal();
    };

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

            setConfigs(response.data)
            return response.data;
        } catch (error: any) {
            console.error(`Error fetching configs ${error.message}`);
            throw error;
        }
    }

    async function saveConfigs(data: any): Promise<any> {
        axios.post('http://localhost:8082/config', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response: { data: any; }) => {
                console.log(response.data);
                return response.data;

            })
            .catch((error: { message: any; }) => {
                console.error(`Error fetching configs ${error.message}`);

            });
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (account != "") {
                getSwapsForAccount(account).then((swaps) => {
                    setTxs(swaps)
                })
                getBalance(account).then(setBalances)
            }
        }, 1000);
    }, [account]);

    async function getBalance(address: string): Promise<string> {

        const contract = new web3.eth.Contract(erc20ABI, contractAddress);
        const balanceWei = await contract.methods.balanceOf(address).call();
        return web3.utils.fromWei(balanceWei, 'ether');
    }

    useEffect(() => {
        getCurrentWalletConnected();
        addWalletListener();
        getConfigs();

        if (configs && configs["IntervalToCheck"]) {
            const interval = setInterval(() => {
                getConfigs();

            }, configs["IntervalToCheck"] * 1000)
        }
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
            console.log("Please install MetaMask");
        }
    };

    function updateAccount(account: string) {
        setAccount(account);
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
                    (<Container>
                        <TitleContainer><TitleLeftPane><Title><BsFillLightningChargeFill size={48} color="orange" />Zap Token</Title></TitleLeftPane>
                            <TitleRightPane onClick={handleOpenModal}><IoMdCog size={48} color="orange" />
                                {isModalOpen && (<div>
                                    <Modal
                                        closeButton
                                        preventClose
                                        aria-labelledby="modal-title"
                                        open={isModalOpen}
                                        onClose={handleCloseModal}
                                    >
                                        <Modal.Header>
                                            <Text id="modal-title" size={18}>
                                                <Text b size={18}>
                                                    Configuration Settings
                                                </Text>
                                            </Text>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Input
                                                clearable
                                                bordered
                                                fullWidth
                                                color="primary"
                                                size="lg"
                                                labelPlaceholder="Production Rate Hour"
                                                initialValue={configs["ProductionRateHour"]}
                                                id="productionRateHourInput"
                                                css={{
                                                    marginTop: "30px !important",
                                                    marginBottom: "50px"
                                                }}
                                            />
                                            <Input
                                                clearable
                                                bordered
                                                fullWidth
                                                color="primary"
                                                size="lg"
                                                labelPlaceholder="Consumption Rate Hour"
                                                initialValue={configs["ConsumptionRateHour"]}
                                                id="consumptionRateHourInput"
                                            />
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button auto flat color="error" onPress={handleCloseModal} css={{ backgroundColor: "unset !important" }}>
                                                Close
                                            </Button>
                                            <Button auto onPress={onSubmit} css={{ backgroundColor: "#0072F5 !important" }}>
                                                Submit
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </div>)
                                }
                            </TitleRightPane>
                        </TitleContainer>
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
                                        {configs ? configs["ProductionRateHour"] : ""} Watt/hour
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
                                        {configs ? configs["ConsumptionRateHour"] : ""} Watt/hour
                                    </Text>
                                </Card.Body>
                            </Card>
                        </CardLine>
                        <Table striped>
                            <Table.Header>
                                <Table.Column>Swapped from</Table.Column>
                                <Table.Column>Swapped To</Table.Column>
                                <Table.Column>Gas</Table.Column>
                                <Table.Column>Value USD</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {txs.map((item: any, index: number) => (
                                    <Table.Row key={index} >
                                        <Table.Cell>
                                            <Link href={`${POLYGON_MUMBAI_URL}${item.transaction.id}`}>
                                                {!item.amount0.startsWith('-') ? item.amount0 + ' ' + item.pool.token0.symbol : item.amount1 + ' ' + item.pool.token1.symbol}</Link>
                                        </Table.Cell>
                                        <Table.Cell>{item.amount0.startsWith('-') ? (item.amount0 + ' ' + item.pool.token0.symbol).substring(1) : (item.amount1 + ' ' + item.pool.token1.symbol).substring(1)}</Table.Cell>
                                        <Table.Cell>{item.transaction.gasUsed}</Table.Cell>
                                        <Table.Cell>{item.amountUSD}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </Container>
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