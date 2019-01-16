//七牛相关的公共方法
var cloudutil = (function(mod) {
	/**
	 * 获取应用对应的密钥
	 * @param {Object} appId app的id
	 */
	mod.getAppKey = function(appId) {
		var desKey = "";
		switch(appId) {
			case storageutil.QNQYWXKID: //企业微信
				desKey = storageutil.QNQYWXKEY;
				break;
			default:
				break;
		}
		return desKey;
	}

	/**
	 * 设置七牛持久化命令
	 * @param {Object} data 必填
	 * @param {Object.option} data.option 必填 命令相关参数
	 * @param {Object.option.type} data.option.type 必填 命令类型
	 * @param {Object.option.width} data.option.width 选填 命令参数
	 * @param {Object.option.height} data.option.height 选填 命令参数
	 * @param {Object.saveSpace} data.saveSpace 必填 保存空间
	 * @param {Object.mainSpace} data.mainSpace 必填 主空间
	 * @param {Object.qnFileName} data.qnFileName 必填 文件名
	 */
	mod.setQNCmd = function(data) {
		console.log("setQNCmd:", data);
		var returnData = {};
		switch(data.option.type) {
			case 0: //只传原文件，不执行七牛的持久化命令
				returnData = null;
				break;
			case 1: //等比缩放生成缩略图
				var thumbSpace = data.saveSpace + storageutil.QNTHUMB;
				var fileNames = data.qnFileName.split(".");
				returnData.thumbKey = Qiniu.URLSafeBase64Encode(data.mainSpace + ":" + thumbSpace + fileNames[0] + ".jpg");
				returnData.ops = "imageView2/0/format/jpeg|saveas/" + returnData.thumbKey;
				break;
			case 2: //居中裁剪生成图片
				var thumbSpace = data.saveSpace + storageutil.QNCROP;
				var fileNames = data.qnFileName.split(".");
				returnData.thumbKey = Qiniu.URLSafeBase64Encode(data.mainSpace + ":" + thumbSpace + fileNames[0] + ".jpg");
				returnData.ops = "imageView2/1/w/200/h/200/format/jpeg|saveas/" + returnData.thumbKey;
				break;
			case 3: //居中裁剪 生成缩略图
				var width = 200;
				var height;
				if(data.option.width) {
					width = data.option.width;
				}
				if(data.option.height) {
					height = data.option.height;
				} else {
					height = width;
				}
				var thumbSpace = data.saveSpace + storageutil.QNCROP;
				var fileNames = data.qnFileName.split(".");
				returnData.thumbKey = Qiniu.URLSafeBase64Encode(data.mainSpace + ":" + thumbSpace + fileNames[0] + ".jpg");
				returnData.ops = "imageView2/1/w/" + width + "/h/" + height + "/format/jpeg|saveas/" + returnData.thumbKey;
				break;
			case 4: //视频,转MP4格式,生成缩略图
				var convetSpace = data.saveSpace + storageutil.QNCONVERT;
				var thumbSpace = data.saveSpace + storageutil.QNTHUMB;
				var fileNames = data.qnFileName.split(".");
				returnData.convertKey = Qiniu.URLSafeBase64Encode(data.mainSpace + ":" + convetSpace + fileNames[0] + ".mp4");
				returnData.thumbKey = Qiniu.URLSafeBase64Encode(data.mainSpace + ":" + thumbSpace + fileNames[0] + ".jpg");
				var avthumb = "avthumb/mp4/vcodec/mpeg4/h264Crf/18|saveas/" + returnData.convertKey;
				var vframe = "vframe/png/offset/1|saveas/" + returnData.thumbKey;
				returnData.ops = avthumb + ";" + vframe;
				break;
			default:
				console.log("returnData:", returnData);
				break;
		}
		console.log("returnData:", returnData);
		return returnData;
	}

	/**
	 * 获取文件的uptoken
	 * @param {Object} data 必填
	 * @param {Object.appId} data.appId 必填 项目id
	 * @param {Object.mainSpace} data.mainSpace 必填 文件存放在私有空间或公有空间
	 * @param {Object.saveSpace} data.saveSpace 必填 文件存放的空间(第二前缀名)
	 * @param {Object.qnCmdOption} data.qnCmdOption 选填 七牛的持久化命令
	 * @param {Object.qnCmdOption.type} data.qnCmdOption 选填 七牛的持久化命令类型，默认0传原文件
	 * @param {Object.fileSplit} data.fileSplit 选填 文件路径分割类型，默认/
	 * @param {Object.fileArray} data.fileArray 必填 文件数组
	 * @param {Object.fileArray.filePath} data.fileArray.filePath 必填(选填 如果使用自定义的文件名) 文件路径
	 * @param {Object.fileArray.qnFileName} data.fileArray.qnFileName 选填 自定义七牛的文件名，默认使用文件路径中的文件名
	 * @param {Object.fileArray.qnCmdOption} data.fileArray.qnCmdOption 选填 自定义文件处理命令类型，默认使用data.qnCmdOption的命令类型
	 * @param {Object} callback 必填 回调
	 */
	mod.getFileUpTokens = function(data, callBack) {
		console.log("getFileUpToken:" + JSON.stringify(data));
		var appId = data.appId; //项目id
		var desKey = mod.getAppKey(data.appId); //项目名称
		var mainSpace = data.mainSpace; //文件存放在私有空间或公有空间
		var saveSpace = data.saveSpace; //文件存放的空间(第二前缀名)

		var qnCmdOption = {
			type: 0
		}; //七牛的持久化命令类型
		if(data.qnCmdOption != undefined) {
			qnCmdOption = data.qnCmdOption;
		}
		var fileSplit = "/"; //文件路径分割类型
		if(data.fileSplit != undefined) {
			fileSplit = data.fileSplit;
		}

		var configure = {}; //配置的数据
		configure.thumbKey = []; //缩略图持久化命令
		configure.convertKey = []; //视频格式转换持久化命令
		var params = []; //配置的参数信息
		for(var i in data.fileArray) {
			var param = {}; //文件的配置参数
			param.Bucket = mainSpace;
			//七牛的文件名
			var qnFileName;
			if(utils.checkData(data.fileArray[i].qnFileName)) {
				//自定义七牛上的文件名
				qnFileName = data.fileArray[i].qnFileName;
			} else {
				//默认使用文件路径中的文件名
				var filePaths = data.fileArray[i].filePath.split(fileSplit);
				qnFileName = filePaths[filePaths.length - 1];
			}

			param.Key = saveSpace + qnFileName;

			//设置持久化命令
			var setQNCmdData = {
				option: {},
				saveSpace: saveSpace,
				mainSpace: mainSpace,
				qnFileName: qnFileName
			};
			if(utils.checkData(data.fileArray[i].qnCmdOption)) {
				//自定义七牛文件的命令类型
				setQNCmdData.option = data.fileArray[i].qnCmdOption;
			} else {
				//默认使用data.qnCmdType的命令类型
				setQNCmdData.option = qnCmdOption; //默认只传原件
			}
			var opsData = mod.setQNCmd(setQNCmdData);

			if(opsData != null) {
				param.Pops = opsData.ops;
				configure.thumbKey.push(opsData.thumbKey);
				configure.convertKey.push(opsData.convertKey);
			} else {
				param.Pops = "";
			}
			param.NotifyUrl = '';
			params.push(param);
		}
		configure.options = {
			AppID: appId,
			Param: encryptByDES(desKey, JSON.stringify(params))
		}

		mod.getUpTokenRequest(configure.options, function(tokenData) {
			//console.log("getFileUpTokens:tokenData:" + JSON.stringify(tokenData));
			if(tokenData.code == 1 && tokenData.data.Status == 1) {
				callBack({
					code: 1,
					data: tokenData.data,
					thumbKey: configure.thumbKey,
					convertKey: configure.convertKey,
					message: tokenData.message
				});
			} else {
				callBack({
					code: 0,
					message: tokenData.message
				});
			}
		});
	}

	/**
	 * 发送获取uptoken的请求
	 * @param {Object} requestData
	 * @param {Object} callBack 请求的回调
	 */
	mod.getUpTokenRequest = function(requestData, callBack) {
		console.log("getUpTokenRequest:");
		jQuery.ajax({
			url: storageutil.QNGETUPLOADTOKEN,
			type: "POST",
			data: requestData, //JSON.stringify(requestData),
			timeout: 30000,
			dataType: "json",
			//contentType: "application/json; charset=utf-8",
			async: false,
			success: function(data) { //请求成功的回调
				console.log("getUpTokenRequest:success:", data);
				callBack({
					code: 1,
					data: data,
					message: data.Message
				});
			},
			error: function(xhr, type, errorThrown) {
				console.log("getUpTokenRequest:error:", xhr, type, errorThrown);
				callBack({
					code: 0,
					message: type
				});
			}
		});
	}

	/**
	 * 转换数据格式
	 * @param {Number} size
	 */
	mod.transformSize = function(size) {
		var sizeString = "";
		if(size == 0) {
			sizeString = "0B";
		} else if(size < 1024) {
			sizeString = size + "B";
		} else if(size < 1048576) {
			sizeString = (size / 1024).toFixed(2) + "KB";
		} else if(size < 1073741824) {
			sizeString = (size / 1048576).toFixed(2) + "MB";
		} else {
			sizeString = (size / 1073741824).toFixed(2) + "GB";
		}
		return sizeString;
	}

	/**
	 * 批量删除七牛的文件
	 * @param {Object} data 数据对象
	 * @param {Object.appId} data.appId 必填 项目id
	 * @param {Object.urls} data.urls 必填 路径数组
	 * @param {Object} callBack 回调
	 */
	mod.delCloudFiles = function(data, callBack) {
		//console.log('delCloudFiles:' + JSON.stringify(data));
		var appId = data.appId; //项目id
		var desKey = mod.getAppKey(data.appId); //项目名称
		var configure = {}; //配置的数据
		configure.options = {
			AppID: appId,
			Param: encryptByDES(desKey, JSON.stringify(data.urls))
		}
		jQuery.ajax({
			url: storageutil.QNGETDELETEFILES,
			type: "POST",
			data: configure.options,
			timeout: 30000,
			dataType: "json",
			async: false,
			success: function(data) { //请求成功的回调
				//console.log("delCloudFiles:success:" + JSON.stringify(data));
				callBack({
					code: 1,
					data: data,
					message: data.Message
				});
			},
			error: function(xhr, type, errorThrown) {
				//console.log("delCloudFiles:error:" + type);
				callBack({
					code: 0,
					message: type
				});
			}
		});
	}
	/**
	 * 单张图片上传方法
	 * @param {Object} buttonSelector 选择文件按钮id
	 * @param {Object} manageOptions 图片处理参数 type width height等
	 * @param {Object} callback 上传的回调方法
	 */
	mod.uploadQnSingleImg = function(buttonSelector, manageOptions, callback) {
		console.log("uploadQnSingleImg上传图片")
		var originalName = "";
		return Qiniu.uploader({
			disable_statistics_report: false, // 禁止自动发送上传统计信息到七牛，默认允许发送
			runtimes: 'html5,flash,html4', // 上传模式,依次退化
			browse_button: buttonSelector, // 上传选择的点选按钮，**必需**
			uptoken_func: function(file) { // 在需要获取 uptoken 时，该方法会被调用
				originalName = file.name;
				uptokenData = null;
				uptokenData = mod.getQNUpToken(file, manageOptions);
				console.log("获取uptoken回调:" + JSON.stringify(uptokenData));
				if(uptokenData && uptokenData.code) { //成功
					return uptokenData.data.Data[0].Token;
				} else {
					qnFileUploader.stop();
				}
			},
			unique_names: false, // 默认 false，key 为文件名。若开启该选项，JS-SDK 会为每个文件自动生成key（文件名）
			save_key: false, // 默认 false。若在服务端生成 uptoken 的上传策略中指定了 `save_key`，则开启，SDK在前端将不对key进行任何处理
			get_new_uptoken: true, // 设置上传文件的时候是否每次都重新获取新的 uptoken
			domain: storageutil.QNPBDOMAIN, // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**
			max_file_size: '10mb', // 最大文件体积限制
			flash_swf_url: '../../js/lib/plupload/Moxie.swf', //引入 flash,相对路径
			max_retries: 3, // 上传失败最大重试次数
			dragdrop: false, // 开启可拖曳上传
			chunk_size: '4mb', // 分块上传时，每块的体积
			auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
			filters: {
				mime_types: [ //只允许上传图片和zip文件
					{
						title: "Image files",
						extensions: "jpg,png"
					}
				]
			},
			init: {
				'FilesAdded': function(up, files) {
					plupload.each(files, function(file) {
						//						$.showLoading('加载中...');
						// 文件添加进队列后,处理相关的事情
						console.log("FilesAdded:", file);
					});
				},
				'BeforeUpload': function(up, file) {
					// 每个文件上传前,处理相关的事情
					console.log("BeforeUpload:");
				},
				'UploadProgress': function(up, file) {
					// 每个文件上传时,处理相关的事情
					console.log("UploadProgress:" + file.percent);
				},
				'FileUploaded': function(up, file, info) {
					// 每个文件上传成功后,处理相关的事情
					console.log("FileUploaded:");
					console.log(file)
					console.log(info)
					//					$.hideLoading();
					if(info.status == 200) {
						var imgUrl = mod.getImgUrl(uptokenData);
						var tempModel = {
							saveurl: uptokenData.data.Data[0].Domain + uptokenData.data.Data[0].Key,
							imgurl: imgUrl,
							oldname: originalName,
							newname: file.name,
							filesize: file.size
						}
						callback(tempModel);
					}
				},
				'Error': function(up, err, errTip) {
					//上传出错时,处理相关的事情
					console.log("Error:", err, errTip);
					alert(pluploadutil.errMes(err.code, errTip));
					//					$.hideLoading();
				},
				'UploadComplete': function() {
					//队列文件处理完毕后,处理相关的事情
					console.log("UploadComplete:");
				},
				'Key': function(up,file) {
					// 若想在前端对每个文件的key进行个性化处理，可以配置该函数
					// 该配置必须要在 unique_names: false , save_key: false 时才生效
					if(uptokenData && uptokenData.code) { //成功
						console.log('得到token:' + JSON.stringify(uptokenData));
						return uptokenData.data.Data[0].Key;
					}
				}
			}
		});
	}
	/**
	 * 获取图片在七牛上的地址
	 * @param {Object} token 上传的token
	 */
	mod.getImgUrl = function(token) {
		console.log("*****getImgUrl：" + JSON.stringify(token))
		if(token.thumbKey.length > 0) {
			return token.data.Data[0].OtherKey[token.thumbKey[0]]
		}
		return token.data.Data[0].Domain + token.data.Data[0].Key;
	}
	/**
	 *
	 * @param {Object} file
	 * @param {Object} manageOption { type } 0 原图 3 缩略裁剪图
	 */
	mod.getQNUpToken = function(file, manageOption) {
		console.log("getQNUpToken");
		var myDate = new Date();
		var fileName = myDate.getTime() + "" + parseInt(Math.random() * 1000);
		var types = file.name.split(".");
		fileName = fileName + "." + types[types.length - 1];
		var getTokenData = {
			appId: storageutil.QNQYWXKID,
			mainSpace: storageutil.QNPUBSPACE,
			saveSpace: storageutil.QNSSPACEWEBCON,
			qnCmdOption: manageOption,
			fileArray: [{
				qnFileName: fileName,
			}]
		}
		var upToken;
		mod.getFileUpTokens(getTokenData, function(data) {
			upToken = data;
		});
		return upToken;
	}
	/**
	 * 七牛图片信息查询
	 * @param {String} url 图片地址
	 */
	mod.getQNImgInfo = function(url) {
		var request = new XMLHttpRequest();
		request.open("GET", url + "?imageInfo", false);
		request.send();
		console.log(request.response)
		return request.response;
	}

	/**
	 * 获取七牛初始化部分设置
	 * 1.默认不自动上传
	 * 2.uptoken, uptoken_url, uptoken_func 三个参数中必须有一个被设置
	 * 3.使用时请检查domain和flash_swf_url的参数
	 * @param {Object} browse_button 上传选择的点选按钮
	 */
	mod.getQiNiuInitOption = function(browse_button) {
		var qnOption = {
			disable_statistics_report: false, // 禁止自动发送上传统计信息到七牛，默认允许发送
			runtimes: 'html5,flash,html4', // 上传模式,依次退化
			browse_button: browse_button, // 上传选择的点选按钮，**必需**
			unique_names: false, // 默认 false，key 为文件名。若开启该选项，JS-SDK 会为每个文件自动生成key（文件名）
			save_key: false, // 默认 false。若在服务端生成 uptoken 的上传策略中指定了 `save_key`，则开启，SDK在前端将不对key进行任何处理
			get_new_uptoken: true, // 设置上传文件的时候是否每次都重新获取新的 uptoken
			domain: storageutil.QNPBDOMAIN, // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**
			max_file_size: '100mb', // 最大文件体积限制
			flash_swf_url: "../../js/lib/plupload/Moxie.swf", //引入 flash,相对路径
			max_retries: 0, // 上传失败最大重试次数
			dragdrop: false, // 开启可拖曳上传
			chunk_size: '4mb', // 分块上传时，每块的体积
			auto_start: false, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
		}
		return qnOption;
	}

	/**
	 * 获取七牛上传的文件名
	 * @param {Object} fname
	 */
	mod.getQNName = function(fname) {
		var myDate = new Date();
		var fileName = myDate.getTime() + "" + parseInt(Math.random() * 1000);
		var types = fname.toLowerCase().split(".");
		fileName = fileName + "." + types[types.length - 1];
		return fileName;
	}
	return mod;
})(window.cloudutil || {});

/**
 * 在plupload控件上自定义的方法,使用前需要保证plupload控件已经引入
 * @author 莫尚霖
 */
var pluploadutil = (function(mod) {

	/**
	 * plupload控件发生异常，根据error的code和tip返回对应的错误信息
	 * @param {Int} code 异常的code
	 * @param {String} tip 异常的tip
	 * @return {String} message 错误信息
	 */
	mod.errMes = function(code, tip) {
		console.log("pluploadutil.errMes:" + code + " " + tip);
		var message = tip || "";
		switch(code) {
			case plupload.GENERIC_ERROR: //值为-100，发生通用错误时的错误代码
				break;
			case plupload.HTTP_ERROR: //值为-200，发生http网络错误时的错误代码，例如服务气端返回的状态码不是200
				break;
			case plupload.IO_ERROR: //值为-300，发生磁盘读写错误时的错误代码，例如本地上某个文件不可读
				message = "磁盘读写发生错误";
				break;
			case plupload.SECURITY_ERROR: //值为-400，发生因为安全问题而产生的错误时的错误代码
				break;
			case plupload.INIT_ERROR: //值为-500，初始化时发生错误的错误代码
				message = "上传控件plupload初始化发生异常";
				break;
			case plupload.FILE_SIZE_ERROR: //值为-600，当选择的文件太大时的错误代码
				message = "文件大小超出限制";
				break;
			case plupload.FILE_EXTENSION_ERROR: //值为-601，当选择的文件类型不符合要求时的错误代码
				message = "文件类型不符合要求";
				break;
			case plupload.FILE_DUPLICATE_ERROR: //值为-602，当选取了重复的文件而配置中又不允许有重复文件时的错误代码
				message = "文件重复";
				break;
			case plupload.IMAGE_FORMAT_ERROR: //值为-700，发生图片格式错误时的错误代码
				message = "图片格式错误";
				break;
			case plupload.GENERIC_ERROR: //当发生内存错误时的错误代码
				message = "内存发生错误";
				break;
			case plupload.IMAGE_DIMENSIONS_ERROR: //值为-702，当文件大小超过了plupload所能处理的最大值时的错误代码
				message = "文件大小超出上传控件plupload所能处理的最大值";
				break;
			default:
				break;
		}
		return message;
	}
	return mod;
})(window.plupload || {});