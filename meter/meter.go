package main

import (
	"fmt"
	"os"
	"time"

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
	go startEcho()
	readContract()
	go produceCounter()
	go consumptionCounter()
	select {}
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

func readContract() {

	client, err := ethclient.Dial("https://polygon-testnet-rpc.allthatnode.com:8545")
	if err != nil {
		// handle error

	}

	address := common.HexToAddress("0x3092ef862A180D0f44C5E537EfE05Cd7DCbB28A7")
	instance, err := NewZap(address, client)
	if err != nil {
		panic(err)
	}

	bal, err := instance.BalanceOf(nil, common.HexToAddress("0x18e2CeE48035F4558Eb75a629C37d713EFC005c2"))
	if err != nil {
		panic(err)
	}

	fmt.Printf("\n\n balanceOf %+v \n\n", bal)

}
