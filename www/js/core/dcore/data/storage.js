/******************************************************
 *  화면ID 	: 
 *  설명 	: 스토리지(영속) 변수 처리 wrapping
 *  작성자 	: jhKo
 *  작성일	: 2018-01-10
 *  변경로그 : 
 *  2018-03-23 김세훈 : storageKey 변수 id 추가
 ******************************************************/

window.Dcore.extend('storage',
	(function (D) {
		//----- variable declaration ----
		var storageKeys = {
				empNo : 'empNo',								// 사원번호
				simpleEmpNo : 'simpleEmpNo',					// FIDO 간편비밀번호 등록시 사원번호
				fingerEmpNo : 'fingerEmpNo',					// FIDO 지문 등록시 사원번호
				simpleCspk : 'simpleCspk',						// FIDO 간편비밀번호 등록시 고객번호
				fingerCspk : 'fingerCspk',						// FIDO 지문 등록시 고객번호
				deviceId : 'deviceId',							// 디바이스 id
				isFirstStartYn : 'isFirstStartYn',				// 앱 처음 실행 여부 Y/N
				passSmsLoginConfigYn : 'passSmsLoginConfigYn',	// 로그인 설정팝업의 SMS 인증 여부
				loginType : 'loginType',						// 로그인 설정 타입 
				isRegPattern : 'isRegPattern',					// 패턴인증 등록 여부
				isRegSimplePassword : 'isRegSimplePassword',	// 간편인증 등록 여부
				isRegFingerprint : 'isRegFingerprint',			// 지문인증 등록 여부
				isFirstLogin : 'isFirstLogin',					// 앱설치 후 처음 로그인 여부
				savedId : 'savedId'								// 저장된 ID
		};
			
		
		//----- execution code ----------
		D.logger.info('storage.js');
		
		//----- function definition -----
		/** 
		 *	스토리지 변수 저장  
		 */
		function setStorage(key, value) {
			M.data.storage(key, value);
		}
		
		/** 
		 *	스토리지 변수 가져오기  
		 */
		function getStorage(key) {
			if (!D.isApp) {
				var value = 'testValue';
				switch(key) {
					case 'empNo': value = 'testEmpNo'; break;
					case 'deviceId': value = 'testDeviceId'; break;
					case 'passSmsLoginConfigYn': value = 'Y'; break;
					case 'loginType': value = '0'; break;
					case 'isRegPattern': value = false; break;
					case 'isRegSimplePassword': value = false; break;
					case 'isRegFingerprint': value = false; break;
					default : value = M.data.storage(key); break;
				}
				return value;
			} else {
				return M.data.storage(key);
			}
		}
		
		/** 
		 *	스토리지 변수 제거  
		 */
		function removeStorage(key) {
			return M.data.removeGlobal(key);
		}
			
		
		//----- assign ------------------
		return {
			storageKeys : storageKeys,
			setStorage : setStorage,
			getStorage : getStorage,
			removeStorage : removeStorage
		};
	})(window.Dcore)
);