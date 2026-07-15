var progressBarUtil = (function($, D) {
	
	function progressBar(cur, total) {
		var percent = (cur / total) * 100;
		
		 document.querySelector('.d-progress-bar::after') || 
	     document.querySelector('.d-progress-bar').style.setProperty('--progress', percent + '%');
		 
	     var style = document.createElement('style');
	     style.innerHTML = '.d-progress-bar::after { width: ' + percent + '% !important; }';
	     
	     var oldStyle = document.getElementById('progress-style');
	     if (oldStyle) {
	         oldStyle.remove();
	     }
	     
	     style.id = 'progress-style';
	     document.head.appendChild(style);
	}

    return {
    	progressBar: progressBar
    };

})(jQuery, window.Dcore);
