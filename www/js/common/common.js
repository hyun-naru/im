/** 
 *	js 로드
 *		- jQuery로 js 동적 로드시 캐싱이 안되게
 *			쿼리 스트링이 자동으로 붙는데 쿼리 스트링 안 붙게 처리함. 
 *        (이유는 쿼리 스트링이 붙으면 모피어스에서 파일을 로드 못함)
 */
function _getScript(url, parentId) {
	var deferred = jQuery.Deferred();
	
	var script = document.createElement('script');
	script.type = 'text/javascript';
		
	// 익스플로러
	if (script.readyState) {
		if (script.readyState == 'loaded' || script.readyState == 'complete') {
			script.onreadystatchange = null;
			deferred.resolve();
		}
	}
	// 그 외 브라우저
	else {
		script.onload = function() {
			deferred.resolve();
		}
	}
	
	script.src = getPath(url);
	if (parentId) {
		document.getElementById(parentId).appendChild(script);
	} else {
		document.body.appendChild(script);
	}
	
	return deferred;
	function getPath(url) {
		var root = '/res/www';
		return root + url.replace(root, '').replace(/^([^/])/, '/$1');
	}
}

var __isOnRestoreBindYn__ = 'N';

(function($, D) {
	/** 
	 *	안드로이드 뒤로가기 버튼 클릭시 처리
	 */
	var isAlreadyShowExitConfirm = false;
	M.onBack(function(e) {
		if (!isAlreadyShowExitConfirm) {
			// 팝업이 열려있을경우 팝업 닫기
			var isOpenPopup = false;
			$('[data-popup]').each(function() {
				if ($(this).css('display') == 'block') {
					isOpenPopup = true;
				}
			});
			if (isOpenPopup == true) {
				window.dialog.closePopup(null);
				return;
			}
			
//			var host = window.location.host;
//			if (!(/127.0.0.1/.test(host))) {
//				D.move.back();	// 뒤로가기
//				window.history.go(-1);
//				return;
//			}
			
			// 화면일 경우
			var pathname = window.location.pathname;
			if (pathname) {
				var filePath = (pathname.split('.')[0]).split('view')[1];
				D.logger.debug('뒤로가기 path : ', filePath);
				D.logger.debug('page stack : ', D.move.stack());
				
				if ((filePath && filePath.indexOf('MA-0010E') != -1) || (D.move.stack() && D.move.stack().length == 1)) {
					isAlreadyShowExitConfirm = true;
					window.dialog.confirm('앱을 종료하시겠습니까?')
					.then(function(value) {
						isAlreadyShowExitConfirm = false;
						if (value == window.dialog.YES) {
							D.move.exit();
						}
					});
				} else {
					var backBtn = $('#__header_back_btn__');
					if (backBtn.css('display') == 'block' || backBtn.css('display') == 'inline-block') {
						D.move.back();	// 뒤로가기
					}
				}
			} else {
				D.logger.error('url 없음');
			}
		}
	});
	
	
	/** 
	 *	화면 로드 완료 후 공통 실행
	 */
	var alreadyOnReady = false;
	M.onReady(function(){
		if (alreadyOnReady) return;
		
		alreadyOnReady = true;
		
		// 화면 스택 관리
		if (M.data.param('isRemoveStack') == true || M.data.param('isRemoveStack') == 'true') {
			var pageList = M.info.stack() || [];
			setTimeout(function() {
				for (i=1; i<pageList.length; i++) {
					M.page.remove(pageList[i].key);
				}
			}, 500);
		}
		
		var htmlRootPath = '/res/www/html/view';
		var jsRootPath = '/res/www/js/view';
		
		// meta config 정보 읽기
		var metaConfig = $('meta[name="config"]');
		var hasHeader = metaConfig.attr('hasHeader');	// header
		var hasProgressBar = metaConfig.attr('hasProgressBar');	// 프로그래스바
		var title = metaConfig.attr('title');	// 제목
		var isShowLogo = metaConfig.attr('isShowLogo');	// 로고
		var isShowCenterLogo = metaConfig.attr('isShowCenterLogo');	// 센터 로고
		var isShowBackBtn = metaConfig.attr('isShowBackBtn');	// 백 버튼
		var isShowLogoutBtn = metaConfig.attr('isShowLogoutBtn');	// 로그아웃버튼 버튼
		var isShowMyDataBtn = metaConfig.attr('isShowMyDataBtn');	// My자료 아이콘
		var isShowAllMenu = metaConfig.attr('isShowAllMenu');	// 전체메뉴 버튼
		var hasFooter = metaConfig.attr('hasFooter');	// footer

		var pathname = window.location.pathname;
		var viewerId = pathname.substring(pathname.lastIndexOf('/') + 1);
		
		// header 로드
		if (hasHeader === 'yes') {
			$('.d-wrap').prepend($('<header id="__header__"></header>'));
			$('#__header__').load(htmlRootPath + '/common/header/header.html', function(response, status, xhr){
				_getScript(jsRootPath + '/common/header/header.js', '__header__');
				
				if (title) {
					$('#__header_title__').html(title);
					$('#__header_title__').show();
				}
				
				if (isShowLogo == 'yes') {
					$('#__header_logo__').show();
				}
				
				if (isShowCenterLogo == 'yes') {
					$('#__header_center_logo__').show();
				}
				
				if (isShowBackBtn === 'yes') {
					$('#__header_back_btn__').show();
				}
				
				if (isShowLogoutBtn === 'yes') {
					$('#__header_logout_btn__').show();
				}
				
				if (isShowMyDataBtn === 'yes') {
					$('#__header_myData_btn__').show();
				}
				
				if (isShowAllMenu === 'yes') {
					// 전체메뉴 로드
					$('#__allMenu_wrap__').load(htmlRootPath + '/ma/MA-0161P.html', function(response, status, xhr) {
						$('#__header_allMenu_btn__').show();
						_getScript(jsRootPath + '/ma/MA-0161P.js', '__allMenu_wrap__');
					});
				}
				
				if (hasProgressBar === 'yes') {
					$('.d-head').addClass('d-progress-bar');
				}
			});
		}
				
		// footer 로드
		if (hasFooter === 'yes') {
			$('.d-wrap').append($('<footer id="__footer__"></footer>'));
			$('#__footer__').load(htmlRootPath + '/common/footer/footer.html', function(response, status, xhr) {
				_getScript(jsRootPath + '/common/footer/footer.js', '__footer__');
			});
		}
		
		// dialog 로드
		$('body').append($('<div id="__dialog_wrap__"></div>'));
		$('#__dialog_wrap__').load(htmlRootPath + '/common/dialog/dialog.html', function(response, status, xhr) {
			// LoadingSpinner Options
//			$("#loadingspinner").instance("LoadingSpinner", {
//				labelData: {
//					txt: "more",
//					loadingTxt: "좋은인생, 더 행복하도록 Do Good Better",
//					spinPoistion: "center",
//					isLabelHide: false
//				}
//			});
			
			_getScript(jsRootPath + '/common/dialog/dialog.js', '__dialog_wrap__');
		});
		
		
//		var param = {
//				TITLE : '',
//				STRT_YMD :'',
//				EN_YMD : '',
//				DEL_YN : '0'
//		}
//		
//		D.http.ajax('/ma/mainSelectAlarm',param).then(function(result) {
//			
//			//result.main.length=0;
//			if(result.main.length!=0){
//				// 알림 팝업 로드
//				console.log("알림 팝업");
//				$('body').append($('<div id="__alarm__"></div>'));
//				$('#__alarm__').load(htmlRootPath + '/ma/MA-1010P.html', function(response, status, xhr) {
//					_getScript(jsRootPath + '/ma/MA-1010P.js', '__alarm__')
//					.then(function() {
//						if (/MA-0010E/.test(viewerId)) {
//							MA1010P.popLoad(result.main);
//							
//						}
//					});
//				});
//			
//			} else {
//				
//				
//				// 속도체크 페이지 로드
//				$('body').append($('<div id="__performance__"></div>'));
//				$('#__performance__').load(htmlRootPath + '/ma/MA-0162P.html', function(response, status, xhr) {
//					_getScript(jsRootPath + '/ma/MA-0162P.js', '__performance__')
//					.then(function() {
//						
//						if (/MA-0010E/.test(viewerId)) {
//							
//							MA0162P.sendData(true);
//						}
//					});
//				});
//				
//			}
//			
//			
//		
//		});

		// 속도체크 페이지 로드
//		$('body').append($('<div id="__performance__"></div>'));
//		$('#__performance__').load(htmlRootPath + '/ma/MA-0162P.html', function(response, status, xhr) {
//			_getScript(jsRootPath + '/ma/MA-0162P.js', '__performance__')
//			.then(function() {
//				
//				if (/MA-0010E/.test(viewerId)) {
//					
//					MA0162P.sendData(true);
//				}
//			});
//		});
		
		// 화면정보 통계 로그 쌓기 (로그인 이후 화면 부터 로그 쌓기)
		D.logger.info(viewerId + ' start!');
		if (D.global.getUserInfo()) {
			var viewerName = title || '';
			if (/MA-0010E/.test(viewerId)) {
				viewerName = '메인';
			} else if (/CLIP/.test(viewerId)) {
				viewerName = 'CLIP리포트';
			}
			statisticalLogUtil.viewerLog(viewerId, viewerName);
		}
	});
	
	
	/** 
	 *	히스토리 스택에 쌓여 있는 페이지가 복원 될때
	 */
	M.onRestore(function() {
		// 헤더의 '뒤로가기' 버튼으로 왔을경우
		// 기존 뒤로가기 파라메타를 지운다
		if (M.data.param('btnHeaderBack')) {
			M.data.removeParam('backParam');
		}
		
		M.data.removeParam('btnHeaderBack');
	});

	/**
	 * 화면과 스크립트를 연결 시켜 준다.
	 */
	$.fn.dgbBinder = function(procedure) {
		if(!procedure) return;
		
		var binder = {};
		$.each(this.find('[data-bind]'), function(_, el) {
			addView(getBinder(binder, $(el).data('bind')).views, el);
		});
		procedure(getModel(binder));

		function getBinder(aBinder, name) {
			if(!aBinder[name]) {
				aBinder[name] = {
					views: [],
					viewEach: function(supply) { $.each(this.views, supply) }
				};
			}
			return aBinder[name];
		}
		function addView(aViews, el) {
			aViews.push(getView(el));
		}
		function getModel(aBinders) {
			var result = {};
			$.each(aBinders, function(name, binder) {
				result[name] = bindModle(binder);
			});
			return result;
		}
		function bindModle(aBinder) {
			var result = {};
			observableFor(result, aBinder);
			bindFor(result, aBinder);
			setEach(result, aBinder);
			return result;
		}

		// ---- getView ---- //
		function getView(aElement) {
			return {
				element: aElement,
				template: getTemplate(aElement.firstChild),
				valueType: updateViewValue(aElement),
				checkType: updateViewCheck(aElement),
				defaultType: updateViewDefault(aElement)
			};
		}
		function getTemplate(aElement) {
			if(aElement && aElement.nodeType == 8) {
				return aElement.nodeValue.trim();
			}
		}
		function updateViewValue(aElement) {
			return function(procedure) {
				if(!procedure) return;
				aElement.tagName.replace(/(input)|textarea|select/i, function(_, $1) {
					if($1) {
						aElement.type
							.replace(/checkbox|radio|file/i, function() { return ''})
							.replace(/\w/i, function() { procedure(aElement) });
					} else procedure(aElement);
				});
			};
		}
		function updateViewCheck(aElement) {
			return function(procedure) {
				if(!procedure || !/input/i.test(aElement.tagName)) return;
				aElement.type.replace(/checkbox|radio/i, function() {
					procedure(aElement);
				});
			};
		}
		function updateViewDefault(aElement) {
			return function(procedure) {
				if(!procedure || /input|textarea|select/i.test(aElement.tagName)) return;
				procedure(aElement);
			};
		}

		// ---- setEach ---- //
		function setEach(aModel, aBinder) {
			var templates = [];
			aBinder.viewEach(function(_, view) {
				view.template && templates.push(view);
			});
			if(templates.length) aModel.each = getEach(templates);
		}
		function getEach(aTemplates) {
			var result = {}, value = [];
			eachSize(result, value);
			eachGetter(result, value);
			eachSetter(result, value, aTemplates);
			eachClear(result, value, aTemplates);
			eachRemove(result, value);
			eachPop(result, value);
			eachPush(result, value, aTemplates);
			eachShift(result, value);
			eachUnshift(result, value, aTemplates);
			eachReplace(result, value, aTemplates);
			return result;
		}
		function eachReplace(aEach, aValue, aTemplates) {
			aEach.replace = function(aSource, aTarget) {
				if(aValue.length < 1) return;
				
				var index = (typeof aSource == 'number') ? aSource : aValue.indexOf(aSource);
				aValue[index] = aTarget;
				$.each(aTemplates, function(_, view) {
					var child = view.element.children && view.element.children[index];
					child && $(child).html(templateToHtml(view.template, aTarget));
				});
			};
		}
		function eachUnshift(aEach, aValue, aTemplates) {
			aEach.unshift = function(arg) {
				aValue.unshift(arg);
				$.each(aTemplates, function(_, view) {
					$(view.element).prepend($(templateToHtml(view.template, arg)));
				});
			};
		}
		function eachShift(aEach, aValue) {
			aEach.shift = function() {
				return aEach.remove(aValue[0]);
			};
		}
		function eachPush(aEach, aValue, aTemplates) {
			aEach.push = function(arg) {
				aValue.push(arg);
				$.each(aTemplates, function(_, view) {
					$(view.element).append($(templateToHtml(view.template, arg)));
				});
			};
		}
		function eachPop(aEach, aValue) {
			aEach.pop = function() {
				return aEach.remove(aValue[aValue.length - 1]);
			};
		}
		function eachRemove(aEach, aValue) {
			aEach.remove = function(arg) {
				var def = $.Deferred();
				setTimeout(function() {
					if(aValue.length < 1) return def.resolve();
					var index = (typeof arg == 'number') ? arg : aValue.indexOf(arg);
					aEach.set(aValue.slice(0, index).concat(aValue.slice(index + 1)));
					def.resolve(arg);
				}, 100);
				return def.promise();
			};
		}
		function eachClear(aEach, aValue, aTemplates) {
			aEach.clear = function() {
				aValue.length = 0;
				$.each(aTemplates, function(_, view) {
					$(view.element).html('');
				});
			};
		}
		function eachSetter(aEach, aValue, aTemplates) {
			aEach.set = function(args) {
				if(!Array.isArray(args)) return;
				
				aEach.clear();
				$.each(args, function(_, vl) { aValue.push(vl) });
				$.each(aTemplates, function(_, view) {
					$.each(aValue, function(_, vl) {
						$(view.element).append($(templateToHtml(view.template, vl)));
					});
				});
			};
		}
		function eachGetter(aEach, aValue) {
			aEach.get = function(idx) {
				return (idx === undefined) ? aValue : aValue[idx];
			};
		}
		function eachSize(aEach, aValue) {
			aEach.size = function() {
				return aValue.length;
			};
		}
		function templateToHtml(template, aData) {
			return template.replace(/(?:\$\{([^}].*?)\})/g, function(_, $1) {
				var name = $1.trim();
				return (aData[name] === undefined) ? '' : aData[name];
			});
		}

		// ---- bindFor ---- //
		function bindFor(aModel, aBinder) {
			bindEvent(aModel, aBinder);
			bindStyle(aModel, aBinder);
			bindClass(aModel, aBinder);
			bindAttribute(aModel, aBinder);
		}
		function bindAttribute(aModel, aBinder) {
			aModel.attribute = function(aAttr) {
				isObject(aAttr) && aBinder.viewEach(function(_, view) {
					$.each(aAttr, function(name, value) {
						if(value == false) $(view.element).removeAttr(name);
						else $(view.element).attr(name, value);
					});
				});
			};
		}
		function bindClass(aModel, aBinder) {
			aModel.class = function(aClass) {
				isObject(aClass) && aBinder.viewEach(function(_, view) {
					$.each(aClass, function(name, active) {
						if(active) $(view.element).addClass(name);
						else $(view.element).removeClass(name);
					});
				});
			};
		}
		function bindStyle(aModel, aBinder) {
			aModel.style = function(aStyle) {
				isObject(aStyle) && aBinder.viewEach(function(_, view) {
					$(view.element).css(aStyle);
				});
			};
		}
		function isObject(arg) {
			return !Array.isArray(arg) && typeof arg == 'object';
		}
		function bindEvent(aModel, aBinder) {
			aModel.event = function(evtName, evtListener) {
				if(!evtName || !evtListener) return;
				aBinder.viewEach(function(_, view) {
					view.element.addEventListener(evtName, function(evt) {
						if(view.template) bindEventEach(aModel, evt, evtListener);
						else evtListener.call(view.element, evt);
					});
				});
			};
		}
		function bindEventEach(aModel, evt, evtListener) {
			$.each(evt.currentTarget.children, function(index, child) {
				$.each($(child).find('[data-each-id]'), function(_, target) {
					if(target == evt.target || $.contains(target, evt.target)) {
						evtListener.call(target, evt, {
							index: index,
							data: aModel.each.get(index),
							id: $(target).data('eachId')
						});
					}
				});
			});
		}

		// ---- observableFor ---- //
		function observableFor(aModel, aBinder) {
			observableValue(aModel, aBinder);
			observableChecked(aModel, aBinder);
			observableHtml(aModel, aBinder);
			observableVisible(aModel, aBinder);
			observableDisable(aModel, aBinder);
		}
		function observableDisable(aModel, aBinder) {
			var _value = false;
			aBinder.viewEach(updateValue);
			Object.defineProperty(aModel, 'disable', {
				get: function() {return _value},
				set: function(arg) {_value = arg, aBinder.viewEach(updateValue)}
			});
			function updateValue(_, view) {
				if(view.element.disabled === undefined) return;
				view.element.disabled = _value;
			}
		}
		function observableVisible(aModel, aBinder) {
			var _value = true;
			aBinder.viewEach(updateValue);
			Object.defineProperty(aModel, 'visible', {
				get: function() {return _value},
				set: function(arg) {_value = arg, aBinder.viewEach(updateValue)}
			});
			function updateValue(_, view) {
				_value ? $(view.element).show() : $(view.element).hide();
			}
		}
		function observableHtml(aModel, aBinder) {
			var _value;
			Object.defineProperty(aModel, 'text', {
				get: function() {return _value || ''},
				set: function(arg) {
					_value = arg;
					aBinder.viewEach(function(_, view) {
						view.defaultType(function(el) {el.innerText = arg});
					});
				}
			});
			Object.defineProperty(aModel, 'html', {
				get: function() {return _value || ''},
				set: function(arg) {
					_value = arg;
					aBinder.viewEach(function(_, view) {
						view.defaultType(function(el) {el.innerHTML = arg});
					});
				}
			});
		}
		function observableChecked(aModel, aBinder) {
			var _value = {};
			aBinder.viewEach(initValue);
			Object.defineProperty(aModel, 'checked', {
				set: setter,
				get: function() {return _value}
			});
			function setter(arg) {
				_value = {};
				aBinder.viewEach(function(_, view) {
					view.checkType(function(el) {
						var checked = false;
						if(el.type == 'checkbox') checked = el.checked;
						checked = (arg[el.value] === undefined) ? checked : arg[el.value];
						el.checked = _value[el.value] = checked;
					});
				});
			}
			function initValue(_, view) {
				view.checkType(function(el) {
					_value[el.value] = el.checked;
					el.addEventListener('change', function() {
						var checked = {};
						checked[el.value] = el.checked;
						setter(checked);
					});
				});
			}
		}
		function observableValue(aModel, aBinder) {
			var _value;
			aBinder.viewEach(initValue);
			Object.defineProperty(aModel, 'value', {
				set: setter,
				get: function() {return _value || ''}
			});
			function setter(arg) {
				_value = arg;
				aBinder.viewEach(function(_, view) {
					view.valueType(function(el) {el.value = _value});
				});
			}
			function initValue(_, view) {
				view.valueType(function(el) {
					el.addEventListener('change', function() { setter(el.value) })
				});
			}
		}
	};

})(jQuery, window.Dcore);