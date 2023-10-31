import react, { Suspense, useEffect, useRef, useState, useContext, useCallback } from 'react';
import { Trader } from './Trader';
import TradingContext from './TradingContext';
import Podium from './Podium';
import { Diamond } from './Diamond';
import { isFunctionDeclaration, isTypeQueryNode } from 'typescript';

export const TradingFloor = (props) => {
    const { floorWidth, floorHeight, floorId } = props;
    const context = useContext(TradingContext);
    const [traders, setTraders] = useState(context.traders);
    const [militicks, setMiliticks] = useState(5);
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
        for (let trader of traders) {
            setConnections([]);
            move(trader);
        }
        context.setTraders(traders);
    };

    useEffect(() => {
        if(connections.length)
        console.log("connections updated: ", connections);
    },[connections]);

    const move = (trader) => {
        if (!trader.isAlive) return;
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
        }
        if (trader.y - trader.size <= 0 || trader.y + trader.size >= 100) {
            trader.ySpeed *= -1;
        }

        findConnections(pos => {
            if (connections.length || pos.length) {
                console.log(trader.name);
                for(let po of pos){
                    connections.push(po);
                }
                setConnections(connections);
                let aimAdjustment = (trader.aim - pos.find(p => p.names.includes(trader.name) && p.type === 'normal')?.angle + 180)%360;
                let aimRadians = ((trader.aim/360)*Math.PI*2)%Math.PI;
                trader.aim += aimAdjustment;
                const preMagnitude = Math.sqrt(trader.xSpeed * trader.xSpeed + trader.ySpeed * trader.ySpeed);
                trader.xSpeed = Math.sin(aimRadians) * preMagnitude;
                trader.ySpeed = Math.round(Math.cos(aimRadians) * preMagnitude,.001);
            }
            trader.x += trader.xSpeed;
            trader.y += trader.ySpeed;

            setTraders([...traders.filter(t => t.name !== trader.name), trader]);
        });
    };
    useEffect(() => {
        console.log("connections changed: ", connections);
    },[connections]);

    const findConnections = (cb) => {
        const connects = [];
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
                    if (!connects.find(c => c.names.includes(traders[i].name) && c.names.includes(traders[j].name) && c.type === 'normal')) {
                        let slope = (traders[j].y-traders[i].y)/(traders[j].x-traders[i].x);
                        let angle = (Math.atan(slope)/Math.PI*180+90);
                        connects.push({
                            names: [traders[i].name, traders[j].name],
                            type: 'normal',
                            slope,
                            x1: traders[i].x,
                            x2: traders[j].x,
                            y1: traders[i].y,
                            y2: traders[j].y,
                            red: 255,
                            green: 0,
                            blue: 0,
                            angle
                        });
                    }
                    if (!connects.find(c => c.names.includes(traders[i].name) && c.names.includes(traders[j].name) && c.type === 'wall')){
                        let slope = (traders[j].y - traders[i].x) / (traders[i].y - traders[j].x);
                        let angle = (Math.atan(slope)/Math.PI*180);
                        connects.push({
                            names: [traders[i].name, traders[j].name],
                            type: 'wall',
                            slope,
                            x1: traders[j].x,
                            x2: traders[i].y,
                            y1: -traders[i].x,
                            y2: -traders[j].y,
                            red: 0,
                            green: 255,
                            blue: 0,
                            angle
                        });
                    }
                }
            }
        }
        cb(connects);
    }

    const distAlong = (x, y, xSpeed, ySpeed) => {
        return (x * xSpeed + y * ySpeed) / Math.sqrt(xSpeed * xSpeed + ySpeed * ySpeed);
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
                    aim={t.ySpeed>=0 ? 180 - Math.atan(t.xSpeed/t.ySpeed)/Math.PI*180 : 180 - Math.atan(t.xSpeed/t.ySpeed)/Math.PI*180 + 180}
                >
                </Trader>
            )}
        </Suspense>,
        [context.floorId, context.isRunning, traders]);

    const ConnectionsCallback = useCallback(() =>
        <Suspense fallback={null}>
            {
                connections && connections.length && connections.map((c, j) =>
                    <line
                        key={j}
                        type={c.type}
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