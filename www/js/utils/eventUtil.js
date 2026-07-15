/*******************************************************************************
 * Function List
 *******************************************************************************
 *
 *	infiniteScroll	: 무한 스크롤
 * 	
 ******************************************************************************/


var eventUtil = (function($, D){
	
	/**
	 * 무한 스크롤
	 */
	function infiniteScroll(id, callback) {
		var el = $('#' + id); 
		
		el.scroll(function() {
			var maxHeight = el.prop('scrollHeight');
//			var st = el.scrollTop();
//			var h = el.height();
			var currentScroll = el.scrollTop() + el.height();
			
//			D.logger.debug('maxHeight :: ', maxHeight);
//			D.logger.debug('scrollTop :: ', st);
//			D.logger.debug('height :: ', h);			
//			D.logger.debug('currentScroll :: ', currentScroll);
			
			if (maxHeight <= currentScroll + 30) {
				if (typeof(callback) == 'function') callback(maxHeight, currentScroll);
			}
		});
	}
	
	return {
		infiniteScroll : infiniteScroll
	}

})(jQuery, window.Dcore);