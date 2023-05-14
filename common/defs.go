package common

import (
	coreEntities "github.com/daoleno/uniswap-sdk-core/entities"
	gethcommon "github.com/ethereum/go-ethereum/common"
)

const POLYGON_TESTNET = "https://polygon-testnet-rpc.allthatnode.com:8545"
const POLYGON_TESTNET_CHAINID = 80001
const WMumbaiMaticAddress = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889"

var ZapAddress = gethcommon.HexToAddress("0x3092ef862A180D0f44C5E537EfE05Cd7DCbB28A7")
var ZapToken = coreEntities.NewToken(POLYGON_TESTNET_CHAINID, ZapAddress, 18, "Zap", "Zap")
var MaticToken = coreEntities.NewToken(POLYGON_TESTNET_CHAINID, gethcommon.HexToAddress(WMumbaiMaticAddress), 18, "Matic", "Matic Network(PolyGon)")
