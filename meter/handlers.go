package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/labstack/echo"
)

func ViewConfig(c echo.Context) error {

	cfg, err := json.Marshal(ConfigGlobal)
	if err != nil {
		fmt.Println(err)
		return c.String(http.StatusInternalServerError, "No configs")
	}

	return c.String(http.StatusOK, string(cfg))
}

func EditConfig(c echo.Context) error {
	var json map[string]interface{} = map[string]interface{}{}
	if err := c.Bind(&json); err != nil {
		return err
	}
	return c.String(http.StatusOK, fmt.Sprintf("%v", json))
	//return c.String(http.StatusOK, "OK")
}
