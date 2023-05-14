package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/labstack/echo"
	"github.com/zap/common"
)

func ViewConfig(c echo.Context) error {

	cfg, err := json.Marshal(common.ConfigGlobal)
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

	newTimeVal, ok := json["timeToCheck"].(string)
	if ok {
		newTime, err := strconv.Atoi(newTimeVal)
		if err != nil {
			return c.String(http.StatusOK, fmt.Sprintf("%v", json))
		}
		common.ConfigGlobal.IntervalToCheck = newTime
	}

	newCurrentConsumptionRateHourVal, ok := json["currentConsumptionRateHour"].(string)
	if ok {
		newCurrentConsumptionRateHour, err := strconv.Atoi(newCurrentConsumptionRateHourVal)
		if err != nil {
			return c.String(http.StatusOK, fmt.Sprintf("%+v", json))
		}
		common.ConfigGlobal.ConsumptionRateHour = newCurrentConsumptionRateHour
	}

	newCurrentProductionRateHourVal, ok := json["currentProductionRateHour"].(string)
	if ok {
		newCurrentProductionRateHour, err := strconv.Atoi(newCurrentProductionRateHourVal)
		if err != nil {
			return c.String(http.StatusOK, fmt.Sprintf("%+v", json))
		}
		common.ConfigGlobal.ProductionRateHour = newCurrentProductionRateHour
	}

	return c.String(http.StatusOK, fmt.Sprintf("%v", json))
}
