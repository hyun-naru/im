
(function(window) {

var 
thisFileName = "mcore.extends.js",

importFiles = [
	// 로드 되는 순서 중요함. 순서 바꾸지 말것!
	"wnInterface.extends.js",
	"../libs/jquery/jquery-2.1.0.js",
	"dcore/dcore.js",
	"dcore/logger/logger.js",
	"dcore/data/global.js",
	"dcore/data/storage.js",
	"dcore/page/state.js",
	"dcore/page/move.js",
	"dcore/http/http.js",
	"../utils/statisticalLogUtil.js",	// 통계로그 util
	"../common/common.js",
	"../common/nativeInterface.js",
	"../common/directive.js",
	"../utils/convertUtil.js",
	"../utils/commonUtil.js"
];

M.ScriptLoader.writeScript( importFiles, M.ScriptLoader.scriptPath(thisFileName) );

})(window);