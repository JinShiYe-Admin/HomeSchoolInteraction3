/**
 * 录制视频
 * @author 莫尚霖
 */
var RecordVideo = (function(mod) {

	var recordEnable = true; //是否允许录制
	/**
	 * 初始化配置
	 * @param {Object} data
	 */
	mod.initOption = function(data) {
		//设置录像文件的路径
		var myDate = new Date();
		//路径
		var outPutPath = plus.io.convertLocalFileSystemURL('_documents/' + myDate.getTime() + parseInt(Math.random() * 1000) + '.mp4');
		//时间
		var time = window.storageKeyName.VIDEOLENGTH; //视频时长
		var options = mui.extend(true, {
			outPutPath: outPutPath,
			time: time
		}, data);
		//console.log('recordVideo initOption ' + JSON.stringify(options));
		return options;
	}

	/**
	 * 录制视频
	 * @param {Object} data json
	 * @param {Object} successCB 成功的回调
	 * @param {Object} errorCB 失败的回调
	 */
	mod.recordVideo = function(data, successCB, errorCB) {
		//限制快速多次点击
		if(!recordEnable) {
			return false;
		}
		recordEnable = false;
		setTimeout(function() {
			recordEnable = true;
		}, 2000);

		var options = mod.initOption(data);
		if(plus.os.name == 'Android') {
			mod.recordVideoAndroid(options, successCB, errorCB);
		} else if(plus.os.name == 'iOS') {
			mod.recordVideoInIOS(options, successCB, errorCB);
			//mod.recordVideoiOS(options, successCB, errorCB);
		} else {
			errorCB({
				code: plus.os.name, // 错误编码
				message: '功能暂未开放' // 错误描述信息
			});
		}
	}

	/**
	 * 录制视频H5
	 * @param {Object} data json
	 * @param {Object} successCB 成功的回调
	 * @param {Object} errorCB 失败的回调
	 */
	mod.recordVideoHtml = function(data, successCB, errorCB) {
		var cmr = plus.camera.getCamera();
		if(cmr) {
			try {
				cmr.startVideoCapture(function(capturedFile) {
					//console.log('录制成功 ' + fpath);
					successCB(capturedFile);
				}, function(error) {
					if(error != 'null') {
						//console.log('录制失败 ' + JSON.stringify(error));
						errorCB({
							code: error.code, // 错误编码
							message: error.message // 错误描述信息
						});
					} else {
						//console.log('未录制视频 ' + JSON.stringify(error));
					}
				}, {});
			} catch(e) {
				alert('### ERROR ### 录制视频异常 name:' + e.name + " message:" + e.message);
				errorCB({
					code: 'ERROR', // 错误编码
					message: '录制视频异常' // 错误描述信息
				});
			}

		} else {
			errorCB({
				code: 'NULL', // 错误编码
				message: '获取摄像头失败' // 错误描述信息
			});
		}
	}
	/**
	 * 
	 * @param {Object} options
	 * @param {Object} successCB
	 * @param {Object} errorCB
	 */
	mod.recordVideoInIOS = function(options, successCB, errorCB) {
		console.log('recordVideoInIOS000000');
		var cmr = plus.camera.getCamera();
		var res = cmr.supportedVideoResolutions[1];
		var fmt = cmr.supportedVideoFormats[0];
		cmr.startVideoCapture(function(p) {
			var tempPath = plus.io.convertLocalFileSystemURL(p)
			var mVideo = document.createElement("video");
			plus.io.resolveLocalFileSystemURL(p, function(entry) {
				entry.file(function(file) {
					console.log('recordVideoInIOS000003:' + JSON.stringify(file));
					mVideo.setAttribute('src', file.fullPath);
					mVideo.addEventListener('durationchange', function() {
						console.log('recordVideoInIOS000004:' + mVideo.duration);
						//console.log("ondurationchange  duration " + mVideo.duration);
						if(mVideo.duration < 60 * 5 + 1) {
							//console.log('成功：' + tempPath);
							successCB("file://" + tempPath)
						} else {
							errorCB({
								code: 999, // 错误编码
								message: '视频时长不得超出五分钟' // 错误描述信息
								//					mui.toast("视频时长不得超出10秒");
							})
						}
					});
				});
			}, function(e) {
				outLine('读取录像文件错误：' + e.message);
			});
		}, function(e) {
			if(e.code != 2) {
				errorCB({
					code: 'ERROR', // 错误编码
					message: '录制视频异常' // 错误描述信息
				});
			}
		}, {
			filename: '_doc/camera/'
		});
		//		cmr.startVideoCapture(function(p) {
		//			console.log('recordVideoInIOS000001:'+p);
		//				var tempPath = plus.io.convertLocalFileSystemURL(p)
		//				var mVideo = document.createElement("video");
		//				console.log('tempPath:'+tempPath);
		//				plus.io.resolveLocalFileSystemURL("file://" + tempPath, function(entry) {
		//					console.log('recordVideoInIOS000002');
		//					entry.file(function(file) {
		//						console.log('recordVideoInIOS000003');
		//						//console.log('filesize=' + file.size)
		////						if(file.size > 1048576 * 30) {
		////							//						mui.toast('视频大小不得超过30M');
		////							errorCB({ 
		////								code: 999, // 错误编码
		////								message: '视频大小不得超过30M' // 错误描述信息
		////							});
		////						} else {
		//							//console.log(123)
		//							mVideo.ondurationchange = function() {
		//								console.log('recordVideoInIOS000004');
		//								//console.log("ondurationchange  duration " + mVideo.duration);
		//								if(mVideo.duration < 60*5+1) {
		//									console.log('recordVideoInIOS000005');
		//									//console.log('成功：' + tempPath);
		//									successCB("file://" + tempPath)
		//
		//								} else {
		//									console.log('recordVideoInIOS000006');
		//									errorCB({
		//										code: 999, // 错误编码
		//										message: '视频时长不得超出五分钟' // 错误描述信息
		//										//					mui.toast("视频时长不得超出10秒");
		//									})
		//								}
		//
		//							}
		//							console.log('recordVideoInIOS000007');
		//							mVideo.onerror = function() {
		//								mui.toast("视频加载失败")
		//							}
		//							mVideo.src = tempPath;
		////						}
		//
		//					})
		//				})
		//
		//			},
		//			function(e) {
		//				//console.log('### ERROR ### 录制视频异常 name:' + e.code + " message:" + e.message);
		//				if(e.code != 2) {
		//					errorCB({
		//						code: 'ERROR', // 错误编码
		//						message: '录制视频异常' // 错误描述信息
		//					});
		//				}
		//			}, {
		//				filename: '_documents/' + (new Date()).getTime() + parseInt(Math.random() * 1000) + '.mp4',
		//				index: 1,
		//				resolution: res,
		//				format: fmt
		//			});

	}

	/**
	 * 录制视频Android
	 * @param {Object} options json
	 * @param {Object} successCB 成功的回调
	 * @param {Object} errorCB 失败的回调
	 */
	mod.recordVideoAndroid = function(options, successCB, errorCB) {
		var File = plus.android.importClass("java.io.File");
		var Uri = plus.android.importClass("android.net.Uri");
		var MediaStore = plus.android.importClass("android.provider.MediaStore");
		var Intent = plus.android.importClass("android.content.Intent");
		var intent = new Intent(MediaStore.ACTION_VIDEO_CAPTURE);
		var file = new File(options.outPutPath);
		var direct = plus.io.convertLocalFileSystemURL('_documents');
		var file2 = new File(direct);
		file2.mkdir();
		var outPutUri = Uri.fromFile(file);
		intent.putExtra(MediaStore.EXTRA_OUTPUT, outPutUri); //录像输出位置
		//		intent.putExtra(MediaStore.EXTRA_VIDEO_QUALITY, 0); //0 最低质量, 1高质量(不设置,10M;0,几百KB;1,50M)
		intent.putExtra(MediaStore.EXTRA_DURATION_LIMIT, options.time); //控制录制时间单位秒
		//		intent.putExtra(MediaStore.EXTRA_SIZE_LIMIT, size * 1024 * 1024L);//限制大小
		console.log("options.time==================" + options.time+"，direct============"+direct);
		var main = plus.android.runtimeMainActivity();
		main.startActivityForResult(intent, window.storageKeyName.CODERECORDVIDEO);
		//第一个参数：一个Intent对象，用于携带将跳转至下一个界面中使用的数据，使用putExtra(A,B)方法，此处存储的数据类型特别多，基本类型全部支持。
		//第二个参数：如果> = 0,当Activity结束时requestCode将归还在onActivityResult()中。以便确定返回的数据是从哪个Activity中返回，用来标识目标activity。
		//与下面的resultCode功能一致，感觉Android就是为了保证数据的严格一致性特地设置了两把锁，来保证数据的发送，目的地的严格一致性。

		main.onActivityResult = function(requestCode, resultCode, data) {
			//第一个参数： 这个整数requestCode用于与startActivityForResult中的requestCode中值进行比较判断， 是以便确认返回的数据是从哪个Activity返回的。
			//第二个参数： 这整数resultCode是由子Activity通过其setResult() 方法返回。 适用于多个activity都返回数据时， 来标识到底是哪一个activity返回的值。
			//第三个参数： 一个Intent对象， 带有返回的数据。 可以通过data.getXxxExtra()方法来获取指定数据类型的数据，
			//停止录像
			//console.log('停止录像  ' + JSON.stringify(data));
			if(requestCode == window.storageKeyName.CODERECORDVIDEO) { //拍照的Activity的code
				if(resultCode == -1) { //成功
					//console.log('录像成功 ' + options.outPutPath);
					var path = 'file://' + options.outPutPath;
					successCB(path); //返回录像文件的位置
				} else if(resultCode == 0) { //未录像
					//console.log('未录像');
				} else {
					//console.log('录像失败 requestCode ' + requestCode + ' resultCode' + resultCode);
					errorCB({
						code: resultCode, // 错误编码
						message: '录像失败' // 错误描述信息
					});
				}
			}
		}
	}

	return mod;

})(window.RecordVideo || {});