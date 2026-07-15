/******************************************************
 *  화면ID 	: 
 *  설명 	: 화면 상태에 따른 이벤트 wrapping
 *  작성자 	: jhKo
 *  작성일	: 2018-01-10
 *  변경로그 : 
 ******************************************************/

window.Dcore.extend('state',
	(function (D) {
		//----- variable declaration ----
		
		//----- execution code ----------
		D.logger.info('page.state.js');
		bind();
		
		
		//----- function definition -----
		/** 
		 *  이벤트 바인드 (짧게 사용하기위해)
		 */
		function bind() {
			D.onReady = onReady;
			D.onHide = onHide;
			D.onRestore = onRestore;
			D.onPause = onPause;
			D.onResume = onResume;
			D.onDestory = onDestory;
			D.onBack = onBack;
		}
				
		/** 
		 *  - 화면 로딩이 최종 완료시 한번만 호출
		 */
		function onReady(callback) {
//			callback();
			
			var count = 0;
			var interval = setInterval(function() {
//				D.logger.info('check dialog');
				count++;
				
				if (count > 50) {
					clearInterval(interval);
					interval = null;
					M.pop.alert({
			        	message: "파일 로드 실패했습니다. 다시 실행 하세요.",
			        	buttons: ['확인'],
			        	callback: function(index) {
			        		D.move.exit();
			        	}
			        });
					return;
				}
				
				if (window.dialog) {
					clearInterval(interval);
					interval = null;
					if (typeof(callback) == 'function') callback();
				}
			}, 100);
		}
		
		/** 
		 *	- 화면 이동 바로 전 현재 페이지에서 호출
		 *	 
		 */
		function onHide(callback) {
			M.onHide(callback);
		}
		
		/** 
		 *	- 해당 화면으로 다시 돌아왔을때 호출
		 *  - 히스토리 스택에 쌓여있는 페이지가 복원 될때
		 */
		function onRestore(callback) {
			M.onRestore(callback);
		}
		
		/** 
		 *	- 현재 앱이 Background 상태로 바뀔때 현재 화면에서 호출
		 */
		function onPause(callback) {
			M.onPause(callback);
		}
		
		/** 
		 *	- Background에서 다시 Foreground 상태로 바뀔때 현재 화면에서 호출
		 */
		function onResume(callback) {
			M.onResume(callback);
		}
		
		/** 
		 *	- 화면이 메모리에서 제거 될때
		 *	- 단, 앱의 종료시에는 호출되지 않음
		 */
		function onDestory(callback) {
			M.onDestory(callback);
		}
		
		/** 
		 *	- 단말기의 Back 키가 눌려졌을대 호출 (안드로이드 전용)
		 */
		function onBack(callback) {
			M.onBack(callback);
		}
		
		
		//----- assign ------------------
		return {
			onReady : onReady,
			onHide : onHide,
			onRestore : onRestore,
			onPause : onPause,
			onResume : onResume,
			onDestory : onDestory,
			onBack : onBack
		};
	})(window.Dcore)
);