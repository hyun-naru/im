/******************************************************
 *  화면ID 	: 
 *  설명 	: clip 관련된 함수 제공
 *  작성자 	: 김세훈
 *  작성일	: 2018-04-26
 *  변경로그 : 
 ******************************************************/

var clipUtil = (function($, D){
	//----- variable declaration ----

	/**
	 * efrom 프로세스
	 */
	function eformProcess(param) {
		var deferred = $.Deferred();
		$.ajax({
			url : D.http.getServerOrigin() + '/clip/convertEformProcess',
			type : 'POST',
			data : param,
			success : function(result){
				deferred.resolve(JSON.parse(result));
			}
		});
		return deferred;
	}

	function signUrl(param) {		
		return D.http.getServerOrigin() + '/File/' + param;
	}
	
	
	return {
		eformProcess : eformProcess,
		signUrl : signUrl
	}

})(jQuery, window.Dcore);