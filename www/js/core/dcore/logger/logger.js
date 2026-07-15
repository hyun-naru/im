/******************************************************
 *  화면ID 	: 
 *  설명 	: logger wrapping
 *  작성자 	: jhKo
 *  작성일	: 2018-01-10
 *  변경로그 : 
 ******************************************************/

window.Dcore.extend('logger',
	(function (D) {
		//----- variable declaration ----
		var ERROR = 0;
		var WARN = 1;
		var INFO = 2;
		var DEBUG = 3;
		var VERBOSE = 4;
		
		var logYn = null;
		
		//----- execution code ----------
		init();
		
		
		//----- function definition -----
		/** 
		 *  초기화
		 */
		function init() {
			if (D.isApp) {
				logYn = M.info.app('manifest').log;
			} else {
				// __config__
				var hostname = window.location.hostname; 
				if (/127.0.0.1/.test(hostname) || /localhost/.test(hostname)) logYn = 'y';
			}
		}
		
		/** 
		 *  로그 출력
		 */
		function log(msg, data, level, tag) {
			if (!logYn || (logYn.toLowerCase() != 'y')) return;
			
			var option = {
					level : level,
					tag : tag || ''
			}
			
			if (data === '__undefined__') {
				if (D.isApp) M.tool.log(msg, option);
				console.log(msg);
			} else {
				if (D.isApp) M.tool.log(msg, data, option);
				console.log(msg, data);
			}
		}
		
		/** 
		 *  로그 출력 : level - ERROR
		 */
		function error(msg, data, tag) {
			if (arguments.length == 1) data = '__undefined__';
			log(msg, data, ERROR, tag);
		}
		
		/** 
		 *  로그 출력 : level - WARN
		 */
		function warn(msg, data, tag) {
			if (arguments.length == 1) data = '__undefined__';
			log(msg, data, WARN, tag);
		}
		
		/** 
		 *  로그 출력 : level - INFO
		 */
		function info(msg, data, tag) {
			if (arguments.length == 1) data = '__undefined__';
			log(msg, data, INFO, tag);
		}
		
		/** 
		 *  로그 출력 : level - DEBUG
		 */
		function debug(msg, data, tag) {
			if (arguments.length == 1) data = '__undefined__';
			log(msg, data, DEBUG, tag);
		}
		
		/** 
		 *  로그 출력 : level - VERBOSE
		 */
		function verbose(msg, data, tag) {
			if (arguments.length == 1) data = '__undefined__';
			log(msg, data, VERBOSE, tag);
		}
		
		
		//----- assign ------------------
		return {
			error : error,
			warn : warn,
			info : info,
			debug : debug,
			verbose : verbose
		};
	})(window.Dcore)
);