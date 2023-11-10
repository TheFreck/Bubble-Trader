import React, { Suspense, useCallback, useContext, useEffect, useRef, useState } from "react";
import TradingContext from "./TradingContext";
import PriceChart from "./PriceChart";
import { MenuItem, Select } from "@mui/material";

export const ChartHousing = () => {
    const context = useContext(TradingContext);
    const [asset, setAsset] = useState({name:""});
    const [prices, setPrices] = useState([]);
    const [max, setMax] = useState(0);
    const [min, setMin] = useState(0);
    const [periods, setPeriods] = useState(100);


    const handleAssetSelection = event => {
        console.log("event: ", event.target.value);
        setAsset(context.podiums.find(p => p.name===event.target.value));
    }
    
    useEffect(() => {
        buildPriceData();
    },[asset,periods]);

    const buildPriceData = () => {
        const trades = [];
        let highest = 0;
        let lowest = Number.MAX_SAFE_INTEGER;
        if(asset.tradeHistory && asset.tradeHistory.length){
            const groups = Object.groupBy(asset.tradeHistory, ({time}) => Math.floor(time/1000));
            console.log("groups: ", groups);
            for(let group of Object.entries(groups)){
                const open = group[1][group[1].length-1].price;
                const close = group[1][0].price;
                let high = 0;
                let low = Number.MAX_SAFE_INTEGER;
                const groupId = parseInt(group[0]);
                for(let trade of group[1]){
                    high = trade.price > high ? trade.price : high;
                    low = trade.price < low ? trade.price : low;
                }
                trades.unshift({open,close,high,low,groupId});
                highest = high > highest ? high : highest;
                lowest = low < lowest ? low : lowest;
            }
        }
        const periodTrades = [];
        for(let i=0; i<Math.min(periods,trades.length); i++){
            periodTrades.unshift(trades[i]);
        }
        setPrices(periodTrades);
        setMax(highest);
        setMin(lowest);
    }

    const handlePeriodSelection = event => {
        setPeriods(event.target.value);
    }
    
    const PriceChartCallback = useCallback(() => (
        <Suspense fallback={null}>
            {asset.name !== "" &&
            <PriceChart prices={prices} max={max*1.05} min={min/1.05} periods={periods}/>
            }
        </Suspense>),
    [prices,asset.name, periods]);

    return <>
        <Select
            value={asset.name}
            label='Asset'
            onChange={handleAssetSelection}
        >
            {context.podiums && context.podiums.map((a,i) => 
                <MenuItem key={i} value={a.name}>{a.name}</MenuItem>
            )}
        </Select>
        <Select
            value={periods}
            label='Periods'
            onChange={handlePeriodSelection}
        >
            <MenuItem value={50}>50</MenuItem>   
            <MenuItem value={100}>100</MenuItem>   
            <MenuItem value={150}>150</MenuItem>   
            <MenuItem value={200}>200</MenuItem>   
        </Select>
        <PriceChartCallback />            
    </>
}

export default ChartHousing;