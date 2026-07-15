

$(document).ready(function(){

	//리스트 토글
	//$(".toggle-con").hide(); 9.16 수정, 10.13 수정
	$(".toggle-header:not(.no-act)").click(function(){ 
		/* 2026 dcNew 삭제
		if( $(this).hasClass("on")){ 
			$(this).closest("li").find($(".toggle-header")).removeClass("on");
			$(this).closest("li").find($(".toggle-con")).hide(); 
			$(this).removeClass(" on");

		}else {
			$(this).closest("li").find($(".toggle-header")).removeClass("on");
			$(this).closest("li").find($(".toggle-con")).hide(); 

			$(this).addClass(" on");
			$("+ .toggle-con",this).slideToggle();
		} */
		/* 2026 dcNew 추가*/
		const $toggleContainer = $(this).closest(".toggle");
		const $toggleCon = $(this).next(".toggle-con");

		if ($(this).hasClass("on")) { 
			// 닫기 로직
			$toggleContainer.find(".toggle-header").removeClass("on");
			$toggleContainer.find(".toggle-con").slideUp();
			$(this).removeClass("on");
		} else {
			// 열기 로직
			$toggleContainer.find(".toggle-header").removeClass("on");
			$toggleContainer.find(".toggle-con").slideUp(); 

			$(this).addClass("on");
			$toggleCon.slideDown();
		}
		
	});



	//검색버튼 토글
	$(".search-toggle").click(function(){
		if( $(this).hasClass("on")){ 
			$(this).removeClass(" on");
			$("#toggle-con").hide();

		}else {
			$(this).addClass(" on");
			$("#toggle-con").show();
		}
	});


	// Side Menu Show, Hide
	var $btnNavi = $('.btn-view-side'),
		$allMenu = $('.side-menu-wrap'),
		$allMenubg = $('.side-menu-bg') ;
		$allMenubg = $('.btn-close-side') ;
	
	$btnNavi.on('click', function(){
		//$allMenu.show(); 
		$('.side-menu-wrap').addClass('open')
	});
	$allMenubg.on('click', function(){
		//$allMenu.hide();
		$('.side-menu-wrap').removeClass('open')
	});

	$(".depth-1 > li:first-child").addClass("on");
	// Side Menu Toggle
	$(".depth-1 > li > a").click(function(){
		$(".depth-1 li").removeClass("on")
		$(this).parent('li').toggleClass("on");
	});



	// Tab
	$(".tab-con").hide();
	$("#tab-con2").show();

	$(".tab li button").click(function() {
		$(".tab li").removeClass("on")
		$(this).parent('li').addClass("on");

		var test = $(this).data('in');
		$(this).parents($(".tab-wrap")).siblings().find($(".tab-con")).hide();
		$("#"+test).show();
	});


	//고객상세>계약건수 버튼
	$("#cu0020-btn").click(function(){

		if( $(".cu-0020-layer").hasClass("none")){ 
			$(".cu-0020-layer").removeClass(" none");
			var test = $(this).data('in');
			$("#"+test).removeClass("none");
		}else {
			$(".cu-0020-layer").addClass(" none");
			var test = $(this).data('in');
			$("#"+test).addClass("none");
		}
	}); 


	// layerOpen button
	$(".layerBtn").click(function() {
		$(".full-layer").removeClass("none");
		var test = $(this).data('in');
		$("#"+test).removeClass("none");
	});

	$(".layer-layerBtn").click(function() {
		if( $(".full-layer").hasClass("none")){ 
			$(".full-layer").removeClass(" none");
			var test = $(this).data('in');
			$("#"+test).removeClass("none");
		}else {
			$(".full-layer").addClass(" none");
			var test = $(this).data('in');
			$("#"+test).addClass("none");
		}
	});

/*	$(".dim-layer").click(function() {
		$(".dim-layer").addClass(" none");
		$(".dpop-layer").addClass(" none");
	});*/

	// 고객정보수정 radio button
	$(".radio-con2").hide();
	$(".radio-con1").show();
	//$(".dform label:first-child > input").attr("checked","checekd");  9.16 수정
	$("input[name$='have-con']").click(function() {
		var test = $(this).data('in');
		$(".radio-con").hide();
		$("."+test).show();
	});
}); 

//플로팅메뉴 2026 dcNew 수정
function openFloating(layerId) {
	// 인자로 받은 id 값을 찾아 none 클래스를 제거합니다.
	$('#' + layerId).removeClass('none');
}
function closeFloating(layerId) {
	// 인자로 받은 id 값을 찾아 none 클래스를 다시 추가합니다.
	$('#' + layerId).addClass('none');
}
  

/* 2026 dcNew 추가  */
document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================
       1. 아코디언 토글 기능 (.Up_btn)
       ========================================== */
    const upButtons = document.querySelectorAll('.GA-Advance-PaymentList .Up_btn');

    upButtons.forEach(button => {
        button.addEventListener('click', function() {
            const paymentList = this.closest('.GA-Advance-PaymentList');
            
            if (paymentList) {
                paymentList.classList.toggle('open');
                
                const isOpen = paymentList.classList.contains('open');
                this.setAttribute('aria-expanded', isOpen);
            }
        });
    });


    /* ==========================================
       2. 툴팁 열기/토글 기능 (.tooltip-btn)
       ========================================== */
    const tooltipButtons = document.querySelectorAll('.tooltip-wrap .tooltip-btn');

    tooltipButtons.forEach(button => {
        button.addEventListener('click', function() {
            const wrap = this.closest('.tooltip-wrap');
            
            if (wrap) {
                wrap.classList.toggle('open');
                
                const isOpen = wrap.classList.contains('open');
                this.setAttribute('aria-expanded', isOpen);
            }
        });
    });


    /* ==========================================
       3. 툴팁 팝업 레이어 내부 '닫기' 기능 (.btn-pop-close)
       ========================================== */
    const closeButtons = document.querySelectorAll('.tooltip-wrap .btn-pop-close');

    closeButtons.forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const wrap = this.closest('.tooltip-wrap');
            
            if (wrap) {
                wrap.classList.remove('open');
                
                // 닫힌 후 초점을 다시 열기 버튼으로 복귀 (웹접근성 케어)
                const openBtn = wrap.querySelector('.tooltip-btn');
                if (openBtn) {
                    openBtn.setAttribute('aria-expanded', 'false');
                    openBtn.focus();
                }
            }
        });
    });
});
