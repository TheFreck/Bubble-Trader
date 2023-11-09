import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import TradingContext from "./TradingContext";

export const ChartPixel = ({highest,lowest,open,close,high,low}) => {
    const span = highest-lowest;
    const relativeHigh = (high-lowest)/(highest-lowest);
    const relativeLow = (low-lowest)/(highest-lowest);
    const relativeOpen = (open-lowest)/(highest-lowest);
    const relativeClose = (close-lowest)/(highest-lowest);

    return (
        <svg
            viewBox={`0 0 100 100`}
            width={`${floorWidth}vw`}
            height={`${floorHeight}vh`}
            xmlns="http://www.w3.org/2000/svg"
            style={{ background: 'gray' }}
        >
        <line
            x1='50%'
            x2='50%'
            y1={`${relativeHigh}%`}
            y2={`${relativeLow}%`}
            stroke={close>open?'green':'red'}
            />
        <rect
            x={0}
            y={`${Math.max(close,open)}%`}
            height={`${close>open?close-open:open-close}`}
            width='100%'
            stroke={close>open?'green':'red'}
        />
    </svg>
    )
}

export default ChartPixel;