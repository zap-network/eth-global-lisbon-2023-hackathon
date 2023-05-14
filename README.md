# eth-global-lisbon-2023-hackathon

This project was developed in the course of the ETHGlobalLisbon 2023 hackathon. Take it with a shovel of salt as it was developed in a rush and with heavy sleep deprivation.

## ⚡ Zap Network

The Zap Network attempts to create a decentralized market where electricity can be sold and bought in real-time. Each household electricity meter connects to the blockchain to reflect on-chain the current consumption and production of the meter. Conversely, each household client leverages the blockchain to trade in real-time for the best electricity prices using some strategy.
The market is possible thanks to the Zap token and associated liquidity pools. The Zap token reflects on-chain each household energy credit. Electricity producers have an excess of Zap while consumers have a deficit of Zap.

## How it is made

As proof of concept, we have deployed an ERC20 token and associated liquidity pool on Polygon Mumbai Testnet.
We have built an electricity meter simulator that burns or mints Zap tokens accordingly to the net consumption or production of electricity, respectively.
We have also built a proof-of-concept bot that monitors the Zap balance of the household and buys Zap on the market when necessary.
Both the meter and bot simulator where built-in go using go-ethereum. Both interact with the Polygon RPC node.
To tie everything together we have built a dApp that presents all this data to the household client. The dApp interacts both with the Polygon RPC node (for balances) and The Graph sub-graph (for purchase/selling history of Zap). The dApp is accessed via Metamask integration.

## Deployment

The ERC20 Zap token is currently deployed on Polygon Mumbai Testnet:
* https://mumbai.polygonscan.com/address/0x3092ef862a180d0f44c5e537efe05cd7dcbb28a7

We also have a liquidity pool on Uniswap on Polygon Mumbai Testnet:
* ZAP - WMATIC
