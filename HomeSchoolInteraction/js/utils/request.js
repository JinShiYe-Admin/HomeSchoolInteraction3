/**
 * 依赖jquery
 * 依赖consts.js
 */
var request = (function(mod) {
	mod.getData = function(url, data, callback, type) {
		jQuery.getJSON(url, data, callback);
	}
	mod.postData = function(url, data, callback, type) {
		jQuery.post(url, data, function(response) {
			console.log("请求返回的值：" + JSON.stringify(response))
			if(response.RspCode == 13) {
				if(type) {
					layer.alert("当前用户没有登录或登录已超时，请关闭当前页面，重新从企业管理端登录")
				}
			} else {
				callback(response);
			}
		});
	}
	mod.getDepartList = function(callback) {
		mod.postData(consts.MAINURL, JSON.stringify({
			cmd: 'persondepartsadmin',
			type: 'findpage'
		}), function(response) {
			console.log("获取的部门列表值：" + JSON.stringify(response));
			if(response.RspCode == 0) {
				callback(JSON.parse(response.RspData));
			} else {
				layer.alert(response.RspTxt);
			}
		},1)
	}
	mod.getDepartPersons = function(id, colv, callcol, callback) {
		if(callcol) {
			callcol = 'info';
		} else {
			callcol = 'base';
		}
		if(typeof(id.value) !== "undefined") {
			id = id.value;
		}
		mod.postData(consts.MAINURL, JSON.stringify({
			cmd: "departpersonsadmin",
			type: 'findpage',
			colid: id,
			colv: colv,
			callcol: callcol
		}), function(response) {
			console.log("获取的部门人员列表列表值：" + JSON.stringify(response));
			if(response.RspCode == 0) {
				callback(response.RspData);
			} else {
				callback([]);
				layer.alert(response.RspTxt);
			}
		},1)
	}
	mod.publishMessage = function(users, content, callback) {

		var comData = {
			cmd: 'msg',
			type: 'text',
			touser: userids.join('|'),
			toparty: '',
			totag: '',
			content: content,
			tousername: usernames.join('|'),
			topartyname: '',
			totagname: ''
		}
		mod.postData(consts.MAINURL, JSON.stringify(comData), function(response) {
			console.log("发布消息返回的值：" + JSON.stringify(response));
			callback(response);
		})
	}
	/**
	 * 发送消息
	 * @param {Object} users 用户
	 * @param {Object} dataInfo 发送的数据信息
	 */
	mod.postMessage = function(users, dataInfo, callback) {
		var userids = users.map(function(user) {
			return user.userid;
		})
		var usernames = users.map(function(user) {
			return user.name;
		})
		var comData = {
			cmd: 'msg',
			touser: userids.join('|'),
			toparty: '',
			totag: '',
			safe: 0,
			tousername: usernames.join('|'),
			topartyname: '',
			totagname: ''
		}
		jQuery.extend(comData, dataInfo);
		console.log("发布信息传递的值：" + JSON.stringify(comData));
		mod.postData(consts.MAINURL, JSON.stringify(comData), function(response) {
			console.log("发布消息返回的值：" + JSON.stringify(response));
			callback(response);
		})
	}
	/**
	 * 获取服务组
	 * @param {Object} callback
	 */
	mod.getServiceGroups = function(callback) {
		var comData = {
			cmd: 'devkindsadmin',
			type: 'findpage',
			pageindex: 1,
			pagesize: 9999
		}
		mod.postData(consts.MAINURL, JSON.stringify(comData), function(response) {
			console.log("查询维修种类获取的值:" + JSON.stringify(response));
			callback(response);
		},1)

	}
	/**
	 * 添加服务组
	 * @param {Object} name
	 * @param {Object} callbak
	 */
	mod.addServiceGroup = function(name, gusers, callback) {
		var comData = {
			cmd: 'devkindsadmin',
			type: 'add',
			cname: name,
			gusers: gusers
		}
		mod.postData(consts.MAINURL, JSON.stringify(comData), function(response) {
			console.log("添加维修服务组获取的数据" + JSON.stringify(response));
			callback(response);
		},1)
	}
	/**
	 * 编辑维修组
	 * @param {Object} editContent
	 * @param {Object} callback
	 */
	mod.editSeviceGroup = function(editContent, callback) {
		var comData = {
			cmd: 'devkindsadmin',
			type: 'edit',
		}
		jQuery.extend(comData, editContent);
		mod.postData(consts.MAINURL, JSON.stringify(comData), function(response) {
			console.log("编辑维修组的结果：" + JSON.stringify(response));
			callback(response);
		},1)
	}
	/**
	 * 删除维修组
	 * @param {Object} id
	 * @param {Object} callback
	 */
	mod.delServiceGroup = function(id, callback) {
		var comData = {
			cmd: 'devkindsadmin',
			type: 'del',
			colid: id
		}
		mod.postData(consts.MAINURL, JSON.stringify(comData), function(response) {
			console.log("删除维修组的结果:" + JSON.stringify(response));
			callback(response);
		},1)
	}
	/**
	 * 
	 * @param {Object} callback 回调
	 * @param {Object} type 类型
	 */
	mod.requestPersonalInfo = function(callback, type) {
		var comData = {
			cmd: type ? "userinfoadmin" : "userinfo",
			type: "findpage",
			colv: ""
		}
		mod.postData(consts.MAINURL, JSON.stringify(comData), function(response) {
			console.log("获取的个人信息:" + JSON.stringify(response));
			callback(response);
		}, type)
	}
	return mod;
})(request || {})
var processRequest = (function(mod) {
	mod.URL = "https://jbyj.jiaobaowang.net/AttendanceService/";
	mod.postData = function(url, data, callback) {
		data = JSON.stringify(jQuery.extend({
			uuid: "",
			appid: "",
			token: "",
			sign: ""
		}, data));
		console.log("JQP:data:", url, data);
		jQuery.post(url, data, function(data) {
			console.log("JQP:callback:", url, data);
			if(data.RspCode == 13) {
				alert("用户没有登录或已超时，关闭当前页面，从新从企业管理端登录")
			} else {
				callback(data);
			}
		}).fail(function(e) {
			console.log("JQP:onerror:", e);
			callback({
				RspCode: 404,
				RspData: null,
				RspTxt: "网络连接失败,请重新尝试一下"
			});
		});
	}
	/**
	 * 发送接口协议
	 * @param portName 接口名称
	 * @param postData 发送的数据
	 * @param callback 回调
	 */
	mod.postProcessData = function(portName, postData, callback) {
		mod.postData(mod.URL + portName, postData, callback);
	}
	return mod;
})(processRequest || {});
var layerPlus = (function(mod) {
	mod.confirm = function(data, callback) {
		layer.confirm(data.content, {
			title: data.title
		}, function(index) {
			callback();
			layer.close(index);
		});
	}
	mod.alert = function(content) {
		layer.confirm(content, {
			icon: 2
		})
	}
	return mod;
})(layerPlus || {})