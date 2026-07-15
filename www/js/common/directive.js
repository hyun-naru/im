(function($, D) {
	
	/** 
	 *	화면 로드 완료 후 공통 실행
	 */
	D.onReady(function(){
		// <input> 값 변경시 3자리마다 콤마 넣기
		$(document).on('blur', '[addComma]', function() {
			var value = $(this).val();
			if (value != undefined && value != '') {
				value = value.replace(/[^(0-9)]/g, '');
				var parts = value.split('.');
				$(this).val(parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? '.'+parts[1] : ''));
			}

		}).on('focus', '[addComma]', function() {
			var value = $(this).val();
			if (value != undefined) {
				//$(this).val(value.replace(/\,/g, ''));

				var len = value.length * 2;
				var input = $(this);
				setTimeout(function() {  // 커서를 text 마지막에 놓기위함
					//input[0].setSelectionRange(len, len);
					input.val(value.replace(/\,/g, ''))
				}, 1)
			}
		
		//tooltip show/hide 
		}).on('click', 'button[tooltip]', function() {
			//버튼과 해당 툴팁div는 data-name가 같아야 한다.
			var name = $(this).data('name');
			var isVisible = $('div[tooltip][data-name='+name+']').is(':visible');

			$('div[tooltip]').addClass('none');
			if (!isVisible) {
				$('div[tooltip][data-name='+name+']').removeClass('none');
			}

		// <input> 값 변경시 휴대전화 포맷
		}).on('blur', '[phone]', function() {
			var value = $(this).val();
			if (value != undefined && value != '') {
				value = value.replace(/-/g, '');
				$(this).val(value.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3'));
			}

		}).on('focus', '[phone]', function() {
			var value = $(this).val();
			if (value != undefined) {
				$(this).val(value.replace(/-/g, ''));
			}
		
		// <input> 숫자만 입력
		}).on('blur', '[number]', function() {
			var value = $(this).val();
			$(this).val( value.replace(/[^(0-9)]/g, '') );

		
		// <input> 날짜만 입력
		}).on('blur', '[date]', function() {
			var value = $(this).val();
			if (value != '') {
				value = value.replace(/[^(0-9)]/g, '');
				value = dateUtil.isDate(value) ? dateUtil.setFmDate(value) : '';
				
				$(this).val(value);
				$('[type=date][data-name='+ $(this).data('name')+']').val(value);
			}

		}).on('focus', '[date]', function() {
			var value = $(this).val();
			if (value != '') {
				$(this).val(value.replace(/\-/g, ''));
			}
		
		}).on('change', '[type=date]', function() {
			var value = $(this).val();
			$('[date][data-name='+ $(this).data('name')+']').val(value);
		
		//<input> 년월만 입력
		}).on('blur', '[month]', function() {
			var value = $(this).val();
			if (value != '') {
				value = value.replace(/[^(0-9)]/g, '');
				value = dateUtil.isDate6(value) ? dateUtil.setFmDate(value) : '';
				
				$(this).val(value);
				$('[type=month][data-name='+ $(this).data('name')+']').val(value);
			}

		}).on('focus', '[month]', function() {
			var value = $(this).val();
			if (value != '') {
				$(this).val(value.replace(/\-/g, ''));
			}
		
		}).on('change', '[type=month]', function() {
			var value = $(this).val();
			$('[month][data-name='+ $(this).data('name')+']').val(value);
		});
	});
		

})(jQuery, window.Dcore);