import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import TradingContext from "./TradingContext";
import PodiumHelpers from "./PodiumHelpers";

export const Podium = ({
    name,
    shareQty,
    sharesAvailable,
    startingPrice,
    sharesOutstanding,
    cashOnHand,
    tradeHistory,
    top,
    right,
    bottom,
    left,
    xMid,
    yMid,
    bid,
    ask,
    movingAverages,
    waves,
    value
}) => {
    const context = useContext(TradingContext);

    const assetRef = useRef();

    useEffect(() => {
        if(!name || !shareQty || !startingPrice || !top || !right || !bottom || !left ) {
            return;
        };
        assetRef.current = {
            ...assetRef.current,
            name,
            shareQty,
            sharesAvailable,
            startingPrice,
            cashOnHand,
            top,
            right,
            bottom,
            left,
            xMid,
            yMid,
            bid,
            ask,
            tradeHistory,
            movingAverages,
            waves,
            value
        }
        assetRef.current.sharesOutstanding = sharesOutstanding ? sharesOutstanding : 0;
        context.setPodiums(assetRef.current);
    },[]);
    
    const logPrices = () => {
        const prices = [];
        for(let price of tradeHistory){
            prices.unshift(price.price);
        }
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
        console.log("asset name: ", name);
        console.log(prices);
        console.log(tradeHistory);
        console.log("value: ", value);
    }

    const PodCallback = useCallback(() => <>
        <rect
            ref={assetRef}
            bid={bid}
            ask={ask}
            x={left}
            y={top}
            x-mid={(right-left)/2 + left}
            y-mid={(bottom-top)/2 + top}
            width={right-left}
            height={bottom-top}
            stroke={'red'}
            fill={'orange'}
            onClick={logPrices}
        />
        <line
            x1={left}
            x2={right}
            y1={top}
            y2={bottom}
            stroke='brown'
            strokeWidth={1}
        />
        <line
            x1={right}
            x2={left}
            y1={top}
            y2={bottom}
            stroke='brown'
            strokeWidth={1}
        />
        <text
            x={(right+left)/2-15}
            y={(top+bottom)/2+1}
            stroke='black'
            strokeWidth={.2}
            fontSize={'.3em'}
        >
            {name}
        </text>
        <text
            x={(right+left)/2+5}
            y={(top+bottom)/2-2}
            stroke='black'
            strokeWidth={.1}
            fontSize={'.15em'}
        >
            bid: {Math.floor(bid*100)/100}
        </text>
        <text
            x={(right+left)/2+5}
            y={(top+bottom)/2+2}
            stroke='black'
            strokeWidth={.1}
            fontSize={'.15em'}
        >
            ask: {Math.floor(ask*100)/100}
        </text>
        {/* <text
            x={left}
            y={top}
            stroke='black'
            strokeWidth={.1}
            fontSize={'.15em'}
        >
            (x: {left}, y: {top})
        </text>
        <text
            x={left}
            y={bottom}
            stroke='black'
            strokeWidth={.1}
            fontSize={'.15em'}
        >
            (x: {left}, y: {bottom})
        </text>
        <text
            x={xMid}
            y={yMid}
            stroke='black'
            strokeWidth={.1}
            fontSize={'.15em'}
        >
            (x: {xMid}, y: {yMid})
        </text> */}
    </>,
    [assetRef,bid,ask]);

    return <PodCallback />
}

export default Podium;