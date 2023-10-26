import React, { useContext, useEffect, useRef, useState } from "react";
import TradingContext from "./TradingContext";

export const Podium = ({name,shareQty,startingPrice,top,right,bottom,left}) => {
    const context = useContext(TradingContext);
    const [assetName,setAssetName] = useState(name);
    const [bid,setBid] = useState(startingPrice);
    const [ask, setAsk] = useState(startingPrice);
    const [lastTrade, setLastTrade] = useState({});
    const [tradeHistory, setTradeHistory] = useState([]);
    const [sharesOutstanding, setSharesOutstanding] = useState(0);
    const [sharesAvailable, setSharesAvailable] = useState(shareQty);
    const [cashOnHand, setCashOnHand] = useState(200000);
    const [topEdge, setTopEdge] = useState(top);
    const [rightEdge, setRightEdge] = useState(right);
    const [bottomEdge, setBottomEdge] = useState(bottom);
    const [leftEdge, setLeftEdge] = useState(left);
    const [traders, setTraders] = useState([]);

    const assetRef = useRef();

    useEffect(() => {
        assetRef.current = {
            ...assetRef.current,
            assetName,
            shareQty,
            startingPrice,
            bid,
            ask,
            lastTrade,
            tradeHistory,
            sharesOutstanding,
            sharesAvailable,
            cashOnHand,
            top:topEdge,
            right:rightEdge,
            bottom:bottomEdge,
            left:leftEdge,
            traders,
            buy,
            sell
        }
    },[]);

    const buy = (buyer,shares) => {
        setTraders([...traders,buyer.name]);
        if(buyer.cash >= shares*ask && sharesAvailable >= shares){
            assetRef.current.sharesOutstanding += shares;
            assetRef.current.sharesAvailable -= shares;
            assetRef.current.cashOnHand += shares*ask;

            tradeHistory.push({
                buyer: buyer.name,
                asset: assetName,
                price: ask,
                shares,
                time: Date.now()
            });
            setBid(bid * 1.001);
            setAsk(ask * 1.001);
            return true;
        }
        return false;
    }
    
    const sell = (seller,shares) => {
        traders.splice(traders.indexOf(seller.name),1);
        setTraders(traders);
        if(seller.portfolio[assetName] >= shares && cashOnHand >= shares*bid){
            assetRef.current.sharesOutstanding -= shares;
            assetRef.current.sharesAvailable += shares;
            assetRef.current.cashOnHand -= shares*bid;
            
            tradeHistory.push({
                seller: seller.name,
                asset: assetName,
                price: bid,
                shares,
                time: Date.now()
            });
            setBid(bid * .999);
            setAsk(ask * .999);
            return true;
        }
        return false;
    }


    return <rect
        ref={assetRef}
        x={leftEdge}
        y={topEdge}
        width={rightEdge-leftEdge}
        height={bottomEdge-topEdge}
        stroke={'red'}
        fill={'orange'}
    />
}

export default Podium;