var kakaoUtil =(function($, D){
/******************************************************
 *  화면ID 	: 
 *  설명 	: 카카오페이 인증
 *  작성자 	: 강환성
 *  작성일	: 2020-08-06
 *  변경로그 : 
 ******************************************************/
/*******************************************************************************
 * Function List
 *******************************************************************************
 ******************************************************************************/


var Kakao = function() { };
var kakao = Kakao.prototype;
Kakao.extend = function(arg) { return arg.prototype = Object.create(Kakao.prototype) };
Kakao.error = function(error) {
	return error ? error : {errorCode: '9999', errorMsg: '인증처리 오류'};
};

kakao.setInfo = function(arg) { this._info = arg };
kakao.getInfo = function(vl) { return vl ? this._info[vl] : this._info };
kakao.setTxId = function(arg) { this._tx_id = arg };
kakao.getTxId = function() { return this._tx_id };

kakao.S310 = function(arg) {
	arg.sign = 'S310';
	return this.sign('/common/kakao/request', arg);
};

/**
 * 20210111 카카오 등록
 */
kakao.authReg = function(arg) {
	var self = this;
	return self._device()
	.then(function(aResult) {
		
		aSign = {};
		
		arg.sign = 'S315';
		arg.title = 'iM라이프 로그인 등록';
		aSign.deviceId = aResult.DATA_KEY_DEVICE_ID;
		aSign.osType = aResult.DATA_KEY_OS_TYPE;
		
		return self.sign('/common/kakao/request', arg)
		.then(function(aSign) {
			aSign.deviceId = aResult.DATA_KEY_DEVICE_ID;
			aSign.osType = aResult.DATA_KEY_OS_TYPE;
			return aSign;
		});

	})
	.then(function(aResult){
		
		return D.http.ajax('/common/kakao/regDevice', {
			NAME : arg.name,
			PHONE_NO : arg.phone_no,
			BIRHDAY : arg.birthday,
			DATA_KEY_DEVICE_ID: aResult.deviceId,
			DATA_KEY_OS_TYPE:  aResult.osType,
		})
	});
};	

kakao.auth = function(){
	var self = this;
	return self._device()
	.then(function(aResult) {
		
		var arg = {};
		arg.sign = 'S315';
		arg.deviceId = aResult.DATA_KEY_DEVICE_ID;
		arg.osType = aResult.DATA_KEY_OS_TYPE;
		arg.title = 'iM라이프 로그인 인증';

		return self.sign('/common/kakao/signAuth', arg)
		.then(function(aSign) {
			
			return aSign;
		});
	});
}

kakao.Dereg = function(){
	var self = this;
	return self._device()
	.then(function(aResult) {
		
		var arg = {};
		arg.sign = 'S315';
		arg.deviceId = aResult.DATA_KEY_DEVICE_ID;
		arg.osType = aResult.DATA_KEY_OS_TYPE;
		arg.title = 'iM라이프 로그인 해지';

		return self.sign('/common/kakao/signAuth', arg)
		.then(function(aSign) {
			console.log("DATA_KEY_DEVICE_ID :::::::");
			console.log(aResult.DATA_KEY_DEVICE_ID);
			return aSign;
		});
	})
	.then(function(aResult){
		
		if(aResult.DATA_KEY_DEVICE_ID) return dialog.alert("디바이스 정보가 없습니다.");
		
		return self.sign('/common/kakao/dereg', aResult)
		.then(function(aSign) {
			
			return aSign;
		});
		
	});
}

kakao.sign = function(url, arg) {
	var self = this;
	var def = $.Deferred();

	arg.allow_simple_registration = arg.allow_simple_registration || 'N'; // 간편등록회원 허용여부(Y/N)
	arg.verify_auth_name = arg.verify_auth_name || 'N'; // 사용자 성명 체크 여부(Y/N)

	D.http.ajax('/common/kakao/init')
	.then(function(aResult) {
		self.setInfo(aResult);
		return D.http.ajax(url, arg);
	})
	.then(function(aResult) {
		if(!aResult || aResult.errorCode)
			return def.resolve(Kakao.error(aResult));

		self.setTxId(aResult.tx_id);
		return self.changeNetwork(self.getInfo('lte'))
	})
	.then(function() {
		return true; //self._openApp();//카카오톡 어플 실행
	})
	.then(function() {
		return self.changeNetwork(self.getInfo('dev'));
	})
	.then(function() {
		return self.status();
	})
	.then(function(aResult) {
		if(!aResult || aResult.errorCode)
			return def.resolve(Kakao.error(aResult));
		return D.http.ajax('/common/kakao/verify_auth', {
				tx_id: self.getTxId(),
				DATA_KEY_DEVICE_ID : arg.deviceId,
				sign : arg.sign
			});
	})
	.then(function(aResult) {
		def.resolve(aResult);
	});
	
	return def.promise();
};
kakao.changeNetwork = function(target) {
	var self = this;
	var def = $.Deferred();
	if(self.getInfo('isDev')) 
//		dialog.alert(target)
//		.then(function() {
			def.resolve();
//		});
	else def.resolve();
	return def.promise();
};
kakao.status = function() {
	var self = this;
	var def = $.Deferred();

	self.changeNetwork(self.getInfo('dev'))
	.then(function() {
		polling(self.getInfo('limit'), 0);
	});

	function polling(limite, cnt) {
		if(limite <= cnt) return dialog.loading(false),
		def.resolve(Kakao.error({errorCode:'0001', errorMsg: '인증 시간 초과'}));
		
		D.http.ajax('/common/kakao/status_auth', {tx_id: self.getTxId()})
		.then(function(aResult) {
			if(aResult.errorCode) return def.resolve(Kakao.error(aResult));
			
			// 카카오 인증안하고 닫을경우
//			if(aResult.status == 'PREPARE') return def.reject(aResult);
			
			// 인증 완료 상태
			if(aResult.status == 'COMPLETE') return def.resolve(aResult);
			
			dialog.loading(true);
			setTimeout(function() {
				polling(limite, cnt+1);
			}, 5000);
		});
	}
	return def.promise();
};
kakao._openApp = function() { throw 'Kakao error:: _openApp is override' };
kakao._device = function() { throw 'Kakao error:: _device is override' };
kakao.getScheme = function() { return this.getInfo('link') + '?tx_id=' + this.getTxId() };


var KakaoDemo = function() { Kakao.call(this) }
var demo = Kakao.extend(KakaoDemo);
demo._openApp = function() { return dialog.alert('카카오톡 실행') };


var KakaoWeb = function() { Kakao.call(this) };
var web = Kakao.extend(KakaoWeb);
web._openApp = function() {
	var self = this;
	var def = $.Deferred();
	location.href = self.getScheme();
	def.resolve();
	return def.promise();
};


var KakaoApp = function() { Kakao.call(this) };
var app = Kakao.extend(KakaoApp);
app._openApp = function() {
	var self = this;
	var def = $.Deferred();
//	D.execute('exWNAppCall', {
//		scheme: self.getScheme(),
//		callback: D.response(function() {
//			def.resolve();
//		})
//	});
	D.execute('exWNAppCall', {
		scheme: self.getScheme(),
		callback: D.response(function() {
			def.resolve();
		})
	});
	return def.promise();
};

app._device = function() {
	var def = $.Deferred();
	setTimeout(function() {
		def.resolve({
			DATA_KEY_DEVICE_ID: M.info.device('uuid'),
			DATA_KEY_OS_TYPE: /android/i.test(M.info.device('os.name')) ? '1' : '2'
		});
	}, 100);
	return def.promise();
};


function getInstance() {
	if(D.isLocal) return new KakaoDemo;
	if(D.isApp || D.isWebView) return new KakaoApp;
	return new KakaoWeb;
}
return getInstance();


})(jQuery, Dcore);