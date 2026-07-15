

$(document).ready(function(){

	//리스트 토글
	$(".toggle-con").hide();
	$(".toggle-header").click(function(){ 
		$(this).parents(".toggle").find($(".title")).removeClass("on");
		$(this).parents(".toggle").find($(".btn-toggle")).removeClass("on");
		$("> .title",this).toggleClass("on");
		$("> .btn-toggle",this).toggleClass("on");
		$(this).parents(".toggle").find($(".toggle-con")).hide(); 
		$("+ .toggle-con",this).slideToggle();
	});
	$(".btn-toggle-all").click(function(){
		$(".toggle-con").hide();
		$(".toggle-con").show();
	}); 

	$(".btn-back").click(function(){
		history.back();
	}); 
	$(".btn-pop-close").click(function(){
		history.back();
	}); 
	$(".btn-close-side").click(function(){
		$('.side-menu-wrap').removeClass('open')
	}); 
//	$(".btn-view-side").click(function(){
//		location.href='../ma/MA-0161P.html';
//	}); 


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

	//고객상세>계약건수 버튼
	$(".cu-0020-layer").hide();
	$(".count").click(function(){
		/*if( $(this).hasClass("none")){ 
			$(this).removeClass("none");
			$(".cu-0020-layer").show();

		}else {
			$(this).addClass("none");
			$(".cu-0020-layer").hide();
		}*/
		$(".cu-0020-layer").show();
	}); 


	// Side Menu Show, Hide
	var $btnNavi = $('.btn-view-side'),
		$allMenu = $('.side-menu-wrap')
		$allMenubg = $('.side-menu-bg') ;
	
	$btnNavi.on('click', function(){
		//$allMenu.show(); 
		$('.side-menu-wrap').addClass('open')
	});
	$allMenubg.on('click', function(){
		// $allMenu.hide();
		$('.side-menu-wrap').removeClass('open')
	});

	// Side Menu Toggle
	$(".depth-1 > li > a").click(function(){
		$(".depth-1 li").removeClass("on")
		$(this).parent('li').toggleClass("on");
	});


}); 



