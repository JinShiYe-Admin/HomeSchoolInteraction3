			//根据已订购套餐，得到学段、年级、科目
			var getCatalog = function(userbus) {
				try{
					var busext=[];
					for(var i = 0; i < userbus.length; i++) {
						var tempM = userbus[i];
						if(tempM.busext!=null && JSON.stringify(tempM).indexOf('jxht')!=-1 &&tempM.serstat == 1){//已订购并且没停用的套餐
							for(var z=0;z<tempM.busext.length;z++){//去掉订购ID（forid）、功能代码（ fcode） ，方便数组去重
								var item=tempM.busext[z];
								var newBusextItem={};
								newBusextItem.itemcode=item.itemcode;
								newBusextItem.itemsons=item.itemsons;
								var busextStr=JSON.stringify(busext);
								var newBusextItemStr=JSON.stringify(newBusextItem);
								if(busextStr.indexOf(newBusextItemStr)==-1){//对拥有相同年级、学段、科目的对象进行去重
									busext.push(newBusextItem);
								}
							}
						}
					} 
					//循环去重后的busext数组，继续对不同对象中，重复的年级、学段、科目进行去重
					//去重学段
					var prdList=[];
					for(var i = 0; i < busext.length; i++){
						var item=busext[i];//全部学段
						if(item.itemcode=='prd'){
							var sons=item.itemsons.split(',');
							for(var z = 0; z < sons.length; z++){
								var sonsItme=sons[z];//单个学段
								var obj={};
								obj.percode=sonsItme.split('|')[0];//单个学段ID
								obj.pername=sonsItme.split('|')[1];//单个学段名称
								var prdListStr=JSON.stringify(prdList);
								var objStr=JSON.stringify(obj);
								if(prdListStr.indexOf(objStr)==-1){
									prdList.push(obj);
								}
							}
						}
					}
					
					//去重年级
//					var grdList=[];
//					for(var i = 0; i < busext.length; i++){
//						var item=busext[i];//全部年级
//						if(item.itemcode=='grd'){
//							var grds=item.itemsons.split(',');
//							for(var z = 0; z < grds.length; z++){
//								var grdsItme=grds[z];//单个年级
//								var obj={};
//								obj.percode=grdsItme.split('|')[0].substring(0,1);//单个学段ID
//								obj.fasccode=grdsItme.split('|')[0];//单个年级ID
//								obj.fascname=grdsItme.split('|')[1];//单个年级名称
//								var grdListStr=JSON.stringify(grdList);
//								var objStr=JSON.stringify(obj);
//								if(grdListStr.indexOf(objStr)==-1){
//									grdList.push(obj);
//								}
//							}
//						}
//					}
					//去重科目
//					var subList=[];
//					for(var i = 0; i < busext.length; i++){
//						var item=busext[i];//全部年级
//						if(item.itemcode=='sub'){
//							var subs=item.itemsons.split(',');
//							for(var z = 0; z < subs.length; z++){
//								var subsItme=subs[z];//单个年级
//								var obj={};
//								obj.subcode=subsItme.split('|')[0];//单个年级ID
//								obj.subname=subsItme.split('|')[1];//单个年级名称
//								var subListStr=JSON.stringify(subList);
//								var objStr=JSON.stringify(obj);
//								if(subListStr.indexOf(objStr)==-1){
//									subList.push(obj);
//								}
//							}
//						}
//					}
					
					var catalogObj={};
					catalogObj.prdList=prdList.sort(compare("percode"));
					for(var i = 0; i < catalogObj.prdList.length; i++){
						if(i==0){
							catalogObj.prdList[i].ischeck=1;
						}else{
							catalogObj.prdList[i].ischeck=0;
						}
					}
					
//					for(var i = 0; i < catalogObj.grdList.length; i++){
//						if(i==0){
//							catalogObj.grdList[i].ischeck=1;
//						}else{
//							catalogObj.grdList[i].ischeck=0;
//						} 
//					}

//					for(var i = 0; i < catalogObj.subList.length; i++){
//						if(i==0){
//							catalogObj.subList[i].ischeck=1;
//						}else{
//							catalogObj.subList[i].ischeck=0;
//						}
//					}
					return catalogObj;
				}catch(e){
					console.error('对userbus字段进行学段去重时发生异常,'+e);
					console.error('====================')
					console.error(e.stack); 
					console.error('====================')
					return {};
				}
			}
			//按指定字段，对对象数组进行快速排序
			 function compare(property){
		         return function(obj1,obj2){
		             var value1 = obj1[property];
		             var value2 = obj2[property];
		             return value1 - value2;     // 升序
		         }
		    }