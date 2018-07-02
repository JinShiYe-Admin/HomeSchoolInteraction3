//排序，签名时用
var sortUrls=(function(mod){
	mod.createDatas=function(){
		var Urls=["https://www.google.com/","https://www.baidu.com/",
		"http://www.dcloud.io/mui.html","http://www.163.com/"];
		//console.log(Urls)
		return Urls;
	}
	mod.sortIt=function(urls){
		var joined=urls.sort().join('&')
//		//console.log(joined);
		return joined;
	}
	return mod;
})(sortUrls||{})
