//公共方法js
window.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
	console.log("错误信息-0:", errorMessage.detail);
	console.log("错误信息-1:" + errorMessage);
	console.log("出错文件:" + scriptURI);
	console.log("出错行号:" + lineNumber);
	console.log("出错列号:" + columnNumber);
	console.log("错误详情:" + errorObj);
	var webUrl = window.location.toString();
	var ids = webUrl.split("/");
	var webId = ids[ids.length - 1];
	var showAlert = false;
	switch(webId) { //主页，预加载的页面
		case "firstPage.html": //初始页
		case "index.html": //主页
		case "cloud_home.html": //云盘主页
		case "sciedu_home.html": //科教主页
		case "show-home.html": //展现主页
		case "show-attended.html": //展现关注
		case "show-all.html": //展现全部
		case "course-home.html": //微课主页
		case "course-attended.html": //课程关注
		case "course-all.html": //课程全部
		case "storage_transport.html": //预加载-传输列表页
		case "sciedu_show_main.html": //预加载-科教新闻详情页
			break;
		default:
			showAlert = true;
			break;
	}
	var isMuiLazyError = false; //是否是mui懒加载的BUG
	if(errorMessage.detail != undefined) {
		//mui懒加载的BUG的判断逻辑
		if(errorMessage.detail["element"] != undefined && errorMessage.detail["uri"] != undefined) {
			if(errorMessage.detail["element"]["_mui_lazy_width"] != undefined || errorMessage.detail["element"]["_mui_lazy_height"] != undefined) {
				isMuiLazyError = true;
			}
		}
	}
	if(!scriptURI) {
		return;
	}
	if(window.plus) {
		if(isMuiLazyError) {
			return;
		}
		if(showAlert) {
			console.log("界面id:" + plus.webview.currentWebview().id);
			plus.nativeUI.alert('当前界面加载出现错误', function() {
				console.log("界面id:" + webId);
				plus.webview.close(webId, events.getAniClose());
			}, 'ERROR', '确定');
		} else {
			plus.nativeUI.toast('当前界面加载出现错误');
		}
		plus.nativeUI.closeWaiting();
	} else {
		window.alert("当前界面加载出现错误");
	}
}

var events = (function(mod) {

	mod.click = false; //是否是点击状态
	mod.clickTime = 1000; //点击持续时间，默认1秒

	//判断输入字符串是否为空或者全部都是空格
	mod.isNull = function(str) {
		if(str == "") return true;
		var regu = "^[ ]+$";
		var re = new RegExp(regu);
		return re.test(str);
	}
	
		//短信群发
	mod.SendSmsForMobiles = function(mobiles,content) {
		console.log('mobiles:'+mobiles);
		console.log('content:'+content);
		var personal = store.get(window.storageKeyName.PERSONALINFO);
		var publicParameter = store.get(window.storageKeyName.PUBLICPARAMETER);
		content = content + '[' +personal.utname+']';
		var enData0 = {};
		//不需要加密的数据
		var comData0 = {
			uuid: publicParameter.uuid, //用户设备号
			utoken: personal.utoken, //用户令牌
			content: content, //发送的内容,不超过300汉字
			mobiles: mobiles, //手机号码组,多个用逗号隔开
			appid: publicParameter.appid //系统所分配的应用ID
		}
		//发送网络请求，data为网络返回值
		postDataEncry('SendSms', enData0, comData0, 0, function(data) {
			
		});
	}

	/**
	 * 打开新界面
	 * @param {Object} targetPage 目标界面
	 */
	mod.openNewWindow = function(tarPagePath) {
		if(mod.click) {
			return false;
		}
		mod.click = true;
		setTimeout(function() {
			mod.click = false;
		}, mod.clickTime);

		var tarPageIds = tarPagePath.split('/');
		var targetPage = plus.webview.getWebviewById(tarPageIds[tarPageIds.length - 1]);
		//console.log('targetPage是否存在:' + Boolean(targetPage))
		if(targetPage) {
			targetPage.show('slide-in-right', 250);
		} else {
			mui.openWindow({
				url: tarPagePath,
				id: tarPageIds[tarPageIds.length - 1],
				show: {
					anishow: 'slide-in-right',
					duration: 250
				},
				waiting: {
					title: '正在加载...'
				},
				styles: mod.getWebStyle(tarPagePath)
			})
		}

	}
	/**
	 * 打开新页面时，同时传值
	 * 扩展参数仅在打开新窗口时有效，若目标窗口为预加载页面，
	 * 则通过mui.openWindow方法打开时传递的extras参数无效。
	 * @param {Object} targetHTML 新页面路径
	 * @param {Object} passData 获取要传的值
	 */
	mod.openNewWindowWithData = function(targetHTML, passData) {
		if(mod.click) {
			return false;
		}
		mod.click = true;
		setTimeout(function() {
			mod.click = false;
		}, mod.clickTime);
		mui.openWindow({
			url: targetHTML,
			id: targetHTML.split('/')[targetHTML.split('/').length - 1],
			extras: {
				data: passData
			},
			show: {
				anishow: 'slide-in-right',
				duration: 250
			},
			waiting: {
				title: '正在加载...'
			},
			createNew: true,
			styles: mod.getWebStyle(targetHTML)
		});
	};
	/**
	 * 预加载单个页面 在mui.plusReady里调用
	 * @param {Object} tarPage 页面路径
	 * @param {Object} interval 延迟加载时间间隔 单位毫秒 ，不输入默认为0
	 */
	mod.preload = function(tarPage, interval, navBarStyle) {

		if(!interval) {
			interval = 0;
		}
		var styles
		if(navBarStyle) {
			styles = mod.getNavBarStyle(navBarStyle);
		} else {
			styles = mod.getWebStyle(tarPage);
		}

		//console.log("预加载的页面：" + tarPage)
		if(!plus.webview.getWebviewById(tarPage)) {
			//初始化预加载详情页面
			setTimeout(function() {
				mui.preload({
					url: tarPage,
					id: tarPage.split('/')[tarPage.split('/').length - 1], //默认使用当前页面的url作为id
					styles: styles,
					show: {
						anishow: 'slide-in-right',
						duration: 250
					},

					waiting: {
						title: '正在加载...'
					}
				})
			}, interval)
		}
	}
	/**
	 * 获取样式
	 */
	mod.getNavBarStyle = function(navBarStyle) {
		var extraStyle = {
			backgroundColor: "#13b7f6",
			titleColor: "#FFFFFF",
			backButton: {
				color: "#FFFFFF",
				colorPressed: "#0000FF"
			}
		}
		mui.extend(navBarStyle, extraStyle);
		return mui.extend({
			navigationbar: navBarStyle
		}, mod.getWebStyle());
	}
	/**
	 * 如果目标页面未加载,需要先预加载页面
	 * 传递数值到指定页面并打开页面
	 * @param {Object} tarpage 目标页面Id
	 * @param {Object} listener 监听事件
	 * @param {Object} getDatas 获取数据的方法  return somthing
	 */
	mod.fireToPage = function(tarPage, listener, getDatas) {
		//			//console.log('tarPage:' + tarPage);
		tarPage = tarPage.split('/')[tarPage.split('/').length - 1];
		var targetPage = null;
		//获得目标页面
		if(!targetPage) {
			targetPage = plus.webview.getWebviewById(tarPage);
			//				//console.log(typeof(targetPage))
		}
		//触发目标页面的listener事件
		mui.fire(targetPage, listener, {
			data: getDatas()
		});
		//console.log('要传的值是：' + JSON.stringify(getDatas()))
		targetPage.show('slide-in-right', 250)
	}
	/**
	 * 如果目标页面未加载,需要先预加载页面
	 * 传递数值到指定页面并打开页面
	 * @param {Object} tarpage 目标页面Id
	 * @param {Object} listener 监听事件
	 * @param {Object} datas 要传递的数据
	 */
	mod.fireToPageWithData = function(tarPage, listener, datas) {

		tarPage = tarPage.split('/')[tarPage.split('/').length - 1];
		console.log('tarPage:' + tarPage + ",listener:" + listener);
		var targetPage = null;
		//获得目标页面
		if(!targetPage) {
			targetPage = plus.webview.getWebviewById(tarPage);
		}
		//触发目标页面的listener事件
		mui.fire(targetPage, listener, {
			data: datas
		});
		targetPage.show('slide-in-right', 250);
	}
	/**
	 * 事件传递 不传数据 常用于 父子页面间
	 * @param {Object} tarPage 目标页面
	 * @param {Object} listener 事件
	 */
	mod.fireToPageNone = function(tarPage, listener, datas) {
		tarPage = tarPage.split('/')[tarPage.split('/').length - 1];
		if(typeof(datas) === "undefined") {
			datas = null;
		}
		console.log('tarPage:' + tarPage);
		var targetPage = null;
		//获得目标页面
		if(!targetPage) {
			targetPage = plus.webview.getWebviewById(tarPage);
		}
		if(targetPage) {
			//触发目标页面的listener事件
			mui.fire(targetPage, listener, {
				data: datas
			});
		} else {
			console.log('目标页面不存在' + tarPage);
		}

	}
	mod.infoChanged = function() {
		//console.log("@@@@@@@@@@@@@@@@@@@@@调用的时候的界面：" + plus.webview.currentWebview().id);
		events.fireToPageNone('../../index/mine.html', 'infoChanged');
		events.fireToPageNone('../cloud/cloud_home.html', 'infoChanged');
		mui.fire(plus.webview.getWebviewById("index.html"), 'infoChanged');
		events.fireToPageNone("course-all.html", "infoChanged");
		events.fireToPageNone("course-attended.html", "infoChanged");
		events.fireToPageNone("show-all.html", "infoChanged");
		events.fireToPageNone("show-attended.html", "infoChanged");
		events.fireToPageNone("show-home.html", "infoChanged");
		events.fireToPageNone("course-home.html", "infoChanged");
		events.fireToPageNone("sciedu_home.html", "infoChanged");
	}
	mod.shortForDate = function(fullDate) {
		var arrDate = fullDate.split(":");
		arrDate.splice(arrDate.length - 1, 1);
		var noSecond = arrDate.join(':');
		var arrSecond = noSecond.split('-');
		if(new Date().getFullYear() == arrSecond[0]) {
			arrSecond.splice(0, 1);
		}
		return arrSecond.join('-');
	}

	/**
	 * 将界面的焦点清除后再退出当前界面
	 */
	mod.blurBack = function() {
		var oldBack = mui.back;
		mui.back = function() {
			document.activeElement.blur();
			oldBack();
		}
	}
	/**
	 * 返回一个安卓手机返回键无法关闭的等待框
	 * @author 莫尚霖
	 * @param {Object} string 等待框显示的文字，默认'加载中...'
	 */
	mod.showWaiting = function(string) {
		var title = '加载中...';
		if(string) {
			title = string;
		}
		var showWaiting = plus.nativeUI.showWaiting(title, {
			back: 'none'
		});
		return showWaiting;
	}

	/**
	 * 关闭一个或所有的等待框
	 * @author 莫尚霖
	 * @param {Object} waiting 等待框对象
	 */
	mod.closeWaiting = function(waiting) {
		if(waiting) {
			waiting.close();
		} else {
			plus.nativeUI.closeWaiting();
		}
	}

	/**
	 * 理论上讲这个是设置方法名的方法
	 * @param {Object} filePath 图片路径
	 */
	mod.getFileNameByPath = function(filePath) {
		var filePaths = filePath.split(".");
		var fileName = filePaths[filePaths.length - 1];
		return new Date().getTime() + parseInt(Math.random() * 1000) + '.' + fileName;
	}
	/**
	 * 通过文件路径获取文件名
	 * @param {Object} filePath 文件路径
	 */
	mod.getFileName = function(filePath) {
		var paths = filePath.split("/");
		var path = paths[paths.length - 1];
		return path;
	}

	/**
	 *
	 * @param {Object} title 标题
	 * @param {Object} hint 提示语
	 * @param {Object} callback 确认回调
	 * @param {Object} cancelLog 取消打印信息
	 */
	mod.setDialog = function(title, hint, callback, cancelLog) {
		var btnArray = ['否', '是'];
		mui.confirm(hint, title, btnArray, function(e) {
			if(e.index == 1) {
				callback();
			} else {
				mui.toast(cancelLog)
			}
		}, "div");
	}

	mod.format = function(dateTime, format) {
		var o = {
			"M+": dateTime.getMonth() + 1, //month
			"d+": dateTime.getDate(), //day
			"h+": dateTime.getHours(), //hour
			"m+": dateTime.getMinutes(), //minute
			"s+": dateTime.getSeconds(), //second
			"q+": Math.floor((dateTime.getMonth() + 3) / 3), //quarter
			"S": dateTime.getMilliseconds() //millisecond
		};
		if(/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (dateTime.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for(var k in o) {
			if(new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	}

	/**
	 * 初始化强制隐藏键盘
	 * @author 莫尚霖
	 */
	mod.initHideKeyBoard = function() {
		if(plus.os.name == 'Android') {
			var Context = plus.android.importClass("android.content.Context");
			var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
			var main = plus.android.runtimeMainActivity();
			var inputManger = main.getSystemService(Context.INPUT_METHOD_SERVICE);
			var Focus = plus.android.invoke(main, 'getCurrentFocus');
			////console.log('invoke ' + plus.android.invoke(main, 'getCurrentFocus'));
			////console.log('invoke ' + plus.android.invoke(Focus, 'getWindowToken'));
			var WindowToken = plus.android.invoke(Focus, 'getWindowToken');
			var hideOption = {
				manger: inputManger,
				token: WindowToken,
				type: InputMethodManager.HIDE_NOT_ALWAYS
			}
			return hideOption;
		}
	}

	/**
	 * 强制隐藏键盘需要和initHideKeyBoard配合使用
	 * @author 莫尚霖
	 * @param {Object} hideOption initHideKeyBoard 返回的数据
	 */
	mod.hideKeyBoard = function(hideOption) {
		document.activeElement.blur();
		if(plus.os.name == 'Android') {
			hideOption.manger.hideSoftInputFromWindow(hideOption.token, hideOption.type);
		}
	}

	/**
	 * 默认webview的样式
	 * @param {Object} path  webView的id或者路径
	 */
	mod.getWebStyle = function(path) {
		var styles = {
			top: '0px',
			bottom: '0px',
			softinputMode: "adjustResize",
			hardwareAccelerated: false
		};
		if(path) {
			var ids = path.split('/');
			var id = ids[ids.length - 1];
			//安卓中video标签播放视频需要开启硬件加速
			//1.求知问题详情页
			//2.微课节次详情页
			//3.微课节次单个详情页
			if(id == "qiuzhi-question.html" || id == "course_details.html" || id == "course_section.html" || id == 'space-detail.html' || id == 'zone_main.html' || id == "sciedu_show_main.html" || "storage_show_video.html") {
				styles.hardwareAccelerated = true;
			}
			if(id == "show-home1.html") {
				styles.hardwareAccelerated = "auto";
			}
		}
		return styles;
	}
	/**
	 * 禁止使用回车
	 * @param {Object} elem  禁止使用回车的元素
	 */
	mod.fobidEnter = function(elem) {
		elem.onkeydown = function(event) {
			//console.log("键盘输入事件：" + JSON.stringify(event.keyCode))
			if(event.keyCode == 13) {
				return false;
			}
		}
	}
	/**
	 * actionsheet
	 * @param {Object} titleArray 各选项 格式如下[{title:选项1,dia：1需要显示dialog},{title:选项1,dia：0 或不填需要显示dialog}]
	 * @param {Object} cbArray 各选项回调方法数组，确认选择后的回调函数
	 */
	mod.showActionSheet = function(btnArray, cbArray) {
		var len = btnArray.length;
		plus.nativeUI.actionSheet({
			buttons: btnArray,
			cancel: "取消"
		}, function(e) {
			var index = e.index;
			//console.log("点击的index:" + index);
			if(index > 0) {
				if(btnArray[index - 1].dia) {
					mod.setDialog(btnArray[index - 1].title, "确定？", cbArray[index - 1], "已取消删除")
				} else {
					cbArray[index - 1]();
				}
			}
		})
	}

	/**
	 * 关闭某个webview
	 * @author 莫尚霖
	 * @param {Object} webview webview的id或object
	 * @param {Object} num 动画，默认页面从屏幕中横向向右侧滑动到屏幕外关闭
	 */
	mod.closeWebview = function(webview, num) {
		//关闭已经打开的Webview窗口，需先获取窗口对象或窗口id，并可指定关闭窗口的动画
		//若操作窗口对象已经关闭，则无任何效果。
		//使用窗口id时，则查找对应id的窗口，如果有多个相同id的窗口则操作最先打开的窗口，若没有查找到对应id的WebviewObject对象，则无任何效果。
		plus.webview.close(webview, mod.getAniClose(num));
	}

	/**
	 * 获取关闭的动画
	 * @author 莫尚霖
	 * @param {Object} num 类型，默认slide-out-right
	 */
	mod.getAniClose = function(num) {
		var aniClose = '';
		var type = num || 2; //默认2
		switch(type) {
			case 0:
				aniClose = 'auto';
				//自动选择显示窗口相对于的动画效果。
				break;
			case 1:
				aniClose = 'none';
				//立即关闭页面，无任何动画效果。 此效果忽略动画时间参数，立即关闭。
				break;
			case 2:
				aniClose = 'slide-out-right';
				//页面从屏幕中横向向右侧滑动到屏幕外关闭。
				//Android - 2.2+ (支持): 默认动画时间为200ms。
				//iOS - 5.1.1+ (支持): 默认动画时间为300ms。
				break;
			case 3:
				aniClose = 'slide-out-left';
				//页面从屏幕中横向向左侧滑动到屏幕外关闭。
				//Android - 2.2+ (支持): 默认动画时间为200ms。
				//iOS - 5.1.1+ (支持): 默认动画时间为300ms。
				break;
			case 4:
				aniClose = 'slide-out-top';
				//页页面从屏幕中竖向向上侧滑动到屏幕外关闭。
				//Android - 2.2+ (支持): 默认动画时间为200ms。
				//iOS - 5.1.1+ (支持): 默认动画时间为300ms。
				break;
			case 5:
				aniClose = 'slide-out-bottom';
				//页面从屏幕中竖向向下侧滑动到屏幕外关闭。
				//Android - 2.2+ (支持): 默认动画时间为200ms。
				//iOS - 5.1.1+ (支持): 默认动画时间为300ms。
				break;
			case 6:
				aniClose = 'fade-out';
				//页面从不透明到透明逐渐隐藏关闭。
				//Android - 2.2+ (支持): 默认动画时间为200ms。
				//iOS - 5.1.1+ (支持): 默认动画时间为300ms。
				break;
			case 7:
				aniClose = 'zoom-in';
				//页面逐渐向页面中心缩小关闭。
				//Android - 2.2+ (支持): 默认动画时间为100ms。
				//iOS - 5.1.1+ (支持): 默认动画时间为100ms。
				break;
			case 8:
				aniClose = 'zoom-fade-in';
				//页面逐渐向页面中心缩小并且从不透明到透明逐渐隐藏关闭。
				//Android - 2.2+ (支持): 默认动画时间为100ms。
				//iOS - 5.1.1+ (支持): 默认动画时间为100ms。
				break;
			case 9:
				aniClose = 'pop-out';
				//页面从屏幕右侧滑出消失，同时上一个页面带阴影效果从屏幕左侧滑入显示。
				//Android - 2.2+ (支持): 默认动画时间为200ms。
				//iOS - 5.1.1+ (支持): 默认动画时间为300ms。
				break;
			default:
				break;
		}
		return aniClose;
	}
	var firstTime = null;

	/**
	 * 一段时间内只允许运行一次方法,可用于打开新界面
	 * @param {Function} callback 要运行的方法
	 */
	mod.singleInstanceInPeriod = function(callback) {
		var secondTime = null;
		if(!firstTime) {
			firstTime = "1234";
			setTimeout(function() {
				firstTime = null;
			}, 2000);
		} else {
			secondTime = "123";
		}
		//console.log("第一次是否存在：" + firstTime + "第二次是否存在：" + secondTime);
		if(!secondTime) {
			callback();
		}
	}
	/**
	 * 打开新页面
	 * @param {Object} clickedItem
	 * @param {Object} webviewUrl
	 * @param {Object} data
	 */
	mod.singleWebviewInPeriod = function(clickedItem, webviewUrl, data) {
		var waiting = mod.showWaiting();
		if(!data) {
			data = "";
		}
		//		//console.log("当前点击控件是否可点击：" + clickedItem.disabled);
		var webviewSites = webviewUrl.split("/");
		var webviewId = webviewSites[webviewSites.length - 1];
		var targetWebview = plus.webview.create(webviewUrl, webviewId, mod.getWebStyle(webviewUrl), {
			data: data
		});
		targetWebview.onloaded = function() {
			targetWebview.show("slide-in-right", 250);
			setItemAble(clickedItem, targetWebview, waiting);
		}
	}
	var setItemAble = function(item, targetWeb, waiting) {
		//		//console.log("当前点击控件是否可点击：" + item.disabled);
		//console.log("targetWeb是否已显示：" + targetWeb.isVisible());
		setTimeout(function() {
			if(targetWeb.isVisible()) {
				setTimeout(function() {
					mod.closeWaiting(waiting);
					if(item) {
						item.disabled = false;
						jQuery(item).css("pointerEvents", "all");
					}
				}, 500)
			} else {
				setItemAble(item, targetWeb, waiting);
			}
		}, 500);
	}
	/**
	 * 判断子页面是否加载完成，然后传递数据并打开页面
	 * @param {Object} isReady 是否完成加载
	 * @param {Object} url 子页面路径
	 * @param {Object} lisetener 传递的事件
	 * @param {Object} data 传递的数据
	 */
	mod.readyToPage = function(isReady, url, lisetener, data) {
		console.log("是否已准备变形：" + isReady);
		//		if(isReady) {
		//console.log("要传递的数据：" + JSON.stringify(data));
		setTimeout(function() {
			mod.fireToPageWithData(url, lisetener, data);
		}, 500)

		//		} else {
		//			setTimeout(function() {
		//				mod.readyToPage(isReady, url, lisetener, data);
		//			}, 500)
		//		}
	}

	/**
	 * 显示视频时，如果不是WiFi环境弹出提示
	 */
	mod.playVideoCheckWeb = function() {
		var type = plus.networkinfo.getCurrentType();
		if(type != plus.networkinfo.CONNECTION_WIFI && type != plus.networkinfo.CONNECTION_NONE) {
			mui.toast("请注意当前不是WIFI环境");
		}
	}

	return mod;

})(events || {});