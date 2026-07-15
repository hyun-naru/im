/*******************************************************************************
 * Function List
 *******************************************************************************
 *
 * *** 마스크 처리 관련 함수 ***************************************************
 * 
 * telLastMask	: 전화 번호 Mask 처리끝 4자리 마스킹
 * telMask		: 전화 번호 Mask 처리(구분자 "-" 삽입되어 리턴)(구분자 "-" 삽입된 것도 처리가능)
 * regMask		: 주민등록번호 Mask 처리(구분자 "-" 삽입되어 리턴)(구분자 "-" 삽입된 것도 처리가능)
 * nameMask		: 성명 Mask 처리(앞뒤 마지막 글자를 재외하고 모두 '*'처리, 외자의 경우 뒷자리만 처리)
 * contNoMask	: 증권번호 Mask 처리
 * emailMask	: 이메일 Mask 처리
 * acctMask		: 계좌번호 Mask 처리 - '-'가 업을 경우 뒤 4자리 마스크처리, 있을경우 마지막 '-'이후 마스크 처리
 * addrMask		: 주소 Mask 처리 - 전체 주소
 * addrMaskTwo 	: 주소 Mask 처리 - 기본 주소와 상세 주소가 나누어진 경우
 * addrEtcAddr 	: 기타주소 Mask 처리 - 기타주소길이만큼 *처리
 * 
 * *** 데이터 포메터 관련 함수 **************************************************
 * 
 * addCommas	: 숫자에 콤마(,) 추가
 * addCommasDp	: 숫자에 콤마(,) 추가 (소수점 첫째자리까지 반환)
 * rmCommas		: 숫자에 콤마(,) 제거
 * setCommas	: 숫자의 3자리 자릿수 컴마 표시를 한다.(소수형도 같이 사용 가능) - 입력된 값이 null, undefined, 빈스트링일 경우 대체 텍스트를 표시할 수 있다.
 * getCommas	: 숫자의 3자리 자릿수 컴마 삭제를 한다.(소수형도 같이 사용 가능) - 입력된 값이 null, undefined, 빈스트링일 경우 대체 텍스트를 표시할 수 있다.
 * setCommaInput : 텍스트 필드에 입력한 값에 3자리마다 콤마(,)를 붙인다.
 * ceil			: 소수점 이하 올림하여 몇자리까지 나오게 한다. (입력된 자리수 보다 작을경우 '0'을 붙여 리턴, 마지막 파라메타에 따라 숫자형 리턴)
 * round		: 소수점 이하 반올림하여 몇자리까지 나오게 한다. (입력된 자리수 보다 작을경우 '0'을 붙여 리턴, 마지막 파라메타에 따라 숫자형 리턴)
 * floor		: 소수점 이하 버림하여 몇자리까지 나오게 한다. (입력된 자리수 보다 작을경우 '0'을 붙여 리턴, 마지막 파라메타에 따라 숫자형 리턴)
 * setRate		: 비율 기본형으로 리턴한다. 모든 데이터는 소수점 2자리까지 버림하여 출력됨 - 표준출력
 * setEmpty		: 문자열 기본형으로 리턴.
 * setNum		: 숫자 및 금액 기본입력형 리턴, bType을 true로 주면 자리수 표시된 정수로 리턴한다.
 * setZero		: 숫자형 문자열의 자릿수를 입력받아 왼쪽을 0으로 채운다.
 * setMoneyKorFormat : 금액을 입력 받아서 한글 단위를 붙여줌 (억,만,천) - 단위 미만은 절사
 * setGadrKorStr : 성별코드에 따라서 남성, 여성을 붙여줌
 * telString 	: 입력된 str을 입력받아 연락처 번호형태로 리턴한다. 
 * setJuminBar 	: 주민등록 번호 '-'를 추가한다.
 * 
 ******************************************************************************/

/*******************************************************************************
 * 마스크 처리 관련 함수
 ******************************************************************************/

var maskUtil = (function($, D){
	
	if(typeof stringUtil === 'undefined'){
		// StringUtil Import
		_getScript('/res/www/js/utils/stringUtil.js');
	}	
	
	/**
	 * 전화 번호 Mask 처리끝 4자리 마스킹
	 * 
	 * @param telNo - String
	 * @returns {String} 끝 4자리 마스킹
	 * @returnValue telLastMask('032-111-1111') - 032-111-****
	 * 
	 */
	function telLastMask(telNo) {
		
		if ( stringUtil.isNull(telNo) ) return;
		
		var strTemp = "****";
		
		return stringUtil.subStrL(telNo, telNo.length -4) + strTemp;
	};
	
	/**
	 * 전화 번호 Mask 처리 중간, 끝자리 마스킹
	 * @param telNo
	 * @returns {String}
	 * @returnValue telMask('032-111-1111') - 032-***-****
	 * 				telMask('01011111111') - 010********
	 */
	function telMask(telNo) {
		var str = telNo.toString();
		var defaultDelimiter = '';
		var mask3 = '***';
		var mask4 = '****';
		
		if(stringUtil.isNull(telNo)) return;
		
		if(telNo.indexOf('-') > -1){
			str = telNo.replace(/-/g,'');
			defaultDelimiter = '-';
		}
		
		switch(str.length){
			case 9:
				str = stringUtil.subStrL(str,2) + defaultDelimiter + mask3 + defaultDelimiter + mask4;
				break;
			case 10:
				str = stringUtil.subStrL(str,3) + defaultDelimiter + mask3 + defaultDelimiter + mask4;
				break;
			case 11:
				str = stringUtil.subStrL(str,3) + defaultDelimiter + mask4 + defaultDelimiter + mask4;
				break;
		}
		
		return str;
	}
	
	/**
	 * 주민등록번호 Mask 처리(구분자 "-" 삽입되어 리턴)(구분자 "-" 삽입된 것도 처리가능)
	 * 
	 * @param reg_no -
	 *            String - 주민등록번호 문자열
	 * @returns '-'가 붙어 있는 마스킹된 주민등록번호
	 * @returnValue regMask('881111-111111') - 881111-1******
	 * 				regMask('881111111111') - 881111-1******
	 */
	function regMask(reg_no) {
		if (stringUtil.chkReturn(reg_no, "s") == ""){
			return "-";
		}
		
		var strTemp = "******";
	
		if (reg_no.indexOf("-") == -1) { // 주민번호에 - 가없다면
			return (stringUtil.subStrL(reg_no, 6) + "-" + reg_no.substr(6, 1) + strTemp);
		} else {
			reg_no = stringUtil.replaceAll(reg_no,"-", "");
			return (stringUtil.subStrL(reg_no, 6) + "-" + reg_no.substr(6, 1) + strTemp);
		}
	};
	
	/**
	 * 성명 Mask 처리(앞뒤 마지막 글자를 재외하고 모두 '*'처리, 외자의 경우 뒷자리만 처리)
	 * 
	 * @param custname -
	 *            String - 성명 문자열
	 * @returns {String} 마스크 처리된 성명
	 * @returnValue: nameMask('모피어스') - 모**스
	 * 				 nameMask('구름') - 구*
	 * 
	 */
	function nameMask(custname) {
		custname = new String(custname);
		var length = custname.length;
		var first = custname.substring(0, 1);
		var last = custname.substring(length - 1, length);
		var asterisk = '';
		
		if (custname.length > 2){	// 성명이 두자 초과인 경우
			for ( var i = 0; i < length - 2; i++) {
				asterisk = asterisk + '*';
			}
			custname = first + asterisk + last;
		} else {
			custname = first + "*";
		}
		
		return custname;
	};
	
	/**
	 * 증권번호 Mask 처리
	 * 
	 * @param obj -
	 *            String - 증권번호 문자열
	 * @returns {String} 마스크처리된 증권번호 문자열
	 * @returnValue: contNoMask('123456789') - 123****89
	 */
	function contNoMask(obj) {
		if (stringUtil.chkReturn(obj, "s") == ""){
			return "";
		}
		
		obj = stringUtil.replaceAll(obj, "-", "");
		var length = obj.length;
		
		if (length > 9){
			return obj.substring(0, length-7) + "****" + obj.substring(length -3, length);
		} else if (length <= 9 && length >= 7){
			return obj.substring(0, length-6) + "****" + obj.substring(length -2, length);
		} else {
			return obj;
		}
	};
	
	/**
	 * 이메일 Mask 처리
	 * 
	 * @param addr -
	 *            String - 이메일 문자열
	 * @returns {String} 마스크처리된 이메일 문자열
	 * @returnValue: emailMask('kang@naver.com') - ka**@naver.com
	 */
	function emailMask(addr) {
		if (stringUtil.chkReturn(addr, "s") == ""){
			return "";
		}
		
		if (addr.indexOf("@") == -1){
			message.alert('이메일 형식이 아닙니다.');
			return "";
		}
		
		var splitValue = addr.split("@");
		var nLength = splitValue[0].length;
		var first = splitValue[0];
			
		if (nLength > 2){
			return splitValue[0].substring(0, nLength -2) + "**@" + splitValue[1];
		} else if (nLength <= 2){
			return splitValue[0].substring(0, nLength -1) + "*@" + splitValue[1];
		} 
	
		return "";
	};
	
	/**
	 * 계좌번호 Mask 처리 - '-'가 업을 경우 뒤 4자리 마스크처리, 있을경우 마지막 '-'이후 마스크 처리
	 * 
	 * @param value -
	 *            String - 계좌번호 문자열
	 * @returns {String}
	 * @returnValue acctMask('12345678987654') - 1234567898****
	 * 				acctMask('123456-78-987654') - 123456-78-******
	 */
//	function acctMask(value) {
//		if (stringUtil.chkReturn(value, "s") == ""){
//			return "";
//		}
//		
//		if (value.length <= 5){
//			return value;
//		}
//		
//		if (value.indexOf("-") != -1){	// '-'가 있을 경우
//			var arrTemp = value.split("-");
//			var strReText = "";
//			for (var i = 0; i < arrTemp.length; i++){
//				if (i != arrTemp.length - 1){
//					strReText = strReText + arrTemp[i] + "-";
//				} else {
//					var strLast = "";
//					for (var j = 0; j < arrTemp[i].length; j++){
//						strLast = strLast + "*";
//					}
//					
//					strReText = strReText + strLast;
//				}
//			}
//			return strReText;
//		} else {
//			return value.substring(0, value.length -4) + "****";
//		}
//		
//		return "";
//	};
	
	/**
	 * 계좌번호 Mask 처리 - 앞 4자리 제외 마스크처리
	 * 
	 * @param value -
	 *            String - 계좌번호 문자열
	 * @returns {String}
	 * @returnValue acctMask('12345678987654') - 1234**********
	 * 				acctMask('123456-78-987654') - 1234**-**-******
	 */
	function acctMask(value) {
		if (stringUtil.chkReturn(value, "s") == ""){
			return "";
		}
		
		if (value.length <= 5){
			return value;
		}
		
		if (value.indexOf("-") != -1){	// '-'가 있을 경우
			var arrTemp = value.split("-");
			var strReText = "";
			for (var i = 0; i < arrTemp.length; i++){
				if (i == 0){
					var strFirst = "";
					if(arrTemp[i].length > 4){
						for(var j = 4; j < arrTemp[i].length; j++){
							strFirst = strFirst + "*";
						}
					}
					strReText = strReText + arrTemp[0].substring(0,4) + strFirst;
				} else {
					var strLast = "-";
					var valid = 4 - arrTemp[0].length;
					if(arrTemp[0].length < 4){
						if(i == 1){
							strLast = strLast + arrTemp[1].substring(0, valid);
							for (var j = valid; j < arrTemp[i].length; j++){
								strLast = strLast + "*";
							}
						}else if(i > 1){
							for (var j = 0; j < arrTemp[i].length; j++){
								strLast = strLast + "*";
							}
						}
					}else{
						for (var j = 0; j < arrTemp[i].length; j++){
							strLast = strLast + "*";
						}
					}
					strReText = strReText + strLast;
				}
			}
			return strReText;
		} else { // '-'가 없을 경우
			var strLast = "";
			for (var i = 4; i < value.length; i++){
				strLast = strLast + "*";
			}
			return stringUtil.setStrCutDot(value, 4, strLast);
		}
		
		return "";
	};
	
	/**
	 * 주소 Mask 처리 - 전체 주소
	 * "동 ", "읍 ", "면 ", "가 "로 찾아 뒤에는 모두 마스크 처리
	 * 해당 케이스가 없을경우 " "으로 찾아 세번째 이후는 모두 마스크 처리
	 * @param addr -
	 *            String - 주소 문자열
	 * @returns {String}
	 * @returnValue: addrMask('가나도 다라시 마바구 아자로 237') - 가나도 다라시 마바구 *******
	 * 				 addrMask('가나도 다라시 마바동 아자로 237') - 가나도 다라시 마바동 *******
	 */
	function addrMask(addr) {
		if (stringUtil.chkReturn(addr, "s") == ""){
			return "";
		}
		
		var strStAddr = "";
		var strEndMask = "";
		var indexDong = addr.indexOf("동 ");
		var indexUb = addr.indexOf("읍 ");
		var indexMyun = addr.indexOf("면 ");
		var indexGa = addr.indexOf("가 ");
		
		if (indexDong == -1 && indexUb == -1 && indexMyun == -1 && indexGa == -1){
			// 동, 읍, 면, 가 로 검색 불가시
			var arrAddr = addr.split(" ");	// 스페이스로 배열
			
			if (arrAddr.length > 3){	// 3번째 이상 마스크가 있을 경우
				var strEndAddr = "";
				var nCount = 0;
				
				// 마스크 처리를 위해 3번째 이상 텍스트 합침
				for (var i = 3; i < arrAddr.length; i++){	
					if (strEndAddr == ""){
						strEndAddr = arrAddr[i];
					} else {
						strEndAddr = strEndAddr + " " + arrAddr[i];
					}
				}
				
				// 텍스트 길이만큼 마스크 표시
				for (var i = 0; i < strEndAddr.length; i++){	
					strEndMask += "*";
				}
				
				// 주소 앞부분 합치기 위한 자릿수 체크
				if (arrAddr.length > 3){
					nCount = 3;
				} else {
					nCount = arrAddr.length;
				}
					
				// 주소 앞부분 합침
				for (var i = 0; i < nCount ; i++){
					strStAddr = strStAddr + " " + arrAddr[i];
				}
				
			} else {
				return addr;
			}
		} else {
			var nIndexKey = -1;
			var nTotalLength = 0;
			
			if (indexDong != -1){
				nIndexKey = indexDong;	// 동
			} else if (indexUb != -1){
				nIndexKey = indexUb;	// 읍
			} else if (indexMyun != -1){
				nIndexKey = indexMyun;	// 면
			} else if (indexGa != -1){
				nIndexKey = indexGa;	// 가
			} 
			
			nTotalLength = addr.length;	// 전체길이
			
			if (nIndexKey == -1){
				return addr;
			}
			
			strStAddr = addr.substring(0, nIndexKey+1);
			strEndMask = "";
			
			// 텍스트 길이만큼 마스크 표시
			for (var i = 0; i < addr.substring(nIndexKey+2, nTotalLength).length; i++){	
				strEndMask += "*";
			}
			
		}
		
		// 마스크 처리 부분이 없을 경우 바로 리턴
		if (strEndMask.length == 0){
			return strStAddr;
		} 
		
		// 마스크 처리부와 합쳐 리턴
		return strStAddr + " " + strEndMask;
		
	};
	
	/**
	 * 기타주소 Mask 처리 - 기타주소길이만큼 *처리
	 * @param etcAddr - String
	 * 
	 * @returns {String}
	 * @returnValue: addrEtcAddr('가나다라로 237') - *******************
	 */
	function addrEtcAddr(etcAddr){
		if (stringUtil.chkReturn(etcAddr, "s") == ""){
			return "";
		}
		
		var strEndMask = "";
		// 텍스트 길이만큼 마스크 표시
		for (var i = 0; i < etcAddr.length; i++){	
			strEndMask += "*";
		}
		
		// 마스크 처리부와 합쳐 리턴
		return strEndMask;
	};
	
	/**
	 * 주소 Mask 처리 - 기본 주소와 상세 주소가 나누어진 경우
	 * "동 ", "읍 ", "면 ", "가 "로 찾아 뒤에는 모두 마스크 처리
	 * 해당 케이스가 없을경우 " "으로 찾아 세번째 이후는 모두 마스크 처리
	 * @param addr1 -
	 * 				String - 기본 주소 문자열
	 * @param addr2 -
	 * 				String - 상세 주소 문자열
	 * @returns {String}
	 * @returnValue: addrMaskTwo('가나도 다라시 마바구 아자로 237','가나다라마바') - 가나도 다라시 마바구 **************
	 */
	function addrMaskTwo(addr1, addr2) {
		
		if (stringUtil.chkReturn(addr1, "s") == ""){
			return "";
		}
		
		if (stringUtil.chkReturn(addr2, "s") == ""){
			return "";
		}
		
		//return addrMask(addr1 + " " + addr2);
		return addrMask(addr1) + addrEtcAddr(addr2);
	};
	
	
	/*******************************************************************************
	 * 데이터 포메터 관련 함수
	 ******************************************************************************/
	
	/**
	 * 숫자의 3자리 자릿수 컴마 표시를 한다.(소수형도 같이 사용 가능) 입력된 값이 null, undefined, 빈스트링일 경우 대체
	 * 텍스트를 표시할 수 있다.
	 * 
	 * @param strNum -
	 *            String - 숫자형 문자열
	 * @param strReText -
	 *            String - 입력된 숫자형 문자열이 null, undefined일경우 대체 텍스트 미입력시 빈스트링 리턴
	 * @returns
	 */
	function setCommas(strNum, strReText) {
		var bCheck = true;
		
		// 입력된 문자열이 숫자와 '.'으로만 이루어져 있는가? 빈스트링은 문자로 본다.
		if (stringUtil.isFloat(strNum) == false){
			bCheck = false;
		}
		
		if (bCheck){
			// strNum = String(Number(strNum));//13-
			strNum = strNum + "";
			var strfirstNum = strNum.split(".")[0];
			var strBackNum = "";
	
			if (strNum.split(".").length != 1){
				strBackNum = "." + strNum.split(".")[1];
			}
			
			var re = /,|\s+/g;
			strfirstNum = strfirstNum.replace(re, "");
	
		    re = /(-?\d+)(\d{3})/;
		    while (re.test(strfirstNum)) {
		    	strfirstNum = strfirstNum.replace(re, "$1,$2");
		    }
		    
		    return strfirstNum + strBackNum;
		} else {
			if (stringUtil.chkReturn(strReText, "s") == ""){
				return "";
			} else {
				return strReText;
			}
		}
	};
	
	/**
	 *  숫자에 콤마(,) 추가
	 * 
	 * @param x - Number
	 * 
	 * @returns {String} #,###
	 * @returnValue: addCommas(3333) - 3,333
	 * 				 addCommas(333) - 333
	 */
	function addCommas(x) {
		if (x == undefined) return ;
		x = x.toString().replace(/,/g,'');
		return isNaN(x)  ? 0 : x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};
	
	/**
	 * 숫자에 콤마(,) 추가 (소수점 첫째자리까지 반환)
	 * #,###.#
	 * @param x
	 * @returns {String}
	 * @returnValue: addCommasDp(33333.3333) - 33,333.3
	 * 				 addCommasDp(33333) - 33,333
	 */
	function addCommasDp(x) {
		var returnValue = '';
		var parts = x.toString().replace(/,/g,'').split('.');
		
		if (!isNaN(parts[0])) {
			parts[0] = Number(parts[0]);
			if (parts[1] && !isNaN(parts[1])) {
				returnValue = parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + parts[1].substr(0,1);
			} else {
				returnValue = parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			}
		} else {
			returnValue = '0';
		}
		return returnValue ;
	};
	
	/**
	 * 숫자에 콤마(,) 제거
	 * @param num - String
	 * @returns {String}
	 * @returnValue: removeCommas('33,333') - 33333
	 */
	function rmCommas(num) {
		return num.toString().replace(/,/g, "");
	};
	
	/**
	 * 소수점 이하 올림하여 몇자리까지 나오게 한다. (입력된 자리수 보다 작을경우 '0'을 붙여 리턴, 마지막 파라메타에 따라 숫자형 리턴)
	 * 
	 * @param param - -
	 *            변환할 data
	 * @param nKey -
	 *            Integer - 리턴할 자리수, 0일경우 올림처리 후 소수점이하 안보임
	 * @param bNoStr -
	 *            Boolean - true일 경우 숫자형 리턴, 미입력시 문자형
	 * @returns	{String} {Number}
	 * @returnValue ceil(3499.444,1) - 3499.5(String)
	 * 				ceil(3499.444,1, true) - 3499.5(Number)
	 */
	
	function ceil(param, nKey, bNoStr){
		if (stringUtil.chkReturn(param, "s") == ""){
			return "";
		} else if (stringUtil.chkReturn(nKey, "s") == "" || nKey < 0){
			return param;
		}
		
		var nCipher = 1;
		for (var i = 0; i < nKey; i++){
			nCipher = nCipher * 10; 
		}
		
		if (stringUtil.chkReturn(bNoStr) == true && bNoStr == true){	// 숫자형으로 리턴을 원할경우 바로
																// 계산하여 리턴
	//		return (Math.ceil(Math.round(param * nCipher))) / nCipher;
			return (Math.ceil(param * nCipher)) / nCipher;
		} else {
	//		var arrNumData = ((Math.ceil(Math.round(param * nCipher))) / nCipher).toString().split(".");
			var arrNumData = ((Math.ceil(param * nCipher)) / nCipher).toString().split(".");
			
			if (nKey == 0){	// 자리수가 0일경우 앞 정수부문 리턴
				return arrNumData[0];
			}
			
			var nCountLen = 0;	// 뒷자리 length 초기화
			if (stringUtil.chkReturn(arrNumData[1], "s") != ""){	// 뒷자리 null, undefined
															// 체크
				nCountLen = arrNumData[1].length;	// 뒷자리 length값 세팅
			} else {
				arrNumData[1] = "";	// 뒷자리 빈스트링 세팅
			}
			
			for(nCountLen; nCountLen < nKey; nCountLen++){
				arrNumData[1] = arrNumData[1] + "0";	// 원하는 자리수 만큼 0을 붙임
			}
			
			return arrNumData[0] + "." + arrNumData[1];
			
		}
		
		return "";
	};
	
	/**
	 * 소수점 이하 반올림하여 몇자리까지 나오게 한다. (입력된 자리수 보다 작을경우 '0'을 붙여 리턴, 마지막 파라메타에 따라 숫자형 리턴)
	 * 
	 * @param param - -
	 *            변환할 data
	 * @param nKey -
	 *            Integer - 리턴할 자리수, 0일경우 반올림처리 후 소수점이하 안보임
	 * @param bNoStr -
	 *            Boolean - true일 경우 숫자형 리턴, 미입력시 문자형
	 * @returns	{String} {Number}
	 * @returnValue round(3499.444,1) - 3499.4(String)
	 * 				round(3499.555,1, true) - 3499.6(Number)
	 */
	function round(param, nKey, bNoStr){
		if (stringUtil.chkReturn(param, "s") == ""){
			return "";
		} else if (stringUtil.chkReturn(nKey, "s") == "" || nKey < 0){
			return param;
		}
		
		var nCipher = 1;
		for (var i = 0; i < nKey; i++){
			nCipher = nCipher * 10; 
		}
		
		if (stringUtil.chkReturn(bNoStr) == true && bNoStr == true){	// 숫자형으로 리턴을 원할경우 바로
																// 계산하여 리턴
			return (Math.round(param * nCipher)) / nCipher;
		} else {
			var arrNumData = ((Math.round(param * nCipher)) / nCipher).toString().split(".");
			
			if (nKey == 0){	// 자리수가 0일경우 앞 정수부문 리턴
				return arrNumData[0];
			}
			
			var nCountLen = 0;	// 뒷자리 length 초기화
			if (stringUtil.chkReturn(arrNumData[1], "s") != ""){	// 뒷자리 null, undefined
															// 체크
				nCountLen = arrNumData[1].length;	// 뒷자리 length값 세팅
			} else {
				arrNumData[1] = "";	// 뒷자리 빈스트링 세팅
			}
			
			for(nCountLen; nCountLen < nKey; nCountLen++){
				arrNumData[1] = arrNumData[1] + "0";	// 원하는 자리수 만큼 0을 붙임
			}
			
			return arrNumData[0] + "." + arrNumData[1];
			
		}
		
		return "";
	};
	
	/**
	 * 소수점 이하 버림하여 몇자리까지 나오게 한다. (입력된 자리수 보다 작을경우 '0'을 붙여 리턴, 마지막 파라메타에 따라 숫자형 리턴)
	 * 
	 * @param param - -
	 *            변환할 data
	 * @param nKey -
	 *            Integer - 리턴할 자리수, 0일경우 버림처리 후 소수점이하 안보임
	 * @param bNoStr -
	 *            Boolean - true일 경우 숫자형 리턴, 미입력시 문자형
	 * @returns	{String} {Number}
	 * @returnValue floor(3499.666,1) - 3499.6(String)
	 * 				floor(3499.666,1, true) - 3499.6(Number)
	 */
	function floor(param, nKey, bNoStr){
		if (stringUtil.chkReturn(param, "s") == ""){
			return "";
		} else if (stringUtil.chkReturn(nKey, "s") == "" || nKey < 0){
			return param;
		}
		
		var nCipher = 1;
		for (var i = 0; i < nKey; i++){
			nCipher = nCipher * 10; 
		}
		
		if (stringUtil.chkReturn(bNoStr) == true && bNoStr == true){	// 숫자형으로 리턴을 원할경우 바로
																// 계산하여 리턴
	//		return (Math.floor(Math.round(param * nCipher))) / nCipher;
			return (Math.floor(param * nCipher)) / nCipher;
		} else {
	//		var arrNumData = ((Math.floor(Math.round(param * nCipher))) / nCipher).toString().split(".");
			var arrNumData = ((Math.floor(param * nCipher)) / nCipher).toString().split(".");
			
			if (nKey == 0){	// 자리수가 0일경우 앞 정수부문 리턴
				return arrNumData[0];
			}
			
			var nCountLen = 0;	// 뒷자리 length 초기화
			if (stringUtil.chkReturn(arrNumData[1], "s") != ""){	// 뒷자리 null, undefined
															// 체크
				nCountLen = arrNumData[1].length;	// 뒷자리 length값 세팅
			} else {
				arrNumData[1] = "";	// 뒷자리 빈스트링 세팅
			}
			
			for(nCountLen; nCountLen < nKey; nCountLen++){
				arrNumData[1] = arrNumData[1] + "0";	// 원하는 자리수 만큼 0을 붙임
			}
			
			return arrNumData[0] + "." + arrNumData[1];
			
		}
		
		return "";
	};
	
	
	/**
	 * 숫자 및 금액 기본입력형 리턴, bType을 true로 주면 자리수 표시된 정수(금액)로 리턴한다.
	 * @param num 
	 * @param bType	- Boolean
	 * @returns {String}, {Number}
	 * @returnValue: setNum(100000, true) - 100,000
	 * 				 setNum(100000) - 100000
	 */
	function setNum(num, bType){
		if (stringUtil.chkReturn(num, "s") == ""){
			return 0;
		}
		if(isNaN(String(num).replace(/[,]/g,""))){
			return 0;
		}
		if (num == ""){
			return 0;
		}
		if (stringUtil.chkReturn(bType)){
			if (bType){
				return setCommas(floor(num, 0));
			}
		} else {
			return num;
		}
		
		return num;
	};
	
	/**
	 * 비율 표시. 소숫점 2자리 이하를 버림하여 소수점 2자리까지 표시 데이터를 넣으면 숫자형이 아닐 경우 0.00 으로 출력 (문자열일 경우
	 * 숫자형 변환이 가능할 경우 해당 숫자 출력) bType을 true로 주면 자리수 표시된 정수로 리턴한다.
	 * 
	 * @param rate - Number
	 * @param bType - Boolean
	 * @returns {String}, {Number}
	 * @returnValue setRate(45.888) - 45.88
	 */
	function setRate(rate, bType){
		rate = Number(rate);
		if(isNaN(rate)){
			rate = 0.00;
		}
	//	rate = Math.floor(rate * 100) / 100;	
		rate = floor(rate, 2, true);
		
		if (stringUtil.chkReturn(bType)){
			return setCommas(rate.toFixed(2));
		} else {
			return rate.toFixed(2);
		}
	};
	
	/**
	 * 금액을 입력 받아서 한글 단위를 붙여줌
	 * @param vMoney
	 * @param vSect 1 : (억,만,천) - 단위 미만은 절사, 2 : (억,만,천) - 단위 별로 조합하여 뿌려줌
	 * @return Formatting Kor Money 
	 * @returnValue setMoneyKorFormat(99999999,1) - 9999만원
	 * 				setMoneyKorFormat(99999999,2) - 9999만9천
	 */
	function setMoneyKorFormat(vMoney , vSect){
		
		var vThousand 		= ''; 
		var vTenThousand 	= ''; 
		var vHundredMillion	= '';
		var vReturnVal		= '';
		
		if( setNum( vMoney ) <= 0 ){
		
			return "0원";
			
		}else{
			
			//금액을 단위별로 조합하여 출력
			if( undefined !== vSect && vSect == '2' ){
			
				if ( setNum( vMoney ) >= 1000 ) {
					
					vThousand 		= (Math.floor(setNum( vMoney ) / 1000) * 1000) 
										- (Math.floor(setNum( vMoney ) / 10000) * 10000);
					
					vThousand 		= Math.floor(setNum( vThousand ) / 1000);
					
					if( vThousand > 0 ){
						
						vThousand 		= vThousand + "천";
					
					}else{
						
						vThousand 		= "";
						
					}
				}
				
				if ( setNum( vMoney ) >= 10000 ) {
					
					vTenThousand 	= (Math.floor(setNum( vMoney ) / 10000) * 10000) 
										- (Math.floor(setNum( vMoney ) / 100000000) * 100000000);
					
					vTenThousand 	= Math.floor(setNum( vTenThousand ) / 10000);
					
					if( vTenThousand > 0 ){
						
						vTenThousand 	= vTenThousand + "만";
					
					}else{
						
						vTenThousand 	= "";
						
					}
					
				}
		
				if( setNum( vMoney ) >= 100000000 ) {
					
					vHundredMillion = Math.floor(setNum( vMoney ) / 100000000);
					
					if( vHundredMillion > 0 ){
						
						vHundredMillion	= vHundredMillion + "억";
					
					}else{
						
						vHundredMillion	= "";
						
					}
					
				}
				
				vReturnVal = vHundredMillion + vTenThousand + vThousand;
				
			}
			
			//각 단위 미만 절사
			else {
				
				if( setNum( vMoney ) >= 100000000 ) {
					
					vHundredMillion = Math.floor(setNum( vMoney ) / 100000000);
					
					vReturnVal 		= vHundredMillion + "억원";
					
				}else if ( setNum( vMoney ) >= 10000 ) {
					
					vTenThousand 	= Math.floor(setNum( vMoney ) / 10000);
					
					vReturnVal 		= vTenThousand + "만원";
					
				}else if ( setNum( vMoney ) >= 1000 ) {
					
					vThousand 		= Math.floor(setNum( vMoney ) / 1000);
					
					vReturnVal 		= vThousand + "천원";
					
				}
			}
		}
		
		return vReturnVal;
	};
	
	
	/**
	 * 성별코드에 따라서 남성, 여성을 붙여줌
	 * @param vGndr
	 * @return {String} Gender Text
	 * @returnValue setGadrKorStr('1') - 남성
	 */
	function setGadrKorStr(vGndr){
		
		var vGadrKorStr	= '';
		var vReturnVal	= '';
		
		if (stringUtil.chkReturn(vGndr, "s") == ""){
			message.alert('VL.0032');
			return '';
		}
		
		//성별분류
		if( vGndr == "1" || vGndr == "3" || vGndr == "5" || vGndr == "7" ){
			
			vReturnVal	= '남성';
			
		}else if( vGndr == "2" || vGndr == "4" || vGndr == "6" || vGndr == "8" ){
			
			vReturnVal	= '여성';
			
		}else{
			
			vReturnVal	= '성별미확인';
			
		}
		
		
		return vReturnVal;
	};
	
	
	/**
	 * 입력된 str을 입력받아 연락처 번호형태로 리턴한다.
	 * 
	 * @param str -
	 * 			String - 대상 문자열
	 * @returns {String}
	 * @returnValue telString('0531112222') - 053-111-2222 	 
	 */
	function telString(str) {
		var tel_no = stringUtil.replaceAll(str,"-","");
		
		if (stringUtil.chkReturn(tel_no, "s") == ""){				
			return "";
		}			
		
		if (tel_no.substr(0, 2) == "01") {
			if (tel_no.length == 10) {
				return stringUtil.subStrL(tel_no, 3) +"-"+ stringUtil.subStr(tel_no,3,3) +"-"+ stringUtil.subStrR(tel_no, 4);
			} else {
				return stringUtil.subStrL(tel_no, 3) +"-"+ stringUtil.subStr(tel_no,3,4) +"-"+ stringUtil.subStrR(tel_no, 4);
			}
		} else if (tel_no.substr(0, 2) == "02") {
			if (tel_no.length == 9) {
				return stringUtil.subStrL(tel_no, 2) +"-"+ stringUtil.subStr(tel_no,2,3) +"-"+ stringUtil.subStrR(tel_no, 4);
			} else {
				return stringUtil.subStrL(tel_no, 2) +"-"+ stringUtil.subStr(tel_no,2,4) +"-"+ stringUtil.subStrR(tel_no, 4);
			}
		} else if (tel_no.substr(0, 2) == "03" || tel_no.substr(0, 2) == "04" || tel_no.substr(0, 2) == "05" || tel_no.substr(0, 2) == "06" || tel_no.substr(0, 2) == "07" || tel_no.substr(0, 2) == "08" || tel_no.substr(0, 2) == "09") {
			if (tel_no.length == 10) {
				return stringUtil.subStrL(tel_no, 3) +"-"+ stringUtil.subStr(tel_no,3,3) +"-"+ stringUtil.subStrR(tel_no, 4);			
			}else{
				return stringUtil.subStrL(tel_no, 3) +"-"+ stringUtil.subStr(tel_no,3,4) +"-"+ stringUtil.subStrR(tel_no, 4);
			}
		} else {
			return tel_no;
		}
	};
	
	/**
	 * 주민등록 번호 '-'를 추가한다.
	 * @param strJumin
	 * @returns {String}
	 * @returnValue setJuminBar(8811111111111) - 881111-1111111
	 * 				setJuminBar('8811111111111') - 881111-1111111
	 */
	function setJuminBar(strJumin){
		if (stringUtil.chkReturn(strJumin, "s") == ""){
			return "";
		}
		
		var strJuminC = strJumin + "";
		if (strJuminC.length < 13){
			return strJumin;
		} else if (strJuminC.length >= 13){
			strJuminC = stringUtil.replaceAll(strJuminC, "-", "");
			if (strJuminC.length != 13){
				return strJumin;
			}
		}
		
		return strJuminC.substring(0, 6) + "-" + strJuminC.substring(6, 13);
	};
	
	return {
		telLastMask : telLastMask,
		telMask : telMask,
		regMask : regMask,
		nameMask : nameMask,
		contNoMask : contNoMask,
		emailMask : emailMask,
		acctMask : acctMask,
		addrMask : addrMask,
		addrEtcAddr : addrEtcAddr,
		addrMaskTwo : addrMaskTwo,
		setCommas : setCommas,
		addCommas : addCommas,
		addCommasDp : addCommasDp,
		rmCommas : rmCommas,
		ceil : ceil,
		round : round,
		floor : floor,
		setNum : setNum,
		setRate : setRate,
		setMoneyKorFormat : setMoneyKorFormat,
		setGadrKorStr : setGadrKorStr,
		telString : telString,
		setJuminBar : setJuminBar
	}

})(jQuery, window.Dcore);