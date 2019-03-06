document.addEventListener("plusready", function() {
	var _BARCODE = 'OpenFile',
		B = window.plus.bridge;
	
	var pushPermission = {
		//检测权限是否开启
		openFileFromURL: function(url,successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null : function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null : function(code) {
					errorCallback(code);
				};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE,'openFileFromURL', [callbackID,url]);
		},
	};
	window.plus.openFiles = pushPermission;
}, true);