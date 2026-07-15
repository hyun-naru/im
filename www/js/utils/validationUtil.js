/*******************************************************************************
 * Function List
 *******************************************************************************
 *
 * *** 유효성 처리 관련 함수 ***************************************************
 * 
 * isJuminno	: 주민번호 유효성 체크 (가벼운 유효성) 각 자리수에 들어갈 수 있는 숫자만 체크하여 결과를 반환합니다.
 * isCrdCard	: 신용카드번호 유효성 체크
 * isTelno		: 전화번호 유효성 체크
 * isValidDate	: 날짜 유효성 체크. 입력날짜가 현재 또는 입력된 기준일보다 후일일 경우 false 기준일 또는 이전일 경우 true반환
 * 
 ******************************************************************************/

var validationUtil = (function($, D){
	
	/**
	 * 주민번호 유효성 체크 (가벼운 유효성) 
	 * 각 자리수에 들어갈 수 있는 숫자만 체크하여 결과를 반환합니다.
	 * @param juminno
	 * @param position
	 * @returns {Boolean}
	 */
	function isJuminno(juminno, position) {
		// 주민번호 유효성 체크
		var regExp = new RegExp();
		if(undefined == position)	regExp =  /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))[1-8][0-9]{6}$/; 
		else if("-" == position)	regExp =  /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-8][0-9]{6}$/; 
		else if("1" == position)	regExp =  /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))$/; 
		else if("2" == position)	regExp =  /^[1-8][0-9]{6}$/;
	
		if(!regExp.test(juminno)){
			return false;
		}
		return true;
	};
	
	/**
	 * 신용카드번호 유효성 체크
	 * @param cardNo
	 * @param position
	 * @returns {Boolean}
	 */
	function isCrdCard(cardNo, position) {
		var regExp = /^([0-9]{2})$/;
		if(undefined == position)	regExp = /^([0-9]{16})$/;
		else if("-" == position)	regExp = /^(([0-9]{4})-([0-9]{4})-([0-9]{4})-([0-9]{4}))$/;
		else if("1" == position)	regExp = /^([0-9]{4})$/;
		if(!regExp.test(cardNo)){
			return false;
		}
		return true;
	};
	
	
	/**
	 * 전화번호 유효성 체크
	 * @param telno : 숫자 2~4자리 0으로시작 + "-" + 숫자3~4자리 + "-" + 숫자4자리
	 * @param position
	 * @returns {Boolean}
	 */
	function isTelno(telno, position) {
		// 전화번호 유효성 체크
		var regExp = new RegExp();
		if(undefined == position)	regExp =  /^(0([0-9]{1,3})([0-9]{3,4})([0-9]{4}))$/; 
		else if("-" == position)	regExp =  /^(0([0-9]{1,3})-([0-9]{3,4})-([0-9]{4}))$/;  
		else if("1" == position)	regExp =  /^(0([0-9]{1,3}))$/; 
		else if("2" == position)	regExp =  /^([0-9]{3,4})$/; 
		else if("3" == position)	regExp =  /^([0-9]{4})$/;
		else if("4" == position)	regExp =  /^([0-9]{2,3})$/;
		
		if(!regExp.test(telno)){
			return false;
		}
		return true;
	};
	
	
	/**
	 * 날짜 유효성 체크. 입력날짜가 현재 또는 입력된 기준일보다 후일일 경우 false 기준일 또는 이전일 경우 true반환
	 * 
	 * @param chkDate
	 * @param stdDate
	 * @returns {Boolean}
	 */
	function isValidDate(chkDate, stdDate) {
		if(chkReturn(stdDate,"s")==""){
			stdDate = getDate();
		}
		stdDate = stdDate.replace(/[^0-9]/g,"");
		chkDate = chkDate.replace(/[^0-9]/g,"");
		if(isDate(chkDate) && stdDate >= chkDate ){
			return true;
		}
		return false;
	};
	
	/**
	 * 이메일 체크
	 */
	function isEmail(email){
		var regExp = new RegExp();
		
		var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
			
		if(!regExp.test(email)){
			return false;
		}		
		return true;
	};
	
	/**
	 * 이름 유효성 체크
	 */
	function isName(name){
		var regExp = new RegExp();
		//var regExp = /^[가-힣]{2,15}|[ㄱ-ㅎ]{2,15}|[a-zA-Z]{2,15}\s[a-zA-Z]{2,15}$/;
		var regExp = /^[ㄱ-ㅎ가-힣a-zA-Z\s]+$/g;
			
		if(!regExp.test(name)){
			return false;
		}		
		return true;
	};
	
	
	return {
		isJuminno : isJuminno,
		isCrdCard : isCrdCard,
		isTelno : isTelno,
		isValidDate : isValidDate,
		isEmail : isEmail,
		isName : isName
	};


})(jQuery, window.Dcore);

