/**
 * 在plupload控件上自定义的方法,使用前需要保证plupload控件已经引入
 * @author 莫尚霖
 */
var pluploadutil = (function(mod) {

	/**
	 * plupload控件发生异常，根据error的code和tip返回对应的错误信息
	 * @param {Int} code 异常的code
	 * @param {String} tip 异常的tip
	 * @return {String} message 错误信息
	 */
	mod.errMes = function(code, tip) {
		console.log("pluploadutil.errMes:" + code + " " + tip);
		var message = tip || "";
		switch(code) {
			case plupload.GENERIC_ERROR: //值为-100，发生通用错误时的错误代码
				break;
			case plupload.HTTP_ERROR: //值为-200，发生http网络错误时的错误代码，例如服务气端返回的状态码不是200
				break;
			case plupload.IO_ERROR: //值为-300，发生磁盘读写错误时的错误代码，例如本地上某个文件不可读
				message = "磁盘读写发生错误";
				break;
			case plupload.SECURITY_ERROR: //值为-400，发生因为安全问题而产生的错误时的错误代码
				break;
			case plupload.INIT_ERROR: //值为-500，初始化时发生错误的错误代码
				message = "上传控件plupload初始化发生异常";
				break;
			case plupload.FILE_SIZE_ERROR: //值为-600，当选择的文件太大时的错误代码
				message = "文件大小超出限制";
				break;
			case plupload.FILE_EXTENSION_ERROR: //值为-601，当选择的文件类型不符合要求时的错误代码
				message = "文件类型不符合要求";
				break;
			case plupload.FILE_DUPLICATE_ERROR: //值为-602，当选取了重复的文件而配置中又不允许有重复文件时的错误代码
				message = "文件重复";
				break;
			case plupload.IMAGE_FORMAT_ERROR: //值为-700，发生图片格式错误时的错误代码
				message = "图片格式错误";
				break;
			case plupload.GENERIC_ERROR: //当发生内存错误时的错误代码
				message = "内存发生错误";
				break;
			case plupload.IMAGE_DIMENSIONS_ERROR: //值为-702，当文件大小超过了plupload所能处理的最大值时的错误代码
				message = "文件大小超出上传控件plupload所能处理的最大值";
				break;
			default:
				break;
		}
		return message;
	}
	return mod;
})(window.plupload || {});