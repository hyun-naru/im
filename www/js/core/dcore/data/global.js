/******************************************************
 *  화면ID 	: 
 *  설명 	: 전역변수 wrapping
 *  작성자 	: jhKo
 *  작성일	: 2018-01-10
 *  변경로그 : 
 ******************************************************/

window.Dcore.extend('global',
	(function (D) {
		//----- variable declaration ----
		var globalKeys = {
			CONFIG : '__config__',
			DATA : '__data__',
			USER : '__user__',
			TOKEN : 'CSRF_TOKEN'	// key 값 변경 하지 말것 (네이티브에서 이 키 값으로 꺼내서 씀)
		};
		
		//----- execution code ----------
		D.logger.info('global.js');
		
		
		//----- function definition -----
		/** 
		 *	글로벌 변수 저장  
		 */
		function setGlobal(key, value) {
			M.data.global(key, value);
		}
		
		/** 
		 *	글로벌 변수 가져오기  
		 */
		function getGlobal(key) {
			return M.data.global(key);
		}
		
		/** 
		 *	글로벌 변수 제거  
		 */
		function removeGlobal(key) {
			M.data.removeGlobal(key);
		}
		
		/** 
		 *	config 정보 저장 
		 */
		function setConfigInfo(value) {
			setGlobal(globalKeys.CONFIG, value);
		}
		
		/** 
		 *	config 정보 가져오기 
		 */
		function getConfigInfo() {
			return getGlobal(globalKeys.CONFIG);
		}
		
		/** 
		 *	업무에서 사용하는 글로벌 변수 저장 
		 */
		function setGlobalData(key, value) {
			var data = getGlobal(globalKeys.DATA);
			
			if (data) {
				data[key] = value;
			} else {
				data = {};
				data[key] = value;
			}
			
			setGlobal(globalKeys.DATA, data);
		}
		
		/** 
		 *	업무에서 사용하는 글로벌 변수 가져오기 
		 */
		function getGlobalData(key) {
			var data = getGlobal(globalKeys.DATA);
			
			if (data) {
				if (key == undefined) {
					return data;
				} else {
					return data[key];
				}
			} else {
				return undefined;
			}
		}
		
		/** 
		 *	업무에서 사용하는 글로벌 변수 제거 
		 */
		function removeGlobalData(key) {
			var data = getGlobal(globalKeys.DATA);
			
			if (data) {
				if (key == undefined || key == null) {
					//M.data.removeGlobal(globalKeys.DATA);
					setGlobal(globalKeys.DATA, null);
					return;
				}
				
				if (data[key] != undefined && data[key] != null) {
					data[key] = undefined;
					setGlobal(globalKeys.DATA, data);
					return;
				}
			}
		}
		
		/** 
		 *	로그인 user 정보 저장 
		 */
		function setUserInfo(value) {
			setGlobal(globalKeys.USER, value);
		}
		
		/** 
		 *	로그인 user 정보 가져오기 
		 */
		function getUserInfo(key) {
			var userInfo = getGlobal(globalKeys.USER);
			
			if (key) {
				return userInfo[key];
			} else {
				return userInfo;
			}
		}
		
		/** 
		 *	csrf token 저장 
		 */
		function setCsrfToken(value) {
			setGlobal(globalKeys.TOKEN, value);
		}
		
		/** 
		 *	csrf token 가져오기 
		 */
		function getCsrfToken() {
			return getGlobal(globalKeys.TOKEN);
		}
		
		
		//----- assign ------------------
		return {
			setConfigInfo : setConfigInfo, 
			getConfigInfo : getConfigInfo,
			setGlobalData : setGlobalData,
			getGlobalData : getGlobalData,
			removeGlobalData : removeGlobalData,
			setUserInfo : setUserInfo,
			getUserInfo : getUserInfo,
			setCsrfToken : setCsrfToken,
			getCsrfToken : getCsrfToken
			
		};
	})(window.Dcore)
);