import React, { Suspense, useCallback, useContext, useEffect, useRef, useState } from "react";
import TradingContext from "./TradingContext";
import PriceChart from "./PriceChart";
import { FormControl, InputLabel, MenuItem, Select, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { AutoGraph } from "@mui/icons-material";

export const ChartHousing = () => {
    const context = useContext(TradingContext);
    const [asset, setAsset] = useState({ assetName: "none" });
    const [periods, setPeriods] = useState(100);
    const [assetNames, setAssetNames] = useState([]);
    const [movingAverage1, setMovingAverage1] = useState(1);
    const [movingAverage2, setMovingAverage2] = useState(1);
    const [displayPrice, setDisplayPrice] = useState(true);
    const [displayValue, setDisplayValue] = useState(true);
    const [displayMovingAverages, setDisplayMovingAverages] = useState(true);
    const [displayType,setDisplayType] = useState('ohlc');

    const handleAssetSelection = event => {
        if(event.target.value.toLowerCase() === 'none') {
            setAsset({assetName:'none'});
        }
        else{
            setAsset(context.podiums.find(p => p.assetName === event.target.value));
        }
    }

    const handlePeriodSelection = event => {
        setPeriods(event.target.value);
    }

    const handleMovingAve1 = event => {
        setMovingAverage1(event.target.value);
    }

    const handleMovingAve2 = event => {
        setMovingAverage2(event.target.value);
    }

    const handleDisplayType = (event,newType) => {
        console.log("event: ", event);
        console.log("newType: ", newType);
        setDisplayType(newType);
    }

    const PriceChartCallback = useCallback(() => (
        <Suspense fallback={null}>
            {asset?.assetName?.toLowerCase() !== "none" &&
                <PriceChart 
                    asset={asset}
                    periods={periods}
                    isActive={context.isRunning}
                    movingAverage1={movingAverage1}
                    movingAverage2={movingAverage2}
                    displayPrice={displayPrice}
                    displayValue={displayValue}
                    displayMovingAverages={displayMovingAverages}
                    displayType={displayType}
                />
            }
        </Suspense>),
        [context.floorId, context.isRunning,asset.assetName,periods, movingAverage1,displayPrice,displayValue,displayMovingAverages,displayType]);

    return <div
            style={{marginTop: '1em'}}
        >
        {asset && assetNames &&
        <FormControl
            style={{minWidth: '5vw'}}
        >
            <InputLabel>Asset</InputLabel>
            <Select
                label='Asset'
                labelId="label"
                onChange={handleAssetSelection}
                value={asset.assetName}
            >
                <MenuItem value="none">
                <em>None</em>
                </MenuItem>
                {context.assetNames && context.assetNames.map((a, i) =>
                    <MenuItem key={i} value={a}>{a}</MenuItem>
                )}
            </Select>
        </FormControl>
        }
        <TextField label='Moving Average 1' onChange={handleMovingAve1} value={movingAverage1} />
        <TextField label='Moving Average 2' onChange={handleMovingAve2} value={movingAverage2} />
        <FormControl>
            <InputLabel>Periods</InputLabel>
            <Select
                value={periods}
                label='Periods'
                onChange={handlePeriodSelection}
            >
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={150}>150</MenuItem>
                <MenuItem value={200}>200</MenuItem>
                <MenuItem value={500}>500</MenuItem>
                <MenuItem value={1000}>1000</MenuItem>
                <MenuItem value={5000}>5000</MenuItem>
                <MenuItem value={10000}>10000</MenuItem>
            </Select>
        </FormControl>
        <ToggleButton
            value="prices"
            selected={displayPrice}
            onChange={() => setDisplayPrice(!displayPrice)}
        >
            <span>Price</span>
            <AutoGraph />
        </ToggleButton>
        <ToggleButton
            value="value"
            selected={displayValue}
            onChange={() => setDisplayValue(!displayValue)}
        >
        <span>Value</span>
            <AutoGraph />
        </ToggleButton>
        <ToggleButton
            value="ma"
            selected={displayMovingAverages}
            onChange={() => setDisplayMovingAverages(!displayMovingAverages)}
        >
        <span>MA</span>
            <AutoGraph />
        </ToggleButton>
        <ToggleButtonGroup
            exclusive
            onChange={handleDisplayType}
        >
            <ToggleButton
                value='ohlc'
                selected={displayType === 'ohlc'}
            >
                <span>OHLC</span>
                <AutoGraph />
            </ToggleButton>
            <ToggleButton
                value='line'
                selected={displayType === 'line'}
            >
                <span>Line</span>
                <AutoGraph />
            </ToggleButton>
        </ToggleButtonGroup>
            
        <PriceChartCallback />
    </div>
}

export default ChartHousing;