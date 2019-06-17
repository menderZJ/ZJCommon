/**
 * @description 页面控制操作文件
 */
var pageDO={
	//填入页面基本信息	
	//更新标题
	updateTitle:(function(){
		document.title = pageData.title;
		}()),
	updateKeywords:(function(){
	//本来不想怎么使用jQuery,可是没办法，原生js选择器功能太low，而且既然Common中已经_autoload载入了，就用吧 ~_^
	//console.log(window.jQuery);
	//$("mata [name='keywords']").attr('content',pageData.keywords);
	return "key"
	}())
}