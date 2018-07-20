document.addEventListener("plusready", function() {
	var _BARCODE = 'clearIcon',
		B = window.plus.bridge;
	
	var clearIcon = {
		//开始视频压缩
		clearIco: function(successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null : function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null : function(code) {
					errorCallback(code);
				};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE,'clearIcon', [callbackID]);
		}
	};
	window.plus.clearIcon = clearIcon;
}, true);