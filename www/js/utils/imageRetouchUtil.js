var imageRetouchUtil = (function($, D){
/******************************************************
 *  화면ID 	: 
 *  설명 	: 이미지보정 유틸
 *  작성자 	: 강환성
 *  작성일	: 2020-08-12
 *  변경로그 : 
 ******************************************************/
/*******************************************************************************
 * Function List
 *******************************************************************************
 *	open: 이미지 보정 팝업 오픈
 *	upload: 이미지 업로드
 ******************************************************************************/
return {
	open: open,
	upload: upload
};


/** 
 *  이미지 보정 팝업
 *  files: 팝업 오픈시 보여줄 이미지 리스트
 *  title: 이미지 보정 팝업 타이틀
 */
function open(files, title) {
	if(D.isLocal) return openLocal(files, title);

	var def = $.Deferred();
	D.execute("exWNSelectIppImages", {
		quality		: "100",		//이미지 저장 압축률
		max_count	: "10",			//이미지 저장 최대 갯수
		max_width	: "1000",		//이치지 최대 가로 크기
		max_height	: "1000",		//이치지 최대 세로 크기
		title_text	: title || "서류제출",	//이미지 보정 타이틀
		guide_text	: "true",		//가이드 텍스트 여부
		files: files,
		callback: D.response(function(aResult) {
			def.resolve(aResult && aResult.files);
		})
	});
	return def.promise();
}

/** 
 *  이미지 업로드
 *  fileGroup: 이미지 파일 리스트 그룹
 *  message: 이미지 업로드시 보여줄 메시지
 */
function upload(fileGroup, message) {
	if(!fileGroup) return dialog.alert('전달 값이 존재 하지 않습니다.');
	if(D.isLocal) return uploadLocal(fileGroup);

	makeWaitingPopup(message);
	var params = [];
	eachImageInfo(fileGroup, function(kind, path) {
		params.push(getImageData(kind, path));
	});
	return $.when.apply($, params)
		.then(function() {
			return D.http.upload(Array.prototype.slice.apply(arguments));
		})
		.then(function(aResponse) {
			removeWaitingPopup();

			if(aResponse.errorCode) return aResponse;
			return resultImageGroup(aResponse.results);
		});
}
function makeWaitingPopup(message) {
	message = message || '업로드 중입니다.<br/>잠시만 기다려 주세요.';
	var popup = document.getElementById('bigDataUploadPopup') || document.body.appendChild(document.createElement('div'));
	popup.outerHTML = [
		'<div class="dim-layer" id="bigDataUploadPopup">',
			'<div class="dimBg"></div>',
			'<div class="alert-layer">',
				'<div class="alert-container">',
					'<div class="alert-head"><h1>알림</h1></div>',
					'<div class="alert-conts d-scroll">'+ message +'</div>',
				'</div>',
			'</div>',
		'</div>'
	].join('');
}
function removeWaitingPopup() {
	document.body.removeChild(document.getElementById('bigDataUploadPopup'));
}
function resultImageGroup(arg) {
	var result = {};
	$.each(arg, function(_, info) {
		result[info.kind] = result[info.kind] || [];
		result[info.kind].push(info);
	})
	return result;
}
function eachImageInfo(imageGroups, supply) {
	$.each(imageGroups, function(kind, files) {
		$.each(files, function(_, path) { supply(kind, path) });
	});
}
function getImageData(kind, path) {
	var def = $.Deferred();
	D.execute("exWNSelectIppImageData", {
		path: path,
		callback: D.response(function(aResult) {
			def.resolve(aResult && {
				group: 'official',
				kind: kind,
				data: 'data:image/jpg;base64,' + aResult.data
			});
		})
	});
	return def.promise();
}


// -- local --//
function openLocal(arg, title, id) {
	title = title || '추가서류제출';
	id = id || 'localImageRetouch';

	return makePopup(), dialog.openPopup(id, arg);
	function makePopup() {
		var popup = document.getElementById(id) || document.body.appendChild(document.createElement('div'));
		popup.outerHTML = [
           '<div class="fullpop-wrap" id="' +id+ '">',
	           '<header>',
		           '<div class="fullpop-head">',
			           '<h1 data-bind="title">'+ title +'</h1>',
			           '<button class="lbtn btn-pop-close">닫기</button>',
		           '</div>',
	           '</header>',
	           '<div class="fullpop-cont d-scroll bg-st02">',
		           '<div class="cont1 dform circle01">',
			           '<input data-bind="file" type="file">',
			           '<ul data-bind="list" style="display: flex; flex-wrap: wrap;"><!--',
			           '<li style="position:relative">',
			           '<img src="${result}" style="width:80px; height:80px;">',
			           '<button data-each-id="remove" class="btn-st08" style="position:absolute; top:0; left:0;">삭제</button>',
			           '</li>',
			           '--></ul>',
			           '<div>',
			           '<button data-bind="cancle" class="btn-st08">취소</button>',
			           '<button data-bind="save" class="btn-st08">저장</button>',
			           '</div>',
		           '</div>',
	           '</div>',
           '</div>'
		].join('');
		window[id] = {onInit: onInit};
	}
	function onInit(param) {
		var getStorage = function() {
			var storage = localStorage.getItem('imageRetouchUtil');
			return storage ? JSON.parse(storage) : [];
		};
		var setStorage = function(arg) {
			return localStorage.setItem('imageRetouchUtil', JSON.stringify(arg));
		};

		$('#'+id).dgbBinder(function(model) {
			var storage = getStorage();
			param && storage.forEach(function(vl) {
				(param.indexOf(vl.name) != -1) && model.list.each.push(vl);
			});
			model.file.event('change', function(event) {
				var target = event.target;
				var validate = function(arg) {
					var file = arg.files[0];
					if(file && /image/.test(file.type)) return true;
					else {
						target.value = '';
						dialog.alert('이미지 파일을 선택 해주세요.');
					}
				};
				const readFile = function(arg, supply) {
					var file = arg.files[0];
					var reader = new FileReader;
					reader.readAsDataURL(file);
					reader.onload = function(arg) {
						var result = arg.target.result;
						return supply({result:result, name: file.name});
					};
				};

				validate(target) && readFile(target, function(result) {
					target.value = '';
					model.list.each.push(result);
					storage.push(result);
					setStorage(storage);
				});
			});
			model.list.event('click', function(_, vl) {
				var id = vl.id, data = vl.data;
				if(id == 'remove') {
					const pos = storage.indexOf(data);
					setStorage(storage.slice(0, pos).concat(storage.slice(pos+1)));
					model.list.each.remove(data);
				}
			});
			model.cancle.event('click', function() { dialog.closePopup() });
			model.save.event('click', function() {
				dialog.closePopup(model.list.each.get().map(function(vl) {return vl.name}).slice(0));
			});
		});
	}
}

function uploadLocal(arg) {
	var params = [];
	$.each(getStorage(), function(_, file) {
		eachImageInfo(arg, function(kind, path) {
			if(path.indexOf(file.name) == -1) return;
			params.push({
				group: 'official',
				kind: kind,
				data: file.result
			});
		});	
	});
	clearStorage();

	return D.http.upload(params).then(function(aResponse) {
		if(aResponse.errorCode) return aResponse;
		return resultImageGroup(aResponse.results);
	});
}
function getStorage() {
	var result = localStorage.getItem('imageRetouchUtil');
	return result ? JSON.parse(result) : [];
}
function clearStorage() {
	localStorage.removeItem('imageRetouchUtil');
}
localStorage && localStorage.removeItem('imageRetouchUtil');


})(jQuery, Dcore);