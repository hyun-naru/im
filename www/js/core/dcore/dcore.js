/******************************************************
 *  화면ID 	: 
 *  설명 	: - Mcore를 wraaping한 Dcore
 *				- DLite앱(웹,앱)과 MCC앱에서 공통으로 사용할 Dcore
 *  작성자 	: jhKo
 *  작성일	: 2018-01-10
 *  변경로그 : 
 ******************************************************/

(function (w) {
	
	var D = function() {
		return D.fn.init.apply(D.fn, arguments);
	};
	
	D.prototype = D.fn = {
		isApp : false,
		isLocal: false,

		init : function() {
			this.checkIsApp();
			return this;
		},
		
		checkIsApp : function() {
			try {
				this.isApp = M.info.device('os.name') == 'pc' ? false : true;
				this.isLocal = !this.isApp;
			} catch(e) {
				this.isApp = false;
				this.isLocal = !this.isApp;
			}
		},
		
		extend : function(fnName, obj) {
//			if (this[fnName]) {
//				var msg = '개발자 debug!\n Dcore에 이미 "'+ fnName +'"가 정의 되어있습니다. 다른 이름을 사용하세요.';
//				if (this.isApp) M.pop.alert(msg, {button : ['확인']});
//				else alert(msg);
//				
//				return;
//			}
			
			this[fnName] = obj;
		},
		
		execute: function(method, param) { M.execute(method, param) },

		response: function(callback) {
			var gid = M.response.groupID();
			M.response[gid] = callback;
			return 'M.response.' + gid;
		},

		isAppWithNotice: function() {
			if (!this.isApp) {
				return alert('이 기능은 앱에서만 지원합니다.');
			}
		}
	};
	
	w.Dcore = D();
	
	
})(window);