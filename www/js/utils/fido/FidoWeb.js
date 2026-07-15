console.log('FidoWeb', Fido);
function FidoWeb() { Fido.call(this) }
(function($, D){


var fido = Fido.extend(FidoWeb);
fido._device = function() {throw '_device is override'};
fido._regist = function(arg) {throw '_regist is override'};
fido._registResult = function(arg) {throw '_registResult is override'};
fido._auth = function(arg) {throw '_auth is override'};
fido._authResult = function(arg) {throw '_authResult is override'};
fido._dereg = function() {throw '_dereg is override'};
fido._deregResult = function() {throw '_deregResult is override'};


})(jQuery, Dcore);