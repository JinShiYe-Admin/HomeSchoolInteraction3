var Gallery = (function(mod) {

	mod.pickVideoTime = window.storageKeyName.VIDEOLENGTH; //从本地选取的时长，默认10秒(未达到11S都算10S)
	mod.changeType = 1; //是否强制改变文件类型
	/**
	 * 从相册选取视频
	 * @param {Object} callBack 回调
	 */
	mod.pickVideo = function(callBack) {
		plus.gallery.pick(function(filePath) {
			var wd = '123';
			if(plus.os.name == 'iOS') {
				mod.videoInfo(wd, filePath, callBack);
			} else if(plus.os.name == 'Android') { //安卓
				mod.videoInfoAndroid(wd, filePath, callBack);
			}
		}, function(error) {
			mod.galleryPickError(error, function(err) {
				mui.toast("打开相册失败 " + entryErrorCB.message);
				callBack({
					flag: 0,
					message: "打开相册失败 " + err.message
				});
			});
		}, {
			filter: "video",
		});
	}

	/**
	 * 判断视频是否通过限定
	 * @param {Object} wd
	 * @param {Object} filePath
	 * @param {Object} callBack
	 */
	mod.videoInfoAndroid = function(wd, filePath, callBack) {

		//获取选取的视频文件对象
		plus.io.resolveLocalFileSystemURL(filePath, function(entry) {
			//1.判断大小
			entry.getMetadata(function(metadata) {
				var mVideo = document.createElement("video");
						mVideo.ondurationchange = function() {
							//console.log("视频时长 " + mVideo.duration);
							var rawNames = filePath.split("/");
							var rawName = rawNames[rawNames.length - 1]; //原名字
							if(mod.pickVideoTime==-1){
								//console.log("视频文件大小 " + metadata.size);
//								if(metadata.size > (30 * 1024 * 1024)) {
//									//console.log("视频大小不得大于30M");
//									wd.close();
//									mui.toast("视频大小不得大于30M");
//									callBack({
//										flag: 0,
//										message: "视频大小不得大于30M"
//									});
//									return false;
//								}
								var	path = "file://" + plus.io.convertLocalFileSystemURL(filePath);
								var callBackData = {
									flag: 1, //成功
									wd: wd, //成功才返回的等待框
									path: path, //视频文件路径
									video: mVideo, //video元素
									duration: mVideo.duration, //视频时长，单位秒
									rawName: rawName //原名字
								};
								//console.log("相册选取视频返回的数据 " + JSON.stringify(callBackData));
								callBack(callBackData);
							}else{
								if(mVideo.duration < (mod.pickVideoTime + 1)) {
									//console.log("视频文件大小 " + metadata.size);
	//								if(metadata.size > (30 * 1024 * 1024)) {
	//									//console.log("视频大小不得大于30M");
	//									wd.close();
	//									mui.toast("视频大小不得大于30M");
	//									callBack({
	//										flag: 0,
	//										message: "视频大小不得大于30M"
	//									});
	//									return false;
	//								}
	
									var	path = "file://" + plus.io.convertLocalFileSystemURL(filePath);
									var callBackData = {
										flag: 1, //成功
										wd: wd, //成功才返回的等待框
										path: path, //视频文件路径
										video: mVideo, //video元素
										duration: mVideo.duration, //视频时长，单位秒
										rawName: rawName //原名字
									};
									//console.log("相册选取视频返回的数据 " + JSON.stringify(callBackData));
									callBack(callBackData);
								} else {
//									wd.close();
									mui.toast("视频时长不得超出" + mod.pickVideoTime + "秒");
									callBack({
										flag: 0, //失败
										message: "视频时长不得超出" + mod.pickVideoTime + "秒" //失败信息
									});
								}
							}
						}
						mVideo.onerror = function() {
//							wd.close();
							mui.toast("视频加载失败");
							callBack({
								flag: 0,
								message: "视频加载失败"
							});
						}
						mVideo.src = filePath;
			}, function(metadataErrorCB) {
				//console.log("获取视频信息失败 " + JSON.stringify(metadataErrorCB));
//				wd.close();
				mui.toast("获取视频信息失败 " + metadataErrorCB.message);
				callBack({
					flag: 0,
					message: "获取视频信息失败 " + metadataErrorCB.message
				});
			});
		}, function(fileErrorCB) {
			//console.log("获取相册的视频文件对象失败 " + JSON.stringify(fileErrorCB));
//			wd.close();
			mui.toast("获取视频失败 " + fileErrorCB.message);
			callBack({
				flag: 0,
				message: "获取视频失败 " + fileErrorCB.message
			});
		});
	}

	/**
	 * 判断视频是否通过限定
	 * @param {Object} wd
	 * @param {Object} filePath
	 * @param {Object} callBack
	 */
	mod.videoInfo = function(wd, filePath, callBack) {

		//获取选取的视频文件对象
		plus.io.resolveLocalFileSystemURL(filePath, function(entry) {
			//1.判断大小
			entry.getMetadata(function(metadata) {
				//获取APP的_documents文件夹对象
				plus.io.resolveLocalFileSystemURL("_documents/", function(parentEntry) {
					var myDate = new Date();
					var copyName = myDate.getTime() + parseInt(Math.random() * 1000);
					var rawNames = filePath.split("/");
					var rawName = rawNames[rawNames.length - 1]; //原名字
					if(mod.changeType == 0) {
						var rawTypes = rawNames.split(".");
						var rawType = rawTypes[rawTypes.length - 1]; //原类型
						copyName = copyName + "." + rawType;
					} else {
						copyName = copyName + '.mp4';
					}
					//2.拷贝视频到_documents文件夹，并修改后缀为MP4
					entry.copyTo(parentEntry, copyName, function(entrySuccesCB) {
						//console.log("拷贝成功");
						//3.判断时长是否在N秒之内
						var mVideo = document.createElement("video");
						mVideo.ondurationchange = function() {
							//console.log("视频时长 " + mVideo.duration);
							if(mod.pickVideoTime==-1){
								//console.log("视频文件大小 " + metadata.size);
//								if(metadata.size > (30 * 1024 * 1024)) {
//									//console.log("视频大小不得大于30M");
//									wd.close();
//									mui.toast("视频大小不得大于30M");
//									callBack({
//										flag: 0,
//										message: "视频大小不得大于30M"
//									});
//									return false;
//								}
								var path = entrySuccesCB.fullPath;
								if(plus.os.name == "iOS") {
									path = "file://" + path;
								} else {
									path = "file://" + plus.io.convertLocalFileSystemURL(path);
								}
								var callBackData = {
									flag: 1, //成功
									wd: wd, //成功才返回的等待框
									path: path, //视频文件路径
									video: mVideo, //video元素
									duration: mVideo.duration, //视频时长，单位秒
									rawName: rawName //原名字
								};
								//console.log("相册选取视频返回的数据 " + JSON.stringify(callBackData));
								callBack(callBackData);
							}else{
								if(mVideo.duration < (mod.pickVideoTime + 1)) {
									//console.log("视频文件大小 " + metadata.size);
	//								if(metadata.size > (30 * 1024 * 1024)) {
	//									//console.log("视频大小不得大于30M");
	//									wd.close();
	//									mui.toast("视频大小不得大于30M");
	//									callBack({
	//										flag: 0,
	//										message: "视频大小不得大于30M"
	//									});
	//									return false;
	//								}
									var path = entrySuccesCB.fullPath;
									if(plus.os.name == "iOS") {
										path = "file://" + path;
									} else {
										path = "file://" + plus.io.convertLocalFileSystemURL(path);
									}
									var callBackData = {
										flag: 1, //成功
										wd: wd, //成功才返回的等待框
										path: path, //视频文件路径
										video: mVideo, //video元素
										duration: mVideo.duration, //视频时长，单位秒
										rawName: rawName //原名字
									};
									//console.log("相册选取视频返回的数据 " + JSON.stringify(callBackData));
									callBack(callBackData);
								} else {
									entrySuccesCB.remove(function(remSucCB) {
										//console.log("删除文件成功 " + remSucCB);
									}, function(remErrorCB) {
										//console.log("删除文件失败" + JSON.stringify(remErrorCB));
									});
									//console.log("视频时长不得超出" + mod.pickVideoTime + "秒");
									wd.close();
									mui.toast("视频时长不得超出" + mod.pickVideoTime + "秒");
									callBack({
										flag: 0, //失败
										message: "视频时长不得超出" + mod.pickVideoTime + "秒" //失败信息
									});
								}
							}
						}
						mVideo.onerror = function() {
							//console.log("视频加载失败");
							entrySuccesCB.remove(function(remSucCB) {
								//console.log("删除文件成功 " + remSucCB);
							}, function(remErrorCB) {
								//console.log("删除文件失败" + JSON.stringify(remErrorCB));
							});
							wd.close();
							mui.toast("视频加载失败");
							callBack({
								flag: 0,
								message: "视频加载失败"
							});
						}
						mVideo.src = entrySuccesCB.fullPath;
						//console.log("mVideo.src " + mVideo.src);
					}, function(entryErrorCB) {
						//console.log("拷贝视频失败 " + JSON.stringify(entryErrorCB));
						wd.close();
						mui.toast("视频处理失败 " + entryErrorCB.message);
						callBack({
							flag: 0,
							message: "视频处理失败 " + entryErrorCB.message
						});
					});
				}, function(parentEntryErrorCB) {
					//console.log("获取_documents目录对象失败 " + JSON.stringify(parentEntryErrorCB));
					wd.close();
					mui.toast("视频处理失败 " + entryErrorCB.message);
					callBack({
						flag: 0,
						message: "视频处理失败 " + entryErrorCB.message
					});
				});
			}, function(metadataErrorCB) {
				//console.log("获取视频信息失败 " + JSON.stringify(metadataErrorCB));
				wd.close();
				mui.toast("获取视频信息失败 " + metadataErrorCB.message);
				callBack({
					flag: 0,
					message: "获取视频信息失败 " + metadataErrorCB.message
				});
			});
		}, function(fileErrorCB) {
			//console.log("获取相册的视频文件对象失败 " + JSON.stringify(fileErrorCB));
			wd.close();
			mui.toast("获取视频失败 " + fileErrorCB.message);
			callBack({
				flag: 0,
				message: "获取视频失败 " + fileErrorCB.message
			});
		});
	}

	/**
	 * 从相册中选取文件失败
	 * @param {Object} error
	 * @param {Object} callBack
	 */
	mod.galleryPickError = function(error, errorCB) {
		if(plus.os.name == 'iOS') { //苹果
			if(error.code != -2) {
				//console.log('### ERROR ### 从相册选取图片失败 ' + JSON.stringify(error));
				errorCB({
					code: error.code, // 错误编码
					message: error.message // 错误描述信息
				});
			} else {
				//console.log('未选取文件');
			}
		} else if(plus.os.name == 'Android') { //安卓
			if(error.code != 12) {
				//console.log('### ERROR ### 从相册选取图片失败 ' + JSON.stringify(error));
				errorCB({
					code: error.code, // 错误编码
					message: error.message // 错误描述信息
				});
			} else {
				//console.log('未选取文件');
			}
		} else { //其他
			errorCB({
				code: error.code, // 错误编码
				message: plus.os.name + ' ' + error.message // 错误描述信息
			});
		}
	}
	return mod;
})(window.Gallery || {});