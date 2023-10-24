import React, { useState, Suspense, useCallback, useEffect } from 'react';
import TradingFloor from './TradingFloor';
import TradingContext from './TradingContext';
import { Trader } from './Trader';

export const Home = () => {
  const floorWidth = 90;
  const floorHeight = 90;
  const [isRunning, setIsRunning] = useState(false);
  const [nTraders, setNtraders] = useState(2);
  const [traders, setTraders] = useState([]);
  const [time,setTime]=useState(0);
  const [connections, setConnections]=useState([]);
  const [bounces, setBounces]=useState([]);
  const [podiums, setPodiums] = useState([]);
  const [tradingFloor,setTradingFloor] = useState(0);
  const [complete, setComplete] = useState(false);
  const [rando,setRando] = useState(Math.floor(Math.random()*10));
  const [floorId, setFloorId] = useState(Math.floor(Math.random()*100));
  const [floorCounter, setFloorCounter] = useState(0);
  const [traderCounter, setTraderCounter] = useState(0);
  const [intervalId,setIntervalId] = useState(0);

  useEffect(() => {
    console.log("H*H*H*H*H*H*H*H*H*H*H*H*H*H*H*H\nHOME\nH*H*H*H*H*H*H*H*H*H*H*H*H*H*H*H\nH: ", rando);
    getTraders(() => setComplete(true));
  }, []);

  useEffect(() => {
    if(isRunning) console.log("++++++++++++++++++++\n+ turning it on +\n++++++++++++++++++++");
    else console.log("--------------------\n- turning it off -\n--------------------")
  },[isRunning]);

  const getTraders = (cb) => {
    if(traders.length) return;
    let stageTraders = [];
    for (let i = 0; i < nTraders; i++) {
      stageTraders.push({
        name: `Trader-${i}`,
        isAlive: true,
        isIn: false,
        xSpeed: (Math.random()*2-1)/5,
        ySpeed: (Math.random()*2-1)/5,
        // xSpeed: .25,
        // ySpeed: .5,
        x: Math.random()*200-50,
        y: Math.random()*100,
        // x: 50,
        // y:50,
        red: Math.random()*255,
        green: Math.random()*255,
        blue: Math.random()*255,
        isGo: false
      });
    }
    setTraders(stageTraders);
    cb();
  }

  const TradingFloorCallback = useCallback(() => 
    <TradingFloor
      floorWidth={floorWidth}
      floorHeight={floorHeight}
      floorId={floorId}
    >
      {
        // console.log(`HwHwHwHwHwHwHwHwHwH\nrendering Trading Floor from without\nHwHwHwHwHwHwHwHwHwH\nH-${rando}\nF-${floorId}`)
      }
      </TradingFloor>
  ,
    [floorId]
  );

  return (
    <>
      <div
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: 0,
          width: `${floorWidth}vw`,
          height: `${floorHeight}vh`
        }}
      >
      <button onClick={() => setIsRunning(!isRunning)} >{isRunning ? 'STOP' : 'START'}</button>
        <TradingContext.Provider 
          value={{
            traders,setTraders,
            isRunning,
            time,setTime,
            connections,setConnections,
            bounces,setBounces,
            podiums,setPodiums,
            tradingFloor,setTradingFloor,
            rando,floorId,
            floorCounter,setFloorCounter,
            traderCounter,setTraderCounter,
            intervalId,setIntervalId
          }}
          >
          {complete &&
          <Suspense fallback={null}>
            <TradingFloorCallback />
          </Suspense>
        }
        </TradingContext.Provider>
      </div>
    </>
  );
}

export default Home;