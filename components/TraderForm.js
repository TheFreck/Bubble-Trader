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
                    xSpeed: Math.sin((aim/360)*(2*Math.PI))*magnitude,
                    ySpeed: Math.cos((aim/360)*(2*Math.PI))*magnitude
                };
                context.createTrader(trader);
            }
            if(inputType === 'xy'){
                context.createTrader({x:parseFloat(x),y:parseFloat(y),xSpeed:parseFloat(xSpeed),ySpeed:parseFloat(ySpeed)});
            }
        handleFormClose();
    }

    const handleFormType = (event,type) => {
        console.log("handling form type: ", type);
        setInputType(type);
    }

    const handleFormUpdate = (event) => {
        switch(event.target.name){
            case 'Xpos':
                setX(event.target.value);
                break;
            case 'Ypos':
                setY(event.target.value);
                break;
            case 'Xspd':
                setXspeed(event.target.value);
                break;
            case 'Yspd':
                setYspeed(event.target.value);
                break;
            case 'Aim':
                setAim(event.target.value);
                break;
            case 'Mag':
                setMagnitude(event.target.value);
                break;
            default:
                break;
        }
    }

    const makeAim = (event,aim) => {
        // if(aim === null || aim === undefined) return;
        console.log("making aim: ", event.target);
        setAim(event.target.value);
    }

    const makeMagnitude = (event,mag) => {
        console.log("making magnitude: ", event.target);
        setMagnitude(event.target.value);
    }

    const makeX = (event,x) => {
        console.log("making x: ", event.target);
        setX(event.target.valuex);
    }

    const makeY = (event,y) => {
        console.log("making x: ", event.target);
        setX(event.target.value);
    }

    const makeXspeed = (event,xSpeed) => {
        console.log("making xSpeed: ", event.target);
        setXspeed(event.target.value);
    }
    
    const makeYspeed = (event,ySpeed) => {
        console.log("making Yspeed: ", event.target);
        setYspeed(event.target.value);
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
                    name="Xpos"
                    id="outlined-text"
                    label="X Position"
                    type="text"
                    value={x}
                    onChange={handleFormUpdate}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    name="Ypos"
                    id="outlined-text"
                    label="Y Position"
                    type="text"
                    value={y}
                    onChange={handleFormUpdate}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                {inputType === 'xy' &&
                    <TextField
                        id="outlined-text"
                        name="Xspd"
                        label='X Position'
                        type="text"
                        value={xSpeed}
                        onChange={handleFormUpdate}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                }
                
                {inputType === 'xy' &&
                <TextField
                    id="outlined-text"
                    name="Yspd"
                    label='Y Speed'
                    type="text"
                    value={ySpeed}
                    onChange={handleFormUpdate}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                }
                {inputType === 'aim' &&
                    <TextField
                        id="outlined-text"
                        name="Aim"
                        label="Aim"
                        type="text"
                        value={aim}
                        onChange={handleFormUpdate}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                }
                {inputType === 'aim' &&
                    <>
                        <Typography>Magnitude</Typography>
                        <Slider
                            name='Mag'
                            label='magnitude'
                            size='small'
                            defaultValue={0}
                            step={.001}
                            min={0}
                            max={1}
                            onChange={handleFormUpdate}
                        />
                    </>
                }
                <Button onClick={completeForm}>Done</Button>
            </FormGroup>
        </div>
    )
}

export default TraderForm;