import react, { useState } from 'react';

export const Asset = ({ name,initialPrice,quantity }) => {
    const[price, setPrice] = useState();
    const[priceHistory, setPriceHistory] = useState();

    // const tradeAsset =({ buyer,seller, tradeType }) => {
    //     let sharePortion;
    //     let buyerCanAfford = Math.floor(buyer.cash/price);
    //     let tradableShares = Math.min(buyerCanAfford,seller.shares);
    //     let rationale = tradeType ? buyer.tradeRationale() : seller.tradeRationale();
    //     rationale = rationale > 1 ? 1 : rationale < -1 ? -1 : rationale;
    //     if (rationale > 0) {
    //         // buy
    //         buyer.cash = buyer.cash;
    //         buyerCanAfford = Math.floor(buyer.cash/ (this.price * 1.05));
    //         if (buyerCanAfford <= 0) return;
    //         tradableShares = Math.floor(Math.min(buyerCanAfford, seller.shares) * rationale);
    //         if (tradableShares >= 1) {
    //             sharePortion = tradableShares / (asset.qty);
    //             ths.price *= 1 + sharePortion;
    //             const trade = new Trade(thisOne, agent, assets.find(a => a.name === assetName), tradableShares, price * tradableShares);
    //             if (trade.transferAssetsAndShares()) buys++;
    //             else return;
    //         }
    //         else return;
    //     }
    //     else {
    //         // sell
    //         let agentAssets = thisOne.assets;
    //         buyerCanAfford = Math.floor(buyer.cash / (asset.price * 1.05)) - 1;
    //         if (buyerCanAfford <= 0) return;
    //         tradableShares = Math.floor(Math.min(buyerCanAfford, seller.shares) * -rationale);
    //         if (tradableShares >= 1) {
    //             sharePortion = 100 * tradableShares / asset.qty;
    //             price *= 1 - sharePortion;
    //             const trade = new Trade(agent, thisOne, assets.find(a => a.name === assetName), tradableShares, price * tradableShares);
    //             if (trade.transferAssetsAndShares()) sells++;
    //             else return;
    //         }
    //         else return;
    //     }
    //     asset.updatePrice({ newPrice: price, newQty: tradableShares });
    //     let assetValue = 0;
    //     for (let asset in assets) {
    //         assetValue += thisOne.assets[asset.name] * asset.price;
    //     }
    //     if (thisOne.cash <= assets[0].price && assetValue === 0) {
    //         thisOne.killParticle();
    //     }
    // }


    return {
        name,
        price,
        setPrice,
        priceHistory
    }
}



export default Asset;