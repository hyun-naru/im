/******************************************************
 *  화면ID 	: 
 *  설명 	: 로그인세션 처리
 *  작성자 	: 김세훈
 *  작성일	: 2018-05-19
 *  변경로그 : 
 ******************************************************/


var loginSessionUtil = (function($, D){
	
	/** 
	 *  로그인 체크
	 */
	function loginCheck()
	{
		if(D.global.getUserInfo() != null && D.global.getUserInfo() != undefined && D.global.getUserInfo() != '')
		{
			var rtnValue = true;
			var screenId = "";
			
			var pathname = window.location.pathname || '';
			screenId = pathname.substring((pathname.lastIndexOf('/') + 1));
			
			var screenNm = $('#__header_title__').text();
			if (screenNm == undefined || screenNm == null || screenNm == '') {
				screenNm = '팝업';
			}
			
			$.ajax({
				type:"post",
				url: D.http.getServerOrigin() + "/api/ma/getMfgsSession",
				async:false,
				dataType:"json",
				data:'cbn=M'
					+'&screen_id=' + screenId
					+'&screen_nm=' + screenNm,
					success:function(data,result){
						
						iRegSTime = data.iccRegTime;
						
						// 로그인시
						if(data.result=="success"){
							if(data.loginInfo != undefined && data.loginInfo.length==0){
								rtnValue = false;
							}else{
								rtnValue = true;
							}
						}
					},
					error:function(request,result){
						rtnValue = true;
					}
			});
			return rtnValue;
		} else {
			return true;
		}
	}	
		
	return {
		loginCheck : loginCheck
	}

})(jQuery, window.Dcore);