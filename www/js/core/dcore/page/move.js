/******************************************************
 *  화면ID 	: 
 *  설명 	: 페이지 이동
 *  			- DLite앱은 M.page.html() 적용
 *  
 *  			- 페이지 스택정보 가져오기, Native 페이지로 이동
 *  			- 화면이동, 이전 화면에서 보낸 파라미터 가져오기
 *  			- 뒤로가기, 페이지 삭제, 페이지 replace
 *  			- 앱 종료
 *  작성자 	: jhKo
 *  작성일	: 2018-01-10
 *  변경로그 : 
 ******************************************************/

window.Dcore.extend('move',
	(function ($, D) {
		//----- variable declaration ----
		var VIEW_ROOT_PATH = '/www/html/view';	// __config__
		
		//----- execution code ----------
		D.logger.info('move.js');
		
		//----- function definition -----
		/** 
		 *	페이지 스택 정보
		 *	@param index : 가져오려는 스택 index (값이 없을 경우 모든 스택 정보를 가져옴)
		 *	@return array : 페이지 스택 정보
		 */
		function stack(index) {
			return M.info.stack(index);			
		}
		
		/** 
		 *	Native 페이지로 이동
		 *	@param options : 설정값
		 */
		function activity(options) {
			M.page.activity(options);
		}
		
		/** 
		 *	WebView 페이지로 이동
		 *	@param options : 설정값
		 */
		function webview(options) {
			var def = $.Deferred();

			if(M.navigator.os('android')) D.move.activity(options);
			else if(M.navigator.os('ios')) M.execute('exWebViewCall', options.param);
			else dialog.alert('앱에서 동작 하는 기능 입니다.')
				.then(function() {
					def.resolve();
				});

			// 웹뷰종료 후 호출되는 콜백
			window.__callback__onWebViewExit = function(aResult) {
				def.resolve(aResult)
			};
			return def.promise();
		}
		
		/** 
		 *	화면(페이지) 이동
		 *	@param options : 설정값 (모피어스 api 문서 참고)
		 */
		function next(options) {
			doMcorePageHtml(options);
		}
		
		
		/** 
		 *	Mcore.page.html 실행
		 */
		function doMcorePageHtml(options) {
			if ($.type(options) == 'object' && options.url) {
				
				// 안드로이드 4.4 이하 webView에서 startsWith 함수를 사용 못함
				// __config__
//				if (!options.url.startsWith('/www')	
//						&& !options.url.startsWith('www')
//						&& !options.url.startsWith('http')) {
//					
//					if (options.url.startsWith('/')) {
//						options.url = VIEW_ROOT_PATH + options.url;
//					} else {
//						options.url = VIEW_ROOT_PATH + '/' + options.url;
//					}
//				}
				
				// __config__
				if (!_startsWith(options.url, '/www')
					&& !_startsWith(options.url, 'www')
					&& !_startsWith(options.url, 'http')) {
			
					if (_startsWith(options.url, '/')) {
						options.url = VIEW_ROOT_PATH + options.url;
					} else {
						options.url = VIEW_ROOT_PATH + '/' + options.url;
					}
				}
				
				// stack 지우기
				if (options.isRemoveStack == true) {
					var optParam = {};
					
					if (options.param) optParam = options.param;
					if (options.params) optParam = options.params;
					if (options.parameter) optParam = options.parameter;
					if (options.parameters) optParam = options.parameters;
					
					optParam['isRemoveStack'] = true;
					options.param = optParam;
				}
			}
			
			M.page.html(options);
		}
		
		
		/** 
		 *	이전 화면에서 보낸 파라미터를 가져온다
		 */
		function getParam(key) {
			return M.data.param(key);
		}
		
		
		/** 
		 *	화면(페이지) 뒤로 이동
		 *	@param options :
		 *					{
		 *						param(string or object): 전달 파라메타
		 *						animation(Animation Type): Animation Type, default- 'DEFAULT'
		 *					}
		 *					
		 */
		function back(options) {
			M.page.back(options);
		}
		
		/** 
		 *	페이지 삭제
		 *	@param url : 삭제할 page 위치값
		 */
		function remove(url) {
			M.page.remove(url);
		}
		
		/** 
		 *	페이지 replace
		 *	@param options : {
		 *						url(string): 이동할 page 위치값
		 *						param(string or object): 전달 파라메타
		 *					}
		 */
		function replace(options) {
			M.page.replace(options);
		}
		
		/** 
		 *	앱 종료
		 */
		function exit() {
			if (M.navigator.os('android')) {
				M.execute('exWNStopNOSLink');	// 백신 중지
			}
			
			M.sys.exit();
		}
		
		/** 
		 *	뒤로가기 버튼 재정의
		 */
		function backDefine(callback) {
			try{
				var interval = setInterval(function() {
					if ($('#__header_back_btn__')[0].onclick) {
						clearInterval(interval);
						interval = null;
						$('#__header_back_btn__')[0].onclick = null;
						
						if (typeof(callback) == 'function') {
							$('#__header_back_btn__').off('click').on('click', callback);
						}
					}
				}, 100);
			} catch(e) {
				dialog.alert('backDefine error' + JSON.stringify(e));
			}
		}
		
		
		function _startsWith(oriStr, comStr) {
			try {
				var len = comStr.length;
				if (oriStr.substring(0, len) == comStr) return true;
				else return false;
			} catch(e) {
				return false;
			}
		}
		
		function pdf(url, title) {
			var def = $.Deferred();

			M.execute("exWNPdfViewCall", {
				title: title,
				url: url,
				callback: D.response(function() {
					def.resolve();
				})
			});
			
			return def.promise();
		}

		//----- assign ------------------
		return {
			pdf: pdf,
			stack : stack,
			activity : activity,
			webview: webview,
			next : next,
			getParam : getParam,
			back : back,
			remove : remove,
			replace : replace,
			exit : exit,
			backDefine : backDefine
		};
	})(jQuery, window.Dcore)
);