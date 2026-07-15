/******************************************************
 *  화면ID 	: 
 *  설명 	: 통계 로그 util
 *  작성자 	: 고준호
 *  작성일	: 2018-04-14
 *  변경로그 : 
 ******************************************************/

var statisticalLogUtil = (function($, D){
	
	var gDeviceId = D.storage.getStorage(D.storage.storageKeys.deviceId);
	if (gDeviceId == null || gDeviceId == undefined || gDeviceId == '') {
		gDeviceId = '1';	// deviceID를 못 가져올 경우 임시로 '1'로 세팅
	}
	console.log("################ gDeviceId statisticalLogUtil : " + gDeviceId);
	
	/**
	 *  로그인 정보 로그를 쌓는다
	 *  @param LGN_TPCD : 로그인타입
	 *  @param REMARKS : 비고
	 */
	function loginLog(LGN_TPCD, REMARKS) {
		
		var param = {
				LGN_TPCD : LGN_TPCD,				// 로그인타입
				DEVICE_ID : gDeviceId,	// 단말기아이디
				VER_ID : M.info.device('os.version'),// OS버전
				REMARKS : REMARKS,					// 비고
				OS_VER : M.info.device('os.version'),// OS버전
				OS_TP : M.info.device('os.name')		 // OS
		};
		
		return D.http.ajax('/log/login', param, true, 'statisticalLog');
	}
	
	/**
	 *  화면정보 로그를 쌓는다
	 *  @param VIEWER_ID : 화면 ID
	 */
	function viewerLog(VIEWER_ID, REMARKS) {
		var param = {
				VIEWER_ID : VIEWER_ID,				// 화면아이디
				DEVICE_ID : gDeviceId,	// 단말기아이디
				REMARKS : REMARKS					// 비고
		};
		
		return D.http.ajax('/log/viewer', param, true, 'statisticalLog');
	}
	
	/**
	 *  디바이스 화면 정보 등록
	 * @param PLAR_NUM 고객번호
	 */
	function deviceDisplayInfoReg(PLAR_NUM) {
		var param = {
				PLAR_NUM : PLAR_NUM,
				DEVICE_ID : gDeviceId,
				DEVICE_MODEL_NAME : M.info.device('model'),				// 기기 모델명
				DEVIDE_DISPLAY_WIDTH : M.info.device('display.width'),	// 기기 화면 가로 사이즈
				DEVIDE_DISPLAY_HEIGHT : M.info.device('display.height')	// 기기 화면 세로 사이즈
		};
		
		return D.http.ajax('/device/displayReg', param, true, 'statisticalLog');
	}
	
	
	/**
	 *  로그인 정보 가져오기
	 *  @param LGN_TPCD : 로그인타입
	 *  @param REMARKS : 비고
	 */
	function getLoginLog(EMPNO) {
		var param = {
				FC_EMPNO : EMPNO	// 사원번호
		};
		
		return D.http.ajax('/log/getLogin', param);
	}
	
	return {
		loginLog :loginLog,
		viewerLog :viewerLog,
		deviceDisplayInfoReg : deviceDisplayInfoReg,
		getLoginLog : getLoginLog
	}
	
})(jQuery, window.Dcore);