var signUtil = (function($, D){
/******************************************************
 *  화면ID 	: 
 *  설명 	: 사인 패드 관련 유틸
 *  작성자 	: 강환성
 *  작성일	: 2020-08-06
 *  변경로그 : 
 ******************************************************/
/*******************************************************************************
 * Function List
 *******************************************************************************
 *	createPad: 사인 패드 생성
 *		clear: 사인 이미지 클리어
 *		isEmpty: 사인 여부 체크
 *		getData : 사인 이미지 데이터(base64) 반환
 *		setData : 사인 이미지 데이터(base64)를 컨버스에셋팅해줌
 *		upload: 사인 이미지 업로드
 ******************************************************************************/
return {
	createPad: createPad
};


function createPad(selector, imageData) {
	var _canvas = $(selector)[0];
	var _signaturePad;
	var resize = function() {
		var $parent = $(_canvas.parentElement);

		if (!_signaturePad || _signaturePad.isEmpty()) {
			_canvas.width = $parent.width();
			_canvas.height = $parent.height();
			return;
		}

		// 스트로크 데이터 백업
		var data = _signaturePad.toData();
		// 스트로크 데이터가 없는 경우(이미지로 복원된 서명) 캔버스 이미지 백업
		var dataURL = !data.length ? _canvas.toDataURL() : null;

		_canvas.width = $parent.width();
		_canvas.height = $parent.height();

		if (data.length) {
			_signaturePad.fromData(data);
		} else if (dataURL) {
			var image = new Image();
			image.onload = function() {
				_canvas.getContext('2d').drawImage(image, 0, 0);
				_signaturePad._isEmpty = false;
			};
			image.src = dataURL;
		}
	};
	$(window).resize(resize);
	loadScript().then(function() {
		resize();
		_signaturePad =  new SignaturePad(_canvas, {
			minWidth: 3,
			maxWidth: 3.5,
			penColor: "rgb(10, 10, 10)"
		});
		
		if(imageData){

			var image = new Image();
			image.onload = function(){
				_canvas.getContext('2d').drawImage(image,0,0);
				if(_signaturePad){
					_signaturePad._isEmpty = false;
				}
			}
			image.src = imageData;
		}
		
	});
	return {
		clear: clear,
		getData: getData,
		getSize: getSize,
		getSignatureSize: getSignatureSize,
		upload: upload,
		isEmpty: isEmpty,
		setData: setData
	};

	function clear() {
		_signaturePad.clear()
	}
	function isEmpty() {
		return _signaturePad.isEmpty();
	}
	function getData(width, height) {
		if(isEmpty()) return;

		var target = document.createElement('canvas');
		target.width = width || _canvas.width;
		target.height = height || _canvas.height;
		target.getContext('2d').drawImage(_canvas, 0, 0, target.width, target.height);

		return target.toDataURL();
	}

	function getSize(width, height) {
		var data = getData(width, height);
		if (!data) return 0;
		var base64 = data.split(',')[1];
		return Math.round(base64.length * 3 / 4);
	}

	function getSignatureSize() {
		if (isEmpty()) return 0;
		var data = _signaturePad.toData();
		var minX, minY, maxX, maxY;

		if (data.length) {
			// 스트로크 데이터가 있는 경우 좌표 기반 바운딩 박스
			minX = Infinity; minY = Infinity; maxX = -Infinity; maxY = -Infinity;
			for (var i = 0; i < data.length; i++) {
				for (var j = 0; j < data[i].length; j++) {
					var p = data[i][j];
					if (p.x < minX) minX = p.x;
					if (p.y < minY) minY = p.y;
					if (p.x > maxX) maxX = p.x;
					if (p.y > maxY) maxY = p.y;
				}
			}
			var pad = Math.ceil(_signaturePad.maxWidth);
			minX = Math.max(0, minX - pad);
			minY = Math.max(0, minY - pad);
			maxX = Math.min(_canvas.width, maxX + pad);
			maxY = Math.min(_canvas.height, maxY + pad);
		} else {
			// 이미지로 복원된 서명인 경우 픽셀 기반 바운딩 박스
			var ctx = _canvas.getContext('2d');
			var pixels = ctx.getImageData(0, 0, _canvas.width, _canvas.height).data;
			minX = _canvas.width; minY = _canvas.height; maxX = 0; maxY = 0;
			for (var y = 0; y < _canvas.height; y++) {
				for (var x = 0; x < _canvas.width; x++) {
					var alpha = pixels[(y * _canvas.width + x) * 4 + 3];
					if (alpha > 0) {
						if (x < minX) minX = x;
						if (y < minY) minY = y;
						if (x > maxX) maxX = x;
						if (y > maxY) maxY = y;
					}
				}
			}
			if (maxX < minX) return 0;
		}

		var w = maxX - minX;
		var h = maxY - minY;
		var target = document.createElement('canvas');
		target.width = w;
		target.height = h;
		target.getContext('2d').drawImage(_canvas, minX, minY, w, h, 0, 0, w, h);

		var base64 = target.toDataURL().split(',')[1];
		return Math.round(base64.length * 3 / 4);
	}

	function setData(imageData) {

		var image = new Image();
		image.onload = function(){
			_canvas.getContext('2d').drawImage(image,0,0);
			if(_signaturePad){
				_signaturePad._isEmpty = false;
			}
		}
		image.src = imageData;
	}
	
	function upload(dir, width, height) {
		if(isEmpty()) return dialog.alert('사인 후 이용해 주세요.'), false;
		if(getSignatureSize() <= 3500) return dialog.alert('서명이 작아 인식이 어렵습니다.<br>조금 더 크게 작성해주세요.'), false;
		
		return D.http.upload([{
			target: dir,
			group: 'signature',
			data: getData(width, height)
		}]);
	}
}
function loadScript() {
	var def = $.Deferred();
	
	if(window.SignaturePad) setTimeout(function() { def.resolve() });
	else _getScript('/js/libs/signature_pad.min.js').then(function() {
		def.resolve()
	});

	return def.promise();
}


})(jQuery, Dcore);