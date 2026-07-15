function FidoApp() { Fido.call(this) }
(function($, D){


var fido = Fido.extend(FidoApp);
fido._device = function() {
	var def = $.Deferred();
	D.execute('exWNGetOpenPhoneInfo', {
		callback: D.response(function(aResult) {
			def.resolve(aResult);
		})
	});
	return def.promise();
};
fido._reg = function(arg) {
	var self = this;
	return self._netChange('lte')
	.then(function() {
		return self._openReg(arg);
	})
	.then(function(aResult) {
		if(aResult.resCode != '0000') return Fido.error(aResult.resCode, aResult.errorMsg);

		var param = Fido.assign(aResult, arg);
		param.DATA_KEY_USER_ID = arg.userId;
		param.DATA_KEY_AUTH_WAY_CODE = arg.techCode;
		return self._netChange('dev', param);
	})
	.then(function(aResult) {
		if(aResult.errorCode) return aResult;
		return D.http.ajax('/common/fido/lite/reg', aResult);
	});
};
fido._openReg = function(arg) {
	var def = $.Deferred();
	D.execute('exWNReqBioOpenReg', Fido.assign(arg, {
		callback: D.response(function(aResult) {
			def.resolve(aResult);
		})
	}));
	return def.promise();
};
fido._auth = function(arg) {
	var self = this;
	return self._netChange('lte')
	.then(function() {
		return self._openAuth(arg);
	})
	.then(function(aResult) {
		if(aResult.resCode != '0000') return Fido.error(aResult.resCode, aResult.errorMsg);
		return self._netChange('dev', aResult);
	})
	.then(function(aResult) {
		if(aResult.errorCode) return aResult;
		return D.http.ajax('/common/fido/lite/auth', Fido.assign(aResult, {
			DATA_KEY_AUTH_WAY_CODE: arg.techCode,
			DATA_KEY_DEVICE_ID: self.getInfo('DATA_KEY_DEVICE_ID')
		}));
	});
};
fido._openAuth = function(arg) {
	var def = $.Deferred();
	D.execute('exWNReqBioOpenAuth', Fido.assign(arg, {
		callback: D.response(function(aResult) {
			def.resolve(aResult);
		})
	}));
	return def.promise();
};
fido._dereg = function(arg) {
	var self = this;
	return self._netChange('lte')
	.then(function() {
		return self._openDereg(arg);
	})
	.then(function(aResult) {
		if(aResult.resCode != '0000') return Fido.error(aResult.resCode, aResult.errorMsg|| ('해지오류 ' + aResult.resCode));
		return self._netChange('dev', aResult);
	})
	.then(function(aResult) {
		if(aResult.errorCode) return aResult;

		var param = Fido.assign(aResult, self.getInfo());
		param.DATA_KEY_USER_ID = arg.userId;
		param.DATA_KEY_AUTH_WAY_CODE = arg.techCode;
		param.TR_ID = arg.trId;
		return D.http.ajax('/common/fido/lite/dereg', param);
	});
};
fido._openDereg = function(arg) {
	var def = $.Deferred();
	D.execute('exWNReqBioOpenDeReg', Fido.assign(arg, {
		callback: D.response(function(aResult) {
			def.resolve(aResult);
		})
	}));
	
	return def.promise();
};
fido._netChange = function(type, arg) {
	var self = this;
	var def = $.Deferred();

	if(self.getInfo('isDev')) {
		dialog.alert(self.getInfo(type))
		.then(function() {
			def.resolve(arg);
		});
	} else {
		setTimeout(function() {
			def.resolve(arg);
		}, 1);
	}
	return def.promise();
};


})(jQuery, Dcore);