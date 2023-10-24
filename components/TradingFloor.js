import react, { Suspense, useEffect, useRef, useState, useContext, useCallback } from 'react';
import { Trader } from './Trader';
import TradingContext from './TradingContext';
import Podium from './Podium';

export const TradingFloor = (props) => {
    const { floorWidth, floorHeight, floorId } = props;
    const context = useContext(TradingContext);
    const [traders,setTraders] = useState(context.traders);
    const [militicks, setMiliticks] = useState(10);
    const [connections, setConnections] = useState([]);
    const floorRef = useRef();

    useEffect(() => {
        floorRef.current.name = `Floor-${floorId}`;
        return () => {
            console.log("killing Trading Floor: ", context);
        }
    },[]);

    useEffect(() => {
        if (context.isRunning) {
            if (!context.intervalId) {
                let intId = setInterval(march, militicks);
                console.log("intId: ", intId);
                context.setIntervalId(intId);
            }
        }
        else {
            clearInterval(context.intervalId);
            context.setIntervalId(0);
        }
    }, [context.isRunning]);

    const march = () => {
        for(let trader of traders){
            setConnections([]);
            move(trader);
        }
        context.setTraders(traders);
    };

    const move = (trader) => {
        if (!trader.isAlive) return;
        if (trader.x - trader.size/2 <= -50 || trader.x + trader.size/2 >= 150){
            trader.xSpeed *= -1;
        }
        if (trader.y - trader.size <= 0 || trader.y + trader.size >= 100){
            trader.ySpeed *= -1;
        }
        trader.x += trader.xSpeed;
        trader.y += trader.ySpeed;
        setTraders([...traders.filter(t => t.name !== trader.name),trader]);
        findConnections();
    };

    const findConnections = () => {
        for(let i=0; i<traders.length; i++){
            for(let j=0; j<traders.length; j++){
                if(traders[i].name===traders[j].name)continue;
                let xDist = Math.pow(traders[i].x-traders[j].x,2);
                let yDist = Math.pow(traders[i].y-traders[j].y,2);
                let dist = Math.sqrt(xDist+yDist);
                if(dist<50){
                    setConnections([...connections,{
                        names:[traders[i].name,traders[j].name],
                        x1: traders[i].x,
                        x2: traders[j].x,
                        y1: traders[i].y,
                        y2: traders[j].y,
                        red: 100,
                        green: 100,
                        blue: 100
                    }])
                }
            }
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

    // const move = (tr) => {
    //     let trader = context.traders.find(t => t.name === tr);
    //     if (!trader.isAlive) return;
    //     if (trader.x <= -50 || trader.x >= 150){
    //         trader.xSpeed *= -1;
    //     }
    //     if (trader.y <= 0 || trader.y >= 100){
    //         trader.ySpeed *= -1;
    //     }
    //     trader.x += trader.xSpeed;
    //     trader.y += trader.ySpeed;
    //     updateTraders(trader);
    // }

    const TraderCallback = useCallback(()=> 
        <Suspense fallback={null} key={"suspense-"}>
            {context.floorId && context.traders && context.traders.length > 0 && context.traders.map((t, i) =>
                <Trader
                    key={i}
                    index={i}
                    name={t.name}
                    xSpeed={t.xSpeed}
                    ySpeed={t.ySpeed}
                    x={t.x}
                    y={t.y}
                    red={t.red}
                    green={t.green}
                    blue={t.blue}
                    isIn={t.isIn}
                    isGo={context.isRunning}
                    floorId={floorId}
                    size={t.size}
                >
                </Trader>
            )}
        </Suspense>,
    [context.floorId,context.isRunning,traders]);

    const ConnectionsCallback = useCallback(() => 
    <Suspense fallback={null}>
        {
                connections && connections.map((c,j) => 
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
    ,[connections]);

    const PodiumCallback = useCallback(() => 
    <Suspense fallback={null}>
        <Podium 
            name='ABC'
            shareQty={1000}
            startingPrice={20}
        />
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
                <PodiumCallback />
                <TraderCallback />
                <ConnectionsCallback />
            </svg>
        </div>
    )
}


export default TradingFloor;