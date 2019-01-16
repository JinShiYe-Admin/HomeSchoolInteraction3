document.addEventListener("plusready", function() {
	var _BARCODE = 'PermissionChecker',
		B = window.plus.bridge;
	
	var permissionChecker = {
		//检测权限是否开启
		isLocationEnabled: function(successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null : function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null : function(code) {
					errorCallback(code);
				};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE,'isLocationEnabled', [callbackID]);
		}
	};
	window.plus.permissionChecker = permissionChecker;
}, true);