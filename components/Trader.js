import react, { useEffect, useRef, useState, useContext, useCallback, Suspense } from 'react';
import TradingContext from './TradingContext';

export const Trader = ({
    name = 'Trader-Joe',
    xSpeed,
    ySpeed,
    x,
    y,
    red = Math.random() * 255,
    green = Math.random() * 255,
    blue = Math.random() * 255,
    floorId,
    size=5,
    isAlive,
    aim=0
}) => {

    const context = useContext(TradingContext);
    const [portfolio, setPortfolio] = useState({});
    const [cash, setCash] = useState(10000);
    const [myX,setMyX] = useState(x);
    const [myY,setMyY] = useState(y);
    const [myXspeed, setMyXspeed] = useState(xSpeed ? xSpeed : 0);
    const [myYspeed, setMyYspeed] = useState(ySpeed ? ySpeed : 0);
    const [myAim, setMyAim] = useState(aim);
    const [mySize, setMySize] = useState(size);
    const [myName, setMyName] = useState(name);
    const [myRed,setMyRed] = useState(red);
    const [myGreen, setMyGreen] = useState(green);
    const [myBlue, setMyBlue] = useState(blue);

    const ref = useRef();

    useEffect(() => {
        if (name === 'Trader-Joe' || !red || !green || !blue) return;
        console.log(myName);
    },[]);

    const Circle = () => (
        <circle
            key={myName}
            name={myName}
            aim={myAim}
            xspeed={myXspeed}
            yspeed={myYspeed}
            magnitude={Math.sqrt(myXspeed*myXspeed+myYspeed*myYspeed)}
            fill={`rgb(${myRed},${myGreen},${myBlue})`}
            stroke={`rgb(${myRed * .5},${myGreen * .5},${myBlue * .5})`}
            strokeWidth={.5}
            cx={`${myX}%`}
            cy={`${myY}%`}
            r={`${mySize ? mySize : 5}%`}
            transform={`rotate(${myAim?myAim:0},${myX?myX:0},${myY?myY:0})`}
        />
    );

    const Direction = () => (
        <>
            {(myXspeed > 0 
            || myYspeed > 0 
            || myXspeed < 0
            || myYspeed < 0)
            &&
             <polygon 
                points={
                    `${(myX?myX:0)+mySize*Math.cos(Math.PI)},${(myY?myY:0)} 
                    ${(myX?myX:0)},${(myY?myY:0)-mySize} 
                    ${(myX?myX:0)-mySize*Math.cos(Math.PI)},${(myY?myY:0)}`
                } 
                fill={'plum'} 
                transform={`rotate(${myAim?myAim:0},${myX?myX:0},${myY?myY:0})`}
            />
            }

            <line
                x1={`${myX}%`}
                x2={`${myX+myXspeed*10}%`}
                y1={`${myY}%`}
                y2={`${myY+myYspeed*10}%`}
                stroke={'red'}
            />
        </>
    );

    return (
        <Suspense fallback={null}>
            <Circle />
            <Direction />
        </Suspense>
    )
}
