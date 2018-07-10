/**
 * 支付工具类
 */
var appPay = (function(mod) {
	
	mod.personal = store.get(window.storageKeyName.PERSONALINFO);
	mod.publicParameter = store.get(window.storageKeyName.PUBLICPARAMETER);
	mod.wxpay='wxpay';// 微信支付标识
	mod.alipay='alipay';// 支付宝支付标识
	mod.wxChannel = null; // 微信支付通道
	mod.aliChannel = null; // 支付宝支付通道
	mod.channel = null;// 支付通道
	mod.alipayUrl = window.storageKeyName.ALIPAYSERVER;// 支付宝支付地址
	mod.wechatPayUrl = window.storageKeyName.WXPAYSERVER;// 微信支付地址
	mod.order_id =null; // 订单编号
	
	/**
	 * 获取支付通道
	 */
	mod.getChannels=function(){
		plus.payment.getChannels(function(channels) {
			console.log('channels=' + JSON.stringify(channels));
			for(var i in channels) {
				var temp = channels[i];
				if(temp.id == 'alipay') {
					mod.aliChannel = temp;
				} else if(temp.id == 'wxpay') {
					mod.wxChannel = temp;
				}
			}
		}, function(e) {
			alert("获取支付通道失败：" + e.message);
		});
	}
	
	/**
	 * 发起支付
	 * @param {Object} id 支付标识
	 * @param {Object} success 支付成功回调
	 * @param {Object} fail 支付失败回调
	 */
	mod.pay=function(id,success,fail){
		// 从服务器请求支付订单
		var PAYSERVER = '';
		if(id == 'alipay') {
			PAYSERVER = mod.alipayUrl;
			mod.channel = mod.aliChannel;
		} else if(id == 'wxpay') {
			PAYSERVER = mod.wechatPayUrl;
			mod.channel = mod.wxChannel;
		} else {
			plus.nativeUI.alert("不支持此支付通道！", null, "");
			return;
		}
		console.log('channel', mod.channel);
		var data0 = {
			body: orderDetailData.orderDetail.cnname, //商品名称
			attach: orderDetailData.orderDetail.note, //附加描述,最好填写,以区分
			uid: personal.uid, //订购的注册账户
			total_fee: 1, //人民币商品总价,以分为单位
			goods_tag: orderDetailData.orderDetail.bustype.toString(), //商品标签,商品分类标签,根据实际情况填写
			product_id: orderDetailData.orderDetail.feecode, //商品代码,根据实际情况填写:如套餐填写套餐编码
			frmtype: "APP" //订购客户端,发起订购的设备:如PC,APP等
		}
		console.log(JSON.stringify(data0));
		var xhr = new XMLHttpRequest();
		xhr.open("post", PAYSERVER, true);
		xhr.timeout = 10000; //10秒超时
		xhr.contentType = 'application/json;';
		xhr.onload = function(e) {
			console.log("XHRP:onload:", JSON.stringify(e));
			console.log('this.readyState:', this.readyState);
			console.log('this.status', this.status);
			if(this.readyState === 4 && this.status === 200) {
				var data = xhr.responseText;
				mod.order_id=JSON.parse(data).out_trade_no;
				console.log('data======='+mod.order_id);
				plus.payment.request(mod.channel, data, function(result) {
					//console.log('result=' + JSON.stringify(result));
					alert("result=" + JSON.stringify(result));
					plus.nativeUI.alert("支付成功！", function() {
						success;
					});
				}, function(error) {
					//console.log('error' + JSON.stringify(error));
//					plus.nativeUI.alert("支付失败：" + error.code);
					fail(error.code);
				});
			} else {

			}
		}
		xhr.ontimeout = function(e) {
			console.log("XHRP:ontimeout222:", e);

		};
		xhr.onerror = function(e) {
			console.log("XHRP:onerror111:", e);

		};
		xhr.send(JSON.stringify(data0));
	}
	
	/**
	 * 订购（续订）套餐公共方法
	 * @param {Object} data 参数数组
	 * @param {Object} success 成功回调
	 * @param {Object} fail 失败回调
	 */
	
	mod.UserFeeFunc = function(data,success,fail) {
		console.log('data:' + JSON.stringify(data));
		var enData1 = {};
		var comData = {
			uuid: mod.publicParameter.uuid, //用户设备号
			appid: mod.publicParameter.appid, //系统所分配的应用ID
			uid: mod.personal.uid, //用户ID
			dnote: '', //备注
			recutname: mod.personal.utname, //操作者姓名
			frmtype: 'APP自订', //操作类型,来自APP代订,PC代订,APP自订,PC自订
			utoken: mod.personal.utoken //用户令牌
		}
		var comData1 =extend(comData,data);
		console.log('comData1:' + JSON.stringify(comData1));
		events.showWaiting();
		//发送网络请求，data为网络返回值----4.用户订购套餐
		postDataEncry2('UserFee', enData1, comData1, 0, function(data1) {
			console.log('UserFee:' + JSON.stringify(data1));
			events.closeWaiting();
			if(data1.RspCode == 0) {
				success;
			} else {
				fail(data1.RspTxt)
//				mui.toast(data1.RspTxt);
			}
		});
	}
	
	
	/**
	 *支付结果查询 
	 */
	mod.payResult = function() {
		var data0 = {
			out_trade_no: mod.order_id //订单编号
		}
		var xhr = new XMLHttpRequest();
		xhr.open("post", window.storageKeyName.SEARCHPAYSESULT, true);
		xhr.timeout = 10000; //10秒超时
		xhr.contentType = 'application/json;';
		xhr.onload = function(e) {
			if(this.readyState === 4 && this.status === 200) {
				var data = xhr.responseText;

			} else {

			}
		}
		xhr.ontimeout = function(e) {
			console.log("XHRP:ontimeout222:", e);
		};
		xhr.onerror = function(e) {
			console.log("XHRP:onerror111:", e);
		};
		xhr.send(JSON.stringify(data0));
	}
	
	//對象拼接
	var extend=function(a,b){
   		for (var p in b){
	        if(b.hasOwnProperty(p) && (!a.hasOwnProperty(p) ))
	            a[p]=b[p];
	    }
   		return a;
	}; 
	return mod;
})(appPay || {})