var pageDo={
	init:function(){
	//初始化页面基本信息也可在此函数里调用数据的处理过程
	document.title = pageData.title;
	$("meta[name='keywords']").attr("content",pageData.keywords);
	$("meta[name='description']").attr("content",pageData.description);	
	document.getElementsByTagName('body')[0].style.backgroundColor="aquamarine";
	
	},
	view:new Vue({
		el:"#msg",
		data:{
			message:pageData.msg
		}
	})
	
	
}
pageDo.init();