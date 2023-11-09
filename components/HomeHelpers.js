
export const helpers = {
    getTraders: (assets, nTraders, cb) => {
        const availableXs = [200, -200];
        const availableYs = [200, -200];
        const taken = [];
        for (let asset of assets) {
            availableXs[0] = Math.min(availableXs[0], asset.left - 5);
            availableXs[1] = Math.max(availableXs[1], asset.right + 5);
            availableYs[0] = Math.min(availableYs[0], asset.top - 5);
            availableYs[1] = Math.max(availableYs[1], asset.bottom + 5);
        }
        const validateCoordsAgainstPodiums = ({ x, y }) => {
            if (x === null || y === null) return false;
            let xPass = true;
            let yPass = true;
            if (x > availableXs[0] && x < availableXs[1]) xPass = false;
            if (y > availableYs[0] && y < availableYs[1]) yPass = false;
            if (xPass || yPass) return true;
            else return false;
        }
        const validateCoordsAgainstTraders = ({x,y}) => {
            for(let cd of taken){
                let dist = Math.sqrt(Math.pow(x-cd.x,2)+Math.pow(y-cd.y,2));
                if(dist < 12) {
                    return false;
                }
            }
            return true;
        }

        const getCoords = () => {
            const coords = { x: null, y: null, name:`Trader-${taken.length}` }
            do {
                coords.x = Math.random() * 190 - 45;
                coords.y = Math.random() * 90 + 5;
            } while ( !validateCoordsAgainstPodiums(coords) || !validateCoordsAgainstTraders(coords));
            taken.push(coords);
            return coords;
        }
    
        let stageTraders = [];
        for (let i = 0; i < nTraders; i++) {
            const position = getCoords();
            let y = i%2 ? 35 : 50;
            let x = i%2 ? 42.5 : 50;
            let ySpeed = i===0 ? 4 : 0;
            let xSpeed = i===0 ? 3 : 0;
            xSpeed = Math.random()*.8-.4;
            ySpeed = Math.random()*.8-.4;
            // switch(i){
            //     case 0:
            //         x = 25;
            //         y = 50;
            //         xSpeed = 1;
            //         ySpeed = 0;
            //         break;
            //     case 1:
            //         x = 40;
            //         y = 50;
            //         xSpeed = 0;
            //         ySpeed = 0;
            //         break;
            //     case 2:
            //         x = 50;
            //         y = 55.5;
            //         xSpeed = 0;
            //         ySpeed = 0;
            //         break;
            //     case 3:
            //         x = 50;
            //         y = 44.5;
            //         xSpeed = 0;
            //         ySpeed = 0;
            //         break;
            //     case 4:
            //         x = 60;
            //         y = 50;
            //         xSpeed = 0;
            //         ySpeed = 0;
            //         break;
            //     case 5:
            //         x = 60;
            //         y = 61;
            //         xSpeed = 0;
            //         ySpeed = 0;
            //         break;
            //     case 6:
            //         x = 60;
            //         y = 39;
            //         xSpeed = 0;
            //         ySpeed = 0;
            //         break;
            // }
            // const position = {
            //     x: 0,
            //     y: 50
            // };
            // const xSpeed = .5;
            // const ySpeed = 0;
            stageTraders.push({
                name: `Trader-${i}`,
                xSpeed,
                ySpeed,
                x: position.x,
                y: position.y,
                isAlive: true,
                red:99,
                green:56,
                blue: 99,
                size: 5,
                isGo: false,
                cash: 10000,
                portfolio: {}
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