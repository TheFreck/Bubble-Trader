import react, { Suspense, useEffect, useRef, useState, useContext, useCallback } from 'react';
import { Trader } from './Trader';
import TradingContext from './TradingContext';
import Podium from './Podium';

export const TradingFloor = (props) => {
    const { floorWidth, floorHeight, floorId } = props;
    const context = useContext(TradingContext);
    const [traders, setTraders] = useState(context.traders);
    const [militicks, setMiliticks] = useState(.1);
    const [connections, setConnections] = useState([]);
    const [slowing, setSlowing] = useState(1);
    const floorRef = useRef();

    useEffect(() => {
        floorRef.current.name = `Floor-${floorId}`;
        findConnections((con) => {
            setConnections(con);
        })
    }, []);

    useEffect(() => {
        if (context.isRunning) {
            if (!context.tradersIntervalId) {
                let intId = setInterval(march, militicks);
                floorRef.current.intId = intId;
                console.log("traders interval id: ", intId);
                context.setIntervalId(intId);
            }
        }
        else {
            clearInterval(floorRef.current.intId);
            context.setIntervalId(0);
            console.log("clearing traders interval id: ", context.tradersIntervalId);
        }
    }, [context.isRunning]);

    const getBounceAngle = (normal,xSp,ySp) => {
        let aim = getAim(xSp,ySp);
        let aimAdjustment = (normal-aim);
        return (aim + aimAdjustment)%360;
    }
    
    const march = () => {
        const trs = [];
        findConnections(pos => {
            setConnections(pos);
            for(let trader of context.traders){
                let newXspeed = trader.xSpeed*slowing;
                let newYspeed = trader.ySpeed*slowing;
                let normal = pos.find(p => p.name === trader.name && p.type === 'normal');
                if (pos.length && normal) {
                    for(let po of pos){
                        if(po.name !== trader.name) continue;
                        let dist = Math.sqrt(Math.pow(normal.x1-normal.x2,2)+Math.pow(normal.y1-normal.y2,2));
                        let normalAngle = po.angle;
                        if(isNaN(trader.aim)) {
                            trader.aim = -normalAngle;
                        }
                        trader.aim = getBounceAngle(normalAngle, trader.xSpeed, trader.ySpeed);
                        let aimRadians = (((trader.aim)/360)*2*Math.PI)%(Math.PI*2);
                        let magnitude = (normal.myMagnitude+normal.theirMagnitude)/2;
                        if(magnitude === 0) continue;
                        let aimSin = Math.round(Math.sin(aimRadians)*100)/100;
                        newXspeed = -(Math.floor(aimSin * magnitude*100)*slowing)/100;
                        let aimCos = Math.round(Math.cos(aimRadians)*100)/100;
                        newYspeed = -(Math.floor(-aimCos * magnitude*100)*slowing)/100;
                        dist = Math.sqrt(Math.pow(normal.x1-normal.x2,2)+Math.pow(normal.y1-normal.y2,2));
                        trader.xSpeed = newXspeed;
                        trader.ySpeed = newYspeed;
                        trader.x = normal.x2 - newXspeed;
                        trader.y = normal.y2 - newYspeed;
                    }
                }
                trader.xSpeed = newXspeed;
                trader.ySpeed = newYspeed;
                trader.x += trader.xSpeed;
                trader.y += trader.ySpeed;
                trs.push(trader);
            }
            for (let trader of trs) {
                move(trader);
            }
            setTraders(trs);
        });
        context.setTraders(traders);
    };

    const move = (trader) => {
        if (!trader.isAlive || (!trader.xSpeed && !trader.ySpeed)) return;
        trader.aim = getAim(trader.xSpeed,trader.ySpeed);
        // Podiums
        for (let podium of context.podiums) {
            // podium left
            if (trader.x + trader.size >= podium.left
                && trader.x + trader.size <= podium.left + trader.size*2+1
                && trader.y >= podium.top - 1
                && trader.y <= podium.bottom + 1
                && trader.xSpeed > 0) {
                trader.xSpeed *= -1;
                let shares = 100;
                if(Math.random() >= .5){
                    let buy = podium.buy(trader,shares);
                    if(buy.status){
                        trader.portfolio[podium.name] = trader.portfolio[podium.name] ? trader.portfolio[podium.name] + shares : shares;
                        trader.cash -= buy.cash;
                    }
                }
                else {
                    let sell = podium.sell(trader,100);
                    if(sell.status) {
                        trader.portfolio[podium.name] -= shares;
                        trader.cash += sell.cash;
                    }
                }
            }
            // podium right
            if (trader.x - trader.size <= podium.right
                && trader.x - trader.size >= podium.right - trader.size*2+1
                && trader.y >= podium.top - 1
                && trader.y <= podium.bottom + 1
                && trader.xSpeed < 0) {
                trader.xSpeed *= -1;
                let shares = 100;
                if(Math.random() >= .5){
                    let buy = podium.buy(trader,shares);
                    if(buy.status){
                        trader.portfolio[podium.name] = trader.portfolio[podium.name] ? trader.portfolio[podium.name] + shares : shares;
                        trader.cash -= buy.cash;
                    }
                }
                else {
                    let sell = podium.sell(trader,100);
                    if(sell.status) {
                        trader.portfolio[podium.name] -= shares;
                        trader.cash += sell.cash;
                    }
                }
            }
            // podium top
            if (trader.y + trader.size >= podium.top
                && trader.y + trader.size <= podium.top + trader.size*2+1
                && trader.x >= podium.left - 1
                && trader.x <= podium.right + 1
                && trader.ySpeed > 0) {
                trader.ySpeed *= -1;
                let shares = 100;
                if(Math.random() >= .5){
                    let buy = podium.buy(trader,shares);
                    if(buy.status){
                        trader.portfolio[podium.name] = trader.portfolio[podium.name] ? trader.portfolio[podium.name] + shares : shares;
                        trader.cash -= buy.cash;
                    }
                }
                else {
                    let sell = podium.sell(trader,100);
                    if(sell.status) {
                        trader.portfolio[podium.name] -= shares;
                        trader.cash += sell.cash;
                    }
                }
            }
            // podium bottom
            if (trader.y - trader.size <= podium.bottom
                && trader.y - trader.size >= podium.bottom - trader.size*2+1
                && trader.x >= podium.left - 1
                && trader.x <= podium.right + 1
                && trader.ySpeed < 0) {
                trader.ySpeed *= -1;
                let shares = 100;
                if(Math.random() >= .5){
                    let buy = podium.buy(trader,shares);
                    if(buy.status){
                        trader.portfolio[podium.name] = trader.portfolio[podium.name] ? trader.portfolio[podium.name] + shares : shares;
                        trader.cash -= buy.cash;
                    }
                }
                else {
                    let sell = podium.sell(trader,100);
                    if(sell.status) {
                        trader.portfolio[podium.name] -= shares;
                        trader.cash += sell.cash;
                    }
                }
            }
        }
        // Walls
        if (trader.x - trader.size/2 <= -50 || trader.x + trader.size/2 >= 150) {
            trader.xSpeed *= -1;
            trader.x += 2*trader.xSpeed;
        }
        if (trader.y - trader.size/2 <= 1 || trader.y + trader.size/2 >= 99) {
            trader.ySpeed *= -1;
            trader.y += 2*trader.ySpeed;
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
                if(traders[i].name === traders[j].name) continue;
                let xDist = Math.pow(traders[i].x+traders[i].xSpeed - traders[j].x+traders[j].xSpeed, 2);
                let yDist = Math.pow(traders[i].y+traders[i].ySpeed - traders[j].y+traders[j].ySpeed, 2);
                let dist = Math.sqrt(xDist + yDist);
                let tri = traders[i];
                let trj = traders[j];
                let xsa = tri.xSpeed;
                let ysa = tri.ySpeed;
                let xsb = trj.xSpeed;
                let ysb = trj.ySpeed;
                let xspa = Math.pow(xsa,2);
                let yspa = Math.pow(ysa,2);
                let xspb = Math.pow(xsb,2);
                let yspb = Math.pow(ysb,2);
                let myMagnitude = Math.sqrt(xspa+yspa);
                let theirMagnitude = Math.sqrt(xspb+yspb);
                if (dist < 5) {
                    let normalAngle = getAim(traders[j].x-traders[i].x,traders[j].y-traders[i].y);
                    connects.push({
                        name: traders[i].name,
                        other: traders[j].name,
                        type: 'normal',
                        x1: traders[j].x-traders[j].xSpeed,
                        x2: traders[i].x-traders[i].xSpeed,
                        y1: traders[j].y-traders[j].ySpeed,
                        y2: traders[i].y-traders[i].ySpeed,
                        red: 255,
                        green: 0,
                        blue: 0,
                        angle: normalAngle,
                        myMagnitude,
                        theirMagnitude
                    });
                }
            }
        }
        andOut = cb(connects);
        return andOut;
    }

    const getAim = (xSpeed,ySpeed) => {
        let aim = 0;
        if(xSpeed === 0 && ySpeed === 0){
            return 0;
        }
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
        return Math.floor(aim*100)/100;
    }

    const PodiumCallback = useCallback(() => 
        context.podiums && context.podiums.map((p,i) => 
            <Podium 
                key={i}
                name={p.name}
                shareQty={p.shareQty}
                startingPrice={p.startingPrice}
                top={p.top}
                bottom={p.bottom}
                left={p.left}
                right={p.right}
            />
        ),
        [context.traders]
    )

    const TraderCallback = useCallback(() => {
        return <Suspense fallback={null} key={"suspense-"}>
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
                    isGo={context.isRunning}
                    floorId={floorId}
                    size={t.size}
                    isAlive={t.isAlive}
                    aim={getAim(t.xSpeed,t.ySpeed)}
                    cash={t.cash}
                    portfolio={t.portfolio}
                >
                    {/* {console.log(`${JSON.parse(JSON.stringify(t.name))} x: ${JSON.parse(JSON.stringify(t.x))}; y: ${JSON.parse(JSON.stringify(t.y))}`)} */}
                </Trader>
            )}
        </Suspense>
        },
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
        </Suspense>,
        [connections]);

    return (
        <div
            ref={floorRef}
        >
            <svg
                viewBox={`0 0 100 100`}
                width={`${floorWidth/6}vw`}
                height={`${floorHeight/4.2}vh`}
                xmlns="http://www.w3.org/2000/svg"
                style={{ background: 'gray' }}
            >
                <PodiumCallback />
                <TraderCallback />
                <ConnectionsCallback />
            </svg>
        </div>
    )
}

export default TradingFloor;