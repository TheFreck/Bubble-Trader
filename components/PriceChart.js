import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import TradingContext from "./TradingContext";
import ChartPixel from "./ChartPixel";
import PriceAxis from "./PriceAxis";

export const PriceChart = ({asset,periods,isActive, movingAverage1,movingAverage2,displayPrice,displayValue}) => {
    const context = useContext(TradingContext);
    const chartRef = useRef();
    const [prices, setPrices] = useState([]);
    const [max, setMax] = useState(0);
    const [min, setMin] = useState(Number.MAX_SAFE_INTEGER);
    const [volumeHigh, setVolumeHigh] = useState(0);
    const [valueHigh,setValueHigh] = useState(0);
    const [valueLow,setValueLow] = useState(Number.MAX_SAFE_INTEGER);
    const [militicks,setMiliticks] = useState(1000);

    const pixelWidth = 100/prices.length;

    useEffect(() => {
        march();
        if (context.isRunning) {
            if (context.chartIntervalId) {
                clearInterval(context.chartIntervalId);
                let intId = setInterval(march, militicks);
                chartRef.current.intID = intId;
                context.setChartIntervalId(intId);
            }
        }},[]);

    useEffect(() => {
        if (context.isRunning && isActive) {
            if (!context.chartIntervalId) {
                let intId = setInterval(march, militicks);
                chartRef.current.intID = intId;
                context.setChartIntervalId(intId);
            }
        }
        else {
            clearInterval(chartRef.current.intID);
            context.setChartIntervalId(0);
            chartRef.current.intID = 0;
        }
    }, [context.isRunning,asset,periods,isActive]);

    const march = () => {
        buildPriceData((data) => {
            const {periodTrades,highest,lowest,highVolume,value,highValue,lowValue} = data;
            setPrices(periodTrades);
            setMax(highest);
            setMin(lowest);
            setVolumeHigh(highVolume);
            setValueHigh(highValue);
            setValueLow(lowValue);
        });
    }
    
    useEffect(() => {
        if(context.isRunning){
            march();
        }
    }, [asset, periods,prices]);

    const buildPriceData = cb => {
        if(!cb) return;
        const trades = [];
        if (asset?.tradeHistory && asset?.tradeHistory?.length) {
            const groups = Object.groupBy(asset.tradeHistory, ({ time }) => Math.floor(time / 1000));
            for (let group of Object.entries(groups)) {
                const open = group[1][group[1].length - 1].price;
                const close = group[1][0].price;
                let high = 0;
                let low = Number.MAX_SAFE_INTEGER;
                const groupId = parseInt(group[0]);
                let volume = 0;
                let groupValue = 0;
                for (let i=0; i<group[1].length; i++) {
                    high = group[1][i].price > high ? group[1][i].price : high;
                    low = group[1][i].price < low ? group[1][i].price : low;
                    volume += Math.abs(group[1][i].tradeShares);
                    groupValue += group[1][i].value;
                }
                let value = groupValue/group[1].length/asset.shareQty;
                let closeSum = 0;
                for(let i=0; i<Math.min(movingAverage1,trades.length); i++){
                    closeSum+=trades[i].close;
                }
                const average1 = trades.length > 0 ? closeSum/Math.min(movingAverage1,trades.length) : close;
                const yesterAve1 = trades.length > 0 ? trades[0].average1 : close;
                closeSum = 0;
                for(let i=0; i<Math.min(movingAverage2,trades.length); i++){
                    closeSum+=trades[i].close;
                }
                const average2 = trades.length > 0 ? closeSum/Math.min(movingAverage2,trades.length) : close;
                const yesterAve2 = trades.length > 0 ? trades[0].average2 : close;
                trades.unshift({ open, close, high, low, groupId, volume, value, average1, yesterAve1, average2, yesterAve2 });
            }
        }
        const periodTrades = [];
        let highVolume = 0;
        let highest = 0;
        let lowest = Number.MAX_SAFE_INTEGER;
        let value = 0;
        let highValue = 0;
        let lowValue = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < Math.min(periods, trades.length); i++) {
            value = trades[i].value;
            periodTrades.unshift(trades[i]);
            highest = trades[i].high > highest ? trades[i].high : highest;
            lowest = trades[i].low < lowest ? trades[i].low : lowest;
            highVolume = trades[i].volume > highVolume ? trades[i].volume : highVolume;
            highValue = trades[i].value > highValue ? trades[i].value : highValue;
            lowValue = trades[i].value < lowValue ? trades[i].value : lowValue;
        }
        cb({periodTrades,highest,lowest,highVolume,value,lowValue,highValue});
    }

    const AxisCallback = useCallback(() => 
        displayPrice &&
        <PriceAxis
            side='right'
            max={max}
            min={min}
        />,[prices,context.isRunning,displayPrice]
    );

    const ValueAxisCallback = useCallback(() => 
        displayValue &&
        <PriceAxis
            side='left'
            max={valueHigh}
            min={valueLow}
        />,[context.isRunning,valueHigh,valueLow,displayValue]
    );

    const ChartCallback = useCallback(() => {
        return (
            prices && prices.length && prices.map((p,i) => (
                <ChartPixel 
                    key={i}
                    index={i}
                    highest={max}
                    lowest={min}
                    open={p.open}
                    close={p.close}
                    high={p.high}
                    low={p.low}
                    width={pixelWidth}
                    time={p.groupId}
                    volume={p.volume}
                    volumeHigh={volumeHigh}
                    displayTime={false}
                    displayVolume={true}
                    average1={p.average1}
                    yesterAve1={p.yesterAve1}
                    average2={p.average2}
                    yesterAve2={p.yesterAve2}
                    displayAverage={true}
                    isFinal={i===prices.length-1}
                    displayValue={displayValue}
                    displayPrice={displayPrice}
                    value={p.value}
                    valueHigh={valueHigh}
                    valueLow={valueLow}
                />
            )))},
        [prices,asset,periods,context.isRunning,displayPrice,displayValue]);

    return (
        <svg
            viewBox={`0 0 200 100`}
            width={`${context.floorWidth-10}vw`}
            height={`${context.floorHeight-20}vh`}
            xmlns="http://www.w3.org/2000/svg"
            style={{ background: 'gray', marginLeft: '5vw', marginRight: '5vw',width: `${context.floorWidth*.9}vw` }}
            ref={chartRef}
        >
            <ValueAxisCallback />
            <AxisCallback />
            <ChartCallback />
        </svg>
    )
}

export default PriceChart;