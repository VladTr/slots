
(function(){
    let debugMode = false;
    const debugArea = document.getElementById('debug_area');

    const credits =localStorage.getItem('credits');
    document.getElementById('credits').innerText = credits;

    const scores = localStorage.getItem('scores');
    document.getElementById('scores').innerText = scores;

    document.getElementById('showDebug').addEventListener('click', () => {
        debugMode= !debugMode;
        debugArea.style.display = debugMode ? 'block' : 'none';
    });

    const options = images.reduce( (acc, cur) => {
        acc += `<option value="${cur}">${cur}</option>`;
        return acc;
    }, '');

    [...document.querySelectorAll("select")].map( (element, index, array) => {
            element.innerHTML = options;
        }
    );

    document.getElementById('add_credits').addEventListener('click', () => {
        const credits = parseInt(document.getElementById('new_credits').value);
        if (isNaN(credits) || credits > 5000) return;
        localStorage.setItem('credits', credits);
        document.getElementById('credits').innerText = credits;
    })

})()

