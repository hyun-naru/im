/** 
 *	- native에서 호출하는 함수
 */
function g_callFromNative(uriParam) {
	var data = uriParse(uriParam);
	
	//alert(JSON.stringify(data));
	
	// 지문인증 결과값 받아오기
	if (data.TYPE == 'FIDO') {
		authUtil.fido_callback(data);
	}
	
	function uriParse(uriParam) {
		uriParam = uriParam + '';
		var resultObj = {};
		var queryString = uriParam.split('?')[1];
		var pairs = queryString.split('&');
		
		pairs.forEach(function(pair) {
			pair = pair.split('=');
			var name = pair[0];
			var value = pair[1];
			
			if (name.length > 0) {
				resultObj[name] = value;
			}
		});
		
		return resultObj;
	}
}

(function($, D) {
	/** 
	 *	background 상태에서 foreground 상태로 바뀔때
	 */
	M.onResume(function(e) {
		// ios 일때
		var config = D.global.getConfigInfo();
		if (M.navigator.os('ios') && config.serverMode == 'prod') {
			/*
				AMM0100 : [앱 인증] 앱 인증에 성공하였습니다.
				AMM0109 : [앱 인증] 앱 인증에 실패하였습니다.
				AMM0209 : [앱 인증] 요청 정보가 유효하지 않습니다.
				AMM0319 : [정책 검증 오류] 루팅 또는 탈옥 단말에서의 실행을 제한합니다.
				AMM0329 : [정책 검증 오류] 루팅 또는 탈옥 단말에서의 실행을 제한합니다.
				AMM0349 : [정책 검증 오류] 블랙리스트에 등록된 앱이 설치되어 있으므로 실행을 제한합니다.
				AMM0359 : [정책 검증 오류] 블랙리스트에 등록된 단말에서의 실행을 제한합니다.
				AMM0410 : [앱 검증] 정책 송신에 성공하였습니다.
				AMM0419 : [앱 검증] 정책 송신에 실패하였습니다.
				DD03F01 : [보안 정책] 보안 정책이 적용되어 화면캡쳐 사용이 제한되었습니다.
				DP02T01 : [보안 정책] 보안 정책이 해제 되었습니다.
				DP02T02 : [보안 정책] 보안 정책 해제에 실패하였습니다.
				DD01F01 : [네트워크] 데이터 네트워크 사용이 불가합니다. 데이터 네트워크 상태를 확인하여 주시기 바랍니다.
				DD01F02 : [에러] 서버 응압이 유효하지 않습니다.
				DD01F03 : [에러] MDS서버 통신이 불가합니다.
				DD01F05 : [에러] 서버에 접속할 수 없습니다.
				DD01F06 : [에러] 서버에 데이터를 전송할 수 없습니다.
				DD01F07 : [에러] 서버로부터 데이터를 수신할 수 없습니다. 
			*/
			// 캡쳐 막기
			M.execute('exMDMApply', {
				callback: M.response.on(function(result) {
					
				}).toString()
			});
		} 
	});
	
	/** 
	 *	foreground 상태에서 background 상태로 바뀔때
	 */
	M.onPause(function(e) {
		// ios 일때
		var config = D.global.getConfigInfo();
		if (M.navigator.os('ios') && config.serverMode == 'prod') {
			// 캡쳐 막기 해제
			M.execute('exMDMRelease');
		} 
	});

})(jQuery, window.Dcore);