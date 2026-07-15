/******************************************************
 *  화면ID 	: 
 *  설명 	: 공통 인증, 등록과 관련된 함수 제공
 *  작성자 	: 고준호
 *  작성일	: 2018-03-11
 *  변경로그 : 
 ******************************************************/
/*******************************************************************************
 * Function List
 *******************************************************************************
 *	getPhoneNumberByEmpNo : 사번으로 핸드폰번호 가져오기
 *	getPhoneNumberByEmpNoNice : 사번으로 핸드폰번호 가져오기(nice)
 *	smsRequest : 휴대폰 sms 인증키 요청
 *	smsAuth : 휴대폰 sms 인증키 인증
 *	smsNiceRequest : 휴대폰 Nice sms 인증키 요청
 *	smsNiceAuth : 휴대폰 Nice sms 인증키 인증
 *	cardNiceRequest : 휴대폰 Nice card 인증 요청
 *
 *	idpwLogin : id/pw 로그인  
 *	idpwChange : id/pw 비밀번호 변경
 *	idpwInit : id/pw 비밀번호 초기화
 *
 *	simplePasswordReg : 간편비밀번호 등록
 *	simplePasswordAuth : 간편비밀번호 인증
 *	simplePasswordLogin : 간편비밀번호 로그인 
 *
 *	fingerprintReg : 지문 등록
 *	fingerprintAuth : 지문 인증
 *	fingerprintLogin : 지문 로그인	
 *
 *	fingerprintBlackListInquiry : 지문 블랙리스트 조회
 *	fingerprintBlackListReset : 지문 블랙리스트 해지
 *
 *	patternReg : 패턴 등록
 *	patternAuth : 패턴 인증
 *	patternLogin : 패턴 로그인
 *	onPatternFinish4IOS : 패턴 결과 취득 (IOS)
 *  smsNiceAuthChkValue : 취약점 처리
 ******************************************************************************/


var authUtil = (function($, D){
	//----- variable declaration ----
	var authType = {'idpwd':'0', 'pattern':'1', 'simple':'2', 'finger':'3', 'kakao':'4', 'toss':'5', 'token':'6'};
	var patternMaxFailedCount = 3;
	var patternDeferred = null;
	var fidoDeferred = null;
	var gDeviceId = D.storage.getStorage(D.storage.storageKeys.deviceId);
	if (gDeviceId == null || gDeviceId == undefined || gDeviceId == '') {
		gDeviceId = '1';	// deviceID를 못 가져올 경우 임시로 '1'로 세팅
	}
	console.log("################ gDeviceId authUtil : " + gDeviceId);
		
	if(!window.maskUtil){
		// maskUtil.js load
		_getScript('/res/www/js/utils/maskUtil.js');
	}
	if(!window.fidoUtil){
		// fidoUtil.js load
		_getScript('/res/www/js/utils/fidoUtil.js');
	}
	if(!window.kakaoUtil){
		// kakaoUtil.js load
		_getScript('/res/www/js/utils/kakaoUtil.js');
	}
	if(!window.tossUtil){
		// tossUtil.js load
		_getScript('/res/www/js/utils/tossUtil.js');
	}
	
	if(!D.apps){
		// apps.js load
		_getScript('/res/www/js/core/dcore/apps/apps.js');
	}
	
	/**
	 * 전화번호로 사번 가져오기
	 */
	function getEmpNoByPhoneNumber(phoneNum) {
		var deferred = $.Deferred();
		var param = {
				phoneNum : phoneNum
		};	
		
		D.http.ajax('/ma/plarNumToPhoneNum', param).then(function(result){
			if(typeof result.errorCode === 'undefined') {
				var empno = result.remoteResult;
				deferred.resolve(empno);
			} 
			else {
				dialog.alert(result.text);
				deferred.resolve(undefined);
			}
		});
		
		return deferred;
	}
	
	
	/**
	 * 사번으로 핸드폰번호 가져오기(sms)
	 */
	function getPhoneNumberByEmpNo(empNo) {
		var deferred = $.Deferred();
		var remote = convertUtil.getRemoteObj('FG_UsrPwdInitPop','UDQ01');
		var param = {
				userId : empNo,
				remote : remote
		};		
		
		D.http.ajax('/ma/authKeySms',param).then(function(result){
			if(typeof result.errorCode === 'undefined') {
				var DS_USER_INF = result.remoteResult.outDataSet.DS_USER_INF.data[0];
				
				var returnParam = {
						DS_USER_INF : DS_USER_INF,
						phoneNumber : maskUtil.telString(DS_USER_INF.TEL_NO)
				};
				deferred.resolve(returnParam);
			} 
			else {
				dialog.alert(result.text);
				deferred.resolve(undefined);
			}
		});
		
		return deferred;
	}
	
	/**
	 * 사번으로 핸드폰번호 가져오기(nice)
	 */
	function getPhoneNumberByEmpNoNice(empNo) {
		var deferred = $.Deferred();
		var param = {
			empNo : empNo,
		};		
		
		D.http.ajax('/ma/getNiceUserInfo',param)
		.then(function(result){
			if(result) {
				deferred.resolve(result);
			} 
			else {
				deferred.resolve(undefined);
			}
		});
		
		return deferred;
	}	
	
	/**
	 * 사번으로 주민번호 앞/뒤 가져오기
	 */
	function getRrnByEmpNo(empNo) {
		var deferred = $.Deferred();
		var param = {
			empNo : empNo,
		};	
		
		D.http.ajax('/ma/getPlarRrn',param)
		.then(function(result){
			if(result) {
				deferred.resolve({
					front : result.FRONT_NUM || '',
					back1 : result.BACK1_NUM || ''
				});
			} 
			else {
				deferred.resolve(undefined);
			}
		});
		
		return deferred;
	}
	
	
	
	//***************************************************//
	//*                  휴대폰 SMS                     *//
	//***************************************************//
	/**
	 * 휴대폰 sms 인증키 요청
	 */
	function smsRequest(param) {
		var deferred = $.Deferred();
		var remote = convertUtil.getRemoteObj('FG_UsrPwdInitPop', 'UDQ02');
		var param = {
				empno : param.EMPNO,
				empl_nam : param.EMPL_NAM,
				cs_pk : param.CS_PK,
				tel_no : param.TEL_NO,
				auth_key : param.AUTH_KEY,
				remote : remote
		};
		
		D.http.ajax('/ma/authKeySms', param).then(function(ajaxResult){
			if(typeof ajaxResult.errorCode === 'undefined') {
				var returnParam = {
					result : 'success',
					msg : '인증번호가 SMS로 발송되었습니다. 인증번호를 입력하세요.',
					DS_USER_INF : ajaxResult.remoteResult.outDataSet.DS_USER_INF.data[0]
				};
				
				deferred.resolve(returnParam);
			} else {
				var returnParam = {
					result : 'fail',
					errorMsg : '인증번호 발송이 실패했습니다. 다시 요청해 주세요.'
				};
				deferred.resolve(returnParam);
			}
		});
		
		return deferred;
	}
	
	/**
	 * 휴대폰 sms 인증키 인증
	 */
	function smsAuth(userId, authKey, inputKey) {
		var deferred = $.Deferred();
		var remote = convertUtil.getRemoteObj('FG_UsrPwdInitPop', 'UDI01');
		var param = {
			userId : userId,
			authKey : authKey,
			inputKey  : inputKey,
			remote : remote
		};
		
		D.http.ajax('/ma/authKeySms', param).then(function(ajaxReturn){
			if(typeof ajaxReturn.errorCode === 'undefined') {
				var returnParam = {
					result : 'success',
					msg : '인증 성공 하였습니다.'
				};
				deferred.resolve(returnParam);
			} else {
				var returnParam = {
					result : 'fail',
					errorCode : ajaxReturn.errorCode,
					errorMsg : ajaxReturn.errorMsg
				}
				
				deferred.resolve(returnParam);
			}
		});
		
		return deferred;
	}
	
	/**
	 * 휴대폰 Nice sms 인증키 요청
	 */
	function smsNiceRequest(requestParam) {
		var deferred = $.Deferred();
		var remote = convertUtil.getRemoteObj('FG_UsrPwdInitPop', 'UDQ02');
		var param = {
				TELECOM_SECD : requestParam.TELECOM_SECD,		// 통신사 구분	1:SKT, 2:KT, 3:LGU+,5:SKT알뜰폰,6:KT알뜰폰,7:LGU+알뜰폰
				HPNO : requestParam.HPNO,						// 유효한 명의자 휴대폰 번호(10자리 or 11자리)
				YYMMDD : requestParam.YYMMDD,			 		// 생년월일
				SEX : requestParam.SEX,					 		// 주민번호 뒤 1자리
				CUST_NM : requestParam.CUST_NM,					// 본인인증에 필요한 명의자 이름.
				SND_YN : requestParam.SND_YN,					// 문자발송여부. 1-인증 후 표준 메시지로 SMS발송 신청, 2-인증 후 사용자요청 메시지로 SMS발송, 3-인증 후 LMS발송 신청
				SYS_DV : requestParam.SYS_DV,					// 시스템 구분
				AUTH_WORK_SECD : requestParam.AUTH_WORK_SECD,	// 인증업무구분  01:고객본인인증,02:로그인휴대폰인증
				empNo : D.storage.getStorage(D.storage.storageKeys.empNo), //허성렬
				remote : remote
			}
		
		D.http.ajax('/ma/smsNiceRequest', param).then(function(ajaxResult){
			var DS_RESULT_SMS = ajaxResult.remoteResult.outDataSet.DS_RESULT_SMS.data[0];
			var returnParam = {
				DS_RESULT_SMS : DS_RESULT_SMS	
			}
			deferred.resolve(returnParam);
		});
		
		return deferred;
	}
	
	/**
	 * 휴대폰 Nice sms 인증키 인증
	 */
	function smsNiceAuth(requestParam) {
		var deferred = $.Deferred();
		var remote = convertUtil.getRemoteObj('', '');
		var param = {
			SMS_AUTH_NO : requestParam.SMS_AUTH_NO,
			AUTH_CHTS_NO : requestParam.AUTH_CHTS_NO,
			SEFAUTH_HIS_SEQ  : requestParam.SEFAUTH_HIS_SEQ,
			remote : remote
		};
		
		D.http.ajax('/ma/smsNiceAuth', param).then(function(ajaxResult){
			var DS_CONFIRM_SMS = ajaxResult.remoteResult.outDataSet.DS_CONFIRM_SMS.data[0];
			var returnParam = {
				DS_CONFIRM_SMS : DS_CONFIRM_SMS	
			}
			deferred.resolve(returnParam);
		});
		
		return deferred;		
	}
	
	/**
	 * 휴대폰 Nice sms 인증키 변조 확인_21.07.29
	 */
	function smsNiceAuthChkValue(requestParam) {
		var deferred = $.Deferred();
		var remote = convertUtil.getRemoteObj('', '');
		console.log("################ requestParam.AUTH_CHTS_NO : " + requestParam.AuthentificateData);
		var param = {
			AUTH_CHTS_NO : requestParam.AuthentificateData,
			remote : remote
		};
		
		D.http.ajax('/ma/smsNiceAuthChkValue', param).then(function(ajaxResult){
			if(typeof ajaxResult.errorCode === 'undefined') {
				console.log("################ 111 ");
				var DS_CONFIRM_SMS = ajaxResult.remoteResult.outDataSet.DS_CONFIRM_SMS.data[0];
				console.log("################ 111 > " + DS_CONFIRM_SMS);
				var returnParam = {
					DS_CONFIRM_SMS : DS_CONFIRM_SMS	
				}
				deferred.resolve(returnParam);
			}else{
				console.log("################ 222 ");
				var returnParam = {
						result : 'fail',
						//errorCode : ajaxReturn.errorCode,
						//errorMsg : ajaxReturn.errorMsg					
					};
					
				deferred.resolve(returnParam);
			}
		});
		
		return deferred;		
	}
	
	/**
	 * 토스 Response 변조 확인_21.12.09
	 */
	function tossAuthChkValue(requestParam) {
		var deferred = $.Deferred();
		var remote = convertUtil.getRemoteObj('', '');
		console.log("################ tossAuthChkValue : " + requestParam.empNo);
		var param = {
			empNo : requestParam.empNo,
			deviceId : gDeviceId

		};
		
		D.http.ajax('/ma/tossLoginVldChk', param).then(function(ajaxResult){
			if(typeof ajaxResult.errorCode === 'undefined') {
				console.log("################ 111 ");
				//var DS_CONFIRM_SMS = ajaxResult.remoteResult.outDataSet.DS_CONFIRM_SMS.data[0];
				//console.log("################ 111 > " + DS_CONFIRM_SMS);
				var returnParam = {
						result : 'success',
				}
				deferred.resolve(returnParam);
			}else{
				console.log("################ 222 ");
				D.move.exit();
				var returnParam = {
						result : 'fail',
						//errorCode : ajaxReturn.errorCode,
						//errorMsg : ajaxReturn.errorMsg					
					};
					
				deferred.resolve(returnParam);
			}
		});
		
		return deferred;		
	}
	
	/**
	 * Nice card 인증 요청
	 */
	function cardNiceRequest(requestParam) {
		var deferred = $.Deferred();
		var remote = convertUtil.getRemoteObj('', '');
		var param = {
				CUST_NM : requestParam.CUST_NM,					// 본인인증에 필요한 명의자 이름.
				BRTYMD : requestParam.BRTYMD,
				YYMMDD : requestParam.YYMMDD,			 		// 생년월일
				SYS_DV : requestParam.SYS_DV,					// 시스템 구분
				CARD_DATA : requestParam.CARD_DATA,				// 카드번호 + '=' + 유효기간 (21)
				PASSWD : requestParam.PASSWD,
				remote : remote
			}
		
		D.http.ajax('/ma/cardNiceRequest', param).then(function(ajaxResult){
			D.logger.info(ajaxResult);
			var DS_RESULT_CARD = ajaxResult.remoteResult.outDataSet.DS_RESULT_CARD.data[0];
			var returnParam = {
				DS_RESULT_CARD : DS_RESULT_CARD	
			}
			deferred.resolve(returnParam);
		});
		
		return deferred;
	}		
	
	
	//***************************************************//
	//*                  id/pw                          *//
	//***************************************************//
	/**
	 * id/pw 로그인
	 */
	function idpwLogin(id, pw) {
		var deferred = $.Deferred();
		var param = {
				authType : 'UsernamePassword',
				principal : id,
				credential : pw
		};
		
		D.http.ajaxForLogin('/gw/authentication', param)
		.then(function(loginResult) {
			if(loginResult.result == 'success'){
				D.global.setUserInfo(setAuthLevelInfo(loginResult));	// UserInfo global 변수 저장
				setStorage('empNo', id); // Id 스토리지에 저장
				// 최종 로그인 시간 가져오기
				statisticalLogUtil.getLoginLog(id)
				.then(function(getLoginLogResult) {
					loginResult.resultData = getLoginLogResult.result;
					statisticalLogUtil.loginLog(authType.idpwd, '');	// 통계용 로그 쌓기 (0: id/pw, 1:패턴, 2:간편, 3:지문)
					statisticalLogUtil.deviceDisplayInfoReg(id);
					deferred.resolve(loginResult);
				});
			} else {
				deferred.resolve(loginResult);
			}
		});
		
		return deferred;
	}
	
	/**
	 * id/pw 비밀번호 변경
	 */
	function idpwChange(param) {
		var deferred = $.Deferred();
		
		D.http.ajax('/ma/idpwChange', param)
		.then(function(ajaxResult) {
			var resultMap = ajaxResult.remoteResult.paramMap;
			deferred.resolve(resultMap);
		});
		
		return deferred;
	}
	
	/**
	 * id/pw 비밀번호 초기화
	 */
	function idpwInit(userId) {
		var deferred = $.Deferred();
		var remote = convertUtil.getRemoteObj('FG_UsrPwdInitPop', 'UDI01');
		var param = {
			userId : userId,
			remote : remote
		};
		
		D.http.ajax('/ma/idpwInit', param).then(function(ajaxResult){
			if(typeof ajaxResult.errorCode === 'undefined') {
				var returnParam = {
					result : 'success',
					msg : '비밀번호 초기화 완료했습니다.'
				};
				deferred.resolve(returnParam);
			} else {
				var returnParam = {
					result : 'fail',
					errorCode : ajaxReturn.errorCode,
					errorMsg : ajaxReturn.errorMsg					
				};
				
				deferred.resolve(returnParam);
			}
		});
		
		return deferred;
	}
	
	
	//***************************************************//
	//*             FIDO 간편비밀번호                   *//
	//***************************************************//
	/**
	 * 간편비밀번호 등록 (모바일 고객창구 앱을 통해서 등록)
	 */
	function simplePasswordReg(USERID) {
		fidoDeferred = $.Deferred();
		
		if (!checkApps()) return fidoDeferred.resolve({result:'fail'});
		
		// 네이티브 연동
		var paramArr = [
		   'TYPE=FIDO',			// 구분
		   'USERID=' + USERID,	// 사원번호
		   'AUTH_CODE=116',		// 100:지문, 116: 간편비밀번호
		   'SERVICE_TYPE=0'		// (0:등록, 1:인증, 2:해지, 3:블랙리스트조회, 4:블랙리스트해지)
		];
		
		var param = 'dgbmcenter://dgbfnlife?' + paramArr.join('&');
		 
		M.execute('exWNSchemeAppCall', param);
		
		
		//if (!checkApps()) return fidoDeferred.resolve({result:'fail'});
		// 처리후 결과값은 nativeInterface.js 파일의 g_callFromNative() 함수를 통해 fido_callback()으로 넘어옴
		return fidoDeferred.promise();
	}
	
	/**
	 * 간편비밀번호 인증 (모바일 고객창구 앱을 통해서 인증)
	 */
	function simplePasswordAuth(USERID) {
		fidoDeferred = $.Deferred();
		
		if (!checkApps()) return fidoDeferred.resolve({result:'fail'});
				
		// 네이티브 연동
		var paramArr = [
 		   'TYPE=FIDO',			// 구분
 		   'USERID=' + USERID,	// 사원번호
 		   'AUTH_CODE=116',		// 100:지문, 116: 간편비밀번호
 		   'SERVICE_TYPE=1'		// (0:등록, 1:인증, 2:해지, 3:블랙리스트조회, 4:블랙리스트해지)
 		];
 		
 		var param = 'dgbmcenter://dgbfnlife?' + paramArr.join('&');
 		
 		M.execute('exWNSchemeAppCall', param);
 		
		// 처리후 결과값은 nativeInterface.js 파일의 g_callFromNative() 함수를 통해 fido_callback()으로 넘어옴
		return fidoDeferred.promise();
	}
	
	/**
	 * 간편비밀번호 로그인
	 */
	function simplePasswordLogin(arg) {
		return fidoUtil.authPin(arg)
		.then(function(aResult) {
			if(aResult.errorCode) {
				aResult.result = 'failed';
				return aResult;
			}

			return D.http.ajaxForLogin('/gw/authentication', {
				deviceId: aResult.deviceId,
				authType : 'SimplePassword',
				credential: aResult.token
			});
		})
		.then(function(aResult) {
			if(aResult.result != 'success') return aResult;

			D.global.setUserInfo(setAuthLevelInfo(aResult));	// UserInfo global 변수 저장
			setStorage('empNo', aResult.empno); // Id 스토리지에 저장

			return statisticalLogUtil.getLoginLog(aResult.empno)
			.then(function(getLoginLogResult) {
				statisticalLogUtil.loginLog(authType.finger, '');	// 통계용 로그 쌓기 (0: id/pw, 1:패턴, 2:간편, 3:지문)
				statisticalLogUtil.deviceDisplayInfoReg(aResult.empno);
				return {
					result: aResult.result,
					resultData: getLoginLogResult.result
				};
			});
		});
	}
	
	
	//***************************************************//
	//*                  FIDO 지문                      *//
	//***************************************************//
	/**
	 *  지문 등록 (모바일 고객창구 앱을 통해서 등록)
	 */
	function fingerprintReg(USERID) {
		fidoDeferred = $.Deferred();
		
		if (!checkApps()) return fidoDeferred.resolve({result:'fail'});
		
		// 네이티브 연동
		var paramArr = [
  		   'TYPE=FIDO',			// 구분
  		   'USERID=' + USERID,	// 사원번호
  		   'AUTH_CODE=100',		// 100:지문, 116: 간편비밀번호
  		   'SERVICE_TYPE=0'		// (0:등록, 1:인증, 2:해지, 3:블랙리스트조회, 4:블랙리스트해지)
  		];
  		
  		var param = 'dgbmcenter://dgbfnlife?' + paramArr.join('&');
  		
  		M.execute('exWNSchemeAppCall', param);
		
		// 처리후 결과값은 nativeInterface.js 파일의 g_callFromNative() 함수를 통해 fido_callback()으로 넘어옴
		return fidoDeferred.promise();
	}
	
	/**
	 *  지문 인증 (모바일 고객창구 앱을 통해서 인증)
	 */
	function fingerprintAuth(USERID) {
		fidoDeferred = $.Deferred();
		
		if (!checkApps()) return fidoDeferred.resolve({result:'fail'});
				
		// 네이티브 연동
		var paramArr = [
   		   'TYPE=FIDO',			// 구분
   		   'USERID=' + USERID,	// 사원번호
   		   'AUTH_CODE=100',		// 100:지문, 116: 간편비밀번호
   		   'SERVICE_TYPE=1'		// (0:등록, 1:인증, 2:해지, 3:블랙리스트조회, 4:블랙리스트해지)
   		];
   		
   		var param = 'dgbmcenter://dgbfnlife?' + paramArr.join('&');
   		
   		M.execute('exWNSchemeAppCall', param);
		
		// 처리후 결과값은 nativeInterface.js 파일의 g_callFromNative() 함수를 통해 fido_callback()으로 넘어옴
		return fidoDeferred.promise();
	}
	
	/**
	 * 지문 로그인
	 */
	function fingerprintLogin(arg) {
		return fidoUtil.authFinger()
		.then(function(aResult) {
			if(aResult.errorCode) {
				aResult.result = 'failed';
				return aResult;
			}

			return D.http.ajaxForLogin('/gw/authentication', {
				deviceId: aResult.deviceId,
				authType : 'FIDO',
				credential: aResult.token
			});
		})
		.then(function(aResult) {
			if(aResult.result != 'success') return aResult;

			D.global.setUserInfo(setAuthLevelInfo(aResult));	// UserInfo global 변수 저장
			setStorage('empNo', aResult.empno); // Id 스토리지에 저장


			return statisticalLogUtil.getLoginLog(aResult.empno)
			.then(function(getLoginLogResult) {
				statisticalLogUtil.loginLog(authType.finger, '');	// 통계용 로그 쌓기 (0: id/pw, 1:패턴, 2:간편, 3:지문)
				statisticalLogUtil.deviceDisplayInfoReg(aResult.empno);
				return {
					result: aResult.result,
					resultData: getLoginLogResult.result
				};
			});
		});
	}
	
	
	//***************************************************//
	//*                  FIDO 공통                      *//
	//***************************************************//
	/**
	 *  FIDO 콜백
	 */
	function fido_callback(data) {
		// fidoDeferred
		fidoDeferred.resolve({
			result:'success',
			resultObj : data
		});
	}
	
	/**
	 * TODO: 지문 블랙리스트 조회
	 */
	function fingerprintBlackListInquiry(USERID) {
		fidoDeferred = $.Deferred();
		
		if (!checkApps()) return fidoDeferred.resolve({result:'fail'});
		
		// 네이티브 연동
		M.execute('', {
			TYPE : 'FIDO',		// 구분
			USERID : USERID,	// 사원번호
			AUTH_CODE : '',	// 100:지문, 116: 간편비밀번호
			SERVICE_TYPE : '3'	// (0:등록, 1:인증, 2:해지, 3:블랙리스트조회, 4:블랙리스트해지)
		});
		
		// 처리후 결과값은 nativeInterface.js 파일의 g_callFromNative() 함수를 통해 fido_callback()으로 넘어옴
		return fidoDeferred.promise();
	}
	
	/**
	 * TODO: 지문 블랙리스트 해지
	 */
	 function fingerprintBlackListReset(USERID) {
		fidoDeferred = $.Deferred();
		 
		if (!checkApps()) return fidoDeferred.resolve({result:'fail'});
		 
		// 네이티브 연동
		M.execute('', {
			TYPE : 'FIDO',		// 구분
			USERID : USERID,	// 사원번호
			AUTH_CODE : '',	// 100:지문, 116: 간편비밀번호
			SERVICE_TYPE : '4'	// (0:등록, 1:인증, 2:해지, 3:블랙리스트조회, 4:블랙리스트해지)
		});
		
		// 처리후 결과값은 nativeInterface.js 파일의 g_callFromNative() 함수를 통해 fido_callback()으로 넘어옴
		return fidoDeferred.promise();
	 }
	 
	
	/**
	 * 모바일 고객창구 앱 설치 여부 및 금융결제원 공동앱 설치 여부 체크
	 */
	function checkApps() {
		// 금융결제원 공동앱 설치 여부
		if (!D.apps.installedBioApp()) {
			dialog.confirm('금융결제원 공동앱을 설치해야합니다.<br/>설치 페이지로 이동하시겠습니까?')
			.then(function(value) {
				if (value == dialog.YES) {
					D.apps.storeBioApp();
				}
			});
			
			return false;
		}
		
		// 모바일 고객창구 앱 설치 여부
		if (!D.apps.installedMccApp()) {
			dialog.confirm('모바일 고객창구앱을 설치해야합니다.<br/>설치 페이지로 이동하시겠습니까?')
			.then(function(value) {
				if (value == dialog.YES) {
					D.apps.storeMccApp();
				}
			});
			
			return false;
		}
		
		return true;
	}
	
	
	//***************************************************//
	//*                  패턴                           *//
	//***************************************************//
	/**
	 * 패턴 등록
	 * @returns deferred : promise
	 * 						- resolve : {
	 *                     		result : 'success'	// 'success': 성공, 'fail': 실패, 'cancel': 사용자가 취소
	 *                     		resultObj : {}		// 결과 데이터
	 *                     }
	 */
	function patternReg() {
		var deferred = $.Deferred();
		
		callPatternLock(0)
		.then(function(data) {
			if (data.result == 'ok') {
				// DB에 pattern 값 저장
				var param = {
					empNo : D.storage.getStorage(D.storage.storageKeys.empNo),			// 사원번호
					deviceId : gDeviceId,	// 디바이스ID
					authKey : data.pattern,	// 패턴 값
					authFailCnt : '0'
				};
				
				D.http.ajax('/ma/patternReg', param)
				.then(function(result) {
					if (result.result == 'success') {
						D.storage.setStorage(D.storage.storageKeys.isRegPattern, true);	// 스토리지에 등록여부 저장
						D.storage.setStorage(D.storage.storageKeys.loginType, authType.pattern);
						deferred.resolve({
							result:'success',
							resultObj : {authKey : data.pattern}
						});
					} else {
						deferred.resolve({result:'fail'});
					}
				})
				.fail(function() {
					deferred.resolve({result:'fail'});
				});
			
			} else if (data.result == 'cancel') {
				deferred.resolve({result:'cancel'});
			
			} else if (data.result == 'not_supported') {
				dialog.alert('패턴이 지원되지 않는 기기입니다.')
				.then(function() {
					deferred.resolve({result:'fail'});
				});
			
			} else {
				dialog.alert('오류가 발생했습니다. 다시 시도해 주세요.')
				.then(function() {
					deferred.resolve({result:'fail'});
				});
			}
		});
		
		return deferred;
	}
	
	/**
	 * 패턴 인증
	 * @returns deferred : promise
	 * 						- resolve : {
	 *                     		result : 'success'	// 'success': 성공, 'fail': 실패, 'cancel': 사용자가 취소, 'locked': 잠김
	 *                     		resultObj : {}		// 결과 데이터
	 *                     }
	 */
	function patternAuth() {
		var deferred = $.Deferred();
		
		// DB에서 pattern 값, 실패횟수를 가져온다. (empNo 와 deviceId로 select함)
		var param = {
			empNo : D.storage.getStorage(D.storage.storageKeys.empNo),			// 사원번호
			deviceId : gDeviceId,	// 디바이스ID
			authType : authType.pattern // 로그인설정타입(id/pw:0,패턴:1,간편비밀번호:2,지문:3)
		};
		
		D.http.ajax('/ma/selectMfgsUserInfo', param)
		.then(function(ajaxResult){
			// 실패시
			if(ajaxResult.result == 'fail') {
				dialog.alert(ajaxResult.errorMsg)
				.then(function() {
					if(ajaxResult.errorCode == 'EP1003') {
						deferred.resolve({
							result:'locked',
							resultObj: {errorMsg : ajaxResult.errorMsg}
						});
					} else {
						deferred.resolve({result:'fail'});
					}
				});
			}
			// 성공시
			else {
				var patternValue = ajaxResult.AUTH_KEY;
				var failedCount = ajaxResult.AUTH_FAIL_CNT;
				
				callPatternLock(1, patternValue, failedCount)
				.then(function(data) {
					if (data.result == 'ok') {
						deferred.resolve({
							result:'success',
							resultObj : {authKey : patternValue}
						});
					} else if (data.result == 'cancel') {
						deferred.resolve({result:'cancel'});
					} else if (data.result == 'not_supported') {
						dialog.alert('패턴이 지원되지 않는 기기입니다.')
						.then(function() {
							deferred.resolve({result:'fail'});
						});
					} else if (data.result == 'locked') {
							// 실패횟수 업데이트
							var param = {
								empNo : D.storage.getStorage(D.storage.storageKeys.empNo),			// 사원번호
								deviceId : gDeviceId,	// 디바이스ID
								authFailCnt : data.failedCount
							};
							
							D.http.ajax('/ma/patternUpdFailCount', param);
							
							deferred.resolve({
								result:'locked',
								resultObj: {errorMsg : '비밀번호 입력 '+patternMaxFailedCount+'회 오류입니다. 로그인 잠금 설정이 되었습니다. 본인 인증 이후에 다시 시도해주세요.'}
							});
					} else {
						dialog.alert('오류가 발생했습니다. 다시 시도해 주세요.')
						.then(function() {
							deferred.resolve({result:'fail'});
						});
					}
				});
			}
		});
		
		return deferred;
	}
	
	/**
	 *  패턴 로그인
	 */
	function patternLogin(patternValue) {
		var deferred = $.Deferred();
		var param = {
				principal : D.storage.getStorage(D.storage.storageKeys.empNo),	// 사원번호
				deviceId : gDeviceId,	// 디바이스ID
				authType : 'Pattern',
				credential : patternValue	// 패턴 값
		};
		
		D.http.ajaxForLogin('/gw/authentication', param)
		.then(function(loginResult) {
			if (loginResult.result == 'success') {
				D.global.setUserInfo(setAuthLevelInfo(loginResult));	// UserInfo global 변수 저장
				statisticalLogUtil.loginLog(authType.pattern, '');	// 통계용 로그 쌓기 (0: id/pw, 1:패턴, 2:간편, 3:지문)
				statisticalLogUtil.deviceDisplayInfoReg(D.storage.getStorage(D.storage.storageKeys.empNo));
			}
			
			deferred.resolve(loginResult);
		});
		
		return deferred;
	}
	
	/**
	 * 네이티브 콜 : 패턴 화면 호출
	 */
	function callPatternLock(mode, patternValue, failedCount) {
		patternDeferred = $.Deferred(); 
			
		/*
		 *  param
		 *     mode -> 0:등록(2회입력)/ 1:인증(1회입력)/ 2:패턴변경(2회입력)
		 *     minLen -> 패턴 최소 길이 (optional, 기본값 1)
		 *     pattern -> 저장된 패턴 (optional, mode가 1일때만 필수)
		 *     maxFailedCount -> 인증 실패 시 재시도 가능한 최대 횟수 (optional, mode가 1일때만 유효, 기본값 5)
		 *     failedCount -> 이미 인증 실패한 횟수
		 *  입력된 패턴은 M.onRestore 이벤트에서 M.data.param('_pl_pattern') 으로 취득( 암호화 된 상태)
		 */
		
		// IOS 일 경우
		if (M.navigator.os('ios')) {
			// 네이티티브 연동 ios
			M.execute('exShowPatternLock', {
				'mode' : mode,
				'minLen' : 3,
				'maxFailedCount': patternMaxFailedCount,
				'pattern': patternValue || '',
				'failedCount': failedCount || 0,
				'callback' : 'authUtil.onPatternFinish4IOS'
			});
		}
		// 그 외
		else {
			var options = {
					className: 'PatternLockActivity',
					param: {
						'mode': mode,
						minLen: 3,
						maxFailedCount: patternMaxFailedCount,
						pattern: patternValue || '',
						failedCount: failedCount || 0
					}
			};
			
			// 네이티브 연동 andriod		
			D.move.activity(options);
		}
		
		return patternDeferred;
	}
	
	/**
	 *  패턴 결과 취득 (IOS)
	 */
	function onPatternFinish4IOS(data) {
		var result = {
			result : data._pl_result,
			mode : data._pl_mode,
			pattern : data._pl_pattern,
			error : data._pl_error,
			failedCount : data._pl_failed_count
		};
		
		patternDeferred.resolve(result);
	}
	
	/**
	 *  패턴 결과 취득 (안드로이드)
	 */
	M.onRestore(function(e) {
		if (M.data.param('_pl_result')) {
			/*
			 *  _pl_result 
			 *          - 'ok': 성공
			 *          - 'cancel': 사용자가 취소
			 *          - 'not_supported': 패턴 암호화에 사용하는 알고리즘을 단말기가 지원하지 않음
			 *          - 'error': 패턴 화면 초기화 실패 등의 에러
			 *  _pl_mode 
			 *  		-  화면 호출시 전달된 mode
			 *	_pl_pattern
			 *			- 사용자가 입력한 패턴의 암호화 값
			 *	_pl_error
			 *			- 에러내용
			 *	_pl_failed_count
			 *			- 실패 횟수
			*/
			var result = {
				result : M.data.param('_pl_result'),
				mode : M.data.param('_pl_mode'),
				pattern : M.data.param('_pl_pattern'),
				error : M.data.param('_pl_error'),
				failedCount : M.data.param('_pl_failed_count')
			};
			
			M.data.removeParam('_pl_result');
			M.data.removeParam('_pl_mode');
			M.data.removeParam('_pl_pattern');
			M.data.removeParam('_pl_error');
			M.data.removeParam('_pl_failed_count');
			
			patternDeferred.resolve(result);
		}
	});
	
	
	//***************************************************//
	//*                  기타                           *//
	//***************************************************//
	/**
	 * 권한 정보 설정
	 */
	function setAuthLevelInfo(userInfo) {
		if ($.type(userInfo) != 'object') return {};
		var fcYn = "Y";			//N이면 GA 그외 Y로 셋팅
		var chnCheckYn = "Y"; 	//채널 조회권한
		var hqCheckYn = "Y"; 	//지역단 조회권한
		var bzGrpCheckYn = "Y"; //본부 조회권한
		var brCheckYn = "Y";	//지점 조회권한
		var tmCheckYn = "Y";	//팀 조회권한
		var apvMenuYn = "Y";      // 승인페이지 권한

		var chndtlcd = userInfo.chndtlcd || '';
		var authlvl = userInfo.authlvl || '';

		if(chndtlcd == "30"){
			fcYn = "N";
		}
		
		if(chndtlcd == "30" && authlvl == "9"){
			chnCheckYn = "N";
		}else if( authlvl.substr(0,1) == "8"){
			chnCheckYn = "N";
			hqCheckYn = "N";
			bzGrpCheckYn = "N";
		}else if( authlvl.substr(0,1) == "7"){
			chnCheckYn = "N";
			hqCheckYn = "N";
			bzGrpCheckYn = "N";
			brCheckYn = "N";
		}else if( authlvl.substr(0,1) == "6"){
			chnCheckYn = "N";
			hqCheckYn = "N";
			bzGrpCheckYn = "N";
			brCheckYn = "N";
			tmCheckYn = "N";
			apvMenuYn = "N";
		}else if( authlvl.substr(0,1) == "2" || authlvl.substr(0,1) == "1" ){
			chnCheckYn = "N";
			hqCheckYn = "N";
			brCheckYn = "N";
			bzGrpCheckYn = "N";
			tmCheckYn = "N";
			apvMenuYn = "N";
		}
		
		var result = {
				fcYn : fcYn,	
				chnCheckYn : chnCheckYn,	
				hqCheckYn : hqCheckYn,
				bzGrpCheckYn : bzGrpCheckYn,
				brCheckYn : brCheckYn,
				tmCheckYn : tmCheckYn,
				apvMenuYn : apvMenuYn	
		};
		
		userInfo.authlvlInfo = result;
		
		return userInfo;
	}
	function getStorage(arg) {
		return D.isApp ? D.storage.getStorage(D.storage.storageKeys[arg]) : localStorage.getItem(arg);
	}
	function setStorage(ky, arg) {
		D.isApp ? D.storage.setStorage(D.storage.storageKeys[ky], arg) : localStorage.setItem(ky, arg);
	}
	
	function authPop (param){

		var def = $.Deferred();
		var authPage = '';
		var auth = param.AUTH.split(',');
		if(auth.length == 1){

			if(auth[0] == '01'){
				authPage = "/www/html/view/com/COM-1020P";
			}else if(auth[0] == '02'){
				return authKakao(param);
			}else if(auth[0] == '03'){
				return authFinger(param);
			}else if(auth[0] == '04'){
				authPage =  "/www/html/view/com/COM-1030P";
			}
			
			dialog.openPopup(authPage, param).then(function(isCheck){

				def.resolve(isCheck);
				
			});
		}else{
			dialog.openPopup("/www/html/view/com/COM-1010P", param)
			.then(function(result) { 
				if(result){
					if(result == '01'){
						authPage = "/www/html/view/com/COM-1020P";
					}else if(result == '02'){
						return authKakao(param);
					}else if(result == '03'){
						return authFinger(param);
					}else if(result == '04'){
						authPage =  "/www/html/view/com/COM-1030P";
					}
					
					dialog.openPopup(authPage, param).then(function(isCheck){

						def.resolve(isCheck);
						
					});
				}else{
					def.resolve(result);
				}
			});

		}

		function authFinger(param) {
			fidoUtil.authFinger()
			.then(function(aResult) {
				if(aResult.crrorCode) {
					def.resolve(false);
				} else {
					if (param.SIGN_VAL) {
						// SIGN_VAL 이 있을때 eform report 테이블 sign_val 업데이트
						updateSignVal(aResult.auth_no, param.SIGN_VAL, param.PR_NO, param.FORM_SEQ);
					}
					
					def.resolve(aResult);
				}
			});
		}
		function authKakao(param) {
			kakaoUtil.S310({
				name: param.CUST_NM,// 사용자성명
				phone_no: param.HPNO, // 휴대폰번호
				birthday: param.YYMMDD, // 생년월일(YYYYMMDD)
				title: 'iM라이프 본인인증'
			})
			.then(function(aResult) {
				if(aResult.crrorCode) {
					def.resolve(false);
				} else {
					if (param.SIGN_VAL) {
						// SIGN_VAL 이 있을때 eform report 테이블 sign_val 업데이트
						updateSignVal(aResult.auth_no, param.SIGN_VAL, param.PR_NO, param.FORM_SEQ);
					}
					def.resolve(aResult);
				}
			});
		}
		return def.promise();	
	}
	
	/**
	 * SIGN_VAL 이 있을때 eform report 테이블 sign_val 업데이트
	 */
	function updateSignVal(authNo, signVal, prNo, formSeq) {
		
		if (authNo == null || authNo == undefined || authNo == '') {
			return;
		}
		var reqParam = {
			'mfgsAuthNo': authNo,
			'signVal': signVal,
			'prNo': prNo||'',
			'formSeq': formSeq||''
		};
		D.http.ajax('/su/updateSignVal', reqParam)
		.then(function(res) {
			console.log(res);
		});
	}


	/**
	 * 2021-09-23 석민혁 토스 로그인 추가
	 */
	/**
	 * 토스 로그인
	 */
	function tossAuthLogin() {
		var param = {
				triggerType : "PUSH",
				deviceId : gDeviceId,
				auth_type : 'login'
			}
			return tossUtil.auth(param)
			.then(function(aResult) {
				if(aResult.errorCode) {
					aResult.result = 'failed';
					return aResult;
				}

			return D.http.ajaxForLogin('/gw/authentication', {
				deviceId: gDeviceId,
				authType : 'Toss',
				credential: aResult.success.txId,
				principal : D.storage.getStorage(D.storage.storageKeys.empNo)	// 사원번호
			});
		})
		.then(function(aResult) {
			if(aResult.result != 'success') return aResult;

			D.global.setUserInfo(setAuthLevelInfo(aResult));	// UserInfo global 변수 저장
			setStorage('empNo', aResult.empno); // Id 스토리지에 저장

			return statisticalLogUtil.getLoginLog(aResult.empno)
			.then(function(getLoginLogResult) {
				statisticalLogUtil.loginLog(authType.toss, '');	// 통계용 로그 쌓기 (0: id/pw, 1:패턴, 2:간편, 3:지문)
				statisticalLogUtil.deviceDisplayInfoReg(aResult.empno);
				return {
					result: aResult.result,
					resultData: getLoginLogResult.result
				};
			});

		});
	}
	
	/**
	 * 2021-01-14 김민수 카카오 로그인 추가
	 */
	/**
	 * 카카오 로그인
	 */
	function kakaoAuthLogin() {
		return kakaoUtil.auth()
		.then(function(aResult) {
			if(aResult.errorCode) {
				aResult.result = 'failed';
				return aResult;
			}

			return D.http.ajaxForLogin('/gw/authentication', {
				deviceId: aResult.deviceId,
				authType : 'Kakao',
				credential: aResult.token
			});
		})
		.then(function(aResult) {
			if(aResult.result != 'success') return aResult;

			D.global.setUserInfo(setAuthLevelInfo(aResult));	// UserInfo global 변수 저장
			setStorage('empNo', aResult.empno); // Id 스토리지에 저장

			return statisticalLogUtil.getLoginLog(aResult.empno)
			.then(function(getLoginLogResult) {
				statisticalLogUtil.loginLog(authType.kakao, '');	// 통계용 로그 쌓기 (0: id/pw, 1:패턴, 2:간편, 3:지문)
				statisticalLogUtil.deviceDisplayInfoReg(aResult.empno);
				return {
					result: aResult.result,
					resultData: getLoginLogResult.result
				};
			});
			
			
			
		});
	}
	
	function demokakaoAuthLogin(deviceId, token, userId){
		
		return D.http.ajax('/common/kakao/testSignAuth', {deviceId: deviceId, token:token, userId:userId})
		.then(function(aResult) {
			
			return D.http.ajaxForLogin('/gw/authentication', {
				deviceId: deviceId,
				authType : 'Kakao',
				credential: token
			})
		})
		.then(function(aResult) {
			if(aResult.result != 'success') return aResult;

			D.global.setUserInfo(setAuthLevelInfo(aResult));	// UserInfo global 변수 저장
			setStorage('empNo', aResult.empno); // Id 스토리지에 저장

			return statisticalLogUtil.getLoginLog(aResult.empno)
			.then(function(getLoginLogResult) {
				statisticalLogUtil.loginLog(authType.finger, '');	// 통계용 로그 쌓기 (0: id/pw, 1:패턴, 2:간편, 3:지문)
				statisticalLogUtil.deviceDisplayInfoReg(aResult.empno);
				return {
					result: aResult.result,
					resultData: getLoginLogResult.result
				};
			});
		});
	}
	

	/**
	 * 2021-08-19 자동로그인 추가
	 */
	/**
	 * 자동로그인
	 */
	function tossAutoLogin(credential) {
		var deferred = $.Deferred();
		
		console.log('gDeviceId ::: ', gDeviceId);
		
		var param = {
				principal : gDeviceId,
				authType : 'Token',
				credential : credential
		};
		
		D.http.ajaxForLogin('/gw/authentication', param)
		.then(function(loginResult) {
			
			var id = loginResult.userId;
			
			console.log('resultID ::: ', id);
			
			if(loginResult.result == 'success'){
				D.global.setUserInfo(setAuthLevelInfo(loginResult));	// UserInfo global 변수 저장
				console.log('auto_loginResult :: ', loginResult);
				
				setStorage('empNo', id); // Id 스토리지에 저장
				// 최종 로그인 시간 가져오기
				return statisticalLogUtil.getLoginLog(loginResult.empno)
				.then(function(getLoginLogResult) {
					statisticalLogUtil.loginLog(authType.token, '');	// 통계용 로그 쌓기 (0: id/pw, 1:패턴, 2:간편, 3:지문)
					statisticalLogUtil.deviceDisplayInfoReg(loginResult.empno);
					
					var result = {
							result: loginResult.result,
							resultData: getLoginLogResult.result
						};
					deferred.resolve(result);
				});
				
			} else {
				deferred.resolve(loginResult);
			}
		});
		
		return deferred;
	}
	
	
	return {
		authPop : authPop,
		getEmpNoByPhoneNumber : getEmpNoByPhoneNumber,
		getPhoneNumberByEmpNo : getPhoneNumberByEmpNo,
		getPhoneNumberByEmpNoNice : getPhoneNumberByEmpNoNice,
		getRrnByEmpNo : getRrnByEmpNo,
		smsRequest : smsRequest,
		smsAuth : smsAuth,
		smsNiceRequest : smsNiceRequest,
		smsNiceAuth : smsNiceAuth,
		cardNiceRequest : cardNiceRequest,
		idpwLogin : idpwLogin,
		idpwChange : idpwChange,
		idpwInit : idpwInit,
		simplePasswordReg : simplePasswordReg,
		simplePasswordAuth : simplePasswordAuth,
		simplePasswordLogin : simplePasswordLogin,
		fingerprintReg : fingerprintReg,
		fingerprintAuth : fingerprintAuth,
		fido_callback : fido_callback,
		fingerprintBlackListInquiry : fingerprintBlackListInquiry,
		fingerprintBlackListReset : fingerprintBlackListReset,
		fingerprintLogin : fingerprintLogin,
		patternReg : patternReg,
		patternAuth : patternAuth,
		patternLogin : patternLogin,
		onPatternFinish4IOS : onPatternFinish4IOS,
		tossAuthLogin : tossAuthLogin,
		kakaoAuthLogin : kakaoAuthLogin,
		demokakaoAuthLogin : demokakaoAuthLogin,
		smsNiceAuthChkValue : smsNiceAuthChkValue,
		tossAutoLogin : tossAutoLogin,
		tossAuthChkValue : tossAuthChkValue
	}

})(jQuery, window.Dcore);