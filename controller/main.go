package main

import (
	"log"
	"math/big"
	"os"

	"github.com/labstack/echo"
	"gopkg.in/yaml.v2"

	coreEntities "github.com/daoleno/uniswap-sdk-core/entities"
	"github.com/daoleno/uniswapv3-sdk/examples/helper"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

const POLYGON_TESTNET = "https://polygon-testnet-rpc.allthatnode.com:8545"
const POLYGON_TESTNET_CHAINID = 80001
const ZapAddress = "0x3092ef862A180D0f44C5E537EfE05Cd7DCbB28A7"
const WMumbaiMaticAddress = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889"

var ZapToken = coreEntities.NewToken(POLYGON_TESTNET_CHAINID, common.HexToAddress(ZapAddress), 18, "Zap", "Zap")
var MaticToken = coreEntities.NewToken(POLYGON_TESTNET_CHAINID, common.HexToAddress(WMumbaiMaticAddress), 18, "Matic", "Matic Network(PolyGon)")

type config struct {
	ProdutionRateHour   int `yaml:"currentProductionRateHour"`
	ConsumptionRateHour int `yaml:"currentConsumptionRateHour"`
}

var ControllerPort = ":8082"
var ConfigGlobal = config{}

func main() {
	// initConfig()
	//go startEcho()
	//select {}

	client, err := ethclient.Dial(POLYGON_TESTNET)
	if err != nil {
		log.Fatal(err)
	}

	wallet := helper.InitWallet(os.Getenv("WALLET_PKEY"))
	if wallet == nil {
		log.Fatal("init wallet failed")
	}

	//buyZap(client, wallet)
}

func startEcho() {
	e := echo.New()
	e.Logger.Fatal(e.Start(ControllerPort))
}

func initConfig() (config, error) {
	var cfg config
	f, err := os.Open("config.yml")
	if err != nil {
		return config{}, err
	}

	defer f.Close()

	decoder := yaml.NewDecoder(f)
	err = decoder.Decode(&cfg)
	if err != nil {
		return config{}, nil
	}

	return cfg, nil
}

type Inputs struct {
	reserve         *big.Int
	balance         *big.Int
	consumption     *big.Int
	production      *big.Int
	storageCapacity *big.Int
	storageValue    *big.Int
}

type MarketAction int

const (
	NoAction MarketAction = iota
	SellAction
	BuyAction
)

func computeAction(client *ethclient.Client, wallet *helper.Wallet, input Inputs) (MarketAction, error) {

	threshold := new(big.Int).Div(new(big.Int).Mul(input.reserve, big.NewInt(1)), big.NewInt(10))
	reserveLowerBound := new(big.Int).Sub(input.reserve, threshold)
	reserveUpperBound := new(big.Int).Add(input.reserve, threshold)

	if input.balance.Cmp(reserveLowerBound) <= 0 {
		// buy Zap tokens
		deficit := new(big.Int).Sub(reserveUpperBound, input.balance)

		buyZap(client, wallet, deficit)
	}

	//swapValue := helper.FloatStringToBigInt("0.001", 18)

	return NoAction, nil
}
