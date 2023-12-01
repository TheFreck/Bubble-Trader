export const TradingFloorHelpers = {
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
        for(let i=0; i<waves.length; i++){
            let growthCycle =  TradingFloorHelpers.getGrowthCycle(waves[i].duration/20)/100;
            // console.log("growthCycle: ", growthCycle);
            growth += waves[i].magnitude * growthCycle;
            waves[i].duration--;
        }
        asset.waves = waves.filter(w => w.duration > 0);
        // console.log("growth: ", growth);
        asset.value *= 1+growth;
        return asset;
    },
    getMagnitude: () => {
        let randy = Math.random();
        let a = .01;
        let b = 100000;
        let c = .00005;
        let mag = Math.atan(-b*(1+c))-a;
        return Math.tan(randy * mag - a)/b+c;
    },
    getGrowthCycle: (period) => {
        // marginal growth curve
        let cycle = Math.pow(period,1/period)/Math.pow(period,period);
        return cycle;
    }
}

export default TradingFloorHelpers;