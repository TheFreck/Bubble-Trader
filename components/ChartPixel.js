import { Tooltip } from "@mui/material";
import React, { Suspense, useCallback, useContext, useEffect, useRef, useState } from "react";
import PriceAxis from "./PriceAxis";

export const ChartPixel = (props) => {
    const {
        index,
        highest,
        lowest,
        open,
        close,
        high,
        low,
        width,
        time,
        volume,
        volumeHigh,
        displayTime,
        displayVolume,
        displayAverage,
        yesterAve,
        average1,
        yesterAve1,
        average2,
        yesterAve2,
        isFinal,
        displayPrice,
        displayValue,
        displayType,
        value,
        valueHigh,
        valueLow,
    } = props;
    const span = highest - lowest;
    const valueSpan = valueHigh - valueLow;
    const relativeHigh = (high - lowest) / span * 100;
    const relativeLow = (low - lowest) / span * 100;
    const relativeOpen = (open - lowest) / span * 100;
    const relativeClose = (close - lowest) / span * 100;
    const relativeVolume = (volumeHigh - volume) / volumeHigh * 10;
    const relativeAverage = ((open + close + high + low) / 4 - lowest) / span * 100;
    const relativeAverage1 = (average1 - lowest) / span * 100;
    const relativeAverage2 = (average2 - lowest) / span * 100;
    const relativeYesterAve = (yesterAve - lowest) / span * 100;
    const relativeYesterAve1 = (yesterAve1 - lowest) / span * 100;
    const relativeYesterAve2 = (yesterAve2 - lowest) / span * 100;
    const relativeValue = (value - lowest) / span * 100;

    useEffect(() => {
        if (isNaN(value) || !highest || !lowest || !open || !close) return;
    }, []);

    return (
        <>
            { // OHLC
                displayType === 'ohlc' && displayPrice && relativeOpen && relativeClose && relativeHigh && relativeLow && width &&
                <>
                    <line
                        name='wick'
                        x1={`${index * width + width / 2}%`}
                        x2={`${index * width + width / 2}%`}
                        y1={`${60 - (relativeLow !== relativeHigh ? relativeHigh : relativeHigh) * .5}%`}
                        y2={`${60 - (relativeLow !== relativeHigh ? relativeLow : relativeLow) * .5}%`}
                        stroke={relativeClose > relativeOpen ? 'green' : 'red'}
                        strokeWidth='.1%'
                    />
                    <rect
                        name="candlestick"
                        x={`${index * width}%`}
                        y={`${60 - Math.min(relativeClose, relativeOpen) * .5}%`}
                        height={`${Math.abs(relativeClose - relativeOpen) > 0 ? Math.abs(relativeClose - relativeOpen) : .1}%`}
                        width={`${width*.80}%`}
                        stroke={close > open ? 'green' : 'red'}
                        strokeWidth='.1%'
                        fill={close > open ? 'lightgreen' : 'pink'}
                        data-open={open}
                        data-close={close}
                        data-high={high}
                        data-low={low}
                        data-time={time}
                        index={index}
                    />
                </>
            }
            { // Line
                displayType === 'line' && displayPrice && relativeClose && relativeOpen && close && open && high && low && time && width &&
                <>
                    <line
                        x1={`${index * width - width / 2}%`}
                        x2={`${index * width + width / 2}%`}
                        y2={`${60 - relativeYesterAve * .5}%`}
                        y1={`${60 - relativeAverage * .5}%`}
                        stroke={relativeClose > relativeOpen ? 'green' : 'red'}
                        strokeWidth='.1%'
                    />
                </>
            }
            { // Moving average 1
                displayPrice && displayAverage && average1 && relativeAverage1 && relativeYesterAve1 && width &&
                <>
                    <line
                        x1={`${index * width - width / 2}%`}
                        x2={`${index * width + width / 2}%`}
                        y1={`${60 - relativeYesterAve1 * .5}%`}
                        y2={`${60 - relativeAverage1 * .5}%`}
                        stroke='orange'
                        strokeWidth={.25}
                        name='average1'
                        average={`${average1}`}
                    />
                </>
            }
            { // Moving average 2
                displayPrice && displayAverage && average2 && relativeAverage2 && relativeYesterAve2 && width &&
                <>
                    <line
                        x1={`${index * width - width / 2}%`}
                        x2={`${index * width + width / 2}%`}
                        y1={`${60 - relativeYesterAve2 * .5}%`}
                        y2={`${60 - relativeAverage2 * .5}%`}
                        stroke='violet'
                        strokeWidth={.25}
                        name='average2'
                        average={`${average2}`}
                    />
                </>
            }
            { // Time
                index % 15 === 0 &&
                <>
                    {// Time tick
                        displayTime &&
                        <line
                            x1={`${index * width + width / 2}%`}
                            x2={`${index * width + width / 2}%`}
                            y1='100%'
                            y2={index % 300 !== 0 ? '95%' : index % 600 !== 0 ? '92.5%' : '90%'}
                            stroke='black'
                            strokeWidth={1}

                        />
                    }
                    {// Vertical grid
                        displayTime && width &&
                        <>
                            <text
                                x={`${index * width + width / 2}%`}
                                y='90%'
                                fontSize={'.5em'}
                            >{index}</text>
                            <line
                                x1={`${index * width + width / 2}%`}
                                x2={`${index * width + width / 2}%`}
                                y1='0%'
                                y2='100%'
                                stroke='black'
                                strokeWidth={.25}
                            />
                        </>
                    }
                </>
            }
            { // Volume
                displayVolume && width && relativeVolume && volumeHigh && (volume || volume === 0) &&
                <>
                    <rect
                        name='volume'
                        x={`${index * width + width / 10}%`}
                        y={`${(90 + relativeVolume)}%`}
                        height={`${100 - relativeVolume}%`}
                        width={`${width * .8}%`}
                        fill='black'
                        volume={volume}
                        relativevolume={relativeVolume}
                        volumehigh={volumeHigh}
                    />
                    <text
                        textAnchor="middle"
                        x={`${index * width + width / 2}%`}
                        y={`${(89 + relativeVolume)}%`}
                        fontSize={`${width / 25}em`}
                    >{volume}</text>
                    {index === 0 &&
                        <text
                            x={`${index * width - width}%`}
                            y={`90%`}
                            stroke='black'
                            strokeWidth={.1}
                            fontSize={'.15em'}
                        >
                            {volumeHigh}
                        </text>}
                </>
            }
            { // Value
                displayValue && width && relativeValue &&
                <>
                    <circle
                        cx={`${index * width + width / 2}%`}
                        cy={`${60 - relativeValue * .5}%`}
                        r={width / 10}
                        stroke='blue'
                        fill='blue'
                        name='value'
                        value={`${value}%`}
                    />
                </>
            }
            { // price label
                isFinal && width && relativeClose && relativeOpen && relativeAverage1 && relativeAverage2 && average1 && average2 &&
                <>
                    <line
                        x1={`${index * width + width + 50}%`}
                        x2={'100%'}
                        y1={`${60 - relativeClose * .5}%`}
                        y2={`${60 - relativeClose * .5}%`}
                        stroke='blue'
                        strokeWidth={.5}
                    />
                    <text
                        x={`${index * width + width + 105}`}
                        y={`${60 - relativeClose * .5 - 1}%`}
                        stroke='blue'
                        strokeWidth={.1}
                        fontSize={'.25em'}
                    >{Math.floor(close * 100) / 100}</text>
                    {displayAverage &&
                        <>
                            <line
                                x1={`${index * width + width + 50}%`}
                                x2={`${index * width + width / 2}%`}
                                y1={`${60 - relativeAverage1 * .5}%`}
                                y2={`${60 - relativeAverage1 * .5}%`}
                                stroke='orange'
                                strokeWidth={.4}
                            />
                            <text
                                x={`${index * width + width + 105}`}
                                y={`${60 - relativeAverage1 * .5}%`}
                                stroke='orange'
                                strokeWidth={.1}
                                fontSize={'.2em'}
                            >
                                {average1}
                            </text>
                            <line
                                x1={`${index * width + width + 50}%`}
                                x2={`${index * width + width / 2}%`}
                                y1={`${60 - relativeAverage2 * .5}%`}
                                y2={`${60 - relativeAverage2 * .5}%`}
                                stroke='violet'
                                strokeWidth={.4}
                            />
                            <text
                                x={`${index * width + width + 105}`}
                                y={`${60 - relativeAverage2 * .5}%`}
                                stroke='violet'
                                strokeWidth={.1}
                                fontSize={'.2em'}
                            >
                                {average1}
                            </text>
                        </>}
                </>
            }
        </>
    )
}

export default ChartPixel;