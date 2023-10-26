import react, { Suspense, useEffect, useRef, useState, useContext, useCallback } from 'react';
import { Trader } from './Trader';
import TradingContext from './TradingContext';
import Podium from './Podium';
import { Diamond } from './Diamond';

export const TradingFloor = (props) => {
    const { floorWidth, floorHeight, floorId } = props;
    const context = useContext(TradingContext);
    const [traders,setTraders] = useState(context.traders);
    const [militicks, setMiliticks] = useState(5);
    const [connections, setConnections] = useState([]);
    const [diamonds, setDiamonds] = useState([]);
    const [points, setPoints] = useState([]);
    const slopes = [
        (x,y) => {
            if(x >= points[3].x && x <= points[0].x){
                // left
                return y <= x * (points[3].y-points[0].y)/(points[3].x-points[0].x) + points[3].y
            }
            else if(x >= points[0].x && x <= points[1].x){
                // right
                return y <= x * (points[0].y-points[1].y)/(points[0].x-points[1].x) + points[0].y + points[1].y
            }
            else return true;
        },
        (x,y) => {
            if(x >= points[3].x && x <= points[0].x){
                // left
                return y >= x * (points[3].y-points[0].y)/(points[3].x-points[0].x) + points[3].y
            }
            else if(x >= points[0].x && x <= points[1].x){
                // right
                return y >= x * (points[0].y-points[1].y)/(points[0].x-points[1].x) + points[0].y + points[1].y
            }
            else return true;
        }
    ];
    const floorRef = useRef();

    useEffect(() => {
        floorRef.current.name = `Floor-${floorId}`;
        const pts = [
            {
                // top
                x: 1,
                y: 49
            },
            {
                // right
                x: 49,
                y: 1
            },
            {
                // bottom
                x: 99,
                y: 49
            },
            {
                // left
                x: 49,
                y: 99
            }
        ];
        setPoints(pts);

        setDiamonds([{
            points,
            slopes
        }]);
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
        for(let podium of context.podiums){
            // podium left
            if(trader.x + trader.size >= podium.left
            && trader.x + trader.size <= podium.left + trader.size 
            && trader.y >= podium.top - 1
            && trader.y <= podium.bottom + 1
            && trader.xSpeed > 0){
                console.log("left");
                trader.xSpeed *= -1;
            }
            // podium right
            if(trader.x - trader.size <= podium.right
            && trader.x - trader.size >= podium.right - trader.size 
            && trader.y >= podium.top - 1
            && trader.y <= podium.bottom + 1
            && trader.xSpeed < 0) {
                console.log("right");
                trader.xSpeed *= -1;
            }
            // podium top
            if(trader.y + trader.size >= podium.top
            && trader.y + trader.size <= podium.top + trader.size
            && trader.x >= podium.left - 1
            && trader.x <= podium.right + 1
            && trader.ySpeed > 0) {
                console.log("top");
                trader.ySpeed *= -1;
            }
            // podium bottom
            if(trader.y - trader.size <= podium.bottom
            && trader.y - trader.size >= podium.bottom - trader.size
            && trader.x >= podium.left - 1
            && trader.x <= podium.right + 1
            && trader.ySpeed < 0) {
                console.log("bottom");
                trader.ySpeed *= -1;
            }
        }
        if (trader.x - trader.size/2 <= -50 || trader.x + trader.size/2 >= 150){
            trader.xSpeed *= -1;
        }
        if (trader.y - trader.size <= 0 || trader.y + trader.size >= 100){
            trader.ySpeed *= -1;
        }
        bounce(trader);
        trader.x += trader.xSpeed;
        trader.y += trader.ySpeed;
        setTraders([...traders.filter(t => t.name !== trader.name),trader]);
        findConnections();
    };

    const findConnections = () => {
        const connects = [];
        for(let i=0; i<traders.length; i++){
            for(let j=0; j<traders.length; j++){
                if(traders[i].name===traders[j].name)continue;
                let xDist = Math.pow(traders[i].x-traders[j].x,2);
                let yDist = Math.pow(traders[i].y-traders[j].y,2);
                let dist = Math.sqrt(xDist+yDist);
                if(dist<50){
                    connects.push({
                        names:[traders[i].name,traders[j].name],
                        x1: traders[i].x,
                        x2: traders[j].x,
                        y1: traders[i].y,
                        y2: traders[j].y,
                        red: 100,
                        green: 100,
                        blue: 100
                    });
                }
            }
        }
        setConnections(connects);
    }

    const bounce = () => {
        let collisions = [];
        for(let trader of traders){
            if(!slopes[0](trader.x,trader.y)){
                // bounce
                console.log("bounce");

            }
        }
    }

    const PodiumCallback = useCallback(() => 
    <Suspense fallback={null}>
        {context.floorId && context.podiums && context.podiums.map((p,i) => 
            <Podium 
                key={i}
                name={p.name}
                shareQty={1000}
                startingPrice={20}
                top={p.top}
                bottom={p.bottom}
                right={p.right}
                left={p.left}
            />
        )}
    </Suspense>
    ,[context.connections]);

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

    const DiamondCallback = useCallback(() => {
        if(!points.length & !slopes.length) return;
        console.log(points,slopes);
        return <Diamond 
            points={points}
            slopes={slopes}
        />}
    ,[diamonds]);

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
                {/* <PodiumCallback /> */}
                <TraderCallback />
                <ConnectionsCallback />
                {/* <DiamondCallback /> */}
            </svg>
        </div>
    )
}


export default TradingFloor;