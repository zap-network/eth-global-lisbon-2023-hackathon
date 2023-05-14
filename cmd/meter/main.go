package main

import (
	"fmt"

	geth "github.com/ethereum/go-ethereum/common"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/zap/common"
)

var ControllerPort = ":8082"
var Account = geth.HexToAddress("0xB8eD17D5a8954c6ef683721E72752e4aAB9E92D8")

func main() {

	err := common.InitConfig()
	if err != nil {
		panic(err)
	}

	fmt.Printf("%+v", common.ConfigGlobal)

	go startEcho()

	common.ReadContract(Account)
	go common.CalculateBalance()
	select {}
}

func startEcho() {
	e := echo.New()
	e.GET("/config", ViewConfig)
	e.POST("/config", EditConfig)
	e.Use(middleware.CORS())
	e.Logger.Fatal(e.Start(ControllerPort))

}
