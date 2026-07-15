/******************************************************
 *  화면ID 	: 
 *  설명 	: fido 인증
 *  작성자 	: 강환성
 *  작성일	: 2020-08-06
 *  변경로그 : 
 ******************************************************/
/*******************************************************************************
 * Function List
 *******************************************************************************
 ******************************************************************************/
var fidoUtil = (function ($, D) {


var Fido = function() { };
var extend = function(arg) { return arg.prototype = Object.create(Fido.prototype) };
var assign = function(target, source) { return $.each(source, function(ky, vl) { target[ky] = vl }), target };
var error = function() {};
var fido = Fido.prototype;
var fidoCommand = '';
var inputVl = '';	// 첫번째 입력 번호
var globalEl = null;
var globalDrawPinUi = null;

// init data
fido._info = {};
fido.setInfo = function(arg) { this._info = arg };
fido.getInfo = function(vl) { return vl ? this._info[vl] : this._info };

// 디바이스 정보
fido.device = function(arg) {
	var self = this;
	return D.http.ajax('/common/fido/init')
	.then(function(aResult) {
		if(aResult.errorCode) return aResult;
		self.setInfo(assign(arg || {}, aResult));
		return self._device();
	})
	.then(function(aResult) {
		if(aResult.errorCode) return aResult;
		assign(self.getInfo(), aResult);
	});
};
fido._device = function() { throw '_device is override' };

// 지문 등록
fido.regFinger = function(arg) {
	fidoCommand = 'regFinger';
	var self = this;
	return self.device(arg)
	.then(function() {
		return self._reg({
			techCode: self.getInfo('FINGERPRINT')
		});
	});
};

// pin 등록
fido.regPin = function(arg) {
	fidoCommand = 'regPin';
	var self = this;
	return self.pinEventlistener(arg, function(pinData) {
		return self.device(arg)
		.then(function() {
			return self._reg({
				dataKeyPin: pinData,
				techCode: self.getInfo('PIN')
			});
		});
	});
};
fido._reg = function() { throw '_reg is override' };

// 지문 인증
fido.authFinger = function() {
	var self = this;
	return self.device()
	.then(function() {
		return D.http.ajax('/common/fido/trid', {
			deviceId: self.getInfo('DATA_KEY_DEVICE_ID'),
			techCode: self.getInfo('FINGERPRINT')
		});
	})
	.then(function(aResult) {
		if(aResult.errorCode) return aResult;
		return self._auth(assign(aResult, {
			techCode: self.getInfo('FINGERPRINT')
		}));
	});
};
// pin 인증
fido.authPin = function(arg) {
	var self = this;
	return self.pinEventlistener(arg, function(pinData) {
		return self.device()
		.then(function() {
			return D.http.ajax('/common/fido/trid', {
				deviceId: self.getInfo('DATA_KEY_DEVICE_ID'),
				techCode: self.getInfo('PIN')
			});
		})
		.then(function(aResult) {
			if(aResult.errorCode) return aResult;
			return self._auth(assign(aResult, {
				dataKeyPin: pinData,
				techCode: self.getInfo('PIN')
			}));
		});
	});
};
fido._auth = function() { throw '_auth is override' };

// 지문 해지
fido.deregFinger = function(arg) {
	var self = this;
	return self.device(arg)
	.then(function() {
		return D.http.ajax('/common/fido/trid', {
			deviceId: self.getInfo('DATA_KEY_DEVICE_ID'),
			techCode: self.getInfo('FINGERPRINT')
		});
	})
	.then(function(aResult) {
		if(aResult.errorCode) return aResult;
		return self._dereg(assign(aResult, {
			techCode: self.getInfo('FINGERPRINT')
		}));
	});
};
// pin 해지
fido.deregPin = function(arg) {
	var self = this;
	return self.pinEventlistener(arg, function(pinData) {
		return self.device(arg)
		.then(function() {
			return D.http.ajax('/common/fido/trid', {
				deviceId: self.getInfo('DATA_KEY_DEVICE_ID'),
				techCode: self.getInfo('PIN')
			});
		})
		.then(function(aResult) {
			if(aResult.errorCode) return aResult;
			return self._dereg(assign(aResult, {
				dataKeyPin: pinData,
				techCode: self.getInfo('PIN')
			}));
		});
	});	
};
fido._dereg = function() { throw '_dereg is override' };

fido.pinEventlistener = function(arg, startProcess) {
	var def = $.Deferred();

	var el = arg.handle;
	globalEl = el;
	globalDrawPinUi = arg.drawPinUi;
	arg.drawPinUi((el.value = '').length);
	el.onkeyup = function() {
		var vl = el.value;
		if(vl && !/^\d+$/.test(vl)) {
			arg.drawPinUi((el.value = '').length);
			return def.resolve({
				errorCode: '0001',
				errorMsg: '간편 비밀번호를 숫자로 입력 해주세요.'
			});
		}

		arg.drawPinUi(vl.length);
		if(vl.length == 6) {
			el.blur();
			
			if (fidoCommand == 'regPin') {
				// PIN 등록
				if (!inputVl || inputVl == '') {
					// 첫번째 입력 완료
					inputVl = vl;
					arg.drawPinUi((el.value = '').length);
					if ($('.stxt:visible').length > 0) {
						$('.stxt:visible').html('간편비밀번호6자리를<br>한 번 더 입력해주세요.');
						el.focus();
					}
				} else {
					// 두번째 입력 완료
					if (inputVl != vl) {
						// ------- 입력과 확인 값이 다름 ----------
						inputVl = '';
						arg.drawPinUi((el.value = '').length);
						return def.resolve({
							errorCode: '0099',
							errorMsg: '입력 번호와 확인 입력 번호가 일치하지 않습니다.<br>다시 입력해주세요.'
						});
					} else {
						// ------- 입력과 확인 값이 일치! 등록절차 시작 ----------
						startProcess(vl).then(function(aResult) {
							def.resolve(aResult);
						});
					} 
				}
				
				// 24.12.10 취약점 결과 조치(간편 비밀번호 등록 후 메모리에 잔재)
				vl = '';
				inputVl = '';
			} else {
				startProcess(vl).then(function(aResult) {
					def.resolve(aResult);
				});
			}
		}
	};

	return def.promise();
};

//FidoDemo
//====================
var FidoDemo = function() { Fido.call(this) };
var fidoDemo = extend(FidoDemo);
fidoDemo._device = function() {
	return D.http.ajax('/common/fido/demo/device/info');
};
fidoDemo._reg = function(arg) {
	var self = this;
	return D.http.ajax('/common/fido/demo/lite/reg', arg)
	.then(function(aResult) {
		return D.http.ajax('/common/fido/lite/reg', assign(aResult, {
			DATA_KEY_AUTH_WAY_CODE: arg.techCode,
			DATA_KEY_USER_ID: self.getInfo('userId'),
			DATA_KEY_DEVICE_ID: self.getInfo('DATA_KEY_DEVICE_ID'),
			DATA_KEY_OS_TYPE:  self.getInfo('DATA_KEY_OS_TYPE')
		}));
	});
};
fidoDemo._auth = function(arg) {
	var self = this;
	return D.http.ajax('/common/fido/demo/lite/auth', arg)
	.then(function(aResult) {
		return D.http.ajax('/common/fido/lite/auth', assign(aResult, {
			DATA_KEY_AUTH_WAY_CODE: arg.techCode,
			DATA_KEY_DEVICE_ID: self.getInfo('DATA_KEY_DEVICE_ID')
		}));
	});
};
fidoDemo._dereg = function(arg) {
	var self = this;
	return D.http.ajax('/common/fido/demo/lite/dereg', arg)
	.then(function(aResult) {
		return D.http.ajax('/common/fido/lite/dereg', assign(aResult, {
			TR_ID: arg.trId,
			DATA_KEY_AUTH_WAY_CODE: arg.techCode,
			DATA_KEY_USER_ID: self.getInfo('userId'),
			DATA_KEY_DEVICE_ID: self.getInfo('DATA_KEY_DEVICE_ID'),
			DATA_KEY_OS_TYPE:  self.getInfo('DATA_KEY_OS_TYPE')
		}));
	});
};


//FidoApp
//====================
var FidoApp = function() { Fido.call(this) };
var fidoApp = extend(FidoApp);
fidoApp._device = function() {
	var def = $.Deferred();
	D.execute('exWNGetOpenPhoneInfo', {
		callback: D.response(function(aResult) {
			def.resolve(aResult);
		})
	});
	return def.promise();
};
fidoApp._reg = function(arg) {
	var self = this;
	return self.netChange('lte')
	.then(function() {
		return self.openReg(arg)
		.then(function(aResult) {
			if(aResult.resCode != '0000') return {
				errorCode: aResult.resCode,
				errorMsg: aResult.errorMsg + '(' + aResult.resCode + ')'
			};

			return self.netChange('dev', aResult);
		});
	})
	.then(function(aResult) {
		if(aResult.errorCode) return aResult;
		
		var techCode = arg.techCode;
		
		// pin 입력 값 clear
		if (globalEl && globalEl != null && globalDrawPinUi && globalDrawPinUi != null) {
			inputVl = '';
			globalDrawPinUi((globalEl.value = '').length);
		}
		
		return D.http.ajax('/common/fido/lite/reg', assign(aResult, {
			DATA_KEY_AUTH_WAY_CODE: techCode,
			DATA_KEY_USER_ID: self.getInfo('userId'),
			DATA_KEY_DEVICE_ID: self.getInfo('DATA_KEY_DEVICE_ID'),
			DATA_KEY_OS_TYPE:  self.getInfo('DATA_KEY_OS_TYPE')
		}));
	});
};
fidoApp.openReg = function(arg) {
	var def = $.Deferred();
	D.execute('exWNReqBioOpenReg', assign(arg, {
		callback: D.response(function(aResult) {
			def.resolve(aResult);
		})
	}));
	return def.promise();
};
fidoApp._auth = function(arg) {
	var self = this;
	return self.netChange('lte')
	.then(function() {
		return self.openAuth(arg)
		.then(function(aResult) {
			if(aResult.resCode != '0000') return {
				errorCode: aResult.resCode,
				errorMsg: aResult.errorMsg + '(' + aResult.resCode + ')'
			};

			return self.netChange('dev', aResult);
		});
	})
	.then(function(aResult) {
		if(aResult.errorCode) return aResult;
		return D.http.ajax('/common/fido/lite/auth', assign(aResult, {
			DATA_KEY_AUTH_WAY_CODE: arg.techCode,
			DATA_KEY_DEVICE_ID: self.getInfo('DATA_KEY_DEVICE_ID')
		}));
	});
};
fidoApp.openAuth = function(arg) {
	var def = $.Deferred();
	D.execute('exWNReqBioOpenAuth', assign(arg, {
		callback: D.response(function(aResult) {
			def.resolve(aResult);
		})
	}));
	return def.promise();
};
fidoApp._dereg = function(arg) {
	var self = this;
	return self.netChange('lte')
	.then(function() {
		return self.openDereg(arg)
		.then(function(aResult) {
			if(aResult.resCode != '0000') return {
				errorCode: aResult.resCode,
				errorMsg: aResult.errorMsg + '(' + aResult.resCode + ')'
			};

			return self.netChange('dev', aResult);
		});
	})
	.then(function(aResult) {
		if(aResult.errorCode) return aResult;
		return D.http.ajax('/common/fido/lite/dereg', assign(aResult, {
			TR_ID: arg.trId,
			DATA_KEY_AUTH_WAY_CODE: arg.techCode,
			DATA_KEY_USER_ID: self.getInfo('userId'),
			DATA_KEY_DEVICE_ID: self.getInfo('DATA_KEY_DEVICE_ID'),
			DATA_KEY_OS_TYPE:  self.getInfo('DATA_KEY_OS_TYPE')
		}));
	});
};
fidoApp.openDereg = function(arg) {
	var def = $.Deferred();
	D.execute('exWNReqBioOpenDeReg', assign(arg, {
		callback: D.response(function(aResult) {
			def.resolve(aResult);
		})
	}));
	return def.promise();
};
fidoApp.netChange = function(type, arg) {
	var def = $.Deferred();
	setTimeout(function() {
		def.resolve(arg);
	}, 1);
	return def.promise();
};


//FidoWeb
//====================
var FidoWeb = function() { Fido.call(this) };
var fidoWeb = extend(FidoWeb);

function getInstance() {
	if(D.isLocal) return new FidoDemo;
	if(D.isApp || D.isWebView) return new FidoApp;
	return new FidoWeb;
}
return getInstance();
})(jQuery, Dcore);