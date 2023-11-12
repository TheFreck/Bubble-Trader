export default {
    movingAverage: (prices,periods) => {
        let totalPrice = 0;
        for(let price of prices){
            totalPrice+=price;
        }
        return totalPrice/periods;
    },

}