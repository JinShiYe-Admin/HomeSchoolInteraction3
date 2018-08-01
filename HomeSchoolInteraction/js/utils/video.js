var video = (function(mod) {
	mod.recordVideo = function(data, successCB, errorCB) {
		var options = mod.initOption(data);
		if(plus.os.name == "Android") {
			recordVideoInAndroid(options, successCB, errorCB);
		} else {
			recordVideoInIOS(options, successCB, errorCB);
		}
	}
	mod.initOption = function(data) {
		//设置录像文件的路径
		var myDate = new Date();
		//路径
		var outPutPath = plus.io.convertLocalFileSystemURL('_documents/' + myDate.getTime() + parseInt(Math.random() * 1000) + '.mp4');
		//时间
		var time = 10; //默认10s
		var options = mui.extend(true, {
			outPutPath: outPutPath,
			time: time
		}, data);
		//console.log('recordVideo initOption ' + JSON.stringify(options));
		return options;
	}

	function recordVideoInIOS(options, successCB, errorCB) {
		var cmr = plus.camera.getCamera();
		var res = cmr.supportedVideoResolutions[1];
		var fmt = cmr.supportedVideoFormats[0];
		//console.log(res+'---'+fmt)
		cmr.startVideoCapture(function(p) {
				var tempPath = plus.io.convertLocalFileSystemURL(p)
				var mVideo = document.createElement("video");
				plus.io.resolveLocalFileSystemURL(p, function(entry) {
					entry.file(function(file) {
						//console.log('filesize=' + file.size)
//						if(file.size > 1048576 * 30) {
//							//						mui.toast('视频大小不得超过30M');
//							errorCB({
//								code: 999, // 错误编码
//								message: '视频大小不得超过30M' // 错误描述信息
//							});
//						} else {
							//console.log(123)
							mVideo.ondurationchange = function() {
								//console.log("ondurationchange  duration " + mVideo.duration);
								if(mVideo.duration < 60*5+1) {
									//console.log('成功：' + tempPath);
									successCB("file://" + tempPath)

								} else {
									errorCB({
										code: 999, // 错误编码
										message: '视频时长不得超出五分钟' // 错误描述信息
										//					mui.toast("视频时长不得超出10秒");
									})
								}

							}
							mVideo.onerror = function() {
								mui.toast("视频加载失败")
							}
							mVideo.src = tempPath;
//						}

					})
				})

			},
			function(e) {
				
				//console.log('### ERROR ### 录制视频异常 name:' + e.code + " message:" + e.message);
				if(e.code != 2) {
					errorCB({
						code: 'ERROR', // 错误编码
						message: '录制视频异常' // 错误描述信息
					});
				}
			
//				errorCB();
			}, {
				filename: '_documents/' + (new Date()).getTime() + parseInt(Math.random() * 1000) + '.mp4',
				index: 1,
				resolution: res,
				format: fmt
			});

	}

	function recordVideoInAndroid(options, successCB, errorCB) {
		var File = plus.android.importClass("java.io.File");
		var Uri = plus.android.importClass("android.net.Uri");
		var MediaStore = plus.android.importClass("android.provider.MediaStore");
		var Intent = plus.android.importClass("android.content.Intent");
		var intent = new Intent(MediaStore.ACTION_VIDEO_CAPTURE);
		var file = new File(options.outPutPath);
		var outPutUri = Uri.fromFile(file);
		intent.putExtra(MediaStore.EXTRA_OUTPUT, outPutUri); //录像输出位置
		//		intent.putExtra(MediaStore.EXTRA_VIDEO_QUALITY, 0); //0 最低质量, 1高质量(不设置,10M;0,几百KB;1,50M)
		intent.putExtra(MediaStore.EXTRA_DURATION_LIMIT, options.time); //控制录制时间单位秒

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
			//console.log("停止录像："+JSON.stringify(data.getData()))
			if(requestCode == window.storageKeyName.CODERECORDVIDEO) { //拍照的Activity的code
				if(resultCode == -1) { //成功
					//console.log('录像成功 ' + options.outPutPath);
					var path = 'file://' + options.outPutPath;
					successCB(path); //返回录像文件的位置
				} else {
					//console.log('录像失败 requestCode ' + requestCode + ' resultCode' + resultCode);
					errorCB({
						code: resultCode, // 错误编码
						message: '录像失败' // 错误描述信息
					});
				}
			}
		};
	}
	mod.playInAndroid = function(videoAddress, thumbPath, playCallback) {
		if(mui.os.android) {
			var Intent = plus.android.importClass("android.content.Intent");
			var Uri = plus.android.importClass("android.net.Uri");
			var main = plus.android.runtimeMainActivity();
			var intent = new Intent(Intent.ACTION_VIEW);
			var uri = Uri.parse(videoAddress);
			intent.setDataAndType(uri, "video/*");
			main.startActivityForResult(intent, storageKeyName.CODEPLAYVIDEO);
			main.onActivityResult = function(requestCode, resultCode, data) {
				if(requestCode == storageKeyName.CODEPLAYVIDEO) {
					//console.log("播放录像的回调code:" + resultCode);
					if(playCallback) {
						playCallback();
					}
				}
			}
		} else {
			//console.log("这里不是android,调用错误");
		}
	}
	mod.playInHTML = function(videoPath, thumbPath) {
		var player = document.getElementById("video-player");
		player.src = videoPath;
		player.poster = thumbPath;
		mui("#pop-video").popover("show");
		player.autoplay = "autoplay";
	}
	mod.stopPlayInHTML = function() {
		var player = document.getElementById("video-player");
		player.pause();
		player.src = "";
		player.poster = "";
		player.removeAttribute("autoplay");
	}
	mod.playVideo = function(videoPath, thumbPath, playCallback) {
		if(plus.os.name == "Android") {
			mod.playInAndroid(videoPath, thumbPath, playCallback);
		} else {
			//console.log('videoPath='+videoPath+','+thumbPath);
			ShowVideoUtil.showVideo(document.getElementById("video"), 'videoPopover', videoPath, thumbPath);
			if (playCallback) {
				playCallback();
			}
			
//			mod.playInHTML(videoPath,thumbPath);
//			mui.toast("功能暂未开放！")
		}
	}
	mod.initVideo = function() {
		var content = document.body;
		//console.log("******************加载video标签" + document.body.className);

		var win_width = content.clientWidth;
		var div = document.createElement("div");
		div.className = "mui-popover";
		div.id = "pop-video";
		div.style.cssText = "position:fixed;width:" + win_width + "px;height:" + (win_width / 4) * 3 + "px;top:20%;background-color:#494949;"
		//console.log("视频信息：" + win_width);
		//		document.querySelector(".mui-backdrop").style.backgroundColor="#000000";
		div.innerHTML = '<video id="video-player" webkit-playsinline playsinline style="width:' + win_width + 'px;height:' + win_width / 4 * 3 +
			'px;">your browser does not support the video tag</video>';
		//		//console.log("fragment.innerHTML"+fragment.innerHTML);
		content.insertBefore(div, content.querySelector(".mui-content"));
		//		//console.log("加完标签后的内容："+content.innerHTML);
	}
	return mod;
})(video || {})