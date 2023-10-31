import react, { useEffect, useRef, useState, useContext, useCallback, Suspense } from 'react';
import TradingContext from './TradingContext';

export const Trader = ({
    index,
    name = 'Trader-Joe',
    xSpeed,
    ySpeed,
    x,
    y,
    red = Math.random() * 255,
    green = Math.random() * 255,
    blue = Math.random() * 255,
    isGo,
    floorId,
    size=5,
    showDirection,
    isAlive,
    aim=0
}) => {

    const context = useContext(TradingContext);
    const [portfolio, setPortfolio] = useState({});
    const [cash, setCash] = useState(10000);
    const [myX,setMyX] = useState(x);
    const [myY,setMyY] = useState(y);
    const [myXspeed, setMyXspeed] = useState(xSpeed);
    const [myYspeed, setMyYspeed] = useState(ySpeed);
    const [myAim, setMyAim] = useState(aim);
    const [mySize, setMySize] = useState(size);
    const [myName, setMyName] = useState(name);

    const ref = useRef();

    useEffect(() => {
        if (name === 'Trader-Joe' || !red || !green || !blue) return;
        setMyX(x+xSpeed);
        setMyY(y+ySpeed);
        ref.current = {
            ...ref.current,
            name:myName,
            xSpeed: myXspeed,
            ySpeed: myYspeed,
            cash,
            setCash,
            x,
            y,
            red,
            green,
            blue,
            portfolio,
            setPortfolio,
            floorId,
            aim:myAim,
            size: mySize,
            magnitude: Math.sqrt(myXspeed*myXspeed+myYspeed*myYspeed),
            isAlive
        };
    },[]);
    
    useEffect(() => {
        if(Math.abs(myYspeed) > 0){
            console.log(myName + " ySpeed: ", myYspeed);
        }
    }, [myYspeed]);

    const Circle = () => (
        <circle
            ref={ref}
            key={ref.current.name}
            name={ref.current.name}
            aim={myAim}
            magnitude={Math.sqrt(myXspeed*myXspeed+myYspeed*myYspeed)}
            fill={`rgb(${ref.current.red},${ref.current.green},${ref.current.blue})`}
            stroke={`rgb(${ref.current.red * .5},${ref.current.green * .5},${ref.current.blue * .5})`}
            strokeWidth={.5}
            cx={`${myX}%`}
            cy={`${myY}%`}
            r={`${ref.current.size ? ref.current.size : 5}%`}
            transform={`rotate(${myAim?myAim:0},${myX?myX:0},${myY?myY:0})`}
        />
    );

    const Direction = () => (
        <>
            <polygon 
                points={
                    `${(myX?myX:0)+mySize*Math.cos(Math.PI)},${(myY?myY:0)} 
                    ${(myX?myX:0)},${(myY?myY:0)-mySize} 
                    ${(myX?myX:0)-mySize*Math.cos(Math.PI)},${(myY?myY:0)}`
                } 
                // stroke='salmon'
                fill={'plum'} 
                transform={`rotate(${myAim?myAim:0},${myX?myX:0},${myY?myY:0})`}
            />
            <line
                x1={`${myX}%`}
                x2={`${myX+myXspeed*10}%`}
                y1={`${myY}%`}
                y2={`${myY+myYspeed*10}%`}
                stroke={'red'}
            />
        </>
    );

    const CircleCallback = useCallback(() => {
        if(!ref.current) return <div/>;
        return (
            <Suspense fallback={null}>
                <Circle />
                <Direction />
            </Suspense>
        )
    },[ref]);

    return <CircleCallback />
}
