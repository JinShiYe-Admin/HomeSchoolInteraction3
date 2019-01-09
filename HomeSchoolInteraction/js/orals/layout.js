var REM = parseFloat(localStorage.getItem("REM"));
if(REM){
	document.documentElement.style.fontSize = REM + 'px';
//	setNavHeight();
}else{
	setRem(document, window);
//	setNavHeight();
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

//沉浸式状态栏
//function setNavHeight() {
//	var nav = document.querySelector(".mui-bar-nav");
//	if(nav&&statusbarHeight) {
//		nav.style.height = (44+statusbarHeight)+"px";
//		nav.style.paddingTop = statusbarHeight+"px";
//		var content = document.querySelector(".mui-bar-nav~.mui-content");
//		if(content) {
//			content.style.paddingTop = (44+statusbarHeight)+"px";
//		}
//	}
//}