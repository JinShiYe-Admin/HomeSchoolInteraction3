document.addEventListener("plusready", function() {
	var _BARCODE = 'pushPermission',
		B = window.plus.bridge;
	
	var pushPermission = {
		//检测权限是否开启
		isNotificationEnabled: function(successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null : function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null : function(code) {
					errorCallback(code);
				};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE,'isNotificationEnabled', [callbackID]);
		},
		//打开通知权限
		gotoSetting: function() {
			var success = typeof successCallback !== 'function' ? null : function(args) {
					console.log("result>>>>>>"+args);
				},
				fail = typeof errorCallback !== 'function' ? null : function(code) {
					console.log("result>>>>>>"+code);
				};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "gotoSetting", [callbackID]);
		}
		
	};
	window.plus.pushPermission = pushPermission;
}, true);