//扩展mui.showLoading
(function($, window) {
	//扩展mui.showLoading
    //显示加载框
    $.showLoading = function(message,type) {
        if ($.os.plus && type !== 'div') {
            $.plusReady(function() {
                plus.nativeUI.showWaiting(message);
            });
        } else {
            var html = '';
            html += '<i class="mui-spinner mui-spinner-white"></i>';
            html += '<p class="text">' + (message || "数据加载中") + '</p>';

            //遮罩层
            var mask=document.getElementsByClassName("mui-show-loading-mask");
            if(mask.length==0){
                mask = document.createElement('div');
                mask.classList.add("mui-show-loading-mask");
                document.body.appendChild(mask);
                mask.addEventListener("touchmove", function(e){e.stopPropagation();e.preventDefault();});
            }else{
                mask[0].classList.remove("mui-show-loading-mask-hidden");
            }
            //加载框
            var toast=document.getElementsByClassName("mui-show-loading");
            if(toast.length==0){
                toast = document.createElement('div');
                toast.classList.add("mui-show-loading");
                toast.classList.add('loading-visible');
                document.body.appendChild(toast);
                toast.innerHTML = html;
                toast.addEventListener("touchmove", function(e){e.stopPropagation();e.preventDefault();});
            }else{
                toast[0].innerHTML = html;
                toast[0].classList.add("loading-visible");
            }
        }   
    };

    //隐藏加载框
	$.hideLoading = function(callback) {
	    if ($.os.plus) {
	        $.plusReady(function() {
	            plus.nativeUI.closeWaiting();
	        });
	    } 
	    var mask=document.getElementsByClassName("mui-show-loading-mask");
	    var toast=document.getElementsByClassName("mui-show-loading");
	    if(mask.length>0){
	        mask[0].classList.add("mui-show-loading-mask-hidden");
	    }
	    if(toast.length>0){
	        toast[0].classList.remove("loading-visible");
	        callback && callback();
	    }
	}
	
	$.getDate = function ( format ) {
         var date = new Date();
		 var sign1 = "-";
		 var sign2 = ":";
		 var year = date.getFullYear() // 年
		 var month = date.getMonth() + 1; // 月
		 var day  = date.getDate(); // 日 
		 var hour = date.getHours(); // 时
		 var minutes = date.getMinutes(); // 分
		 var seconds = date.getSeconds() //秒
		 var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
		 var week = weekArr[date.getDay()];
		 // 给一位数数据前面加 “0”
		 if (month >= 1 && month <= 9) {
		  month = "0" + month;
		 }
		 if (day >= 0 && day <= 9) {
		  day = "0" + day;
		 }
		 if (hour >= 0 && hour <= 9) {
		  hour = "0" + hour;
		 }
		 if (minutes >= 0 && minutes <= 9) {
		  minutes = "0" + minutes;
		 }
		 if (seconds >= 0 && seconds <= 9) {
		  seconds = "0" + seconds;
		 }
		 var currentdate = '';
		 if( !format ) {
		 	currentdate = year + sign1 + month + sign1 + day + " " + hour + sign2 + minutes + sign2 + seconds + " " + week;
		 }else{
		 	currentdate = format.replace('yyyy', year)
		 						.replace('MM', month )
		 						.replace('dd', day )
		 						.replace('HH', hour )
		 						.replace('mm', minutes )
		 						.replace('ss', seconds )
		 						.replace('w', week );
		 }
		 return currentdate;
    }
})(mui, window);


/*图片预览mui.previewImage();*/
(function($, window) {

    var template = '<div id="{{id}}" class="mui-slider mui-preview-image mui-fullscreen"><div class="mui-preview-header">{{header}}</div><div class="mui-slider-group"></div><div class="mui-preview-footer mui-hidden">{{footer}}</div><div class="mui-preview-loading"><span class="mui-spinner mui-spinner-white"></span></div></div>';
    var itemTemplate = '<div class="mui-slider-item mui-zoom-wrapper {{className}}"><div class="mui-zoom-scroller"><img src="{{src}}" data-preview-lazyload="{{lazyload}}" style="{{style}}" class="mui-zoom"></div></div>';
    var defaultGroupName = '__DEFAULT';
    var div = document.createElement('div');
    var imgId = 0;
    var PreviewImage = function(options) {
        this.options = $.extend(true, {
            id: '__MUI_PREVIEWIMAGE',
            zoom: true,
            header: '<span class="mui-preview-indicator"></span>',
            footer: ''
        }, options || {});
        this.init();
        this.initEvent();
    };
    var proto = PreviewImage.prototype;
    proto.init = function() {
        var options = this.options;
        var el = document.getElementById(this.options.id);
        if (!el) {
            div.innerHTML = template.replace(/\{\{id\}\}/g, this.options.id).replace('{{header}}', options.header).replace('{{footer}}', options.footer);
            document.body.appendChild(div.firstElementChild);
            el = document.getElementById(this.options.id);
        }

        this.element = el;
        this.scroller = this.element.querySelector($.classSelector('.slider-group'));
        this.indicator = this.element.querySelector($.classSelector('.preview-indicator'));
        this.loader = this.element.querySelector($.classSelector('.preview-loading'));
        if (options.footer) {
            this.element.querySelector($.classSelector('.preview-footer')).classList.remove($.className('hidden'));
        }
        this.addImages();
    };
    proto.initEvent = function() {
        var self = this;
        $(document.body).on('tap', 'img[data-preview-src]', function() {
            if (self.isAnimationing()) {
                return false;
            }
            self.open(this);
            return false;
        });
        var laterClose = null;
        var laterCloseEvent = function() {
            !laterClose && (laterClose = $.later(function() {
                self.isInAnimation = true;
                self.loader.removeEventListener('tap', laterCloseEvent);
                self.scroller.removeEventListener('tap', laterCloseEvent);
                self.close();
            }, 300));
        };
        this.scroller.addEventListener('doubletap', function() {
            if (laterClose) {
                laterClose.cancel();
                laterClose = null;
            }
        });
        this.element.addEventListener('webkitAnimationEnd', function() {
            if (self.element.classList.contains($.className('preview-out'))) { //close
                self.element.style.display = 'none';
                self.element.classList.remove($.className('preview-out'));
                laterClose = null;
            } else { //open
                self.loader.addEventListener('tap', laterCloseEvent);
                self.scroller.addEventListener('tap', laterCloseEvent);
            }
            self.isInAnimation = false;
        });
        this.element.addEventListener('slide', function(e) {
            if (self.options.zoom) {
                var lastZoomerEl = self.element.querySelector('.mui-zoom-wrapper:nth-child(' + (self.lastIndex + 1) + ')');
                if (lastZoomerEl) {
                    $(lastZoomerEl).zoom().setZoom(1);
                }
            }
            var slideNumber = e.detail.slideNumber;
            self.lastIndex = slideNumber;
            self.indicator && (self.indicator.innerText = (slideNumber + 1) + '/' + self.currentGroup.length);
            self._loadItem(slideNumber);

        });
    };
    proto.isAnimationing = function() {
        if (this.isInAnimation) {
            return true;
        }
        this.isInAnimation = true;
        return false;
    };
    proto.addImages = function(group, index) {
        this.groups = {};
        var imgs = [];
        if (group) {
            if (group === defaultGroupName) {
                imgs = document.querySelectorAll("img[data-preview-src]:not([data-preview-group])");
            } else {
                imgs = document.querySelectorAll("img[data-preview-src][data-preview-group='" + group + "']");
            }
        } else {
            imgs = document.querySelectorAll("img[data-preview-src]");
        }
        if (imgs.length) {
            for (var i = 0, len = imgs.length; i < len; i++) {
                this.addImage(imgs[i]);
            }
        }
    };
    proto.addImage = function(img) {
        var group = img.getAttribute('data-preview-group');
        group = group || defaultGroupName;
        if (!this.groups[group]) {
            this.groups[group] = [];
        }
        var src = img.getAttribute('src');
        if (img.__mui_img_data && img.__mui_img_data.src === src) { //已缓存且图片未变化
            this.groups[group].push(img.__mui_img_data);
        } else {
            var lazyload = img.getAttribute('data-preview-src');
            if (!lazyload) {
                lazyload = src;
            }
            var imgObj = {
                src: src,
                lazyload: src === lazyload ? '' : lazyload,
                loaded: src === lazyload ? true : false,
                sWidth: 0,
                sHeight: 0,
                sTop: 0,
                sLeft: 0,
                sScale: 1,
                el: img
            };
            this.groups[group].push(imgObj);
            img.__mui_img_data = imgObj;
        }
    };


    proto.empty = function() {
        this.scroller.innerHTML = '';
    };
    proto._initImgData = function(itemData, imgEl) {
        if (!itemData.sWidth) {
            var img = itemData.el;
            itemData.sWidth = img.offsetWidth;
            itemData.sHeight = img.offsetHeight;
            var offset = $.offset(img);
            itemData.sTop = offset.top;
            itemData.sLeft = offset.left;
            itemData.sScale = Math.max(itemData.sWidth / window.innerWidth, itemData.sHeight / window.innerHeight);
        }
        imgEl.style.webkitTransform = 'translate3d(0,0,0) scale(' + itemData.sScale + ')';
    };

    proto._getScale = function(from, to) {
        var scaleX = from.width / to.width;
        var scaleY = from.height / to.height;
        var scale = 1;
        if (scaleX <= scaleY) {
            scale = from.height / (to.height * scaleX);
        } else {
            scale = from.width / (to.width * scaleY);
        }
        return scale;
    };
    proto._imgTransitionEnd = function(e) {
        var img = e.target;
        img.classList.remove($.className('transitioning'));
        img.removeEventListener('webkitTransitionEnd', this._imgTransitionEnd.bind(this));
    };
    proto._loadItem = function(index, isOpening) { //TODO 暂时仅支持img
        var itemEl = this.scroller.querySelector($.classSelector('.slider-item:nth-child(' + (index + 1) + ')'));
        var itemData = this.currentGroup[index];
        var imgEl = itemEl.querySelector('img');
        this._initImgData(itemData, imgEl);
        if (isOpening) {
            var posi = this._getPosition(itemData);
            imgEl.style.webkitTransitionDuration = '0ms';
            imgEl.style.webkitTransform = 'translate3d(' + posi.x + 'px,' + posi.y + 'px,0) scale(' + itemData.sScale + ')';
            imgEl.offsetHeight;
        }
        if (!itemData.loaded && imgEl.getAttribute('data-preview-lazyload')) {
            var self = this;
            self.loader.classList.add($.className('active'));
            //移动位置动画
            imgEl.style.webkitTransitionDuration = '0.5s';
            imgEl.addEventListener('webkitTransitionEnd', self._imgTransitionEnd.bind(self));
            imgEl.style.webkitTransform = 'translate3d(0,0,0) scale(' + itemData.sScale + ')';
            this.loadImage(imgEl, function() {
                itemData.loaded = true;
                imgEl.src = itemData.lazyload;
                self._initZoom(itemEl, this.width, this.height);
                imgEl.classList.add($.className('transitioning'));
                imgEl.addEventListener('webkitTransitionEnd', self._imgTransitionEnd.bind(self));
                imgEl.setAttribute('style', '');
                imgEl.offsetHeight;
                self.loader.classList.remove($.className('active'));
            });
        } else {
            itemData.lazyload && (imgEl.src = itemData.lazyload);
            this._initZoom(itemEl, imgEl.width, imgEl.height);
            imgEl.classList.add($.className('transitioning'));
            imgEl.addEventListener('webkitTransitionEnd', this._imgTransitionEnd.bind(this));
            imgEl.setAttribute('style', '');
            imgEl.offsetHeight;
        }
        this._preloadItem(index + 1);
        this._preloadItem(index - 1);
    };
    proto._preloadItem = function(index) {
        var itemEl = this.scroller.querySelector($.classSelector('.slider-item:nth-child(' + (index + 1) + ')'));
        if (itemEl) {
            var itemData = this.currentGroup[index];
            if (!itemData.sWidth) {
                var imgEl = itemEl.querySelector('img');
                this._initImgData(itemData, imgEl);
            }
        }
    };
    proto._initZoom = function(zoomWrapperEl, zoomerWidth, zoomerHeight) {
        if (!this.options.zoom) {
            return;
        }
        if (zoomWrapperEl.getAttribute('data-zoomer')) {
            return;
        }
        var zoomEl = zoomWrapperEl.querySelector($.classSelector('.zoom'));
        if (zoomEl.tagName === 'IMG') {
            var self = this;
            var maxZoom = self._getScale({
                width: zoomWrapperEl.offsetWidth,
                height: zoomWrapperEl.offsetHeight
            }, {
                width: zoomerWidth,
                height: zoomerHeight
            });
            $(zoomWrapperEl).zoom({
                maxZoom: Math.max(maxZoom, 1)
            });
        } else {
            $(zoomWrapperEl).zoom();
        }
    };
    proto.loadImage = function(imgEl, callback) {
        var onReady = function() {
            callback && callback.call(this);
        };
        var img = new Image();
        img.onload = onReady;
        img.onerror = onReady;
        img.src = imgEl.getAttribute('data-preview-lazyload');
    };
    proto.getRangeByIndex = function(index, length) {
        return {
            from: 0,
            to: length - 1
        };
        //      var from = Math.max(index - 1, 0);
        //      var to = Math.min(index + 1, length);
        //      if (index === length - 1) {
        //          from = Math.max(length - 3, 0);
        //          to = length - 1;
        //      }
        //      if (index === 0) {
        //          from = 0;
        //          to = Math.min(2, length - 1);
        //      }
        //      return {
        //          from: from,
        //          to: to
        //      };
    };

    proto._getPosition = function(itemData) {
        var sLeft = itemData.sLeft - window.pageXOffset;
        var sTop = itemData.sTop - window.pageYOffset;
        var left = (window.innerWidth - itemData.sWidth) / 2;
        var top = (window.innerHeight - itemData.sHeight) / 2;
        return {
            left: sLeft,
            top: sTop,
            x: sLeft - left,
            y: sTop - top
        };
    };
    proto.refresh = function(index, groupArray) {
        this.currentGroup = groupArray;
        //重新生成slider
        var length = groupArray.length;
        var itemHtml = [];
        var currentRange = this.getRangeByIndex(index, length);
        var from = currentRange.from;
        var to = currentRange.to + 1;
        var currentIndex = index;
        var className = '';
        var itemStr = '';
        var wWidth = window.innerWidth;
        var wHeight = window.innerHeight;
        for (var i = 0; from < to; from++, i++) {
            var itemData = groupArray[from];
            var style = '';
            if (itemData.sWidth) {
                style = '-webkit-transform:translate3d(0,0,0) scale(' + itemData.sScale + ');transform:translate3d(0,0,0) scale(' + itemData.sScale + ')';
            }
            itemStr = itemTemplate.replace('{{src}}', itemData.src).replace('{{lazyload}}', itemData.lazyload).replace('{{style}}', style);
            if (from === index) {
                currentIndex = i;
                className = $.className('active');
            } else {
                className = '';
            }
            itemHtml.push(itemStr.replace('{{className}}', className));
        }
        this.scroller.innerHTML = itemHtml.join('');
        this.element.style.display = 'block';
        this.element.classList.add($.className('preview-in'));
        this.lastIndex = currentIndex;
        this.element.offsetHeight;
        $(this.element).slider().gotoItem(currentIndex, 0);
        this.indicator && (this.indicator.innerText = (currentIndex + 1) + '/' + this.currentGroup.length);
        this._loadItem(currentIndex, true);
    };
    proto.openByGroup = function(index, group) {
        index = Math.min(Math.max(0, index), this.groups[group].length - 1);
        this.refresh(index, this.groups[group]);
    };
    proto.open = function(index, group) {
        if (this.element.classList.contains($.className('preview-in'))) {
            return;
        }
        if (typeof index === "number") {
            group = group || defaultGroupName;
            this.addImages(group, index); //刷新当前group
            this.openByGroup(index, group);
        } else {
            group = index.getAttribute('data-preview-group');
            group = group || defaultGroupName;
            this.addImages(group, index); //刷新当前group
            this.openByGroup(this.groups[group].indexOf(index.__mui_img_data), group);
        }
    };
    proto.close = function(index, group) {
        this.element.classList.remove($.className('preview-in'));
        this.element.classList.add($.className('preview-out'));
        var itemEl = this.scroller.querySelector($.classSelector('.slider-item:nth-child(' + (this.lastIndex + 1) + ')'));
        var imgEl = itemEl.querySelector('img');
        if (imgEl) {
            imgEl.classList.add($.className('transitioning'));
            var itemData = this.currentGroup[this.lastIndex];
            var posi = this._getPosition(itemData);
            var sLeft = posi.left;
            var sTop = posi.top;
            if (sTop > window.innerHeight || sLeft > window.innerWidth || sTop < 0 || sLeft < 0) { //out viewport
                imgEl.style.opacity = 0;
                imgEl.style.webkitTransitionDuration = '0.5s';
                imgEl.style.webkitTransform = 'scale(' + itemData.sScale + ')';
            } else {
                if (this.options.zoom) {
                    $(imgEl.parentNode.parentNode).zoom().toggleZoom(0);
                }
                imgEl.style.webkitTransitionDuration = '0.5s';
                imgEl.style.webkitTransform = 'translate3d(' + posi.x + 'px,' + posi.y + 'px,0) scale(' + itemData.sScale + ')';
            }
        }
        var zoomers = this.element.querySelectorAll($.classSelector('.zoom-wrapper'));
        for (var i = 0, len = zoomers.length; i < len; i++) {
            $(zoomers[i]).zoom().destory();
        }
        //      $(this.element).slider().destory();
        //      this.empty();
    };
    proto.isShown = function() {
        return this.element.classList.contains($.className('preview-in'));
    };

    var previewImageApi = null;
    $.previewImage = function(options) {
        if (!previewImageApi) {
            previewImageApi = new PreviewImage(options);
        }
        return previewImageApi;
    };
    $.getPreviewImage = function() {
        return previewImageApi;
    }

})(mui, window);

(function($, window) {
    var CLASS_ZOOM = $.className('zoom');
    var CLASS_ZOOM_SCROLLER = $.className('zoom-scroller');

    var SELECTOR_ZOOM = '.' + CLASS_ZOOM;
    var SELECTOR_ZOOM_SCROLLER = '.' + CLASS_ZOOM_SCROLLER;

    var EVENT_PINCH_START = 'pinchstart';
    var EVENT_PINCH = 'pinch';
    var EVENT_PINCH_END = 'pinchend';
    if ('ongesturestart' in window) {
        EVENT_PINCH_START = 'gesturestart';
        EVENT_PINCH = 'gesturechange';
        EVENT_PINCH_END = 'gestureend';
    }
    $.Zoom = function(element, options) {
        var zoom = this;

        zoom.options = $.extend($.Zoom.defaults, options);

        zoom.wrapper = zoom.element = element;
        zoom.scroller = element.querySelector(SELECTOR_ZOOM_SCROLLER);
        zoom.scrollerStyle = zoom.scroller && zoom.scroller.style;

        zoom.zoomer = element.querySelector(SELECTOR_ZOOM);
        zoom.zoomerStyle = zoom.zoomer && zoom.zoomer.style;

        zoom.init = function() {
            //自动启用
            $.options.gestureConfig.pinch = true;
            $.options.gestureConfig.doubletap = true;
            zoom.initEvents();
        };

        zoom.initEvents = function(detach) {
            var action = detach ? 'removeEventListener' : 'addEventListener';
            var target = zoom.scroller;

            target[action](EVENT_PINCH_START, zoom.onPinchstart);
            target[action](EVENT_PINCH, zoom.onPinch);
            target[action](EVENT_PINCH_END, zoom.onPinchend);

            target[action]('touchstart', zoom.onTouchstart);
            target[action]('touchmove', zoom.onTouchMove);
            target[action]('touchcancel', zoom.onTouchEnd);
            target[action]('touchend', zoom.onTouchEnd);

            target[action]('drag', function(e) {
                if (imageIsMoved || isGesturing) {
                    e.stopPropagation();
                }
            });
            target[action]('doubletap', function(e) {
                zoom.toggleZoom(e.detail.center);
            });
        };
        zoom.transition = function(style, time) {
            time = time || 0;
            style['webkitTransitionDuration'] = time + 'ms';
            return zoom;
        };
        zoom.translate = function(style, x, y) {
            x = x || 0;
            y = y || 0;
            style['webkitTransform'] = 'translate3d(' + x + 'px,' + y + 'px,0px)';
            return zoom;
        };
        zoom.scale = function(style, scale) {
            scale = scale || 1;
            style['webkitTransform'] = 'translate3d(0,0,0) scale(' + scale + ')';
            return zoom;
        };
        zoom.scrollerTransition = function(time) {
            return zoom.transition(zoom.scrollerStyle, time);
        };
        zoom.scrollerTransform = function(x, y) {
            return zoom.translate(zoom.scrollerStyle, x, y);
        };
        zoom.zoomerTransition = function(time) {
            return zoom.transition(zoom.zoomerStyle, time);
        };
        zoom.zoomerTransform = function(scale) {
            return zoom.scale(zoom.zoomerStyle, scale);
        };

        // Gestures
        var scale = 1,
            currentScale = 1,
            isScaling = false,
            isGesturing = false;
        zoom.onPinchstart = function(e) {
            isGesturing = true;
        };
        zoom.onPinch = function(e) {
            if (!isScaling) {
                zoom.zoomerTransition(0);
                isScaling = true;
            }
            scale = (e.detail ? e.detail.scale : e.scale) * currentScale;
            if (scale > zoom.options.maxZoom) {
                scale = zoom.options.maxZoom - 1 + Math.pow((scale - zoom.options.maxZoom + 1), 0.5);
            }
            if (scale < zoom.options.minZoom) {
                scale = zoom.options.minZoom + 1 - Math.pow((zoom.options.minZoom - scale + 1), 0.5);
            }
            zoom.zoomerTransform(scale);
        };
        zoom.onPinchend = function(e) {
            scale = Math.max(Math.min(scale, zoom.options.maxZoom), zoom.options.minZoom);
            zoom.zoomerTransition(zoom.options.speed).zoomerTransform(scale);
            currentScale = scale;
            isScaling = false;
        };
        zoom.setZoom = function(newScale) {
            scale = currentScale = newScale;
            zoom.scrollerTransition(zoom.options.speed).scrollerTransform(0, 0);
            zoom.zoomerTransition(zoom.options.speed).zoomerTransform(scale);
        };
        zoom.toggleZoom = function(position, speed) {
            if (typeof position === 'number') {
                speed = position;
                position = undefined;
            }
            speed = typeof speed === 'undefined' ? zoom.options.speed : speed;
            if (scale && scale !== 1) {
                scale = currentScale = 1;
                zoom.scrollerTransition(speed).scrollerTransform(0, 0);
            } else {
                scale = currentScale = zoom.options.maxZoom;
                if (position) {
                    var offset = $.offset(zoom.zoomer);
                    var top = offset.top;
                    var left = offset.left;
                    var offsetX = (position.x - left) * scale;
                    var offsetY = (position.y - top) * scale;
                    this._cal();
                    if (offsetX >= imageMaxX && offsetX <= (imageMaxX + wrapperWidth)) { //center
                        offsetX = imageMaxX - offsetX + wrapperWidth / 2;
                    } else if (offsetX < imageMaxX) { //left
                        offsetX = imageMaxX - offsetX + wrapperWidth / 2;
                    } else if (offsetX > (imageMaxX + wrapperWidth)) { //right
                        offsetX = imageMaxX + wrapperWidth - offsetX - wrapperWidth / 2;
                    }
                    if (offsetY >= imageMaxY && offsetY <= (imageMaxY + wrapperHeight)) { //middle
                        offsetY = imageMaxY - offsetY + wrapperHeight / 2;
                    } else if (offsetY < imageMaxY) { //top
                        offsetY = imageMaxY - offsetY + wrapperHeight / 2;
                    } else if (offsetY > (imageMaxY + wrapperHeight)) { //bottom
                        offsetY = imageMaxY + wrapperHeight - offsetY - wrapperHeight / 2;
                    }
                    offsetX = Math.min(Math.max(offsetX, imageMinX), imageMaxX);
                    offsetY = Math.min(Math.max(offsetY, imageMinY), imageMaxY);
                    zoom.scrollerTransition(speed).scrollerTransform(offsetX, offsetY);
                } else {
                    zoom.scrollerTransition(speed).scrollerTransform(0, 0);
                }
            }
            zoom.zoomerTransition(speed).zoomerTransform(scale);
        };

        zoom._cal = function() {
            wrapperWidth = zoom.wrapper.offsetWidth;
            wrapperHeight = zoom.wrapper.offsetHeight;
            imageWidth = zoom.zoomer.offsetWidth;
            imageHeight = zoom.zoomer.offsetHeight;
            var scaledWidth = imageWidth * scale;
            var scaledHeight = imageHeight * scale;
            imageMinX = Math.min((wrapperWidth / 2 - scaledWidth / 2), 0);
            imageMaxX = -imageMinX;
            imageMinY = Math.min((wrapperHeight / 2 - scaledHeight / 2), 0);
            imageMaxY = -imageMinY;
        };

        var wrapperWidth, wrapperHeight, imageIsTouched, imageIsMoved, imageCurrentX, imageCurrentY, imageMinX, imageMinY, imageMaxX, imageMaxY, imageWidth, imageHeight, imageTouchesStart = {},
            imageTouchesCurrent = {},
            imageStartX, imageStartY, velocityPrevPositionX, velocityPrevTime, velocityX, velocityPrevPositionY, velocityY;

        zoom.onTouchstart = function(e) {
            e.preventDefault();
            imageIsTouched = true;
            imageTouchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            imageTouchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
        };
        zoom.onTouchMove = function(e) {
            e.preventDefault();
            if (!imageIsTouched) return;
            if (!imageIsMoved) {
                wrapperWidth = zoom.wrapper.offsetWidth;
                wrapperHeight = zoom.wrapper.offsetHeight;
                imageWidth = zoom.zoomer.offsetWidth;
                imageHeight = zoom.zoomer.offsetHeight;
                var translate = $.parseTranslateMatrix($.getStyles(zoom.scroller, 'webkitTransform'));
                imageStartX = translate.x || 0;
                imageStartY = translate.y || 0;
                zoom.scrollerTransition(0);
            }
            var scaledWidth = imageWidth * scale;
            var scaledHeight = imageHeight * scale;

            if (scaledWidth < wrapperWidth && scaledHeight < wrapperHeight) return;

            imageMinX = Math.min((wrapperWidth / 2 - scaledWidth / 2), 0);
            imageMaxX = -imageMinX;
            imageMinY = Math.min((wrapperHeight / 2 - scaledHeight / 2), 0);
            imageMaxY = -imageMinY;

            imageTouchesCurrent.x = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            imageTouchesCurrent.y = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

            if (!imageIsMoved && !isScaling) {
                //              if (Math.abs(imageTouchesCurrent.y - imageTouchesStart.y) < Math.abs(imageTouchesCurrent.x - imageTouchesStart.x)) {
                //TODO 此处需要优化，当遇到长图，需要上下滚动时，下列判断会导致滚动不流畅
                if (
                    (Math.floor(imageMinX) === Math.floor(imageStartX) && imageTouchesCurrent.x < imageTouchesStart.x) ||
                    (Math.floor(imageMaxX) === Math.floor(imageStartX) && imageTouchesCurrent.x > imageTouchesStart.x)
                ) {
                    imageIsTouched = false;
                    return;
                }
                //              }
            }
            imageIsMoved = true;
            imageCurrentX = imageTouchesCurrent.x - imageTouchesStart.x + imageStartX;
            imageCurrentY = imageTouchesCurrent.y - imageTouchesStart.y + imageStartY;

            if (imageCurrentX < imageMinX) {
                imageCurrentX = imageMinX + 1 - Math.pow((imageMinX - imageCurrentX + 1), 0.8);
            }
            if (imageCurrentX > imageMaxX) {
                imageCurrentX = imageMaxX - 1 + Math.pow((imageCurrentX - imageMaxX + 1), 0.8);
            }

            if (imageCurrentY < imageMinY) {
                imageCurrentY = imageMinY + 1 - Math.pow((imageMinY - imageCurrentY + 1), 0.8);
            }
            if (imageCurrentY > imageMaxY) {
                imageCurrentY = imageMaxY - 1 + Math.pow((imageCurrentY - imageMaxY + 1), 0.8);
            }

            //Velocity
            if (!velocityPrevPositionX) velocityPrevPositionX = imageTouchesCurrent.x;
            if (!velocityPrevPositionY) velocityPrevPositionY = imageTouchesCurrent.y;
            if (!velocityPrevTime) velocityPrevTime = $.now();
            velocityX = (imageTouchesCurrent.x - velocityPrevPositionX) / ($.now() - velocityPrevTime) / 2;
            velocityY = (imageTouchesCurrent.y - velocityPrevPositionY) / ($.now() - velocityPrevTime) / 2;
            if (Math.abs(imageTouchesCurrent.x - velocityPrevPositionX) < 2) velocityX = 0;
            if (Math.abs(imageTouchesCurrent.y - velocityPrevPositionY) < 2) velocityY = 0;
            velocityPrevPositionX = imageTouchesCurrent.x;
            velocityPrevPositionY = imageTouchesCurrent.y;
            velocityPrevTime = $.now();

            zoom.scrollerTransform(imageCurrentX, imageCurrentY);
        };
        zoom.onTouchEnd = function(e) {
            if (!e.touches.length) {
                isGesturing = false;
            }
            if (!imageIsTouched || !imageIsMoved) {
                imageIsTouched = false;
                imageIsMoved = false;
                return;
            }
            imageIsTouched = false;
            imageIsMoved = false;
            var momentumDurationX = 300;
            var momentumDurationY = 300;
            var momentumDistanceX = velocityX * momentumDurationX;
            var newPositionX = imageCurrentX + momentumDistanceX;
            var momentumDistanceY = velocityY * momentumDurationY;
            var newPositionY = imageCurrentY + momentumDistanceY;

            if (velocityX !== 0) momentumDurationX = Math.abs((newPositionX - imageCurrentX) / velocityX);
            if (velocityY !== 0) momentumDurationY = Math.abs((newPositionY - imageCurrentY) / velocityY);
            var momentumDuration = Math.max(momentumDurationX, momentumDurationY);

            imageCurrentX = newPositionX;
            imageCurrentY = newPositionY;

            var scaledWidth = imageWidth * scale;
            var scaledHeight = imageHeight * scale;
            imageMinX = Math.min((wrapperWidth / 2 - scaledWidth / 2), 0);
            imageMaxX = -imageMinX;
            imageMinY = Math.min((wrapperHeight / 2 - scaledHeight / 2), 0);
            imageMaxY = -imageMinY;
            imageCurrentX = Math.max(Math.min(imageCurrentX, imageMaxX), imageMinX);
            imageCurrentY = Math.max(Math.min(imageCurrentY, imageMaxY), imageMinY);

            zoom.scrollerTransition(momentumDuration).scrollerTransform(imageCurrentX, imageCurrentY);
        };
        zoom.destory = function() {
            zoom.initEvents(true); //detach
            delete $.data[zoom.wrapper.getAttribute('data-zoomer')];
            zoom.wrapper.setAttribute('data-zoomer', '');
        }
        zoom.init();
        return zoom;
    };
    $.Zoom.defaults = {
        speed: 300,
        maxZoom: 3,
        minZoom: 1,
    };
    $.fn.zoom = function(options) {
        var zoomApis = [];
        this.each(function() {
            var zoomApi = null;
            var self = this;
            var id = self.getAttribute('data-zoomer');
            if (!id) {
                id = ++$.uuid;
                $.data[id] = zoomApi = new $.Zoom(self, options);
                self.setAttribute('data-zoomer', id);
            } else {
                zoomApi = $.data[id];
            }
            zoomApis.push(zoomApi);
        });
        return zoomApis.length === 1 ? zoomApis[0] : zoomApis;
    };
})(mui, window);