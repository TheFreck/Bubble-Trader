import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import TradingContext from "./TradingContext";

export const Podium = ({name,shareQty,startingPrice,top,right,bottom,left}) => {
    const context = useContext(TradingContext);
    const [assetName,setAssetName] = useState(name);
    const [bid,setBid] = useState(startingPrice/.999);
    const [ask, setAsk] = useState(startingPrice*.999);
    const [lastTrade, setLastTrade] = useState({});
    const [tradeHistory, setTradeHistory] = useState([]);
    const [sharesOutstanding, setSharesOutstanding] = useState(0);
    const [sharesAvailable, setSharesAvailable] = useState(shareQty);
    const [cashOnHand, setCashOnHand] = useState(200000000);
    const [topEdge, setTopEdge] = useState(top);
    const [rightEdge, setRightEdge] = useState(right);
    const [bottomEdge, setBottomEdge] = useState(bottom);
    const [leftEdge, setLeftEdge] = useState(left);
    const [traders, setTraders] = useState([]);

    const assetRef = useRef();

    useEffect(() => {
        let me = context.podiums.find(p => p.name === assetName);
        me.buy = buy;
        me.sell = sell;
        me.bid = bid;
        me.ask = ask;
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
        let pod = context.podiums.find(p => p.name === assetName);
        if(buyer.cash >= shares*ask && sharesAvailable >= shares){
            assetRef.current.sharesOutstanding += shares;
            assetRef.current.sharesAvailable -= shares;
            assetRef.current.cashOnHand += shares*pod.ask;

            tradeHistory.unshift({
                buyer: buyer.name,
                asset: assetName,
                price: pod.ask,
                shares,
                time: Date.now()
            });
            let newBid = pod.bid / .99;
            let newAsk = pod.ask / .99;
            assetRef.current.bid = newBid;
            assetRef.current.ask = newAsk;
            setBid(newBid);
            setAsk(newAsk);
            pod.bid = newBid;
            pod.ask = newAsk;
            context.setPodiums([...context.podiums.filter(p => p.name !== assetName),pod]);
            console.log(`buy ${assetName} - ${pod.ask}`);
            return {
                status: true,
                cash: pod.ask*shares
            };
        }
        return {status:false};
    }
    
    const sell = (seller,shares) => {
        traders.splice(traders.indexOf(seller.name),1);
        setTraders(traders);
        let pod = context.podiums.find(p => p.name === assetName);
        if(seller.portfolio[assetName] >= shares && cashOnHand >= shares*pod.bid){
            assetRef.current.sharesOutstanding -= shares;
            assetRef.current.sharesAvailable += shares;
            assetRef.current.cashOnHand -= shares*pod.bid;
            
            tradeHistory.unshift({
                seller: seller.name,
                asset: assetName,
                price: pod.bid,
                shares,
                time: Date.now()
            });
            let newBid = pod.bid * .99;
            let newAsk = pod.ask * .99;
            setBid(newBid);
            setAsk(newAsk);
            pod.bid = newBid;
            pod.ask = newAsk;
            context.setPodiums([...context.podiums.filter(p => p.name !== assetName),pod]);
            console.log(`sell ${assetName} - ${pod.bid}`);
            return {
                status: true,
                cash: pod.bid*shares
            };
        }
        return {status:false};
    }

    const PodCallback = useCallback(() => <>
        <rect
            ref={assetRef}
            bid={bid}
            ask={ask}
            x={leftEdge}
            y={topEdge}
            width={rightEdge-leftEdge}
            height={bottomEdge-topEdge}
            stroke={'red'}
            fill={'orange'}
        />
            <text
                x={(rightEdge+leftEdge)/2}
                y={(topEdge+bottomEdge)/2}
                stroke='black'
                strokeWidth={.2}
                fontSize={'.5em'}
            >{assetName}</text>
    </>,
    [assetRef,bid,ask]);

    return <PodCallback />
}

export default Podium;