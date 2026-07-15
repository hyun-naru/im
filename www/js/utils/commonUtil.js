/******************************************************
 *  화면ID 	: 
 *  설명 	: common util
 *  작성자 	: alkim
 *  작성일	: 2018-05-16
 *  변경로그 : 
 ******************************************************/


var commonUtil = (function($, D){

	/**
	 * overide javascript find function 
	 */
	if (!Array.prototype.find) {
		Array.prototype.find = function(fn) {
			if (typeof fn != 'function') return;
			var len = this.length;
		
			var obj;
			for (var i = 0; i < len; i ++) {
				if (fn.call(this, this[i])) {
					obj = this[i];
					break;
				}
			}
		
			return obj;
		}
	}

	/**
	 * overide javascript findIndex function 
	 */
	//if (!Array.prototype.findIndex) {
		Array.prototype.findIndex = function(fn) {
			if (typeof fn != 'function') return;
			var len = this.length;
		
			var idx = -1;
			for (var i = 0; i < len; i ++) {
				if (fn.call(this, this[i])) {
					idx = i;
					break;
				}
			}
		
			return idx;
		}
	//}

})(jQuery, window.Dcore);