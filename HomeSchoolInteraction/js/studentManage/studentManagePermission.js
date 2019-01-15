var studentMP = (function(mod) {
	personal = store.get(window.storageKeyName.PERSONALINFO);
	console.log('personal:' + JSON.stringify(personal));
	publicParameter = store.get(window.storageKeyName.PUBLICPARAMETER);
	var grdsArray = []; //年级数组
	var sumFlag = 0; //需要主动添加全部
	//学生管理模块，获取年级、班级、学生等
	//gradeFalg，1查看(包含年级领导)，2添加、修改
	//teacherFlag，1班主任和任课老师都有，2有班主任，没有任课老师
	//tempSumFlag,1不需要主动添加“全部”
	mod.getStudentManagePermission = function(gradeFalg, teacherFlag, callback, tempSumFlag) {
		if(tempSumFlag == 1) {
			sumFlag = tempSumFlag;
		}
		var enData0 = {};
		//不需要加密的数据
		var comData0 = {
			uuid: publicParameter.uuid, //用户设备号
			utoken: personal.utoken, //用户令牌
			isfinish: 0, //是否已毕业,0未毕业,1已毕业,-1全部
			appid: publicParameter.appid //系统所分配的应用ID
		}
		//2.1 学校年级
		postDataEncry('SchGrade', enData0, comData0, 0, function(data) {
			console.log('2.1 学校年级:' + JSON.stringify(data));
			if(data.RspCode == 0) {
				if(data.RspData) {
					var tempFlag0 = 0;
					//如果是查看，需要判断是否是年级领导，将年级塞入数组
					if(gradeFalg == 1) {
						//判断个人信息的urolestr参数，第16位，学生管理授权用户
						var tempStr = personal.urolestr.substr(16, 1);
						if(tempStr == 1) {
							var tempflag = 0;
							for(var a = 0; a < data.RspData.grds.length; a++) {
								var tempModel1 = data.RspData.grds[a];
								tempModel1.classArray = [];
//								if(tempModel.isfinish == 0) {
									grdsArray.push(tempModel1);
									tempflag++;
//								}
							}
							console.log('年级领导:' + JSON.stringify(grdsArray));
							//2.3 学校年级下班级
							if(tempflag > 0) {
								getGradeClass(grdsArray, callback);
								tempFlag0++;
							}
						} else {
							if(personal.grds.length > 0) { //年级领导
								var tempflag = 0;
								for(var i = 0; i < personal.grds.length; i++) {
									var tempModel = personal.grds[i];
									if(tempModel.isfinish == 0) {
										for(var a = 0; a < data.RspData.grds.length; a++) {
											var tempModel1 = data.RspData.grds[a];
											tempModel1.classArray = [];
											if(tempModel.grdid == tempModel1.grdid) {
												grdsArray.push(tempModel1);
												tempflag++;
											}
										}
									}
								}
								console.log('年级领导:' + JSON.stringify(grdsArray));
								//2.3 学校年级下班级
								if(tempflag > 0) {
									getGradeClass(grdsArray, callback);
									tempFlag0++;
								}
							}
						}
					}
					//是任课老师或者班主任
					if(personal.clss.length > 0) {
						//个人信息中的班级列表
						var tempClass1 = [].concat(personal.clss);
						//去重
						tempClass1 = tempClass1.unique('grdid');
						personal.clss = personal.clss.unique('clsid');
						console.log('tempClass1:' + JSON.stringify(tempClass1));
						for(var a = 0; a < data.RspData.grds.length; a++) {
							var tempModel1 = data.RspData.grds[a];
							tempModel1.classArray = [];
							//循环所在班级，判断是否年级列表中，已存在此年级
							for(var m = 0; m < tempClass1.length; m++) {
								var tempModel = tempClass1[m];
								if(tempModel.grdid == tempModel1.grdid) {
									var tempFlag = 0;
									//循环已有的年级
									for(var i = 0; i < grdsArray.length; i++) {
										var tempModel0 = grdsArray[i];
										if(tempModel0.grdid == tempModel.grdid) {
											tempFlag++;
										}
									}
									if(tempFlag == 0) {
										for(var b = 0; b < personal.clss.length; b++) {
											var tempClass = personal.clss[b];
											tempClass.studentArray = [];
											if(tempClass.grdid == tempModel1.grdid) {
												//1班主任和任课老师都有，2有班主任，没有任课老师
												if(teacherFlag == 1) {
													tempModel1.classArray.push(tempClass);
												} else {
													if(tempClass.isms == 1) {
														tempModel1.classArray.push(tempClass);
													}
												}
											}
										}
										grdsArray.push(tempModel1);
									}
								}
							}
						}
					}
					grdsArray = grdsArray.sort(compare('grdcode'));
					console.log('合并clss后:' + JSON.stringify(grdsArray));
					if(tempFlag0 == 0) {
						getClassStu(callback);
					}
				} else {
					dataFormat(callback);
				}
			} else {
				mui.toast(data.RspTxt, "cancel");
			}
		});
	}

	var dataFormat = function(callback) {
		var sumArray = [];
		var tempGrdIDs = []; //全部年级的id
		var tempClsIDs = []; //全部班级的id
		//年级
		for(var i = 0; i < grdsArray.length; i++) {
			var tempModel0 = grdsArray[i];
			tempGrdIDs.push(tempModel0.grdid);
			var tempGrd = {
				value: tempModel0.grdid,
				text: tempModel0.grdname,
				children: []
			}
			var tempClsIDs1 = []; //当前年级的全部班级id
			//班级
			for(var a = 0; a < tempModel0.classArray.length; a++) {
				var tempModel1 = tempModel0.classArray[a];
				tempClsIDs.push(tempModel1.clsid);
				tempClsIDs1.push(tempModel1.clsid);
				var tempCls = {
					value: tempModel1.clsid,
					text: tempModel1.clsname,
					children: []
				}
				//学生
				for(var b = 0; b < tempModel1.studentArray.length; b++) {
					var tempModel2 = tempModel1.studentArray[b];
					var tempStu = {
						imgurl: tempModel2.imgurl,
						value: tempModel2.stuid,
						text: tempModel2.stuname
						//						img:tempModel2
					}
					tempCls.children.push(tempStu);
				}
				if(sumFlag == 0) {
					var tempClsModel = {
						value: 0,
						text: '全部学生'
					}
					tempCls.children = [tempClsModel].concat(tempCls.children);
				}
				tempGrd.children.push(tempCls);
			}
			if(sumFlag == 0) {
				if(tempClsIDs1.length > 0) {
					var tempGrdModel = {
						value: tempClsIDs1.join(','),
						text: '全部班级',
						children: [{
							value: 0,
							text: '全部学生'
						}]
					}
					tempGrd.children = [tempGrdModel].concat(tempGrd.children);
				}
			}
			if(tempClsIDs1.length > 0) {
				sumArray.push(tempGrd);
			}
		}
		if(sumFlag == 0) {
			var temp0 = tempGrdIDs.join(',');
			var temp1 = tempClsIDs.join(',');
			var tempSum = {
				value: temp0,
				text: '全部年级',
				children: [{
					value: temp1,
					text: '全部班级',
					children: [{
						value: 0,
						text: '全部学生'
					}]
				}]
			}
			sumArray = [tempSum].concat(sumArray);
		}
		callback(sumArray);
	}

	//给获取到的列表数据，添加年级名称、班级名称
	//GrdClsMsg,当前页面的年级、班级数组，上面接口获取到的数据
	//pageList，当前页面获取到的列表
	mod.setGrdNameClsName = function(GrdClsMsg, pageList, callback) {
		for(var i = 0; i < pageList.length; i++) {
			var tempDetail = pageList[i];
			for(var a = 0; a < GrdClsMsg.length; a++) {
				var tempGrdClsMsg = GrdClsMsg[a];
				if(tempDetail.gradeId == tempGrdClsMsg.value) {
					tempDetail.gradeName = tempGrdClsMsg.text;
					for(var b = 0; b < tempGrdClsMsg.children.length; b++) {
						var tempClass = tempGrdClsMsg.children[b];
						if(tempDetail.classId == tempClass.value) {
							tempDetail.className = tempClass.text;
							for(var c = 0; c < tempClass.children.length; c++) {
								var tempStu = tempClass.children[c];
								if(tempStu.value == tempDetail.studentId) {
									tempDetail.stuName = tempStu.text;
									if(tempStu.imgurl == null) {
										tempDetail.stuImg = '../../img/utils/noImgPerson.jpg';
									} else {
										if(check_is_img(tempStu.imgurl)) {
											tempDetail.stuImg = tempStu.imgurl;
										} else {
											tempDetail.stuImg = '../../img/utils/noImgPerson.jpg';
										}
									}
								}
							}
						}
					}
				}
			}
		}
		callback(pageList);
	}

	function check_is_img(url) {
		if(/.(png|jpg|jpeg|gif)$/g.test(url)) {
			return true;
		} else {
			return false;
		}
	}

	//2.3 学校年级下班级
	var getGradeClass = function(grdsArray, callback) {
		if(grdsArray.length > 0) {
			var tempGradeId = []; //需要查询的年级ID
			for(var i = 0; i < grdsArray.length; i++) {
				var tempModel = grdsArray[i];
				tempGradeId.push(tempModel.grdid);
			}
			var enData0 = {};
			//不需要加密的数据
			var comData0 = {
				uuid: publicParameter.uuid, //用户设备号
				utoken: personal.utoken, //用户令牌
				gradeids: tempGradeId.join(','), //需要查询的年级ID，多个代码用英文逗号隔开
				appid: publicParameter.appid //系统所分配的应用ID
			}
			//			events.showWaiting();
			//2.3 学校年级下班级
			postDataEncry('GradeClass', enData0, comData0, 0, function(data) {
				console.log('2.3 学校年级下班级:' + JSON.stringify(data));
				//				events.closeWaiting();
				if(data.RspCode == 0) {
					if(data.RspData) {
						//将获取到的班级，塞到对应的年级数组
						for(var i = 0; i < data.RspData.clss.length; i++) {
							var tempClss = data.RspData.clss[i];
							tempClss.studentArray = [];
							for(var a = 0; a < grdsArray.length; a++) {
								var tempModel = grdsArray[a];
								if(tempModel.grdid == tempClss.grdid) {
									tempModel.classArray.push(tempClss);
								}
							}
						}
						console.log('获取到班级后合并:' + JSON.stringify(grdsArray));
					}
					getClassStu(callback);
				} else {
					mui.toast(data.RspTxt, "cancel");
				}
			});
		} else {
			getClassStu(callback);
		}
	}

	//2.6 学校班级学生
	var getClassStu = function(callback) {
		var tempClassId = []; //需要查询的年级ID
		for(var i = 0; i < grdsArray.length; i++) {
			var tempModel = grdsArray[i];
			for(var a = 0; a < tempModel.classArray.length; a++) {
				var tempCls = tempModel.classArray[a];
				tempClassId.push(tempCls.clsid);
			}
		}
		if(tempClassId.length == 0) {
			dataFormat(callback);
		} else {
			var enData0 = {};
			//不需要加密的数据
			var comData0 = {
				uuid: publicParameter.uuid, //用户设备号
				utoken: personal.utoken, //用户令牌
				classids: tempClassId.join(','), //需要查询的班级ID，多个代码用英文逗号隔开
				appid: publicParameter.appid //系统所分配的应用ID
			}
			//		events.showWaiting();
			//2.6 学校班级学生
			postDataEncry('ClassStu', enData0, comData0, 0, function(data) {
				//			events.closeWaiting();
				console.log('2.6 学校班级学生:' + JSON.stringify(data));
				if(data.RspCode == 0) {
					if(data.RspData) {
						//将获取到的学生，塞到对应的班级数组
						for(var i = 0; i < data.RspData.clssstus.length; i++) {
							var tempStu = data.RspData.clssstus[i];
							for(var a = 0; a < grdsArray.length; a++) {
								var tempModel = grdsArray[a]; //年级
								for(var b = 0; b < tempModel.classArray.length; b++) {
									var tempCls = tempModel.classArray[b]; //班级
									if(tempCls.clsid == tempStu.clsid) {
										tempCls.studentArray.push(tempStu);
									}
								}
							}
						}
						console.log('获取到学生后合并:' + JSON.stringify(grdsArray));
						dataFormat(callback);
					}
				} else {
					mui.toast(data.RspTxt, "cancel");
				}
			});
		}
	}

	//根据flag获取id对应的年级、班级、学生 name   0获取年级名次  1获取班级名称  2获取学生名称
	//GrdClsMsg,当前页面的年级、班级数组，上面接口获取到的数据
	//pageList，当前页面获取到的列表
	mod.getName = function(flag, GrdClsMsg, list, callback) {
		switch(flag) {
			case '0':
				console.log("查询年级对应的名称")
				for(var i = 0; i < list.length; i++) {
					var tempDetail = list[i];
					for(var a = 0; a < GrdClsMsg.length; a++) {
						var tempGrdClsMsg = GrdClsMsg[a];
						if(tempDetail.id == tempGrdClsMsg.value) {
							tempDetail.name = tempGrdClsMsg.text;
						}
					}
				}
				break;
			case '1':
				console.log("查询班级对应的名称")
				for(var i = 0; i < list.length; i++) {
					var tempDetail = list[i];
					for(var a = 0; a < GrdClsMsg.length; a++) {
						var tempGrdClsMsg = GrdClsMsg[a];
						for(var b = 0; b < tempGrdClsMsg.children.length; b++) {
							var tempClass = tempGrdClsMsg.children[b];
							if(tempDetail.id == tempClass.value) {
								tempDetail.name = tempClass.text;
							}
						}
					}
				}
				break;
			case '2':
				console.log("查询学生对应的名称")
				for(var i = 0; i < list.length; i++) {
					var tempDetail = list[i];
					for(var a = 0; a < GrdClsMsg.length; a++) {
						var tempGrdClsMsg = GrdClsMsg[a];
						for(var b = 0; b < tempGrdClsMsg.children.length; b++) {
							var tempClass = tempGrdClsMsg.children[b];
							for(var c = 0; c < tempClass.children.length; c++) {
								var tempStu = tempClass.children[c];
								if(tempStu.id == tempDetail.value) {
									tempDetail.name = tempStu.text;
								}
							}
						}
					}
				}
				break;
		}
		callback(list);
	}

	//给数组去重
	Array.prototype.unique = function(key) {
		var arr = this;
		var n = [arr[0]];
		for(var i = 1; i < arr.length; i++) {
			if(key === undefined) {
				if(n.indexOf(arr[i]) == -1) n.push(arr[i]);
			} else {
				inner: {
					var has = false;
					for(var j = 0; j < n.length; j++) {
						if(arr[i][key] == n[j][key]) {
							has = true;
							break inner;
						}
					}
				}
				if(!has) {
					n.push(arr[i]);
				}
			}
		}
		return n;
	}
	//排序
	var compare = function(prop) {
		return function(obj1, obj2) {
			var val1 = obj1[prop];
			var val2 = obj2[prop];
			if(!isNaN(Number(val1)) && !isNaN(Number(val2))) {
				val1 = Number(val1);
				val2 = Number(val2);
			}
			if(val1 < val2) {
				return -1;
			} else if(val1 > val2) {
				return 1;
			} else {
				return 0;
			}
		}
	}
	return mod;
})(studentMP || {})