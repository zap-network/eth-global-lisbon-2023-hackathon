"use client"
import React from "react";
import Web3 from "web3";
import "../app/globals.css";
import "dotenv/config";
import Link from 'next/link';
import { useState, useEffect } from 'react';

import axios from 'axios';
import { Card, Table, Text, Row, Button } from "@nextui-org/react";
import styled from 'styled-components';
import { GiLightningHelix } from "react-icons/gi";

const IndexPage = styled.div`
    table{
        background-color: white !important;
    }
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

const columns = [
    {
        title: 'Transaction Hash',
        dataIndex: 'hash',
        width: 200,
    },
    {
        title: 'Value',
        dataIndex: 'value',
        width: 100,
    },
    {
        title: 'State',
        dataIndex: 'state',
        width: 100,
    },
];
const POLYGON_MUMBAI_URL = "https://mumbai.polygonscan.com/tx/"
export default function Home() {
    const [web3, setWeb3] = useState<Web3>(new Web3('https://api-testnet.polygonscan.com/'));
    const [accounts, setAccounts] = useState<string[]>(["0x3a22c8bc68e98b0faf40f349dd2b2890fae01484"]);
    const [balances, setBalances] = useState<{ [account: string]: string }>({});
    const [txs, setTxs] = useState<[]>([]);

    const API_ENDPOINT = 'https://api.polygonscan.com/api';

    async function getTransactionsForAccount(accounts: string): Promise<any> {
        try {
            const response = await axios.get(API_ENDPOINT, {
                params: {
                    module: 'account',
                    action: 'txlist',
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

            setTxs(response.data.result)
            return response.data;
        } catch (error: any) {
            console.error(`Error fetching transactions for account ${accounts}: ${error.message}`);
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
        getTransactionsForAccount(accounts.toString())
        getBalanceAPI(accounts.toString())

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

    return (
        <IndexPage>
            <Title><GiLightningHelix size={48} color="yellow" />Zap Token </Title>
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
        </IndexPage>
    )
}