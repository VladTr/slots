class Slot {
    
    constructor(canvas, loadedImages, images){
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.loadedImages = loadedImages;
        this.images = images;
        this.step = 13;
        this.start = 0;
        this.delta = 0;
        this.intervals = [];
        this.results = [];
        this.debug = false;
    }

    init() {
        const levelStep = 100;
        let currentlevel = 0;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let imgName in this.loadedImages) {
            if (this.loadedImages.hasOwnProperty(imgName)) {
                this.ctx.drawImage(this.loadedImages[imgName]['name'], 20, currentlevel, 100, 100);
                currentlevel += levelStep;
            }
        }
    }

    setDebugMode(mode) {
        this.debug = mode;
    }

    setDelta(delta) {
        this.delta = delta;
    }

    getResults() {
        return this.results;
    }

    moveImage(imageName, startY=0) {
        if ( (Date.now() - this.start)/1000 > 1 + this.delta +0.1) {
            this.intervals.forEach( int => {
                clearInterval(int);
            });
            this.intervals.length = 0;
            this.drawResults();
            return;
        }
    
        const interval = setInterval(() => {
           startY += this.step;
           this.ctx.clearRect(0, startY-this.step, 120, startY+100+this.step);
           this.ctx.drawImage(this.loadedImages[imageName]['name'], 20,startY, 100, 100);
           this.loadedImages[imageName]['pos'] = startY;
           this.intervals.push(interval);
           if (startY > 330 ) {
               clearInterval(interval);
               startY = 0;
               this.moveImage(imageName, -200);
           }
        }, 10);
    }

    loop() {
        if (!this.debug) this.results.length = 0;
        
        this.start = Date.now();
        let st = -100;
        for(let img of this.images) {
            this.moveImage(img, st);
            st += 100;
        }
    }

    setResults(img1, img2, img3){
        if (arguments.length === 0) this.results.length = 0;
        this.results = [img1, img2, img3];
    }

    drawResults() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.results.length) {
            this.ctx.drawImage(this.loadedImages[this.results[0]]['name'], 20,0, 100, 100);
            this.ctx.drawImage(this.loadedImages[this.results[1]]['name'], 20,100, 100, 100);
            this.ctx.drawImage(this.loadedImages[this.results[2]]['name'], 20,200, 100, 100);
            return;
        }

        const setWin = {};
        for (let prop in this.loadedImages) {
            if (this.loadedImages[prop]['pos'] >= -50 && this.loadedImages[prop]['pos'] < 149) {
                setWin['top'] = this.loadedImages[prop]['name'];
                this.results[0] = prop;
            }
            if (this.loadedImages[prop]['pos'] >= 150 && this.loadedImages[prop]['pos'] < 250) {
                setWin['mid'] = this.loadedImages[prop]['name'];
                this.results[1] = prop;
            }
            if (this.loadedImages[prop]['pos'] >= 251 && this.loadedImages[prop]['pos'] < 400) {
                setWin['bottom'] = this.loadedImages[prop]['name'];
                this.results[2] = prop;
            }
        }

        console.log('=>', setWin, this.loadedImages);
        this.ctx.drawImage(setWin['top'], 20, 0, 100, 100);
        this.ctx.drawImage(setWin['mid'], 20, 100, 100, 100);
        this.ctx.drawImage(setWin['bottom'], 20, 200, 100, 100);
        
    }

    fillBorders(pos, clean = false) {
        this.ctx.fillStyle = !clean ? "#FF0000" : "white";
        switch(pos) {
            case 0:
                this.ctx.fillRect(0,0, 150, 1);
                this.ctx.fillRect(0,100, 150, 1);
                this.ctx.fillRect(0,100, 150, 1);
                this.ctx.fillRect(0,202, 150, 1);
                this.ctx.fillRect(0,200, 150, 1);
                this.ctx.fillRect(0,295, 150, 1);
                break;
            case 1:
                this.ctx.fillRect(0,0, 150, 1);
                this.ctx.fillRect(0,100, 150, 1);
                break;
            case 2:
                this.ctx.fillRect(0,100, 150, 1);
                this.ctx.fillRect(0,202, 150, 1);
                break;
            case 3:
                this.ctx.fillRect(0,200, 150, 1);
                this.ctx.fillRect(0,295, 150, 1);
                break;
        }
    }

}

const images = ['2xBAR','3xBAR','BAR', '7', 'Cherry'];

(async function(){
    const loadedImages = {};
    const promiseArray = images.map(function(imgName){
        return new Promise(function(resolve,reject){
            var img = new Image();
            img.onload = function(){
                loadedImages[imgName] = {};
                loadedImages[imgName]['name'] = img;
                loadedImages[imgName]['pos'] = 0;
                resolve();
            };
            img.src = 'images/' + imgName + '.png';
        });
    });
    await Promise.all(promiseArray).then(console.log('ok'));
    const slot_1 = new Slot(document.getElementById("myCanvasOne"), loadedImages, images);
    const slot_2 = new Slot(document.getElementById("myCanvasTwo"), loadedImages, images);
    const slot_3 = new Slot(document.getElementById("myCanvasThree"), loadedImages, images);
    slot_1.init();
    slot_2.init();
    slot_3.init();
    
    const resEl = document.getElementById('results');

    let clicked = false;

    document.getElementById('start').addEventListener('click', async() => {
        if (clicked) return;
        let credits = localStorage.getItem('credits');
        if (credits < 1) return;
        credits -= 1;

        slot_1.fillBorders(0, true);
        slot_2.fillBorders(0, true);
        slot_3.fillBorders(0, true);

        clicked = true;
        
        document.getElementById('credits').innerText = credits;
        localStorage.setItem('credits', credits);

        resEl.innerHTML = '';
        let deltas = [Math.random(0, 1), Math.random(0, 1)+0.5, Math.random(0, 1)+1].sort();
        slot_1.setDelta(deltas[0]);
        slot_2.setDelta(deltas[1]);
        slot_3.setDelta(deltas[2]);

        const isDebug = document.getElementById('debug_area').style.display === 'block';

        if (isDebug) {
            slot_1.setDebugMode(true);
            slot_2.setDebugMode(true);
            slot_3.setDebugMode(true);
            
            const testValues = getTestValues();

            slot_1.setResults(testValues[0][0], testValues[0][1], testValues[0][2]);
            slot_2.setResults(testValues[1][0], testValues[1][1], testValues[1][2]);
            slot_3.setResults(testValues[2][0], testValues[2][1], testValues[2][2]);
        }

        slot_1.loop();
        slot_2.loop();
        slot_3.loop();


        setTimeout(() => {

            const res1 = slot_1.getResults();
            const res2 = slot_2.getResults();
            const res3 = slot_3.getResults();
            const { res, line } = checkCases(res1, res2, res3);
            
            slot_1.fillBorders(line);
            slot_2.fillBorders(line);
            slot_3.fillBorders(line);

            resEl.innerHTML= '<span>' + res + '</span>';

            let scores = parseInt(localStorage.getItem('scores'));
            scores = isNaN(scores) ? res : scores + res; 
            localStorage.setItem('scores', scores);
            document.getElementById('scores').innerText = scores;
            
            slot_1.setDebugMode(false);
            slot_2.setDebugMode(false);
            slot_3.setDebugMode(false);

            clicked = false;

        }, 3000)

        function checkCases(res1, res2, res3) {
            let resultScore = 0;

            const bars = ['BAR', '2xBAR', '3xBAR']

            const lines = [
                [res1[0], res2[0], res3[0]],
                [res1[1], res2[1], res3[1]],
                [res1[2], res2[2], res3[2]],
            ];

            for (let i=0; i<lines.length; i++) {
                if (lines[i].every(el => el === 'Cherry')) {
                    if (i === 0) return {res: 2000, line: 1};
                    if (i === 1) return {res: 1000, line: 2};
                    if (i === 2) return {res: 4000, line: 3};
                }
            }
             
            for (let i=0; i<lines.length; i++) {
                if (lines[i].every(el => el === '7')) {
                    return {res: 150, line: i+1};
                }
            }    
        
            for (let i=0; i<lines.length; i++) {
                if (lines[i].indexOf('7') != -1 && lines[i].indexOf('Cherry') != -1) {
                    return {res: 75, line: i+1};
                }
            }
        
            for (let i=0; i<lines.length; i++) {
                if (lines[i].every(el => el === '3xBAR')) {
                    return {res: 50, line: i+1};
                }
            }
                
            for (let i=0; i<lines.length; i++) {
                if (lines[i].every(el => el === '2xBAR')) {
                    return {res: 20, line: i+1};
                }
            }    
        
            for (let i=0; i<lines.length; i++) {
                if (lines[i].every(el => el === 'BAR')) {
                    return {res: 10, line: i+1};
                }
            }   
        
            for (let i=0; i<lines.length; i++) {
                const barSet = [];
                lines[i].forEach( el => {
                    if (bars.indexOf(el) != -1) {
                        barSet.push(el);
                    }
                });
        
                if (barSet.length > 1) return {res: 5, line: i+1};;
            }
            
            return {res: 0, line: 0};

        }

        function getTestValues() {
            const reel1 = [
                document.getElementById('reel1_top').value,
                document.getElementById('reel1_mid').value,
                document.getElementById('reel1_bottom').value
            ];
            const reel2 = [
                document.getElementById('reel2_top').value,
                document.getElementById('reel2_mid').value,
                document.getElementById('reel2_bottom').value
            ];
            const reel3 = [
                document.getElementById('reel3_top').value,
                document.getElementById('reel3_mid').value,
                document.getElementById('reel3_bottom').value
            ];

            return [reel1, reel2, reel3];
        }
           
    });

})()







