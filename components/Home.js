import React, { useState, Suspense, useCallback, useEffect } from 'react';
import TradingFloor from './TradingFloor';
import TradingContext from './TradingContext';
import { Trader } from './Trader';

export const Home = () => {
  const floorWidth = 90;
  const floorHeight = 90;
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(0);
  const [nTraders, setNtraders] = useState(1);
  const [traders, setTraders] = useState([]);
  const [traderPlaceHolders, setTraderPlaceHolders] = useState([]);
  const [time,setTime]=useState(0);
  const [connections, setConnections]=useState([]);
  const [bounces, setBounces]=useState([]);
  const [podiums, setPodiums] = useState([]);

  useEffect(() => {
    getTraders();
  }, []);

  useEffect(() => {
    console.log("trader updated: ", traders);
  },[traders]);

  useEffect(() => {
  },[isRunning]);

  const getTraders = () => {
    if(traders.length) return;
    let stageTraders = [];
    for (let i = 0; i < nTraders; i++) {
      stageTraders.push(`Trader-${i}`);
    }
    setTraderPlaceHolders(stageTraders);
  }

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
              intervalId,setIntervalId,
              isRunning,setIsRunning,
              time,setTime,
              connections,setConnections,
              bounces,setBounces,
              podiums,setPodiums
            }}
          >
          <Suspense fallback={null}>
          <TradingFloor
            floorWidth={floorWidth}
            floorHeight={floorHeight}
            traderPlaceHolders={traderPlaceHolders}
          />
          </Suspense>
        </TradingContext.Provider>
      </div>
    </>
  );
}

export default Home;