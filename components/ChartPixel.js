import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import TradingContext from "./TradingContext";

export const ChartPixel = ({index,highest,lowest,open,close,high,low,width,time}) => {
    const span = highest-lowest;
    const relativeHigh = (high-lowest)/(highest-lowest)*100;
    const relativeLow = (low-lowest)/(highest-lowest)*100;
    const relativeOpen = (open-lowest)/(highest-lowest)*100;
    const relativeClose = (close-lowest)/(highest-lowest)*100;

    return (
        <>
        <line
            x1={`${index*width+width/2}%`}
            x2={`${index*width+width/2}%`}
            y1={`${100-(relativeLow !== relativeHigh ? relativeHigh : relativeHigh/.99)}%`}
            y2={`${100-(relativeLow !== relativeHigh ? relativeLow : relativeLow*.99)}%`}
            stroke={close>open?'green':'red'}
            strokeWidth={.5}
            />
        <rect
            x={`${index*width}%`}
            y={`${100-Math.min(relativeClose,relativeOpen)}%`}
            height={`${(relativeClose>relativeOpen?relativeClose-relativeOpen:relativeOpen-relativeClose)}%`}
            width={`${width}%`}
            stroke={close>open?'green':'red'}
            strokeWidth={.5}
            fill={close>open?'lightgreen':'pink'}
            data-open={open}
            data-close={close}
            data-high={high}
            data-low={low}
            data-time={time}
            index={index}
        />
    </>
    )
}

export default ChartPixel;