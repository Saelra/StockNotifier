# My Flow from Dashboad

This function is used to update the new price

## The Funciton starts at line 240 and ends at 286
    1 async function addPrice(newStockPrice : number) : Promise<void> {
    2    let newArray : number[] = [...dataState, newStockPrice];
    3    if(dataState.indexOf(0) === 0){
    4        newArray = [newStockPrice];
    5    }else {
    6        newArray = [...dataState, newStockPrice];
    7    }
    8    if(dataState.length > 30){
    9        newArray.shift();
    10    }
    11    setDataState(newArray);
    12    const newPriceInfo : priceInformation = {
    13        price: newStockPrice,
    14        priceDelta : (priceInfo.price - newStockPrice),
    15        percentIncrease : (Math.abs(priceInfo.price - newStockPrice) / newStockPrice) * 100
    16    }
    17    //check for min and max
    18    if (newPriceInfo.price > maxValue) {
    19        const userWantsToKeep = await alertNotification({
    20            stock: currentStockInfo,
    21            threshold: maxValue,
    22            alertType: AlertType.High,
    23       });
    24      if (userWantsToKeep) {
    25          addNewHistoryObject(newPriceInfo.price, maxValue, newPriceInfo.priceDelta);
    26    }
    27    } else if (newPriceInfo.price < minValue) {
    28        const userWantsToKeep = await alertNotification({
    29            stock: currentStockInfo,
    30            threshold: minValue,
    31            alertType: AlertType.Low,
    32         });
    33
    34          if (userWantsToKeep) {
    35              addNewHistoryObject(newPriceInfo.price, minValue, newPriceInfo.priceDelta);
    36          }
    37    }
    38    setPriceInfo(newPriceInfo);
    39    updateCurrentStockInfo();
    40}


## Cyclomatic Complexity 
formula 
= E- N + 2  (21 - 16 + 2) for a total of 7

## predicate count: 
6 predicates + 1 = 7

## Base Set of independent Paths: 
1. path 1 : 1-2, 3, 4, 8, 9-10, 11-17, 18, 19-23, 24, 37-40
2. path 2 : 1-2, 3, 4, 8, 9-10, 11-17, 18, 19-23, 24, 25-26, 37-40
3. path 3 : 1-2, 3, 4, 8, 9-10, 11-17, 18, 37-40
4. path 4 : 1-2, 3, 4, 8, 9-10, 11-17, 18, 27, 28-33, 34, 35-36, 37-40
5. path 5 : 1-2, 3, 4, 8, 9-10, 11-17, 18, 27, 28-33, 34, 37-40
6. path 6 : 1-2, 3, 4, 8, 9-10, 11-17, 18, 27, 37-40
7. path 7 : 1-2, 3, 4, 8, 11-17, 18, 37-40

## Regions :
There are 6 regions:
1. 24, 25-26, 37-40
2. 34, 35-36, 37-40
3. 27, 28-33, 34, 37-40
4. 18, 27, 37-40, 25-26, 24, 19-23
5. 8, 9-10, 11-17
6. 3, 4, 8, 5-7
7. The one the encompasses them all !






