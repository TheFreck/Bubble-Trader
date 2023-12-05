export const TradingFloorHelpers = {
    createWave: (asset) => {
        const magnitude = TradingFloorHelpers.getMagnitude();
        const duration = Math.floor(Math.random()*1000);
        let wave = {
            magnitude,
            duration
        }
        asset.waves.push(wave);
        console.log("creating waves: ", wave);
        console.log("asset waves: ", asset.waves);
        return asset.waves;
    },
    growAsset: (asset) => {
        let growth = 0;
        for(let i=0; i<asset.waves.length; i++){
            let growthCycle =  TradingFloorHelpers.getGrowthCycle(asset.waves[i].duration/200)/20;
            growth += asset.waves[i].magnitude * growthCycle;
            asset.waves[i].duration--;
        }
        console.log("growing asset: ", growth);
        asset.waves = asset.waves.filter(w => w.duration > 0);
        asset.value *= 1+growth;
        return asset;
    },
    getMagnitude: () => {
        let randy = Math.random();
        let a = .01;
        let b = 1000;
        let c = .003;
        let mag = Math.atan(-b*(1+c))-a;
        console.log("mag: ", mag);
        return Math.tan(randy * mag - a)/b+c;
    },
    getGrowthCycle: (period) => {
        // marginal growth curve
        let cycle = Math.pow(period,1/period)/Math.pow(period,period);
        return cycle;
    }
}

export default TradingFloorHelpers;