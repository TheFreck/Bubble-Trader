import React, { Suspense, useCallback, useContext, useEffect, useRef, useState } from "react";
import TradingContext from "./TradingContext";

export const PriceAxis = ({ max, min }) => {
    const ticks = [];
    const getTicks = () => {
        const tickGap = (max - min) / 10;
        for (let i = 0; i < 11; i++) {
            ticks.push(min + i * tickGap+tickGap);
        }
        return ticks;
    };
    const AxisCallback = useCallback(() => (
        <>
            <rect
                x='90%'
                y='0%'
                height='100%'
                width='5%'
                fill='transparent'
            />
            {getTicks().map((t, i) => (
                <Suspense
                    key={i}
                    fallback={null}>
                    <line
                        x1='0%'
                        x2='100%'
                        y1={`${100 - 10 * i}%`}
                        y2={`${100 - 10 * i}%`}
                        stroke='black'
                        strokeWidth={.25}
                    />
                    <text
                        x='102%'
                        y={`${100 - 10 * i}%`}
                        fontSize='.15em'
                    >
                        {i !== 0 && Math.floor(t * 100) / 100}
                    </text>

                </Suspense>
            ))}
        </>
    ),[ticks])

    return <AxisCallback />;
}

export default PriceAxis;