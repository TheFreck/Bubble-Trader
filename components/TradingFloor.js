import react, { Suspense, useEffect, useRef, useState, useContext, useCallback } from 'react';
import Asset from './Asset';
import { Trader } from './Trader';
import TradingContext from './TradingContext';
import Podium from './Podium';

export const TradingFloor = (props) => {
    const { floorWidth, floorHeight,traderPlaceHolders } = props;
    const context = useContext(TradingContext);
    const [militicks, setMiliticks] = useState(100);
    useEffect(() => {
    }, []);
    const floorRef = useRef();

    useEffect(() => {
        if (context.isRunning) {
            if (!context.intervalId) {
                let intId = setInterval(march, militicks);
                context.setIntervalId(intId);
            }
        }
        else {
            clearInterval(context.intervalId);
            context.setIntervalId(0);
        }
    }, [context.isRunning]);


    const march = () => {
        if (context.isRunning) {
            context.setTime(context.time++);
            for(let [key,value] of Object.entries(context.traders)){
                move(value);
            }
            const bounces = [];
            for(let bounce of context.bounces){
                if(bounce.names.length) continue;
                else bounces.push(bounce);
            }
            context.setBounces(bounces);
        }
        else {
            console.log("stop marching");
        }
    }
    // const getName = (chars, type) => {
    //     const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    //     const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
    //     const vowels = ['A', 'E', 'I', 'O', 'U'];
    //     let name = '';
    //     if (type === 'ticker') {
    //         for (let i = 0; i < chars; i++) {
    //             name += Math.random(alphabet);
    //         }
    //     }
    //     else if (type === 'name') {
    //         for (let i = 0; i < chars; i++) {
    //             name += Math.random(i % 2 ? consonants : vowels);
    //         }
    //     }
    //     return name;
    // }

    const move = (trader) => {
        if (!trader.isAlive) return;
        if (trader.x <= -50 || trader.x >= 150){
            trader.xSpeed *= -1;
            if(trader.xSpeed>=0 && trader.ySpeed>=0) //bottomRight
            // console.log("bottom right angle: ", 90 * Math.abs(trader.ySpeed)/(Math.abs(trader.xSpeed)+Math.abs(trader.ySpeed)));
            if(trader.xSpeed>=0 && trader.ySpeed<0) //bottomRight
            // console.log("top right angle: ", 90 + 90 * Math.abs(trader.ySpeed)/(Math.abs(trader.xSpeed)+Math.abs(trader.ySpeed)));
            if(trader.xSpeed<0 && trader.ySpeed>= 0) //topLeft
            // console.log("bottom left angle: ", 180 + 90 * Math.abs(trader.ySpeed)/(Math.abs(trader.xSpeed)+Math.abs(trader.ySpeed)));
            if(trader.xSpeed<0 && trader.ySpeed<0) //bottomLeft
            // console.log("top left angle: ", 270 + 90 * Math.abs(trader.ySpeed)/(Math.abs(trader.xSpeed)+Math.abs(trader.ySpeed)));
            console.log(trader.xSpeed,trader.ySpeed);
        }
        if (trader.y <= 0 || trader.y >= 100){
            trader.ySpeed *= -1;
            if(trader.xSpeed>=0 && trader.ySpeed>=0) //bottomRight
            // console.log("bottom right angle: ", 90 * Math.abs(trader.ySpeed)/(Math.abs(trader.xSpeed)+Math.abs(trader.ySpeed)));
            if(trader.xSpeed>=0 && trader.ySpeed<0) //bottomRight
            // console.log("top right angle: ", 90 + 90 * Math.abs(trader.ySpeed)/(Math.abs(trader.xSpeed)+Math.abs(trader.ySpeed)));
            if(trader.xSpeed<0 && trader.ySpeed>= 0) //topLeft
            // console.log("bottom left angle: ", 180 + 90 * Math.abs(trader.ySpeed)/(Math.abs(trader.xSpeed)+Math.abs(trader.ySpeed)));
            if(trader.xSpeed<0 && trader.ySpeed<0) //bottomLeft
            // console.log("top left angle: ", 270 + 90 * Math.abs(trader.ySpeed)/(Math.abs(trader.xSpeed)+Math.abs(trader.ySpeed)));
            console.log(trader.xSpeed,trader.ySpeed);
        }
        trader.x += trader.xSpeed;
        trader.y += trader.ySpeed;
    }

    const TraderCallback = useCallback(()=> 
        <Suspense fallback={null} key={"suspense-"}>
            {context.traders && context.traders.length > 0 && context.traders.map((t, i) =>
                <Trader
                    key={i}
                    index={i}
                    name={t.name}
                    xSpeed={t.xSpeed}
                    ySpeed={t.ySpeed}
                    x={t.x+t.xSpeed}
                    y={t.y+t.ySpeed}
                    red={t.red}
                    green={t.green}
                    blue={t.blue}
                    isIn={t.isIn}
                >
                    {console.log("t.isIn: ", t.isIn)}
                </Trader>
            )}
            {context.traders?.length <= 0 && traderPlaceHolders &&
            traderPlaceHolders.map((t, i) =>
                <Trader
                    key={i}
                    index={i}
                    name={t}
                    x={20}
                    y={50}
                    xSpeed={.3}
                    ySpeed={-.1}
                    red={Math.random()*255}
                    green={Math.random()*255}
                    blue={Math.random()*255}
                />
            )}
        </Suspense>,
    [context]);

    const ConnectionsCallback = useCallback(() => 
    <Suspense fallback={null}>
        {
                context.connections && context.connections.map((c,j) => 
                    <line 
                        key={j} 
                        names={c.names} 
                        x1={c.x1} 
                        x2={c.x2} 
                        y1={c.y1} 
                        y2={c.y2} 
                        stroke={`rgb(${c.red},${c.green},${c.blue})`} 
                        strokeWidth={.2} 
                    />
                )
            }
    </Suspense>
    ,[context.connections]);

    return (
        <div
            ref={floorRef}
        >
            <svg
                viewBox={`0 0 100 100`}
                width={`${floorWidth}vw`}
                height={`${floorHeight}vh`}
                xmlns="http://www.w3.org/2000/svg"
                style={{ background: 'black' }}
            >
                <Podium 
                    name='ABC'
                    shareQty={1000}
                    startingPrice={20}
                />
                <TraderCallback />
                <ConnectionsCallback />
            </svg>
        </div>
    )
}


export default TradingFloor;