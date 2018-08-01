document.addEventListener("plusready", function() {
	console.log('compressVideoplusready');
	var _BARCODE = 'compressVideo',
		B = window.plus.bridge;
	
	var compressVideo = {
		//Android开始视频压缩
		compress: function(json,successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null : function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null : function(code) {
					errorCallback(code);
				};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE,'compressVideo', [callbackID,json]);
		},
		//开始视频压缩ios
		ioscompress: function(json,successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null : function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null : function(code) {
					errorCallback(code);
				};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE,'iOScompression', [callbackID,json]);
		}
	};
	window.plus.compressVideo = compressVideo;
}, true);