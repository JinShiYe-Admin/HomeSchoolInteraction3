/**
 * 微信模块
 */
var wxUtils = (function(mod) {
	//获取界面需要的config参数
	mod.getConfigParams = function(callback) {
		var url = window.location.href;
		var cncodeUrl = encodeURIComponent(url);
		jQuery.post(consts.CONFIGURL, {
			reuri: cncodeUrl
		}, function(data) {
			callback(JSON.parse(data));
		});
	}
	//发送微信的config协议
	mod.sendConfigPro = function(configmsg, apiList) {
		wx.config({
			debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId: configmsg.appId, // 必填，公众号的唯一标识
			timestamp: configmsg.timestamp, // 必填，生成签名的时间戳
			nonceStr: configmsg.nonceStr, // 必填，生成签名的随机串
			signature: configmsg.signature, // 必填，签名
			jsApiList: apiList // 必填，需要使用的JS接口列表
		});
	}
	/**
	 * 设置微信环境
	 * @param {Object} apiList
	 */
	mod.setConfig = function(apiList) {
		mod.getConfigParams(function(configmsg) {
			mod.sendConfigPro(configmsg, apiList);
		})
	}
	/**
	 * 微信配置错误回调
	 * @param {Object} apiList
	 */
	mod.error = function(apiList) {
		wx.error(function(res) {
			console.log("微信配置错误信息：" + JSON.stringify(res));
			mod.setConfig(apiList);
		})
	}
	mod.checkApi = function(apiList) {
		wx.checkJsApi({
			jsApiList: apiList,
			success: function(res) {
				console.log("获取的当前客户端是否支持相关接口数据：" + JSON.stringify(res));
			}
		})
	}
	/**
	 * 
	 * @param {Object} mode 0 single 1 multi
	 * @param {Object} type 0 department 1user 2 department&&user
	 */
	mod.invoke = function(mode, type, callback) {
		var modeType = 'single';
		if(mode === 1) {
			modeType = 'multi';
		}
		var types;
		switch(type) {
			case 0:
				types = ['department'];
				break;
			case 1:
				types = ['user'];
				break;
			case 2:
				types = ['department', 'user'];
				break;
			default:
				break;
		}
		wx.invoke("selectEnterpriseContact", {
			"fromDepartmentId": 0, // 必填，-1表示打开的通讯录从自己所在部门开始展示, 0表示从最上层开始
			"mode": modeType, // 必填，选择模式，single表示单选，multi表示多选
			"type": types, // 必填，选择限制类型，指定department、user中的一个或者多个
			"selectedDepartmentIds": [], // 非必填，已选部门ID列表
			"selectedUserIds": [] // 非必填，已选用户ID列表
		}, function(res) {
			console.log(res);
			console.log("选部门或人后的获取的数据:" + JSON.stringify(res));
			if(res.err_msg == "selectEnterpriseContact:ok") {
				var selectedDepartmentList = res.result.departmentList; // 已选的部门列表
				for(var i = 0; i < selectedDepartmentList.length; i++) {
					var department = selectedDepartmentList[i];
					var departmentId = department.id; // 已选的单个部门ID
					var departemntName = department.name; // 已选的单个部门名称
				}
				var selectedUserList = res.result.userList; // 已选的成员列表
				for(var i = 0; i < selectedUserList.length; i++) {
					var user = selectedUserList[i];
					var userId = user.id; // 已选的单个成员ID
					var userName = user.name; // 已选的单个成员名称
					var userAvatar = user.avatar; // 已选的单个成员头像
				}
				callback(selectedDepartmentList, selectedUserList);
			} else {
				console.log("无法获取选择的人:" + JSON.stringify(res));
			}
		});
	}
	/**
	 * 选择图片
	 * @param {Object} count
	 * @param {Object} callback
	 */
	mod.chooseImage = function(count, callback) {
		wx.chooseImage({
			count: count,
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function(res) {
				console.log("选取的照片路径：" + JSON.stringify(res.localIds));
				callback(res.localIds)
			}
		})
	}
	/**
	 * 上传图片
	 * @param {Object} localId
	 * @param {Object} callback
	 */
	mod.uploadImage = function(localId, callback) {
		wx.uploadImage({
			localId: localId,
			isShowProgressTips: 1, // 默认为1，显示进度提示
			success: function(res) {
				console.log("上传图片后的服务端ID:" + res.serverId);
				callback(res.serverId);
			}
		})
	}
	mod.startRecord = function() {
		wx.startRecord();
	}
	mod.stopRecord = function(callback) {
		wx.stopRecord({
			success: function(res) {
				console.log("获取的本地路径ID：" + res.localId);
				callback(res.localId);
			}
		});
	}
	mod.onVoiceRecordEnd = function(callback) {
		wx.onVoiceRecordEnd({
			// 录音时间超过一分钟没有停止的时候会执行 complete 回调
			complete: function(res) {
				console.log("1分钟后自动停止后的本地ID" + res.localId);
				callback(res.localId);
			}
		});
	}
	mod.uploadVoice = function(localId, callback) {
		wx.uploadVoice({
			localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
			isShowProgressTips: 1, // 默认为1，显示进度提示
			success: function(res) {
				callback(res.serverId); // 返回音频的服务器端ID
			}
		});
	}
	mod.perviewFile = function(url, name, size) {
		wx.previewFile({
			url: url,
			name: name,
			size: size
		})
	}
	return mod;
})(wxUtils || {})