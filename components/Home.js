import React, { useState, Suspense, useCallback, useEffect, useRef } from 'react';
import TradingFloor from './TradingFloor';
import TradingContext from './TradingContext';
import HomeHelpers from './HomeHelpers';
import { Button, Modal } from '@mui/material';
import TraderForm from './TraderForm';

export const Home = () => {
  const floorWidth = 90;
  const floorHeight = 90;
  const [isRunning, setIsRunning] = useState(false);
  const [nTraders, setNtraders] = useState(5);
  const [traders, setTraders] = useState([]);
  const [time,setTime]=useState(0);
  const [connections, setConnections]=useState([]);
  const [bounces, setBounces]=useState([]);
  const [nAssets, setNassets] = useState(0);
  const [podiums, setPodiums] = useState([]);
  const [tradingFloor,setTradingFloor] = useState(0);
  const [tradersComplete, setTradersComplete] = useState(false);
  const [assetsComplete, setAssetsComplete] = useState(false);
  const [rando,setRando] = useState(Math.floor(Math.random()*10));
  const [floorId, setFloorId] = useState(Math.floor(Math.random()*100));
  const [floorCounter, setFloorCounter] = useState(0);
  const [traderCounter, setTraderCounter] = useState(0);
  const [intervalId,setIntervalId] = useState(0);
  const [manualTradersOn, setManualTradersOn] = useState(true);
  const [traderFormOpen, setTraderFormOpen] = useState(false);
  const handleFormOpen = () => setTraderFormOpen(true);
  const handleFormClose = () => setTraderFormOpen(false);
  const tradersRef = useRef();

  useEffect(() => {
    console.log("H*H*H*H*H*H*H*H*H*H*H*H*H*H*H*H\nHOME\nH*H*H*H*H*H*H*H*H*H*H*H*H*H*H*H\nH: ", rando);
    HomeHelpers.getAssets(nAssets,(pods) => {
      setPodiums(pods);
      setAssetsComplete(true);
      HomeHelpers.getTraders(pods,manualTradersOn ? 0 : nTraders,(trdrs) => {
        for(let i=0; i<trdrs.length; i++){
          for(let j=0; j<trdrs.length; j++){
            if(i===j) continue;
            let dist = Math.sqrt(Math.pow(trdrs[i].y-trdrs[j].y,2)+Math.pow(trdrs[i].x-trdrs[j].x,2));
          }
        }
        setTraders(trdrs);
        tradersRef.current = trdrs;
        setTradersComplete(true);
      });
    });
  }, []);
  
  const createTrader = ({x,y,xSpeed,ySpeed}) => {
    setTraders([...traders,{
      name: 'Trader-' + traders.length,
      xSpeed,
      ySpeed,
      x,
      y,
      floorId,
      isAlive: true,
      isIn: false,
      red:99,
      green: 56,
      blue: 99,
      size: 5,
      isGo: false
    }])
  }

  useEffect(() => {
    if(isRunning) console.log("++++++++++++++++++++\n+ turning it on +\n++++++++++++++++++++");
    else console.log("--------------------\n- turning it off -\n--------------------")
  },[isRunning]);

  const TradingFloorCallback = useCallback(() => 
    <TradingFloor
      floorWidth={floorWidth}
      floorHeight={floorHeight}
      floorId={floorId}
    />
  ,
    [floorId,traders]
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
          <Button onClick={() => setTraderFormOpen(!traderFormOpen)}>Create Trader</Button>
          <Button onClick={() => setIsRunning(!isRunning)} >{isRunning ? 'STOP' : 'START'}</Button>
        <TradingContext.Provider 
          value={{
            createTrader,
            traders,setTraders,
            isRunning,setIsRunning,
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
          <Modal
            open={traderFormOpen}
            onClose={handleFormClose}
            style={{ background: 'white'}}
          >
           <div><TraderForm
            handleFormClose={handleFormClose}
           /></div>
          </Modal>
          {tradersComplete && assetsComplete &&
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