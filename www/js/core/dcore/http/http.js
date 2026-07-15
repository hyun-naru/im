/******************************************************
 *  화면ID 	: 
 *  설명 	: http 통신 기능 제공 wrapping
 *  			- DLite앱은 M.net.http.send() 적용
 *  			- MCC앱은 jQuery ajax 적용
 *  작성자 	: jhKo
 *  작성일	: 2018-01-11
 *  변경로그 : 
 ******************************************************/

window.Dcore.extend('http',
	(function ($, D) {
		//----- variable declaration ----
		var config;
		var queue = null;
		var isSending = false;
		
		//----- execution code ----------
		D.logger.info('http.js');

				
		//----- function definition -----
		/** 
		 *  보장분석 서버 주소 가져오기
		 */
		function getServerDlc() {
			if (!config) config = D.global.getConfigInfo();
			
			// __config__
			if (config.serverMode == 'dev') {
				return config.devDlc;
			} else if (config.serverMode == 'prod') {
				return config.prodDlc;
			} else {
				return config.localDlc;
			}
		}
		
		/** 
		 *  서버 주소(Origin) 가져오기
		 */
		function getServerOrigin() {
			if (!config) config = D.global.getConfigInfo();
			
			// __config__
			if (config.serverMode == 'dev') {
				return config.devOrigin;
			} else if (config.serverMode == 'prod') {
				return config.prodOrigin;
			} else {
				return config.localOrigin;
			}
		}
		
		/** 
		 *  서버 이름(serverName) 가져오기
		 */
		function getServerName() {
			if (!config) config = D.global.getConfigInfo();
			
			// __config__
			if (config.serverMode == 'dev') {
				return config.devServerName;
			} else if (config.serverMode == 'prod') {
				return config.prodServerName;
			} else {
				return config.localServerName;
			}
		}
		
		/** 
		 *  M.net.http.send() 실행 - async
		 */
		function doMcoreNetHttpSendByAsync(_deferred, url, data, method, noLoadingImg, type) {
			if (!noLoadingImg && window.dialog && !window.dialog.isHandLoading) {
				window.dialog.loading(true);	// 로딩 이미지 보여주기
			}
			
			var deferred = _deferred == null ? $.Deferred() : _deferred;
			
			D.logger.debug('====== Mcore.net.http.send request ======')
			D.logger.debug('server name :: ', getServerName());
			D.logger.debug('url :: ', url);
			D.logger.debug('data :: ', data);
			D.logger.debug('========================================');
			
			try {
				M.net.http.send({
					server		: getServerName(),
				    path		: url,
				    method		: method,
				    timeout		: 900000,	// 15분
				    dummy		: false,
					secure		: false,
					cancelable	: false,
					indicator	: {show: false},
				    data		: data,
				    onSuccess	: function(recevedData, setting) {
				    	var httpHeader, allBody, body;
				    	
				    	if (recevedData) {
				    		httpHeader = recevedData.httpHeader;
				    		allBody = recevedData.allBody;
				    	}
				    	
				    	if (allBody) {
				    		body = allBody.body;
				    	}
				    	
				    	D.logger.debug('====== Mcore.net.http.send response ======');
//				    	D.logger.debug('response recevedData :: ', recevedData);
				    	D.logger.debug('response data :: ', body);
						D.logger.debug('========================================');
						
						if (window.dialog && !window.dialog.isHandLoading) {
							window.dialog.loading(false);	// 로딩 이미지 숨기기
						}
						
						// csrf 토큰 없을 경우
						if (body && body.errorCode == '403') {
							dialog.alert('잘못된 접근입니다.<br/>[There is no token.]')
							.then(function() {
								D.move.exit();
							});
						}
						// 세션 만료 처리
						else if (body && body.errorCode == '440') {
							doWhenSessionTimeout(deferred, url, data, method, noLoadingImg, 'doMcoreNetHttpSendByAsync');
						}
						// 중복로그인
						else if (body && body.errorCode == '401') {
							dialog.alert('다른 기기에서 로그인 되었습니다. 로그아웃 됩니다.')
							.then(function() {
								ajax('/ma/logout')
								.then(function(result){
									D.logger.debug('logout : ', result);
									D.move.exit();
								});
							});
						}
						else {
							if (type == 'token') {
								deferred.resolve(httpHeader['X-CSRF-TOKEN']);
							} else {
								deferred.resolve(body);
							}
						}
				    },
				    onError		: function(errorCode, errorMessage, setting) {
				    	if (!noLoadingImg && window.dialog) window.dialog.loading(false);	// 로딩 이미지 숨기기
				    	
				    	D.logger.debug('====== Mcore.net.http.send error ======');
						D.logger.debug('errorCode :: ', errorCode);
						D.logger.debug('errorMessage :: ', errorMessage);
						D.logger.debug('========================================');
										    	
						if (type != 'statisticalLog') {
							M.pop.alert({
					        	message: "통신 오류 발생했습니다. 잠시후 다시 시도하세요.",
					        	buttons: ['확인'],
					        	callback: function(index) {
						        	deferred.reject(errorMessage);
					        	}
					        });
						}
				    }
				});
			} catch(e) {
				if (window.dialog) window.dialog.loading(false);	// 로딩 이미지 숨기기
		    		    	
				D.logger.error('http try catch! :: ', e);
		    	
				if (type != 'statisticalLog') {
					M.pop.alert({
			        	message: "통신 오류 발생했습니다. 잠시후 다시 시도하세요.",
			        	buttons: ['확인'],
			        	callback: function(index) {
				        	deferred.reject(e);
			        	}
			        });
				}
			}
			
			return deferred.promise();
		}
		
		
		
		/** 
		 *  M.net.http.send() 실행 - sync(queue 이용)
		 */
//		function doMcoreNetHttpSendBySync(url, data, method, noLoadingImg, type) {
//			if (!noLoadingImg && window.dialog) window.dialog.loading(true);	// 로딩 이미지 보여주기
//			
//			var deferred = $.Deferred()
//			
//			var dataInfo = {
//					id : new Date().getTime(),
//					deferred : deferred,
//					url : url,
//					data : data,
//					method : method,
//					noLoadingImg : noLoadingImg,
//					type : type
//			};
//			
//			if (queue) {
//				queue = new Queue();
//			}
//			
//			if (type == 'token') {
//				queue.enqueueFirst(dataInfo);	// 큐의 가장 앞에 담기
//			} else {
//				queue.enqueue(dataInfo);	// 큐에 담기
//			}
//			
//			if (!isSending)	send();		// 통신 중이 아닐때만 호출
//			
//			return deferred.promise();
//		}
		
		/** 
		 *  통신 하기
		 */
//		function send() {
//			if (queue.isEmpty()) {
//				if (window.dialog) window.dialog.loading(false);	// 로딩 이미지 숨기기
//				isSending = false;
//				return;
//			}
//			
//			isSending = true;
//			var dataInfo = queue.dequeue();
//			
//			D.logger.debug('====== Mcore.net.http.send request ======')
//			D.logger.debug('id :: ', dataInfo.id);
//			D.logger.debug('server name :: ', getServerName());
//			D.logger.debug('url :: ', dataInfo.url);
//			D.logger.debug('data :: ', dataInfo.data);
//			D.logger.debug('========================================');
//			
//			try {
//				M.net.http.send({
//					server		: getServerName(),
//				    path		: dataInfo.url,
//				    method		: dataInfo.method,
//				    timeout		: 300000,	// 5분
//				    dummy		: false,
//					secure		: false,
//					cancelable	: false,
//					indicator	: {show: false},
//				    data		: dataInfo.data,
//				    onSuccess	: function(recevedData, setting) {
//				    	var httpHeader, allBody, body;
//				    	
//				    	if (recevedData) {
//				    		httpHeader = recevedData.httpHeader;
//				    		allBody = recevedData.allBody;
//				    	}
//				    	
//				    	if (allBody) {
//				    		body = allBody.body;
//				    	}
//				    	D.logger.debug('====== Mcore.net.http.send response ======');
//				    	D.logger.debug('id :: ', dataInfo.id);
////				    	D.logger.debug('response recevedData :: ', recevedData);
//				    	D.logger.debug('response data :: ', body);
//						D.logger.debug('========================================');
//				    	
//				    	// 세션 만료 처리 
//						if (body && body.errorCode == '440') {
//							doWhenSessionTimeout(dataInfo.deferred, url, data, method, noLoadingImg, 'send');
//						} else {
//							if (type == 'token') {
//								dataInfo.deferred.resolve(httpHeader['X-CSRF-TOKEN']);
//							} else {
//								dataInfo.deferred.resolve(body);
//							}
//							
//							send();
//						}
//				    },
//				    onError		: function(errorCode, errorMessage, setting) {
//				    	D.logger.debug('====== Mcore.net.http.send error ======');
//				    	D.logger.debug('id :: ', dataInfo.id);
//				    	D.logger.debug('errorCode :: ', errorCode);
//						D.logger.debug('errorMessage :: ', errorMessage);
//						D.logger.debug('========================================');
//				    	
//						if (dataInfo.type != 'statisticalLog') {
//							M.pop.alert({
//					        	message: "통신 오류 발생했습니다. 잠시후 다시 시도하세요.",
//					        	buttons: ['확인'],
//					        	callback: function(index) {
//					        		dataInfo.errorCode = errorCode;
//						        	dataInfo.errorMessage = errorMessage;
//						        	dataInfo.deferred.reject(dataInfo);
//					        	}
//					        });
//						}
//				        
//				        send();
//				    }
//				});
//			}catch(e) {
//				D.logger.error('http send error! :: ', e);
//				M.pop.alert({
//		        	message: "통신 오류 발생했습니다. 잠시후 다시 시도하세요.",
//		        	buttons: ['확인'],
//		        	callback: function(index) {
//		        		dataInfo.errorCode = '-9999';
//			        	dataInfo.errorMessage = e;
//			        	dataInfo.deferred.reject(dataInfo);
//		        	}
//		        });
//			}
//		}
		
		/** 
		 *	440 에러시 (session 만료시)
		 *	- 로그인 되어 있었던 상황이면 : csrf token 다시 받아와서 메세지 처리 후 로그인 화면으로 이동
		 *	- 미로그인 되어 있었던 상황이면 : csrf token 다시 받아와서 기존 프로세스 재실행 
		 */
		function doWhenSessionTimeout(deferred, url, data, method, noLoadingImg, recallFnName) {
			// 로그인 여부 확인
			var isLogin = true;
			var userInfo = D.global.getUserInfo();
			if (userInfo == null || userInfo == undefined || userInfo == '') {
				isLogin = false; 
			}
			
			getCsrfToken()
			.then(function(result) {
				if (result == true) {
					
					if (isLogin == true) {
						D.global.setUserInfo(null);	// userInfo 삭제
						deferred.reject();
						
						var loginType = D.storage.getStorage(D.storage.storageKeys.loginType);
						var nextPage = '/ma/MA-0040E.html';
						
//						switch(loginType) {
//							// 패턴 인증
//							case '1': nextPage = '/ma/MA-0060E.html'; break;
//							// 간편비밀번호 인증
//							case '2': nextPage = '/ma/MA-0080E.html'; break;
//							// 지문 인증
//							case '3': nextPage = '/ma/MA-0100E.html'; break;
//							// id/pw 인증
//							case '0': 
//							default:
//								nextPage = '/ma/MA-0040E.html'; break;
//							break;
//						}
						
						//var timeOutMsg = '세션이 만료되었습니다. 다시 로그인 하세요.';
						var timeOutMsg = '장시간 사용하지 않아 종료 됩니다. 다시 실행 하세요.';
						window.dialog.alert(timeOutMsg)
						.then(function() {
							M.sys.exit();
//							D.move.next({
//								url : nextPage,	// 로그인 페이지로 이동
//								action: "CLEAR_TOP"	
//							});
						});
						
					} else {
						if (recallFnName == 'doMcoreNetHttpSendByAsync') {
							doMcoreNetHttpSendByAsync(deferred, url, data, method, noLoadingImg);
						} else if(recallFnName == 'send') {
							send(deferred, url, data, method, noLoadingImg);
						}
					}
					
				} else {
					var errorMsg = '통신중 오류가 발생했습니다. 다시 시도 하세요.';
					window.dialog.alert(errorMsg);
				}
			});
		}
		
		
		/** 
		 *	get csrf token
		 */
		function getCsrfToken() {
			var deferred = $.Deferred(); 
			
			ajaxForGetToken()
			.then(function(token) {
				D.global.setCsrfToken(token);	// global에 저장
				deferred.resolve(true);
			})
			.fail(function() {
				deferred.resolve(false);
			});
			
			return deferred;
		}
		
		
		/** 
		 *  gw call
		 */
		function ajax(url, data, noLoadingImg, type) {
			if (_startsWith(url, '/')) url = '/gw/api' + url; 
			else url = '/gw/api/' + url;
			
			return doMcoreNetHttpSendByAsync(null, url, data, 'POST', noLoadingImg, type);
		}
		
		/** 
		 *  gw call , method : get
		 */
		function ajaxGet(url, data, noLoadingImg) {
			if (_startsWith(url, '/')) url = '/gw/api' + url;
			else url = '/gw/api/' + url;
			
			return doMcoreNetHttpSendByAsync(null, url, data, 'GET', noLoadingImg);
		}
		
		/** 
		 *  web call
		 */
		function ajaxForWeb(url, data, noLoadingImg) {
			if (!_startsWith(url, '/')) url = '/' + url; 
			
			return doMcoreNetHttpSendByAsync(null, url, data, 'POST', noLoadingImg);
		}
		
		/** 
		 *  login call
		 */
		function ajaxForLogin(url, data, noLoadingImg) {
			return doMcoreNetHttpSendByAsync(null, url, data, 'POST', noLoadingImg);
		}
		
		/** 
		 *  get csrf token call
		 */
		function ajaxForGetToken() {
			return doMcoreNetHttpSendByAsync(null, '/gw/csrfToken', {}, 'GET', null, 'token');
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

		function upload(args) {
			if(!Array.isArray(args)) return dialog.alert('잘못된 접근입니다.<br/>[arguments is not array]');

			window.dialog.loading(true);	// 로딩 이미지 보여주기
			return $.when
				.apply($, $.map(args, function(fileInfo) {
					return ajax('/common/storage/upload/data-url', fileInfo, true);
				}))
				.then(function() {
					window.dialog.loading(false);

					var result = {};
					result.results = $.map(arguments, function(ajaxResult) {
						if(ajaxResult.errorCode) {
							result.errorCode = ajaxResult.errorCode;
							result.errorMsg = ajaxResult.errorMsg;
						}
						return ajaxResult;
					});
					return result;
				});
		}

		/** 
		 *  싸인이미지 주소 가져오기
		 */
		function getSignUrl(param) {
			/*if (!config) config = D.global.getConfigInfo();
			if (config.serverMode == 'local') {
				return 'http://msmartdev.dgbfnlife.com/msmart/web/common/storage/image/get/' + param;
			}else {
				return getServerOrigin() + '/web/common/storage/image/get/' + param;
			}*/
			return param;
		}


		/** 
		 *  공지사항 PDF 다운로드 주소 가져오기
		 */
		function getPdfUrl(param) {
			return getServerOrigin() + '/web/getFile?KEY=' + param;
		}
		
		window.onerror = function(message, url, linenember) {
			
			ajax('/log/resource/error', {
				message: message + url + linenember,
				path:location.pathname,
				viewerId: location.pathname.split('/').pop()
			}, true);

		};
		
		//----- assign ------------------
		return {
			ajax : ajax,
			ajaxGet : ajaxGet,
			ajaxForWeb : ajaxForWeb,
			ajaxForLogin : ajaxForLogin,
			getCsrfToken : getCsrfToken,
			getServerOrigin : getServerOrigin,
			getServerDlc :getServerDlc,
			upload: upload,
			getSignUrl : getSignUrl,
			getPdfUrl : getPdfUrl
		};
	})(jQuery, window.Dcore)
);