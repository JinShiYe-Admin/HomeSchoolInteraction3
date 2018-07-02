//在本地存取永久或临时数据，和存取时的key值
var storageutil = (function(mod) {
	mod.KEY = 0; //0,开发;1,测试;2,外网
	if(mod.KEY == 0) {
		//开发
		mod.QNPBDOMAIN = 'http://qn-cspb.jiaobaowang.net/'; //七牛公开空间域名
		mod.QNGETUPLOADTOKEN = 'https://jbyc.jiaobaowang.net:8445/Api/QiNiu/GetUpLoadToKen'; //七牛获取上传token的url
		mod.QNGETDOWNLOADTOKEN = 'https://jbyc.jiaobaowang.net:8445/Api/QiNiu/GetAccess'; //七牛获取下载token的url
		mod.QNGETDELETEFILES = 'https://jbyc.jiaobaowang.net:8445/Api/QiNiu/Delete'; //获取批量删除七牛文件的token的url
		mod.CLASSCIRCLEMAIN = "https://jbyj.jiaobaowang.net/WxClassService/"; //企业微信班级圈
	}
	//---七牛key值---start---
	mod.QNPUBSPACE = "pb"; //七牛公开空间
	mod.QNPRISPACE = "pv"; //七牛私有空间
	mod.QNQYWXKID = 9; //企业微信id
	mod.QNQYWXKEY = "jsy927@"; //企业微信密钥
	mod.QNQYWXFN = "wechat/"; //企业微信第一前缀名
	mod.QNSSPACEWEBCON = "webcon/"; //网站配置空间(第二前缀名)
	mod.QNSSPACECLASSCIRCLE = "classcircle/"; //班级圈空间(第二前缀名)
	mod.QNBANNERPICTURE = "bannerpicture/"; //横幅图片(第二前缀名)
	mod.QNSERVICE = "service/"; //报修图片(第二前缀名)
	mod.QNLEAVE = "leave/"; //请假图片(第二前缀名)
	mod.QNVIDEO = "video/"; //视频(第二前缀名)
	mod.QNTHUMB = "thumb/"; //缩略图的第三前缀
	mod.QNCROP = "crop/"; //裁剪图的第三前缀
	mod.QNCONVERT= "convert/"; //视频转换的第三前缀

	//---七牛key值---end---

	mod.WEBSITECONFIG = 'websiteconfig' //网站配置

	/**
	 * 在本地存永久数据
	 * @param {Object} key
	 * @param {Object} value
	 */
	mod.setLocalStorage = function(key, value) {
		localStorage.setItem(key, value);
	}

	/**
	 * 取永久数据
	 * @param {Object} key
	 */
	mod.getLocalStorage = function(key) {
		return localStorage.getItem(key);
	}

	/**
	 * 删除单个永久数据
	 * @param {Object} key
	 */
	mod.removeLocalStorage = function(key) {
		localStorage.removeItem(key);
	}

	/**
	 * 删除所有的永久数据
	 */
	mod.clearLocalStorage = function() {
		localStorage.clear();
	}

	/**
	 * 在本地存临时数据
	 * @param {Object} key
	 * @param {Object} value
	 */
	mod.setSessionStorage = function(key, value) {
		sessionStorage.setItem(key, value);
	}

	/**
	 * 取临时数据
	 * @param {Object} key
	 */
	mod.getSessionStorage = function(key) {
		return sessionStorage.getItem(key);
	}

	/**
	 * 删除单个临时数据
	 * @param {Object} key
	 */
	mod.removeSessionStorage = function(key) {
		sessionStorage.removeItem(key);
	}

	/**
	 * 删除所有的临时数据
	 */
	mod.clearSessionStorage = function() {
		sessionStorage.clear();
	}
	return mod;
})(window.storageutil || {});