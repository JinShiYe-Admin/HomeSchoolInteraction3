var REM = parseFloat(localStorage.getItem("REM"));
if(REM){
	document.documentElement.style.fontSize = REM + 'px';
}else{
	setRem(document, window);
}

//设置rem, 1rem = 100px
function setRem(doc, win){
	var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth>750?750:docEl.clientWidth;
            if (!clientWidth) return;
            REM = 100 * (clientWidth / 375); //设计图中 100px=1rem
            docEl.style.fontSize = REM + 'px';
            localStorage.setItem("REM", REM);
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
}
