import react, { useEffect, useRef, useState, useContext, useCallback } from 'react';
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
    size,
    showDirection
}) => {

    const context = useContext(TradingContext);
    const [portfolio, setPortfolio] = useState({});
    const [cash, setCash] = useState(10000);
    const [myX,setMyX] = useState(x);
    const [myY,setMyY] = useState(y);

    const ref = useRef();

    useEffect(() => {
        if (name === 'Trader-Joe') return;
        setMyX(x+xSpeed);
        setMyY(y+ySpeed);
        ref.current = {
            ...ref.current,
            name,
            xSpeed,
            ySpeed,
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
            size
        };
    },[]);

    const Circle = () => <circle
        ref={ref}
        key={ref.current.name}
        name={ref.current.name}
        fill={`rgb(${ref.current.red},${ref.current.green},${ref.current.blue})`}
        stroke={`rgb(${ref.current.red * .5},${ref.current.green * .5},${ref.current.blue * .5})`}
        strokeWidth={.5}
        cx={`${myX}%`}
        cy={`${myY}%`}
        r={`${ref.current.size}%`}
    />

    const Direction = () => <line x1={myX} y1={myY} x2={myX+xSpeed*100} y2={myY+ySpeed*100} stroke={'red'} />

    const CircleCallback = useCallback(() => {
        if(!ref.current) return <div/>;
        return (
            <>
                <Circle />
                <Direction />
            </>

        )
    },[ref]);

    return <CircleCallback />
}
