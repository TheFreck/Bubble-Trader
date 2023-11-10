import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import TradingContext from "./TradingContext";
import { Button, Select } from "@mui/material";
import ChartPixel from "./ChartPixel";

export const PriceChart = ({prices,max,min,periods}) => {
    const context = useContext(TradingContext);
    const chartRef = useRef();
    const pixelWidth = 100/prices.length;

    useEffect(() => {

    },[]);

    return (
        <div
            ref={chartRef}
        >
            <svg
                viewBox={`0 0 500 300`}
                width={`${context.floorWidth}vw`}
                height={`${context.floorHeight}vh`}
                xmlns="http://www.w3.org/2000/svg"
                style={{ background: 'gray', marginLeft: 0 }}
            >
                {prices && prices.length && prices.map((p,i) => (
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
                    />
                ))}
            </svg>
        </div>
    )
}

export default PriceChart;