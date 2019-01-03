
if(window.plus){ 
    plusReady(); 
}else{ 
    document.addEventListener('plusready',plusReady,false); 
} 

//休眠方法
var ver;
function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}

function plusReady(){ 
	// 获取本地应用资源版本号
    plus.runtime.getProperty(plus.runtime.appid, function(inf) {
            ver = inf.version;
            var url= severUlr+'version/gainApkVersion'; //版本检测url
            var client;
            var ua = navigator.userAgent.toLowerCase();
            if(/iphone|ipad|ipod/.test(ua)) {    //苹果手机            
                $.ajax({
                    type:"get",
                    dataType:'json',
                    url:"https://itunes.apple.com/lookup?id=111030274",//获取当前上架APPStore版本信息
                    data:{            
                        id:111030274 //APP唯一标识ID
                    },
                    contentType:'application/x-www-form-urlencoded;charset=UTF-8',
                    success:function(data){
                        $.each(data, function(i,norms) {
                            $.each(norms, function(key,value) {
                                $.each(value, function(j, normItem) {
                                    if(j=="version"){
                                        if(normItem>ver){
                                        	mui.comfirm("发现新版本", "是否前往获取？", ['否', '是'], function(e){
                                        		if (e.index == 1) {
                                        			//上新APPStore下载地址
                                        			document.location.href='https://itunes.apple.com/cn/app/san-gu-hui/id111030274?mt=8'; 
                                        		}
                                        	});
                                        }
                                    }                            
                                });                
                            });
                        });        
                        return ;
                    }
                });    
            }else if(/android/.test(ua)) { 
                mui.ajax(url,{
                data:{
                    apkVersion: ver,
                },
                dataType:'json',
                type:'POST',
                timeout:10000,
                success:function(data){  
                    if(data.success){  
                        mui.toast("发现新版本:V"+data.data.apkVersion);//获取远程数据库中上新andriod版本号     
                        var apk_url = data.data.apkUrl; //新版本URL
                        var dtask = plus.downloader.createDownload(apk_url, {}, function(d, status) {
                            if (status == 200) {                                        
                                plus.nativeUI.toast("正在准备环境，请稍后！");
                                sleep(1000);
                                var path = d.filename;//下载apk
                                plus.runtime.install(path); // 自动安装apk文件
                            }else {
                                alert('版本更新失败:' + status);
                            }
                        });
                        dtask.start(); 
                    }else{
            			mui.toast('当前版本号已是最新');
                        return;
                    }
                },
                error: function(xhr, type, errerThrown) {
                    mui.toast('网络异常,请稍候再试');
                }
            });
        }
    });
}