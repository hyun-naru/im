function FidoDemo() { Fido.call(this) }
(function($, D){


var fido = Fido.extend(FidoDemo);
fido._device = function(arg) {
	return D.http.ajax('/common/fido/demo/device/info')
	.then(function(aResult) {
		return Fido.assign(aResult, arg);
	});
};
fido._reg = function(arg) {
	var self = this;
	return D.http.ajax('/common/fido/demo/lite/reg', arg)
	.then(function(aResult) {
		var param = Fido.assign(aResult, arg);
		param.DATA_KEY_USER_ID = arg.userId;
		param.DATA_KEY_AUTH_WAY_CODE = arg.techCode;
		return D.http.ajax('/common/fido/lite/reg', param);
	});
};
fido._auth = function(arg) {
	var self = this;
	return D.http.ajax('/common/fido/demo/lite/auth', arg)
	.then(function(aResult) {
		return D.http.ajax('/common/fido/lite/auth', Fido.assign(aResult, {
			DATA_KEY_AUTH_WAY_CODE: arg.techCode,
			DATA_KEY_DEVICE_ID: self.getInfo('DATA_KEY_DEVICE_ID')
		}));
	});
};
fido._dereg = function(arg) {
	var self = this;
	return D.http.ajax('/common/fido/demo/lite/dereg', arg)
	.then(function(aResult) {
		var param = Fido.assign(aResult, self.getInfo());
		param.DATA_KEY_USER_ID = arg.userId;
		param.DATA_KEY_AUTH_WAY_CODE = arg.techCode;
		param.TR_ID = arg.trId;
		return D.http.ajax('/common/fido/lite/dereg', param);
	});
};


})(jQuery, Dcore);