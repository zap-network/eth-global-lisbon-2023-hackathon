package common

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
	"gopkg.in/yaml.v2"
)

var Account = common.HexToAddress("0xB8eD17D5a8954c6ef683721E72752e4aAB9E92D8")
var MumbaiChainID = int64(80001)
var PolygonTestnetURL = "https://polygon-testnet-rpc.allthatnode.com:8545"

type config struct {
	ProductionRateHour  int `yaml:"currentProductionRateHour"`
	ConsumptionRateHour int `yaml:"currentConsumptionRateHour"`
	IntervalToCheck     int `yaml:"timeToCheck"`
}

var ConfigGlobal = config{}

func InitConfig() error {

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

func CalculateBalance() {
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
		} else {
			fmt.Printf("\n Not doing any operation since Consumption equals Production \n")
		}
	}
}

func ReadContract(account common.Address) (*big.Int, error) {

	client, err := ethclient.Dial(PolygonTestnetURL)
	if err != nil {
		panic(err)
	}

	instance, err := NewZap(ZapAddress, client)
	if err != nil {
		panic(err)
	}

	bal, err := instance.BalanceOf(nil, account)
	if err != nil {
		panic(err)
	}

	return bal, nil
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

	instance, err := NewZap(ZapAddress, client)
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

	instance, err := NewZap(ZapAddress, client)
	if err != nil {
		panic(err)
	}

	floorAmount := int64(math.Floor(math.Abs(amount)))

	tx, err := instance.BurnToken(auth, account, big.NewInt(floorAmount))
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("tx sent: %s\n", tx.Hash().Hex())

}
