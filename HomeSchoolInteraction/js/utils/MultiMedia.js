/**
 * 录音，拍照，录像控件
 * @author 莫尚霖
 */
var MultiMedia = (function($, mod) {

	var html_picture_header = '<span id="MultiMedia_Picture_Header" class="mui-icon iconfont icon-xiangji2"></span>'; //相机图标
	var html_tuku_header = '<span id="MultiMedia_Tuku_Header" class="mui-icon iconfont icon-tuku"></span>'; //图库图标
	var html_audio_header = '<span id="MultiMedia_Audio_Header" class="mui-icon iconfont icon-yuyin3"></span>'; //语音图标
	var html_video_header = '<span id="MultiMedia_Video_Header" class="mui-icon iconfont icon-shipin2"></span>'; //视频图标
	var html_picture_footer = '<div id="MultiMedia_Picture_Footer"></div>'; //放置图片
	var html_audio_footer = '<div id="MultiMedia_Audio_Footer"></div>'; //放置音频
	var html_video_footer = '<div id="MultiMedia_Video_Footer"></div>'; //放置视频

	var div = document.createElement('div');

	/**
	 * 图片Id
	 */
	var imageId = 0;

	/**
	 * 多媒体对象
	 * @param {Object} options 配置参数
	 */
	var MultiMedia = function(options) {
		//配置参数
		this.options = $.extend(true, {
			Id: '_MSL_MultiMedia', //整个控件的ID
			Key: 'key', //用户的utid
			MultiMediaId: '', //存放多媒体对象控件的ID
			Picture: false, //是否显示图片图标
			Audio: false, //是否显示音频图标
			Video: false, //是否显示视频图标
			TotalPicture: 0, //图片的个数
			TotalAudio: 0, //音频的个数
			TotalVideo: 0, //视频的个数
		}, options || {});

		//初始化
		this.init();
		this.initData();
		//		this.initEvent();
	}

	var proto = MultiMedia.prototype; //属性使您有能力向对象添加属性和方法。

	//初始化界面
	proto.init = function() {
		////console.log('MultiMedia-init');
		var options = this.options;
		var str_div_0 = '<div id="MultiMedia_Body" class="multimedia-body"><div id="MultiMedia_Header" class="multimedia-header">'
		var str_pic_0 = ''; //相机按钮
		var str_tuku_0 = ''; //图库按钮
		var str_aud_0 = ''; //音频按钮
		var str_vid_0 = ''; //视频按钮
		var srt_div_1 = '</div><div id="MultiMedia_Footer" class="multimedia-footer">';
		var str_pic_1 = ''; //放置选择的图片
		var str_aud_1 = ''; //放置录制的音频
		var str_vid_1 = ''; //放置录制的视频
		var srt_div_2 = '</div></div>'

		if(this.options.Picture) {
			str_pic_0 = html_picture_header;
			str_pic_1 = html_picture_footer;
			str_tuku_0 = html_tuku_header;
		}
		if(this.options.Audio) {
			str_aud_0 = html_audio_header;
			str_aud_1 = html_audio_footer;
		}
		if(this.options.Video) {
			str_vid_0 = html_video_header;
			str_vid_1 = html_video_footer;
		}
		div.id = this.options.Id;
		div.style.width = '100%';
		div.innerHTML = str_div_0 + str_pic_0 + str_tuku_0 + str_aud_0 + str_vid_0 + srt_div_1 + str_pic_1 + str_aud_1 + str_vid_1 + srt_div_2;

		if(this.options.MultiMediaId != '') {
			var el = document.getElementById(this.options.MultiMediaId);
			el.appendChild(div);
		} else {
			//页面最下面
			document.body.appendChild(div);
		}
		this.element = div; //控件元素
	}

	//初始化数据
	proto.initData = function() {
		////console.log('MultiMedia-initData');
		this.data = {};
		var options = this.options;
		if(this.options.Picture) {
			this.data.PictureNum = options.TotalPicture; //可以选取图片的剩余数量
			this.data.PictureArray = []; //已选取的图片路径
			this.data.PictureWith = parseInt(document.getElementById(this.options.Id).offsetWidth * 0.2);
			this.data.PictureMarginLeft = parseInt(document.getElementById(this.options.Id).offsetWidth * 0.04);
		}
		if(this.options.Audio) {
			this.data.AudioNum = options.TotalAudio; //可以录制音频的剩余数量
			this.data.AudioArray = [];
			this.data.AudioWith = parseInt(document.getElementById(this.options.Id).offsetWidth * 0.2);
			this.data.AudioMarginLeft = parseInt(document.getElementById(this.options.Id).offsetWidth * 0.04);
		}
		if(this.options.Video) {
			this.data.VideoNum = options.TotalVideo; //可以选取视频的剩余数量
			this.data.VideoArray = [];
			this.data.VideoWith = parseInt(document.getElementById(this.options.Id).offsetWidth * 0.2);
			this.data.VideoMarginLeft = parseInt(document.getElementById(this.options.Id).offsetWidth * 0.04);
		}
	}

	//初始化监听
	proto.initEvent = function() {
		////console.log('MultiMedia-initEvent');
		var self = this;
		//图片
		if(this.options.Picture) {
			//相机
			document.getElementById('MultiMedia_Picture_Header').addEventListener('tap', function() {
				self.initImageEvent(0);
			});
			//图库
			document.getElementById('MultiMedia_Tuku_Header').addEventListener('tap', function() {
				self.initImageEvent(1);
			});

			//显示图片区域，删除按钮的监听
			mui('#MultiMedia_Picture_Footer').on('tap', '.multimedia-picture-delete', function() {
				self.initDelImageEvent(this);
			});
		}

		//音频
		if(this.options.Audio) {
			//录制音频
			document.getElementById('MultiMedia_Audio_Header').addEventListener('tap', function() {
				mui.toast('暂时不支持录制音频');
				return;
				//				document.activeElement.blur();
				//				self.initAudioEvent();
			});

			//录制完成的回调
			window.addEventListener('MultiMediaRecordAudio', function(e) {
				self.data.AudioNum--;
				self.addAudios(e.detail.data);
			});

			//删除音频
			mui('#MultiMedia_Audio_Footer').on('tap', '.multimedia-audio-icon-closeempty', function() {
				self.initDelAudioEvent(this);
			});

			//播放音频
			mui('#MultiMedia_Audio_Footer').on('tap', '.multimedia-audio-button', function() {
				self.initPlayAudioEvent(this);
			});
		}

		//视频
		if(this.options.Video) {
			document.getElementById('MultiMedia_Video_Header').addEventListener('tap', function() {
				self.initVideoEvent();
			});

			//显示视频区域，删除按钮的监听
			mui('#MultiMedia_Video_Footer').on('tap', '.multimedia-picture-delete', function() {
				self.initDelVideoEvent(this);
			});

			//显示视频区域，播放按钮的监听
			mui('#MultiMedia_Video_Footer').on('tap', '.multimedia-video-play', function() {
				self.initPlayVideoEvent(this);
			});
		}
	}

	//初始化图片选择的监听
	proto.initImageEvent = function(type) {
		var self = this;
		document.activeElement.blur();
		//已经录制了视频
		if(self.options.Video && self.data.VideoNum * 1 < self.options.TotalVideo) {
			mui.toast('图片与视频不能同时添加');
			return false;
		}
		//已经录制了音频
		if(self.options.Audio && self.data.AudioNum * 1 < self.options.TotalAudio) {
			mui.toast('图片与音频不能同时添加');
			return false;
		}
		if(self.data.PictureNum > 0) {
			self.pictureActionSheet(type);
		} else {
			mui.toast('图片数量超出限制');
		}
	}

	//初始化删除选择的图片的监听
	proto.initDelImageEvent = function(element) {
		var self = this;
		document.activeElement.blur();
		var id = element.id.replace('MultiMedia_Picture_Delete_', '');
		var parent = element.parentNode;
		//删除数组
		for(var i = 0; i < self.data.PictureArray.length; i++) {
			if(self.data.PictureArray[i].id == id) {
				self.data.PictureArray.splice(i, 1);
				self.data.PictureNum++;
			}
		}
		//删除界面的图片
		parent.parentNode.removeChild(parent);
		//调整界面高度
		self.changeFooterHeight(0, self.data.PictureArray.length);
		self.imageChangeCallBack();
	}

	//初始化录制视频的监听
	proto.initVideoEvent = function() {
		var self = this;
		document.activeElement.blur();
		//已经选择了图片
		if(self.options.Picture && self.data.PictureNum * 1 < self.options.TotalPicture) {
			mui.toast('视频与图片不能同时添加');
			return false;
		}
		//已经录制了音频
		if(self.options.Audio && self.data.AudioNum * 1 < self.options.TotalAudio) {
			mui.toast('视频与音频不能同时添加');
			return false;
		}
		if(self.data.VideoNum > 0) {
			var btnArray = [{
				title: "录制"
			}, {
				title: "从相册选取"
			}];
			plus.nativeUI.actionSheet({
				title: "视频",
				cancel: "取消",
				buttons: btnArray
			}, function(e) {
				switch(e.index) {
					case 0: //取消
						break;
					case 1: //录像
						//recordvideoutil  限制了拍摄时长   gallerypick 限制了相册选取的视频长短
						if(plus.os.name == 'Android') {
							RecordVideo.recordVideo({}, function(fpath) {
								if(self.data.VideoNum > 0) {
									console.log('录制视频成功 ' + fpath);
									var path = fpath;
									var oldPath = path.substring(7, path.length);
									var newPath = oldPath.substring(0, oldPath.lastIndexOf('/')) + '/compress/' + new Date().getTime() + '.mp4';
									var json = {
										filePath: oldPath,
										newPath: newPath
									}
									plus.compressVideo.compress(JSON.stringify(json), function(result) {
										console.log("result：" + result[0]);
										var obj = JSON.parse(result[0]);
										var wd = events.showWaiting('处理中...');
										if(obj.code == 0) {
											self.data.VideoNum--;

											self.addVideos(obj.msg, function() {
												wd.close();
											});
										} else {
											wd.close();
											//												mui.toast(obj.msg)
											mui.alert(obj.msg, '校讯通', function() {});
										}
									}, function(result) {
										console.log("result" + result[0]);
										mui.toast("视频转码失败")
									});
								}
							}, function(err) {
								mui.toast(err.message);
							});
							//							var cmr = plus.camera.getCamera();
							//							cmr.startVideoCapture(function(p) {
							//								plus.io.resolveLocalFileSystemURL(p, function(entry) {
							//									if(self.data.VideoNum > 0) {
							//										console.log('录制视频成功 ' + entry.toLocalURL());
							//										var path=entry.toLocalURL();
							//										var oldPath=path.substring(7,path.length);
							//										var newPath=oldPath.substring(0,oldPath.lastIndexOf('/'))+'/compress/'+new Date().getTime()+'.mp4';
							//										var json={
							//											filePath:oldPath,
							//											newPath:newPath
							//										}
							//										plus.compressVideo.compress(JSON.stringify(json),function(result){
							//											console.log("result："+result[0]);
							//											var obj=JSON.parse(result[0]);
							//											var wd = events.showWaiting('处理中...');
							//											if(obj.code==0){
							//												self.data.VideoNum--;
							//												
							//													self.addVideos(obj.msg, function() {
							//														wd.close();
							//													});
							//											}else{
							//												wd.close();
							////												mui.toast(obj.msg)
							//												mui.alert(obj.msg, '校讯通', function() {});
							//											}
							//										},function(result){
							//											console.log("result"+result[0]);
							//											mui.toast("视频转码失败")
							//										});
							//									}
							//								}, function(e) {
							//									console.log('读取录像文件错误：' + e.message);
							//								});
							//							}, function(e) {
							//								console.log('失败：' + e.message);
							//							}, {
							//								filename: '_doc/camera/' + new Date().getTime() + '.mp4',
							//								index: 0
							//							});
						} else if(plus.os.name == 'iOS') {
							console.log('recordVideo00000');
							RecordVideo.recordVideo({}, function(fpath) {
								console.log('recordVideo00001');
								if(self.data.VideoNum > 0) {
									console.log('recordVideo00002');
									var w = plus.nativeUI.showWaiting("转码中，请等待...\n0%");
									plus.compressVideo.ioscompress(fpath, function(result) {
										console.log("result:" + result);
										var tempArr = result.split(',');
										if(tempArr[0] == 1) {
											w.onclose = function() {
												clearInterval();
											}
											var n = tempArr[1];
												w.setTitle("转码中，请等待...\n" + tempArr[1] + '%');
												if(n >= 100) {
													w.close();
													clearInterval();
												}
										} else {
											self.data.VideoNum--;
											console.log('result000:' + tempArr[1]);
											self.addVideos('file://' + tempArr[1], function() {
												console.log("录像 callback");
											});
										}
									}, function(result) {
										console.log('result001:' + result);
									});

								}
							}, function(err) {
								mui.toast(err.message);
							});
						}
						break;
					case 2: //从相册选择
						Gallery.pickVideo(function(data) {
							if(plus.os.name == 'Android') {
								if(data.flag == 1) {
									var path = data.path;
									var oldPath = path.substring(7, path.length);
									console.log("path==============" + path + ",oldPath========" + oldPath)
									var newPath = oldPath.substring(0, oldPath.lastIndexOf('/')) + '/imgCompress/' + new Date().getTime() + '.mp4';
									var json = {
										filePath: oldPath,
										newPath: newPath
									}
									plus.compressVideo.compress(JSON.stringify(json), function(result) {
										console.log(JSON.stringify(result));
										var obj = JSON.parse(result[0]);
										var wd = events.showWaiting('处理中...');
										if(obj.code == 0) {
											self.data.VideoNum--;
											self.addVideos(obj.msg, function() {
												//													data.wd.close();
												wd.close();
											});
										} else {
											wd.close();
											//											data.wd.close();
											mui.alert(obj.msg, '校讯通', function() {});
										}
									}, function(result) {
										console.log("result" + result[0]);
										mui.toast("视频转码失败")
									});
								}
							} else {
								var fpath = data.path;
								//								RecordVideo.recordVideo({}, function(fpath) {
								if(self.data.VideoNum > 0) {
									console.log('recordVideo00002');
									var w = plus.nativeUI.showWaiting("转码中，请等待...\n0%");
									plus.compressVideo.ioscompress(fpath, function(result) {
										console.log("result:" + result);
										var tempArr = result.split(',');
										if(tempArr[0] == 1) {
											w.onclose = function() {
												clearInterval();
											}
											var n = tempArr[1];
												w.setTitle("转码中，请等待...\n" + tempArr[1] + '%');
												if(n >= 100) {
													w.close();
													clearInterval();
												}
										} else {
											self.data.VideoNum--;
											console.log('result000:' + tempArr[1]);
											self.addVideos('file://' + tempArr[1], function() {
												console.log("录像 callback");
											});
										}
									}, function(result) {
										console.log('result001:' + result);
									});
								}
								//							}, function(err) {
								//								mui.toast(err.message);
								//							});
							}
						});
						break;
				}
			});
		} else {
			mui.toast('视频数量超出限制');
		}
	}

	//初始化删除录制的视频的监听
	proto.initDelVideoEvent = function(element) {
		var self = this;
		document.activeElement.blur();
		var id = element.id.replace('MultiMedia_Video_Delete_', '');
		var parent = element.parentNode;
		//删除数组
		for(var i = 0; i < self.data.VideoArray.length; i++) {
			if(self.data.VideoArray[i].id == id) {
				self.data.VideoArray.splice(i, 1);
				self.data.VideoNum++;
			}
		}
		//删除界面的视频
		parent.parentNode.removeChild(parent);
		//调整界面高度
		self.changeFooterHeight(1, self.data.VideoArray.length);
		self.videoChangeCallBack();
	}

	/**
	 * 播放视频的监听
	 * @param {Object} element
	 */
	proto.initPlayVideoEvent = function(element) {
		var self = this;
		document.activeElement.blur();
		var id = element.id.replace('MultiMedia_Video_Play_', '');
		var videoOption;
		for(var i = 0; i < self.data.VideoArray.length; i++) {
			if(self.data.VideoArray[i].id == id) {
				videoOption = self.data.VideoArray[i];
				break;
			}
		}
		self.videoPlayCallBack(videoOption);
	}

	/**
	 * 录制音频的监听
	 * @param {Object} element
	 */
	proto.initAudioEvent = function(element) {
		var self = this;
		document.activeElement.blur();
		//已经选择了图片
		if(self.options.Picture && self.data.PictureNum * 1 < self.options.TotalPicture) {
			mui.toast('音频与图片不能同时添加');
			return false;
		}
		//已经录制了视频
		if(self.options.Video && self.data.VideoNum * 1 < self.options.TotalVideo) {
			mui.toast('音频与视频不能同时添加');
			return false;
		}
		if(self.data.AudioNum > 0) {
			var main = plus.webview.currentWebview();
			events.openNewWindowWithData('../utils/record_audio.html', {
				webid: main.id,
				winid: 'MultiMediaRecordAudio'
			});
		} else {
			mui.toast('音频数量超出限制');
		}
	}

	/**
	 * 删除音频的监听
	 * @param {Object} element
	 */
	proto.initDelAudioEvent = function(element) {
		var self = this;
		var parent = element.parentNode;
		var ids = parent.id.split('-');
		//删除数组
		for(var i = 0; i < self.data.AudioArray.length; i++) {
			if(self.data.AudioArray[i].fpath == ids[0]) {
				self.data.AudioArray.splice(i, 1);
				self.data.AudioNum++;
			}
		}
		parent.parentNode.removeChild(parent);
	}

	/**
	 * 播放某个音频
	 * @param {Object} element
	 */
	proto.initPlayAudioEvent = function(element) {
		var ids = element.parentNode.id.split('-');
		this.audioPlayCallBack({
			fpath: ids[0],
			time: ids[1]
		});
	}

	/**
	 * 显示图片的选择方式
	 */
	proto.pictureActionSheet = function(type) {
		////console.log('pictureActionSheet');
		type = type || 0;
		if(type == 0) {
			//拍取照片
			this.pictureTake();
		} else {
			//从相册选取照片
			this.picturesPick(this.data.PictureNum);
		}
	}

	/**
	 * 相机拍取照片
	 */
	proto.pictureTake = function() {
		var self = this;
		mod.cameraTake(function(path) {
			////console.log('pictureTake :' + path);
			var wd = events.showWaiting('处理中...');
			var myDate = new Date();
			var fileName = self.options.Key + myDate.getTime() + (Math.floor(Math.random() * 10)) + '.png';
			var dst = '_documents/' + imageId + '_' + fileName;
			imageId++;
			compress.compressImageTo_1MB({
				path: path,
				dst: dst
			}, function(event) {
				self.addImages([event.target]);
				wd.close();
			}, function(error) {
				mui.toast(error.message);
				wd.close();
			});
		}, function() {
			var code = error.code; // 错误编码
			var message = error.message; // 错误描述信息
			mui.toast('从相册选取图片失败 ' + '错误编码 ' + code + '描述信息 ' + message);
		});
	}

	/**
	 * 相册选择图片
	 * @param {Object} multiple
	 * @param {Object} num
	 */
	proto.picturesPick = function(NumPick) {
		////console.log('picturesPick');
		var self = this;
		mod.galleryPickFalse('image', true, NumPick, function(event) {
			var wd = events.showWaiting('处理中...');
			var files = event.files; // 保存多选的图片或视频文件路径
			var myDate = new Date();
			var num = 0;
			var tempArrary = [];
			for(var i = 0; i < files.length; i++) {
				var fileName = imageId + '_' + i + '_' + self.options.Key + myDate.getTime() + (Math.floor(Math.random() * 10)) + '.png';
				imageId++;
				var dst = '_documents/' + fileName;
				tempArrary.push({
					fpath: files[i], //文件路径
					dst: dst //压缩后的路径
				});
			}

			for(var i = 0; i < tempArrary.length; i++) {
				compress.compressImageTo_1MB({
					path: tempArrary[i].fpath,
					dst: tempArrary[i].dst
				}, function(event) {
					num++;
					var target = event.target;
					var nameArray = target.split('/');
					var name = nameArray[nameArray.length - 1];
					var id = name.split('_')[1];
					tempArrary[id].target = target;
					if(num == files.length) {
						var tempFiles = [];
						for(var i = 0; i < tempArrary.length; i++) {
							tempFiles.push(tempArrary[i].target);
						}
						self.addImages(tempFiles);
						wd.close();
					}
				}, function(error) {
					mui.toast(error.message);
					wd.close();
				});
			}
		}, function(error) {
			mui.toast('从相册选取图片失败 ' + '错误编码 ' + error.code + '描述信息 ' + error.message);
		});
	}

	/**
	 * 显示选择的图片
	 * @param {Object} path 图片路径
	 */
	proto.addImages = function(paths) {
		var self = this;
		var width = self.data.PictureWith;
		var widthStr = self.data.PictureWith + 'px';
		var marginLeft = self.data.PictureMarginLeft;
		var group = 'MultiMedia_Picture';
		for(var i = 0; i < paths.length; i++) {
			////console.log('addImages ' + paths[i]);
			var pathArrary = paths[i].split('/');
			var name = pathArrary[pathArrary.length - 1];
			var id = name.split('_')[0];
			var images = {
				id: id, //图片Id
				path: paths[i], //图片路径
				domain: '', //图片地址
				thumb: '' //图片缩略图地址
			};
			self.data.PictureNum--;
			self.data.PictureArray.push(images);
			var element = document.createElement('div');
			element.className = 'multimedia-picture-area';
			//删除按钮
			var html_0 = '<a id="MultiMedia_Picture_Delete_' + images.id + '" class="mui-icon iconfont icon-guanbi multimedia-picture-delete" style="margin-left: ' + parseInt(width + marginLeft / 2) + 'px;margin-top:' + parseInt(marginLeft / 2) + 'px;"></a>'
			//显示图片的区域
			var html_1 = '<div class="multimedia-picture" style="width: ' + width + 'px; height: ' + width + 'px; margin-left: ' + marginLeft + 'px; margin-top: ' + marginLeft + 'px;">'
			//图片
			var html_2 = '<img src="' + paths[i] + '" data-preview-src="' + paths[i] + '" data-preview-group="' + group + '" style="width:100%;visibility: hidden;" onload="if(this.offsetHeight<this.offsetWidth){this.style.height=\'' + widthStr + '\';this.style.width=\'initial\';this.style.marginLeft=-parseInt((this.offsetWidth-' + width + ')/2)+\'px\';}else{this.style.marginTop=-parseInt((this.offsetHeight-' + width + ')/2)+\'px\';}this.style.visibility=\'visible\';" />';
			var html_3 = '</div>'
			element.innerHTML = html_0 + html_1 + html_2 + html_3;
			document.getElementById("MultiMedia_Picture_Footer").appendChild(element);
			self.imageChangeCallBack();
		}
		////console.log(document.getElementById("MultiMedia").innerHTML);
		self.changeFooterHeight(0, self.data.PictureArray.length);
	}

	/**
	 * 调整图片,视频区域的高度
	 * @param {Object} type 元素的类型0图片;1视频
	 * @param {Object} length 元素的数量
	 */
	proto.changeFooterHeight = function(type, length) {
		var self = this;
		var width;
		var marginLeft;
		var footer;
		var type = type || 0;
		if(type == 0) { //图片区域
			width = self.data.PictureWith;
			marginLeft = self.data.PictureMarginLeft;
			footer = document.getElementById("MultiMedia_Picture_Footer");
		} else { //视频
			width = self.data.VideoWith;
			marginLeft = self.data.VideoMarginLeft;
			footer = document.getElementById("MultiMedia_Video_Footer");
		}
		var num = length || 0;
		if(num == 0) { //0张
			footer.style.height = '0px';
		} else if(num > 0 && num < 5) { //1-4张,一行
			footer.style.height = width + marginLeft * 2 + 'px';
		} else if(num > 4 && num < 9) { //5-8张，二行
			footer.style.height = width * 2 + marginLeft * 3 + 'px';
		} else if(num > 8 && num < 13) { //9-12张，三行
			footer.style.height = width * 3 + marginLeft * 4 + 'px';
		} else {
			//console.log('### ERROR ### 数量超过 12，放置的区域未设置相应的高度');
		}
	}

	/**
	 * 清空图片选择区域和初始化数据
	 */
	proto.imageRefresh = function() {
		var self = this;
		self.data.PictureNum = self.options.TotalPicture; //可以选取图片的剩余数量
		self.data.PictureArray = []; //已选取的图片路径
		document.getElementById("MultiMedia_Picture_Footer").innerHTML = '';
		self.changeFooterHeight(0, self.data.PictureArray.length);
	}

	/**
	 * 显示录制的视频
	 * @param {Object} path 视频路径
	 */
	proto.addVideos = function(path, callback) {
		var self = this;
		//生成缩略图
		console.log("addVideos " + path);
		self.addVideosThumb(path, callback);
	}

	/**
	 * 生成缩略图
	 * @param {Object} path 视频路径
	 */
	proto.addVideosThumb = function(path, callback) {
		var self = this;
		var video = document.createElement("video");
		video.onloadedmetadata = function() {
			var width = self.data.VideoWith;
			var marginLeft = self.data.VideoMarginLeft;
			var pathArray = path.split('/');
			var canvas = document.createElement('canvas');
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
			var thumb = canvas.toDataURL("image/png");
			//console.log("video " + video.videoWidth + " " + video.videoWidth);
			//console.log("canvas " + canvas.width + " " + canvas.height);
			//增加视频
			var videos = {
				id: pathArray[pathArray.length - 1], //视频Id
				path: path, //视频路径
				localthumb: thumb, //视频本地的缩略图地址
				domain: '', //视频地址
				thumb: '', //视频缩略图地址
				width: canvas.width, //视频缩略图宽
				height: canvas.height, //视频缩略图高
				duration: parseInt(video.duration) //视频时长
			};
			self.data.VideoArray.push(videos);

			//显示视频
			var element = document.createElement('div');
			element.className = 'multimedia-picture-area';
			//删除按钮
			var html_0 = '<a id="MultiMedia_Video_Delete_' + videos.id + '" class="mui-icon iconfont icon-guanbi multimedia-picture-delete" style="margin-left: ' + parseInt(width + marginLeft / 2) + 'px;margin-top:' + parseInt(marginLeft / 2) + 'px;"></a>'
			//显示视频缩略图的区域
			var html_1 = '<div class="multimedia-picture" style="width: ' + width + 'px; height: ' + width + 'px; margin-left: ' + marginLeft + 'px; margin-top: ' + marginLeft + 'px;">'
			//播放按钮
			var html_2 = '<img id="MultiMedia_Video_Play_' + videos.id + '" class="multimedia-video-play" src="../../img/utils/playvideo1.png" style="width: ' + 30 + 'px; height: ' + 30 + 'px;left: ' + parseInt((width - 30) / 2) + 'px;top: ' + parseInt((width - 30) / 2) + 'px; "/>';
			//视频缩略图
			var html_3 = '<img src="../../img/utils/videothumb.png" style="width:100%;visibility: hidden;" onload="if(this.offsetHeight<this.offsetWidth){this.style.height=\'' + width + 'px\';this.style.width=\'initial\';this.style.marginLeft=-parseInt((this.offsetWidth-' + width + ')/2)+\'px\';}else{this.style.marginTop=-parseInt((this.offsetHeight-' + width + ')/2)+\'px\';}this.style.visibility=\'visible\';" />';
			var html_4 = '</div>'
			element.innerHTML = html_0 + html_1 + html_2 + html_3 + html_4;
			document.getElementById("MultiMedia_Video_Footer").appendChild(element);
			self.changeFooterHeight(1, self.data.VideoArray.length);
			self.videoChangeCallBack();
			callback();
		}

		video.onerror = function() {
			mui.toast("视频加载失败");
			callback();
		}
		video.src = path;
	}

	/**
	 * 清空视频区域和初始化数据
	 */
	proto.videoRefresh = function() {
		var self = this;
		self.data.VideoNum = self.options.TotalVideo; //可以选取图片的剩余数量
		self.data.VideoArray = []; //已选取的图片路径
		document.getElementById("MultiMedia_Video_Footer").innerHTML = '';
		self.changeFooterHeight(1, self.data.VideoArray.length);
	}

	/**
	 * 显示录制的音频
	 * @param {Object} data 音频路径和时间
	 */
	proto.addAudios = function(data) {
		//console.log('addAudios ' + JSON.stringify(data));
		var self = this;
		var width = self.data.AudioWith;
		var marginLeft = self.data.AudioMarginLeft;
		var time = playutil.audioTimePercent(data.time);
		self.data.AudioArray.push(data);
		var width_button = (plus.screen.resolutionWidth - 80) * time * 0.01;
		//显示音频
		var element = document.createElement('div');
		element.id = data.fpath + '-' + data.time;
		element.className = 'multimedia-audio-area';
		element.innerHTML = '<span class="mui-icon mui-icon-closeempty multimedia-audio-icon-closeempty"></span>\
							<button type="button" class="mui-btn mui-btn-grey mui-btn-outlined multimedia-audio-button" style="width: ' + width_button + 'px;">\
								<div class="multimedia-audio-triangle multimedia-audio-triangle-out"></div>\
								<div class="multimedia-audio-triangle multimedia-audio-triangle-in"></div>\
								<div class="multimedia-audio-time">' + data.time + '\'\'</div>\
								<span class="mui-icon iconfont icon-yuyin4 multimedia-audio-icon"></span>\
							</button>';
		document.getElementById("MultiMedia_Audio_Footer").appendChild(element);
		self.audioChangeCallBack();
	}

	/**
	 * 图片数量变化的回调
	 */
	proto.imageChangeCallBack = function() {}
	/**
	 * 视频数量变化的回调
	 */
	proto.videoChangeCallBack = function() {}
	/**
	 * 音频数量变化的回调
	 */
	proto.audioChangeCallBack = function() {}
	/**
	 * 播放某个视频
	 */
	proto.videoPlayCallBack = function(data) {}
	/**
	 * 播放某个音频
	 */
	proto.audioPlayCallBack = function(data) {}

	var MultiMediaApi = null; //声明一个null的变量，用来存储多媒体对象

	//创建并返回一个多媒体对象
	mod.multiMedia = function(options) {
		////console.log('multiMedia ' + JSON.stringify(options));
		if(!MultiMediaApi) {
			MultiMediaApi = new MultiMedia(options); //new一个多媒体对象
		}
		return MultiMediaApi;
	};

	//返回一个多媒体对象
	mod.getMultiMedia = function() {
		return MultiMediaApi;
	}

	/**
	 * 调使用5+统一相册选择界面选择照片或视频
	 * @param {Object} filter 相册选择文件过滤类型,图片文件（“image”）,视频文件（“video”）,所有文件（“none”）
	 * @param {Object} multiple 是否是多选，多选true
	 * @param {Object} maximum 最多选择的图片数量，单选设置1
	 * @param {Object} successCB 选择照片成功的回调
	 * @param {Object} errorCB 选择照片失败的回调
	 */
	mod.galleryPickFalse = function(filter, multiple, maximum, successCB, errorCB) {
		////console.log('galleryPickFalse | filter ' + filter + ' | multiple ' + multiple + ' | maximum ' + maximum);
		plus.gallery.pick(function(event) {
			successCB(event);
		}, function(error) {
			mod.galleryPickError(error, errorCB);
		}, {
			filter: filter,
			maximum: maximum,
			multiple: multiple,
			onmaxed: function() {
				mui.alert('图片数量超出限制');
			},
			system: false //多选必须设置的参数
		});
	}

	/**
	 *  系统自带相册选择控件
	 */
	mod.galleryPickTrue = function(successCB, errorCB) {
		plus.gallery.pick(function(file) {
			////console.log('从相册选取图片成功,图片的路径为：' + file);
			successCB(file) //压缩图片
		}, function(error) {
			mod.galleryPickError(error, errorCB);
		});
	}

	/**
	 * 拍照
	 * @param {Object} successCB 成功的回调
	 * @param {Object} errorCB 失败的回调
	 */
	mod.cameraTake = function(successCB, errorCB) {
		//获取设备默认的摄像头对象
		var cmr = plus.camera.getCamera();
		cmr.captureImage(function(capturedFile) {
				//将本地URL路径转换成平台绝对路径
				var path = 'file://' + plus.io.convertLocalFileSystemURL(capturedFile);
				////console.log('转换成平台绝对路径,图片的路径为 ' + path);
				successCB(path);
			},
			function(error) {
				// 拍照失败的回调
				var code = error.code; // error.code（Number类型）获取错误编码
				var message = error.message; // error.message（String类型）获取错误描述信息。
				if(plus.os.name == 'iOS') {
					if(code !== 2) {
						errorCB({
							code: code, // 错误编码
							message: 'iOS ' + message // 错误描述信息
						});
						mui.toast('拍照失败！' + '错误编码：' + code + ' 描述信息：' + message, '拍照失败');
						//console.log('### ERROR ### 拍照失败 ' + JSON.stringify(error));
					} else {
						//console.log('未拍取图片 ' + JSON.stringify(error));
					}
				} else if(plus.os.name == 'Android') {
					if(code !== 11) {
						errorCB({
							code: code, // 错误编码
							message: 'Android ' + message // 错误描述信息
						});
						//console.log('### ERROR ### 拍照失败 ' + JSON.stringify(error));
					} else {
						//console.log('未拍取图片 ' + JSON.stringify(error));
					}
				} else {
					errorCB({
						code: code, // 错误编码
						message: plus.os.name + ' ' + message // 错误描述信息
					});
				}
			}, {}
		);
	}

	/**
	 * 从相册中选取文件失败
	 * @param {Object} error
	 * @param {Object} callBack
	 */
	mod.galleryPickError = function(error, errorCB) {
		if(plus.os.name == 'iOS') { //苹果
			if(error.code != -2) {
				//console.log('### ERROR ### 从相册选取图片失败 ' + JSON.stringify(error));
				errorCB({
					code: error.code, // 错误编码
					message: error.message // 错误描述信息
				});
			} else {
				//console.log('未选取文件 ' + JSON.stringify(error));
			}
		} else if(plus.os.name == 'Android') { //安卓
			if(error.code != 12) {
				//console.log('### ERROR ### 从相册选取图片失败 ' + JSON.stringify(error));
				errorCB({
					code: error.code, // 错误编码
					message: error.message // 错误描述信息
				});
			} else {
				//console.log('未选取文件 ' + JSON.stringify(error));
			}
		} else { //其他
			errorCB({
				code: error.code, // 错误编码
				message: plus.os.name + ' ' + error.message // 错误描述信息
			});
		}
	}

	return mod;

})(mui, window.MultiMedia || {});