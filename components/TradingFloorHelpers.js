export const TradingFloorHelpers = {
    a: .0125,
    b: 20,
    c: .0075,
    createWave: (asset) => {
        const magnitude = TradingFloorHelpers.getMagnitude();
        const duration = Math.floor(Math.random()*100);
        let wave = {
            magnitude,
            duration
        }
        asset.waves.push(wave);
        return asset.waves;
    },
    growAsset: (asset) => {
        const waves = TradingFloorHelpers.createWave(asset);
        let growth = 0;
        for(let wave of waves){
            let growthCycle =  TradingFloorHelpers.getGrowthCycle(wave.duration/20);
            growth += wave.magnitude * growthCycle;
        }
        asset.value += growth;
        return asset;
    },
    getMagnitude: () => {
        let randy = Math.random();
        let mag = Math.atan(-TradingFloorHelpers.b*(1+TradingFloorHelpers.c))-TradingFloorHelpers.a;
        return Math.tan(randy * mag - TradingFloorHelpers.a)/TradingFloorHelpers.b+TradingFloorHelpers.c;
    },
    getGrowthCycle: (period) => {
        // marginal growth curve
        let cycle = Math.pow(period,1/period)/Math.pow(period,period);
        return cycle;
    }
}