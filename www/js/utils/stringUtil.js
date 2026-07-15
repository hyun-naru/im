/*******************************************************************************
 * Function List
 *******************************************************************************
 * 
 * *** 문자열 관련 함수 ********************************************************
 * 
 * isNull 		: 문자열 공백여부 체크(빈값 체크)
 * nvl 			: nvl 처리
 * 
 * allTrim 		: 모든 space를 삭제함
 * lTrim		: 문자열 좌측의 공백 제거 처리 함수 (null, undefined, 빈스트링일경우 빈스트링 return)
 * mTrim		: 문자열 중간의 공백 제거 처리 함수 (null, undefined, 빈스트링일경우 빈스트링 return)
 * rTrim		: 문자열 우측의 공백 제거 처리 함수 (null, undefined, 빈스트링일경우 빈스트링 return)
 * trim			: 공백 제거(좌우) 처리 함수 (null, undefined, 빈스트링일경우 빈스트링 return)
 * 
 * replaceAll	: 문자열 치환
 * subStr		: 입력된 str을 입력받은 시작위치 부터 자를길이까지 잘라서 return 한다.
 * subStrL		: 입력된 str을 입력받은 길이만큼 왼쪽에서부터 잘라서 return 한다.
 * subStrR		: 입력된 str을 입력받은 길이만큼 오른쪽에서부터 잘라서 return 한다.
 * 
 * getBankNm	: 은행명칭의 '(' 앞자리 명칭을 얻는다.
 * setZero		: 좌측에 0 채우기
 * setStrCutDot : 일정길이 만큼 텍스트를 잘라내고 접미어를 붙인다.
 * getNumType	: 입력데이터가 숫자이거나 숫자형 문자열일 경우 숫자를 반환
 * makeHanNum	: 입력된 숫자를 한글단위로 만든다 입력
 * getStrMappingForData : @{key} 안에 key 값과 데이터(JSON Object)와 매칭해서 출력한다. 
 * tokenStr		: 입력받은 문자열을 지정된 기호로 처음(F), 중간(M), 끝(L) 으로로 문자를 리턴시킨다.
 * 
 * rmSpecialChar: 특수문자 제거(~!##$^&*=+|:;?"<,.>')
 * isFloat		: 입력된 문자열이 숫자와 '.'으로만 이루어져 있는지 비교
 * chkReturn	: 입력된 data가 null, undefined 인지 체크 판단
 * isDigit		: 입력된 문자열이 숫자로 이루어져 있는지 비교
 * setTelFormat	: 전화번호 형식으로 포맷 변환
 * getDigit		: 문자열 중 숫자값만 반환
 * 
 * *** Json 변환 관련 함수 ****************************************************
 * 
 * jsonStringify		: JSONObject,JSONArray -> String 형태로 변경
 * jsonObjectStringify	: JSONObject -> String 형태로 변경
 * jsonArrayStringify	: JSONArray -> String 형태로 변경
 * parseCarriageReturn  : json string 안에 있는 \r\n을 \\r\\n 으로 치환 후 jsonObject로 반환
 * 
 ******************************************************************************/

var stringUtil = (function($, D){
	
	/**
	 * 문자열 공백여부 체크(빈값 체크)
	 * 
	 * @param strParam
	 * 
	 * @returns {boolean} null일 때 : true
	 * 					  null이 아닐 때 : false
	 * @returnValue: isNull('') - true
	 */
	function isNull(strParam) {
		// if(typeof(strParam) == null || strParam == ""|| typeof(strParam) == "undefined")
		return ( strParam == null  || strParam == "" || strParam == "undefined" ) ? true : false;
	};
	
	/**
	 * nvl 처리
	 * 
	 * @param ogStr null 유무 확인 문자
	 * @param rpStr null일 경우 변환 문자
	 * 
	 * @returns {String}
	 * @returnValue: 
	 */
	function nvl(ogStr, rpStr) {
		
		if (isNull(ogStr)) {
			return rpStr;
		} else {
			return ogStr;
		}
		
	};
	
	/**
	 * 모든 space를 삭제함
	 * @param source
	 * @returns {String}
	 * @returnValue: @returnValue: mTrim(' 가나 다 ') - '가나다'
	 */
	function allTrim(source) {
	
		if ( ! isNull(source)) {
			var spaces = /\s/g;
			return source.replace(spaces, '');
		} else {
			return source;
		}
	};
	
	/**
	 * 문자열 좌측의 공백 제거 처리 함수 (null, undefined, 빈스트링일경우 빈스트링 return)
	 * 
	 * @param strParam
	 * @returns {String}
	 * @returnValue: lTrim(' 가나 다 ') - '가나 다 '
	 */
	function lTrim(strParam) {
		if (chkReturn(strParam, "s") == ""){
			return "";
		}
		
		while (strParam.substring(0, 1) == ' '){
			strParam = strParam.substring(1, strParam.length);
		}
			
		return strParam;
	};
	
	/**
	 * 문자열 중간의 공백 제거 처리 함수 (null, undefined, 빈스트링일경우 빈스트링 return)
	 * 
	 * @param strParam
	 * @returns {String}
	 * @returnValue: mTrim(' 가나 다 ') - '가나다'
	 */
	function mTrim(strParam) {
		if (chkReturn(strParam, "s") == ""){
			return "";
		}
		
		for ( var i = 0; i < strParam.length; i++) {
			if (strParam.substring(i, i + 1) == ' ')
				strParam = strParam.substring(0, i) + strParam.substring(i + 1, strParam.length);
		}
		return strParam;
	};
	
	/**
	 * 문자열 우측의 공백 제거 처리 함수 (null, undefined, 빈스트링일경우 빈스트링 return)
	 * 
	 * @param strParam
	 * @returns {String}
	 * @returnValue: rTrim(' 가나 다 ') - ' 가나 다'
	 */
	function rTrim(strParam) {
		if (chkReturn(strParam, "s") == ""){
			return "";
		}
		
		while (strParam.substring(strParam.length - 1, strParam.length) == ' ')
			strParam = strParam.substring(0, strParam.length - 1);
		return strParam;
	};
	
	/**
	 * 공백 제거(좌우) 처리 함수 (null, undefined, 빈스트링일경우 빈스트링 return)
	 * 
	 * @param strParam
	 * @returns {String}
	 * @returnValue: trim(' 가나 다 ') - '가나 다'
	 */
	function trim(strParam){
		if (chkReturn(strParam, "s") == ""){
			return "";
		}
		
		var strReData = "";
		strReData = lTrim(strParam);
		strReData = rTrim(strReData);
		
		return strReData;
	};
	
	/**
	 * 문자열 치환
	 * 
	 * @param strString -
	 *            String - 대상 문자열
	 * @param strChar -
	 *            String - 변경할 문자열
	 * @param strNext -
	 *            String - 변경될 문자열
	 *            
	 * @returns {String} - 변경된 문자열
	 * @returnValue: replaceAll(' -가나-다 ','-','') - '가나다'
	 */
	function replaceAll(strString, strAfter, strNext) {
		
		if (chkReturn(strString) == false){
			return "";
		}
		
		if (chkReturn(strAfter, "s") == "" || chkReturn(strNext) == false){
			return strString;
		}
		
		var tmpStr = strString;  
		while(tmpStr.indexOf(strAfter) != -1) {
			tmpStr = tmpStr.replace(strAfter, strNext);
		}
		return tmpStr; 
	};
	
	/**
	 * 입력된 str을 입력받은 시작위치 부터 자를길이까지 잘라서 return 한다.
	 * 
	 * @param str -
	 *            String - 대상 문자열
	 * @param staLen -
	 *            Integer - 시작위치
	 * @param endLen -           
	 *            Integer - 자를 길이
	 * @returns {String}
	 * @returnValue: subStr('가나다라','0','2') - 다라
	 * 				 subStr('가나다라','2') - 가나다라
	 */
	function subStr(str,staLen, endLen){
		if (chkReturn(str) == false || chkReturn(staLen, "s") == "" || chkReturn(endLen, "s") == "" ){
			return str;				
		}
		str = str.substr(staLen, endLen);
		return str;						
	};
	
	
	/**
	 * 입력된 str을 입력받은 길이만큼 왼쪽에서부터 잘라서 return 한다.
	 * 
	 * @param str -
	 *            String - 대상 문자열
	 * @param len -
	 *            Integer - 자를 길이
	 * @returns {String}
	 * @returnValue: subStrL('가나다라마바','2') - 가나
	 */
	function subStrL(str, len) {
		if (chkReturn(str) == false || chkReturn(len, "s") == ""){
			return "";
		}
		
		str = str.substr(0, len);
		return str;
	};
	
	
	/**
	 * 입력된 str을 입력받은 길이만큼 오른쪽에서부터 잘라서 return 한다.
	 * 
	 * @param str -
	 *            String - 대상 문자열
	 * @param len -
	 *            Integer - 자를 길이
	 * @returns {String}
	 * @returnValue: subStrR('가나다라마바','2') - 마바
	 */
	function subStrR(str, len) {
		if (chkReturn(str) == false || chkReturn(len, "s") == ""){
			return "";
		}
		
		str = str.substr(str.length - len, str.length);
		return str;
	};
	
	/**
	 * 은행명칭의 '(' 앞자리 명칭을 얻는다.
	 * 
	 * @param strData
	 * @returns {String}
	 * @returnValue: getBankNm('SC(스탠다드차타드)') - SC
	 * 				getBankNm('국민') - 국민
	 */
	function getBankNm(strData){
		
		if (chkReturn(strData, "") == ""){
			return "";
		}
		
		if (strData.indexOf("(") != -1){
			return strData.split("(")[0];
		}
		
		return strData;
		
	};
	
	/**
	 * 좌측에 0 채우기
	 * 
	 * @param input
	 *            숫자 (문자열 또는 숫자)
	 * @param cipher
	 *            자릿수 (10자리이면 10입력)
	 * @returns {String} 55 입력 10자리로 호출시 0000000055를 리턴
	 * @returnValue: setZero(55,5) - 00055
	 * 				 setZero('55',6) - 000055
	 */
	function setZero(input, cipher){
		if(isNaN(input)){
			return input;
		}
		input 			= String(input);
		var inputLen 	= input.length; // 입력값 자릿수
		var zeroLen 	= cipher - inputLen;
		
		if(zeroLen <= 0){
			return input;
		}
		
		var zeroStr = "";
		for(var i=0; i<zeroLen; i++){
			zeroStr += "0";
		}
		return zeroStr + input;
	
	};
	
	/**
	 * 일정길이 만큼 텍스트를 잘라내고 접미어를 붙인다.
	 * @param strTxt	- String - 문자열
	 * @param nCutLng	- Integer - 잘라낼 길이
	 * @param strReTxt	- String - 접미어 : 미입력시 '...'
	 * 
	 * @returns {String}
	 * @returnValue: etStrCutDot('가나다라마바사', '4') - 가나다라...
	 * 				 etStrCutDot('가나다라마바사', '4','.') - 가나다라.
	 */
	function setStrCutDot(strTxt, nCutLng, strReTxt){
		var strText = chkReturn(strTxt, "s");
		var nCutLeng = chkReturn(nCutLng, "n");
		var strReText = chkReturn(strReTxt, "s", "...");
		var nStrTextLen = strText.length;
		
		if (nCutLeng == 0 || nStrTextLen < nCutLeng){
			return strText;
		}
		
		return strText.substring(0, nCutLeng) + strReText;
	};
	
	
	
	/**
	 * 입력데이터가 숫자이거나 숫자형 문자열일 경우 숫자를 반환, 그외의 경우 0을 반환하는 함수 0으로 반환되는 경우 null,
	 * undefined, 문자열이면서 숫자형태가 아닌 데이터, 오브젝트 등.
	 * 
	 * @param num
	 * @returns {Number}
	 * @returnValue:  getNumType('4') - 4
	 */
	function getNumType(num) {
		var returnNum = 0;
	
		if(!isNaN(num)){
			returnNum = Number(num);
		}
		return returnNum;
	};
	
	
	/**
	 * 입력된 숫자를 한글단위로 만든다 입력 
	 * 	: 숫자, 또는 숫자형 문자, 단위 출력 
	 *  : 한글숫자 예) 111 입력시 백십일 출력
	 * 
	 * @param str
	 *            숫자, 또는 숫자형 문자
	 * @param unit
	 *            단위. 1000 입력후 111 입력시 십일만천 출력
	 * @returns {String}
	 * @returnValue: makeHanNum('9999',1000) - 구백구십구만구천
	 * 				 makeHanNum('9999',1) - 구천구백구십구
	 */
	function makeHanNum(str, unit) {
		// 단위 배열
		var unitTen 	= ["","일","이","삼","사","오","육","칠","팔","구"];// 십단위 10 (0~9)
		var unitTenThd 	= ["","십","백","천"];// 만단위수
		var unitLimit 	= ["","만","억","조","경","해"];// 이후단위 가변적 - 한계단위수
		var hanAmt 		= "";//
		
		str = String(str).replace(/[^0-9]/g,"");// 금액등의 입력에 대한 체크로 입력데이터를 숫자로 치환
		str = unit == undefined ? str : String(str * unit);
		strLen = str.length;// 숫자 자리수
	
		var curUnitTenThd	= 0;// 최초단위의 만단위수
		var curUnitLimit 	= 0;// 최초단위의 한계단위수
		
		var limitViewCnt = 0;		// 현재 변환중인 자릿수 저장
		var limitViewFlag = [false,true,true,true,true,true];	// 만단위를 표시할지에 대한 플래그
		
		// 숫자의 가장 뒷자리 부터 숫자를 체크하여 한글로 바꾼다)
		for(var i = strLen-1;i >= 0; i--){
			var limitFlag 	= curUnitLimit % 4 == 0 ? 1 : 0;// 한계단위 체크 1일경우 만단위 출력하는
															// 경우
			var curUT 		= Number(str.charAt(i));// 10단위
			var curUTT 		= curUT == 0 ? 0 : curUnitTenThd % 4;// 10000단위
			var curUL		= parseInt(curUnitLimit / 4, 10) * limitFlag;// 한계단위
			
			// 만단위 (10,000~99,990,000)의 숫자가 없을경우 억단위 이상일경우 '만'을 지워주기 위한 처리
			if(curUT != 0){
				limitViewFlag[parseInt(limitViewCnt/4, 10)] = false;
			}
			
			if(curUT == 1 && limitFlag == 0) curUT = 0;
			
			hanAmt 	= unitTen[curUT] 
					+ unitTenThd[curUTT] 
					+ unitLimit[curUL] 
					+ hanAmt;
			
			curUnitTenThd++;
			curUnitLimit++;
			limitViewCnt++;
		}
		// 만단위 삭제여부에 따라 치환
		for(var i=1; i<limitViewFlag.length; i++){
			if(limitViewFlag[i]){
				hanAmt = hanAmt.replace(unitLimit[i], '');
			}
		}
		return hanAmt;
	};
	
	
	/**
	 * @{key} 안에 key 값과 데이터(JSON Object)와 매칭해서 출력한다. 
	 */
	function getStrMappingForData(orgStr, objJson) {
		var rtnStr = orgStr;
	
		var reg = /\@\{[^{}]*\}/g;   // @{key} 매칭
		var matchArr = rtnStr.match(reg);
		
		if(objJson != null && matchArr != null) {
			matchArr.forEach(function(matchStr) {
				var idx = rtnStr.indexOf(matchStr);
				var rtnArr = [];
				rtnArr.push(rtnStr.substring(0, idx));
				rtnArr.push(objJson[matchStr.substring(2, matchStr.length-1)]); // key에 맞는 데이터를 꺼낸다.
				rtnArr.push(rtnStr.substring(idx + matchStr.length));
				rtnStr = rtnArr.join('');
			});
		}
	
		return rtnStr;
	};
	
	
	/**
	 * 입력받은 문자열을 지정된 기호로 처음(F), 중간(M), 끝(L) 으로로 문자를 리턴시킨다.
	 * 
	 * @param str - 입력 문자열
	 *            String - 대상 문자열
	 * @param strToken - 자를 기호 
	 *            String - 대상 문자열
	 * @param telCd - F:처음, M:중간, L:끝
	 *            String - 대상 문자열            
	 *
	 * @returns {String}		 
	 * @returnValue: tokenStr('053-111-2222','-','F') - 053
	 * 				 tokenStr('053-111-2222','-','M') - 111
	 * 				 tokenStr('aaaa@naver.com','@','M') - naver.com
	 */
	function tokenStr(str,strToken,telCd){	
		if (chkReturn(str, "s") == ""){				
			return "";
		}
		if("F" == telCd){
			return str.split(strToken)[0];				
		}else if("M" == telCd){
			return str.split(strToken)[1];				
		}else if("L" == telCd){
			return str.split(strToken)[2];				
		}else{
			return "";
		} 						
	};
	
	
	/**
	 * 특수문자 제거(~!##$^&*=+|:;?"<,.>')
	 * @param val - String
	 * @returns {String}
	 * @returnValue chkStrVal("053#111#2222") - 0531112222
	 * 				chkStrVal("053-111-2222") - 053-111-2222
	 */
	function rmSpecialChar(val){	
		var	specialStr = /[~!##$^&*=+|:;?"<,.>']/;
		
		if(val == "undefined" || val == null){
			val = "";
		}
		return val.split(specialStr).join("");
	};
	
	/**
	 * 입력된 문자열이 숫자와 '.'으로만 이루어져 있는가? 빈스트링은 문자로 본다.
	 * 
	 * @param strNum
	 * @returns {Boolean}
	 */
	function isFloat(strNum) {
		// null, undefined, 빈스트링 체크
		if (chkReturn(strNum, "s") == ""){
			return false;
		}
		
		var cnt = 0;
		strNum = strNum + "";
		
		for (var i = 0; i < strNum.length; i++) {
			// Check that current character is number.
			var c = strNum.charAt(i);
	
			if (!isDigit(c)) {
				return true;
				if (c == "."){
					if (cnt > 1){return false;}
					else {cnt++;}
				} else {
					return false;
				}
			}
		}
	
		return true;
	};
	
	/**
	 * 입력된 data가 null, undefined 인지 체크 판단하여 key 값에 따른 값을 리턴한다.
	 * 
	 * @param data
	 *            체크할 data
	 * @param strReKey
	 *            입력안할 경우 : 정상일경우 true, 비정상일 경우 false b : 정상일 경우 true, 비정상일 경우 false
	 *            s : 정상일 경우 입력된 data 반환, 비정상일 경우 빈스트링 반환 n : 정상일 경우 입력된 data 반환,
	 *            비정상일 경우 0 반환
	 * @param returnData
	 *            비정상일경우 리턴할 data
	 * @param rePlusEnd -
	 *            String - 접미어 설정 strReKey 값이 "s"일경우 입력된 값이 정상일 경우 접미어를 붙여서 리턴
	 *            비정상이거나 빈스트링일 경우 returnData 값을 리턴
	 */
	function chkReturn(data, strReKey, returnData, rePlusEnd) {
		
		var strType = jQuery.type(data);
		var bCheck = true;
		var bReturnData = true;
		var bRePlusEnd = false;
		var strRePlusEnd = "";
		
		if (strType == "null" || strType == "undefined") {
				bCheck = false;
		}
		
		if (jQuery.type(returnData) == "null" || jQuery.type(returnData) == "undefined"){
			bReturnData = false;
		}
		
		strType = jQuery.type(strReKey);
		
		if (strType == "null" || strType == "undefined" || strReKey == "b" || strReKey == "") {
			return bCheck;
		}
		
		if (rePlusEnd != null && rePlusEnd != undefined) {
			bRePlusEnd = true;
			strRePlusEnd = rePlusEnd;
		}
		
		if (bCheck == true) {
			if (strReKey == "s"){
				if (bRePlusEnd == true && data == ""){
					return returnData;
				} else if (bRePlusEnd == true){
					return data + strRePlusEnd;
				} else {
					if (data == "" && bReturnData == true){
						return returnData;
					} else {
						return data + "";
					}
					
				}
			} else {
				return data;
			}
		} else {
			if (strReKey == "s") {
				if (bReturnData){
					return returnData;
				} else {
					return "";
				}
			} else if (strReKey == "n") {
				if (bReturnData){
					return returnData;
				} else {
					return 0;
				}
			}
		}
		
		return bCheck;
	};
	
	/**
	 * 입력된 문자열이 숫자로 이루어져 있는가? 빈스트링은 문자로 본다.
	 * 
	 * @returns {Boolean}
	 */
	function isDigit(strNum) {
		// null, undefined, 빈스트링 체크
		if (chkReturn(strNum, "s") == ""){
			return false;
		}
		
		var len = strNum.length;
		var c;
		
		for (var i = 0; i < len; i++) {
			c = strNum.charAt(i);
			if ((i == 0 && c == '-') || (c >= '0' && c <= '9')){
				;
			} else{
				return false;
			}
		}
		
		return true;
	};
	
	/**
	 * JSON.stringify > IE 500에러 발생으로 인한 직접변경
	 * JSONObject,JSONArray -> String 형태로 변경
	 * 첫번째 key가 0 또는 "0" 또는 number타입일경우 Array로판별
	 * @returns {Boolean}
	 */
	function jsonStringify(json, step){
		
		var jsonType = "object";
		
		if(typeof(json)!="object"){
			jsonType = "none";
		} else {
			for(var key in json){
				
				if(key=="0"||key==0||typeof(key)=="number"){
					jsonType = "array";
				}
				break;
				
			}
		}
		
		var returnVal = "";
		
		if(isNull(json)){
			returnVal = "";
		} else if(jsonType=="object"){
			returnVal = jsonObjectStringify(json);
		} else if(jsonType=="array"){
			returnVal = jsonArrayStringify(json);
		} else {
			returnVal = json;
		}
		
		if(isNull(step)&&returnVal=="\"\""){
			returnVal = "";
		}
		
		return returnVal;
		
	};
	
	/**
	 * JSONObject -> String 형태로 변경
	 * jsonObject
	 * @return {String}
	 */
	function jsonObjectStringify(jsonObject){
		
		jsonStr = "";
		
		$.each(jsonObject, function(key, value){
			
			jsonStr += "\""+key+"\"";
			jsonStr += ":";
			
			if(isNull(value)){
				jsonStr += "\"\"";
			} else if(typeof(value)=="object"){
				jsonStr += jsonStringify(value, "step");
			} else {
				if(typeof(value)=="string"){
					jsonStr += "\""+value+"\"";
				} else {
					jsonStr += value;
				}
			}
			
			jsonStr += ",";
			
		});
		
		jsonStr = jsonStr.substr(0, jsonStr.length-1);
		
		if(isNull(jsonStr)){
			return "\"\"";
		} else {
			return "{"+jsonStr+"}";
		}
		
	};
	
	/**
	 * JSONArray -> String 형태로 변경
	 * jsonArray
	 * @return {String}
	 */
	function jsonArrayStringify(jsonArray){
		
		jsonStr = "";
		
		$.each(jsonArray, function(key, value){
			
			if(isNull(value)){
				jsonStr += "\"\"";
			} else if(typeof(value)=="object"){
				jsonStr += jsonObjectStringify(value);
			} else if(typeof(value)=="string"){
				jsonStr += "\""+value+"\"";
			} else {
				jsonStr += value;
			}
			
			jsonStr += ",";
			
		});
		
		jsonStr = jsonStr.substr(0, jsonStr.length-1);
		
		return "["+jsonStr+"]";;
		
	};
	
	
	/**
	 * json string 안에 있는 \r\n을 \\r\\n 으로 치환 후 jsonObject로 반환
	 * @param jsonString : json 문자열
	 * @return json object
	 */
	function parseCarriageReturn(jsonString) {
		jsonString = String(jsonString);
		
		return JSON.parse(jsonString.replace(/\r/g, '\\r').replace(/\n/g, '\\n'));
	}

	/**
	 * 전화번호 형식으로 포맷
	 * @param str -
	 * 			String - 대상 문자열
	 * @returns {String}
	 * @returnValue telString('0531112222') - 053-111-2222 	 
	 */
	function setTelFormat(value) {
		if (!value || value == '') return '';

		return value.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
	}
	
	/**
	 * 입력된 문자열의 숫자값만 반환, 빈스트링은 문자로 본다.
	 * 
	 * @returns {Boolean}
	 */
	function getDigit(str) {
		
		var rs = "";
		var len = str.length;
		var c;
		
		for (var i = 0; i < len; i++) {
			c = str.charAt(i);
			if ((i == 0 && c == '-') || (c >= '0' && c <= '9')){
				rs += c;
			} 
		}
		
		return rs
	};
	
	return {
		isNull : isNull,
		nvl : nvl,
		allTrim : allTrim,
		lTrim : lTrim,
		mTrim : mTrim,
		rTrim : rTrim,
		trim : trim,
		replaceAll : replaceAll,
		subStr : subStr,
		subStrL : subStrL,
		subStrR : subStrR,
		getBankNm : getBankNm,
		setZero : setZero,
		setStrCutDot : setStrCutDot,
		getNumType : getNumType,
		makeHanNum : makeHanNum,
		getStrMappingForData : getStrMappingForData,
		tokenStr : tokenStr,
		rmSpecialChar : rmSpecialChar,
		isFloat : isFloat,
		chkReturn : chkReturn,
		isDigit : isDigit,
		jsonStringify : jsonStringify,
		jsonObjectStringify : jsonObjectStringify,
		jsonArrayStringify : jsonArrayStringify,
		parseCarriageReturn : parseCarriageReturn,
		setTelFormat : setTelFormat,
		getDigit : getDigit
	};
})(jQuery, window.Dcore);