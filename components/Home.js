import React, { useState, Suspense, useCallback, useEffect, useRef } from 'react';
import TradingFloor from './TradingFloor';
import TradingContext from './TradingContext';
import HomeHelpers from './HomeHelpers';
import { Accordion, AccordionDetails, AccordionSummary, Button, Modal, Typography } from '@mui/material';
import TraderForm from './TraderForm';
import ChartHousing from './ChartHousing';
import { ExpandMore } from '@mui/icons-material';

export const Home = () => {
  const floorWidth = 100;
  const floorHeight = 100;
  const [isRunning, setIsRunning] = useState(false);
  const [nTraders, setNtraders] = useState(75);
  const [traders, setTraders] = useState([]);
  const [traderSize, setTraderSize] = useState(1);
  const [time, setTime] = useState(0);
  const [connections, setConnections] = useState([]);
  const [bounces, setBounces] = useState([]);
  const [nAssets, setNassets] = useState(2);
  const [podiums, pushPodiums] = useState([]);
  const [tradingFloor, setTradingFloor] = useState(0);
  const [tradersComplete, setTradersComplete] = useState(false);
  const [assetsComplete, setAssetsComplete] = useState(false);
  const [rando, setRando] = useState(Math.floor(Math.random() * 10));
  const [floorId, setFloorId] = useState(Math.floor(Math.random() * 100));
  const [floorCounter, setFloorCounter] = useState(0);
  const [traderCounter, setTraderCounter] = useState(0);
  const [manualTradersOn, setManualTradersOn] = useState(false);
  const [traderFormOpen, setTraderFormOpen] = useState(false);
  const [displayChart, setDisplayChart] = useState(true);
  const [assetNames, setAssetNames] = useState([]);
  const [tradersIntervalId, setTradersIntervalId] = useState(0);
  const [chartIntervalId, setChartIntervalId] = useState(0);
  const handleFormOpen = () => setTraderFormOpen(true);
  const handleFormClose = () => setTraderFormOpen(false);
  const [marketEnergy, setMarketEnergy] = useState(1.1);
  const tradersRef = useRef();

  const setPodiums = (pod) => {
    // console.log("update pod: ", pod);
    pod.xMid = (pod.right-pod.left)/2+pod.left;
    pod.yMid = (pod.bottom-pod.top)/2+pod.top;
    pushPodiums([...podiums.filter(p => p.assetName !== pod.assetName),pod]);
  }

  

  useEffect(() => {
    // console.log("H*H*H*H*H*H*H*H*H*H*H*H*H*H*H*H\nHOME\nH*H*H*H*H*H*H*H*H*H*H*H*H*H*H*H\nH: ", rando);
    HomeHelpers.getAssets(nAssets, (pods) => {
      pushPodiums(pods);
      const podNames = [];
      for (let pod of pods) {
        podNames.push(pod.assetName);
      }
      setAssetNames(podNames);
      setAssetsComplete(true);
      HomeHelpers.getTraders(pods, manualTradersOn ? 0 : nTraders, traderSize, (trdrs) => {
        for (let i = 0; i < trdrs.length; i++) {
          for (let j = 0; j < trdrs.length; j++) {
            if (i === j) continue;
            let dist = Math.sqrt(Math.pow(trdrs[i].y - trdrs[j].y, 2) + Math.pow(trdrs[i].x - trdrs[j].x, 2));
          }
        }
        for(let trdr of trdrs){
          for(let pod of pods){
            trdr.portfolio[pod.assetName] = 0;
          }
        }
        setTraders(trdrs);
        tradersRef.current = trdrs;
        setTradersComplete(true);
      });
    });
  }, [manualTradersOn]);

  const createTrader = ({ x, y, xSpeed, ySpeed }) => {
    setTraders([...traders, {
      name: 'Trader-' + traders.length,
      xSpeed,
      ySpeed,
      x,
      y,
      floorId,
      isAlive: true,
      red: 99,
      green: 56,
      blue: 99,
      size: traderSize,
      isGo: false
    }])
  }


  useEffect(() => {
    if (isRunning) console.log("++++++++++++++++++++\n+ turning it on +\n++++++++++++++++++++");
    else console.log("--------------------\n- turning it off -\n--------------------")
  }, [isRunning]);

  const TradingFloorCallback = useCallback(() =>
    <TradingFloor
      floorWidth={floorWidth}
      floorHeight={floorHeight}
      floorId={floorId}
    />
    ,
    [floorId, traders]
  );

  const PriceChartCallback = useCallback(() =>
    <ChartHousing />
    ,
    [floorId, displayChart]
  )

  return (
    <>
      <div
      >
        <Button onClick={() => setTraderFormOpen(!traderFormOpen)}>Create Trader</Button>
        <Button onClick={() => setIsRunning(!isRunning)} >{isRunning ? 'STOP' : 'START'}</Button>
        <Button onClick={() => setManualTradersOn(!manualTradersOn)} >{manualTradersOn ? 'MANUAL' : 'AUTO CREATE'}</Button>
        <TradingContext.Provider
          value={{
            createTrader,
            traders, setTraders,
            isRunning, setIsRunning,
            time, setTime,
            connections, setConnections,
            bounces, setBounces,
            podiums, setPodiums,
            tradingFloor, setTradingFloor,
            rando, floorId,
            floorCounter, setFloorCounter,
            traderCounter, setTraderCounter,
            intervalId: tradersIntervalId, setIntervalId: setTradersIntervalId,
            floorHeight, floorWidth,
            assetNames,
            chartIntervalId, setChartIntervalId,
            traderSize,
            marketEnergy, setMarketEnergy
          }}
        >
          <Modal
            open={traderFormOpen}
            onClose={handleFormClose}
            style={{ background: 'white' }}
          >
            <div><TraderForm
              handleFormClose={handleFormClose}
            /></div>
          </Modal>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
            >
              <Typography>Trading Floor</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {tradersComplete && assetsComplete &&
                <Suspense fallback={null}>
                  <TradingFloorCallback />
                </Suspense>
              }
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
            >
              <Typography>Price Chart</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {displayChart &&
                <Suspense fallback={null}>
                  <PriceChartCallback />
                </Suspense>
              }
            </AccordionDetails>
          </Accordion>
        </TradingContext.Provider>
      </div>
    </>
  );
}

export default Home;