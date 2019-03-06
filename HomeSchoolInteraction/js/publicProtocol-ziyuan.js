//
document.write('<script src="../../js/libs/RSA/Barrett.js"><\/script>');
document.write('<script src="../../js/libs/RSA/BigInt.js"><\/script>');
document.write('<script src="../../js/libs/RSA/RSA.js"><\/script>');
document.write('<script src="../../js/utils/RSAEncrypt.js"><\/script>');
document.write('<script src="../../js/libs/crypto-js/require.js"><\/script>');
document.write('<script src="../../js/utils/signHmacSHA1.js"><\/script>');
document.write('<script src="../../js/utils/sortSign.js"><\/script>');


function generateUUID() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return(c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
};

//设置头像，如果有，用本身的，没有给默认值
function setImg(imgURL) {
	var tempUrl = '';
	if(imgURL == null || imgURL.length == 0) {
		tempUrl = '../../img/login/headImg.png';
	} else {
		var myDate = new Date();
		tempUrl = imgURL + '?' + myDate.getTime();
	}
	//	console.log('tempUrl000:'+tempUrl);
	return tempUrl;
}

//url,
//encryData,需要加密的字段
//commonData,不需要加密的对象
//flag,0表示不需要合并共用数据，1为添加uuid、utid、token、appid普通参数，2为uuid、appid、token
//callback,返回值
var postDataEncry = function(url, encryData, commonData, flag, callback) {
	if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
		callback({
			RspCode: 404,
			RspData: null,
			RspTxt: "网络连接失败,请重新尝试一下"
		});
		return;
	}
	var tempUrl = window.storageKeyName.INTERFACEGU;
	url = tempUrl + url;
	console.log('url:', url);
	//拼接登录需要的签名
	var signTemp = postDataEncry1(encryData, commonData, flag);
	console.log('signTemp000:' + signTemp);
	//生成签名，返回值sign则为签名
	signHmacSHA1.sign(signTemp, 'jsy309', function(sign) {
		//组装发送握手协议需要的data
		//合并对象
		var tempData = $.extend(encryData, commonData);
		//添加签名
		tempData.sign = sign;
		// 等待的对话框
		var urlArr = url.split('/');
		console.log('传递的参数' + urlArr[urlArr.length - 1] + ':', JSON.stringify(tempData));
		var tempStr = JSON.stringify(tempData).replace(/\\/g, "");
		console.log('tempStr:' + tempStr);
		jQAjaxPost(url, tempStr, callback);
//		jQAjaxPost(url, JSON.stringify(tempData), callback);
	});
}

//拼接参数
var postDataEncry1 = function(encryData, commonData, flag) {
	//循环
	var tempStr = '';
	for(var tempData in encryData) {
		//对value进行加密
		var encryptStr = RSAEncrypt.enctype(encryData[tempData]);
		//修改值
		encryData[tempData] = encryptStr;
	}
	//判断是否需要添加共用数据
	if(flag == 1) {

	} else if(flag == 2) {

	} else if(flag == 3) {

	}
	//将对象转为数组
	var arr0 = [];
	for(var item in encryData) {
		arr0.push(item + '=' + encryData[item]);
	};
	var arr1 = [];
	for(var item in commonData) {
		//		if (typeof commonData[item] == 'string') {
		//			console.log('000');
		//			arr1.push(item + '="' + commonData[item]+'"');
		//		} else{
		//			console.log('001');
		//			arr1.push(item + '=' + commonData[item]);
		//		}
		arr1.push(item + '=' + commonData[item]);
	};
	//合并数组
	var signArr = arr0.concat(arr1);
	//拼接登录需要的签名
	var signTemp = signArr.sort().join('&');
	return signTemp;
}

//修改数组，改变格式
var arrayToStr = function(array) {
	if(array == null) {
		return '[]'
	}
	var tempStr = '';
	tempStr = array.join(',');
	tempStr = '[' + tempStr + ']';
	return tempStr;
}

//将时间转换为显示的格式
var modifyTimeFormat = function(str) {
	var tempStr = '';
	var dt_now = new Date();
	var int_year = dt_now.getYear();
	var dt_item = new Date(str.replace(/-/g, '/'));
	if(int_year == dt_item.getYear()) {
		tempStr = events.format(dt_item, "MM-dd hh:mm")
	} else {
		tempStr = events.format(dt_item, "yyyy-MM-dd hh:mm")
	}
	return tempStr;
}

/**
 * 发送 XMLHttpRequest post 的请求
 * @param {Object} url 路径
 * @param {Object} data 数据
 * @param {Object} callback 回调
 */
var xhrPost = function(url, commonData, callback) {
	if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
		callback({
			RspCode: 404,
			RspData: null,
			RspTxt: "网络连接失败,请重新尝试一下"
		});
		return;
	}
	console.log('XHRP-Url:', url);
	//	console.log('XHRP-Data:', commonData);
	//拼接登录需要的签名
	var signTemp = postDataEncry1({}, commonData, 0);
	console.log('signTemp000:' + signTemp);
	//生成签名，返回值sign则为签名
	signHmacSHA1.sign(signTemp, 'jsy309', function(sign) {
		//组装发送握手协议需要的data
		//合并对象
		var tempData = $.extend({}, commonData);
		//添加签名
		tempData.sign = sign;
		// 等待的对话框
		var urlArr = url.split('/');
		console.log('传递的参数' + urlArr[urlArr.length - 1] + ':', tempData);

		var xhr = new XMLHttpRequest();
		xhr.open("post", url, true);
		xhr.timeout = 10000; //10秒超时
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function(e) {
			console.log("XHRP:onload:", JSON.stringify(e));
			console.log('this.readyState:', this.readyState);
			console.log('this.status', this.status);
			if(this.readyState === 4 && this.status === 200) {
				var urlArr = url.split('/');
				var success_data = JSON.parse(this.responseText);
				console.log('XHRP-Success:', JSON.stringify(success_data));
				if(success_data.RspCode == 6) { //令牌过期
					//续订令牌
					var publicParameter = store.get(window.storageKeyName.PUBLICPARAMETER);
					var personal = store.get(window.storageKeyName.PERSONALINFO);
					//需要参数
					var comData = {
						uuid: publicParameter.uuid,
						utid: personal.utid,
						utoken: personal.utoken,
						appid: publicParameter.appid,
						schid: personal.schid,
						utp: personal.utp,
						utname: personal.utname
					};
					//令牌续订
					postDataEncry('TokenReset', {}, comData, 0, function(data1) {
						if(data1.RspCode == 0) {
							var tempInfo00 = store.get(window.storageKeyName.PERSONALINFO);
							tempInfo00.utoken = data1.RspData;
							store.set(window.storageKeyName.PERSONALINFO, tempInfo00);
							commonData.token = data1.RspData;
							delete commonData.sign;
							xhrPost(url, commonData, function(data2) {
								callback(data2);
							});
						}
					});
				} else {
					callback(success_data);
				}
			} else {
				callback({
					RspCode: 404,
					RspData: null,
					RspTxt: "网络连接失败,请重新尝试一下"
				});
			}
		}
		xhr.ontimeout = function(e) {
			console.log("XHRP:ontimeout222:", e);
			callback({
				RspCode: 404,
				RspData: null,
				RspTxt: "网络连接超时,请重新尝试一下"
			});
		};
		xhr.onerror = function(e) {
			console.log("XHRP:onerror111:", e);
			callback({
				RspCode: 404,
				RspData: null,
				RspTxt: "网络连接失败,请重新尝试一下"
			});
		};
		xhr.send(JSON.stringify(tempData));
	});
}

var jQAjaxPost = function(url, data, callback) {
	if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
		callback({
			RspCode: 404,
			RspData: null,
			RspTxt: "网络连接失败,请重新尝试一下"
		});
		return;
	}
	console.log('jQAP-Url:', url);
	console.log('jQAP-Data111:', data);
	jQuery.ajax({
		url: url,
		type: "POST",
		data: data,
		timeout: 10000,
		dataType: "json",
		contentType: "application/json",
		async: true,
		success: function(success_data) { //请求成功的回调
			console.log('jQAP-Success:', success_data);
			if(success_data.RspCode == 6) { //令牌过期
				//续订令牌
				var publicParameter = store.get(window.storageKeyName.PUBLICPARAMETER);
				var personal = store.get(window.storageKeyName.PERSONALINFO);
				//需要参数
				var comData = {
					uuid: publicParameter.uuid,
					utid: personal.utid,
					utoken: personal.utoken,
					appid: publicParameter.appid,
					schid: personal.schid,
					utp: personal.utp,
					utname: personal.utname
				};
				//令牌续订
				postDataEncry('TokenReset', {}, comData, 0, function(data1) {
					if(data1.RspCode == 0) {
						var tempInfo00 = store.get(window.storageKeyName.PERSONALINFO);
						tempInfo00.utoken = data1.RspData;
						store.set(window.storageKeyName.PERSONALINFO, tempInfo00);
						var urlArr = url.split('/');
						var tempData = JSON.parse(data);
						tempData.utoken = data1.RspData;
						delete tempData.sign;
						postDataEncry(urlArr[urlArr.length - 1], {}, tempData, 0, function(data2) {
							callback(data2);
						});
					}
				});
			} else {
				callback(success_data);
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log('jQAP-Error777:', xhr, type);
			callback({
				RspCode: 404,
				RspData: null,
				RspTxt: "网络连接失败,请重新尝试一下"
			});
		}
	});
}
var tempPro = function(url, data0, callback) {
	if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
		callback({
			RspCode: 404,
			RspData: null,
			RspTxt: "网络连接失败,请重新尝试一下"
		});
		return;
	}
	console.log('data0:' + JSON.stringify(data0));
	var xhr = new XMLHttpRequest();
	xhr.open("post", url, true);
	xhr.timeout = 10000; //10秒超时
	xhr.contentType = 'application/json;';
	xhr.onload = function(e) {
		console.log("XHRP:onload:", JSON.stringify(e));
		console.log('this.readyState:', this.readyState);
		console.log('this.status', this.status);
		if(this.readyState === 4 && this.status === 200) {
			var urlArr = url.split('/');
			var success_data = JSON.parse(this.responseText);
			console.log('XHRP-Success:', JSON.stringify(success_data));
			if(success_data.RspCode == 6) { //令牌过期
				//续订令牌
				var publicParameter = store.get(window.storageKeyName.PUBLICPARAMETER);
				var personal = store.get(window.storageKeyName.PERSONALINFO);
				//需要参数
				var comData = {
					uuid: publicParameter.uuid,
					utid: personal.utid,
					utoken: personal.utoken,
					appid: publicParameter.appid,
					schid: personal.schid,
					utp: personal.utp,
					utname: personal.utname
				};
				//令牌续订
				postDataEncry('TokenReset', {}, comData, 0, function(data1) {
					if(data1.RspCode == 0) {
						var tempInfo00 = store.get(window.storageKeyName.PERSONALINFO);
						tempInfo00.utoken = data1.RspData;
						store.set(window.storageKeyName.PERSONALINFO, tempInfo00);
						//						data0.utoken = data1.RspData;
						delete data0.sign;
						tempPro(url, data0, function(data2) {
							callback(data2);
						});
					}
				});
			} else {
				callback(success_data);
			}
		} else {
			callback({
				RspCode: 404,
				RspData: null,
				RspTxt: "网络连接失败,请重新尝试一下"
			});
		}
	}
	xhr.ontimeout = function(e) {
		console.log("XHRP:ontimeout222:", e);
		callback({
			RspCode: 404,
			RspData: null,
			RspTxt: "网络连接失败,请重新尝试一下"
		});
	};
	xhr.onerror = function(e) {
		console.log("XHRP:onerror111:", e);
		callback({
			RspCode: 404,
			RspData: null,
			RspTxt: "网络连接失败,请重新尝试一下"
		});
	};
	xhr.send(JSON.stringify(data0));
}
//1.绑定
var bindPro = function(data0, callback) {
	var url = 'http://jbyj.jiaobaowang.net/GeTuiPushServer/bind';
	tempPro(url, data0, callback);
}

//1.解绑
var unbindPro = function(data0, callback) {
	var url = 'http://jbyj.jiaobaowang.net/GeTuiPushServer/unbind';
	tempPro(url, data0, callback);
}

//合并参数
var extendParameter1 = function(data0) {
	var personal = store.get(window.storageKeyName.PERSONALINFO);
	var publicPar = store.get(window.storageKeyName.PUBLICPARAMETER);
	var tempData = {
		uuid: publicPar.uuid,
		utid: personal.utid,
		token: personal.utoken
	}
	return $.extend(data0, tempData);
}
//智学资源
//获取教材
var getZiYuanTextbook = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.ZIYUANURL;
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'textbook', data0, callback);
}

//获取资源(分页) 
var getZiYuanRes = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.ZIYUANURL;
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'res', data0, callback);
}

//获取资源包下的资源列表
var getZiYuanResList = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.ZIYUANURL;
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'res/list', data0, callback);
}

//获取单个资源 
var getZiYuanResDetail = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.ZIYUANURL;
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'res/detail', data0, callback);
}