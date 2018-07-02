/**
 * 相机模块
 */
var camera = (function(mod) {
	//	mod.filePaths=[];
	//获取相机
	mod.getCamera = function() {
			var cmr = plus.camera.getCamera(1);
			return cmr;
		}
		//拍照
	mod.getPic = function(cmr, managePic,errBack) {
			var res = cmr.supportedImageResolutions[0];
			var fmt = cmr.supportedImageFormats[0];
			cmr.captureImage(function(path) {
					//console.log("Capture image success: " + path);
					//数组添加path
					//			mod.filePaths.push(mod.getAbsolutePath(path));
					//处理图片
					//			managePic(mod.getAbsolutePath(path));
					if(managePic) {
						managePic(mod.getAbsolutePath(path));
					}
				},
				function(err) {
					if(errBack){
						errBack();
					}
					//console.log("Capture image failed: " + err.message);
				}, {
					format: fmt
				})
		}
		//录像
	mod.getVideo = function(cmr, manageVideo) {
			var res = cmr.supportedVideoResolutions[0];
			var fmt = cmr.supportedVideoFormats[0];
			cmr.startVideoCapture(function(path) {
					//console.log('视频文件路径：' + path);
					manageVideo(mod.getAbsolutePath(path));
				},
				function(error) {
					mui.toast('发生错误，请重试')
				}, {
					format: "mp4"
				})
			setTimeout(function() {
				cmr.stopVideoCapture();
			}, 1000)
		}
		//获取局对路径
	mod.getAbsolutePath = function(path) {
		var abPath = plus.io.convertLocalFileSystemURL(path);
		abPath = "file://" + abPath;
		//	 //console.log('file path='+abPath);
		return abPath;
	}
	return mod;
})(window.camera || {});
/**
 * 相册模块
 */
var gallery = (function(mod) {
	/**
	 * 获取单张图片的方法
	 * @param {Object} callback 为获取图片的回调函数
	 */
	mod.getSinglePic = function(callback) {
		plus.gallery.pick(function(path) {
			//console.log('选择的单张图片路径为：' + path);
			callback(path);
		}, function(e) {
			//console.log("取消选择图片");
		}, {
			filter: "image"
		});
	}
	/**
	 * 相册多选
	 * @param {Object} maxNo 最多选多少张图片
	 * @param {Object} callback 回调函数
	 */
	mod.getMultiplePic = function(maxNo,callback) {
		// 从相册中选择图片
		//console.log("从相册中选择多张图片:"+maxNo);
		plus.gallery.pick(function(e) {
			//console.log("选择图片的路径：" +JSON.stringify(e.files));
			callback(e.files);
		}, function(e) {
			//console.log("取消选择图片");
		}, {
			system:false,
			filter: "image",
			multiple: true,
			maximum: maxNo,
			onmaxed: function() {
				plus.nativeUI.alert('最多只能选择'+maxNo+'张图片');
			}
		});
	}
	return mod;
})(window.gallery || {})