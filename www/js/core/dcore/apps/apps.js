/******************************************************
 *  화면ID 	: 
 *  설명 	: 앱간 연동 관련 wrapping
 *  			- 앱 실행, 스토어 열기, 새 브라우저 띄우기
 *  			- 앱 정보 반환, 앱 설치 (In-House 배포용)
 *  			- 
 *  작성자 	: jhKo
 *  작성일	: 2018-01-10
 *  변경로그 : 
 ******************************************************/

window.Dcore.extend('apps',
	(function (D) {
		//----- variable declaration ----
		
		
		//----- execution code ----------
		D.logger.info('apps.js');
		
		
		//----- function definition -----
		
		/** 
		 *	앱 실행
		 *	@param scheme : 호출할 앱의 고유 scheme scheme ex) android:'com.domain.app', ios:'scheme://'
		 *	@param param : 
		 */
		function open(scheme, param) {
			if (!D.isApp) return;
			
			return M.apps.open(scheme, param);
		}
		
		/** 
		 *	스토어 열기
		 *	@param identifier : store 에서의 앱 고유값 ex) android:'com.uracle.wellness', ios:'1049605425'
		 */
		function store(identifier) {
			if (!D.isApp) return;
			
			M.apps.store(identifier);
		}
		
		
		/** 
		 *	새 브라우저 띄우기
		 *	@param url : 경로
		 *	@param encoding : 'EUC-KR', 'UTF-8' 지원
		 */
		function browser(url, encoding) {
			if (D.isApp) M.apps.browser(url, encoding || 'UTF-8');
			else window.open(url);
		}
		
		/** 
		 *	앱 정보 반환
		 *	@param packageName : 호출할 앱의 고유 scheme ex) android:'com.domain.app', ios:'scheme://'
		 *	@return object
		 *		{
		 *			installed : boolean 	// 설치 여부
		 *			version : string 		// 버전(android only)
		 *			name : string 			// 이름(android only)
		 *			display_name : string 	// display name(android only)
		 *		}
		 */
		function info(packageName) {
			if (!D.isApp) return;
			
			return M.apps.info(packageName);
		}
		
		/** 
		 *	앱 설치 (In-House 배포용)
		 *	@param url : 앱 url
		 *	@param name : 앱 이름
		 */
		function install(url, name) {
			if (!D.isApp) return;
			
			M.apps.install(url, name);
		}

		
		/** 
		 *	금융결제원 바이오인증 앱 설치 여부 확인
		 */
		function installedBioApp() {
			if (!D.isApp) return;
			
			var installed;
			
			if (M.navigator.os('ios')) {
				var yesNo = M.execute('exWNFIDOAppInstallCheck');
				installed = yesNo == 'YES' ? true : false;
				
			} else {
				installed = M.apps.info('org.kftc.fido.lnk.lnk_app').installed;
			}

			return installed;
		}
		
		/** 
		 *	금융결제원 바이오인증 앱 스토어 열기
		 */
		function storeBioApp() {
			if (!D.isApp) return;
			
			var identifier = M.navigator.os('ios') ? '1189411033' : 'org.kftc.fido.lnk.lnk_app';
			store(identifier);
		}
		
		/** 
		 *	모바일 고객창구 앱 설치 여부 확인
		 */
		function installedMccApp() {
			if (!D.isApp) return;
			
			var packageName = M.navigator.os('ios') ? 'dgbMcenter' : 'com.dgbfnlife.mcc';
			return M.apps.info(packageName).installed;
		}
		
		/** 
		 *	모바일 고객창구 앱 스토어 열기
		 */
		function storeMccApp() {
			if (!D.isApp) return;
			
			//TODO:
			var identifier = M.navigator.os('ios') ? '1417024199' : 'com.dgbfnlife.mcc';
			store(identifier);
		}
		
		
		//----- assign ------------------
		return {
			browser : browser,
			info : info,
			install : install,
			installedBioApp : installedBioApp,
			storeBioApp : storeBioApp,
			installedMccApp : installedMccApp,
			storeMccApp : storeMccApp
		};
	})(window.Dcore)
);