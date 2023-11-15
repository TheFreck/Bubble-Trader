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
        average,
        yesterAve,
        isFinal
    } = props;
    // console.log("pixel: ", props);
    const span = highest - lowest;
    const relativeHigh = (high - lowest) / span * 100;
    const relativeLow = (low - lowest) / span * 100;
    const relativeOpen = (open - lowest) / span * 100;
    const relativeClose = (close - lowest) / span * 100;
    const relativeVolume = (volumeHigh - volume) / volumeHigh * 10;
    const relativeAverage = (average - lowest) / span * 100;
    const relativeYesterAve = (yesterAve - lowest) / span * 100;

    return (
        <>
            <line
                name='wick'
                x1={`${index * width + width / 2}%`}
                x2={`${index * width + width / 2}%`}
                y1={`${60 - (relativeLow !== relativeHigh ? relativeHigh : relativeHigh) * .5}%`}
                y2={`${60 - (relativeLow !== relativeHigh ? relativeLow : relativeLow) * .5}%`}
                stroke={close > open ? 'green' : 'red'}
                strokeWidth='.1%'
            />
            <rect
                name="candlestick"
                x={`${index * width}%`}
                y={`${60 - Math.min(relativeClose, relativeOpen) * .5}%`}
                height={`${Math.abs(relativeClose - relativeOpen) > 0 ? Math.abs(relativeClose - relativeOpen) : .1}%`}
                width={`${width}%`}
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
            {// Moving average
                displayAverage &&
                <line
                    x1={`${index * width - width / 2}%`}
                    x2={`${index * width + width / 2}%`}
                    y1={`${60 - relativeYesterAve * .5}%`}
                    y2={`${60 - relativeAverage * .5}%`}
                    stroke='orange'
                    strokeWidth={.25}
                    name='average'
                    average={`${average}`}
                />
            }
            {index % 30 === 0 &&
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
                        displayTime &&
                        <text
                            x={`${index * width + width / 2}%`}
                            y='90%'
                            fontSize={'.5em'}
                        >{index}</text>}
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
            { // Volume
                displayVolume &&
                <>
                    <rect
                        name='volume'
                        x={`${index * width + width / 10}%`}
                        y={`${(100 - relativeVolume)}%`}
                        height={`${relativeVolume}%`}
                        width={`${width * .8}%`}
                        fill='black'
                        volume={volume}
                        relativevolume={relativeVolume}
                        volumehigh={volumeHigh}
                    />
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
            {isFinal &&
                <>
                    <line
                        x1={`${index * width + width + 50}%`}
                        x2={'100%'}
                        y1={`${60 - Math.min(relativeClose, relativeOpen) * .5}%`}
                        y2={`${60 - Math.min(relativeClose, relativeOpen) * .5}%`}
                        stroke='blue'
                        strokeWidth={.5}
                    />
                    <text
                        x={`${index * width + width + 105}`}
                        y={`${60 - Math.min(relativeClose, relativeOpen) * .5 - 1}%`}
                        stroke='blue'
                        strokeWidth={.1}
                        fontSize={'.25em'}
                    >{Math.floor(close * 100) / 100}</text>
                    <rect
                        x='-12%'
                        y='0%'
                        height='100%'
                        width='5%'
                        fill='transparent'
                    />
                    {/* <PriceAxis
                        max={highest}
                        min={lowest}
                    /> */}
                </>
            }
        </>
    )
}

export default ChartPixel;