/** 
 * @struct ZJCommon
 * @description 定义全局公共ZJCommon对象
 * @author Zj.MD.Yang
 * @version 1.0
 * @Date 2019-06-15
 * @LICENSE Under the MIT License
 */
var ZJCommon={
	/**
	 * @property {array} jsArr js载入记录容器
	 * @description 对动态载入的js文件进行记录，不重复载入
	 */
	jsArr:[],	
	/**
	 * @property {array} CSSArr CSS载入记录容器
	 * @description 对动态载入的CSS文件进行记录，不重复载入
	 */
	CSSArr:[],	
	/**
	 * @property {String} url js运行的文档url相关信息
	 * @description js运行的文档url相关信息
	 */
	url:window.location,
	/**
	 * @property {Array} url_params js运行的文档url中?后的参数jSon化
	 * @description js运行的文档url相关信息，通过闭包方式将参数解析为JSON数据
	 * @alias window.location
	 */
	url_params:(function(){
		var r={};		
		var p=location.search.substr(1).split('&');		
		p.forEach(function(a){
			var t=a.split('=');	
				if(t.length==1) {
					r[t[0]]='';
					}
					else{
					r[t[0]]=t[1];
					}
			})
		return r;
	}()),
	/**
	 * @property {double}  random 
	 * @description 随机数
	 */
	random:(function(){
		setInterval(function(){ZJCommon.random=Math.random();},1);
	}()),
	
	/**
	 * @property {String} validate 验证类
	 * @description 验证类
	 */
	validate:{
		/**
		 * @property {JSON} data待验证的数据，JSON
		 * @description 待验证的数据，JSON格式，注意，验证时会根据key来寻找modul中对应key下的
		 *              模型来对data.key的值进行验证,所以待验证数据的可用key请参照module的key,
		 * 				特别注意，如果有重复的键时，只匹配最后一个（JSON的成员中相同键只存储最后一个）。
		 * @example
		 *   {email,'abc@asd.com',mobile:'123456789',tel:0752-2289793'}}
		 */
		data:{},
		/**
		 * @property {JSON} modul验证模型，JSON
		 * @description 验证模型，JSON格式，默认加载日期，时间，邮件地址，手机号等常用验证模型
		 */
		modul:{
			// YYYY-MM-DD格式
			date: /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/,
			// Time
			time:/^((20|21|22|23|[0-1]\d)\:[0-5][0-9])(\:[0-5][0-9])?$/,
			// YYYY-MM-DD hh:mm:ss格式
			dateTime:/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/,
			//英文字母
			letter:/^[a-zA-Z]+$/,
			// 整数
			int:/^[a-zA-Z]+$/,
			// 双精度数字,带小数
			double:/^[-\+]?\d+(\.\d+)?$/,
			// 名字规范
			name:/^[a-zA-Z][a-zA-Z0-9_/-]*$/,
			// 中文
			chinese:/^[\u0391-\uFFE5]+$/,
			// 邮编
			postcode:/^\d{6}$/,
			// email
			email:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
			// tel
			tel: /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/,
			// 手机号
			mobile : /^((\(\d{2,3}\))|(\d{3}\-))?(13|14|15|17|18)\d{9}$/,
			// url地址
			url : /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
			// 身份证
			IdCard : /^\d{15}(\d{2}[A-Za-z0-9])?$/,
			// QQ
			qq : /^[1-9]\d{4,12}$/			
		},
		/**
		 * @method validate 执行验证
		 * @description  执行验证
		 * @param {JSON}=data data 待验证的数据，不提供时直接使用validate.data数据
		 * @param {JSON}=modul modul 自定义的验证类
		 * @return {JSON}={result:{Boolean}=[true|false],err:{json}} 返回验证结果,
		 *          完全验证通过返回{result:true,err:{}},
		 *          验证不通过时返回{result:false,err:第一条未通过的数据}
		 */
		validate:function(data,modul){
		 data= data==undefined? this.data:data;
		modul= modul==undefined? this.modul:modul;
		try{
		for(var d in data){
			if(!this.modul[d].test(data[d].toString())){return {result:false,err:data[d]};}
			}
		}
		catch(e){			
			return {result:false,err:data[d],sysErr:e};
			}
		return {result:true,err:{}};
		}
		
	},
	
	/**
	 * @method init
	 * @description  初始化
	 * @return {null} null
	 */
	init:
	function(){	
	//注意，以下初始化运行的函数相互具有依懒性，如非必要，请勿调整运行顺序或者删除某项函数的运行
	this._autoload();//自动加载框架文件、相关控制器、数据模型js文件
	this._getFileName();//存入文件全名
	this._getFileSuffix();//存入文件后缀
	this._getFileNoSuffix();//存入文件名，不带后缀
	this._getFilePath();//存入文件路径
	},
	/**
	 * @method pushScript
	 * @description  载入JS文件
	 * @param {String} name  JS模块名称
	 * @param {JSURIString} jsPath  JS模块地址
	 * @param {Strimg} description = '' 描述 ,默认为空
	 * @param {Strimg}=['head'|'body'|'html'] continer  cherub位置的Dom标签 ,默认为body
	 * @return {boolean}=[treu|false] 返回载入结果，成功后在jsArr压入相关信息，不成功不压入
	 * @example 
	 *    ZJCommon.pushScript('jQuery','jquery2.1.js','加载jQuery框架')
	 */
	pushScript:function(name,jsPath,description,continer){
		var jsObj={
			'name':name,
			'path':jsPath,
			'desc':	description		
		}
		continer=continer||'body';
		var jsDomObj=document.createElement('script');
		jsDomObj.type='text/javascript';
		jsDomObj.src=jsPath+"?"+Math.random();
		if(this.jsArr.isInArrayByName(jsObj.name)) {return false;}			
		jsDomObj.addEventListener(continer,function(){
		ZJCommon.jsArr.push(jsObj); //载入完成后将js文档信息压如ZJCommon.jsArr树	.
		});	
				
		try{		
		document.getElementsByTagName("body")[0].appendChild(jsDomObj);
		return true;		
		}
		catch(e){
			return false;
		}		
	},
	
	/**
	 * @method pushCSS
	 * @description  载入CSS文件
	 * @param {String} name  CSS模块名称
	 * @param {CSSURIString} CSSPath  CSS模块地址
	 * @param {Strimg} description = '' 描述 ,默认为空
	 * @param {Strimg}=['head'|'body'|'html'] continer  cherub位置的Dom标签 ,默认为head
	 * @return {boolean}=[treu|false] 返回载入结果，成功后在CSSArr压入相关信息，不成功不压入
	 * @example 
	 *       ZJCommon.pushCSS('indexStyle','indexStyle.blue.css','加载；色模板CSS文件')
	 */
	pushCSS:function(name,CSSPath,description,continer){
		var CSSObj={
			'name':name,
			'path':CSSPath,
			'desc':	description		
		}
		continer=continer||'head';
		var CSSDomObj=document.createElement('link');
		CSSDomObj.type='text/css';
		CSSDomObj.rel='stylesheet';		
		CSSDomObj.href=CSSPath+"?"+Math.random();
		if(this.CSSArr.isInArrayByName(CSSObj.name)) {return false;}			
		CSSDomObj.addEventListener('load',function(){
		ZJCommon.CSSArr.push(CSSObj); //载入完成后将CSS文档信息压如ZJCommon.CSSArr树	.
		});					
		try{		
		document.getElementsByTagName(continer)[0].appendChild(CSSDomObj);
		return true;		
		}
		catch(e){
			return false;
		}
	
		
	},
	/**
	 * @method getParams
	 * @description  获得get参数
	 * @return {Array}  返回get参数的JSON数据
	 * ps：此功能已通过闭包载入到url_params
	 */
	//---以下废弃
	/*
	_getParams:function(){
		var r=this.url_params;
		
		var p=this.url.search.substr(1).split('&');		
		p.forEach(function(a){
			var t=a.split('=');	
			// var tr={};
			// 	if(t.length==1) {
			// 		tr[t[0]]='';
			// 		r.push(tr);
			// 		}
			// 	else{
			// 		tr[t[0]]=t[1];
			// 		 r.push(tr);									
			// 		}
				if(t.length==1) {
					r[t[0]]='';
					}
					else{
					r[t[0]]=t[1];
					}
			})
		//return r;
	},
	*/
	/**
	 * @method redirect
	 * @description  跳转到指定地址，并按需给出提示
	 * @param {string} url 跳转的url地址
	 * @param {string} msg 提示信息，默认无信息弹出
	 * @return {null}  返回get参数的JSON数据
	 */
	redirect:function(url,msg){
	 if(msg!=undefined) alert(msg);
	 ZJCommon.url.href=url;
	},
	/**
	 * @method assemblyUrl
	 * @description  根据相关参数拼装出前端mvc模式的URl地址
	 * @return {String}  返回url
	 */
	assemblyUrl:function(){
	
	},
	/**
	 * @method _autoload 自动加载html（视图）对应的控制js文件、js数据模型文件
	 * @description  自动加载html（视图）对应的控制js文件、js数据模型文件
	 * @return {null} 
	 */
	_autoload:function(){
		// 下面部分为延迟载入,解决在文档流未加载完指定容器是出错的问题。
		window.addEventListener('load',function(){
		//载入jquery对象
		ZJCommon.pushScript('jQuery',"js/common/jquery2.1.js","加载jquery框架");
		//载入vue支持
		ZJCommon.pushScript('vue','js/common/vue.2.6.1.js','加载vue支持');	
		//自动数据模型js文件
		ZJCommon.pushScript(ZJCommon.url.fileNoSuffix+'dat',ZJCommon.url.filePath+'modle/'+ZJCommon.url.fileNoSuffix+'.js');	
		//自动加载控制js文件
		ZJCommon.pushScript(ZJCommon.url.fileNoSuffix+'Ctl',ZJCommon.url.filePath+'controller/'+ZJCommon.url.fileNoSuffix+'.js');
		
	});
	},
	
	/**
	 * @method _getFileName 获取当前文件名称
	 * @description  获取当前文件名称
	 * @return {null}  执行完毕将文件名称存入this.url.fileName
	 */
	_getFileName:function(){
	var u=location.pathname.replace(/\\/ig,'\/');
	var pos=u.lastIndexOf('/');
	if(pos==-1){
		this.url.fileName=u;}
	 else{
	    this.url.fileName=u.substr(pos+1);
		}		
	},
	/**
	 * @method _getFileSuffix 获取当前文件后缀
	 * @description  获取当前文件后缀
	 * @return {null}  执行完毕将文件名称存入this.url.fileSuffix
	 */
	_getFileSuffix:function(){
	var u=this.url.fileName;
	var pos=u.lastIndexOf('.');
	if(pos==-1){
		this.url.fileSuffix='';}
	 else{
	    this.url.fileSuffix=u.substr(pos+1);
		}		
	},
	/**
	 * @method _getFileNoSuffix 获取当前文件名，不带后缀
	 * @description  获取当前文件名，不带后缀
	 * @return {null}  执行完毕将文件名称存入this.url.fileNoSuffix
	 */
	_getFileNoSuffix:function(){
	var u=this.url.fileName;
	var pos=u.lastIndexOf('.');
	if(pos==-1){
		this.url.fileNoSuffix=u;}
	else{
	    this.url.fileNoSuffix=u.substring(0,pos);
		}		
	},
	/**
	 * @method _getFilePath 获取当前文件名，不带后缀
	 * @description  获取当前文件名，不带后缀
	 * @return {null}  执行完毕将文件名称存入this.url.filePath
	 */
	_getFilePath:function(){
	var u=location.pathname.replace(/\\/ig,'\/');
	var pos=u.lastIndexOf('\/');
	if(pos==-1){
		this.url.filePath='\/';}
	else{
	    this.url.filePath=u.substring(0,pos+1);
		}		
	}
	

}

//初始化ZJCommon对象
ZJCommon.init();


//------------------以下为对部分浏览器DOM对象的改造


/**
 * @function etEleByKey
 * @description  为Arrar对象添加一个方法，用于获取JSON对象数组里key键的值为 val 的元素
 * @param {string} key 键
 * @param {string} val 值
 * @example 
 * jsArr.etEleByKey('name'，'jQuery');
 * @return {object}=[objec|null] 返回找到元素，找不到时返回null
 */
Array.prototype.getEleByKeyName=function(key,val){
	if (this.length==0){return null;}
	if (!this[0].hasOwnProperty(key)){return null;}
	var l=this.length;
	for(var i=0;i<this.length;i++){
	 if(this[i][key]==val) return this[i];			
	}
	return null;	
}

/**
 * @function isInArrayByKeyName
 * @description  为Arrar对象添加一个方法，用于判断JSON对象数组里是否含有key键的值为 val 的元素
 * @param {string} key 对象名称
 * @param {string} val 对象名称
 * @example 
 * jsArr.isInArrayByKeyName('name',jQuery');
 * @return {boolean}=[true|false] 存在返回true，不存在返回false
 */

Array.prototype.isInArrayByKeyName=function(key,val){
	if (this.length==0){return false;}
	if (!this[0].hasOwnProperty(key)){return false;}
	var l=this.length;
	for(var i=0;i<this.length;i++){
	 if(this[i][key]==val) return true;			
	}
	return false;	
}


/**
 * @function isInArrayByName
 * @description  为Arrar对象添加一个方法，用于判断JSON对象数组里是否含有‘name’键的值为 name 的元素
 * @param {string} name 对象名称
 * @example 
 * jsArr.isInArrayByName('jQuery');
 * @return {boolean}=[true|false] 存在返回true，不存在返回false
 */

Array.prototype.isInArrayByName=function(name){
	return this.isInArrayByKeyName('name',name);	
}
/**
 * @function etEleByName
 * @description  为Arrar对象添加一个方法，用于获取JSON对象数组里name键的值为 name 的元素
 * @param {string} name 对象名称
 * @example 
 * jsArr.getEleByName('jQuery');
 * @return {object}=[objec|null] 返回找到元素，找不到时返回null
 */
Array.prototype.getEleByName=function(name){
	return this.getEleByKeyName('name',name);	
}


