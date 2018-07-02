/**
 * 显示音频的播放
 * @author 莫尚霖
 */
var ShowAudioUtil = (function(mod) {

	var audio_show; //音频显示区域
	var audio_icon; //麦克风图标
	var audio_canvas; //进度条画布
	var audio_play; //播放按钮
	var audio_pause; //暂停按钮
	var audio_time; //时间
	var audio_option; //圆的参数
	var audio_canvastx; //2d画布
	var audio_audio; //音频标签

	/**
	 * 音频播放器
	 */
	mod.AudioPlayer = null;
	/**
	 * 遮罩
	 */
	mod.Mask = null;
	/**
	 * 音频文件的路径和时间
	 */
	mod.fOption;

	/**
	 * 计时器id
	 */
	mod.intervalId = null;

	/**
	 * 计时
	 */
	mod.timeCount = 0;

	/**
	 * 0,使用标签；1，使用H5+
	 */
	mod.type = 0;

	/**
	 * 初始化音频显示
	 */
	mod.initAudioPopover = function(data) {
		audio_show = data.show;
		audio_icon = data.icon;
		audio_canvas = data.canvas;
		audio_play = data.play;
		audio_pause = data.pause;
		audio_time = data.time;
		audio_audio = data.audio;
		audio_option; //圆的参数
		audio_canvastx = audio_canvas.getContext("2d");

		//初始化音频播放器
		audio_option = {
			x: localStorage.getItem('resolutionWidth') * 1.4, //圆心的x轴坐标值
			y: (plus.screen.resolutionHeight / 3 * 2), //圆心的y轴坐标值
			r: plus.screen.resolutionHeight * 0.25 * 1.5 //圆的半径
		};

		audio_show.style.height = plus.screen.resolutionHeight / 2 + 'px';
		audio_show.style.marginTop = plus.screen.resolutionHeight / 5 + 'px';
		//麦克风图标
		audio_icon.style.fontSize = plus.screen.resolutionWidth * 0.25 + 'px';
		audio_icon.style.lineHeight = plus.screen.resolutionHeight / 3 + 'px';
		//画布
		audio_canvas.setAttribute('width', plus.screen.resolutionWidth * 2.8 + 'px');
		audio_canvas.setAttribute('height', plus.screen.resolutionHeight / 3 * 4 + 'px');
		audio_canvas.style.width = plus.screen.resolutionWidth * 0.7 + 'px';
		audio_canvas.style.height = plus.screen.resolutionHeight / 3 + 'px';
		//初始化进度和时间
		mod.initCircle();
		//初始化监听
		mod.initListener();
	}

	/**
	 * 初始化进度和时间
	 */
	mod.initCircle = function() {
		//开始一个新的绘制路径
		audio_canvastx.beginPath();
		//设置弧线的颜色
		audio_canvastx.strokeStyle = "#808080";
		audio_canvastx.lineWidth = plus.screen.resolutionWidth * 0.25 * 0.15;
		audio_canvastx.arc(audio_option.x, audio_option.y, audio_option.r, Math.PI * (-0.5), Math.PI * 2, false);
		//按照指定的路径绘制弧线
		audio_canvastx.stroke();
		audio_canvastx.closePath();
		audio_time.innerText = '00:00';
	}

	/**
	 * 初始化播放暂停按钮
	 */
	mod.initButton = function() {
		audio_play.style.display = 'none';
		audio_pause.style.display = 'inline-block';
	}

	/**
	 * 初始化监听
	 */
	mod.initListener = function() {
		//关闭按钮
		mui('.audio-show-popover').on('tap', '.icon-guanbi', function() {
			//console.log('guanbi');
			mod.Mask.close();
		});

		//暂停
		mui('.audio-control').on('tap', '.audio-control-pause', function() {
			this.style.display = 'none';
			clearInterval(mod.intervalId);
			mod.intervalId = null;
			mod.AudioPlayer.pause();
			audio_play.style.display = 'inline-block';
			mod.changeProgressBarAndTime();
		});

		//继续播放
		mui('.audio-control').on('tap', '.audio-control-play', function() {
			this.style.display = 'none';
			mod.changeProgressBarAndTime();
			if(mod.type == 1) {
				mod.AudioPlayer.resume();
			} else {
				mod.AudioPlayer.play();
			}
			mod.AudioSetInterval();
			audio_pause.style.display = 'inline-block';
		});
	}

	/**
	 * 播放音频
	 */
	mod.initAudio = function(data, type) {
		//console.log('initAudio' + JSON.stringify(data));
		mod.initCircle();
		document.activeElement.blur();
		audio_pause.style.display = 'none';
		audio_time.innerText = '加载中';
		mui('#audioPopover').popover('show');
		document.querySelector('.mui-backdrop').style.background = 'rgba(255,255,255,0.5)';
		mod.Mask = mui.createMask(function() {
			//console.log('createMaskcallback');
			if(mod.Mask != null) {
				mod.Mask = null;
				mod.closeAudio();
			}
		});
		mod.Mask.show();
		plus.key.addEventListener('backbutton', mod.closeAudio);
		mod.fOption = data;
		if(type == 1) {
			mod.type = 1;
			mod.createPlayer();
			mod.AudioControlPlay();
		} else {
			mod.type = 0;
			if(mod.AudioPlayer == null) {
				mod.AudioPlayer = audio_audio;
				mod.initAudioPlay();
			}
			mod.AudioPlayer.src = mod.fOption.fpath;
		}
	}

	/**
	 * 初始化audio对象的监听
	 */
	mod.initAudioPlay = function() {
		//完全加载成功
		mod.AudioPlayer.addEventListener('canplaythrough', function() {
			//console.log('canplaythrough');
			audio_time.innerText = '00:00';
			audio_pause.style.display = 'inline-block';
			mod.AudioPlayer.play();
			mod.AudioSetInterval();
		});

		//加载失败
		mod.AudioPlayer.addEventListener('error', function(e) {
			//console.log('error');
			mui.toast('播放失败');
			mod.Mask.close();
		});

		//播放完成
		mod.AudioPlayer.addEventListener('ended', function() {
			mod.closeAudio();
		});
	}

	/**
	 * 创建音频播放器
	 */
	mod.createPlayer = function() {
		if(mod.AudioPlayer) {
			mod.AudioPlayer.stop();
		}
		mod.AudioPlayer = plus.audio.createPlayer(mod.fOption.fpath);
	}

	/**
	 * 播放音频
	 */
	mod.AudioControlPlay = function() {
		mod.AudioPlayer.play(function() {
			//console.log('播放完成');
			if(mod.Mask) {
				mod.Mask.close();
			}
		}, function(e) {
			//console.log('播放失败 ' + JSON.stringify(e));
			setTimeout(function() {
				if(showControlTime != undefined) {
					clearInterval(showControlTime);
				}
				mui.toast('播放失败 ' + e.message);
				if(mod.Mask) {
					mod.Mask.close();
				}
			}, 500);
		});
		var showControlTime = setInterval(function() {
			////console.log("showControlTime");
			if(mod.AudioPlayer) {
				var time = mod.AudioPlayer.getPosition();
				////console.log('time ' + time);
				if(time != 0) {
					audio_time.innerText = '00:00';
					audio_pause.style.display = 'inline-block';
					mod.AudioSetInterval();
					clearInterval(showControlTime);
				}
			}
		}, 100);

	}

	/**
	 * 计时器
	 */
	mod.AudioSetInterval = function() {
		if(mod.intervalId) {
			clearInterval(mod.intervalId);
			mod.intervalId = null;
		}
		mod.timeCount = mod.timeCount + 1;
		mod.showAudioTime(mod.fOption.time);
		mod.intervalId = setInterval(function() {
			var audioTime;
			if(mod.type == 1) {
				audioTime = mod.AudioPlayer.getDuration();
				if(!isNaN(audioTime) && audioTime != -1) {
					mod.fOption.time = Math.ceil(audioTime);
				}
			} else {
				audioTime = mod.AudioPlayer.duration;
				mod.fOption.time = Math.ceil(audioTime);
			}
			////console.log('audioTime ' + audioTime);
			mod.timeCount = mod.timeCount + 1;
			mod.showAudioTime(mod.fOption.time);
		}, 1000);
	}

	/**
	 * 显示进度和时间
	 * @param {Object} count
	 */
	mod.showAudioTime = function(count) {
		//console.log('showAudioTime ' + mod.timeCount + ' ' + count);
		if(mod.timeCount > count) {
			return false;
		}
		var min = (parseInt(mod.timeCount / 60)).toString(); //分钟
		var sec = (mod.timeCount - min * 60).toString(); //秒
		if(min.length == 1) {
			min = '0' + min;
		}
		if(sec.length == 1) {
			sec = '0' + sec;
		}
		mod.audioProgressBar(mod.timeCount, count);
		audio_time.innerHTML = min + ':' + sec;
	}

	/**
	 * 显示进度条
	 * @param {Object} sec
	 * @param {Object} count
	 */
	mod.audioProgressBar = function(sec, count) {
		var begin = Math.PI * (-0.5);
		var now = Math.PI * (-0.5 + 2 * (sec / count));
		audio_canvastx.beginPath();
		audio_canvastx.strokeStyle = "#1DB8F1";
		audio_canvastx.arc(audio_option.x, audio_option.y, audio_option.r, begin, now, false);
		audio_canvastx.stroke();
		audio_canvastx.closePath();
	}

	/**
	 * 关闭audio
	 */
	mod.closeAudio = function() {
		//console.log('closeAudio');
		if(mod.intervalId != null) {
			clearInterval(mod.intervalId);
			mod.intervalId = null;
		}
		if(mod.Mask != null) {
			mod.Mask.close();
			mod.Mask = null;
		}

		mui('#audioPopover').popover('hide');
		plus.key.removeEventListener('backbutton', ShowAudioUtil.closeAudio);

		if(mod.type == 1) {
			if(mod.AudioPlayer != null) {
				mod.AudioPlayer.stop();
				mod.AudioPlayer = null;
			}
		} else {
			mod.AudioPlayer.pause();
		}

		//初始化进度和时间
		mod.initCircle();
		//初始化按键
		mod.initButton();
		mod.timeCount = 0;
		mod.type = 0;
	}

	/**
	 * 调整时间和进度条的显示
	 */
	mod.changeProgressBarAndTime = function() {
		var getTime;
		if(mod.type == 1) {
			getTime = Math.ceil(mod.AudioPlayer.getPosition());
		} else {
			getTime = Math.ceil(mod.AudioPlayer.currentTime);
		}
		if(getTime <= mod.timeCount) {
			return false;
		}
		mod.timeCount = getTime;
		//console.log('changeProgressBarAndTime ' + mod.timeCount);
		mod.showAudioTime(mod.fOption.time);
	}

	return mod;
})(window.ShowAudioUtil || {});