import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import TradingContext from "./TradingContext";

export const PriceChart = ({podium}) => {
    const context = useContext(TradingContext);
    const chartRef = useRef();
    const [prices, setPrices] = useState();

    useEffect(() => {
        let pod = context.podiums.find(p => p.name === podium.name);
        console.log("pod.tradeHistory: ", pod.tradeHistory);
        setPrices(pod.tradeHistory);
    },[]);

    return (
        <div
            ref={chartRef}
        >
            <svg
                viewBox={`0 0 100 100`}
                width={`${floorWidth}vw`}
                height={`${floorHeight}vh`}
                xmlns="http://www.w3.org/2000/svg"
                style={{ background: 'gray' }}
            >

            </svg>
        </div>
    )
}

export default PriceChart;