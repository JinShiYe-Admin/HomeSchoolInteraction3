//
//document.write('<script src="../js/lib/RSA/Barrett.js"><\/script>');
//document.write('<script src="../js/lib/RSA/BigInt.js"><\/script>');
//document.write('<script src="../js/lib/RSA/RSA.js"><\/script>');
//document.write('<script src="../js/utils/RSAEncrypt.js"><\/script>');
//document.write('<script src="../js/lib/crypto-js/require.js"><\/script>');
//document.write('<script src="../js/utils/signHmacSHA1.js"><\/script>');
//document.write('<script src="../js/lib/jquery.js"><\/script>');
//document.write('<script src="../js/utils/sortSign.js"><\/script>');
//document.write('<script src="../../js/storageKeyName.js"><\/script>');

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
function setImg(imgURL,imgFlag) {
	var tempUrl = '';
	if(imgURL == null || imgURL.length == 0) {
		if (imgFlag==1) {//订购默认图
			tempUrl = '../../img/order.png';
		} else{
			tempUrl = '../../img/noImgPerson.jpg';
		}
	} else {
		var myDate = new Date();
		tempUrl = imgURL + '?' + myDate.getTime();
	}
	//	console.log('tempUrl000:'+tempUrl);
	return tempUrl;
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

//url,
//encryData,需要加密的字段
//commonData,不需要加密的对象
//flag,0表示不需要合并共用数据，1为添加uuid、utid、token、appid普通参数，2为uuid、appid、token
//callback,返回值
var postDataEncry = function(url, encryData, commonData, flag, callback) {
	checkNewWork(callback);
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
		console.log('传递的参数' + urlArr[urlArr.length - 1] + ':', tempData);
		jQAjaxPost(url, JSON.stringify(tempData), callback);
	});
}

var postDataEncry2 = function(url, encryData, commonData, flag, callback) {
	checkNewWork(callback);
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
		console.log('传递的参数' + urlArr[urlArr.length - 1] + ':', tempData);
		var tempStr = JSON.stringify(tempData).replace(/\\/g, "");
		console.log('tempStr:' + tempStr);
		jQAjaxPost(url, tempStr, callback);
	});
}
//修改数组，改变格式
var arrayToStr1 = function(array) {
	if(array == null) {
		return '[]'
	}
	var tempStr = '';
	tempStr = array.join(',');
	tempStr = '[' + '' + tempStr + '' + ']';
	return tempStr;
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
		//		if (typeof commonData[item] == Object) {
		if(commonData[item] instanceof Array) {
			console.log('000');
			arr1.push(item + '=' + JSON.stringify(commonData[item]) + '');
		} else {
			console.log('001');
			arr1.push(item + '=' + commonData[item]);
		}
		//		arr1.push(item + '=' + commonData[item]);
	};
	//合并数组
	var signArr = arr0.concat(arr1);
	console.log('signArr:' + signArr);
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
	tempStr = array.join('","');
	tempStr = '[' + '"' + tempStr + '"' + ']';
	return tempStr;
}

/**
 * 发送 XMLHttpRequest post 的请求
 * @param {Object} url 路径
 * @param {Object} data 数据
 * @param {Object} callback 回调
 */
var xhrPost = function(url, commonData, callback, flag) {
	checkNewWork(callback);
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
		xhr.contentType = 'application/json;';
		xhr.onload = function(e) {
			console.log("XHRP:onload:", JSON.stringify(e));
			console.log('this.readyState:', this.readyState);
			console.log('this.status', this.status);
			if(this.readyState === 4 && this.status === 200) {
				var urlArr = url.split('/');
				var success_data = JSON.parse(this.responseText);
				console.log('XHRP-Success:', JSON.stringify(success_data));
				if(success_data.RspCode == 10) { //令牌过期
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
		xhr.send(JSON.stringify(tempData));
	});
}

var checkNewWork = function(callback) {
	if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
		//console.log('没有网络');
		var data = {
			RspCode: '404',
			RspData: '',
			RspTxt: '网络异常，请检查网络设置！'
		}

		callback(data);
		return;
	}
}

var jQAjaxPost = function(url, data, callback) {
	checkNewWork(callback);
	console.log('jQAP-Url:', url);
	console.log('jQAP-Data:' + data);
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
						console.log('urlArr:' + urlArr[urlArr.length - 1]);
						console.log('data:' + JSON.stringify(tempData));
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
			events.closeWaiting();
			mui.toast('网络连接失败,请重新尝试一下');
			callback({
				RspCode: 404,
				RspData: null,
				RspTxt: "网络连接失败,请重新尝试一下"
			});
		}
	});
}

var tempPro = function(url, data0, callback) {
	checkNewWork(callback);
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
			if(success_data.RspCode == 10) { //令牌过期
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
	//	var tempAttendUrl = window.storageKeyName.INTERFACEKONG + 'schoolNotice/';
	//	data0 = extendParameter(data0);
	//	xhrPost('http://jbyj.jiaobaowang.net/GeTuiPushServer/bind', data0, callback);
}

//1.解绑
var unbindPro = function(data0, callback) {
	//	var tempAttendUrl = window.storageKeyName.INTERFACEKONG + 'schoolNotice/';
	//	data0 = extendParameter(data0);
	//	xhrPost('http://jbyj.jiaobaowang.net/GeTuiPushServer/unbind', data0, callback);
	var url = 'http://jbyj.jiaobaowang.net/GeTuiPushServer/unbind';
	tempPro(url, data0, callback);
}

//合并参数
var extendParameter = function(data0) {
	var personal = store.get(window.storageKeyName.PERSONALINFO);
	var publicPar = store.get(window.storageKeyName.PUBLICPARAMETER);
	var tempData = {
		uuid: publicPar.uuid,
		appid: publicPar.appid,
		token: personal.utoken
	}
	return $.extend(data0, tempData);
}

//1.新增学校通知（同时增加通知未读）
var addNoticePro = function(data0, callback) {
	var tempAttendUrl = window.storageKeyName.INTERFACEKONG + 'schoolNotice/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl + 'addNotice', data0, callback);
}

//2.删除学校通知（假删）
var setNoticesDelPro = function(data0, callback) {
	var tempAttendUrl = window.storageKeyName.INTERFACEKONG + 'schoolNotice/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl + 'setNoticesDel', data0, callback);
}

//3.回复学校通知(同时增加回复未读)
var addNoticeReplyPro = function(data0, callback) {
	var tempAttendUrl = window.storageKeyName.INTERFACEKONG + 'schoolNotice/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl + 'addNoticeReply', data0, callback);
}

//4.获取学校通知列表
var getNoticesPro = function(data0, callback) {
	var tempAttendUrl = window.storageKeyName.INTERFACEKONG + 'schoolNotice/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl + 'getNotices', data0, callback);
}

//5.通过ID获取学校通知（同时阅读通知和通知回复）
var getNoticeByIdPro = function(data0, callback) {
	var tempAttendUrl = window.storageKeyName.INTERFACEKONG + 'schoolNotice/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl + 'getNoticeById', data0, callback);
}

//9.新增定制城市（先进行删除，再新增，不进行是否有重复定制的判断）
var addPersonCityPro = function(data0, callback) {
	var tempAttendUrl = window.storageKeyName.INTERFACEKONG + 'scienceTeach/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl + 'addPersonCity', data0, callback);
}

//10.获取某用户的定制城市
var getPersonCitysByUserPro = function(data0, callback) {
	var tempAttendUrl = window.storageKeyName.INTERFACEKONG + 'scienceTeach/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl + 'getPersonCitysByUser', data0, callback);
}

//12.获取某人未读学校通知个数
var getNoReadNoticeCntByManPro = function(data0, callback) {
	var tempAttendUrl = window.storageKeyName.INTERFACEKONG + 'schoolNotice/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl + 'getNoReadNoticeCntByMan', data0, callback);
}

//16.获取某人登录次数
var getLoginCntByUserPro = function(data0, callback) {
	var tempAttendUrl = window.storageKeyName.INTERFACEKONG + 'login/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl + 'getLoginCntByUser', data0, callback);
}