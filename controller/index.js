/**
 * @description 页面控制操作文件
 */
var indexDo={
	//填入页面基本信息	
	//更新标题
	_init:function(){
	//初始化页面基本信息也可在此函数里调用数据的处理过程
	document.title = indexData.title;
	$("meta[name='keywords']").attr("content",indexData.keywords);
	$("meta[name='description']").attr("content",indexData.description);	
	if(ZJCommon.url_params.l){
		ZJCommon.loadHTML('view/'+ZJCommon.url_params.l+'.html');
		ZJCommon.pushScript(ZJCommon.url_params.l+'dat','model/'+ZJCommon.url_params.l+'.js');
		ZJCommon.pushScript(ZJCommon.url_params.l+'Ctl','controller/'+ZJCommon.url_params.l+'.js');
	document.title = indexData.title;
	$("meta[name='keywords']").attr("content",indexData.keywords);
	$("meta[name='description']").attr("content",indexData.description);	
	if(ZJCommon.url_params.v){
		ZJCommon.loadHTML('view/'+ZJCommon.url_params.v+'.html');
		ZJCommon.pushScript(ZJCommon.url_params.v+'dat','model/'+ZJCommon.url_params.v+'.js');
		ZJCommon.pushScript(ZJCommon.url_params.v+'Ctl','controller/'+ZJCommon.url_params.v+'.js');
	}	
	

	}
	
	
},
}
indexDo._init();