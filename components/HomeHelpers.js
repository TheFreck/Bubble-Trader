
export const helpers = {
    getTraders: (assets, nTraders, cb) => {
        const availableXs = [200, -200];
        const availableYs = [200, -200];
        for (let asset of assets) {
            availableXs[0] = Math.min(availableXs[0], asset.left - 5);
            availableXs[1] = Math.max(availableXs[1], asset.right + 5);
            availableYs[0] = Math.min(availableYs[0], asset.top - 5);
            availableYs[1] = Math.max(availableYs[1], asset.bottom + 5);
        }
        const validateCoords = ({ x, y }) => {
            if (x === null || y === null) return false;
            let xPass = true;
            let yPass = true;
            if (x > availableXs[0] && x < availableXs[1]) xPass = false;
            if (y > availableYs[0] && y < availableYs[1]) yPass = false;
            if (xPass || yPass) return true;
            else return false;
        }

        const getCoords = () => {
            const coords = { x: null, y: null }
            do {
                coords.x = Math.random() * 190 - 45;
                coords.y = Math.random() * 90 + 5;
                console.log("coords: ", coords);
            } while (!validateCoords(coords));
            return coords;
        }
        let stageTraders = [];
        for (let i = 0; i < nTraders; i++) {
            const position = getCoords();
            stageTraders.push({
                name: `Trader-${i}`,
                isAlive: true,
                isIn: false,
                xSpeed: (Math.random() * 2 - 1) / 5,
                ySpeed: (Math.random() * 2 - 1) / 5,
                // xSpeed: .25,
                // ySpeed: .5,
                x: position.x,
                y: position.y,
                // x: 50,
                // y:50,
                red: Math.random() * 255,
                green: Math.random() * 255,
                blue: Math.random() * 255,
                size: 5,
                isGo: false
            });
        }
        cb(stageTraders);
    },
    getAssets: (nAssets, cb) => {
        let pods = [];
        let spacing = 200/nAssets;
        let width = spacing/2;
        for (let i = 0; i < nAssets; i++) {
            pods.push({
                name: helpers.getName(3, 'ticker'),
                shareQty: 10000,
                startingPrice: 20,
                top: Math.random()*50,
                bottom: Math.random()*50+50,
                right: i * spacing + width-50 + width/2,
                left: i * spacing-50 + width/2
            });
        }
        cb(pods);
    },
    getName: (chars, type) => {
        const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
        const vowels = ['A', 'E', 'I', 'O', 'U'];
        let name = '';
        if (type === 'ticker') {
            for (let i = 0; i < chars; i++) {
                name += alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
        else if (type === 'name') {
            for (let i = 0; i < chars; i++) {
                if (i % 2) name += consonants[Math.floor(Math.random() * consonants.length)];
                else name += vowels[Math.floor(Math.random() * vowels.length)];
            }
        }
        return name;
    }
}

export default helpers;