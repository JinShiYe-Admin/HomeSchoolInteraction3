//出错的监听
window.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
	console.log("---ERROR---start---");
	console.log("错误信息-0:" + JSON.stringify(errorMessage.detail));
	console.log("错误信息-1:" + errorMessage);
	console.log("出错文件:" + scriptURI);
	console.log("出错行号:" + lineNumber);
	console.log("出错列号:" + columnNumber);
	console.log("错误详情:" + errorObj);
	console.log("---ERROR---end---");
}

//公共方法
var utils = (function(mod) {
	//设置app角标,flag=0直接设置角标数字，flag=1角标减1,falg=2角标加1
	mod.setBadgeNumber = function(flag, count) {
		if(flag == 0) {
			store.set(window.storageKeyName.BADGENUMBER, count);
			plus.runtime.setBadgeNumber(count);
		} else if(flag == 1) {
			var badgeNumber = store.get(window.storageKeyName.BADGENUMBER);
			badgeNumber--;
			if(badgeNumber >= 0) {

			} else {
				badgeNumber = 0;
			}
			store.set(window.storageKeyName.BADGENUMBER, badgeNumber);
			plus.runtime.setBadgeNumber(badgeNumber);
		} else if(flag == 2) {
			var badgeNumber = store.get(window.storageKeyName.BADGENUMBER);
			badgeNumber++;
			store.set(window.storageKeyName.BADGENUMBER, badgeNumber);
			plus.runtime.setBadgeNumber(badgeNumber);
		}
	}
	
	//是否可以新增修改，flag=0只班主任，flag=1班主任和任课老师都可以
	mod.canNotAddModify = function(flag) {
		var personal = store.get(window.storageKeyName.PERSONALINFO);
		var tempFlag = 0;
		for (var i = 0; i < personal.clss.length; i++) {
			var tempModel = personal.clss[i];
			if (flag == 0) {
				//是班主任，并且班级没有毕业
				if (tempModel.isms == 1&&tempModel.isfinish == 0) {
					tempFlag++;
				}
			} else{
				//班级没有毕业
				if (tempModel.isfinish == 0) {
					tempFlag++;
				}
			}
		}
		if(tempFlag>0) {
			return true;
		}
		return false;
	}

	mod.getUUID = function() {
		var s = [];
		var hexDigits = "0123456789abcdef";
		for(var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = "-";

		var uuid = s.join("");
		return uuid;
	}
	//判断是否安卓系统
	mod.isAndroid = function() {
		var u = navigator.userAgent;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
		return isAndroid;
	}
	//判断是否ios系统
	mod.isiOS = function() {
		var u = navigator.userAgent;
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		return isiOS;
	}

	/**
	 * 获取url中的数据
	 * @param {String} url
	 */
	mod.getDataFromUrl = function(url) {
		var data = {};
		var index = url.indexOf("&");
		if(index != -1) {
			var dataStr = url.substring(index + 6, url.length);
			console.log("getDataFromUrl dataStr " + dataStr);
			data = JSON.parse(decodeURIComponent(dataStr));
		}
		console.log("getDataFromUrl url " + url);
		console.log("getDataFromUrl data " + JSON.stringify(data));
		return data;
	}

	/**
	 * 用mui打开一个页面，通过url传递数据
	 * @param {String} url 路径
	 * @param {Object} data 数据对象
	 */
	mod.mOpenWithData = function(url, data) {
		data = data || {};
		var ids = url.split("/");
		var dataStr = JSON.stringify(data);
		console.log("mOpen " + url + ' ' + dataStr);
		mui.openWindow(url + "?v=" + Math.random() + "&data=" + encodeURIComponent(dataStr), ids[ids.length - 1]);
	}

	/**
	 * 用window打开一个页面，通过url传递数据
	 * @param {String} url 路径
	 * @param {Object} data 数据对象
	 */
	mod.wOpenWithData = function(url, data) {
		data = data || {};
		var ids = url.split("/");
		var dataStr = JSON.stringify(data);
		console.log("wOpen " + url + ' ' + dataStr);
		window.open(url + "?v=" + Math.random() + "&data=" + encodeURIComponent(dataStr), ids[ids.length - 1]);
	}

	/**
	 *初始化mui的scrollY
	 * @param {Object} muiString
	 */
	mod.muiInitScrollY = function(muiString) {
		muiString = muiString || ".mui-scroll-wrapper";
		mui(muiString).scroll({
			scrollY: true, //是否竖向滚动
			scrollX: false, //是否横向滚动
			indicators: true, //是否显示滚动条
			deceleration: 0.003, //阻尼系数,系数越小滑动越灵敏
			bounce: true, //是否启用回弹
		});
	}

	/**
	 * 判断数据是否是undefined，null,""
	 * @param {Object} data
	 */
	mod.checkData = function(data) {
		if(data !== undefined && data !== null && data !== "") {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 给头像添加默认值
	 * @param {Object} string 传过来的头像url
	 * @param {Object} flag 当前调用界面对于默认头像的层级关系
	 */
	mod.updateHeadImage = function(string, flag) {
		var tempStr = '';
		//判断img是否为null，或者空
		if(string == '' || string == null || string == 'null' || string == undefined) { //赋值
			switch(flag) {
				case 0:
					tempStr = 'image/utils/default_personalimage.png';
					break;
				case 1:
					tempStr = '../image/utils/default_personalimage.png';
					break;
				case 2:
				default:
					tempStr = '../../image/utils/default_personalimage.png';
					break;
				case 3:
					tempStr = '../../image/utils/default_personalimage.png';
					break;
			}
		} else {
			tempStr = string;
		}
		return tempStr;
	}

	/**
	 * 获取时间 YYYY-MM-DD HH-MM-SS(2017-9-8 11:56:40)
	 */
	mod.getCurentTime = function() {
		var myDate = new Date();
		var year = myDate.getFullYear(); //年
		var month = myDate.getMonth() + 1; //月
		var day = myDate.getDate(); //日
		var hh = myDate.getHours(); //时
		var mm = myDate.getMinutes(); //分
		var ss = myDate.getSeconds(); //秒
		var clock = year + "-";
		if(month < 10) {
			clock += "0";
		}
		clock += month + "-";
		if(day < 10) {
			clock += "0";
		}
		clock += day + " ";
		if(hh < 10) {
			clock += "0";
		}
		clock += hh + ":";
		if(mm < 10) {
			clock += '0';
		}
		clock += mm + ":";
		if(ss < 10) {
			clock += '0';
		}
		clock += ss;
		return clock;
	}

	/**
	 * 格式化时间
	 * @param {String} data 201712061523
	 * @return {String} data 2017-12-06 15:23
	 */
	mod.initTime = function(data) {
		var year = data.substring(0, data.length - 8);
		var month = data.substring(data.length - 8, data.length - 6);
		var day = data.substring(data.length - 6, data.length - 4);
		var hour = data.substring(data.length - 4, data.length - 2);
		var minute = data.substring(data.length - 2);
		return year + "-" + month + "-" + day + " " + hour + ":" + minute;
	}

	/**
	 * href 打开一个页面，并保存SessionStorage数据
	 * @param {Object} data
	 */
	mod.hrefSessionStorage = function(url, data) {
		var sKey = new Date().getTime() + "" + parseInt(Math.random() * 1000);
		storageutil.setSessionStorage(sKey, JSON.stringify(data));
		location.href = url + "?sKey=" + sKey;
	}

	/**
	 * 通过url中的sKey,获取SessionStorage数据
	 * @return data
	 */
	mod.getSessionStorageByUrlsKey = function() {
		var search = location.search.toString();
		var keyword = "?sKey=";
		var index = search.indexOf(keyword);
		if(index != -1) {
			var sKey = search.substring(index + keyword.length);
			var sValue = storageutil.getSessionStorage(sKey)
			if(sValue) {
				var obj = JSON.parse(sValue);
				return obj;
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	/**
	 * 获取url中的key值
	 * @param {Object} key
	 */
	mod.getValueFromUrlByKey = function(key) {
		var search = location.search.toString();
		var keyword = "?" + key + "=";
		var index = search.indexOf(keyword);
		if(index != -1) {
			var value = search.substring(index + keyword.length);
			return value;
		} else {
			return null;
		}
	}

	/**
	 * 当前时间+随机数
	 */
	mod.timeAndRandom = function() {
		var value = new Date().getTime() + "" + parseInt(Math.random() * 1000);
		return value;
	}

	/**
	 * 判断是安卓还是苹果系统
	 */
	mod.getSystem = function() {
		var userAgent = window.navigator.userAgent.toLowerCase();
		if(userAgent.indexOf("iphone") != -1) {
			return "iOS";
		}
		if(userAgent.indexOf("ipod") != -1) {
			return "iOS";
		}
		if(userAgent.indexOf("ipad") != -1) {
			return "iOS";
		}
		if(userAgent.indexOf("android") != -1) {
			return "Android";
		}
		return "unknown";
	}
	/**
	 * 	获取参数
	 * @param {Object} url_string
	 * @param {Object} param
	 */
	mod.getUrlParam = function(url_string, param) {
		if(!url_string) {
			url_string = location.href;
		}
		try {
			var eurl = new URL(url_string);
			return eurl.searchParams.get(param);
		} catch(e) {
			param = param.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
			var regexS = "[\\?&]" + param + "=([^&#]*)";
			var regex = new RegExp(regexS);
			var results = regex.exec(url_string);
			return results == null ? null : results[1];
		}
	}

	return mod;
})(window.utils || {});