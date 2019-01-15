var consts = (function(mod) {
	mod.MAINURL = 'https://jsypay.jiaobaowang.net/wxth/appschweb/schwebapi.aspx';
	mod.CONFIGURL = 'https://jsypay.jiaobaowang.net/wxth/jssdkapi.aspx';
	mod.UPLOADURL = 'https://jsypay.jiaobaowang.net/wxth/appschweb/FileUpLoad.ashx';
	mod.KEY_DEPARTS = 'key-departments';
	mod.KEY_CHOOSE_PERSONS = 'key-choosePersons';
	mod.KEY_CHOOSE_DEPARTS = 'key-chooseDeparts';
	mod.KEY_CHOSE_MAP = 'key-choseMap';
	mod.KEY_DEPART_POSITION = 'key-depart-position';
	mod.MESSAGE_STYLES = [{
		type: 'text',
		msgtype: 'text',
		typeNo: 0,
		typeName: '文字'
	}, {
		type: 'textcard',
		msgtype: 'textcard',
		typeNo: 1,
		typeName: '文本卡片'
	}, {
		type: 'news',
		msgtype: 'news',
		typeNo: 2,
		typeName: '图文'
	}, {
		type: 'image',
		msgtype: 'image',
		typeNo: 3,
		typeName: '图片'
	}, {
		type: 'voice',
		msgtype: "voice",
		typeNo: 4,
		typeName: '语音'
	}, {
		type: 'video',
		msgtype: "video",
		typeNo: 5,
		typeName: '视频'
	}, {
		type: 'file',
		msgtype: "file",
		typeNo: 6,
		typeName: '文件'
	}];
	return mod;
})(consts || {})