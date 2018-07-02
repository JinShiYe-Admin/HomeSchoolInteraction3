/**
 * 显示视频缩略图和播放视频
 * @author 莫尚霖
 */
var ShowVideoUtil = (function(mod) {

	/**
	 * 初始化播放器
	 * @param {Object} videoElement video标签元素
	 */
	mod.initVideo = function(videoElement,flag) {
		videoElement.style.width = plus.screen.resolutionWidth + 'px';
		videoElement.style.height = parseInt(plus.screen.resolutionWidth * 3 / 4) + 'px';
		if (flag == 1) {
			videoElement.style.marginTop = -(plus.screen.resolutionHeight *(1/3.5))+ 'px'; 
		} else{
			videoElement.style.marginTop = (plus.screen.resolutionHeight - 45 - plus.navigator.getStatusbarHeight() - parseInt(plus.screen.resolutionWidth * 3 / 4)) / 2 + 'px';
		}
	}

	/**
	 * 视频的缩略图加载成功
	 * @param {Object} thumbImage 视频缩略图元素
	 * @param {Object} playButtn 播放按钮元素
	 * @param {Object} type 是否调整缩略图区域高度 1,调整
	 * @param {Object} time 视频的时间
	 */
	mod.videoThumbLoad = function(thumbImage, playButtn, type, time) {
		if(!thumbImage) {
			//console.log('未传入视频缩略图元素');
			return false;
		}
		if(!playButtn) {
			//console.log('未传入播放按钮元素');
			return false;
		}
		var height = thumbImage.offsetHeight; //缩略图高度
		var width = thumbImage.offsetWidth; //缩略图宽度
		var playButtn_width = playButtn.style.width.replace('px', ''); //播放按钮宽度
		if(width > height) { //缩略图宽度大于高度
			thumbImage.style.width = '100%';
			thumbImage.style.height = 'initial';
			height = thumbImage.offsetHeight;
			width = thumbImage.offsetWidth;
			if(time) {
				time.style.right = "6%";
			}
		}
		//调整播放按钮居中显示
		playButtn.style.marginLeft = (width * 1 - playButtn_width * 1) / 2 + 'px';
		playButtn.style.marginTop = (height * 1 - playButtn_width * 1) / 2 + 'px';
		//调整视频缩略图区域高度
		if(type) {
			thumbImage.parentNode.style.height = height + 'px';
		}
		thumbImage.style.visibility = 'visible';
		playButtn.style.visibility = 'visible';
		if(time) {
			time.style.visibility = "visible";
		}
	}

	/**
	 * 视频的缩略图加载失败
	 * @param {Object} thumbImage 视频缩略图元素
	 * @param {Object} playButtn 播放按钮元素
	 * @param {Object} videoPath 视频路径
	 */
	mod.videoThumbError = function(thumbImage, playButtn, videoPath) {
		if(!thumbImage) {
			//console.log('未传入视频缩略图元素');
			return false;
		}
		if(!playButtn) {
			//console.log('未传入播放按钮元素');
			return false;
		}
		if(!videoPath) {
			//console.log('未传入视频路径');
			return false;
		}
		var playButtn_width = playButtn.style.width.replace('px', '');
		var video = document.createElement("video");
		video.src = videoPath;
		video.onloadeddata = function() {
			var canvas = document.createElement('canvas');
			canvas.width = video.videoWidth / 2;
			canvas.height = video.videoHeight / 2;
			canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
			thumbImage.src = canvas.toDataURL("image/png");
		}
		thumbImage.parentNode.style.minHeight = playButtn_width + 'px';
		//thumbImage.style.visibility = 'visible';
		//playButtn.style.visibility = 'visible';
	}

	/**
	 * 播放视频
	 * @param {Object} videoElement video标签元素
	 * @param {Object} videoPopoverId popover的id
	 * @param {Object} videoPath 视频路径
	 * @param {Object} videoThumb 视频缩略图路径
	 */
	mod.showVideo = function(videoElement, videoPopoverId, videoPath, videoThumb) {
		if(plus.os.name == 'Android') {
			var vid='';
			var suffix = videoPath.substr(videoPath.lastIndexOf('.'));
			var url = '';
			if(suffix=='.mov' || suffix=='.3gp' || suffix=='.mp4' || suffix=='.avi'){
				//if(unv){plus.runtime.openFile('_doc/camera/'+name);return;}
				url = '../../html/utils/camera_video.html';
			} else{
				mui.toast('系统不支持播放此格式文件');
			}
			
			w=plus.webview.create(url,url,{hardwareAccelerated:true,scrollIndicator:'none',scalable:true,bounce:'all'});
			w.addEventListener('loaded', function(){
				w.evalJS('loadMedia("'+videoPath+'")');
				//w.evalJS('loadMedia("'+'http://localhost:13131/_doc/camera/'+name+'")');
			}, false );
//			w.addEventListener('close', function(){
//				console.log('1111111111111111111111111')
//				w = null;
//			}, false);
			w.show('pop-in');
			
//			playutil.openFileAndroid(videoPath, function(text) {
//				mui.toast(text);
//			});
		} else if(plus.os.name == 'iOS') {
			videoElement.src = videoPath;
			videoElement.poster = videoThumb;
			mui('#' + videoPopoverId).popover('show');
			var mask = mui.createMask(function() {
				videoElement.pause();
				mui('#' + videoPopoverId).popover('hide');
			});
			mask.show();
			document.querySelector('.mui-backdrop').style.background = 'black';
			videoElement.play();
		}
	}
	return mod;

})(window.ShowVideoUtil || {});