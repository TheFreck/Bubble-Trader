import react, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import TradingContext from './TradingContext';

export const Trader = (props) => {
    const {
        name='Trader-Joe',
        xSpeed=(Math.random()*2-1)/5,
        ySpeed=(Math.random()*2-1)/5,
        size=5,
        shares=0,
        cash=0,
        isAlive=true,
        x=Math.random()*100,
        y=Math.random()*100,
        red,
        green,
        blue,
        index,
        isin
    } = props;

    const ref = useRef();
    const context = useContext(TradingContext);
    const [reRender,setReRender]=useState(false);
    const [portfolio, setPortfolio] = useState({});
    const [tradingCash, setTradingCash] = useState(10000);
    const [isIn, setIsIn] = useState(isin ? isin : false);
    useEffect(() => {
        console.log("isIn: ", isIn);
    },[isIn]);

    useEffect(()=> {
        if(name === 'Trader-Joe') return;
        ref.current = {
            ...ref.current,
            name,
            xSpeed,
            ySpeed,
            size,
            shares,
            cash: tradingCash,
            isAlive,
            x,
            y,
            red,
            green,
            blue,
            portfolio,
            isIn,
        };
        let theTraders = context.traders;
        theTraders[index] = ref.current;
        context.setTraders(theTraders);
        checkProximity(() => {
            for(let podium of context.podiums){
                if(podium.top <= ref.current.y 
                    && podium.right >= ref.current.x 
                    && podium.bottom >= ref.current.y 
                    && podium.left <= ref.current.x
                ){
                    let current = context.traders.find(t => t.name===ref.current.name);
                    console.log("current.isIn: ", current.isIn);
                    for(let [att,val] of Object.entries(current)){
                        if(att==='isIn') console.log(att,val);
                    }
                    // buy
                    if(podium.buy(ref.current,100 && !isIn)){
                        setIsIn(true);
                        ref.current.isIn =  true;
                        let theMe = context.traders.find(t => t.name===ref.current.name);
                        console.log("theMe.isIn: ", theMe.isIn);
                        
                        // TODO: Need to ensure this only fires when the trader enters rather than every frame it's in
                        if(ref.current.portfolio[podium.assetName]) portfolio[podium.assetName] += 100;
                        else ref.current.portfolio[podium.assetName] =  100;
                        ref.current.cash -= podium.ask*100;
                        console.log("I'm in! ", ref.current.portfolio);
                    }
                }
                else {
                    // sell
                    if(podium.sell(ref.current,100) && ref.current.isIn){
                        ref.current.isIn = false;
                        // TODO: Need to ensure this only fires when the trader leaves rather than every frame it's out
                        if(ref.currrent.portfolio[podium.assetName]) ref.current.portfolio[podium.assetName] -= 100;
                        else console.log("wtf?!?");
                        ref.current.cash += podium.ask*100;
                        console.log("I'm out! ", ref.current.portfolio);
                    }
                    
                }
            }
            setReRender(!reRender);
        });
    },[]);

     const bounce = (us,them) => {
        if(context.bounces.includes({
            names: [us.name,them.name],
            [us.name]: {xSpeed: them.xSpeed,ySpeed: them.ySpeed},
            [them.name]: {xSpeed: us.xSpeed, ySpeed: us.ySpeed}
        })) return;
        
        context.setBounces([...context.bounces,{
            names: [us.name,them.name],
            [us.name]: {xSpeed: them.xSpeed,ySpeed: them.ySpeed},
            [them.name]: {xSpeed: us.xSpeed, ySpeed: us.ySpeed}
        }]);
     }

    const checkProximity = (cb) => {
        const minDistance = size;
        for(let trader of context.traders){
            if(trader.name===ref.current.name)continue;
            let connection = context.connections?.find(c => c.names.includes(trader.name) && c.names.includes(ref.current.name));
            let rise = trader.y - y;
            let run = trader.x - x;
            let distance = Math.sqrt(rise*rise+run*run);
            // connect
            if(distance < minDistance && !connection){
                if(!context.connections.find(c => c.names.includes(ref.current.name) && c.names.includes(trader.name))){
                    context.setConnections([...context.connections,{
                        names: [trader.name,ref.current.name],
                        x1:ref.current.x,
                        y1:ref.current.y,
                        x2:trader.x,
                        y2:trader.y,
                        red: (ref.current.red + trader.red)/2,
                        green: (ref.current.green+trader.green)/2,
                        blue: (ref.current.blue+trader.blue)/2
                    }]);
                }
                ref.current.red = (1000*ref.current.red+trader.red)/1001;
                ref.current.green = (1000*ref.current.green+trader.green)/1001;
                ref.current.blue = (1000*ref.current.blue+trader.blue)/1001;
            }
            // maintain connection
            else if(distance < minDistance && connection){
                connection.x1 = ref.current.x;
                connection.x2 = trader.x;
                connection.y1 = ref.current.y;
                connection.y2 = trader.y;
                console.log("distance: ", distance);
                console.log(ref.current.name, ref.current.xSpeed);
                console.log(trader.name, trader.xSpeed);
                if(distance<ref.current.size*2) {
                    bounce(ref.current,context.traders.find(t => t.name===trader.name));
                }
            }
            // cancel connection
            else if(distance > minDistance && connection){
                context.connections.splice(context.connections.indexOf(connection),1);
            }
            // bounce
            let bounced = context.bounces.find(b => b[ref.current.name] !== null && b[trader.name] !== null);
            if(bounced && bounced.names.includes(ref.current.name)){
                ref.current.xSpeed = bounced[ref.current.name].xSpeed;
                ref.current.ySpeed = bounced[ref.current.name].ySpeed;
                bounced.names.splice(bounce.name.indexOf(ref.current.name),1);
            }
        }
        cb();
    }
    
    const CircleCallback = useCallback(() => 
        <>
            <circle
                key={name}
                ref={ref}
                name={name}
                // stroke={'#005717'}
                fill={`rgb(${ref.current?.red},${ref.current?.green},${ref.current?.blue})`}
                stroke={`rgb(${ref.current?.red*.5},${ref.current?.green*.5},${ref.current?.blue*.5})`}
                strokeWidth={.5}
                cx={`${x}%`}
                cy={`${y}%`}
                r={size}
            />
            {name === 'Trader-0' && <rect x={x-size/2} y={y-size/2} width={size} height={size}/>}
            
        </>,
            [reRender]
    )
    
    return <CircleCallback />
}
