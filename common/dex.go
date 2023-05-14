package common

import (
	"fmt"
	"log"
	"math/big"
	"time"

	coreEntities "github.com/daoleno/uniswap-sdk-core/entities"
	"github.com/daoleno/uniswapv3-sdk/constants"
	"github.com/daoleno/uniswapv3-sdk/entities"
	"github.com/daoleno/uniswapv3-sdk/examples/helper"
	"github.com/daoleno/uniswapv3-sdk/periphery"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

func BuyZap(client *ethclient.Client, wallet *helper.Wallet, amount *big.Int) {
	pool, err := helper.ConstructV3Pool(client, MaticToken, ZapToken, uint64(constants.FeeLowest))
	if err != nil {
		log.Fatal("Error detecting pool: ", err)
	}

	p, err := pool.PriceOf(ZapToken)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", p)
	fmt.Printf("%d\n", big.NewInt(1).Div(new(big.Int).Mul(p.Numerator, big.NewInt(10000)), new(big.Int).Mul(p.Denominator, big.NewInt(10000))))
	fmt.Printf("Fraction: %d/%d\n", p.Numerator, p.Denominator)
	fmt.Printf("Base Currency: %s\n", p.BaseCurrency.Symbol())
	fmt.Printf("Quote Currency: %s\n", p.QuoteCurrency.Symbol())
	fmt.Printf("Scalar Fraction: %d/%d\n", p.Scalar.Numerator, p.Scalar.Denominator)

	//0.01%
	slippageTolerance := coreEntities.NewPercent(big.NewInt(1), big.NewInt(1000))
	//after 5 minutes
	d := time.Now().Add(time.Minute * time.Duration(15)).Unix()
	deadline := big.NewInt(d)

	// single trade input
	// single-hop exact input
	r, err := entities.NewRoute([]*entities.Pool{pool}, MaticToken, ZapToken)
	if err != nil {
		log.Fatal(err)
	}

	trade, err := entities.FromRoute(r, coreEntities.FromRawAmount(MaticToken, amount), coreEntities.ExactInput)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("%v %v\n", trade.Swaps[0].InputAmount.Quotient(), trade.Swaps[0].OutputAmount.Wrapped().Quotient())
	params, err := periphery.SwapCallParameters([]*entities.Trade{trade}, &periphery.SwapOptions{
		SlippageTolerance: slippageTolerance,
		Recipient:         wallet.PublicKey,
		Deadline:          deadline,
	})
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("calldata = 0x%x\n", params.Value.String())

	tx, err := helper.SendTX(client, common.HexToAddress(helper.ContractV3SwapRouterV1),
		amount, params.Calldata, wallet)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Sent transaction: %s\n", tx.Hash().String())
}
