/******************************************************
 *  화면ID 	: 
 *  설명 	: 디바이스, 앱, 페이지 정보를 제공 wrapping
 *  작성자 	: jhKo
 *  작성일	: 2018-01-11
 *  변경로그 : 
 ******************************************************/

window.Dcore.extend('info',
	(function (D) {
		//----- variable declaration ----
		
		
		//----- execution code ----------
		D.logger.info('info.js');
		
		
		//----- function definition -----
		
		/** 
		 *	device 정보
		 *	@param keyPath : 가져오려는 정보의 키값
		 *	@return object : device 정보
		 */
		function device(keyPath) {
			if (!D.isApp) return;
			
			return M.info.device(keyPath);
		}
		
		/** 
		 *	app 정보
		 *	@param keyPath : 가져오려는 정보의 키값
		 *	@return object : app 정보
		 */
		function app(keyPath) {
			if (!D.isApp) return;
			
			return M.info.app(keyPath);
		}
		
		/** 
		 *	page 정보
		 *	@param keyPath : 가져오려는 정보의 키값
		 *	@return object : Page Event Object
		 */
		function page(keyPath) {
			if (!D.isApp) return;
			
			return M.page.info(keyPath);
		}
		
		
		//----- assign ------------------
		return {
			device : device,
			app : app,
			page : page
		};
	})(window.Dcore)
);