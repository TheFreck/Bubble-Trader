import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import TradingContext from "./TradingContext";
import ChartPixel from "./ChartPixel";
import PriceAxis from "./PriceAxis";
import { ControlPointSharp } from "@mui/icons-material";

export const PriceChart = ({asset,periods,isActive, movingAverage}) => {
    const context = useContext(TradingContext);
    const chartRef = useRef();
    const [prices, setPrices] = useState([]);
    const [max, setMax] = useState(0);
    const [min, setMin] = useState(Number.MAX_SAFE_INTEGER);
    const [volumeHigh, setVolumeHigh] = useState(0);
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
        // console.log("march: ", asset.assetName)
        buildPriceData((data) => {
            const {periodTrades,highest,lowest,highVolume} = data;
            setPrices(periodTrades);
            setMax(highest);
            setMin(lowest);
            setVolumeHigh(highVolume);
        });
    }

    // useEffect(() => {
    //     console.log("prices: ", prices);
    // },[prices]);

    useEffect(() => {
        march();
    }, [asset, periods,prices]);

    const buildPriceData = cb => {
        if(!cb) return;
        const trades = [];
        if (asset?.tradeHistory && asset?.tradeHistory?.length) {
            const groups = Object.groupBy(asset.tradeHistory, ({ time }) => Math.floor(time / 1000));
            let closes = [];
            for (let group of Object.entries(groups)) {
                const open = group[1][group[1].length - 1].price;
                const close = group[1][0].price;
                let high = 0;
                let low = Number.MAX_SAFE_INTEGER;
                const groupId = parseInt(group[0]);
                let volume = 0;
                for (let trade of group[1]) {
                    high = trade.price > high ? trade.price : high;
                    low = trade.price < low ? trade.price : low;
                    volume += trade.shares;
                }
                closes.unshift(close);
                let closeSum = 0;
                for(let i=0; i<Math.min(movingAverage,trades.length); i++){
                    closeSum+=trades[i].close;
                }
                let average = trades.length > 0 ? closeSum/Math.min(movingAverage,trades.length) : close;
                let yesterAve = trades.length > 0 ? trades[0].average : close;
                trades.unshift({ open, close, high, low, groupId, volume, average, yesterAve });

            }

        }
        const periodTrades = [];
        let highVolume = 0;
        let highest = 0;
        let lowest = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < Math.min(periods, trades.length); i++) {
            periodTrades.unshift(trades[i]);
            highest = trades[i].high > highest ? trades[i].high : highest;
            lowest = trades[i].low < lowest ? trades[i].low : lowest;
            highVolume = highVolume < trades[i].volume ? trades[i].volume : highVolume;
        }
        cb({periodTrades,highest,lowest,highVolume});
    }

    const AxisCallback = useCallback(() => 
            <PriceAxis
                max={max}
                min={min}
            />,[prices,asset,context.isRunning]
    )

    const ChartCallback = useCallback(() => {
        // console.log("chartCallback prices: ", prices);
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
                    average={p.average}
                    yesterAve={p.yesterAve}
                    displayAverage={true}
                    isFinal={i===prices.length-1}
                />
            )))},
        [prices,asset,periods,context.isRunning]);

    return (
        <svg
            viewBox={`0 0 200 100`}
            width={`${context.floorWidth-10}vw`}
            height={`${context.floorHeight-20}vh`}
            xmlns="http://www.w3.org/2000/svg"
            style={{ background: 'gray', marginLeft: '5vw', marginRight: '5vw',width: `${context.floorWidth*.9}vw` }}
            ref={chartRef}
        >
            {/* {console.log("price chart: ", prices)} */}
            <AxisCallback />
            <ChartCallback />
        </svg>
    )
}

export default PriceChart;