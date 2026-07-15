/******************************************************
 *  화면ID 	: 
 *  설명 	: 키패드 함수 제공
 *  작성자 	: 김세훈
 *  작성일	: 2018-04-21
 *  변경로그 : 
 ******************************************************/
/*******************************************************************************
 * Function List
 *******************************************************************************
 *	SecureKeyboardActivity : 보안키패드 활성화
  ******************************************************************************/


var keyboardUtil = (function($, D){
	//----- variable declaration ----
	var deferred 	= null;
	var _param    = null;

	/**
	 * 보안키패드
	 * @returns deferred : promise
	 * 						- resolve : {
	 *                     		result : 'success'	// 'success': 성공, 'fail': 실패, 'cancel': 사용자가 취소
	 *                     		resultObj : {}		// 결과 데이터
	 *                     }
	 */
	function SecureKeyboardActivity(param) {
		deferred = $.Deferred();
		_param = param;

		if(M.navigator.os('android')) {
			// android
			/*
			 *  param
			 *     inputId -> input 값 Id
			 *     maxLength -> 키보드 최대 길이
			 *     title -> 타이틀
			 *     type -> 키보드 타입 0 : 알파벳 , 1 : 숫자
			 *  입력된 패턴은 M.onRestore 이벤트에서 M.data.param('_sk_result') 으로 취득( 암호화 된 상태)
			 */
			var options = {
				className : 'SecureKeyboardActivity',
				param : {
					inputId : param.inputId,
					maxLength :  param.maxLength,
					title : param.title,
					type : param.type
				}
			};
			
			// 네이티브 연동		
			D.move.activity(options);
		} else {
			// ios
			M.execute('exShowSecureKeypad', {
				type : param.type,
				inputId : param.inputId,
				maxLength : param.maxLength,
				title : param.title,
				callback : 'keyboardUtil.onKeypadFinish4iOS'
			});
		}
		
		return deferred;
	}
	
	/**
	 * 네이티브 콜 : 보안키패드 화면 호출(ios)
	 */
	function onKeypadFinish4iOS(result){
		var resultJson = JSON.parse(result);
		
		var resultParam = {
			result : resultJson._sk_result,
			inputId : resultJson._sk_inputId,
			inputText : resultJson._sk_inputText,
			error : resultJson._sk_error
		};
	
		resultValue(resultParam);
//		deferred.resolve(result);		
	}

	/**
	 *  보안키패드 결과 취득(android)
	 */
	M.onRestore(function(e) {
		if (M.data.param('_sk_result')) {
			/*
			 *  _pl_result 
			 *          - 'ok': 성공
			 *          - 'cancel': 사용자가 취소
			 *          - 'error': 보안키패드 화면 초기화 실패 등의 에러
			 *  _sk_inputId 
			 *  		-  화면 호출시 전달된 inputId
			 *	_sk_inputText
			 *			- 사용자가 입력한 암호화 값
			 *	_pl_error
			 *			- 에러내용
			*/
			var result = {
				result : M.data.param('_sk_result'),
				inputId : M.data.param('_sk_inputId'),
				inputText : M.data.param('_sk_inputText'),
				error : M.data.param('_sk_error'),
			};
			
			resultValue(result);
//			deferred.resolve(result);
		}
	});
	
	function resultValue(data) {
		if (data.result == 'ok') {
			var result = {
				result : 'success',
				inputId : data.inputId,
				inputText : data.inputText
			};

			D.http.ajax('/keyboard/first', _param).then(function(aResult){
				result.first = aResult.first;
				deferred.resolve(result);
			});
		} else if (data.result == 'cancel') {
			deferred.resolve({result:'cancel'});
		} else {
			dialog.alert('오류가 발생했습니다. 다시 시도해 주세요.')
			.then(function() {
				deferred.resolve({result:'fail'});
			});
		}		
	}
	
	return {
		SecureKeyboardActivity : SecureKeyboardActivity,
		onKeypadFinish4iOS : onKeypadFinish4iOS
	}

})(jQuery, window.Dcore);