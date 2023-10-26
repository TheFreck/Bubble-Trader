import React, { useContext, useEffect, useRef, useState } from "react";
import TradingContext from "./TradingContext";

export const Diamond = ({points,slopes}) => {
    const ref = useRef({points,slopes});
    if(!points.length || !slopes.length) return;

    return (
    <polygon 
        ref={ref}
        points={
            `${points[0].x},${points[0].y} 
            ${points[1].x},${points[1].y} 
            ${points[2].x},${points[2].y} 
            ${points[3].x},${points[3].y}`
        }
        fill={'green'}
    />
    );
}