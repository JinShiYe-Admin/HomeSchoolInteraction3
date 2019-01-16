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
//智慧校园协议

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

//7.新增通知公告
var addNoticePro = function(data0, callback) {
	var tempAttendUrl = window.storageKeyName.INTERFACEKONG + 'notice/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl + 'addNotice', data0, callback)
}

//8.撤销通知公告
var setNoticeUndoPro = function(data0, callback) {
	var tempAttendUrl = window.storageKeyName.INTERFACEKONG + 'notice/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl + 'setNoticeUndo', data0, callback)
}

//9.阅读通知公告
var setNoticeReadPro = function(data0, callback) {
	var tempAttendUrl = window.storageKeyName.INTERFACEKONG + 'notice/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl + 'setNoticeRead', data0, callback)
}

//10.获取发送的通知公告列表
var getSendNoticePro = function(data0, callback) {
	var tempAttendUrl = window.storageKeyName.INTERFACEKONG + 'notice/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl + 'getSendNotice', data0, callback);
}

//11.获取收到的通知公告列表（接收人为单人）
var getReceiveNoticePro = function(data0, callback) {
	var tempAttendUrl = window.storageKeyName.INTERFACEKONG + 'notice/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl + 'getReceiveNotice', data0, callback);
}

//12.通过通知公告ID获取通知公告(我发送的)
var getNoticeByIdPro = function(data0, callback) {
	var tempAttendUrl = window.storageKeyName.INTERFACEKONG + 'notice/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl + 'getNoticeById', data0, callback);
}

//15.撤销事务及文件申请
var setAffairApplyUndoPro = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.INTERFACEKONG + 'approve/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl1 + 'setAffairApplyUndo', data0, callback);
}

//16.审批事务及文件申请
var setAffairApprovePro = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.INTERFACEKONG + 'approve/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl1 + 'setAffairApprove', data0, callback);
}

//17.获取事务及文件申请列表
var getAffairApplyPro = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.INTERFACEKONG + 'approve/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl1 + 'getAffairApply', data0, callback);
}

//18.获取事务及文件审批列表（审批人为单人）
var getAffairApprovePro = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.INTERFACEKONG + 'approve/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl1 + 'getAffairApprove', data0, callback);
}

//19.通过ID获取事务及文件申请
var getAffairApplyByIdPro = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.INTERFACEKONG + 'approve/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl1 + 'getAffairApplyById', data0, callback);
}

//23.通过审批ID获取事务及文件申请及审批
var getAffairApproveByIdPro = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.INTERFACEKONG + 'approve/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl1 + 'getAffairApproveById', data0, callback);
}

//24.获取角色对应的菜单权限
var getPrivilegeByRolePro = function(data0, callback) {
	var tempAttendUrl2 = window.storageKeyName.INTERFACEKONG + 'privilege/'; //获取权限
	data0 = extendParameter(data0);
	//判断是通知公告还是事务
	xhrPost(tempAttendUrl2 + 'getPrivilegeByRole', data0, callback);
}

//25.通过通知接收表ID获取通知公告(我接收的)
var getNoticeByReceiveIdPro = function(data0, callback) {
	var tempAttendUrl2 = window.storageKeyName.INTERFACEKONG + 'notice/'; //获取权限
	data0 = extendParameter(data0);
	//判断是通知公告还是事务
	xhrPost(tempAttendUrl2 + 'getNoticeByReceiveId', data0, callback);
}

var addAffairApplyPro = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.INTERFACEKONG + 'approve/';
	data0 = extendParameter(data0);
	//判断是通知公告还是事务
	xhrPost(tempAttendUrl1 + 'addAffairApply', data0, callback);
}
//4.获取流程列表
var getSelWorkFlowPro = function(data0, callback) {
	var tempAttendUrl3 = window.storageKeyName.INTERFACEKONG + 'flow/';
	data0 = extendParameter(data0);
	//判断是通知公告还是事务
	xhrPost(tempAttendUrl3 + 'getSelWorkFlow', data0, callback);
}

var getWorkFlowListByIdPro = function(data0, callback) {
	var tempAttendUrl3 = window.storageKeyName.INTERFACEKONG + 'flow/';
	data0 = extendParameter(data0);
	//判断是通知公告还是事务
	xhrPost(tempAttendUrl3 + 'getWorkFlowListById', data0, callback);
}

//26.获取未读的通知公告数量
var getNoReadCntByManPro = function(data0, callback) {
	var tempAttendUrl = window.storageKeyName.INTERFACEKONG + 'notice/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl + 'getNoReadCntByMan', data0, callback)
}

//27.获取未批的事务及文件审批数量
var getNoApproveCntByManPro = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.INTERFACEKONG + 'approve/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl1 + 'getNoApproveCntByMan', data0, callback);
}

//28.回复通知公告
var setNoticeReplyPro = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.INTERFACEKONG + 'notice/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl1 + 'setNoticeReply', data0, callback);
}

//10.新增考勤记录
var addAttendPro = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.INTERFACESIGNINKONG + 'attendance/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl1 + 'addAttend', data0, callback);
}

//12.获取考勤类型
var getAttendTypePro = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.INTERFACESIGNINKONG + 'attendance/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl1 + 'getAttendType', data0, callback);
}

//13.获取考勤时间段
var getAttendTimePro = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.INTERFACESIGNINKONG + 'attendance/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl1 + 'getAttendTime', data0, callback);
}

//14.获取考勤地点
var getAttendAreaPro = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.INTERFACESIGNINKONG + 'attendance/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl1 + 'getAttendArea', data0, callback);
}

//15.获取考勤记录
var getAttendPro = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.INTERFACESIGNINKONG + 'attendance/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl1 + 'getAttend', data0, callback);
}

//17.获取选择用考勤类型
var getAttendTypeForSelPro = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.INTERFACESIGNINKONG + 'attendance/';
	data0 = extendParameter(data0);
	xhrPost(tempAttendUrl1 + 'getAttendTypeForSel', data0, callback);
}

//学生管理

//合并参数
var extendParameter1 = function(data0) {
	var personal = store.get(window.storageKeyName.PERSONALINFO);
	var publicPar = store.get(window.storageKeyName.PUBLICPARAMETER);
	var tempData = {
		uuid: publicPar.uuid,
		utid: personal.utid,
		utname: personal.utname,
		schid: personal.schid,
		token: personal.utoken
	}
	return $.extend(data0, tempData);
}

//1.学生考勤列表首页
var getAttendanceIndex = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'attendance/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'attendanceIndex', data0, callback);
}

//2.考勤详情
var getAttendanceDetail = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'attendance/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'detail', data0, callback);
}

//3.保存考勤信息
var getSaveAttendance = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'attendance/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'saveAttendance', data0, callback);
}

//4.考勤统计
var getAttendanceStatistics = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'attendance/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'statistics', data0, callback);
}

//5.删除考勤信息
var getattendanceDelete = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'attendance/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'delete', data0, callback);
}

//6.学生行为首页列表
var getActionBehaviorIndex = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'behavior/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'behaviorIndex', data0, callback);
}

//7.行为详情
var getActionDetail = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'behavior/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'detail', data0, callback);
}

//8.保存行为信息
var getActionSaveBehavior = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'behavior/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'saveBehavior', data0, callback);
}

//9.行为统计
var getActionStatistics = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'behavior/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'statistics', data0, callback);
}

//10.删除行为信息
var getActionDelete = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'behavior/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'delete', data0, callback);
}

//3.1.教师谈话首页列表
var getTalkChatIndex = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'teacherChat/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'chatIndex', data0, callback);
}

//3.2.谈话详情
var getTalkDetail = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'teacherChat/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'detail', data0, callback);
}

//3.3.保存谈话信息
var getTalkSaveChat = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'teacherChat/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'saveChat', data0, callback);
}

//3.4.删除谈话记录
var getTalkDelete = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'teacherChat/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'delete', data0, callback);
}

//4.1.量化考评首页列表
var getReviewEvaluationIndex = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'evaluation/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'evaluationIndex', data0, callback);
}

//4.2.考评详情
var getReviewEvaluationDetail = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'evaluation/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'evaluationDetail', data0, callback);
}

//4.3.学生考评分析
var getReviewEvaluationStuAnalysis = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'evaluation/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'evaluationStuAnalysis', data0, callback);
}

//5.1. 学生评语首页列表
var getCommentIndex = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'comment/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'commentIndex', data0, callback);
}
//5.2. 学生评语详情 
var getCommentDetail = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'comment/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'detail', data0, callback);
}
//5.3. 保存学生评语
var getCommentSave = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'comment/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'save', data0, callback);
}
//5.4. 删除评语记录
var getCommentDelete = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'comment/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'delete', data0, callback);
}
//5.5. 根据学生条件查询评语记录-对应APP端新增时上一个下一个功能
var getCommentDetailByStudent = function(data0, callback) {
	var tempAttendUrl1 = window.storageKeyName.STUDENTMANAGE + 'comment/';
	data0 = extendParameter1(data0);
	xhrPost(tempAttendUrl1 + 'detailByStudent', data0, callback);
}