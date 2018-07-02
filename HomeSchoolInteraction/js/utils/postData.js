//url
//data
//callback,返回方法
//waitingDialog,失败弹出框
function postData(url, data, callback, waitingDialog) {
	if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
		//console.log('没有网络');
		var data = {
				RspCode: '404',
				RspData: '',
				RspTxt: '网络异常，请检查网络设置！'
			}

			callback(data);
			if(waitingDialog != null) {
				waitingDialog.close();
			}
		return;
	}
	var tepTime = tempTime();
	mui.ajax(url, {
		data: JSON.stringify(data),
		dataType: 'json',
		type: 'post',
		contentType: "application/json",
		timeout: tepTime,
		success: function(data) {
			console.log('获取的值：', data);
			if(data.RspCode == 6) {
				if(waitingDialog != null) {
					waitingDialog.close();
				}
				renewToken(0, 'encryData', 'commonData', 'flag', 'waitingDialog', 'callback');
			} else {
				callback(data);
			}
		},
		error: function(xhr, type, errorThrown) {
			//			waitingDialog.close();
			//			mui.alert("网络连接失败，请重新尝试一下", "错误", "OK", null);
			//console.log('网络连接失：' + url + ':' + type + ',' + JSON.stringify(xhr) + ',' + errorThrown);
			var data = {
				RspCode: '404',
				RspData: '',
				RspTxt: '网络连接失败，请重新尝试一下'
			}

			callback(data);
			if(waitingDialog != null) {
				waitingDialog.close();
			}
		}
	});
}

function tempTime() {
	switch(plus.os.name) {
		case "Android":
			return 30000;
			break;
		case "iOS":
			return 300000;
			break;
		default:
			// 其它平台
			break;
	}
}

//url,
//encryData,需要加密的字段
//commonData,不需要加密的对象
//flag,0表示不需要合并共用数据，1为添加uuid、utid、token、appid普通参数，2为uuid、appid、token
//waitingDialog,等待框
//callback,返回值
function postDataEncryMMM(url, encryData, commonData, flag, waitingDialog, callback) {
	if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
		var data = {
				RspCode: '404',
				RspData: '',
				RspTxt: '网络异常，请检查网络设置！'
			}

			callback(data);
			if(waitingDialog != null) {
				waitingDialog.close();
			}
		return;
	}
	//拼接登录需要的签名
	var signTemp = postDataEncry12(encryData, commonData, flag);

	//生成签名，返回值sign则为签名
	signHmacSHA1.sign(signTemp, storageKeyName.SIGNKEY, function(sign) {
		//组装发送握手协议需要的data
		//合并对象
		var tempData = $.extend(encryData, commonData);
		//添加签名
		tempData.sign = sign;
		// 等待的对话框
		var urlArr = url.split('/');
		console.log('传递的参数' + urlArr[urlArr.length - 1] + ':', tempData);
		var tepTime = tempTime();
		//发送协议

		mui.ajax(url, {
			data: JSON.stringify(tempData),
			dataType: 'json',
			type: 'post',
			contentType: "application/json",
			timeout: tepTime,
			//			success: callback,
			success: function(data) {
				console.log(urlArr[urlArr.length - 1] + "接口获取的值:", data);
				//console.log('data.RspCode:' + data.RspCode + ',data.RspTxt:' + data.RspTxt + ',data.RspData:' + JSON.stringify(data.RspData) + ',' + url);
				if(data.RspCode == 6) {
					if(waitingDialog != null) {
						waitingDialog.close();
					}
					renewToken(1, url, {}, commonData, flag, waitingDialog, callback);
				} else {
					//如果是21号协议，21.通过用户ID或ID串获取用户资料，判断返回值中，人员有没有名称，没有的话，主动给添加一个‘新用户’，
					if(urlArr[urlArr.length - 1] == 'PostUinf') {
						//找到当前的数组
						var tempArray = data.RspData;
						for(var item in tempArray) {
							var model = tempArray[item];
							if(model.unick == '' || model.unick == undefined) {
								model.unick = '新用户';
							}
						}
					} else if(urlArr[urlArr.length - 1] == 'PostGusers') {
						//找到当前的数组
						var tempArray = data.RspData;
						for(var item in tempArray) {
							var model = tempArray[item];
							if(model.ugnick == '' || model.ugnick == undefined) {
								model.ugnick = '新用户';
							}
						}
					}
					callback(data);
				}
			},
			error: function(xhr, type, errorThrown) {
				console.log("网络连接失败" + url + ":" + type + "," + errorThrown + ":", xhr);
				//console.log('网络连接失败:' + url + ':' + type + ',' + JSON.stringify(xhr) + ',' + errorThrown);
				var data = {
					RspCode: '404',
					RspData: '',
					RspTxt: '网络连接失败，请重新尝试一下'
				}

				callback(data);
				if(waitingDialog != null) {
					waitingDialog.close();
				}
				//mui.toast("网络连接失败，请重新尝试一下");
			}
		});
	});
}

//拼接参数
function postDataEncry12(encryData, commonData, flag) {
	console.log('postDataEncry12000000000');
	//循环
	var tempStr = '';
	for(var tempData in encryData) {
		//对value进行加密
		var encryptStr = RSAEncrypt.enctype(encryData[tempData]);
		//修改值
		encryData[tempData] = encryptStr;
	}
	var publicParameter = store.get(window.storageKeyName.PUBLICPARAMETER);
	//判断是否需要添加共用数据
	if(flag == 1) {
		console.log('hahhahahahahahahahahhaha');
		//获取个人信息
		var personalUTID = store.get(window.storageKeyName.PERSONALINFO).utid;
		var personalToken = store.get(window.storageKeyName.PERSONALINFO).utoken;
		var comData = {
			uuid: publicParameter.uuid,
			utid: personalUTID,
			token: personalToken,
			appid: publicParameter.appid
		};
		commonData = $.extend(commonData, comData);
	} else if(flag == 2) {
		//获取个人信息
		var personalToken = store.get(window.storageKeyName.PERSONALINFO).utoken;
		var comData = {
			uuid: publicParameter.uuid,
			token: personalToken,
			appid: publicParameter.appid
		};
		commonData = $.extend(commonData, comData);
	} else if(flag == 3) {
		//获取个人信息
		var personalToken = store.get(window.storageKeyName.PERSONALINFO).utoken;
		var comData = {
			token: personalToken
		};
		commonData = $.extend(commonData, comData);
	}
	//将对象转为数组
	var arr0 = [];
	for(var item in encryData) {
		arr0.push(item + '=' + encryData[item]);
	};
	var arr1 = [];
	for(var item in commonData) {
		arr1.push(item + '=' + commonData[item]);
	};
	//合并数组
	var signArr = arr0.concat(arr1);
	//拼接登录需要的签名
	var signTemp = signArr.sort().join('&');
	return signTemp;
}

//生成二维码链接
function QRCodeUrl(url, encryData, commonData, flag) {
	//拼接登录需要的签名
	var signTemp = postDataEncry12(encryData, commonData, flag);
	//生成签名，返回值sign则为签名
	signHmacSHA1.sign(signTemp, storageKeyName.SIGNKEY, function(sign) {
		//组装发送握手协议需要的data
		//合并对象
		var tempData = $.extend(encryData, commonData);
		//添加签名
		tempData.sign = sign;
		//将对象转为数组
		var arr0 = [];
		for(var item in tempData) {
			arr0.push(item + '=' + tempData[item]);
		};
		//参数的临时值
		var tempStr = arr0.sort().join('&');
		//拼接url
		var url0 = url + '?' + tempStr;
		//console.log('需要申请的url为:' + url0);
		return url0;
	});
}