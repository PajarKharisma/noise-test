const express = require('express')
const app = express()
const port = 3000

let dataCache = [];
let mostCalled = 0;
let leastCalled = 0;
let keyCache;
let statistic;

function getKey(arr){
    let set = new Set();
    arr.forEach(element => {
        set.add(Object.keys(element)[0]);
    });
    return [...set];
}

function getKeyCount(arr, arrKey){
    let results = {};
    arrKey.forEach(key => {
        results[key] = 0;
    });

    arrKey.forEach(key => {
        arr.forEach(item => {
            if(Object.keys(item)[0] == key){
                results[key] += 1; 
            }
        });
    });

    return results;
}

function getMaxmin(stat){
    let arr = Object.values(stat);
    mostCalled = Math.max(...arr);
    leastCalled = Math.min(...arr);
}

function getKeyByValue(object, value) {
    let objects = [];
    Object.keys(object).find(key => {
        if(object[key] === value)
            objects.push(key);
    });
    return objects;
}  

app.get('/value', (req, res) => {
    let data = req.query;
    dataCache.push(data);
    res.json({ 
        data: dataCache
    });
})

app.get('/statistic', (req, res) => {
    keyCache = getKey(dataCache);
    statistic = getKeyCount(dataCache, keyCache)
    getMaxmin(statistic);
    res.json({
        key : keyCache,
        statistic : statistic,
        most_called_key: getKeyByValue(statistic, mostCalled),
        least_called_key: getKeyByValue(statistic, leastCalled)
    });
})

app.get('/removemost', (req, res) => {
    mostCalledKey = getKeyByValue(statistic, mostCalled);
    if(mostCalledKey.length > 1){
        for(let i=1; i<mostCalledKey.length; i++){
            dataCache = dataCache.filter(item => Object.keys(item)[0] !== mostCalledKey[i]);
        }
    }
    res.json({ 
        data: dataCache
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})