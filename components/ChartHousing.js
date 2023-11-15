import React, { Suspense, useCallback, useContext, useEffect, useRef, useState } from "react";
import TradingContext from "./TradingContext";
import PriceChart from "./PriceChart";
import { FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";

export const ChartHousing = () => {
    const context = useContext(TradingContext);
    const [asset, setAsset] = useState({ assetName: "none" });
    const [periods, setPeriods] = useState(100);
    const [assetNames, setAssetNames] = useState([]);
    const [movingAverage, setMovingAverage] = useState(1);

    const handleAssetSelection = event => {
        if(event.target.value.toLowerCase() === 'none') {
            setAsset({assetName:'none'});
        }
        else{
            console.log("set asset: ", event.target.value);
            console.log("context podiums: ", context.podiums);
            for(let pod of context.podiums){
                console.log("podname: ", pod.assetName);
            }
            setAsset(context.podiums.find(p => p.assetName === event.target.value));
        }
    }

    const handlePeriodSelection = event => {
        setPeriods(event.target.value);
    }

    const handleMovingAve = event => {
        setMovingAverage(event.target.value);
    }

    const PriceChartCallback = useCallback(() => (
        <Suspense fallback={null}>
            {asset?.assetName?.toLowerCase() !== "none" &&
                <PriceChart 
                    asset={asset}
                    periods={periods}
                    isActive={context.isRunning}
                    movingAverage={movingAverage}
                />
            }
        </Suspense>),
        [context.floorId, context.isRunning,asset.assetName,periods, movingAverage]);

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
        <TextField label='Moving Average' onChange={handleMovingAve} value={movingAverage} />
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
            
        <PriceChartCallback />
    </div>
}

export default ChartHousing;