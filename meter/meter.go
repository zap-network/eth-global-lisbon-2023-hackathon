package main

import (
	"context"
	"fmt"
	"log"
	"math/big"
	"os"
	"time"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/labstack/echo"
	"gopkg.in/yaml.v3"
)

var ControllerPort = ":8082"
var CurrentConsumption = 0
var CurrentProduction = 0

var ConfigGlobal = config{}

type config struct {
	ProdutionRateHour   int `yaml:"currentProductionRateHour"`
	ConsumptionRateHour int `yaml:"currentConsumptionRateHour"`
}

func main() {

	cfg, err := initConfig()
	if err != nil {
		panic(err)
	}
	fmt.Printf("%+v", cfg)
	//go startEcho()
	account := common.HexToAddress("0x18e2CeE48035F4558Eb75a629C37d713EFC005c2")
	readContract(account)
	//recordProduction(account)
	recordConsumption(account)
	readContract(account)
	//go produceCounter()
	//go consumptionCounter()
	//select {}
}

func initConfig() (config, error) {

	f, err := os.Open("config.yml")
	if err != nil {
		return config{}, err
	}

	defer f.Close()

	decoder := yaml.NewDecoder(f)
	err = decoder.Decode(&ConfigGlobal)
	if err != nil {
		return config{}, nil
	}

	return ConfigGlobal, nil
}

func startEcho() {
	e := echo.New()
	e.GET("/ViewConfig", ViewConfig)
	e.POST("/EditConfig", EditConfig)
	e.Logger.Fatal(e.Start(ControllerPort))

}

func produceCounter() {
	for {
		fmt.Printf("\n Consuming \n")
		time.Sleep(10 * time.Second)
		CurrentConsumption += 1
		fmt.Printf("\n CurrentConsumption %+v \n", CurrentConsumption)
	}
}

func consumptionCounter() {

	for {
		fmt.Printf("\n Producing \n")
		time.Sleep(10 * time.Second)
		CurrentProduction += 1
		fmt.Printf("\n CurrentProduction %+v \n", CurrentProduction)
	}
}

func readContract(account common.Address) {

	client, err := ethclient.Dial("https://polygon-testnet-rpc.allthatnode.com:8545")
	if err != nil {
		// handle error
	}

	address := common.HexToAddress("0x3092ef862A180D0f44C5E537EfE05Cd7DCbB28A7")
	instance, err := NewZap(address, client)
	if err != nil {
		panic(err)
	}

	bal, err := instance.BalanceOf(nil, account)
	if err != nil {
		panic(err)
	}

	fmt.Printf("\n\n balanceOf %+v \n\n", bal)

}

func recordProduction(account common.Address) {
	wallet := LoadWallet()

	client, err := ethclient.Dial("https://polygon-testnet-rpc.allthatnode.com:8545")
	if err != nil {
		// handle error
	}

	nonce, err := client.PendingNonceAt(context.Background(), wallet.address)
	if err != nil {
		log.Fatal(err)
	}

	gasPrice, err := client.SuggestGasPrice(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	auth, err := bind.NewKeyedTransactorWithChainID(wallet.privateKey, big.NewInt(80001))
	if err != nil {
		panic(err)
	}
	auth.Nonce = big.NewInt(int64(nonce))
	auth.Value = big.NewInt(0)     // in wei
	auth.GasLimit = uint64(300000) // in units
	auth.GasPrice = gasPrice

	address := common.HexToAddress("0x3092ef862A180D0f44C5E537EfE05Cd7DCbB28A7")
	instance, err := NewZap(address, client)
	if err != nil {
		panic(err)
	}

	tx, err := instance.IssueToken(auth, account, big.NewInt(1))
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("tx sent: %s", tx.Hash().Hex())
}

func recordConsumption(account common.Address) {
	wallet := LoadWallet()

	client, err := ethclient.Dial("https://polygon-testnet-rpc.allthatnode.com:8545")
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

	auth, err := bind.NewKeyedTransactorWithChainID(wallet.privateKey, big.NewInt(80001))
	if err != nil {
		panic(err)
	}
	auth.Nonce = big.NewInt(int64(nonce))
	auth.Value = big.NewInt(0)     // in wei
	auth.GasLimit = uint64(300000) // in units
	auth.GasPrice = gasPrice

	address := common.HexToAddress("0x3092ef862A180D0f44C5E537EfE05Cd7DCbB28A7")
	instance, err := NewZap(address, client)
	if err != nil {
		panic(err)
	}

	tx, err := instance.BurnToken(auth, account, big.NewInt(1))
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("tx sent: %s", tx.Hash().Hex())

}
