var canvas1 = document.getElementById("myCanvasOne");
var ctx1 = canvas1.getContext("2d");

const canvas2 = document.getElementById("myCanvasTwo");
const ctx2 = canvas2.getContext("2d");

const canvas3 = document.getElementById("myCanvasThree");
const ctx3 = canvas3.getContext("2d");

const canvases = [ctx1, ctx2, ctx3];


var x = 0;
var y = 0;
var dx = 0;
var dy = 7;


class Test {
    name(params) {
        console.log('6', params);
    }
}

const a = new Test();
a.name('----');

const intervals = [];
let start;

const line = {
    top: '',
    middle: '',
    bottom: ''
};

const win = [];

const images = ['rhino','bunny','teddy'];
var loadedImages = {};
var promiseArray = images.map(function(imgName){
   return new Promise(function(resolve,reject){
       var img = new Image();
       img.onload = function(){
           loadedImages[imgName] = {};
           loadedImages[imgName]['name'] = img;
           loadedImages[imgName]['pos'] = 0;
           resolve();
       };
       img.src = 'images/'+imgName+'.jpg';
   });
});

const imagesInProcess = {
    "0":[],
    "1":[],
    "2":[]
};

Promise.all(promiseArray).then(imagesLoaded);

function imagesLoaded(){
   //console.log(loadedImages);
   init(0);
   //init(1);
   //init(2);
   //setTimeout(loop, 2000);
   //loop();
   document.getElementById('start').addEventListener('click', () => {
       start = Date.now();
       /*
       moveImage('rhino', 0);
       moveImage('bunny', 100);
       moveImage('teddy', 200);
       */
      loop();
   });
}

function init(ind) {
    const levelStep = 100;
    let currentlevel = 0;
    for (let imgName in loadedImages) {
        if (loadedImages.hasOwnProperty(imgName)) {
            console.log(canvases[ind]);
            canvases[ind].drawImage(loadedImages[imgName]['name'], 20, currentlevel, 100, 100);
            currentlevel += levelStep;
            imagesInProcess[ind].push(imgName); 
        }
    }
}

function drawResults() {
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    for(let prop in loadedImages) {
        if (loadedImages.hasOwnProperty(prop)) {
            if (loadedImages[prop]['pos'] > 0 && loadedImages[prop]['pos'] < 149) {
                ctx1.drawImage(loadedImages[prop]['name'], 20,0, 100, 100);
            }
            if (loadedImages[prop]['pos'] > 141 && loadedImages[prop]['pos'] < 250) {
                ctx1.drawImage(loadedImages[prop]['name'], 20,100, 100, 100);
            }
            if (loadedImages[prop]['pos'] > 251 && loadedImages[prop]['pos'] < 350) {
                ctx1.drawImage(loadedImages[prop]['name'], 20,200, 100, 100);
            }
        }
    }
}

function loop() {
    let st = 0;
    for(let prop in imagesInProcess) {
        imagesInProcess[prop].forEach(el => {
            moveImage(el, st);
            st += 100;
        });
    }
    
}


function moveImage(imageName, startY=0, startX) {

    if ( (Date.now() - start)/1000 > 2 + Math.random(0,1) ) {
        console.log(loadedImages);
        intervals.forEach(int=>{
            clearInterval(int);
        });
        drawResults();
        return 77;
    }

    const interval = setInterval(()=>{
       startY += dy;
       ctx1.clearRect(0, startY-dy, 120, startY+100+dy);
       ctx1.drawImage(loadedImages[imageName]['name'], 20,startY, 100, 100);
       loadedImages[imageName]['pos'] = startY;
       //pos(imageName, startY);
       intervals.push(interval);
       if (startY > 330 ) {
           clearInterval(interval);
           startY = 0;
           //const newImage = images[getRandomInt(images.length)];
           moveImage(imageName, 0);
           if (win.length === 3) {
               win.length = 0;
           }
           win.push(imageName);
       }
    }, 10);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
  

let xx = 20;
let yy = 20;
