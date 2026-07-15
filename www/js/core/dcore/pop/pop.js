/******************************************************
 *  화면ID 	: 
 *  설명 	: 네이티브 팝업 제공 wrapping
 *    			- 네이티브 alert, 토스트 메세지, date 팝업
 *  작성자 	: jhKo
 *  작성일	: 2018-01-11
 *  변경로그 : 
 ******************************************************/

window.Dcore.extend('pop',
	(function (D) {
		//----- variable declaration ----
		
		
		//----- execution code ----------
		D.logger.info('pop.js');
		
		
		//----- function definition -----
		/** 
		 *	네이티브 alert, confirm 등
		 *  (confirm은 버튼 갯수로 설정 가능)
		 *	@param setting : {
		 *						title(string): 제목
		 *						message(string): 메세지
		 *						buttons(array): 버튼 문구
		 *						callback(index): 버튼 클릭 후 호출되는 콜백함수
		 *							- index(string): 선택된 버튼 index
		 *					}
		 *
		 */
		function alert(setting) {
			if (!D.isApp) return;
			
			M.pop.alert(setting);
		}
		
		/** 
		 *	토스트 메세지
		 *	@param setting : {
		 *						message(string): 토스트 메세지
		 *						showtime(string): 보여질 시간(SHORT: 짧게, LONG: 길게)
		 *					}
		 *
		 */
		function instance(setting) {
			if (!D.isApp) return;
			
			M.pop.instance(setting);
		}
		
		/** 
		 *	데이트 팝업
		 *	@param setting : {
		 *						type(string): date picker 타입
		 *										( HM12 - MMddAM (오전/오후 1~12시 0~59분),
		 *										  HM24 - MMdd (0~23시 0~59분)
		 *										  YMD - yyyyMMdd(년월일)
		 *										  YM - yyyyMM(년월)
		 *										  MMYYYY - MMyyyy(월년)
		 *										  YYYY - yyyy(년)
		 *										  MM - MM(월)
		 *										  DD - dd(일)
		 *										)
		 *						initDate(string): 초기 날짜 지정한다.(type에 따른 format string)
		 *						minDate(string): 하한 날짜 지정한다.(type에 따른 format string)
		 *						maxDate(string): 상한 날짜 지정한다.(type에 따른 format string)
		 *						interval(int): type이 HM12, HM24 일때, 분(min)의 interval(간격)을 설정할수 있다.
		 *											60을 나머지 없이 나눌수 있는 수만 동작한다. ex) 10,15,30
		 *						callback(result, setting): 버튼 클릭 후 호출되는 콜백함수
		 *							- result(object): 선택된 날짜 값
		 *							- setting(object): 입력한 setting 값
		 *					}
		 *
		 */
		function date(setting) {
			if (!D.isApp) return;
			
			M.pop.date(setting);
		}
		
		
		//----- assign ------------------
		return {
			alert : alert,
			instance : instance,
			date : date
		};
	})(window.Dcore)
);