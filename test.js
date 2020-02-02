let res1 = ["3xBAR", "BAR", "7"];
let res2 = ["3xBAR", "BAR", "7"];
let res3 = ["2xBAR", "3xBAR", "BAR"];


const res = checkCases(res1, res2, res3);
//console.log(res);

function checkCases(res1, res2, res3) {
    let resultScore = 0;

    const bars = ['BAR', '2xBAR', '3xBAR']

    const lines = [
        [res1[0], res2[0], res3[0]],
        [res1[1], res2[1], res3[1]],
        [res1[2], res2[2], res3[2]],
    ];


    //console.log(lines);

    for(let i=0; i<lines.length; i++) {
        
        
        if (lines[i].every(el => el === 'Cherry')) {
            if (i===0) return 2000;
            if (i===1) return 1000;
            if (i===2) return 4000;
        }
        
    }
     
    for(let i=0; i<lines.length; i++) {
        if (lines[i].every(el => el === '7')) {
            return 150;
        }
    }    

    for(let i=0; i<lines.length; i++) {
        if (lines[i].indexOf('7') != -1 && lines[i].indexOf('Cherry') != -1) {
            console.log(lines[i]);
            return 75;
        }
    }

    for(let i=0; i<lines.length; i++) {
        if (lines[i].every(el => el === '3xBAR')) {
            return 50;
        }
    }
        
    for(let i=0; i<lines.length; i++) {
        if (lines[i].every(el => el === '2xBAR')) {
            return 20;
        }
    }    

    for(let i=0; i<lines.length; i++) {
        if (lines[i].every(el => el === 'BAR')) {
            return 10;
        }
    }   

    for(let i=0; i<lines.length; i++) {
        let barSet = new Set();
       lines[i].forEach( el => {
            if (bars.indexOf(el) != -1) {
                barSet.add(el);
            }
        });

        if (barSet.size > 1) return 5;
    }   


}
