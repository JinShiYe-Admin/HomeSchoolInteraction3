/**
 * 录制音频
 * @author 莫尚霖
 */
var RecordAudio = (function(mod) {
	/**
	 * 初始化配置
	 * @param {Object} data
	 */
	mod.initOption = function(data) {
		//设置录音文件的路径
		var myDate = new Date();
		//录音文件的格式
		var format = 'amr';
		//路径
		var filename = '_documents/' + myDate.getTime() + parseInt(Math.random() * 1000) + '.' + format;
		var time = 300000; //五分钟
		var options = mui.extend(true, {
			filename: '',
			format: format,
			time: time
		}, data);
		if(options.filename == '') {
			options.filename = filename;
		}
		//console.log('recordAudio initOption ' + JSON.stringify(options));
		return options;
	}
	/**
	 * 录制音频
	 * @param {Object} data json
	 * @param {Object} successCB 成功的回调
	 * @param {Object} errorCB 失败的回调
	 */
	mod.recordAudio = function(data, successCB, errorCB) {
		var options = mod.initOption(data);
		//获取当前设备的录音对象
		var recorder = plus.audio.getRecorder();
		if(recorder == null) {
			errorCB({
				code: 'NULL', // 错误编码
				message: '获取录音对象失败' // 错误描述信息
			});
		} else {
			var timeOutId;
			//开始录制
			recorder.record(options, function(recordFile) {
				//录音操作保存的音频文件路径
				successCB(recordFile);
			}, function(error) {
				errorCB({
					code: error.code, // 错误编码
					message: error.message // 错误描述信息
				});
			});
			timeOutId = setTimeout(function() {
				recorder.stop();
			}, options.time);
		}
		return recorder;
	}
	return mod;
})(window.RecordAudio || {})