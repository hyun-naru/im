/******************************************************
 *  화면ID 	: 
 *  설명 	: http 파일 업로드, 다운로드 기능 제공 wrapping
 *  작성자 	: jhKo
 *  작성일	: 2018-01-11
 *  변경로그 : 
 ******************************************************/

window.Dcore.extend('file',
	(function (D) {
		//----- variable declaration ----
		
		
		//----- execution code ----------
		D.logger.info('file.js');
		
		
		//----- function definition -----
		/** 
		 *	http 파일 업로드
		 *	@param setting : {
		 *						url(string): 업로드 하기 위한 서버 url (ex)upload.jsp
		 *						headers(object): http header 정보
		 *						parameters(object): 업로드 파라메타 정보
		 *						body(array): multipart body 정보
		 *						encoding(string): 인코딩
		 *						timeout(string): 타임 아웃 (milliseconds)
		 *						progress(total, current, remaining, percentage): 프로그레스 정보 콜백 함수
		 *							- total(string): 업로드 파일 사이즈
		 *							- current(string): 업로드된 파일 사이즈
		 *							- remaining(string): 남은 파일 사이즈
		 *							- percentage(string): 진행률 퍼센트
		 *						callback(statusCode, header, body): 파일 업로드 후 호출 될 콜백 함수
		 *							- statusCode(string): 실행결과코드
		 *							- header(string): 응답 헤더 정보
		 *							- body(string): 응답 바디 정보
		 *					}
		 */
		function upload(setting) {
			if (!D.isApp) return;

			M.net.http.upload(setting);
		}
		
		/** 
		 *	http 파일 다운로드
		 *	@param setting : {
		 *						url(string): 다운로드 url
		 *						directory(string): 다운로드 폴더
		 *						contentType(string): contentType
		 *						timeout(string): multipart body 정보
		 *						encoding(string): 인코딩
		 *						overwrite(boolean): 타임 아웃 (milliseconds)
		 *						progress(total, current, remaining, percentage): 프로그레스 정보 콜백 함수
		 *							- total(string): 다운로드 파일 사이즈
		 *							- current(string): 다운로드된 파일 사이즈
		 *							- remaining(string): 남은 파일 사이즈
		 *							- percentage(string): 진행률 퍼센트
		 *						callback(statusCode, header, fileInfo, status, error): 파일 다운로드 후 호출 될 콜백 함수
		 *							- statusCode(string): 응답 상태 코드
		 *							- header(string): 응답 헤더 정보
		 *							- fileInfo(string): 다운로드 파일 정보
		 *							- status(string): 다운로드 결과 (SUCCESS:성공, FAIL:실패)
		 *							- error(string): 오류시 메세지
		 *					}
		 */
		function download(setting) {
			if (!D.isApp) return;

			M.net.http.download(setting);
		}
		
		/** 
		 *	ftp 파일 업로드
		 *	@param setting (objcet) : ftp로 파일을 업로드 하기위한 설정정보
		 *		   setting.url (String) : ftp 접속을 위한 url				
		 *		   setting.port(String) : ftp 접속을 위한 port				
		 *		   setting.account(object) : account 정보				
		 *		   setting.account.username (String) : 접속 id				
		 *		   setting.account.password (String) : password				
		 *		   setting.target(Object) : 접속할 path				
		 *		   setting.target.localpath(String) : 단말기의 local path(upload할 file path)				
		 *		   setting.target.serverpath(String) : upload path				
		 *		   setting.finish (function) : 파일업로드 완료				
		 */		
		
		function fileupload(setting){
			if (!D.isApp) return;
			
			M.net.ftp.upload(setting);
		}
		//----- assign ------------------
		return {
			upload : upload,
			download : download,
			fileupload : fileupload
		};
	})(window.Dcore)
);