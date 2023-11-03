import react, { Suspense, useEffect, useRef, useState, useContext, useCallback } from 'react';
import { Trader } from './Trader';
import TradingContext from './TradingContext';
import Podium from './Podium';
import { Diamond } from './Diamond';

export const TradingFloor = (props) => {
    const { floorWidth, floorHeight, floorId } = props;
    const context = useContext(TradingContext);
    const [traders, setTraders] = useState(context.traders);
    const [militicks, setMiliticks] = useState(10);
    const [connections, setConnections] = useState([]);
    const [diamonds, setDiamonds] = useState([]);
    const [points, setPoints] = useState([]);
    const slopes = [
        (x, y) => {
            if (x >= points[3].x && x <= points[0].x) {
                // left
                return y <= x * (points[3].y - points[0].y) / (points[3].x - points[0].x) + points[3].y
            }
            else if (x >= points[0].x && x <= points[1].x) {
                // right
                return y <= x * (points[0].y - points[1].y) / (points[0].x - points[1].x) + points[0].y + points[1].y
            }
            else return true;
        },
        (x, y) => {
            if (x >= points[3].x && x <= points[0].x) {
                // left
                return y >= x * (points[3].y - points[0].y) / (points[3].x - points[0].x) + points[3].y
            }
            else if (x >= points[0].x && x <= points[1].x) {
                // right
                return y >= x * (points[0].y - points[1].y) / (points[0].x - points[1].x) + points[0].y + points[1].y
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
    }, []);

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
        const trs = [];
        findConnections(pos => {
            for(let trader of context.traders){
                let normal = pos.find(p => p.name === trader.name && p.type === 'normal');
                if (pos.length && normal) {
                    console.log(trader.name);
                    let normalAngle = normal?.angle;
                    let aimAdjustment = 2*(trader.aim - normalAngle);
                    trader.aim += aimAdjustment;
                    let aimRadians = (trader.aim/360)*Math.PI*2;
                    const magnitude = Math.sqrt(trader.xSpeed * trader.xSpeed + trader.ySpeed * trader.ySpeed);
                    const newXspeed = trader.aim === 180 || trader.aim === 0 || trader.aim === 360 ? 0 : -Math.sin(-aimRadians) * magnitude;
                    const newYspeed = trader.aim === 90 || trader.aim === 270 ? 0 : -Math.cos(aimRadians) * magnitude;
                    let dist = Math.sqrt(Math.pow(normal.x1-normal.x2,2)+Math.pow(normal.y1-normal.y2,2));
                    console.log("dist: ", dist);
                    // work on transfering magnitude from one to the other
                    // add a slowdown to the traders
                    trader.xSpeed = newXspeed;
                    trader.ySpeed = newYspeed;
                    trader.x += 10*trader.xSpeed;
                    trader.y += 10*trader.ySpeed;
                }
                trader.x += trader.xSpeed;
                trader.y += trader.ySpeed;
                trs.push(trader);
            }
            setTraders(trs);
        });

        for (let trader of trs) {
            move(trader);
        }
        context.setTraders(traders);
    };

    const move = (trader) => {
        if (!trader.isAlive) return;
        trader.aim = getAim(trader.xSpeed,trader.ySpeed);
        // Podiums
        for (let podium of context.podiums) {
            // podium left
            if (trader.x + trader.size >= podium.left
                && trader.x + trader.size <= podium.left + trader.size
                && trader.y >= podium.top - 1
                && trader.y <= podium.bottom + 1
                && trader.xSpeed > 0) {
                console.log("left");
                trader.xSpeed *= -1;
            }
            // podium right
            if (trader.x - trader.size <= podium.right
                && trader.x - trader.size >= podium.right - trader.size
                && trader.y >= podium.top - 1
                && trader.y <= podium.bottom + 1
                && trader.xSpeed < 0) {
                console.log("right");
                trader.xSpeed *= -1;
            }
            // podium top
            if (trader.y + trader.size >= podium.top
                && trader.y + trader.size <= podium.top + trader.size
                && trader.x >= podium.left - 1
                && trader.x <= podium.right + 1
                && trader.ySpeed > 0) {
                console.log("top");
                trader.ySpeed *= -1;
            }
            // podium bottom
            if (trader.y - trader.size <= podium.bottom
                && trader.y - trader.size >= podium.bottom - trader.size
                && trader.x >= podium.left - 1
                && trader.x <= podium.right + 1
                && trader.ySpeed < 0) {
                console.log("bottom");
                trader.ySpeed *= -1;
            }
        }
        // Walls
        if (trader.x - trader.size / 2 <= -50 || trader.x + trader.size / 2 >= 150) {
            trader.xSpeed *= -1;
            trader.x += trader.xSpeed;
        }
        if (trader.y - trader.size <= 1 || trader.y + trader.size >= 99) {
            trader.ySpeed *= -1;
            trader.y += trader.ySpeed;
        }

        
    };

    const findConnections = (cb) => {
        const connects = [];
        let andOut;
        let trader;
        for (let i = 0; i < traders.length; i++) {
            if(!traders[i].isAlive) continue;
            trader = traders[i];
            for (let j = 0; j < traders.length; j++) {
                if (traders[i].name === traders[j].name) continue;
                let xDist = Math.pow(traders[i].x - traders[j].x, 2);
                let yDist = Math.pow(traders[i].y - traders[j].y, 2);
                let dist = Math.sqrt(xDist + yDist);
                if (dist < 11) {
                    let normalAngle = getAim(traders[j].x-traders[i].x,traders[j].y-traders[i].y);
                    connects.push({
                        name: traders[i].name,
                        type: 'normal',
                        x1: traders[j].x,
                        x2: traders[i].x,
                        y1: traders[j].y,
                        y2: traders[i].y,
                        red: 255,
                        green: 0,
                        blue: 0,
                        angle: normalAngle
                    });
                }
            }
        }
        andOut = cb(connects);
        return andOut;
    }

    const getAim = (xSpeed,ySpeed) => {
        let aim = 0;
        if(xSpeed === 0){
            if(ySpeed > 0) {
                aim = 180;
            }
            else {
                aim = 0;
            }
        } 
        if(ySpeed === 0) {
            if(xSpeed > 0){
                aim = 90;
            }
            else {
                aim = 270;
            }
        }
        if(ySpeed < 0){
            
            aim = (Math.atan(-xSpeed/ySpeed)/Math.PI*180)%360;
        }
        else{
            aim = (Math.atan(-xSpeed/ySpeed)/Math.PI*180+180)%360;
        }
        return aim;
    }

    const PodiumCallback = useCallback(() =>
        <Suspense fallback={null}>
            {context.floorId && context.podiums && context.podiums.map((p, i) =>
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
        , [context.connections]);

    const TraderCallback = useCallback(() =>
    <>
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
                    isAlive={t.isAlive}
                    aim={getAim(t.xSpeed,t.ySpeed)}
                >
                </Trader>
            )}
        </Suspense>
    </>
        ,
        [context.floorId, context.isRunning, context.traders, traders]);

    const ConnectionsCallback = useCallback(() =>
        <Suspense fallback={null}>
            {
                connections && connections.length && connections.map((c, j) =>
                    <line
                        key={j}
                        type={c.type}
                        names={c.names}
                        angle={c.angle}
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
        , [connections]);

    const DiamondCallback = useCallback(() => {
        if (!points.length & !slopes.length) return;
        console.log(points, slopes);
        return <Diamond
            points={points}
            slopes={slopes}
        />
    }
        , [diamonds]);

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