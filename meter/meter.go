package main

import (
	"context"
	"fmt"
	"log"
	"math"
	"math/big"
	"os"
	"time"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"gopkg.in/yaml.v3"
)

var ControllerPort = ":8082"
var CurrentConsumption = 0
var CurrentProduction = 0

var ConfigGlobal = config{}
var ZapToken = common.HexToAddress("0x3092ef862A180D0f44C5E537EfE05Cd7DCbB28A7")
var Account = common.HexToAddress("0xB8eD17D5a8954c6ef683721E72752e4aAB9E92D8")
var MumbaiChainID = int64(80001)
var PolygonTestnetURL = "https://polygon-testnet-rpc.allthatnode.com:8545"

type config struct {
	ProductionRateHour  int `yaml:"currentProductionRateHour"`
	ConsumptionRateHour int `yaml:"currentConsumptionRateHour"`
	IntervalToCheck     int `yaml:"timeToCheck"`
}

func main() {

	err := initConfig()
	if err != nil {
		panic(err)
	}

	fmt.Printf("%+v", ConfigGlobal)

	go startEcho()

	readContract(Account)
	go calculateBalance()
	select {}
}

func initConfig() error {

	f, err := os.Open("config.yml")
	if err != nil {
		return err
	}

	defer f.Close()

	decoder := yaml.NewDecoder(f)
	err = decoder.Decode(&ConfigGlobal)
	if err != nil {
		return err
	}

	return nil
}

func startEcho() {
	e := echo.New()
	e.GET("/config", ViewConfig)
	e.POST("/config", EditConfig)
	e.Use(middleware.CORS())
	e.Logger.Fatal(e.Start(ControllerPort))

}

func calculateBalance() {
	for {
		time.Sleep(time.Duration(ConfigGlobal.IntervalToCheck) * time.Second)
		consumption := ConfigGlobal.ProductionRateHour - ConfigGlobal.ConsumptionRateHour

		consumptionPeriod := (float64(ConfigGlobal.IntervalToCheck) / 60) * float64(consumption)
		fmt.Printf("%+v", consumptionPeriod)

		if consumptionPeriod > 0 {
			fmt.Printf("\nNet positive %+v\n", consumptionPeriod)
			recordProduction(Account, consumptionPeriod)
		} else if consumption < 0 {
			fmt.Printf("\nNet negative %+v\n", consumptionPeriod)
			recordConsumption(Account, consumptionPeriod)
		}
	}
}

func readContract(account common.Address) {

	client, err := ethclient.Dial(PolygonTestnetURL)
	if err != nil {
		panic(err)
	}

	instance, err := NewZap(ZapToken, client)
	if err != nil {
		panic(err)
	}

	bal, err := instance.BalanceOf(nil, account)
	if err != nil {
		panic(err)
	}

	fmt.Printf("\n\n balanceOf %+v \n\n", bal)

}

func recordProduction(account common.Address, amount float64) {
	wallet := LoadWallet()

	client, err := ethclient.Dial(PolygonTestnetURL)
	if err != nil {
		// handle error
		panic(err)
	}

	nonce, err := client.PendingNonceAt(context.Background(), wallet.address)
	if err != nil {
		log.Fatal(err)
	}

	gasPrice, err := client.SuggestGasPrice(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	auth, err := bind.NewKeyedTransactorWithChainID(wallet.privateKey, big.NewInt(MumbaiChainID))
	if err != nil {
		panic(err)
	}
	auth.Nonce = big.NewInt(int64(nonce))
	auth.Value = big.NewInt(0)     // in wei
	auth.GasLimit = uint64(300000) // in units
	auth.GasPrice = gasPrice

	instance, err := NewZap(ZapToken, client)
	if err != nil {
		panic(err)
	}

	floorAmount := int64(math.Floor(amount))

	tx, err := instance.IssueToken(auth, account, big.NewInt(floorAmount))
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("tx sent: %s\n", tx.Hash().Hex())
}

func recordConsumption(account common.Address, amount float64) {
	wallet := LoadWallet()

	client, err := ethclient.Dial(PolygonTestnetURL)
	if err != nil {
		// handle error
		panic(err)
	}

	nonce, err := client.PendingNonceAt(context.Background(), wallet.address)
	if err != nil {
		log.Fatal(err)
	}

	gasPrice, err := client.SuggestGasPrice(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	auth, err := bind.NewKeyedTransactorWithChainID(wallet.privateKey, big.NewInt(MumbaiChainID))
	if err != nil {
		panic(err)
	}
	auth.Nonce = big.NewInt(int64(nonce))
	auth.Value = big.NewInt(0)     // in wei
	auth.GasLimit = uint64(300000) // in units
	auth.GasPrice = gasPrice

	instance, err := NewZap(ZapToken, client)
	if err != nil {
		panic(err)
	}

	floorAmount := int64(math.Floor(amount))

	tx, err := instance.BurnToken(auth, account, big.NewInt(floorAmount))
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("tx sent: %s", tx.Hash().Hex())

}
