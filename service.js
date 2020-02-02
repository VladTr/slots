
(function(){
    let debugMode = false;
    const debugArea = document.getElementById('debug_area');

    document.getElementById('showDebug').addEventListener('click', () => {
        debugMode= !debugMode;
        debugArea.style.display = debugMode ? 'block' : 'none';
    });

    const options = images.reduce( (acc, cur) =>{
        acc += `<option value="${cur}">${cur}</option>`;
        return acc;
    }, '');

    console.log(options);

    [...document.querySelectorAll("select")].map( (element, index, array) => {
            element.innerHTML = options;
        }
    );

})()