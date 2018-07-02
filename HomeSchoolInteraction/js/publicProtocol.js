//本页面存放界面中需要的协议，接口作用、需要传值内容、调用的方法

//本地存储
document.write('<script src="../../js/storageKeyName.js"><\/script>');
//加密
document.write('<script src="../../js/libs/RSA/Barrett.js"><\/script>');
document.write('<script src="../../js/libs/RSA/BigInt.js"><\/script>');
document.write('<script src="../../js/libs/RSA/RSA.js"><\/script>');
document.write('<script src="../../js/utils/RSAEncrypt.js"><\/script>');
//网络请求
document.write('<script src="../../js/utils/postData.js"><\/script>');
//签名
document.write('<script src="../../js/libs/crypto-js/require.js"><\/script>');
//document.write('<script src="../../js/utils/sortSign.js"><\/script>');
document.write('<script src="../../js/utils/signHmacSHA1.js"><\/script>');
document.write('<script src="../../js/libs/jquery.js"><\/script>');
//替换字符串中的全部换行符
var replaceAllBL = function(str) {
	var string =  str.replace(/ /g,"&nbsp;")
	return string.replace(new RegExp(/(\n)/g), '<br />');
}
//给数组去重
var arrayDupRemoval = function(array) {
	var res = [];
	var json = {};
	for(var i = 0; i < array.length; i++) {
		if(!json[array[i]]) {
			res.push(array[i]);
			json[array[i]] = 1;
		}
	}
	return res;
}

//给头像添加默认值，或者添加？+数字,
//string为传过来的头像url，flag表示当前调用界面对于默认头像的层级关系
var updateHeadImg = function(string, flag) {
	var tempStr = '';
	//判断img是否为null，或者空
	if(string == '' || string == null || string == 'null') { //赋值
		if(flag == 1) {
			tempStr = '../image/utils/default_personalimage.png';
		} else if(flag == 2) {
			tempStr = '../../image/utils/default_personalimage.png';
		} else if(flag == 3) {
			tempStr = '../../../image/utils/default_personalimage.png';
		} else if(flag == 0) {
			tempStr = 'image/utils/default_personalimage.png';
		}
	} else { //修改值
		//		var myDate = new Date();
		//		tempStr = string + '?' + myDate.getTime();
		tempStr = string;
	}
	return tempStr;
}

//修改数组，改变格式
var arrayToStr = function(array) {
	if (array == null) {
		return '[]'
	}
	var tempStr = '';
	tempStr = array.join(',');
	tempStr = '[' + tempStr + ']';
	return tempStr;
}

//将时间转换为显示的格式
var modifyTimeFormat = function(str) {
	var tempStr = '';
	var dt_now = new Date();
	var int_year = dt_now.getYear();
	var dt_item = new Date(str.replace(/-/g, '/'));
	if(int_year == dt_item.getYear()) {
		tempStr = events.format(dt_item, "MM-dd hh:mm")
	} else {
		tempStr = events.format(dt_item, "yyyy-MM-dd hh:mm")
	}
	return tempStr;
}

//10.Token续订(之前有过相同登陆数据的才能续订成功)
//修改本地存储中的值，返回值
//store.get(window.storageKeyName.PERSONALINFO).token = data.RspData;
var renewToken = function(tempFlag, url, encryData, commonData, flag, waitingDialog, callback) {
	var personalUTID = store.get(window.storageKeyName.PERSONALINFO);
	var publicParameter = store.get(window.storageKeyName.PUBLICPARAMETER);
	//需要加密的数据
	var enData = {};
	var comData = {
		uuid: publicParameter.uuid,
		utid: personalUTID.utid,
		token: personalUTID.utoken,
		appid: publicParameter.appid
	};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostTokenRenew(comData, wd, function(data) {
		wd.close();
		if(data.RspCode == 0) {
			personalUTID.utoken = data.RspData;
			if (tempFlag == 1) {
				postDataEncryMMM(url, encryData, commonData, flag, waitingDialog, callback);
			}
		} else {
			mui.toast(data.RspTxt);
		}
	});
}

//6.用户修改各项用户信息
//调用方法
//var comData = {
//	vtp: 'unick', //uimg(头像),utxt(签名),unick(昵)称,usex(性别),uemail(邮件),uphone(手机绑定)uphoneq(手机解绑),uemailq(邮件解绑),uname(账号,只能修改一次,且只能字母开头,字母与数字,定了就不能修改),uarea(区域,值(省代码 市代码 区代码|省名称 市名称 区名称))
//	vvl: '测试修改昵称'//对应的值
//}; 
//// 等待的对话框
//var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
//var postDataPro_jiaobaoYunPro_PostReUinf(comData, wd, function(data) {
//	wd.close();
//	//console.log('90909090success:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
//	if(data.RspCode == 0) {
//
//	} else {
//		mui.toast(data.RspTxt);
//	}
//});

var postDataPro_PostReUinf = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostReUinf', enData, commonData, 1, wd, callback);
}

//7.用户创建群
//	//需要参数
//	var comData = {
//		gname: '测试群名',//群名
//		gnote: '测试群说明',//群说明
//		gimg: 'jjjjjjj',//群头像
//	};
var postDataPro_PostCrGrp = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostCrGrp', enData, commonData, 1, wd, callback);
}

//8.用户修改群各项信息
//	//需要参数
//	var comData = {
//		vtp: 'gname',//指更改用户信息的相应项,对应后面的vvl值,gimg(头像),gname(群名)
//		vvl: '测试修改群名',//要修改成的值
//		vtp: '测试修改群名',//更改项，指更改用户信息的相应项,对应后面的vvl值,gimg(头像),gname(群名),gnote(群说明)
//		rid: '3'//要修改的群id
//	};
var postDataPro_PostReGinfo = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostReGinfo', enData, commonData, 1, wd, callback);
}

//9.获取用户群
//获取个人信息
//	var personalUTID = store.get(window.storageKeyName.PERSONALINFO).utid;
//	//需要参数
//	var comData = {
//		vtp: 'cg', //要获取的项:cg(创建的群),ug(参与群),mg(协管的群),ag(所有的群),ig(群信息vvl对应群ID)
//		vvl: personalUTID//查询的各项，对应人的utid，可以是查询的任何人
//	};
//返回值model：model_groupList
var postDataPro_PostGList = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostGList', enData, commonData, 1, wd, callback);
}

//10.Token续订(之前有过相同登陆数据的才能续订成功)
//获取个人信息
//		var personalUTID = store.get(window.storageKeyName.PERSONALINFO).utid;
//		//需要参数
//		var comData = {
//			uuid: plus.device.uuid,
//			utid: personalUTID,
//			token:token,
//			appid: plus.runtime.appid
//		};
//修改本地存储中的值，返回值
//store.get(window.storageKeyName.PERSONALINFO).token = data.RspData;
var postDataPro_PostTokenRenew = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostTokenRenew', enData, commonData, 0, wd, callback);
}

//11.通过用户账号和手机号搜索用户
//		//需要参数
//		var comData = {
//			vvl: '111111',//查询的值
//			vtp: '111111'//nm(用户名),mb(手机号),em(邮箱)
//		};
//返回值model：model_userInfo
var postDataPro_PostUList = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostUList', enData, commonData, 1, wd, callback);
}

//12.邀请用户入群
//		//需要参数
//		var comData = {
//			gid: '111111',//群ID
//			beinvutid:'',//被邀请人ID
//			beinvnick:'',//被邀请人昵称
//			mstype:'',//被邀请人类型,0家长,2老师,3学生
//			stat:'',//入群状态,0待审,1同意
//			lnkinfid:'',//关联资料ID,无资料关联填写0
//			urel:'',//与资料关系,与资料关系,一般申请加入家长的时候填写,如爸爸,妈妈,其他类型留空
//			vtp:''//邀请类型,0老师邀请家长,1个人申请入群,2群员邀请群员
//		};
var postDataPro_PostInvGuser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostInvGuser', enData, commonData, 1, wd, callback);
}

//13.通过群ID获取群的正常用户
//		//需要参数
//		var comData = {
//			top: '',//选择条数
//			vvl:'',//群ID或IDS,查询的值,多个用逗号隔开
//			vvl1:''//群员类型，0家长,1管理员,2老师,3学生,-1取全部
//		};
//返回值model：model_groupNormalUser
var postDataPro_PostGusers = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostGusers', enData, commonData, 1, wd, callback);
}

//14.验证Token是否已过期
//获取个人信息
//		var personalToken = store.get(window.storageKeyName.PERSONALINFO).token;
//		//需要参数
//		var comData = {
//			token: personalToken
//		};
var postDataPro_PostVerifyToken = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostVerifyToken', enData, commonData, 0, wd, callback);
}

//15.用户添加资料
//		//所需参数
//		var comData = {
//			gid: '',//群ID
//			stuname:'',//资料名
//			stuimg:'',//资料头像
//			mstype:'',//资料类型，0家长,2老师,3学生
//			job:'',//职位，老师用,其他填0
//			title:'',//职称，老师用,其他填0
//			expsch:'',//教龄，老师用,其他填0
//			sub:'',//科目，老师用,其他填0
//			gutid:''//关联的群账号ID，用户在群里的账号ID,无则为0
//		};
var postDataPro_PostGAddUInf = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostGAddUInf', enData, commonData, 1, wd, callback);
}

//16.通过群ID获取群对象资料
//所需参数
//		var comData = {
//			vtp: '',//0普通资料获取(vvl1传要获取的身份),1邀请关联资料(主老师用,vvl1传邀请的身份)
//			top: '',//选择条数,-1为全部
//			vvl:'',//群ID,查询的值
//			vvl1:''//类型,0家长,1管理员,2老师,3学生,-1全部
//		};
//返回值model：model_groupStus
var postDataPro_PostGUInf = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostGUInf', enData, commonData, 1, wd, callback);
}

//17.通过审批者ID获取相应的入群邀请或申请
//所需参数
//		var comData = { 
//			vtp: ''//获取项，要获取的项:inv(入群邀请),app(入群申请)
//		};
//返回值model：model_groupRequestUser
var postDataPro_PostGrInv = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostGrInv', enData, commonData, 1, wd, callback);
}

//18.管理员审批用户入群
//所需参数
//		var comData = {
//			gutid: '',//申请记录ID，
//			stat:'',//入群状态，0拒绝,后面的字段填0即可,1通过
//			mstype:'',//审批用户类型，0家长,2老师,3学生
//			lnkinfid:'',//关联资料ID，无资料关联填写0
//			urel:''//与资料关系，与资料关系,一般申请加入家长的时候填写,如爸爸,妈妈,其他类型留空
//		};
var postDataPro_PostJoinDo = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostJoinDo', enData, commonData, 1, wd, callback);
}

//19.用户申请入群
//所需参数
//		var comData = {
//			gid: '',//群ID
//			beinvnick:'',//申请人昵称
//			mstype:'',//申请成为，0家长,2老师,3学生
//			urel:''//备注，与资料关系，与资料关系,一般申请加入家长的时候填写,如爸爸,妈妈,其他类型留空
//		};
var postDataPro_PostJoinGuser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostJoinGuser', enData, commonData, 1, wd, callback);
}

//20.用户审批申请
//所需参数
//		var comData = {
//			gutid: '',//申请ID
//			stat:''//状态,0拒绝,1同意
//		};
var postDataPro_PostInvDo = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostInvDo', enData, commonData, 1, wd, callback);
}

//21.通过用户ID或ID串获取用户资料
//所需参数
//		var comData = {
//			vvl:'',//用户id，查询的值,p传个人ID,g传ID串
//			vtp:''//查询类型,p(个人)g(id串)
//		};
//返回值model：model_userInfo
var postDataPro_PostUinf = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostUinf', enData, commonData, 1, wd, callback);
}

//22.通过用户资料ID获取用户各项资料
//所需参数
//		var comData = {
//			vvl:''//查询的用户资料ID
//		};
//返回值model：model_userDataInfo
var postDataPro_PostUuinf = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostUuinf', enData, commonData, 1, wd, callback);
}

//23.通过用户资料ID或关联ID更改各类型资料
//所需参数
//		var comData = {
//			vtp:'',//更新资料类型,stu:学生,tec:老师,gen:家长关系
//			stuid:'',//资料ID,更新学生老师必填,关系留0
//			stuname:'',//资料名称
//			stuimg:''//资料头像,学生必填,其他留0
//			job:'',//职位,老师必填,其他留空
//			title:'',//职称,老师必填,其他留空
//			expsch:'',//教龄,老师必填,其他留空
//			sub:'',//科目,老师必填,其他留空
//			ustuid:'',//关联ID,更新与家长关系必填,其他留空
//			urel:''//关系,更新与家长关系必填,其他留空
//		};
var postDataPro_PostReStu = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostReStu', enData, commonData, 1, wd, callback);
}

//24.通过用户表ID获取用户关联的学生
//所需参数
//		var comData = {
//			utid:''//用户表ID,用户utid
//		};
//返回值model：model_userDataInfo
var postDataPro_PostUstu = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostUstu', enData, commonData, 2, wd, callback);
}

//25.用户注销
//所需参数
//		var comData = {
//		};
var postDataPro_PostLoginOut = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostLoginOut', enData, commonData, 1, wd, callback);
}

//---------------------------------------云盘-----------------------------------------------------------------------------------------------------------

//26.用户云盘顶层文件及文件夹获取
//所需参数
//		var comData = {
//			vtp:'',//类型，0文件及文件夹混合,1文件夹,2文件
//			vvl:''//	节点ID，顶层为0
//		};
var postDataPro_PostDiFi = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostDiFi', enData, commonData, 1, wd, callback);
}

//27.用户云盘文件上传或创建文件夹
//所需参数
//		var comData = {
//			pid:'',//	父ID，该文件的上层ID
//			fname:'',//	文件名称，文件或文件夹名称,文件存扩展名之前的名称
//			ftype:'',//	文件类型，存文件的扩展名,如.file为文件夹
//			fpath:'',//	文件路径，文件路径,为文件用
//			fsize:''//	文件大小，文件用
//		};
var postDataPro_PostDiFiA = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostDiFiA', enData, commonData, 1, wd, callback);
}

//28.用户修改文件或文件夹名称
//所需参数
//		var comData = {
//			vvl:'',//文件ID
//			vvl1:''//文件名称
//		};
var postDataPro_PostDiFiE = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostDiFiE', enData, commonData, 1, wd, callback);
}

//29.用户修改个人群昵称
//所需参数
//		var comData = {
//			vvl:'',//成员在群ID，gutid
//			vvl1:''//群昵称
//		};
var postDataPro_PostGuNameE = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostGuNameE', enData, commonData, 1, wd, callback);
}

//30.通过资料ID获取关联的人员
//所需参数
//		var comData = {
//			vvl:'',//群成员群ID，Stuid或ID串
//			vtp:''//资料ID类型,Id:单个ID,ids:ID串
//		};
//返回值model：model_userDataInfo
var postDataPro_PostStuU = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostStuU', enData, commonData, 1, wd, callback);
}

//31.群成员退出群或者剔除群成员
//所需参数
//		var comData = {
//			vvl:'',//群成员群ID，gutid
//		};
var postDataPro_PostGuD = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostGuD', enData, commonData, 1, wd, callback);
}

//32.通过群ID,类型获取用户自身在群的信息
//所需参数
//		var comData = {
//			vvl:'',//群成员群ID，gutid
//			vtp:''//类型，0家长,1管理员,2老师,3学生,-1全部
//		};
//返回值model：model_postGuInfo
var postDataPro_PostGuI = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostGuI', enData, commonData, 1, wd, callback);
}

//33.根据资料表ID删除资料
//所需参数
//		var comData = {
//			vvl:'',//资料ID，stuid
//		};
var postDataPro_PostStuD = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostStuD', enData, commonData, 1, wd, callback);
}

//34.通过个人用户表ID获取我的入群申请
//所需参数
//		var comData = {
//		};
//返回值model：model_groupRequestUser
var postDataPro_PostMJoin = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostMJoin', enData, commonData, 1, wd, callback);
}

//35.个人获取对某人或一群人的备注
//所需参数
//		var comData = {
//			vvl:''//被备注用户ID,utid或utid串
//		};
//返回值
var postDataPro_PostUmk = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostUmk', enData, commonData, 1, wd, callback);
}

//36.用户修改或添加对个人备注
//所需参数
//		var comData = {
//			vvl:''//被备注人ID,butid
//			vvl1:''//备注昵称,
//		};
//返回值
var postDataPro_PostUmkA = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostUmkA', enData, commonData, 1, wd, callback);
}

//37.用户删除对个人备注
//所需参数
//		var comData = {
//			vvl:''//被备注人ID,butid
//		};
//返回值
var postDataPro_PostUmkD = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostUmkD', enData, commonData, 1, wd, callback);
}

//38.用户云盘文件及文件夹删除
//所需参数
//		var comData = {
//			vvl:''//节点ID，
//		};
//返回值model_PostDiFi
var postDataPro_PostDiFiD = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostDiFiD', enData, commonData, 1, wd, callback);
}

//39.通过审批者ID获取相应的入群邀请或申请数
//所需参数
//		var comData = {
//		};
//返回值model_PostDiFi
var postDataPro_PostGrInvC = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostGrInvC', enData, commonData, 1, wd, callback);
}

//40.通过用户ID获取用户各项资料
//所需参数
//		var comData = {
//			vvl:''//查询的用户群ID，gutid
//		};
//返回值：model_PostGusinf
var postDataPro_PostGusinf = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostGusinf', enData, commonData, 1, wd, callback);
}

//41.获取某个区域下的所有子区域或查询城市
//所需参数
//		var comData = {
//			vtp:'',//0(获取省份),1(获取城市),2(获取区县),3获取所有城市,4模糊查询城市
//			vvl:''//查询的值(acode节点编码,查询所有省份或城市留空,模糊查询城市填写查询值)
//		};
//返回值：model_area
var postDataPro_PostArea = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostArea', enData, commonData, 1, wd, callback);
}

//42.获取某个区域下的所有子区域
//所需参数
//		var comData = {
//			vvl:''//查询字符串,省名称 市名称 区名称(中间用空格隔开)
//		};
//返回值：省市区代码串,省代码 市代码 区代码
var postDataPro_PostAreaCode = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostAreaCode', enData, commonData, 1, wd, callback);
}

//43.用户修改或添加区域阅读设置
//所需参数
//		var comData = {
//			vvl:'',//定制城市组合，城市代码_城市名称|城市代码_城市名称|.....
//			vvl1:''//定制城市频道,0科教频道,1展示频道,其他待定
//		};
//返回值：
var postDataPro_PostUTcityA = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostUTcityA', enData, commonData, 1, wd, callback);
}

//44.获取个人的订制城市
//所需参数
//		var comData = {
//			vvl:''//订制频道,0科教频道,1展示频道,其他待定
//		};
//返回值：citys,订制的城市频道,城市代码_城市名称|城市代码_城市名称|.....
var postDataPro_PostUTcity = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostUTcity', enData, commonData, 1, wd, callback);
}

//45.通过区域代码获取对应区域的分页新闻
//所需参数
//		var comData = {
//			top:'',//每页行数，
//			vvl:'',//省份截取城市代码前两位,城市截取城市代码的前4位,查询新闻:区域代码|新闻ID
//			vvl1:''//页码,获取第几页
//		};
//返回值：
var postDataPro_PostTnews = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostTnews', enData, commonData, 1, wd, callback);
}

//46.科教频道新闻添加
//所需参数
//		var comData = {
//			title:'',//新闻标题,50
//			tnote:'',//新闻摘要,50
//			tips:'',//新闻要素组,50,时间(必须为时间格式)|来源(或作者或其他要素),’|’分隔
//			timgs:'',//三张新闻图片url组,500,url1|url2|url3
//			tarea:'',//新闻区域编码,50,由系统提供,在区域附件表中
//			turl:''//新闻原链接,200,新闻原来的url地址
//		};
//返回值：
var postDataPro_PostTnewsA = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostTnewsA', enData, commonData, 1, wd, callback);
}

//47.获取APP版本号
//所需参数
//		var comData = {
//			uuid:'',//用户设备号
//			appid:'',//应用ID
//			vvl:''//安卓：android,苹果：ios
//		};
//返回值：
var postDataPro_PostVerInfo = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostVerInfo', enData, commonData, 0, wd, callback);
}

//48.通过区域代码及相应参数获取对应分页新闻
//所需参数
//		var comData = {
//			top:'',//每页行数
//			vvl:'',//查询的区域代码,省份截取城市代码前两位,城市截取城市代码的前4位
//			vvl1:'',//页码,获取第几页
//			vvl2:'',//审核状态,审核状态,0未审,1已审,2拒绝,全部-1
//			vvl3:''//标题模拟查询,标题模拟字符,可留空字符
//		};
//返回值：
var postDataPro_PostTnewsC = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostTnewsC', enData, commonData, 1, wd, callback);
}

//49.审核科教频道新闻
//所需参数
//		var comData = {
//			vvl:'',//文章ID
//			vvl1:''//审核状态,审核状态,0未审,1已审,2拒绝,全部-1
//		};
//返回值：
var postDataPro_PostTnewsE = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostTnewsE', enData, commonData, 1, wd, callback);
}

//50.更改用户绑定
//所需参数
//		var comData = {
//			uuid:'',//用户设备号,用户设备号
//			appid:'',//应用ID,应用ID
//			token:''//用户令牌,	用户的令牌
//		};
//		var enData = {
//			utid	:'',//用户表ID,RSA加密	,用户utid
//			uid:'',//手机号,RSA加密,	要更改为手机号
//			code	:'',//验证码,RSA加密,	加密后的验证码
//		};
//返回值：
var postDataPro_PostBindMobile = function(commonData, enData, wd, callback) {
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostBindMobile', enData, commonData, 0, wd, callback);
}

//51.管理员修改用户权限
//所需参数
//		var comData = {
//			rid:'',//某用户ID，返回的用户信息表中的行ID
//			vtp:'',//更改项，upower(更改用户权限串),usys(更改用户是否为系统管理员)
//			vvl:''//项值，对应vtp的值
//		};
//返回值：
var postDataPro_PostReUpower = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostReUpower', enData, commonData, 1, wd, callback);
}

//52.通过手机号或登录名查找相应的分页记录
//所需参数
//		var comData = {
//			top:'',//每页行数
//			vvl:'',//查询的手机号或账户名，模糊查询的手机号或账户名,查全部赋予空值
//			vvl1:''//页码,获取第几页
//		};
//返回值：
var postDataPro_PostUListP = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostUListP', enData, commonData, 1, wd, callback);
}

//53.用户移动云盘文件
//所需参数
//		var comData = {
//			vvl:'',//文件ID
//			vvl1:'',//文件名称
//			vvl2:''//文件上级ID，文件上级ID
//		};
//返回值：
var postDataPro_PostDiFiM = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINURL + 'PostDiFiM', enData, commonData, 1, wd, callback);
}

//---------------------------------------家校圈-----------------------------------------------------------------------------------------------------------
//家校圈接口

//1.（点到记事）获取用户未读点到记事条数
//所需参数
//		var comData = {
//			userId: ''//用户ID
//		};
//var postDataPro_getNoReadNotesCntByUser=function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'note/getNoReadNotesCntByUser', enData, commonData, 2, wd, callback);
//}

//2.（点到记事）获取用户未读点到记事列表
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			pageIndex: '',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList,model_userNoteInfo
//var postDataPro_getNoReadNotesByUser=function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'note/getNoReadNotesByUser', enData, commonData, 2, wd, callback);
//}

//3.（点到记事）获取用户针对某学生未读点到记事条数
//所需参数
//		var comData = {
//			userId: '',//用户ID--utid
//			studentId:''//学生ID----stuid
//		};
var postDataPro_getNoReadNotesCntByUserForStudent = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'note/getNoReadNotesCntByUserForStudent', enData, commonData, 2, wd, callback);
}

//4.（点到记事）获取用户针对某学生的点到记事列表
//所需参数
//		var comData = {
//			userId: '',//用户ID----utid
//			studentId:'',//学生ID----stuid
//			classId:'',//班级ID----
//			pageIndex:'',//当前页数
//			pageSize:'',//每页记录数
//			publisherId:''//发布者ID,0代表全部
//		};
//返回model：model_homeSchoolList,model_userNoteInfo
var postDataPro_getNotesByUserForStudent = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'note/getNotesByUserForStudent', enData, commonData, 2, wd, callback);
}

//5.（点到记事）获取某学生点到记事条数
//所需参数
//		var comData = {
//			studentId: ''//学生ID
//		};
//var postDataPro_getNotesCntByStudent=function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'note/getNotesCntByStudent', enData, commonData, 2, wd, callback);
//}

//6.（点到记事）获取某学生点到记事列表
//所需参数
//		var comData = {
//			studentId:'',//学生ID
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList,model_userNoteInfo
//var postDataPro_getNotesByStudent=function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'note/getNotesByStudent', enData, commonData, 2, wd, callback);
//}

//7.（点到记事）获取某条点到记事信息
//所需参数
//		var comData = {
//			noteId: ''//点到记事ID
//		};
//返回model：model_homeSchoolList,model_userNoteInfo
//var postDataPro_getNoteById=function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'note/getNoteById', enData, commonData, 2, wd, callback);
//}

//8.（点到记事）新增某学生点到记事信息
//所需参数
//		var comData = {
//			studentId: '',//用户ID----stuid
//			classId:'',//班级ID----
//			msgContent: '',//记事内容
//			encType:'',//附件类型,1图片2音视频
//			encLen:'',//音视频时长
//			encAddr:'',//附件地址
//			encImg: '',//附件缩略图地址
//			teacherId: '',//发布教师ID
//			noteType: '',//点到记事类型1点到2记事3仅文字
//			checkType: '',//1 正常2 旷课3 迟到4 早退5 请假6 其他
//			studentName: '',//学生姓名
//			publisherName: '',//发布者姓名
//			parentIds: '',//家长列表
//			className: '',//班级名称
//			userIds: ''//推送用户ID,例如：[1,2,3]
//		};
//返回值：RspData，新增ID，非0为正确
var postDataPro_addNote = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'note/addNote', enData, commonData, 2, wd, callback);
}

//9.（点到记事）推送给多用户某点到记事
//所需参数
//		var comData = {
//			userIds: '',//用户ID数组，例如：[1,2,3]
//			noteId:''//点到记事ID
//		};
//1为正确
//var postDataPro_addNoteForMutiUsers = function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'note/addNoteForMutiUsers', enData, commonData, 2, wd, callback);
//}

//10.（点到记事）修改某用户针对某学生所有点到记事阅读状态为已读
//所需参数
//		var comData = {
//			userId: '',//用户ID----utid
//			classId:'',//班级ID----
//			studentId:''//学生ID----stuid
//		};
//1为正确
var postDataPro_setNoteReadByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'note/setNoteReadByUser', enData, commonData, 2, wd, callback);
}

//11.（点到记事）屏蔽某学生某点到记事信息
//所需参数
//		var comData = {
//			noteId: ''//点到记事ID
//		};
//1为正确
var postDataPro_setOffNoteById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'note/setOffNoteById', enData, commonData, 2, wd, callback);
}

//12.（点到记事）删除某点到记事
//所需参数
//		var comData = {
//			noteId: ''//点到记事ID
//		};
//1为正确
var postDataPro_delNoteById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'note/delNoteById', enData, commonData, 2, wd, callback);
}

//13.（班级空间）获取用户未读班级空间条数
//所需参数
//		var comData = {
//			userId: ''//用户ID
//		};
//var postDataPro_getNoReadClassSpacesCntByUser=function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'classSpace/getNoReadClassSpacesCntByUser', enData, commonData, 2, wd, callback);
//}

//14.（班级空间）获取用户未读班级空间列表
//所需参数
//		var comData = {
//			userId: ''//用户ID
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList，model_userNoteInfo
//var postDataPro_getNoReadClassSpacesByUser=function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'classSpace/getNoReadClassSpacesByUser', enData, commonData, 2, wd, callback);
//}

//15.（班级空间）获取用户未读某班级空间条数
//所需参数
//		var comData = {
//			userId: '',//用户ID----utid
//			classId:''//班级ID----cid
//		};
var postDataPro_getNoReadClassSpacesCntByUserForClass = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'classSpace/getNoReadClassSpacesCntByUserForClass', enData, commonData, 2, wd, callback);
}

//16.（班级空间）获取用户针对某班级的空间列表
//所需参数
//		var comData = {
//			userId: '',//用户ID----utid
//			classId:'',//班级ID----cid
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList，model_userNoteInfo
var postDataPro_getClassSpacesByUserForClass = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'classSpace/getClassSpacesByUserForClass', enData, commonData, 2, wd, callback);
}

//17.（班级空间）获取某班级空间条数
//所需参数
//		var comData = {
//			classId: ''//班级ID
//		};
//var postDataPro_getClassSpacesCntByClass=function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'classSpace/getClassSpacesCntByClass', enData, commonData, 2, wd, callback);
//}

//18.（班级空间）获取某班级空间列表
//所需参数
//		var comData = {
//			classId:'',//班级ID
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList，model_userNoteInfo
//var postDataPro_getClassSpacesByClass=function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'classSpace/getClassSpacesByClass', enData, commonData, 2, wd, callback);
//}

//19.（班级空间）获取某条班级空间信息
//所需参数
//		var comData = {
//			classSpaceId: ''//班级空间ID
//		};
//返回model：model_userNoteInfo
//var postDataPro_getClassSpaceById=function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'classSpace/getClassSpaceById', enData, commonData, 2, wd, callback);
//}

//20.（班级空间）新增某班级空间信息
//所需参数
//		var comData = {
//			classId: '',//班级ID
//			msgContent: '',//记事内容
//			encType: '',//附件类型,1图片2音视频3仅文字
//			encLen: '',//音视频时长
//			encAddr: '',//附件地址
//			encImg: '',//附件缩略图地址
//			teacherId: '',//发布教师ID
//			userIds: ''//推送用户ID,例如：[1,2,3]
//		};
//非0为正确
var postDataPro_addClassSpace = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'classSpace/addClassSpace', enData, commonData, 2, wd, callback);
}

//21.（班级空间）推送给多用户某班级空间
//所需参数
//		var comData = {
//			userIds: '',//用户ID数组，例如：[1,2,3]
//			classSpaceId:''//班级空间ID
//		};
//1为正确
//var postDataPro_addClassSpaceForMutiUsers = function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'classSpace/addClassSpaceForMutiUsers', enData, commonData, 2, wd, callback);
//}

//22.（班级空间）修改某用户针对某班级所有空间阅读状态为已读
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			classId:''//班级ID
//		};
//1为正确
var postDataPro_setClassSpaceReadByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'classSpace/setClassSpaceReadByUser', enData, commonData, 2, wd, callback);
}

//23.（班级空间）屏蔽某班级空间信息
//所需参数
//		var comData = {
//			classSpaceId: ''//班级空间ID
//		};
//1为正确
var postDataPro_setOffClassSpaceById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'classSpace/setOffClassSpaceById', enData, commonData, 2, wd, callback);
}

//24.（班级空间）删除某班级空间
//所需参数
//		var comData = {
//			classSpaceId: ''//班级空间ID
//		};
//1为正确
var postDataPro_delClassSpaceById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'classSpace/delClassSpaceById', enData, commonData, 2, wd, callback);
}

//25.（用户空间）获取用户未读用户空间条数
//所需参数
//		var comData = {
//			userId: ''//用户ID
//		};
//var postDataPro_getNoReadUserSpacesCntByUser=function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getNoReadUserSpacesCntByUser', enData, commonData, 2, wd, callback);
//}

//26.（用户空间）获取用户未读用户空间列表
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList,model_userNoteInfo
//var postDataPro_getNoReadUserSpacesByUser=function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getNoReadUserSpacesByUser', enData, commonData, 2, wd, callback);
//}

//27.（用户空间）获取用户未读某用户空间条数
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			publisherId:''//发布用户ID
//		};
//var postDataPro_getNoReadUserSpacesCntByUserForPublisher=function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getNoReadUserSpacesCntByUserForPublisher', enData, commonData, 2, wd, callback);
//}

//28.（用户空间）获取用户针对某用户的空间列表
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			publisherId:'',//发布用户ID
//			noteType:'',//信息类型,1云笔记,2个人空间动态
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList,model_userNoteInfo
var postDataPro_getUserSpacesByUserForPublisher = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpacesByUserForPublisher', enData, commonData, 2, wd, callback);
}

//29.（用户空间）获取用户某条用户空间是否点赞
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			publisherId:''//发布用户ID
//		};
//data:非0为已点赞
var postDataPro_getIsLikeUserSpaceByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getIsLikeUserSpaceByUser', enData, commonData, 2, wd, callback);
}

//30.（用户空间）获取用户空间所有评论条数
//所需参数
//		var comData = {
//			userSpaceId: ''//用户空间ID
//		};
//var postDataPro_getUserSpaceCommentsCntById=function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpaceCommentsCntById', enData, commonData, 2, wd, callback);
//}

//31.（用户空间）获取用户空间所有评论
//所需参数
//		var comData = {
//			userSpaceId: ''//用户空间ID
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList,model_userSpaceInfo
//var postDataPro_getUserSpaceCommentsById=function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpaceCommentsById', enData, commonData, 2, wd, callback);
//}

//32.（用户空间）获取用户空间所有点赞用户
//所需参数
//		var comData = {
//			userSpaceId: ''//用户空间ID
//		};
//返回值：数组、[UserId:用户ID，LikeDate	:点赞时间]
var postDataPro_getUserIsLikeUsersById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getIsLikeUsersById', enData, commonData, 2, wd, callback);
}

//33.屏蔽（用户空间）获取用户用户空间所有未读评论回复条数
//所需参数
//		var comData = {
//			userId: ''//用户ID
//		};
var postDataPro_getUserSpaceCommentReplysCntByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpaceCommentReplysCntByUser', enData, commonData, 2, wd, callback);
}

//34.屏蔽（用户空间）获取用户用户空间所有未读评论回复列表
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList，model_userSpaceInfo
var postDataPro_getUserSpaceCommentReplysByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpaceCommentReplysByUser', enData, commonData, 2, wd, callback);
}

//35.（用户空间）获取某用户空间条数
//所需参数
//		var comData = {
//			userId: ''//用户ID
//		};
//var postDataPro_getUserSpacesCntByUser=function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpacesCntByUser', enData, commonData, 2, wd, callback);
//}

//36.（用户空间）获取多用户空间列表
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			publisherIds:''//发布者ID，例如[1,2,3]
//		};
//返回model：model_homeSchoolList，model_userNoteInfo
var postDataPro_getUserSpacesByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpacesByUser', enData, commonData, 2, wd, callback);
}

//37.（用户空间）获取某条用户空间信息
//所需参数
//		var comData = {
//			userSpaceId: ''//用户空间ID
//		};
//返回model：model_homeSchoolList，model_userNoteInfo
//var postDataPro_getUserSpaceByIdr=function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpaceById', enData, commonData, 2, wd, callback);
//}

//38.（用户空间）新增某用户空间信息 （云笔记）
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			msgTitle: '',//记事标题
//			msgContent:'',//记事内容
//			encType:'',//附件类型，1图片2音视频3仅文字
//			encLen: '',//音视频时长
//			encAddr:'',//附件地址
//			encImg:'',//附件缩略图地址
//			encIntro:'',//附件简介
//			noteType:'',//信息类型,1云笔记2个人空间
//			userIds: '',//推送用户ID,例如：[1,2,3]
//			pubScopes:'',//发布范围,Array,1 家校圈 必选,2 展现 可选,例如[1,2]
//			pubArea: ''//发布区域,具体到市级代码
//		};
//非0为正确
var postDataPro_addUserSpace = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/addUserSpace', enData, commonData, 2, wd, callback);
}

//39.（用户空间）推送给多用户某用户空间
//所需参数
//		var comData = {
//			userIds: '',//用户ID数组，例如][1,2,3]
//			userSpaceId:'',//用户空间ID
//		};
//1为正确
//var postDataPro_addUserSpaceForMutiUsers = function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/addUserSpaceForMutiUsers', enData, commonData, 2, wd, callback);
//}

//40.（用户空间）新增某用户某用户空间评论
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			userSpaceId:'',//用户空间ID
//			commentContent:''//评论内容
//		};
//1为正确
var postDataPro_addUserSpaceComment = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/addUserSpaceComment', enData, commonData, 2, wd, callback);
}

//41.（用户空间）新增某用户某用户空间评论回复
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			upperId:'',//上级评论ID
//			replyUserId:'',//回复ID
//			userSpaceId:'',//用户空间ID
//			commentContent:''//回复内容
//		};
//1为正确
var postDataPro_addUserSpaceCommentReply = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/addUserSpaceCommentReply', enData, commonData, 2, wd, callback);
}

//42.（用户空间）修改某用户针对某发布用户的空间阅读状态为已读
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			publisherIds:''//发布用户ID,Array,例如[1,2,3]
//		};
//1为正确
var postDataPro_setUserSpaceReadByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/setUserSpaceReadByUser', enData, commonData, 2, wd, callback);
}

//43.（用户空间）修改某用户某用户空间点赞状态为点赞
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			userSpaceId:''//用户空间ID
//		};
//1为正确
var postDataPro_setUserSpaceLikeByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/setUserSpaceLikeByUser', enData, commonData, 2, wd, callback);
}

//44.（用户空间）修改某用户空间评论回复查看状态
//所需参数
//		var comData = {
//			userSpaceCommentId: ''//用户空间评论ID
//		};
//var postDataPro_setUserSpaceCommentReplyById=function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/setUserSpaceCommentReplyById', enData, commonData, 2, wd, callback);
//}

//45.（用户空间）屏蔽某用户空间信息
//所需参数
//		var comData = {
//			userSpaceId: ''//用户空间ID
//		};
//1为正确
var postDataPro_setOffUserSpaceById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/setOffUserSpaceById', enData, commonData, 2, wd, callback);
}

//46.（用户空间）删除某用户空间
//所需参数
//		var comData = {
//			userSpaceId: ''//用户空间ID
//		};
//1为正确
var postDataPro_delUserSpaceById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/delUserSpaceById', enData, commonData, 2, wd, callback);
}

//47.（用户空间）删除某条用户空间评论
//所需参数
//		var comData = {
//			userSpaceCommentId: ''//用户空间评论ID
//		};
//1为正确
var postDataPro_delUserSpaceCommentById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/delUserSpaceCommentById', enData, commonData, 2, wd, callback);
}

//48.（用户空间）获取用户空间所有留言条数
//所需参数
//		var comData = {
//			userSpaceId: ''//用户空间ID
//		};
//var postDataPro_getUserSpaceMsgsCntById=function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpaceMsgsCntById', enData, commonData, 2, wd, callback);
//}

//49.（用户空间）获取用户空间所有留言
//所需参数
//		var comData = {
//			userId: '',//用户空间ID，留言板所有者
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList，model_userSpaceInfo
var postDataPro_getUserSpaceMsgsById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpaceMsgsById', enData, commonData, 2, wd, callback);
}

//50.（用户空间）获取用户用户空间所有未读留言回复条数
//所需参数
//		var comData = {
//			userId: ''//用户ID
//		};
//返回：未读回复条数
//var postDataPro_getUserSpaceMsgReplysCntByUser=function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpaceMsgReplysCntByUser', enData, commonData, 2, wd, callback);
//}

//51.屏蔽（用户空间）获取用户用户空间所有未读留言回复列表
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList，model_userSpaceInfo
var postDataPro_getUserSpaceMsgReplysByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpaceMsgReplysByUser', enData, commonData, 2, wd, callback);
}

//52.（用户空间）新增某用户某用户空间留言
//所需参数
//		var comData = {
//			userId: '',//留言用户ID
//			userOwnerId:'',//用户ID，留言板所有者
//			msgContent:''//留言内容
//		};
//1为正确
var postDataPro_addUserSpaceMsg = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/addUserSpaceMsg', enData, commonData, 2, wd, callback);
}

//53.（用户空间）新增某用户某用户空间留言回复
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			upperId:'',//上级留言ID
//			replyUserId:'',//回复ID
//			userSpaceId:'',//用户空间ID
//			msgContent:''//回复内容
//		};
//1为正确
var postDataPro_addUserSpaceMsgReply = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/addUserSpaceMsgReply', enData, commonData, 2, wd, callback);
}

//54.（用户空间）修改某用户空间留言回复查看状态
//所需参数
//		var comData = {
//			userSpaceMsgId: ''//用户空间留言ID
//		};
//var postDataPro_setUserSpaceMsgReplyById=function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/setUserSpaceMsgReplyById', enData, commonData, 2, wd, callback);
//}

//55.（用户空间）删除某条用户空间留言
//所需参数
//		var comData = {
//			userMsgId: ''//用户空间留言ID
//		};
//1为正确
var postDataPro_delUserMsgById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/delUserMsgById', enData, commonData, 2, wd, callback);
}

//56.（用户空间）获取与我相关
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回model：model_homeSchoolList，model_userSpaceAboutMe
var postDataPro_getAboutMe = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getAboutMe', enData, commonData, 2, wd, callback);
}

//57.（班级空间）获取用户某条班级空间是否点赞
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			classSpaceId:''//班级空间ID
//		};
//返回非0为已点赞
var postDataPro_getIsLikeClassSpaceByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'classSpace/getIsLikeClassSpaceByUser', enData, commonData, 2, wd, callback);
}

//58.（班级空间）修改某用户某班级空间点赞状态为点赞
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			classSpaceId:''//班级空间ID
//		};
//返回1为正确
var postDataPro_setClassSpaceLikeByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'classSpace/setClassSpaceLikeByUser', enData, commonData, 2, wd, callback);
}

//59.（用户空间）修改某用户评论、回复、留言状态为已读
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			spaceTypes:''//信息类型,4评论5评论回复6点赞7留言8留言回复另：打开与我相关时调用[4,5,6,7,8]设为已读。打开本人空间时，请调用[4、5、6]设为已读，打开本人留言板时，请调用[7、8]设为已读。
//		};
//返回1为正确
var postDataPro_setCommentMsgReadByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/setCommentMsgReadByUser', enData, commonData, 2, wd, callback);
}

//60.（用户空间）修改留言板备注
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			note:''//备注，即主人寄语
//		};
//返回1为正确
var postDataPro_setMsgNoteByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/setMsgNoteByUser', enData, commonData, 2, wd, callback);
}

//61.（用户空间）新增留言板
//所需参数
//		var comData = {
//			userId: ''//用户ID，用户注册时调用
//		};
//返回1为正确
var postDataPro_addNewUserMsgInfo = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/addNewUserMsgInfo', enData, commonData, 2, wd, callback);
}

//62.（用户空间）新增用户空间
//所需参数
//		var comData = {
//			userId: ''//用户ID，用户注册时调用
//		};
//返回1为正确
var postDataPro_setCommentMsgReadByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/setCommentMsgReadByUser', enData, commonData, 2, wd, callback);
}

//63.（点到记事）新增学生点到记事空间
//所需参数
//		var comData = {
//			studentId: '',//学生ID，添加学生时调用
//			classId:''//班级ID，
//		};
//返回1为正确
var postDataPro_addNewNoteInfo = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'note/addNewNoteInfo', enData, commonData, 2, wd, callback);
}

//64.（班级空间）新增班级空间
//所需参数
//		var comData = {
//			classId: ''//班级ID，新建班级时调用
//		};
//返回1为正确
var postDataPro_addNewClassInfo = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'classSpace/addNewClassInfo', enData, commonData, 2, wd, callback);
}

//65.（用户空间）获取用户空间所有已读用户
//所需参数
//		var comData = {
//			classId: ''//班级ID，新建班级时调用
//		};
//返回Users，列表数据	Array[UserId	:用户ID,ReadDate:访问时间]
var postDataPro_getReadUserBySpaceId = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getReadUserBySpaceId', enData, commonData, 2, wd, callback);
}

//66.（点到记事）获取针对某班的点到记事列表
//所需参数
//		var comData = {
//			classId: '',//班级ID
//			pageIndex:'',//当前页数
//			pageSize:'',//每页记录数
//			publisherId:''//发布者ID,0代表全部
//		};
//返回:model_userNoteInfo
var postDataPro_getNotesForClass = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'note/getNotesForClass', enData, commonData, 2, wd, callback);
}

//67.（班级空间）获取班级空间所有已读用户
//所需参数
//		var comData = {
//			classSpaceId: ''//班级空间ID
//		};
//返回Users，列表数据	Array[UserId	:用户ID,ReadDate:访问时间]
var postDataPro_getReadUserBySpaceId = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'classSpace/getReadUserBySpaceId', enData, commonData, 2, wd, callback);
}

//68.（班级空间）获取班级空间所有点赞用户
//所需参数
//		var comData = {
//			classSpaceId: ''//班级空间ID
//		};
//返回Users，列表数据	Array[UserId:用户ID,LikeDate:点赞时间]
var postDataPro_getIsLikeUsersById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'classSpace/getIsLikeUsersById', enData, commonData, 2, wd, callback);
}

//69.（云档案）按家长获取学生档案
//所需参数
//		var comData = {
//			parentId: '',//家长ID
//			docId:'',//文件夹ID
//			docType:'',//文件夹类型,1 普通档案,2 档案文件夹
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回:model_getStudentFile
var postDataPro_getStudentFile = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'file/getStudentFile', enData, commonData, 2, wd, callback);
}

//70.（云档案）新增某学生档案
//所需参数
//		var comData = {
//			parentId	: '',//家长ID,
//			studentId: '',//	学生ID,
//			studentName: '',//学生姓名,
//			className: '',//	班级名称,
//			msgContent: '',//记事内容,
//			encType: '',//附件类型,1图片2音视频3仅文字
//			encLen: '',//音视频时长
//			encAddr: '',//附件地址,多个的情况例如：1.jpg|2.jpg
//			encImg: '',//附件缩略图地址,
//			publisherName: '',//	发布者姓名,
//			noteType: '',//点到记事类型,1点到2记事
//			checkType: '',//点到类型,1 正常2 旷课3 迟到4 早退5 其他
//			classId: ''//班级ID
//		};
//返回	非0为正确
var postDataPro_addStudentFile = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'file/addStudentFile', enData, commonData, 2, wd, callback);
}

//71.（班级空间）删除某用户某班级空间点赞
//所需参数
//		var comData = {
//			classSpaceId: '',//班级空间ID
//			userId:''//用户ID
//		};
//返回1为正确
var postDataPro_delClassSpaceLikeByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'classSpace/delClassSpaceLikeByUser', enData, commonData, 2, wd, callback);
}

//72.（用户空间）删除某用户某用户空间点赞
//所需参数
//		var comData = {
//			userSpaceId: '',//用户空间ID
//			userId:''//用户ID
//		};
//返回1为正确
var postDataPro_delUserSpaceLikeByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/delUserSpaceLikeByUser', enData, commonData, 2, wd, callback);
}

//73.（云档案）按家长获取学生档案姓名
//所需参数
//		var comData = {
//			parentId:''//家长ID
//		};
//返回学生姓名数组
//var postDataPro_getStudentName = function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'file/getStudentName', enData, commonData, 2, wd, callback);
//}

//74.(用户空间）获取多用户空间所有用户动态列表
//所需参数
//		var comData = {
//			userId: '',//用户ID,登录用户
//			publisherIds: '',//发布者ID,例如[1,2,3]
//			pageIndex: '',//当前页数
//			pageSize: ''//每页记录数
//		};
//返回:model_userNoteInfo,model_userComment
var postDataPro_getAllUserSpacesByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getAllUserSpacesByUser', enData, commonData, 2, wd, callback);
}

//75.（点到记事）删除某学生点到记事
//所需参数
//		var comData = {
//			studentId:'',//学生ID
//			classId:''//班级ID
//		};
//返回学生姓名数组
var postDataPro_delNoteByStudent = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'note/delNoteByStudent', enData, commonData, 2, wd, callback);
}

//76.（班级空间）获取用户针对多班级的空间列表
//所需参数
//		var comData = {
//			userId:'',//用户ID
//			classIds:''//班级ID，例如[1,2,3]
//		};
//返回：model_userNoteInfo
var postDataPro_getClassSpacesByUserForMutiClass = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'classSpace/getClassSpacesByUserForMutiClass', enData, commonData, 2, wd, callback);
}

//77.（点到记事）获取用户针对多学生的点到记事列表
//所需参数
//		var comData = {
//			userId:'',//用户ID
//			studentIds:'',//学生ID,Array
//			classId:''//班级ID,Array
//		};
//返回：model_userNoteInfo
var postDataPro_getNotesByUserForMutiStudent = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'note/getNotesByUserForMutiStudent', enData, commonData, 2, wd, callback);
}

//78.（用户空间）获取区域用户空间列表
//所需参数
//		var comData = {
//			userId:'',//用户ID
//			area:'',//区域，0 全部区域
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回：model_userNoteInfo
var postDataPro_getUserSpacesByArea = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpacesByArea', enData, commonData, 2, wd, callback);
}

//79.（用户空间）获取多班级多用户空间所有用户未读数
//所需参数
//		var comData = {
//			userId:'',//用户ID，登录用户
//			publisherIds:''//发布者ID，Array，例如[[1,2,3],[4,5,6]]
//		};
//返回：NoReadCnts：未读总数列表，Array，例如[1,2,3]
var postDataPro_getNoReadCntForClassByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getNoReadCntForClassByUser', enData, commonData, 2, wd, callback);
}

//80.（用户空间）设置某用户的关注
//所需参数
//		var comData = {
//			userId:'',//用户ID
//			focusId:'',//关注ID
//			status:''//关注状态，0 不关注，1 关注
//		};
//返回：1为正确
var postDataPro_setUserFocus = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/setUserFocus', enData, commonData, 2, wd, callback);
}

//80.（用户空间）获取用户所有关注的用户
//所需参数
var comData = {
	userId: '' //用户ID
};
//返回：Users，列表数据，Array[UserId:用户ID,FocusDate:关注时间]
var postDataPro_getFocusByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getFocusByUser', enData, commonData, 2, wd, callback);
}

//81.（用户空间）获取用户针对某条空间详情
//所需参数
//		var comData = {
//			userId:'',//用户ID
//			userSpaceId:'',//用户动态ID
//			pageIndex:'',//评论当前页数
//			pageSize:''//评论每页记录数
//		};
//返回：model_userNoteInfo
var postDataPro_getUserSpaceByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpaceByUser', enData, commonData, 2, wd, callback);
}

//83.（点到记事）获取某学生的点到情况统计
//所需参数
//		var comData = {
//			studentId:'',//学生ID
//			classId:'',//班级ID
//			beginDate:'',//起始日期,例如20170101
//			endDate:'',//终止日期,例如20170131
//			publisherId:''//发布者ID,0代表全部
//		};
//返回：[{CheckType:点到情况,CheckTypeStr:点到情况说明,CheckNum:此情况数量}]
//var postDataPro_getCheckStatisticForStudent = function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'note/getCheckStatisticForStudent', enData, commonData, 2, wd, callback);
//}

//84.（点到记事）获取某班级的点到情况统计
//所需参数
//		var comData = {
//			classId:'',//班级ID
//			beginDate:'',//起始日期,例如20170101
//			endDate:'',//终止日期,例如20170131
//			publisherId:''//发布者ID,0代表全部
//		};
//返回：
//var postDataPro_getCheckStatisticForClass = function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'note/getCheckStatisticForClass', enData, commonData, 2, wd, callback);
//}

//85.（云档案）按ID删除学生档案内容
//所需参数
//		var comData = {
//			ids:''//档案内容ID，Array，例如[1,2,3]
//		};
//返回：1为正确
var postDataPro_delStudentFileByIds = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'file/delStudentFileByIds', enData, commonData, 2, wd, callback);
}

//86.（云档案）修改档案名称
//所需参数
//		var comData = {
//			fileInfoId:'',//档案ID
//			fileInfoName:'',//档案新名称
//			fileInfoType:''//档案类型，1 普通档案，2 档案文件夹
//		};
//返回：1为正确
var postDataPro_setStudentFileInfoName = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'file/setStudentFileInfoName', enData, commonData, 2, wd, callback);
}

//87.（云档案）新增档案文件夹
//所需参数
//		var comData = {
//			parentId:'',//家长ID
//			docName:''//档案文件夹名称
//		};
//返回：1为正确
//var postDataPro_addStudentDocInfo = function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'file/addStudentDocInfo', enData, commonData, 2, wd, callback);
//}

//88.（云档案）合并档案到档案文件夹
//所需参数
//		var comData = {
//			fileInfoIds:'',//需添加档案ID，Array，例如[1,2,3]
//			docId:''//档案文件夹ID
//		};
//返回：1为正确
//var postDataPro_addStudentFileToDoc = function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'file/addStudentFileToDoc', enData, commonData, 2, wd, callback);
//}

//89.（云档案）拆离档案从档案文件夹
//所需参数
//		var comData = {
//			fileInfoIds:'',//剩余档案ID，Array，例如[1,2,3]
//			docId:''//档案文件夹ID
//		};
//返回：1为正确
//var postDataPro_delStudentFileFromDoc = function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'file/delStudentFileFromDoc', enData, commonData, 2, wd, callback);
//}

//90.（云档案）删除档案文件夹
//所需参数
//		var comData = {
//			docId:'',//档案文件夹ID
//			docType:''//档案类型,1 普通档案,2 档案文件夹
//		};
//返回：1为正确
var postDataPro_delStudentDoc = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'file/delStudentDoc', enData, commonData, 2, wd, callback);
}

//91.（云档案）按家长获取档案文件夹
//所需参数
//		var comData = {
//			parentId:''//家长ID
//		};
//返回：{DocId:文件夹ID,DocName:文件夹名称,DocType:文件夹类型(1 为普通档案,2 为档案文件夹)，StudentId:学生ID,StudentName	:学生姓名}
var postDataPro_getStudentDocByParent = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'file/getStudentDocByParent', enData, commonData, 2, wd, callback);
}

//92.（云档案）获取档案文件夹内档案
//所需参数
//		var comData = {
//			docId:''//档案文件夹Id
//		};
//返回：FileIds:档案ID,Array,例如[1,2,3]
//var postDataPro_getStudentFileFromDoc = function(commonData, wd, callback) {
//	//需要加密的数据
//	var enData = {};
//	//发送网络请求，data为网络返回值
//	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'file/getStudentFileFromDoc', enData, commonData, 2, wd, callback);
//}

//93.（点到记事）获取班级统计月份的点到记事统计
//所需参数
//		var comData = {
//			classId:'',//班级ID
//			studentIds:'',//学生ID,array,例如[1,2,3]
//			qryMonth:''//查询月份,例如201701
//		};
//返回：
var postDataPro_getMonthStatisticForMonth = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'note/getMonthStatisticForMonth', enData, commonData, 2, wd, callback);
}

//94.（点到记事）获取某学生的点到记事统计
//所需参数
//		var comData = {
//			studentId:'',//学生ID
//			classId:'',//班级ID
//			qryMonth:'',/查询月份,例如201701
//			checkType:'',//点到情况
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回：
var postDataPro_getNotesStatisticForStudent = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'note/getNotesStatisticForStudent', enData, commonData, 2, wd, callback);
}

//95.（用户空间）按ID获取区域用户空间列表
//所需参数
//		var comData = {
//			userId:'',//用户ID
//			publisherIds:'',//发布者ID,例如[1,2,3]
//			pageIndex:'',//当前页数
//			pageSize:''//每页记录数
//		};
//返回：
var postDataPro_getUserSpacesForAreaByIds = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncryMMM(storageKeyName.MAINJIAOXIAOURL + 'userSpace/getUserSpacesForAreaByIds', enData, commonData, 2, wd, callback);
}