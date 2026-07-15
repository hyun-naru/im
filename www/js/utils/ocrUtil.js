/******************************************************
 *  화면ID 	: 
 *  설명 	: 신분증 인식 util
 *  작성자 	: 고준호
 *  작성일	: 2018-04-06
 *  변경로그 : 
 ******************************************************/

var g_ocrDeferred = null;

/**
 * 	신분증 인식 결과 수신
 * 	@param result {number} 결과 코드 (-1:성공, 2:취소, 그외: 에러)
 * 										3: 통신문제
 * 										4: 카메라 퍼미션 문제
 * 										5: 카메라 동작 문제
 * 										6: 라이브러리문제
 * 										9: 시도했으나 인식 불가
 * 										999 : 알 수 없는 오류
 * 
 * 	@param data {Object} 신분증 인식 내용의 JSON 오브젝트
 *  					- TYPE : 신분증종류
 *  					- NAME : 이름
 *  					- ISSUE_DATE : 발급일
 *  					- REGISTRATION_NUMBER : 주민등록번호 (외국인등록증인 경우 값 없음)
 *  					- ORGANIZATION : 발급처 (외국인등록증인 경우 값 없음)
 *  					- LICENSE_NUMBER : 운전면허번호
 *  					- ACFN : 운전면허 ACFN (아마도 우측 사진 밑에 있는 식별 코드)
 *  					- LICENSE_APTITUDE_DATE : 운전면허 적성검사 종료일
 *  					- LICENSE_TYPE : 운전면허 종류 (1종보통 등)
 *  
 * 	@param image {string} 신분증 사진을 base64 인코딩한 문자열
 */
function onOCRFinish(result, data, image) {
	try {
		data = JSON.parse(data);
	} catch(e) {
		result = '10'	// json 파싱 에러
		data = {};
	}
	
	var resultObj = {
			result : result,
			data : data,
			image : image
	};
	
	g_ocrDeferred.resolve(resultObj);
}


var ocrUtil = (function($, D){
	// apps.js 로드
	if(!D.apps){
		// apps.js load
		_getScript('/res/www/js/core/dcore/apps/apps.js');
	}
	
	
	/**
	 * 네이티브 콜 : 신분증 인식
	 * 	- 모바일 고객창구 앱에서 처리후 결과값 받음
	 */
	function callOCR() {
		g_ocrDeferred = $.Deferred();
		
		// 모바일 고객창구 앱 설치 체크
		if (!(D.apps.installedMccApp())) {
			D.apps.storeMccApp();
			g_ocrDeferred.resolve( {result : 'store'} );
			return g_ocrDeferred;
		}
		
		// 네이티브 연동		
		M.execute('exWNExecuteOCR', D.response(function(result){
			
			onOCRFinish(result.resultCode, result.data, result.image);
		}));
		
		return g_ocrDeferred;
	}
	
		
	return {
		callOCR : callOCR
	}

})(jQuery, window.Dcore);