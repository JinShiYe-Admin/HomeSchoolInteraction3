/**
 * 打开文件
 */
var playutil = (function(mod) {

	/**
	 * 检测是否支持video标签
	 * true,支持
	 */
	mod.checkVideo = function() {
		if(!!document.createElement('video').canPlayType) {
			var vidTest = document.createElement("video");
			oggTest = vidTest.canPlayType('video/ogg; codecs="theora, vorbis"');
			if(!oggTest) {
				h264Test = vidTest.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
				if(!h264Test) {
					return false;
				} else {
					if(h264Test == "probably") {
						return true;
					} else {
						return false;
					}
				}
			} else {
				if(oggTest == "probably") {
					return true;
				} else {
					return false;
				}
			}
		} else {
			return false;
		}
	}

	/**
	 * 安卓播放视频
	 * @param {Object} videoUrl
	 */
	mod.playVideoAndroid = function(videoUrl) {
		if(plus.os.name == 'Android') {
			//注意事项，Android上使用video标签播放视频时，务必打开硬件加速，否则只有声音没有画面。
			//因为在Android5的部分rom上是默认关闭硬件加速的，此时需强制打开硬件加速。创建webview时style里有个hardwareAccelerated参数，设置为true。
			if(!plus.webview.defaultHardwareAccelerated()) {
				var webview = plus.webview.currentWebview(); //获取当前窗体对象
				webview.style.hardwareAccelerated = true; //安卓必须开启硬件加速
			}
			var Intent = plus.android.importClass("android.content.Intent");
			var Uri = plus.android.importClass("android.net.Uri");
			var activity = plus.android.runtimeMainActivity();
			var intent = new Intent(Intent.ACTION_VIEW);
			var uri = Uri.parse(videoUrl);
			intent.setDataAndType(uri, "video/*");
			try {
				activity.startActivity(intent);
			} catch(e) {
				alert('### ERROR ### 安卓调用应用 name:' + e.name + " message:" + e.message);
			}
		} else {
			//console.log('### ERROR ### ' + plus.os.name);
		}
	}

	/**
	 * 打开某个文件
	 * @param {Object} fpath 文件路径
	 * @param {Object} errorCallback 失败的回调
	 */
	mod.openFile = function(fpath, errorCallback) {
		try {
			plus.runtime.openFile(fpath, '', function(error) {
				//console.log('打开文件失败:' + JSON.stringify(error));
				if(plus.os.name == 'Android') {
					mod.openFileAndroid(fpath, function(text) {
						errorCallback(text);
					});
				} else {
					errorCallback('打开文件失败 调用第三方程序失败');
				}
			});
		} catch(e) {
			errorCallback('### ERROR ### H5+打开文件 name:' + e.name + " message:" + e.message);
		}
	}

	/**
	 * 安卓打开某个应用
	 * @param {Object} fpath 文件路径
	 * @param {Object} errorCallback 失败的回调
	 */
	mod.openFileAndroid = function(fpath, errorCallback) {
		if(plus.os.name == 'Android') {
			var Intent = plus.android.importClass("android.content.Intent");
			var Uri = plus.android.importClass("android.net.Uri");
			var activity = plus.android.runtimeMainActivity();
			var intent = new Intent(Intent.ACTION_VIEW);
			var uri = Uri.parse(fpath);
			var type = mod.MIMETypeAndroid(fpath);
			intent.setDataAndType(uri, type);
			try {
				activity.startActivity(intent);
			} catch(e) {
				errorCallback('### ERROR ### 安卓调用应用 name:' + e.name + " message:" + e.message);
			}
		} else {
			//console.log('### ERROR ### ' + plus.os.name);
		}
	}

	/**
	 * 返回 MIME Type
	 * @param {Object} fpath
	 */
	mod.MIMETypeAndroid = function(fpath) {
		////console.log('MIMEType:' + fpath);
		var MIMEType = '*/*';
		var nameList = fpath.split(".");
		var type = nameList[nameList.length - 1];
		type = type.toLowerCase(); //转换为小写
		////console.log('MIMEType type ' + type);
		switch(type) {
			case 'avi': //视频类型
			case 'mp4':
			case 'flv':
			case 'swf':
			case '3gp':
			case 'rm':
			case 'wma':
			case 'asf':
			case 'wmv':
			case 'rmvb':
				MIMEType = 'video/*';
				break;
			case 'psd': //图片类型
			case 'jpeg':
			case 'jpg':
			case 'png':
			case 'gif':
			case 'webp':
			case 'tiff':
			case 'bmp':
			case 'cod':
			case 'cal':
			case 'dcx':
			case 'eri':
			case 'jpe':
			case 'jpz':
				MIMEType = 'image/*';
				break;
			case 'cda': //音频类型
			case 'wav':
			case 'cda':
			case 'aif':
			case 'aiff':
			case 'au':
			case 'mp1':
			case 'mp2':
			case 'mp3':
			case 'ra':
			case 'rm':
			case 'ram':
			case 'mid':
			case 'Rmi':
				MIMEType = 'audio/*';
				break;
			default:
				//console.log('MIME-Type 不匹配');
				break;
		}
		////console.log('MIMEType ' + type);
		return MIMEType;
	}

	/**
	 * 根据时间返回对应的百分比
	 * @param {Object} num
	 * @return percent 百分比
	 */
	mod.audioTimePercent = function(num) {
		num = num || 1; //默认1s
		if(num <= 1) {
			return 25;
		} else if(1 < num && num <= 10) {
			return 25 + (((num - 1) / 9) * 25).toFixed(2) * 1;
		} else if(10 < num && num <= 60) {
			return 50 + (((num - 10) / 50) * 25).toFixed(2) * 1;
		} else if(60 < num && num <= 300) {
			return 75 + (((num - 60) / 240) * 25).toFixed(2) * 1;
		} else {
			return 100;
		}
	}

	return mod;
})(window.playutil || {});