/**
 * 压缩模块
 */
var compress = (function(mod) {
	mod.compressPIC = function(picPath, callback) {
		var options = {
			src: picPath, //压缩转换原始图片的路径
			dst: getSavePath(picPath), //压缩转换目标图片的路径
			overwrite: true,//覆盖生成新文件
			format:'jpg'
		}
		//获取图片类型
		getPicType(picPath, function(picType) {
			if(picType) { //宽>=长
				options.width = "1024px";
				options.height = "auto";
			} else { //宽<长
				options.width = "auto";
				options.height = "1024px";
			}
			//压缩图片
			plus.zip.compressImage(options,
				function(event) {
					//console.log('压缩图片成功:' + JSON.stringify(event));
					callback(event);
				},
				function(error) {
					//图片压缩失败
					var code = error.code; // 错误编码
					var message = error.message; // 错误描述信息
					mui.toast('图片压缩失败！' + '错误编码：' + code + '描述信息：' + message);
					//console.log('图片压缩失败！' + JSON.stringify(error));
					plus.nativeUI.closeWaiting();
				})
		});

	}
	mod.compressPIC_recursive = function(picPath, callback1) {
		var options = {
			src: picPath, //压缩转换原始图片的路径
			dst: getSavePath(picPath), //压缩转换目标图片的路径
			overwrite: true//覆盖生成新文件
		}
		//console.log(123)
		//获取图片类型
		getPicType(picPath, function(picType) {
			if(picType) { //宽>=长
				options.width = "1024px";
				options.height = "auto";
			} else { //宽<长
				options.width = "auto";
				options.height = "1024px";
			}
			//console.log(JSON.stringify(options))
			//压缩图片
			plus.zip.compressImage(options,
				function(event) {
					//console.log('压缩图片成功:' + JSON.stringify(event));
					compressCount++;
					compressedPaths.push(event.target);
					widths.push(event.width);
					if(compressCount < paths.length) {
						mod.compressPIC_recursive(paths[compressCount], callback1);
					} else {
						callback1(compressedPaths, widths);
					}
				},
				function(error) {
					//图片压缩失败
					var code = error.code; // 错误编码
					var message = error.message; // 错误描述信息
					mui.toast('图片压缩失败！' + '错误编码：' + code + '描述信息：' + message);
					//console.log('图片压缩失败！' + JSON.stringify(error));
					plus.nativeUI.closeWaiting();
				})
		});

	}
	var paths = [];
	compressedPaths = [];
	var compressCount = 0;
	var widths = [];
	mod.compressPics = function(picPaths, callback) {
		paths = [];
		compressedPaths = [];
		compressCount = 0;
		widths = [];
		paths = picPaths;
		mod.compressPIC_recursive(picPaths[0], callback);

	}
	var getPicType = function(picPath, callback) {
		var picType;
		var img = new Image();
		img.src = picPath;
		img.onload = function() {
			if(img.width >= img.height) {
				picType = true;
			} else {
				picType = false;
			}
			callback(picType);
		}
		img.onerror=function(){
			callback(false);
		}
	}
	var getSavePath = function(picPath) {
		var picPaths = picPath.split('/');
		//console.log("路径：" + picPaths[picPaths.length - 1])
		var picName=picPaths[picPaths.length - 1];
		var compressPath = "_doc/savepath/" + picName.split(".")[0]+".jpg";
		//		picPaths.splice(picPaths.length - 1, 0, "savePath");
		return compressPath;
	}

	/**
	 * 将图片压缩至1M以下
	 * @author莫尚霖
	 * @param {Object} data json
	 * @param {Object} successCallBack 成功的回调
	 * @param {Object} errorCallBack 失败的回调
	 */
	mod.compressImageTo_1MB = function(data, successCallBack, errorCallBack) {
		var options = {}
		options.path = data.path; //压缩转换原始图片的路径
		if(data.dst) {
			options.dst = data.dst; //压缩转换目标图片的路径
		}
		//console.log('compressImageTo_1MB options ' + JSON.stringify(options));
		mod.compressImageTo_xx(options, function(event) {
			//console.log('compressImageTo_1MB 成功');
			successCallBack(event);
		}, function(error) {
			//console.log('### ERROR ### compressImageTo_1MB 失败 ' + JSON.stringify(error));
			errorCallBack(error);
		});
	}

	/**
	 * 将图片压缩至512KB以下
	 * @author 莫尚霖
	 * @param {Object} data json
	 * @param {Object} successCallBack 成功的回调
	 * @param {Object} errorCallBack 失败的回调
	 */
	mod.compressImageTo_512KB = function(data, successCallBack, errorCallBack) {
		var options = {}
		options.path = data.path; //压缩转换原始图片的路径
		options.sizemax = 524288; //最大文件大小
		if(data.dst) {
			options.dst = data.dst; //压缩转换目标图片的路径
		}
		//console.log('compressImageTo_512KB options ' + JSON.stringify(options));
		mod.compressImageTo_xx(options, function(event) {
			//console.log('compressImageTo_512KB 成功');
			successCallBack(event);
		}, function(error) {
			//console.log('### ERROR ### compressImageTo_1MB 失败 ' + JSON.stringify(error));
			errorCallBack(error);
		});
	}

	/**
	 * 将图片压缩至XX大小以下(默认1MB)
	 * @author 莫尚霖
	 * @param {Object} data json
	 * @param {Object} successCallBack 成功的回调
	 * @param {Object} errorCallBack 失败的回调
	 */
	mod.compressImageTo_xx = function(data, successCallBack, errorCallBack) {
		var optionWith = 'auto';
		var optionHeight = 'auto';
//		var sizeMax = 1048576; //1MB
		var sizeMax = 524288;
		if(data.width) {
			optionWith = data.width;
		}
		if(data.height) {
			optionHeight = data.height;
		}
		if(data.sizemax) {
			sizeMax = data.sizemax;
		}
		var options = {
			src: data.path, //压缩转换原始图片的路径
			format: '.png', //压缩转换后的图片格式
			width: optionWith, //缩放图片的宽度
			height: optionHeight //(String 类型 )缩放图片的高度
		}
		if(data.dst) {
			options.dst = data.dst; //压缩转换目标图片的路径
			options.overwrite = true; //覆盖生成新文件,仅在dst制定的路径文件存在时有效
		} else {
			var myDate = new Date();
			options.dst = '_documents/' + myDate.getTime() + '.png'; //压缩转换目标图片的路径
			options.overwrite = false; //覆盖生成新文件,仅在dst制定的路径文件存在时有效
		}
		//console.log('compressImageTo_xx options ' + JSON.stringify(options));
		plus.zip.compressImage(options,
			function(event) {
				//图片压缩成功
				//var target = event.target; // 压缩转换后的图片url路径，以"file://"开头
				//var size = event.size; // 压缩转换后图片的大小，单位为字节（Byte）
				//var width = event.width; // 压缩转换后图片的实际宽度，单位为px
				//var height = event.height; // 压缩转换后图片的实际高度，单位为px
				console.log('compressImageTo_xx 成功 target:' + event.target + ' size:' + event.size + ' width:' + event.width + ' height:' + event.height);
				if(event.size <= sizeMax) {
					successCallBack(event);
				} else {
					var data1 = {
						path: data.path,
						dst: options.dst,
						sizemax: sizeMax,
					}

					if(event.width > event.height) { //宽>=长
						data1.width = parseInt(event.width / 2) + "px";
//						data1.width = "2048px";
					} else { //宽<长
						data1.height = parseInt(event.height / 2) + "px";
//						data1.height = "2048px";
					}
					mod.compressImageTo_xx(data1, successCallBack, errorCallBack);
				}
			},
			function(error) {
				//图片压缩失败
				//var code = error.code; // 错误编码
				//var message = error.message; // 错误描述信息
				//console.log('### ERROR ### compressImageTo_xx 失败 ' + JSON.stringify(error));
				errorCallBack(error);
			}
		);
	}

	return mod;
})(compress || {})