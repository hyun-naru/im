var tossUtil =(function($, D){
	/******************************************************
	 *  화면ID 	: 
	 *  설명 	: 토스 인증
	 *  작성자 	: 석민혁
	 *  작성일	: 2021-09-06
	 *  변경로그 : 
	 ******************************************************/
	/*******************************************************************************
	 * Function List
	 *******************************************************************************
	 ******************************************************************************/

	var Toss = function() { };
	var toss = Toss.prototype;

	Toss.extend = function(arg) { return arg.prototype = Object.create(Toss.prototype) };
	Toss.error = function(error) {
		return error ? error : {errorCode: '9999', errorMsg: '인증처리 오류'};
	};

	toss.setInfo = function(arg) { this._info = arg };
	toss.getInfo = function() { return this._info };
	toss.setBrokerTxId = function(arg) { this._brokerTxId = arg };
	toss.getBrokerTxId = function() { return this._brokerTxId };
	toss.setDeviceId = function(arg) { this._deviceId = arg };
	toss.getDeviceId = function() { return this._deviceId };
	toss.setOsType = function(arg) { this._osType = arg };
	toss.getOsType = function() { return this._osType };
	toss.limit =  30;

	/**
	 * 20210111 토스 등록
	 */
	toss.authReg = function(arg) {

		/*
		var self = this;
		return D.http.ajax('/common/toss/regDevice', {
			NAME : arg.userName,
			PHONE_NO : arg.userPhone,
			BIRHDAY : arg.userBirthday,
			SEX : arg.sex,
			DATA_KEY_DEVICE_ID: 'awerqerqerqwerq',
			DATA_KEY_OS_TYPE:  '1111',
		});
		
		*/
		var self = this;
		//alert(1);
		return self._device().then(function(aResult) {

			//alert(2);
			self.setDeviceId(aResult.DATA_KEY_DEVICE_ID);
			self.setOsType(aResult.DATA_KEY_OS_TYPE);			
			return self.auth(arg);

		})
		.then(function(aResult){
//			alert(aResult);
			if(!aResult || aResult.errorCode)
				return Toss.error(aResult);			
			return D.http.ajax('/common/toss/regDevice', {
				NAME : arg.userName,
				PHONE_NO : arg.userPhone,
				BIRHDAY : arg.userBirthday,
				SEX : arg.sex,
				DATA_KEY_DEVICE_ID: self.getDeviceId(),
				DATA_KEY_OS_TYPE:  self.getOsType(),
			});
		});
	};
	
	toss.auth = function(arg) {
		var self = this;
		var def = $.Deferred();
		if(arg.triggerType == 'PUSH'){
			D.http.ajax('/common/toss/auth/' + arg.auth_type + 'Request',arg)
			.then(function(aResult) {
				if(!aResult || aResult.resultType == 'FAIL')
					return def.resolve(Toss.error(aResult.error));

				self.setInfo(aResult.success);
				self.setBrokerTxId(aResult.brokerTxId);
				return self.status(arg.auth_type);
			})
			.then(function(aResult) {
				if(!aResult || aResult.errorCode)
					return def.resolve(Toss.error(aResult));
				return D.http.ajax('/common/toss/auth/' + arg.auth_type + 'Result', {
					txId: self.getInfo().txId,
					brokerTxId: self.getBrokerTxId(),
					deviceId: arg.deviceId
				});
			})
			.then(function(aResult) {
				def.resolve(aResult);
			});
		}else{
			D.http.ajax('/common/toss/auth/' + arg.auth_type + 'Request',arg)
			.then(function(aResult) {
				if(!aResult || aResult.resultType == 'FAIL')
					return def.resolve(Toss.error(aResult.error));

				self.setInfo(aResult.success);
				self.setBrokerTxId(aResult.brokerTxId);
				return self._openApp();
			})
			.then(function() {
				return self.status(arg.auth_type);
			})
			.then(function(aResult) {
				if(!aResult || aResult.errorCode)
					return def.resolve(Toss.error(aResult));
				return D.http.ajax('/common/toss/auth/' + arg.auth_type + 'Result', {
					txId: self.getInfo().txId,
					brokerTxId: self.getBrokerTxId()
				});
			})
			.then(function(aResult) {
				def.resolve(aResult);
			});
		}
		
		return def.promise();
	};

	toss.changeNetwork = function() {
		var self = this;
		var def = $.Deferred();
		if(self.getInfo('isDev')) 
//			dialog.alert('개발모드')
//			.then(function() {
				def.resolve();
//			});
		else def.resolve();
		return def.promise();
	};
	toss.status = function(target) {
		var self = this;
		var def = $.Deferred();

		self.changeNetwork()
		.then(function() {
			polling(toss.limit, 0);
		});

		function polling(limit, cnt) {
			if(limit <= cnt) return dialog.loading(false),
			def.resolve(Toss.error({errorCode:'0001', errorMsg: '인증 시간 초과'}));
			
			D.http.ajax('/common/toss/auth/' + target + 'Status', {txId: self.getInfo().txId,brokerTxId: self.getBrokerTxId()})
			.then(function(aResult) {
				if(aResult.errorCode) return def.resolve(Toss.error(aResult));
				
				// 인증 완료 상태
				if(aResult.resultType == 'SUCCESS'){
					if(aResult.success.status == 'COMPLETED'){
						return def.resolve(aResult);
					}
				}
				
				dialog.loading(true);
				setTimeout(function() {
					polling(limit, cnt+1);
				}, 5000);
			});
		}
		return def.promise();
	};
	toss._openApp = function() { throw 'Toss error:: _openApp is override' };
	toss._device = function() { throw 'Toss error:: _device is override' };
	//toss.getScheme = function() { return this.getInfo('appScheme') + '?tx_id=' + this.getInfo('txId') };


	var TossDemo = function() { Toss.call(this) }
	var demo = Toss.extend(TossDemo);
	demo._openApp = function() { return dialog.alert('토스 실행') };


	var TossWeb = function() { Toss.call(this) };
	var web = Toss.extend(TossWeb);
	web._openApp = function() {
		var self = this;
		var def = $.Deferred();
		location.href = self.getInfo().appScheme;
		def.resolve();
		return def.promise();
	};

	var TossApp = function() { Toss.call(this) };
	var app = Toss.extend(TossApp);
	app._openApp = function() {
		var self = this;
		var def = $.Deferred();
		D.execute('exWNAppCall', {
			scheme: self.getInfo().appScheme,
			//			scheme: 'supertoss://toss-cert/v2/sign/user/auth?txId=e2178f57-e0f1-495a-a6dd-d64920c9510d&_minVerAos=4.992.0&_minVerIos=4.993.0',
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
		if(D.isLocal) return new TossDemo;
		if(D.isApp || D.isWebView) return new TossApp;
		return new TossWeb;
	}
	return getInstance();


})(jQuery, Dcore);