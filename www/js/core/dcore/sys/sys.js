/******************************************************
 *  화면ID 	: 
 *  설명 	: 시스템 기능 제공 wrapping
 *    			- 전화걸기, SMS, 메일발송, 진동 발생, 앱종료,
 *    			- 카메라 실행, 사진 정보가져오기, 사진 최적화, 사진 선택
 *    			- 위치정보
 *  작성자 	: jhKo
 *  작성일	: 2018-01-11
 *  변경로그 : 
 ******************************************************/

window.Dcore.extend('sys',
	(function ($, D) {
		//----- variable declaration ----
		
		
		//----- execution code ----------
		D.logger.info('sys.js');
		
		
		//----- function definition -----
		
		/** 
		 *	전화걸기
		 *	@param number : 전화번호(구분자를 쓸경우 구분자는 '-' 만 가능)
		 */
		function call(number) {
			if (!D.isApp) return;
			
			M.sys.call(number);
		}
		
		/** 
		 *	sms발송
		 *	@param options : {
		 *						numbers(array): 수신전화번호,
		 *						message(string): sms내용
		 *					}
		 */
		function sms(options) {
			if (!D.isApp) return;
			
			M.sys.sms(options);
		}
		
		/** 
		 *	메일 발송
		 *	@param options : {
		 *						to(array): 받는사람 이메일 주소,
		 *						cc(array): 참조 이메일 주소,
		 *						bcc(array): 숨은참조 이메일 주소,
		 *						subject(string): 메일제목,
		 *						contents(string): 메일내용
		 *					}
		 */
		function mail(options) {
			if (!D.isApp) return;
			
			return M.sys.mail(options);
		}
		
		/** 
		 *	진동 발생
		 */
		function vibration() {
			if (!D.isApp) return;
			
			return M.sys.vibration();
		}
		
		/** 
		 *	앱 종료
		 */
		function exit() {
			if (!D.isApp) return;
			
			if (M.navigator.os('android')) {
				M.execute('exWNStopNOSLink');	// 백신 중지
			}
			
			M.sys.exit();
		}
		
		/** 
		 *	카메라 실행
		 *	@param setting : {
		 *						path(string): 저장될 폴더명, default - /media
		 *						filename(string): 저장될 파일명, 확장자 제외, default - 현재시간값
		 *						direction(string): 촬영방향(FRONT/BACK)
		 *						allowEdit(boolean): Edit 모드 사용 여부
		 *						saveAlbum(boolean): 앨범 저장 여부
		 *						overwrite(boolean): 덮어쓰기 여부, false인 경우 파일명(중복수)로 적용됨
		 *						
		 *					}
			@param callback function(status, result): 촬영 후 호출되는 콜백함수
		 *							- status(string): 실행결과(SUCCESS:성공, FAIL:실패)
		 *							- result(object): {
		 *												path(string): 파일경로(도큐먼트로부터의 경로, 로컬 웹서버를 통해 파일 접근 가능)
		 *												filesize(int): 파일크기
		 *												filename(string): 파일명
		 *												saveDate(string): 저장시간
		 *											}
		 */
		function camera(setting, callback) {
			if (!D.isApp) return;
			
			if ($.type(setting) == 'object') setting.mediaType = 'PHOTO';			
			M.media.camera(setting, callback);
		}
		
		/** 
		 *	사진 정보 가져오기
		 *	@param path : 파일 경로
		 *	@return object : 파일 정보
		 */
		function getInfo(path) {
			if (!D.isApp) return;
			
			return M.media.get(path);
		}
		
		/** 
		 *	사진 최적화
		 *	@param setting : {
		 *						source(string): 가져올 미디어 파일 경로
		 *						destination(string): 출력할 미디어 파일 경로
		 *						overwrite(boolean): 파일 덮어쓰기 여부, default - false, 파일 존재시 파일명(숫자) 형태로 생성
		 *						dimension(object): 출력할 이미지 크기{width: int, height: int}, 설정하지 않으면 실제 Pixel 크기 기준으로 생성
		 *						format(string): 파일 포맷 (PNG,JPG), default - PNG
		 *						quality(float): 파일 포맷이 JPG인 경우에만 품질 설정, default - 1.0
		 *						callback(result): 파일 생성 후 호출되는 콜백함수
		 *							- result(object): {
		 *												status(string): 실행결과(SUCCESS:성공, FAIL:실패, ERROR:실패)
		 *												path(string): 파일 경로 (도큐먼트로부터의 경로, 로컬 웹서버를 통해 파일 접근 가능)
		 *												alias(string): Scheme 경로(doc://도큐먼트, app://번들리소스, media://미디어라이브러리, ext://외부저장장치로 부터의 경로)
		 *												source(string): 절대경로(Native에서만 접근 가능)
		 *											}
		 *					}
		 *
		 */
		function optimize(setting) {
			if (!D.isApp) return;
			
			M.media.optimize(setting);
		}
		
		/** 
		 *	사진 선택
		 *	@param setting : {
		 *						mode(string): 선택타입 (SINGLE: 하나의 파일만 선택, MULTI: 여러장 파일 선택)
		 *						path(string): 경로
		 *						maxCount(int): 최대 선택수, default - 0, 0인 경우 제한없음
		 *						column(int): 선택화면 컬럼 수
		 *						detail(boolean): 상세 화면 모드
		 *						zoom(boolean): 줌 모드
		 *					}
		 *	@param callback		function(status, result): 공통 미디어 정보를 반화하는 콜백함수
		 *							- status(string): 실행결과(SUCCESS:성공, FAIL:실패)
		 *							- result(object): {
		 *												path(string): 파일경로(도큐먼트로부터의 경로, 로컬 웹서버를 통해 파일 접근 가능)
		 *												size(int): 파일 크기
		 *												saveDate(string): 저장 시간
		 *												name(string): 파일 이름
		 *												orientation(string): 방향(0, 90, 180, 270)
		 *											}
		 *
		 */
		function picker(setting, callback) {
			if (!D.isApp) return;
			
			if ($.type(setting) == 'object') setting.mediaType = 'PHOTO';
			M.media.picker(setting, callback);
		}
		
		/** 
		 *	위치 정보
		 *	@param setting : {
		 *						timeout(string): 타임 아웃(milliseconds)
		 *						maximumAge(string): 최근 위치 정보 여부를 판단하기 위한 델타 값
		 *						callback(result): 위치정보 반환을 위한 콜백 함수
		 *							- result(object): {
		 *												status(string): 실행 결과 (SUCCESS:성공)
		 *												message(string): 결과 메세지
		 *												coords(???): 위치정보
		 *											}
		 *					}
		 *
		 */
		function location(setting) {
			if (!D.isApp) return;
			
			M.plugin('location').current(setting);
		}
		
		
		
		//----- assign ------------------
		return {
			call : call,
			sms : sms,
			mail : mail,
			vibration : vibration,
			exit : exit,
			camera : camera,
			getInfo : getInfo,
			optimize : optimize,
			picker : picker,
			location : location
		};
	})(jQuery, window.Dcore)
);