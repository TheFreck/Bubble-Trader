import React, { Suspense, useCallback, useContext, useEffect, useRef, useState } from "react";
import TradingContext from "./TradingContext";

export const PriceAxis = ({ max, min, side }) => {
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
                side={side}
                x={side === 'right' ? '90%' : side === 'left' ? '10%' : '0%'}
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
                        stroke={side === 'right' ? 'black' : 'blue'}
                        strokeWidth={.25}
                    />
                    <text
                        x={side === 'right' ? '102%' : side === 'left' ? '-2%' : '0%'}
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