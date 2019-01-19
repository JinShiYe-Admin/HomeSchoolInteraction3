var CloudFileUtil = (function($, mod) {
	mod.files = [];
	/**
	 * 获取当前的网络连接状态
	 * @author 莫尚霖
	 * @param {Object} callback 回调callback(data)
	 */
	mod.getCurrentType = function(callback) {
		var num = plus.networkinfo.getCurrentType();
		var str = '';
		switch(num) {
			case plus.networkinfo.CONNECTION_UNKNOW: //0
				str = '网络连接状态未知';
				break;
			case plus.networkinfo.CONNECTION_NONE: //1
				str = '未连接网络';
				break;
			case plus.networkinfo.CONNECTION_ETHERNET: //2
				str = '有线网络';
				break;
			case plus.networkinfo.CONNECTION_WIFI: //3
				str = '无线WIFI网络';
				break;
			case plus.networkinfo.CONNECTION_CELL2G: //4
				str = '蜂窝移动2G网络';
				break;
			case plus.networkinfo.CONNECTION_CELL3G: //5
				str = '蜂窝移动3G网络';
				break;
			case plus.networkinfo.CONNECTION_CELL4G: //6
				str = '蜂窝移动4G网络';
				break;
		}
		var data = {
			code: num,
			type: str
		}
		callback(data);
	}

	/**
	 * 获取七牛下载的token
	 * @author 莫尚霖
	 * @param {Object} url 获取下载token路径
	 * @param {Object} data 配置的数据json
	 * @param {Object} successCB
	 * @param {Object} errorCB
	 * data={
	 * 	appId:'',//int 必填 项目id
	 *  urls:[]//array 必填 需要获取下载token文件的路径
	 * }
	 */
	mod.getQNDownToken = function(url, data, successCB, errorCB) {
		//console.log('getQNDownToken:url ' + JSON.stringify(data));
		//console.log('getQNDownToken:data ' + JSON.stringify(data));
		var desKey = ''; //项目名称
		var appId = 0; //项目id
		var urls = []; //需要获取下载token文件的路径
		var configure = {}; //配置的数据
		if(data) {
			if(data.appId) {
				appId = data.appId;
				desKey = getAppKey(appId);
			}
			if(data.urls) {
				urls = data.urls;
			}

		}
		if(desKey != '' && urls.length != 0) {
			configure.options = {
				AppID: appId,
				Param: encryptByDES(desKey, JSON.stringify(urls))
			}
			//console.log("参数数据：" + JSON.stringify(configure.options));
			mui.ajax(url, {
				async: false,
				data: configure.options,
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 60000, //超时时间设置为60秒
				success: function(data) {
					////console.log(JSON.stringify(data));
					successCB(data);
				},
				error: function(xhr, type, errorThrown) {
					//异常处理
					errorCB(xhr, type, errorThrown);
				}
			});

		} else {
			errorCB('### ERROR ### 配置获取七牛下载token参数错误');
		}
	}

	/**
	 * 创建下载任务
	 * @author 莫尚霖
	 * @param {Object} url 文件路径
	 * @param {Object} filename 下载到本地的路径
	 * @param {Object} uploadCompletedCallBack 下载完成时的回调
	 * @param {Object} onStateChangedCallBack 下载任务状态监听的回调
	 * @param {Object} successCallBack 下载任务创建成功的回调
	 */
	mod.download = function(url, filename, DownloadCompletedCallback, onStateChangedCallBack, successCallBack) {
		//console.log('download ' + url);
		//console.log('filename ' + filename);
		var dtask = plus.downloader.createDownload(url, {
				filename: filename //下载文件保存的路径
			},
			/**
			 * 下载完成时的回调
			 * @param {Object} download 下载任务对象
			 * @param {Object} status 下载结果状态码
			 */
			function(download, status) {
				// 下载完成
				DownloadCompletedCallback(download, status);
			}
		);
		//下载状态变化的监听
		dtask.addEventListener("statechanged",
			/**
			 * 下载状态变化的监听
			 * @param {Object} download 下载任务对象
			 * @param {Object} status 下载结果状态码
			 */
			function(download, status) {
				onStateChangedCallBack(download, status);
			}
		);
		successCallBack(dtask);
		//dtask.start();
	}

	/**
	 * 获取多个上传token
	 * @param {Object} data
	 * @param {Object} callBack
	 */
	mod.getUpLoadTokens = function(data, callBack) {
//		console.log("getUpLoadTokens " + JSON.stringify(data));
		var appId = data.appId; //项目id
		var desKey = getAppKey(appId); //项目名称
//		if (appId==8) {
//			appId = 4;
//		}
		var configure = {}; //配置的数据
		var params = []; //配置的参数信息

		if(data.type == "2" || data.type == "3") { //视频||音频
			configure.thumbKey = [];
		}
//		for(var i in data.fileArray) {
		for (var i = 0; i < data.fileArray.length; i++) {
			var filePaths = data.fileArray[i].split("/");
			var QNFileName = filePaths[filePaths.length - 1];
			var param = {
				Bucket: data.mainSpace,
				Key: data.uploadSpace + QNFileName,
				Pops: "",
				NotifyUrl: ""
			}
			switch(data.type) {
				case "0": //上传多个原文件
					break;
				case "2": //视频
					var uploadOptions = {
						type: 2
					}
					var opsData = getOptions(uploadOptions, data.uploadSpace, data.mainSpace, QNFileName);
					param.Pops = opsData.ops;
					configure.thumbKey.push(opsData.thumbKey);
					break;
				case "3": //音频
					var uploadOptions = {
						type: 3
					}
					var opsData = getOptions(uploadOptions, data.uploadSpace, data.mainSpace, QNFileName);
					param.Pops = opsData.ops;
					configure.thumbKey.push(opsData.thumbKey);
					break;
				default:
					break;
			}

//			console.log("参数数据 param " + JSON.stringify(param));
			params.push(param);
		}
		configure.options = {
			AppID: appId,
			Param: encryptByDES(desKey, JSON.stringify(params))
		}

//		console.log("参数数据：" + JSON.stringify(configure.options))
		//获取token
		mod.getQNUpTokenWithManage(window.storageKeyName.QNGETUPLOADTOKEN, configure.options, function(data) {
			callBack({
				code: data.Status, //1成功
				configure: configure, //配置信息
				data: data, //回调信息
				message: data.Message //回调说明
			})
		}, function(xhr, type, errorThrown) {
			callBack({
				code: 0,
				message: type
			});
		});
	}

	/**
	 * 获取上传到七牛的uptoken（单/多个文件的uptoken）
	 * 使用到的地方：1.个人头像2.资料头像3.群头像4.上传到云存储5.记事
	 * @author 莫尚霖
	 * @param {Object} url 获取token的url
	 * @param {Object} data 数据 json
	 * @param {Object} successCB 成功的回调successCB(data)
	 * @param {Object} errorCB 失败的回调errorCB(xhr, type, errorThrown);
	 * data={
	 * 	type:'',//str 必填 获取上传token的类型。0上传需要生成缩略图的文件；1上传文件；2上传需要生成缩略图的多个文件;3上传需要生成缩略图的多个视频文件；4上传多个音频文件
	 *  QNFileName:'',//str 必填 存放到七牛的文件名
	 * 	fileArray:[],//array 选填  type为2时有效，多个文件的路径
	 *  appId:'' , //int 必填 项目id
	 *  mainSpace:'', //str 必填 文件存放在私有空间或公有空间
	 *  uploadSpace: '',//str 必填  上传的空间（文件二级文件名）
	 *  imageThumb:'',//str json 选填 type为0时有效，缩略图存放在私有空间或公有空间，默认mainSpace
	 *  style:{ 	//json 选填 type为0，2时有效，配置生成缩略图的最大宽和高
	 * 		maxWidth:'', //int 选填 配置生成缩略图的最大宽,默认200
	 *  	maxHeight:'' //int 选填 配置生成缩略图的最大高，默认200
	 *  }
	 * }
	 */
	mod.getQNUpToken = function(url, data, successCB, errorCB) {
//		console.log('getQNUpToken ' + url + ' ' + JSON.stringify(data));
		var type = ''; //获取上传token的类型。0上传需要生成缩略图的文件；1上传文件
		var QNFileName = ''; //存放到七牛的文件名
		var fileList = []; //上传文件的路径
		var desKey = ''; //项目名称
		var appId = 0; //项目id
		var mainSpace = ''; //文件存放在私有空间或公有空间
		var imageThumb = ''; //缩略图存放在私有空间或公有空间
		var saveSpace = ''; //上传的空间
		var configure = {}; //配置的数据
		var maxWidth = '200'; //type为0时 缩略图默认宽为200
		var maxHeight = '200'; //type为0时 缩略图默认高为200

		if(data) {
			if(data.type) {
				type = data.type
				if(type == 0 || type == 2) {
					if(data.style) {
						if(data.style.maxWidth) {
							maxWidth = data.style.maxWidth
						}
						if(data.style.maxHeight) {
							maxHeight = data.style.maxHeight
						}
					}
				}
				if(type == 2 || type == 3 || type == 4) {
					if(data.fileArray) {
						fileList = data.fileArray;
					}
				}
			}
			if(data.QNFileName) {
				QNFileName = data.QNFileName;
			}
			if(data.appId) {
				appId = data.appId;
				desKey = getAppKey(appId);
			}
			if(data.mainSpace) {
				mainSpace = data.mainSpace;
			}
			if(data.imageThumb) {
				imageThumb = data.imageThumb;
			}
			if(imageThumb == '') {
				imageThumb = mainSpace;
			}
			if(data.uploadSpace) {
				saveSpace = data.uploadSpace;
			}
		}

		var thumbSpace = ''; //缩略图的七牛空间
		var ops = '' //七牛预持久化命令
		if(type == '0' || type == '1') {
			if(type == '0') {
				thumbSpace = saveSpace + 'Thumb/'; //缩略图的七牛空间
				var temp = QNFileName.split('.');
				//console.log(JSON.stringify(temp));
				var thumbName = temp[0];
				var thumbType = temp[1];
				if(thumbType == 'avi' || thumbType == 'mp4' || thumbType == 'flv' || thumbType == 'swf' || thumbType == '3gp' || thumbType == 'rm') {
					//视频
					configure.thumbKey = Qiniu.URLSafeBase64Encode(imageThumb + ":" + thumbSpace + thumbName + '.png');
					ops = "vframe/png/offset/1|saveas/" + configure.thumbKey;
				} else {
					//图片
					if(appId == 5) { //头像
						configure.thumbKey = Qiniu.URLSafeBase64Encode(imageThumb + ":" + thumbSpace + QNFileName);
					} else if(appId == 4) { //云存储
						configure.thumbKey = Qiniu.URLSafeBase64Encode(imageThumb + ":" + thumbSpace + thumbName + '.png');
					}
					ops = "imageView2/1/w/" + maxWidth + "/h/" + maxHeight + "/format/png|saveas/" + configure.thumbKey;
				}
			}

			var param = {
				Bucket: mainSpace,
				Key: saveSpace + QNFileName,
				Pops: ops,
				NotifyUrl: ''
			}
			//console.log("参数数据：" + JSON.stringify(param));

			configure.options = {
				AppID: appId,
				Param: encryptByDES(desKey, JSON.stringify(param))
			}
		} else if(type == '2') { //多个图片文件
			var params = [];
			configure.thumbKey = [];
			var uploadOptions = { //上传七牛后的处理参数
				type: 0, //处理类型 0：缩略图 1 裁剪 10 缩略图+裁剪
				thumbSize: {
					width: maxWidth, //缩略图最大宽度
					height: maxHeight //缩略图最大高度
				}
			}
			for(var i = 0; i < fileList.length; i++) {
				var QNFileName; //文件名
				var param = {};
				param.Bucket = mainSpace;
				//获取文件路径
				var filePaths = fileList[i].split("/");
				QNFileName = filePaths[filePaths.length - 1];
				param.Key = saveSpace + QNFileName;
				//console.log('key:' + param.Key);
				//获取处理参数
				var opsData = getOptions(uploadOptions, saveSpace, mainSpace, QNFileName);
				param.Pops = opsData.ops;
				param.NotifyUrl = '';
				//保存空间值
				params.push(param);
				configure.thumbKey.push(opsData.thumbKey);
			}

			configure.options = {
				AppID: appId,
				Param: encryptByDES(desKey, JSON.stringify(params))
			}
		} else if(type == '3') { //多个视频文件
			var params = [];
			configure.thumbKey = [];

			for(var i = 0; i < fileList.length; i++) {
				var uploadOptions = { //上传七牛后的处理参数
					type: 2, //处理类型 0：缩略图 1 裁剪 10 缩略图+裁剪
					thumbSize: {
						width: fileList[i].width, //缩略图最大宽度
						height: fileList[i].height //缩略图最大高度
					}
				}
				var QNFileName; //文件名
				var param = {};
				param.Bucket = mainSpace;
				//获取文件路径
				var filePaths = fileList[i].path.split("/");
				QNFileName = filePaths[filePaths.length - 1];
				param.Key = saveSpace + QNFileName;
				//console.log('key:' + param.Key);
				//获取处理参数
				var opsData = getOptions(uploadOptions, saveSpace, mainSpace, QNFileName);
				param.Pops = opsData.ops;
				param.NotifyUrl = '';
				//保存空间值
				params.push(param);
				configure.thumbKey.push(opsData.thumbKey);
			}

			configure.options = {
				AppID: appId,
				Param: encryptByDES(desKey, JSON.stringify(params))
			}
		} else if(type == '4') { //多个音频文件
			var params = [];
			configure.thumbKey = [];
			for(var i = 0; i < fileList.length; i++) {
				var uploadOptions = { //上传七牛后的处理参数
					type: 3, //处理类型 0：缩略图 1 裁剪 10 缩略图+裁剪
				}
				var QNFileName; //文件名
				var param = {};
				param.Bucket = mainSpace;
				//获取文件路径
				var filePaths = fileList[i].path.split("/");
				QNFileName = filePaths[filePaths.length - 1];
				param.Key = saveSpace + QNFileName;
				//console.log('key:' + param.Key);
				//获取处理参数
				var opsData = getOptions(uploadOptions, saveSpace, mainSpace, QNFileName);
				param.Pops = opsData.ops;
				param.NotifyUrl = '';
				//保存空间值
				params.push(param);
				configure.thumbKey.push(opsData.thumbKey);
			}
			configure.options = {
				AppID: appId,
				Param: encryptByDES(desKey, JSON.stringify(params))
			}
		}

//		console.log("参数数据：" + JSON.stringify(configure.options))
		//获取token
		mod.getQNUpTokenWithManage(url, configure.options, function(data) {
			successCB({
				configure: configure,
				data: data
			});
		}, function(xhr, type, errorThrown) {
			errorCB(xhr, type, errorThrown);
		});

	}

	/**
	 * 需要先加载qiniu.js,cryption.js,events.js,使用实例在publish-answer.js
	 * 配置获取上传token时需要上传的数据（传单张图片）
	 * @author 安琪
	 * @param {Object} picPath 图片本地路径
	 * @param {Object} appId AppID
	 * @param {Object} maxSize 最大长宽
	 * @param {Object} spaceType 空间类型0：公共空间 1:私有空间
	 * @param {Object} uploadSpace 上传的空间
	 * @return {Object} data data.options为获取token的参数之一，data.thumbKey为获取token后获取缩略图地址的key值
	 */
	mod.getSingleUploadDataOptions = function(picPath, appId, maxSize, spaceType, uploadSpace) {
		var data = {};
		var desKey = getAppKey(appId);
		var mainSpace;
		if(spaceType) {
			mainSpace = storageKeyName.QNPRISPACE; //七牛私有空间
		} else {
			mainSpace = storageKeyName.QNPUBSPACE; //七牛公共空间
		}
		var saveSpace = uploadSpace;
		var thumbSpace = saveSpace + 'thumb/';
		var QNFileName = events.getFileNameByPath(picPath);
		data.thumbKey = Qiniu.URLSafeBase64Encode(mainSpace + ":" + thumbSpace + QNFileName);
		var ops = "imageView2/1/w/" + maxSize + "/h/" + maxSize + "/format/png|saveas/" + data.thumbKey;
		var param = {
			Bucket: mainSpace,
			Key: saveSpace + QNFileName,
			Pops: ops,
			NotifyUrl: ''
		}
		//console.log("参数数据：" + JSON.stringify(param))
		data.options = {
			AppID: appId,
			Param: encryptByDES(desKey, JSON.stringify(param))
		}
		//console.log("加密后的信息：" + encryptByDES(desKey, JSON.stringify(param)));
		return data;
	}
	/**
	 * 需要先加载qiniu.js,cryption.js,events.js,使用实例在publish-answer.js
	 * 配置获取上传token时需要上传的数据（传单张图片 自定义参数）
	 * @author 安琪
	 * @param {Object} picPath 图片本地路径
	 * @param {Object} appId AppID
	 * @param {Object} spaceType 空间类型0：公共空间 1:私有空间
	 * @param {Object} saveSpace 上传的空间
	 * @param {Object} manageOptions 处理参数{
	 * 	type:0 // 0生成缩略图1裁剪 10缩略图和裁剪
	 * 	thumbSize {width height } 生成缩略图大小
	 * 	cropSize{width 生成缩略图的长（1-10000）
	 * 	height  宽（1-10000）
	 * 	offsX 水平偏移量
	 *	offsY} 垂直偏移量
	 * }
	 * @return {Object} data data.options为获取token的参数之一，data.thumbKey为获取token后获取缩略图地址的key值
	 */
	mod.getSingleImgUploadOptions = function(picPath, appId, spaceType, saveSpace, manageOptions) {
		var data = {};
		var desKey = getAppKey(appId);
		var mainSpace;
		if(spaceType) {
			mainSpace = storageKeyName.QNPRISPACE; //七牛私有空间
		} else {
			mainSpace = storageKeyName.QNPUBSPACE; //七牛公共空间
		}
		var QNFileName = events.getFileNameByPath(picPath);
		var opsData = getOptions(manageOptions, saveSpace, mainSpace, QNFileName);
		//console.log("设定的参数：" + JSON.stringify(opsData));
		var ops = opsData.ops;
		if(opsData.thumbKey) {
			data.thumbKey = opsData.thumbKey;
		}
		if(opsData.clipKey) {
			data.clipKey = opsData.clipKey;
		}
		var param = {
			Bucket: mainSpace,
			Key: saveSpace + QNFileName,
			Pops: ops,
			NotifyUrl: ''
		}
		//console.log("参数数据：" + JSON.stringify(param))
		data.options = {
			AppID: appId,
			Param: encryptByDES(desKey, JSON.stringify(param))
		}
		//console.log("加密后的信息：" + encryptByDES(desKey, JSON.stringify(param)));
		return data;
	}
	/**
	 *获取参数
	 * @param {Object} manageOptions 处理参数
	 * @param {String} saveSpace 保存空间
	 * @param {String} mainSpace 主空间
	 * @param {String} QNFileName 文件名
	 */
	var getOptions = function(manageOptions, saveSpace, mainSpace, QNFileName) {
		var returnData = {};
		switch(manageOptions.type) {
			case 0: //缩略图
				var thumbSpace = saveSpace + 'thumb/';
				returnData.thumbKey = Qiniu.URLSafeBase64Encode(mainSpace + ":" + thumbSpace + QNFileName);
				returnData.ops = "imageView2/1/w/" + manageOptions.thumbSize.width + "/h/" + manageOptions.thumbSize.height + "/format/png|saveas/" + returnData.thumbKey;
				break;
			case 1: //裁剪
				var clipSpace = saveSpace + 'clip/';
				returnData.clipKey = Qiniu.URLSafeBase64Encode(mainSpace + ":" + clipSpace + QNFileName);
				returnData.ops = "imageMogr2/gravity/Center/crop/!" + getIfExist(manageOptions.cropSize.width) + "x" + getIfExist(manageOptions.cropSize.height) + "/format/png|saveas/" + returnData.clipKey;
				break;
			case 2: //视频
				var thumbSpace = saveSpace + 'thumb/';
				var tempFileName = QNFileName.split('.');
				var thumbName = tempFileName[0];
				returnData.thumbKey = Qiniu.URLSafeBase64Encode(mainSpace + ":" + thumbSpace + thumbName + '.png');
				returnData.ops = "vframe/png/offset/1|saveas/" + returnData.thumbKey;
				break;
			case 3: //音频，转格式
				var thumbSpace = saveSpace + 'thumb/';
				var tempFileName = QNFileName.split('.');
				var thumbName = tempFileName[0];
				returnData.thumbKey = Qiniu.URLSafeBase64Encode(mainSpace + ":" + thumbSpace + thumbName + '.mp3');
				returnData.ops = "avthumb/mp3/acodec/libmp3lame" + "|saveas/" + returnData.thumbKey;
				//console.log('3 ' + returnData.ops);
				break;
			case 10: //缩略图+裁剪
				var thumbSpace = saveSpace + 'thumb/';
				returnData.thumbKey = Qiniu.URLSafeBase64Encode(mainSpace + ":" + thumbSpace + QNFileName);
				var clipSpace = saveSpace + 'clip/';
				returnData.clipKey = Qiniu.URLSafeBase64Encode(mainSpace + ":" + clipSpace + QNFileName);
				returnData.ops = "imageView2/1/w/" + manageOptions.thumbSize.width + "/h/" + manageOptions.thumbSize.height + "/format/png|saveas/" + returnData.thumbKey +
					";imageMogr2/gravity/Center/crop/!" + getIfExist(manageOptions.cropSize.width) + "x" + getIfExist(manageOptions.cropSize.height) + "/format/png|saveas/" + returnData.clipKey;
				break;
			default:
				break;
		}
		return returnData;
	}
	/**
	 * 需要先加载qiniu.js,cryption.js,events.js,使用实例在publish-answer.js
	 * 配置获取上传token时需要上传的数据（传多张图片 自定义参数）
	 * @author 安琪
	 * @param {Array} picPaths 图片本地路径数组
	 * @param {Int} appId AppID
	 * @param {int} spaceType 空间类型0：公共空间 1:私有空间
	 * @param {String} saveSpace 上传的空间
	 * @param {Object} manageOptions 处理参数{
	 * 	type:0 // 0生成缩略图1裁剪 10缩略图和裁剪
	 * 	thumbSize {width height } 生成缩略图大小
	 * 	cropSize{width 生成缩略图的长（1-10000）
	 * 	height  宽（1-10000）
	 * 	offsX 水平偏移量
	 *	offsY} 垂直偏移量
	 * }
	 * @return {Object} data data.options为获取token的参数之一，data.thumbKey为获取token后获取缩略图地址的key值
	 */
	mod.getMultipleImgUploadOptions = function(picPaths, appId, spaceType, saveSpace, uploadOptions) {
		var data = {};
		var desKey = getAppKey(appId);
		var mainSpace;
		if(spaceType) {
			mainSpace = storageKeyName.QNPRISPACE; //七牛私有空间
		} else {
			mainSpace = storageKeyName.QNPUBSPACE; //七牛公共空间
		}
		var QNFileName; //文件名
		var params = [];
		for(var i in picPaths) {
			uploadOptions[i].type = 10;
			var param = {};
			param.Bucket = mainSpace;
			//获取文件路径
			QNFileName = events.getFileNameByPath(picPaths[i]);
			param.Key = saveSpace + QNFileName;
			//console.log('key:' + param.Key);
			//获取处理参数
			var opsData = getOptions(uploadOptions[i], saveSpace, mainSpace, QNFileName);
			param.Pops = opsData.ops;
			param.NotifyUrl = '';
			//保存空间值
			params.push(param);
		}
		//console.log("参数数据：" + JSON.stringify(params))
		data.options = {
			AppID: appId,
			Param: encryptByDES(desKey, JSON.stringify(params))
		}
		//console.log("加密后的信息：" + encryptByDES(desKey, JSON.stringify(param)));
		//console.log('加密后的data:' + JSON.stringify(data));
		return data;
	}
	var getIfExist = function(option) {
		return option ? option : '';
	}
	/**
	 *
	 * @param {Object} appId app的id
	 */
	var getAppKey = function(appId) {
		var desKey = "";
		switch(appId) {
			case 0:
				break;
			case 1:
				break;
			case 2: //资源平台
				desKey = storageKeyName.QNPUBZYKEY;
				break;
			case 3: //教宝云作业
				desKey = storageKeyName.QNPUBJBYZYKEY;
				break;
			case 4: //教宝云盘
				desKey = storageKeyName.QNPUBXXT;
				break;
			case 5: //教宝云用户管理
				desKey = storageKeyName.QUPUBJBMANKEY;
				break;
			case 6: //家校圈
				desKey = storageKeyName.QNPUBJXQKEY;
				break;
			case 7: //求知
				desKey = storageKeyName.QNPUBQZKEY;
				break;
			case 8: //校讯通
				desKey = storageKeyName.QNPUBXXT;
				break;
			default:
				break;
		}
		return desKey;
	}

	/**
	 * 需要先加载qiniu.js,cryption.js,events.js,使用实例在publish-answer.js
	 * 配置获取上传token时需要上传的数据（传多张图片）
	 * @author 安琪
	 * @param {Object} picPaths 图片本地路径
	 * @param {Object} appId AppID
	 * @param {Object} maxSize 最大长宽
	 * @param {Object} spaceType 空间类型0：公共空间 1:私有空间
	 * @param {Object} saveSpace 上传的空间
	 * @return {Object} data data.options为获取token的参数之一，data.thumbKey为获取token后获取缩略图地址的key值
	 */
	mod.getMultipleUploadDataOptions = function(picPaths, appId, maxSize, spaceType, saveSpace) {
		var data = {};
		var desKey = getAppKey(appId);
		var mainSpace;
		if(spaceType) {
			mainSpace = storageKeyName.QNPRISPACE; //七牛私有空间
		} else {
			mainSpace = storageKeyName.QNPUBSPACE; //七牛公共空间
		}
		var thumbSpace = saveSpace + 'thumb/';
		var QNFileName;
		//		var QNFileNames =[];
		data.thumbKeys = []
		//		var ops=[];
		var thumbKey;
		var params = [];
		for(var i in picPaths) {
			var param = {};
			param.Bucket = mainSpace;
			QNFileName = events.getFileNameByPath(picPaths[i])
			//			QNFileNames.push(QNFileName);
			thumbKey = Qiniu.URLSafeBase64Encode(mainSpace + ":" + thumbSpace + QNFileName);
			data.thumbKeys.push(thumbKey);
			param.Key = saveSpace + QNFileName;
			//console.log('key:' + param.Key);
			param.Pops = "imageView2/1/w/" + maxSize + "/h/" + maxSize + "/format/png|saveas/" + thumbKey;
			param.NotifyUrl = '';
			params.push(param);
		}
		//console.log("参数数据：" + JSON.stringify(params))
		data.options = {
			AppID: appId,
			Param: encryptByDES(desKey, JSON.stringify(params))
		}
		//console.log("加密后的信息：" + encryptByDES(desKey, JSON.stringify(param)));
		//console.log('加密后的data:' + JSON.stringify(data));
		return data;
	}

	/**
	 * 获取上传的token
	 * @author 安琪
	 * @param {Object} url
	 * @param {Object} data
	 * @param {Object} successCB
	 * @param {Object} errorCB
	 */
	mod.getQNUpTokenWithManage = function(url, data, successCB, errorCB) {
//		console.log('url:'+url);
//		console.log('data:'+data);
		mui.ajax(url, {
			async: false,
			data: data, //请求参数
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 60000, //超时时间设置为60秒
			success: function(data) {
				//服务器返回响应
				successCB(data);
			},
			error: function(xhr, type, errorThrown) {
				//异常处理
				errorCB(xhr, type, errorThrown);
			}
		});
	}

	/**
	 * 创建上传任务
	 * @author 莫尚霖
	 * @param {Object} fPath 文件路径
	 * @param {Object} token 七牛上传token
	 * @param {Object} key 七牛上传key
	 * @param {Object} uploadCompletedCallBack 上传完成时的回调
	 * @param {Object} onStateChangedCallBack 上传任务状态监听的回调
	 * @param {Object} successCallBack 上传任务创建成功监听的回调
	 */
	mod.upload = function(fPath, token, key, uploadCompletedCallBack, onStateChangedCallBack, successCallBack) {
		//console.log('upload fPath ' + fPath);
		//console.log('upload token ' + token);
		//console.log('upload key ' + key);
		var task = plus.uploader.createUpload("https://upload.qiniu.com/", {
				method: "POST"
			},
			/**
			 * 上传任务完成的监听
			 * @param {Object} upload 上传任务对象
			 * @param {Object} status 上传结果状态码，HTTP传输协议状态码，如果未获取传输状态则其值则为0，如上传成功其值通常为200。
			 */
			function(upload, status) {
				uploadCompletedCallBack(upload, status);
			}
		);
		task.addData("key", key);
		task.addData("token", token);
		task.addFile(fPath, {
			"key": "file",
			"name": "file"
		});
		//上传状态变化的监听
		task.addEventListener("statechanged",
			/**
			 * 上传状态变化的监听
			 * @param {Object} upload 上传任务对象
			 * @param {Object} status 上传结果状态码，HTTP传输协议状态码，如果未获取传输状态则其值则为0，如上传成功其值通常为200。
			 */
			function(upload, status) {
				onStateChangedCallBack(upload, status);
			}, false);
		////console.log('upload2:' + fPath + '|' + type + "|" + QNUptoken);
		successCallBack(task);
		//task.start();
	}

	/**
	 * 单个文件上传
	 * @anthor an
	 * @param {Object} tokenInfo
	 * @param {String} fileName
	 * @param {Function} callback
	 */
	mod.uploadFile = function(tokenInfo, fileName, callback) {
		////console.log('upload:' + fPath);
		var task = plus.uploader.createUpload("https://upload.qiniu.com/", {
				method: "POST"
			},
			/**
			 * 上传任务完成的监听
			 * @param {Object} upload 上传任务对象
			 * @param {Object} status 上传结果状态码，HTTP传输协议状态码，如果未获取传输状态则其值则为0，如上传成功其值通常为200。
			 */
			function(upload, status) {
				callback(upload, status);
			}
		);

		task.addData("key", tokenInfo.Key);
		//task.addData("scope", scope + ':' + type);
		task.addData("token", tokenInfo.Token);
		task.addFile(fileName, {
			"key": "file",
			"name": "file"
		});
		//上传状态变化的监听
		task.addEventListener("statechanged", onStateChanged, false);
		task.start();
	}

	/**
	 * 多张图片上传
	 * @author an
	 * @param {Array} fileNames 本地路径
	 * @param {Object} QNUptokens 上传token
	 * @param {Function} callback 回调函数
	 */
	mod.uploadFiles = function(fileNames, tokenInfos, callback) {
		plus.uploader.clear();

		for(var i in tokenInfos) {
			////console.log('upload:' + fPath);
			createTask(tokenInfos[i], fileNames[i], i, callback);
		}
		plus.uploader.startAll();
	}

	function createTask(tokenInfo, fileName, index, callback) {
		var task = plus.uploader.createUpload("https://upload.qiniu.com/", {
				method: "POST"
			},
			/**
			 * 上传任务完成的监听
			 * @param {Object} upload 上传任务对象
			 * @param {Object} status 上传结果状态码，HTTP传输协议状态码，如果未获取传输状态则其值则为0，如上传成功其值通常为200。
			 */
			function(upload, status) {
				callback(upload, status, index);
			}
		);
		task.addData("key", tokenInfo.Key);
		//task.addData("scope", scope + ':' + type);
		task.addData("token", tokenInfo.Token);
		task.addFile(fileName, {
			"key": 'file',
			"name": "file"
		});

		//上传状态变化的监听
		task.addEventListener("statechanged", onStateChanged, false);
	}
	// 监听上传任务状态
	function onStateChanged(upload, status) {
		//		//console.log('mui上传状态：' + upload.state)
		if(upload.state == 4 && status == 200) {
			// 上传完成
			//			//console.log("Upload success: " + upload.getFileName());
		}
	}

	/**
	 * 批量删除七牛的文件
	 * @author 莫尚霖
	 * @param {Object} url 获取下载token路径
	 * @param {Object} data 配置的数据json
	 * @param {Object} successCB
	 * @param {Object} errorCB
	 * data={
	 * 	appId:'',//int 必填 项目id
	 *  urls:[]//array 必填 需要获取下载token文件的路径
	 * }
	 */
	mod.BatchDelete = function(url, data, successCB, errorCB) {
		//console.log('BatchDelete:url ' + url);
		//console.log('BatchDelete:data ' + JSON.stringify(data));
		var desKey = ''; //项目名称
		var appId = 0; //项目id
		var urls = []; //需要获取下载token文件的路径
		var configure = {}; //配置的数据
		if(data) {
			if(data.appId) {
				appId = data.appId;
				desKey = getAppKey(appId);
				if(data.urls) {
					urls = data.urls;
				}
			}
			if(desKey && urls.length != 0) {
				configure.options = {
					AppID: appId,
					Param: encryptByDES(desKey, JSON.stringify(urls))
				}
				//console.log("参数数据：" + JSON.stringify(configure.options));
				mui.ajax(url, {
					async: false,
					data: configure.options,
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 60000, //超时时间设置为60秒
					success: function(data) {
						//服务器返回响应
						////console.log(JSON.stringify(data));
						successCB(data);
					},
					error: function(xhr, type, errorThrown) {
						//异常处理
						errorCB(xhr, type, errorThrown);
					}
				});
			} else {
				errorCB('### ERROR ### 配置获取七牛下载token参数错误');
			}
		}
	}

	/**
	 * 查询持久化数据处理的状态
	 * @param {Object} persistentId 数据处理的进程ID
	 * @param {Object} successCB 请求成功的回调
	 * @param {Object} errorCB 请求失败的回调
	 */
	mod.orderStatusSearch = function(persistentId, callBack) {
		callBack = callBack || mui.noop();
		if(persistentId) {
			var url = 'http://api.qiniu.com/status/get/prefop?id=' + persistentId;
			mui.ajax(url, {
				dataType: 'json', //服务器返回json格式数据
				timeout: 60000, //超时时间设置为60秒
				type: 'get', //HTTP请求类型
				headers: {
					'Content-Type': 'application/json'
				},
				success: function(data) {
					callBack({
						code: 1,
						data: data
					});
				},
				error: function(xhr, type, errorThrown) {
					callBack({
						code: 0,
						message: type
					});
				}
			});
		} else {
			callBack({
				code: 0,
				message: "Id参数错误"
			});
		}
	}

	/**
	 * 在界面上放置图片
	 * @author 安琪
	 * @param {Object} img
	 * @flag {Object} 1获取的 0：上传模式
	 */
	mod.setPic = function(img, flag, thumb) {
		mod.files.push(img);
		//	picPath=camero.getAbsolutePath(picPath);
		var pictures = document.getElementById('pictures');
		var win_width = pictures.offsetWidth;
		var div_width = (win_width) / 4;
		var div = document.createElement('div');
		div.style.width = div_width + "px";
		div.style.height = div_width + "px";
		div.img = img;
		div.className = 'img-div';
		if(img.type == 1) {
			if(flag) {
				div.innerHTML = '<img style="width:90%;height:90%;margin:5%;" src="' + img.thumb + '" data-preview-src="' + img.url + '" data-preview-group="1"/>' +
					'<a class="mui-icon iconfont icon-guanbi"></a>';
			} else {
				div.innerHTML = '<div class="clip-container"  style="width:' + div_width * 0.9 + 'px;height:' + div_width * 0.9 + 'px;margin:5%;overflow:hidden;display:inline-block;backgroud:blue"><img src="' +
					img.url + '" style="visibility:hidden;" data-preview-src="' + img.url + '" data-preview-group="1"/></div>' +
					'<a class="mui-icon iconfont icon-guanbi"></a>';
			}
		} else if(img.type == 2) {
			if(flag) { //获取的
				div.innerHTML = '<div class="clip-container video-container"  style="width:' + div_width * 0.9 + 'px;height:' + div_width * 0.9 + 'px;margin:5%;overflow:hidden;display:inline-block;background-image:url(' +
					img.thumb +
					');background-size:cover;"><img src="../../image/utils/playvideo.png" style="width:30px;height:30px;margin:' + (div_width * 0.9 - 30) / 2 + 'px;" /></div>' +
					'<a class="mui-icon iconfont icon-guanbi"></a>';
				//				div.innerHTML = '<img style="width:90%;height:90%;margin:5%;" src="../../image/utils/playvideo.png" style="backgroud-image:url(' + img.thumb + ');"/>' +
				//					'<a class="mui-icon iconfont icon-guanbi"></a>';
			} else { //上传模式
				//console.log("缩略图信息：" + thumb);
				div.innerHTML = '<div class="clip-container video-container"  style="width:' + div_width * 0.9 + 'px;height:' + div_width * 0.9 + 'px;margin:5%;overflow:hidden;display:inline-block;background-image:url(' +
					'../../image/utils/videothumb.png' +
					');background-size:cover;"><img src="../../image/utils/playvideo.png" style="width:30px;height:30px;margin:' + (div_width * 0.9 - 30) / 2 + 'px;" /></div>' +
					'<a class="mui-icon iconfont icon-guanbi"></a>';
			}
		}
		//console.log("放置的图片信息:" + JSON.stringify(img));
		pictures.appendChild(div);
		switch(img.type) {
			case 1: //图片
				if(div.querySelector(".clip-container")) {
					div.querySelector("img").onload = function(event) {
						//console.log(JSON.stringify(event))

						var marginSize = Math.abs(this.naturalWidth - this.naturalHeight) / 2;

						//console.log("margin值：" + marginSize + "px");
						if(this.naturalWidth > this.naturalHeight) {
							var realMarginSize = marginSize / this.naturalHeight * this.width;
							this.style.height = this.width + "px";
							this.style.width = "initial";
							this.style.marginLeft = -realMarginSize + "px";
							this.style.marginRight = -realMarginSize + "px";
							this.style.visibility = "visible";
						} else {
							var realMarginSize = marginSize / this.naturalWidth * this.width;
							this.style.height = "initial";
							this.style.width = this.width + "px";
							this.style.marginTop = -realMarginSize + "px";
							this.style.marginBottom = -realMarginSize + "px";
							this.style.visibility = "visible";
						}
					}
				}
				break;
			case 2: //视频
				if(!thumb) {
					thumb = false;
				}
				div.querySelector(".video-container").data = [img, thumb];
				break;
			default:
				break;
		}

	}

	/**
	 *
	 * @param {Object} pics
	 *  @author 安琪
	 */
	mod.rechargePicsData = function(pics) {
		var files = [];
		for(var i in pics) {
			var img = {};
			img.url = pics[i].Url;
			img.thumb = pics[i].ThumbUrl;
			img.order = pics[i].DisplayOrder;
			img.type = pics[i].FileType;
			files.push(img);
		}
		files.sort(function(a, b) {
			return a.order - b.order;
		})
		return files;
	}

	/**
	 * 放置删除图片的监听
	 * @author 安琪
	 */
	mod.setDelPicListener = function() {
		//删除图标的点击事件
		mui('#pictures').on('tap', '.icon-guanbi', function() {
			for(var i in mod.files) {
				if(this.parentElement.img.url == mod.files[i].url) {
					mod.files.splice(i, 1);
					break;
				}
			}
			//删除图片
			var pictures = document.getElementById('pictures');
			pictures.removeChild(this.parentElement);
		})
	}
	/**
	 * 设置监听 视频播放的监听
	 * @anthor an
	 */
	mod.setPlayVideoListener = function() {
		mui('#pictures').on('tap', '.video-container', function() {
			var videoPath, thumb;
			if(this.data[0].localPath) {
				videoPath = this.data[0].localPath;
				thumb = this.data[1];
			} else {
				videoPath = this.data[0].url;
				thumb = this.data[0].thumb;
			}
			video.playVideo(videoPath, thumb);
		})
	}

	return mod;
})(mui, window.ColudFileUtil || {});