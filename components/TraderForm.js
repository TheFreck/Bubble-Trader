import React, { useState, Suspense, useCallback, useEffect, useRef, useContext } from 'react';
import { TextField, Button, FormControlLabel, FormGroup, FormLabel, Grid, Radio, RadioGroup, ToggleButton, ToggleButtonGroup, Slider, Typography } from "@mui/material";
import TradingContext from './TradingContext';
import ExploreIcon from '@mui/icons-material/Explore';
import FunctionsIcon from '@mui/icons-material/Functions';

export const TraderForm = ({handleFormClose}) => {
    const objectTypes = {
        trader: "trader",
        asset: "asset",
    }
    const context = useContext(TradingContext);
    const [objectType, setObjectType] = useState("");
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [xSpeed, setXspeed] = useState(0);
    const [ySpeed, setYspeed] = useState(0);
    const [inputType, setInputType] = useState('aim');
    const [aim,setAim] = useState(0);
    const [magnitude, setMagnitude] = useState(0);
    const formRef = useRef();

    const completeForm = () => {
            if(inputType === 'aim'){
                let trader = {
                    x: parseFloat(x),
                    y: parseFloat(y),
                    xSpeed: Math.sin((aim/360)*(2*Math.PI)),
                    ySpeed: Math.cos((aim/360)*(2*Math.PI))
                };
                context.createTrader(trader);
            }
            if(inputType === 'xy'){
                context.createTrader({x:parseFloat(x),y:parseFloat(y),xSpeed:parseFloat(xSpeed),ySpeed:parseFloat(ySpeed)});
            }
        handleFormClose();
    }

    const handleFormType = (event,type) => {
        setInputType(type);
    }

    const makeAim = (event,aim) => {
        console.log("making aim: ", aim);
        setAim(aim);
    }

    const makeMagnitude = (event,mag) => {
        console.log("making magnitude: ", mag);
        setMagnitude(mag);
    }

    return (
        <div ref={formRef}
            style={{
                width: '30vw',
                marginLeft: '5vw'
            }}
        >

            <FormGroup>
                {/* <FormLabel>Object Type</FormLabel>
                <RadioGroup
                    row
                    name='object-type'
                >
                    <FormControlLabel 
                        checked={objectType === objectTypes.trader} 
                        onChange={() => setObjectType(objectTypes.trader)}
                        value={objectTypes.trader}
                        control={<Radio />} 
                        label='Trader' 
                    />
                    <FormControlLabel 
                        checked={objectType === objectTypes.asset} 
                        onChange={() => setObjectType(objectTypes.asset)}
                        value={objectTypes.asset} 
                        control={<Radio />} 
                        label='Asset' 
                    />
                </RadioGroup> */}
                <ToggleButtonGroup
                    value={inputType}
                    exclusive
                    onChange={handleFormType}
                >
                    <ToggleButton value='aim'><ExploreIcon /></ToggleButton>
                    <ToggleButton value='xy'><FunctionsIcon /></ToggleButton>
                </ToggleButtonGroup>
                    
                <TextField
                    id="outlined-text"
                    label="X Position"
                    type="text"
                    value={x}
                    onChange={event => setX(event.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    id="outlined-text"
                    label="Y Position"
                    type="text"
                    value={y}
                    onChange={event => setY(event.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                {inputType === 'xy' &&
                    <TextField
                        id="outlined-text"
                        label="X Speed"
                        type="text"
                        value={xSpeed}
                        onChange={event => setXspeed(event.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                }
                
                {inputType === 'xy' &&
                <TextField
                    id="outlined-text"
                    label="Y Speed"
                    type="text"
                    value={ySpeed}
                    onChange={event => setYspeed(event.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                }
                {inputType === 'aim' &&
                    <>
                        <Typography>AIM in degrees</Typography>
                        <Slider
                            label='AIM in degrees'
                            size='small'
                            defaultValue={0}
                            step={1}
                            min={0}
                            max={360}
                            onChange={makeAim}
                        />
                    </>
                }
                {inputType === 'aim' &&
                    <>
                        <Typography>Magnitude</Typography>
                        <Slider
                            label='magnitude'
                            size='small'
                            defaultValue={0}
                            step={.001}
                            min={0}
                            max={1}
                            onChange={makeMagnitude}
                        />
                    </>
                }
                <Button onClick={completeForm}>Done</Button>
            </FormGroup>
        </div>
    )
}

export default TraderForm;