package common

import (
	"crypto/ecdsa"
	"log"
	"os"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
)

type Wallet struct {
	privateKey *ecdsa.PrivateKey
	address    common.Address
}

func LoadWallet() Wallet {
	privateKeyString := os.Getenv("WALLET_PKEY")
	privateKey, err := crypto.HexToECDSA(privateKeyString)
	if err != nil {
		log.Fatal(err)
	}

	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		log.Fatal("error casting public key to ECDSA")
	}

	address := crypto.PubkeyToAddress(*publicKeyECDSA)

	return Wallet{
		privateKey: privateKey,
		address:    address,
	}
}
