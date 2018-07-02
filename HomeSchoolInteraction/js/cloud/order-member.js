mui.init();
mui(".mui-scroll-wrapper").scroll();
mui.plusReady(function(){
	setData();
	setListeners();
})
function setData(){
	
}
function setListeners(){
	mui(".mui-slider-item.mui-control-content").on("tap",".deal-button",function(){
		this.disabled=true;
		var item=this;
		var type=parseInt(document.querySelector(".mui-slider-indicator.mui-segmented-control").querySelector(".mui-active").getAttribute("value"));
		//console.log("订购的会员类型："+type);
		var duration=item.parentElement.querySelector(".duration-info").innerText;
		var price=item.parentElement.querySelector(".price-info").innerText;
		events.singleWebviewInPeriod(item,"member-pay.html",{
			memberName:type,
			memberTime:duration,
			memberPay:price
		})
	})
}
