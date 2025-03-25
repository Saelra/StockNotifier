# My Flow from Dashboad
This function is used to update the new price

## 

 `async function addPrice(newStockPrice : number) : Promise<void> {
    let newArray : number[] = [...dataState, newStockPrice];
    if(dataState.indexOf(0) === 0){
      newArray = [newStockPrice];
    }else {
      newArray = [...dataState, newStockPrice];
    }


    if(dataState.length > 30){
      newArray.shift();
    }


    setDataState(newArray);

    const newPriceInfo : priceInformation = {
      price: newStockPrice,
      priceDelta : (priceInfo.price - newStockPrice),
      percentIncrease : (Math.abs(priceInfo.price - newStockPrice) / newStockPrice) * 100
    }

    //check for min and max
    if (newPriceInfo.price > maxValue) {
      const userWantsToKeep = await alertNotification({
        stock: currentStockInfo,
        threshold: maxValue,
        alertType: AlertType.High,
      });

      if (userWantsToKeep) {
        addNewHistoryObject(newPriceInfo.price, maxValue, newPriceInfo.priceDelta);
      }
    } else if (newPriceInfo.price < minValue) {
      const userWantsToKeep = await alertNotification({
        stock: currentStockInfo,
        threshold: minValue,
        alertType: AlertType.Low,
      });

      if (userWantsToKeep) {
        addNewHistoryObject(newPriceInfo.price, minValue, newPriceInfo.priceDelta);
      }
    }
    setPriceInfo(newPriceInfo);
    updateCurrentStockInfo();
  }`


