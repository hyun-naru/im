/*******************************************************************************
 * Function List

 *******************************************************************************
 * 
 * *** 기본 포멧팅 ************************************************************
 * 
 * defaultDateDelimiter : 날짜 기본 포멧팅
 * defaultTimDelimiter  : 시간 기본 포멧팅
 * 
 * *** 날짜 처리 관련 함수 *****************************************************
 * 
 * addDate		: yyyyMMdd 타입의 날짜를 받아 년,월,일에 날짜를 더하거나 뺀다. - 변수 strReType에 'n'을 세팅하면 int형으로 리턴한다.
 * 
 * isDate		: 입력된 문자열이 YYYYMMDD의 날짜형식인지 확인한다.
 * isDate6		: 입력된 문자열이 YYYYMM의 날짜형식인지 확인한다.
 *
 * chFmDate    : 날짜 데이터 형식을 변경한다.
 * allUnFmDate : 설정한 모든 date 포멧을 뺀다.
 * setUnFmDate : date문자열에 대한 포멧팅을 삭제한다.
 * setFmDate	: YYYYMMDD 형식 문자열을 YYYY-MM-DD 형식으로 변환 - strToken 미입력시는 "-"으로 기본 파싱하며 값이 있을경우 해당값으로 파싱
 * setFmDateTime : 년월일시분초(yyyyMMddHHmmss) 를 yyyy-MM-dd HH:mm:ss 포메팅한다. 혹은 yyyyMMddHHmm를 yyyy-MM-dd HH:mm로 변경
 * 						변수 nType을 6을 세팅할경우 yyyy-MM-dd만 리턴
 * 						변수 nType을 12을 세팅할경우 yyyy-MM-dd HH:mm만 리턴
 * getDate		: 서버 날짜를 yyyyMMdd 형식으로 추출한다. - strToken 값을 줄경우 해당 구분자를 삽입한다.
 * getTime		: 서버 시간을 HHmm 형식으로 추출한다. - strToken 값을 줄경우 해당 구분자를 삽입하고, strSec 값을 줄경우 초까지 리턴
 * getDateTime	: 서버 날짜와 시간을 가져온다. yyyyMMddHHmmss형식으로 리턴한다.
 * getEtcDate  : 입력할 날짜(YYYYMMDD)를 기준으로 1일(firstDate)과 말일(lastDate)을 계산해서 Object로 반환한다.
 * getInsuAgeByRrn : 보험나이 구하기.(주민등록번호)
 * getInsuAgeByDate : 기준일의 보험나이 구하기.(생년월일 기준)
 * getLinaAge  : 입력할 날짜(YYYYMMDD)를 기준으로 주민등록번호로 보험나이를 계산한다.
 * getInsuBirthDate : 상령일 나이 구하기.(생년월일 기준)
 * getAgeAddDt : 입력할 날짜(YYYYMMDD)를 기준으로 주민등록번호로 상령일을 계산한다.
 * getDayText  : 입력할 날짜(YYYYMMDD)를 기준으로 일자에 대한 요일 텍스트를 반환한다.
 * getDateRange : 두 날짜의 차이를 일자로 구한다.(조회 종료일 - 조회 시작일)
 * getLastDay : 해당 년월의 마지막날 구하기
 * getServerTime : 로컬시간 Object를 가져 옵니다
 *
 * getRealAge : 주민번호(yyMMddxxxxxxx)를 통해 만나이를 계산합니다
 * entAgeCal : 주민번호(yyMMddxxxxxxx)를 통해 한국나이로 계산합니다.
 * seBrithYear : 주민번호(yyMMddxxxxxxx)를 생년월일(yyyyMMdd)로 변환
 *
 * *** 달력관련 함수 **********************************************************
 * 
 * chkDateStartUp	: 조회시작일과 조회종료일을 비교하여 조회 시작일이 조회종료일 이후일경우 false 리턴
 * chkDateToDay	: 조회일이 금일 이후 날짜인지 판단하여 이후일경우 false 리턴
 * chkDateGap		: 조회시작일과 조회종료일이 특정 일수 차이인지 판단하여 범위 밖일경우 false 리턴
 * 
 ******************************************************************************/

/*******************************************************************************
 * 날짜 처리 관련 함수
 ******************************************************************************/

var dateUtil = (function($, D){
	
	if(typeof stringUtil === 'undefined'){
		// StringUtil Import
		_getScript('/res/www/js/utils/stringUtil.js');
	}
	
	if(typeof validationUtil === 'undefined'){
		// ValidationUtil Import
		_getScript('/res/www/js/utils/validationUtil.js');
	}
	
	//defaultDateDelimiter = constants.getVal('DEFAULT_DATE_DELIMITER'); // 기본날짜 포멧 
	//defaultTimDelimiter  = constants.getVal('DEFAULT_TIME_DELIMITER'); // 기본시간 포멧
	defaultDateDelimiter = '-';
	defaultTimDelimiter  = ':';
	
	/**
	 * 서버 날짜와 시간을 가져온다. yyyyMMddHHmmss형식으로 리턴한다.
	 * @returns {String}
	 * @returnFormat: yyyyMMddHHmmss
	 * @returnValue: getDateTime() - 20171211101111
	 */
	function getDateTime() {
		var dtServerDate = getServerTime();
		
		var strYear = "" + dtServerDate.getFullYear();
		var strMonth = "" + (dtServerDate.getMonth() + 1);
		var strDay = "" + dtServerDate.getDate();
		var strHour = "" + dtServerDate.getHours();
		var strMinute = "" +  dtServerDate.getMinutes();
		var strSecond = "" +  dtServerDate.getSeconds();
		
		if (strMonth.length == 1) {strMonth = "0" + strMonth;}
	    if (strDay.length == 1) {strDay = "0" + strDay;}
	    if (strHour.length == 1) {strHour = "0" + strHour;}
		if (strMinute.length == 1) {strMinute = "0" + strMinute;}
		if (strSecond.length == 1) {strSecond = "0" + strSecond;}
		
		return strYear + strMonth + strDay + strHour + strMinute + strMinute;
	};
	
	/**
	 * 로컬시간 Object를 가져 옵니다
	 * TODO: 서버 시간을 로컬시간 획득으로 수정.
	 * 		 추후 변경 해야 함.
	 *  @returns {object}
	 *  @returnValue: getServerTime() - Mon Dec 11 2017 10:17:40 GMT+0900 (대한민국 표준시)
	 */
	function getServerTime() {
		var dtServerDate = null;
		dtServerDate = new Date();
		
		return dtServerDate;
	};
	
	/**
	 * 서버 시간을 HHmm 형식으로 추출한다. strToken 값을 줄경우 해당 구분자를 삽입한다. strSec 값을 줄경우 초까지 리턴
	 * 
	 * @param strToken -
	 *            String - 구분자 값
	 *            		 - ":"을 입력하면 HH:mm 형태로 리턴
	 * @param strSec -
	 *            String - "s"삽입할 경우 초단위까지 리턴하게 된다.
	 * @returns {String} - 시간형식의 문자열
	 * @returnValue: getTime(':') - 14:16
	 * 				 getTime(':','s') - 14:16:02
	 */
	function getTime(strToken, strSec) {
		var dtServerDate = getServerTime();
		
		var strHour = "" + dtServerDate.getHours();
		var strMinute = "" +  dtServerDate.getMinutes();
		var strSecond = "" +  dtServerDate.getSeconds();
		
		if (strHour.length == 1) {strHour = "0" + strHour;}
		if (strMinute.length == 1) {strMinute = "0" + strMinute;}
		if (strSecond.length == 1) {strSecond = "0" + strSecond;}
		
		var strNextToken =  stringUtil.isNull(strToken) ? defaultTimDelimiter : strToken;
	
		//strSec - "s"삽입할 경우 초단위까지 리턴하게 된다.
		if (stringUtil.chkReturn(strSec, "s") != ""){
			return strHour + strNextToken + strMinute + strNextToken + strSecond;
		}
		
		return strHour + strNextToken + strMinute;
	};
	
	/**
	 * 서버 날짜를 yyyyMMdd 형식으로 추출한다. strToken 값을 줄경우 해당 구분자를 삽입한다.
	 * 
	 * @param strToken -
	 *            String - 구분자 값
	 *            		 - "-"을 입력하면 yyyy-MM-dd 형태로 리턴
	 *            		 - "년월일"로 입력시 yyyy년 MM월 dd일 형태로 리턴
	 * @returns {String} - 날짜형식의 문자열
	 * @returnValue: getDate() - 20171211
	 * 				 getDate('-') - 2017-12-11
	 * 				 getDate('년월일') - 2017년 12월 11일
	 */
	function getDate(strToken) {
		var dtServerDate = getServerTime();
		var testYmd = D.global.getUserInfo("test_ymd");
		
		var strYear = "";
		var strMonth = "";
		var strDay = "";
		
		if(testYmd != null && testYmd != ""){
			strYear = testYmd.substring(0,4);
			strMonth = testYmd.substring(4,6);
			strDay = testYmd.substring(6,8);
		} else {
			strYear = "" + dtServerDate.getFullYear();
			strMonth = "" + (dtServerDate.getMonth() + 1);
			strDay = "" + dtServerDate.getDate();			
		}
	 
		if (strMonth.length == 1) {strMonth = "0" + strMonth;}
	    if (strDay.length == 1) {strDay = "0" + strDay;}
	    
	    var strNextToken = "";
	    if (stringUtil.chkReturn(strToken, "s") != ""){
	    	if (strToken == "년월일"){
	    		return strYear + "년 " + strMonth + "월 " + strDay + "일";
	    	} else {
	    		strNextToken = strToken;
	    	}
	    }
	    
	    return strYear + strNextToken + strMonth + strNextToken + strDay;
	};
	
	/**
	 * 입력된 문자열이 yyyyMMdd의 날짜형식인지 확인한다.
	 * 
	 * @param curdate -
	 *            String - "YYYYMMDD" 형식의 날짜 스트링
	 * @returns - {Boolean} - 날짜형식일경우 true
	 * 					  - 날짜가 아닐경우 false
	 * @returnValue: isDate(20171211) - true
	 */
	function isDate(curdate) {
		var i, year, month, day;
	
		if (!stringUtil.chkReturn(curdate) || curdate.length < 8){
			return false;
		}
	
		for (i = 0; i < curdate.length; i++) {
			if ((curdate.charAt(i) < "0") || (curdate.charAt(i) > "9")) {
				return false;
			}
		}
	
		if (stringUtil.lTrim(curdate.substring(0, 4), "0").length == 0){
			return false;
		} else {
			year = parseInt(stringUtil.lTrim(curdate.substring(0, 4), "0"), 10);
		}
	
		if (stringUtil.lTrim(curdate.substring(4, 6), "0").length == 0){
			return false;
		} else {
			month = parseInt(stringUtil.lTrim(curdate.substring(4, 6), "0"), 10);
		}
	
		if (stringUtil.lTrim(curdate.substring(6, 8), "0").length == 0){
			return false;
		} else {
			day = parseInt(stringUtil.lTrim(curdate.substring(6, 8), "0"), 10);
		}
	
		if (year == 0){
			return false;
		}
		if (month == 0 || month > 12){
			return false;
		}
	
		if (day == 0 || day > getLastDay(year, month)){
			return false;
		}
	
		return true;
	};
	
	/**
	 * 입력된 문자열이 yyyyMM의 날짜형식인지 확인한다.
	 * 
	 * @param curdate -
	 *            String - "YYYYMM" 형식의 날짜 스트링
	 * @returns - {Boolean} - 날짜형식일경우 true
	 * 					  - 날짜가 아닐경우 false
	 * @returnValue: isDate(201712) - true 
	 */
	function isDate6(curdate) {
		var i, year, month, day;
	
		if (stringUtil.chkReturn(curdate) == false || curdate.length < 6){
			return false;
		}
	
		for (i = 0; i < curdate.length; i++) {
			if ((curdate.charAt(i) < "0") || (curdate.charAt(i) > "9")) {
				return false;
			}
		}
	
		if (stringUtil.lTrim(curdate.substring(0, 4), "0").length == 0){
			return false;
		} else {
			year = parseInt(stringUtil.lTrim(curdate.substring(0, 4), "0"), 10);
		}
	
		if (stringUtil.lTrim(curdate.substring(4, 6), "0").length == 0){
			return false;
		} else {
			month = parseInt(stringUtil.lTrim(curdate.substring(4, 6), "0"), 10);
		}
	
		if (month > 12){
			return false;
		}
		
		return true;
	};
	
	/**
	 * 해당 년월의 마지막날 구하기
	 * @return - {String}
	 * @returnFormat - ##
	 * @returnValue: getLastDay(201712) - 28
	 */
	function getLastDay(year, month) {
		var day = new Date(new Date(year, month, 1)- 86400000).getDate();
		if(year == 9999){
			day = 99;
		}
		if(day.length == 1){
			day = "0"+day;
		}
		return day;
	};
	
	/**
	 * YYYYMMDD 형식 문자열을 YYYY-MM-DD 형식으로 변환 
	 * strToken 미입력시는 "-"으로 기본 파싱하며 
	 * 값이 있을경우 해당값으로 파싱
	 * 
	 * @param strDate -
	 *            String - YYYYMMDD 형식으로 문자열
	 * @param strToken -
	 *            String - "."등 형식으로 변환 원할경우 사용
	 *            		 - 미입력시 "-"로 파싱
	 *            		 - "년월일"일 경우 "YYYY년 MM월 DD일"로 리턴한다.
	 *            
	 * @returns {String} - 변경된 문자열
	 * @returnFormat YYYYMMDD or YYYY-MM-DD or YYYY년 MM월 DD일
	 * @returnValue: setFmDate('20171211') - 20171211
	 				 setFmDate('20171211','-') - 2017-12-11 
					 setFmDate('20171211', '년월일') - 2017년 12월 11일
	 */
	function setFmDate(strDate, strToken) {
	
		if (stringUtil.chkReturn(strDate, "s") == ""){
			return "";
		}
	
		var date = allUnFmDate(strDate);
		
		if (isDate6(date) == false){
			return strDate;
		} 
		
		if (date.length == 8 && isDate(date) == false) {
			return strDate;
		}
		
		var strSetToken = defaultDateDelimiter;
	
		if (stringUtil.chkReturn(strToken) == true){
			strSetToken = strToken;
		}
	
		var strYear = date.substring(0, 4);
		var strMonth = date.substring(4, 6);
		var strDay = "";
		
		if (date.length == 8){
			strDay = date.substring(6, 8);
			if (strSetToken == "년월일"){
				return strYear + "년 " + strMonth + "월 " + strDay + "일";
			} else {
				return strYear + strSetToken + strMonth + strSetToken + strDay;
			}
		}
		
		return strYear + strSetToken + strMonth;
	};
	
	/**
	 * date문자열에 대한 포멧팅을 삭제한다.
	 * @param strDate -
	 *            String - YYYY-MM-DD 형식으로 문자열
	 * @param strToken -
	 * 			  String - 삭제할 문자열 '-'
	 * @return {string}
	 * @returnFormat YYYYMMDD
	 * @returnValue: setUnFmDate('2017-12-11','-') - 20171211              
	 */
	function setUnFmDate(strDate, strToken) {
	
		if (stringUtil.chkReturn(strDate, "s") == ''){
			return '';
		}
	
		var strSetToken = defaultDateDelimiter;
	
		if (stringUtil.chkReturn(strToken) == true){
			strSetToken = strToken;
		}
	
		return stringUtil.replaceAll(strDate, strSetToken, '');
	};
	
	/**
	 * 년월일시분초(yyyyMMddHHmmss) 를 yyyy-MM-dd HH:mm:ss 포메팅한다. 혹은 yyyyMMddHHmm를
	 * yyyy-MM-dd HH:mm로 변경 변수 nType을 6을 세팅할경우 yyyy-MM-dd만 리턴 변수 nType을 12을 세팅할경우
	 * yyyy-MM-dd HH:mm만 리턴
	 * 
	 * @param strDateTime -
	 *            String - 길이 12 or 14의 문자열 혹은 숫자
	 * @param nType -
	 *            Integer - 보일 타입
	 * @returns {String} - yyyy-MM-dd HH:mm:ss 포메팅된 문자열
	 * @returnFormat yyyy-MM-dd HH:mm:ss
	 * @returnValue: setFmDateTime('20171211160202') - 2017-12-11 16:02:02
	 * 				 setFmDateTime('20171211160202', '6') - 2017-12-11
	 */
	function setFmDateTime(strDateTime, nType) {
		var strOrgDataTime = "";
		var strDate = "";
		var strTime = "";
		var nLength = 0;
		
		if (stringUtil.chkReturn(strDateTime, "s") == ""){
			return "";
		}
		
		strOrgDataTime = strDateTime + "";
		nLength = strOrgDataTime.length;
		
		if (nLength != 14 && nLength != 12){
			return strDateTime;
		}
		
		strDate = strOrgDataTime.substring(0,8);
		strDate = setFmDate(strDate);
		
		if (stringUtil.chkReturn(nType, "s") == ""){
			nType = nLength;
		} else if (nType != 12 && nType != 6){
			nType = nLength;
		}
		
		if (nType == 6){
			return strDate;
		}
		
		if (nLength == 12 || nType == 12){
			strTime = strOrgDataTime.substring(8,12);
		} else {
			strTime = strOrgDataTime.substring(8,14);
		}
		
		if (nLength == 12 || nType == 12){
			strTime = strTime.substring(0,2) + defaultTimDelimiter + strTime.substring(2,4);
		} else {
			strTime = strTime.substring(0,2) + defaultTimDelimiter + strTime.substring(2,4) + defaultTimDelimiter + strTime.substring(4,6);
		}
			
		return strDate + " " + strTime;
	};
	
	/**
	 * yyyyMMdd 타입의 날짜를 받아 년,월,일에 날짜를 더하거나 뺀다. 변수 strReType에 'n'을 세팅하면 int형으로 리턴한다.
	 * 
	 * @param strDate -
	 *            String - yyyyMMdd 형태의 날짜 스트링
	 * @param strType -
	 *            String - 더하거나 뺄 곳, 년: "y", 월: "m", 일: "d"
	 * @param nValue -
	 *            Intger - 더하건 뺄 값
	 * @param strReType -
	 *            String - 입력하지 않거나 빈스트링일경우 문자형 리턴, "n"등 입력할경우 int형 리턴
	 * @returns 문자열 혹은 number 형 yyyyMMdd 리턴
	 * @returnFormat yyyyMMdd
	 * @returnValue: addDate('20171211','y',-5,'') - 20121211
	 * 				 addDate('20171211','m',10,'n') - 20181011
	 * 				
	 */
	function addDate(strDate, strType, nValue, strReType) {
		if (isDate(strDate) == false){
			//M.pop.alert('형식이 잘못되었습니다.');
			console.warn("dateUtil : addDate 형식이 잘못되었습니다.");
			return strDate;
		}
		
		if (stringUtil.chkReturn(strType, "s") == "" || stringUtil.chkReturn(nValue, "s") == "" || jQuery.type(nValue) != "number"){
			//M.pop.alert('형식이 잘못되었습니다.');
			console.warn("dateUtil : addDate 형식이 잘못되었습니다.");
			return strDate;
		}
		 
		var nYear = parseInt(strDate.substring(0, 4), 10);
		var nMonty = parseInt(strDate.substring(4, 6) - 1, 10);
		var nDate =  parseInt(strDate.substring(6, 8), 10);
		
		if (strType == "y"){
			nYear = nYear + nValue;
		} else if (strType == "m"){
			nMonty = nMonty + nValue;
		} else if (strType == "d"){
			nDate = nDate + nValue;
		}
		
		var dtInDate = new Date(nYear, nMonty, nDate);
		var strYear = "" + dtInDate.getFullYear();
		var strMonth = "" + (dtInDate.getMonth() + 1);
		var strDay = "" + dtInDate.getDate();
		
		if (strMonth.length == 1) {strMonth = "0" + strMonth;}
	    if (strDay.length == 1) {strDay = "0" + strDay;}
		
	    if (stringUtil.chkReturn(strReType, "s") != ""){
	    	return parseInt(strYear + strMonth + strDay, 10);
	    }
	    
	    return strYear + strMonth + strDay;
	};
	
	/**
	 * 기타 날짜를 계산한다.
	 * @return {object} - object.inputDate : 입력날짜,
	 * 					- object.firstDate : 시작일
	 * 					- object.lastDate : 말일 
	 * @returnValue: getEtcDate('201706').inputDate - 201706
	 * 				 getEtcDate('201706').firstDate - 20170601
	 * 				 getEtcDate('201706').lastDate - 20170630
	 */
	function getEtcDate(inputDate) {
	
		var rtnDate = {};
	
		if(!isDate6(inputDate)) {
			M.pop.alert('입력한 형식이 날짜가 아닙니다. [Input Date : ' + inputDate + ']');
			return;
		}
	
		// 입력 날짜를 세팅한다.
		rtnDate['inputDate'] = inputDate;
	
		// 입력 날짜의 1일을 계산한다.
		var inputYearMonth = inputDate.substring(0,6);
		var firstDate = inputYearMonth + '01';
		rtnDate['firstDate'] = firstDate;
	
		// 입력 날짜의 말일을 계산한다.
		var lastDate = addDate(addDate(firstDate, "m", 1) ,'d', -1);
		rtnDate['lastDate'] = lastDate;
	
		return rtnDate;
	};
	
	
	
	/**
	 * 두 날짜의 차이를 일자로 구한다.(조회 종료일 - 조회 시작일)
	 * 
	 * @param strStartCalendarId -
	 *            조회 시작일(날짜 ex.2002-01-01)
	 * @param strEndCalendarId -
	 *            조회 종료일(날짜 ex.2002-01-01)
	 * @param strType -
	 *            String - 리턴 년: "y", 월: "m", 일: "d"
	 * @return {String} 기간에 해당하는 일자
	 * @returnValue: getDateRange('2017-12-01','2017-12-10','y') - 0
	 * 				 getDateRange('2017-12-01','2018-02-10','m') - 2
	 * 				 getDateRange('2017-12-01','2017-12-10','d') - 9
	 */
	function getDateRange(strStartCalendarId, strEndCalendarId, strType) {
		var result = "";
	    var FORMAT = defaultDateDelimiter;
	
	    // FORMAT을 포함한 길이 체크
	    if (strStartCalendarId.length != 10 || strEndCalendarId.length != 10)
	        return null;
	
	
	    // FORMAT이 있는지 체크
	    if (strStartCalendarId.indexOf(FORMAT) < 0 || strEndCalendarId.indexOf(FORMAT) < 0)
	        return null;
	
	    // 년도, 월, 일로 분리
	    var start_dt = strStartCalendarId.split(FORMAT);
	    var end_dt = strEndCalendarId.split(FORMAT);
	
	    // 월 - 1(자바스크립트는 월이 0부터 시작하기 때문에...)
	    // Number()를 이용하여 08, 09월을 10진수로 인식하게 함.
	    start_dt[1] = (Number(start_dt[1]) - 1) + "";
	    end_dt[1] = (Number(end_dt[1]) - 1) + "";
	
	    var from_dt = new Date(start_dt[0], start_dt[1], start_dt[2]);
	    var to_dt = new Date(end_dt[0], end_dt[1], end_dt[2]);
	    var interval = (to_dt.getTime() - from_dt.getTime());
	
	    // 년
	    if (strType == 'y') {
	    	result = interval / 1000 / 60 / 60 / 24 / 30 / 12;
	    // 월
	    } else if (strType == 'm') {
	    	result = interval / 1000 / 60 / 60 / 24 / 30;
	    // 일
	    } else {
	    	result = interval / 1000 / 60 / 60 / 24;
	    }
	
	    return Math.floor(result) + '';
	};
	
	/**
	 * 조회시작일과 조회종료일을 비교하여 
	 * 조회 시작일이 조회종료일 이후일경우 false 리턴 "조회시작일이 조회종료일 이후 입니다."
	 * 
	 * @param strStartDay -
	 *            String - yyyyMMdd 혹은 yyyy-MM-dd형식의 문자열
	 * @param strEndDay -
	 *            String - yyyyMMdd 혹은 yyyy-MM-dd형식의 문자열
	 * @returns {Boolean} - 정상일경우 true, 비정상일 경우 false
	 * @returnValue: chkDateStartUp('20171201', '20171202') - true
	 * 			     chkDateStartUp('2017-12-01', '2017-12-02') - true
	 * 				 chkDateStartUp('2017-12-01', '2017-11-02') - alert 발생 
	 */
	function chkDateStartUp(strStartDay, strEndDay) {
		if (stringUtil.chkReturn(strStartDay, "s") == "" || stringUtil.chkReturn(strEndDay, "s") == ""){
			M.pop.alert('날짜 형식이 잘못되었습니다.');
			return false;
		}
		
		var nStartDay = parseInt(stringUtil.replaceAll(strStartDay, defaultDateDelimiter, ""), 10);
		var nEndDay = parseInt(stringUtil.replaceAll(strEndDay, defaultDateDelimiter, ""), 10);
		
		if (nStartDay > nEndDay){
			M.pop.alert('조회시작일이 조회종료일 이후 입니다.');
			return false;
		} else {
			return true;
		}
	};
	
	/**
	 * 조회일이 금일 이후 날짜인지 판단하여 이후일경우 false 리턴
	 * 
	 * @param strDay -
	 *            String - yyyyMMdd 형식의 문자열
	 * @returns {Boolean} - 정상일경우 true, 비정상일 경우 false
	 */
	function chkDateToDay(strDay) {
		if (!isDate(strDay)) return false;

		
		var nStartDay = parseInt(strDay);
		var nEndDay = parseInt(getDate());
		
		if (nStartDay < nEndDay){
			return false;
		} else {
			return true;
		}
	};
	
	/**
	 * 조회시작일과 조회종료일이 특정 일수 차이인지 판단하여 범위 밖일경우 false 리턴 조회종료일에 특정 일수를 가감하여 조회시작일과
	 * 비교하도록 되어 있음. "조회기간을 1년 이내로 설정해 주세요."
	 * 
	 * @param strStartDay -
	 *            String - yyyyMMdd 혹은 yyyy-MM-dd형식의 문자열
	 * @param strEndDay -
	 *            String - yyyyMMdd 혹은 yyyy-MM-dd형식의 문자열
	 * @param strType -
	 *            String - y 년, m 월, d 일
	 * @param nValue -
	 *            Integer - 가감할 숫자
	 * @returns {Boolean} - 정상일경우 true, 비정상일 경우 false
	 * @returnValue: chkDateGap('20171211','20181201','d', 5) - true
	 * 				 chkDateGap('2017-12-11','2018-12-01','d', 5) - true
	 * 				 chkDateGap('20171211','20181211','d', 10) - false alert문 발생
	 */
	function chkDateGap(strStartDay, strEndDay, strType, nValue) {
		if (stringUtil.chkReturn(strStartDay, "s") == "" || stringUtil.chkReturn(strEndDay, "s") == ""){
			M.pop.alert('날짜 형식이 잘못되었습니다.');
			return false;
		}
		
		var nStartDay = parseInt(stringUtil.replaceAll(strStartDay, defaultDateDelimiter, ""), 10);
		var nEndDay = addDate(stringUtil.replaceAll(strEndDay, defaultDateDelimiter, ""), strType, nValue, "n");
		var interval = getDateRange(setFmDate(nStartDay.toString(),'-'), setFmDate(nEndDay.toString(),'-'), 'd');
		
		
		if (interval > 365){
			M.pop.alert('조회기간을 1년 이내로 설정해 주세요.');
			return false;
		} else {
			return true;
		}
	};
	
	/**
	 * 주민번호를 생년월일로 반환
	 * 
	 * @param dateString -
	 *            String - yyMMddxxxxxxx(주민번호) 혹인 yyMMddx(생년월일+성별) 형식의 문자열
	 *            
	 * @returns {string} - 정상일경우 true - yyyyMMdd 반환
	 * 					   비정상일 경우 false - alert() 발생
	 * @returnValue: seBrithYear('8803031111111') - 19880303
	 * 				 seBrithYear('8803031') - 19880303
	 */
	function seBrithYear(dateString){
		
		if((dateString.length==13)||(dateString.length==7)||(dateString.length==6)){
			var sex =dateString.substr(6,1);
			
			//현재년도 
			var nowDate = getDate();
			var nowY2 = nowDate.substr(2,2);
			var nowY1 = nowDate.substr(0,2);
			var Y1="";
			var Y2 = dateString.substr(0,2);
			
			if(Number(nowY2)<Number(Y2) && ((sex=="1")||(sex=="2")||(sex=="5")||(sex=="6"))){
				Y1 = (Number(nowY1)-1)+"";
				
			}else if(Number(nowY2)>=Number(Y2)){
				Y1 = nowY1;
			}else if((sex=="3")||(sex=="4")||(sex=="7")||(sex=="8")){
				Y1 = nowY1;
			}
			
			dateString = Y1+ dateString.substring(0,6);
			
			return dateString;
			
		}else{
			M.pop.alert('주민번호 자리수 형식이 잘못되었습니다.');
		} 
	};
	
	/**
	 * 보험 나이를 계산 합니다
	 * @param dateString -
	 *            String - yyMMddxxxxxxx(주민번호) 혹인 yyMMddx(생년월일+성별) 형식의 문자열
	 *            
	 * @returns {string} - 나이 반환
	 * @returnValue: entAgeCal('8803031111111') - 30
	 * 				 entAgeCal('8803031') - 30
	 *            
	 */
	function entAgeCal(dateString) {
	 
		dateString=stringUtil.replaceAll(dateString ,defaultDateDelimiter ,"");
		
		if(validationUtil.isJuminno(dateString.substring(0,6),1)==false){
			 
			return false;
		}
		
		if((dateString.length==13)||(dateString.length==7)||(dateString.length==6)){
			dateString = seBrithYear(dateString);
		}
	
		var toDay = getDate();
		//당일보다 크면 나이는 0으로 한다.
		if(Number(dateString) >= Number(toDay)){
			return 0;
		}
	
		var sdDate = new Date(setFmDate(toDay,"/"));
	
		var yearNow = sdDate.getFullYear(); 
		var monthNow = sdDate.getMonth(); 
		var dateNow = sdDate.getDate(); 
		 
		dateString = setFmDate(dateString,"/");
	
		var jmDate = new Date(dateString);	
		
		var yearDob = jmDate.getFullYear(); 
		var monthDob = jmDate.getMonth(); 
		var dateDob = jmDate.getDate(); 
	    
		// 기준일자와 생년월일 사이의 년수를 구함
	    var termYear    = sdDate.getFullYear() - jmDate.getFullYear();     
	    // 기준일자와 생년월일 사이의 달수를 구함
	    var termMonth   = sdDate.getMonth() - jmDate.getMonth();    
	    // 기준일자와 생년월일 사이의 달수를 구함
	    var termDay = sdDate.getDate() - jmDate.getDate();
	    
	    if( termMonth > 6 ) {
	        age = termYear + 1;
	    }else if( termMonth == 6 ) {
	        if ( termDay >= 0 ){
	        	age = termYear + 1;
	        }else {
	        	age = termYear;
	        
	        	var toLastDay = new Date(yearNow, monthNow, 0).getDate();// sdDate.getLastDayOfMonth();
		        
		        if( toLastDay == sdDate.getDate() ) {
		            if ( toLastDay <= jmDate.getDate() ) {
		            	age = termYear + 1;
		            }
		        }
	        }
	    }else if( termMonth < -6 ) {
	        age  = termYear - 1;
	    }else if( termMonth == -6 ) {
	        if ( termDay >= 0 ) {
	        	age = termYear;
	        }else {
	        	age = termYear - 1;
		        var  toLastDay =new Date(yearNow, monthNow, 0).getDate();// sdDate.getLastDayOfMonth();
		        if ( toLastDay == sdDate.getDate() ) {
		            if ( toLastDay <= jmDate.getDate() ) {
		            	age = termYear;
		            }
		        }
	        }
	    }else {
	        age = termYear;
	    }
	    return age; 
	};
	
	/**
	 * 만나이를 계산합니다 보험 가입이 만 19세부터 가입이 가능해서 
	 * 보험나이가 19세이더라도 가입이 불가능 해서 에러가 발생하는 부분이 있어
	 * 해당 로직을 추가해 보험금 확인을 불가하게 만들려고 추가합니다 
	 * @param dateString - 
	 * 					8902021(생년월일+성별)
	 * 
	 * @returns {string} - 나이 반환
	 * @returnValue: getRealAge('8803031111111') - 29
	 * 				 getRealAge('8803031') - 29
	 * 
	 */
	function getRealAge(dateString){  	
		
		if(validationUtil.isJuminno(dateString.substring(0,6),1)==false){
			return false;
		}
		
	    // 기준일자
		var sdDate = new Date(setFmDate(getDate(),"/"));
	  
	    if((dateString.length==13)||(dateString.length==7)||(dateString.length==6)){
	    	
			dateString = seBrithYear(dateString);
		}
	    
	    var	jmDate = new Date(setFmDate(dateString,"/"));	
	    
	    var age = sdDate.getFullYear() - jmDate.getFullYear();
	    
	    if ( sdDate.getMonth() < jmDate.getMonth() ) age--;
	    if ( 
	    	( sdDate.getMonth() == jmDate.getMonth() ) 
	    	&& 
	    	( sdDate.getDate() < jmDate.getDate() )
	        ) age--;
	    
	  
	    return age;
	};

	function getBirthRealAge(dateString){  	
		
		if(dateString.length != 8){
			return false;
		}
		
	    // 기준일자
		var sdDate = new Date(setFmDate(getDate(),"/"));


	    var	jmDate = new Date(setFmDate(dateString,"/"));	
	    
	    var age = sdDate.getFullYear() - jmDate.getFullYear();
	    
	    if ( sdDate.getMonth() < jmDate.getMonth() ) age--;
	    if ( 
	    	( sdDate.getMonth() == jmDate.getMonth() ) 
	    	&& 
	    	( sdDate.getDate() < jmDate.getDate() )
	        ) age--;
	    
	  
	    return age;
	};
	/**
	 * 보험나이 구하기(주민등록번호)
	 * @param rrn 주민등록번호(yyMMddxxxxxxx)	 
	 * @returns {Number}
	 */
	function getInsuAgeByRrn(rrn){
		
		var flagGNDR = stringUtil.subStr(rrn, 6, 1);
		var prefixYY = "";	
		
		if (flagGNDR == "3" || flagGNDR == "4" || flagGNDR == "7" || flagGNDR == "8"){
			prefixYY = "20";
		}
		else{
			prefixYY = "19";
		}	
		
		var fullBirthDay = setFmDate(prefixYY + stringUtil.subStr(rrn, 0, 6)); 	//생년월일 yyyy-mm-dd
		var curDate = setFmDate(stringUtil.subStr(getDateTime(), 0, 8));	//현재날짜 yyyy-mm-dd
		var age = getInsuAgeByDate(fullBirthDay, curDate);			//기준일의 보험나이
		
		return age;
	}
	
	/**
	 * 기준일의 보험나이 구하기.(생년월일)
	 * @param birthDay 생일(yyyy-mm-dd)
	 * @param queryDate 구하고자하는 시점(yyyy-mm-dd)
	 * @returns {Number}
	 */
	function getInsuAgeByDate(birthDay, queryDate){
		
	  var queryDateArray = queryDate.split('-');
	  var queryDateObject = new Date(queryDateArray[0],parseFloat(queryDateArray[1])-1,queryDateArray[2]);
	  var insuBirthDate = getInsuBirthDate(birthDay);
	  
	  //년도 차이를 구한다.
	  var age = queryDateObject.getFullYear() - insuBirthDate.getFullYear();
	  
	  //금년도 상령일을 구한다.
	  var criteriaDate = new Date(queryDateObject.getFullYear(), parseFloat(insuBirthDate.getMonth()), insuBirthDate.getDate());
	
	  //상령일이 안지났으면 1살을 뺍니다.
	  if(queryDateObject.valueOf() < criteriaDate.valueOf()) {
	  	age = age - 1;
	  }
	  return age;
	}
	
	/**
	 * 입력할 날짜(YYYYMMDD)를 기준으로 주민등록번호로 보험나이를 계산한다.
	 * @param sCntrctDt - yyyymmdd(계약일)
	 * @param sIdNo - yyyyMMddxxxxxxx(주민번호)
	 * @returns {Number}
	 */
	function getLinaAge(sCntrctDt, sIdNo){
		var sBornDt = "";
		
		if(sIdNo == undefined){
			return;
		}
		else if(sIdNo.length != "13" || sIdNo == "1111111111111") {
			return 0;
		}

		
		if (sIdNo.substring(6,7) == "3" || sIdNo.substring(6,7) == "4" || sIdNo.substring(6,7) == "7" || sIdNo.substring(6,7) == "8")
		{
		    sBornDt = "20" + sIdNo.substring(0,6);
		}
		else
		{
		    sBornDt = "19" + sIdNo.substring(0,6);
		}
	
		var nB_YYYY = parseInt(sBornDt.substring(0,4));   //생년월일의 년
		var nB_MM   = parseInt(sBornDt.substring(4,6));   //생년월일의 월
		var nB_DD   = parseInt(sBornDt.substring(6,8));   //생년월일의 일
		var nC_YYYY = parseInt(sCntrctDt.substring(0,4)); //계약일의 년
		var nC_MM   = parseInt(sCntrctDt.substring(4,6)); //계약일의 월
		var nC_DD   = parseInt(sCntrctDt.substring(6,8)); //계약일의 일
	
		if (nC_DD < nB_DD)
		{
		    nC_MM = nC_MM - 1;
		    //nC_DD = nC_DD + aMaxDay[parseInt(nC_MM)-1];
		    var day = '';
		    
		    if(isDate(sBornDt)){
		    	day = addDate(sBornDt,'m',-1);
		    }
		    
		    var rtnDate = getEtcDate(day);
		    
		    if(rtnDate['lastDate']!=undefined){
		    	nC_DD = nC_DD + rtnDate['lastDate'].substring(6,8);//aMaxDay[parseInt(nC_MM)-1];
		    }
		}
	
		if (nC_MM < nB_MM)
		{
		    nC_YYYY = nC_YYYY - 1;
		    nC_MM = nC_MM + 12;
		}
	
		var nR_YYYY = nC_YYYY - nB_YYYY;
		var nR_MM = nC_MM - nB_MM;
		var nR_DD = nC_DD - (nB_DD + 1);
	
		if (nR_MM > 5 || (nR_MM == 5 && nR_DD == 30))
		{
		 
		    return nR_YYYY + 1;
		}
		else
		{
		    return nR_YYYY;
		}
	};
	
	/**
	 * 상령일 구하기
	 * getInsuBirthDate
	 * @param birthDay 생일(yyyy-mm-dd)
	 */
	function getInsuBirthDate(birthDay){
	
		var insuBirthDateArray = birthDay.split('-');
		var insuBirthDate = new Date(insuBirthDateArray[0],parseFloat(insuBirthDateArray[1])-1,insuBirthDateArray[2]);
		insuBirthDate.setMonth(insuBirthDate.getMonth()-6);
	
		//생일의 일자와 계산된 상령일의 일자가 다를경우 29.30,31 문제가 발생되고 다음달로 밀리는 현상이 있으므로 다음조건일때는 다음달 1일이 상령일임.
		if(new Date(insuBirthDateArray[0],parseFloat(insuBirthDateArray[1])-1,insuBirthDateArray[2]).getDate() != insuBirthDate.getDate()) {
			insuBirthDate.setDate(1);
		}
		return insuBirthDate;
	}
	
	/**
	* 상령일(보험연령이 한살 더해지는 일자) 계산 
	* 상령일 = (현재년(6월이후생일은 -1년)+생월+생일)+6개월(현재일자보다 작으면 +6을 더한다)
	* @param {string} sIdNo 주민번호
	* @param {string} pDate 설계일기준
	* @return {string} 상령일
	* @memberOf form.global
	*/
	function getAgeAddDt(sIdNo, pDate) {
	    var sDt    = "";
	    var sToDay = getDate();  
	    var syyyy  = Number(sToDay.substring(0,4));
	    var sDate  = "";
	
	    if (sIdNo.substring(2,4) > '06') 
	    {
	     sDt = String(syyyy-1) + sIdNo.substring(2,6);
	    } else {
	     sDt = String(syyyy) + sIdNo.substring(2,6);
	    }
	
	    if(isDate(sDt)){
	    	sDate = addDate(sDt,'m', 6);
		}
	    if (pDate) sToDay = pDate; //설계일기준으로 상령일 산정
	
	    if ( sDate <= sToDay ) 
	    {
	    	if(isDate(sDate)){
	    		sDate = addDate(sDate,'m', 12);
	    	}
	    }
	
	    return sDate;
	};

	/**
	* 상령일 구하기
	* @param {string} sIdNo 주민번호
	* @param {string} pDate 설계일기준
	* @return {string} 상령일
	* @memberOf form.global
	*/
	function getPcaymd(sIdNo, pDate) {
		var pcaymd = '';

		if (sIdNo.length > 6) {
			if (!pDate) pDate = getDate();
			pDate = setFmDate(pDate, '-');

			var stDate = sIdNo.substr(0,6);
			var gender = sIdNo.substr(6,1);
			
			stDate = gender == '1' || gender == '2' || gender ==  '5' || gender == '6' ? '19' + stDate : '20' + stDate;
			
			var year = stDate.substr(0,4);
			var month = stDate.substr(4,2);
			var date = stDate.substr(6,2);
			
			var pcaAge = getInsuAgeByDate(year+'-'+month+'-'+date, pDate); // 보험나이
			
			var dtInDate = new Date(parseInt(year) + pcaAge + 1, parseInt(month) -7, date);
			
			year = dtInDate.getFullYear().toString();
			month = dtInDate.getMonth() + 1 > 9 ? (dtInDate.getMonth() + 1).toString() : '0' + (dtInDate.getMonth() + 1);
			date = dtInDate.getDate() > 9 ? dtInDate.getDate().toString() : '0' + dtInDate.getDate();

			//pcaymd = dtInDate.toISOString().substring(0,10).replace(/-/g, '');
			pcaymd = year + month + date;
		}

		return pcaymd;
	}
	
	/**
	 * 요일 텍스트를 반환한다.
	 * @param strDate -
	 * 				yyyyMMdd 혹은 yyMMdd 혹은 yyyy-MM-dd 형식의 문자열
	 * 
	 * @returns {String} 영문자 요일
	 * @returnValue: getDayText('2017-12-13') - Wednesday
	 * 				 getDayText('20171212') - Tuesday
	 * 				 getDayText('171212') - Tuesday
	 */
	function getDayText(strDate) {
		var cDate = new Date(setFmDate(strDate,"/"));
		switch(cDate.getDay()) {
			case 0:
				return 'Sunday';
				break;
			case 1:
				return 'Monday';
				break;
			case 2:
				return 'Tuesday';
				break;
			case 3:
				return 'Wednesday';
				break;
			case 4:
				return 'Thursday';
				break;
			case 5:
				return 'Friday';
				break;
			case 6:
				return 'Saturday';
				break;
		}
		
		return '';
	};
	
	/**
	 * 설정한 모든 date 포멧을 뺀다.
	 * @param orgDate - 
	 * 				yyyy-MM-dd 혹은	yyyy.mm.dd 혹은 yyyy/mm/dd 형식의 포멧을 제거한다.
	 * 				
	 * @returns	{String} - yyyyMMdd 형식으로 전환
	 * @returnValue: allUnFmDate('2017-12-13') - 20171213
	 * 				 allUnFmDate('2017.12.13') - 20171213
	 * 				 allUnFmDate('2017/12/13') - 20171213
	 */
	function allUnFmDate(orgDate) {
	
		var rtnDate = stringUtil.replaceAll(orgDate, "-", ""); 
		rtnDate = stringUtil.replaceAll(rtnDate, ".", "");
		rtnDate = stringUtil.replaceAll(rtnDate, "/", "");
	
		return rtnDate;
	};
	
	/**
	 *  날짜 데이터 형식을 변경한다.
	 * @param strDate - 
	 * 				yyyyMMdd 형식에서  MMddyyyy 형식으로 변경
	 * @returns {String}
	 * @returnValue: chFmDate(20171213) - 12-13-2017
	 */
	function chFmDate(strDate, strToken) {
		var date = allUnFmDate(strDate);
		var dateY, dateM, dateD, strNextToken = '';
		
		if(!stringUtil.isNull(strToken)){
			strNextToken = strToken;
		}
		
		//yyyyMMdd 형식
		if(date.length == 8) {
			dateY = date.substring(0,4);
			dateM = date.substring(4,6);
			dateD = date.substring(6,8);
		//yyMMdd 형식
		} else if(date.length == 6){
			dateY = date.substring(0,2);
			dateM = date.substring(2,4);
			dateD = date.substring(4,6);
		} else {
			M.pop.alert('날짜 형식이 잘못되었습니다.');
			return false;
		}
		
		date = dateM + strNextToken + dateD + strNextToken + dateY;	
		return date;
	};

	/**
	 *  날짜 포맷팅
	 *  @param dateString : 날짜 문자열
	 *  @param format : 포맷 형태
	 */
	function dateFormatting(dateString, format) {
		var date = getDateObject(dateString);
		var h = date.getHours();
		if (h > 12) h = h - 12;
		
		var z = {
			M: date.getMonth() + 1,
			d: date.getDate(),
			H: date.getHours(),
			h: h,
			m: date.getMinutes(),
			s: date.getSeconds()
		};
		
		format = format.replace(/M+|d+|H+|h+|m+|s+/g, function(v) {
			return ((v.length > 1 ? '0' : '') + eval('z.' + v.slice(-1))).slice(-2);
		});
		
		return format.replace(/(y+)/g, function(v) {
			return date.getFullYear().toString().slice(-v.length);
		});
	}
	
	/**
	 *  date 객체 리턴
	 *  @param dateString : 날짜 문자열
	 */
	function getDateObject(dateString) {
		var v;
		
		dateString = String(dateString);
		dateString = dateString.replace(/[^0-9]/g, '');	// 숫자가 아닌 문자 제거
		
		// '201801'
		if (dateString.length == 6) {
			v = dateString.substring(0, 4) + '-' + dateString.substring(4) + '-' + '01';
		}
		// '20180102'
		else if (dateString.length == 8) {
			v = dateString.substring(0, 4) + '-' + dateString.substring(4, 6) + '-' + dateString.substring(6); 
		}
		// '20180102130102'
		else if (dateString.length == 14) {
			v = dateString.substring(0, 4) + '-' + dateString.substring(4, 6) + '-' + dateString.substring(6, 8);
			v += ' ' +dateString.substring(8, 10) + ':' + dateString.substring(10, 12) + ':' + dateString.substring(12);
		}
		// 그외 (현재 시간 date 객체 생성)
		else {	
			return new Date();
		}
		
		return new Date(v);
	}
	
	
	return {
		getDateTime : getDateTime,
		getServerTime : getServerTime,
		getTime : getTime,
		getDate : getDate,
		isDate : isDate,
		isDate6 : isDate6,
		getLastDay : getLastDay,
		setFmDate : setFmDate,
		setUnFmDate : setUnFmDate,
		setFmDateTime : setFmDateTime,
		addDate : addDate,
		getEtcDate : getEtcDate,
		getDateRange : getDateRange,
		chkDateStartUp : chkDateStartUp,
		chkDateToDay : chkDateToDay,
		chkDateGap : chkDateGap,
		seBrithYear : seBrithYear,
		entAgeCal : entAgeCal,
		getRealAge : getRealAge,
		getBirthRealAge : getBirthRealAge,
		getInsuAgeByRrn : getInsuAgeByRrn,
		getInsuAgeByDate : getInsuAgeByDate,
		getLinaAge : getLinaAge,
		getInsuBirthDate : getInsuBirthDate,
		getAgeAddDt : getAgeAddDt,
		getDayText : getDayText,
		allUnFmDate : allUnFmDate,
		chFmDate : chFmDate,
		dateFormatting : dateFormatting,
		getDateObject : getDateObject,
		getPcaymd : getPcaymd
	};

})(jQuery, window.Dcore);