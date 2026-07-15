/*******************************************************************************
 * Function List
 *******************************************************************************
 *
 * *** 가입설계청약 유틸 ***************************************************
 * bindMenuToggleEvent		: 아코디언 메뉴 클릭 이벤트
 * getAmtMulUnt				: 금액단위에 따른 실제 금액을 구한다.
 * convertObj				: convert Array to Object
 * getPeriod				: 기준일로부터 얼마정도 전의 날짜를 구한다. 
 * getGenderNm				: 성별 한글명 리턴
 * getPridNm				: 보장기간, 납입기간 한글명 리턴
 * addCommas				: 금액 , 표시
 * splitAddSep				: 문자열을 특정 갯수로 나눈 후 사이에 sep문자 삽입
 * getCdList				: 공통코드 조회 (selectBox기준)
 * setCdSelect				: 공통코드 세팅 (selectBox기준)
 * setCdRadio				: 공통코드 세팅 (radioBox 기준)
 * amtDivUnt		    	: 지정한 자릿수만큼 단위를 줄인 숫자를 리턴
 * removeCommas				: 금액 , 제거
 * cf_getCdListByMultiCatCd : 분류코드리스트를 입력받아 해당 세부코드의 목록을 반환한다(CodeBeanController 사용).
 * sf_getCodeList			: 사용자가 필요로 하는 COMBO DATA를 생성하여 반환한다.(CmnsCodUtilController 사용)
 * getDupRmvArr				: 객체 배열의 특정 속성 데이터의 중복을 제거한 새로운 객체 배열을 반환
 * getGrepCondi				: 객체 배열의 특정 조건이 일치한 객체로 새로운 객체배열 생성 후 반환
 * copyArrayRow				: 특정 배열의 행을  현재 지정한 배열의 지정한 행의 위치에 데이터를 복사하는 함수 입니다.
 * isNumberic  				: 문자열 값이 전체가 숫자인지 아닌지를 판단
 * objectArraySort 			: 객체 배열(object Array)를 정렬하는 함수
 * cf_openPopAcc			: 계좌정보관리 팝업
 * cf_openPopCrd			: 신용카드정보관리 팝업
 * copyToClipBoard 			: 컬립보드로 주어진 각을 copy 한다.  
 * talkOmni 				: 옴니 알림톡 발송
 * totalTalk 				: 보험 가입 바로 확인 서비스
 * getCnsgUserInfo			: 위탁설계 user 정보 가져오기
 ******************************************************************************/

var dcUtil = (function($, D){
	
	if(typeof clipUtil === 'undefined'){
		// clipUtil Import
		_getScript('/res/www/js/utils/clipUtil.js');
	};	
	
	/** 
	 *	위탁설계 user 정보 가져오기(위탁설계를 하지 않을경우 글로벌에 있는 유저정보를 가져온다.) 
	 */
	function getCnsgUserInfo(cnsgUserInfo, key) {
		var userInfo = D.global.getUserInfo(key);
		if(cnsgUserInfo){

			if (key) {
				return cnsgUserInfo[key];
			} else {
				return cnsgUserInfo;
			}
		}else{
			return userInfo;
		}
		
	}

	/**
	 * 문자열을 특정 갯수로 나눈 후 사이에 sep문자 삽입
	 * @param str 원본문자열
	 * @param splitNum 나눌 갯수
	 * @param sepChar 나눈 문자열 사이에 삽입 할 문자
	 * @param option[maskPos] 마스킹할 순번
	 */
	function splitAddSep(str, splitNum, sepChar, maskPos) {

		var rst = '';
		var num = Number(splitNum);
		var sep = sepChar || '';

		if (num <= 0 || !str) {
			rst = str;
		} else {
			var loopCnt = Math.ceil(str.length / num);
			var stNum = 0;
			var curStr = '';
			for (var i = 0; i < loopCnt; i++) {
				curStr = str.substr(stNum, num);
				if (maskPos && i == maskPos - 1) {
					for (var j = 0; j < curStr.length; j++) {
						rst += '*';
					}
				} else {
					rst += curStr;
				}
				rst += (i == loopCnt-1 ? '' : sep);
				stNum += num;
			}
		}
		return rst;
	}

	/**
	 * 아코디언 메뉴 토글 동작
	 */
	function bindMenuToggleEvent() {
		
		if ($(".toggle-header").length > 0 && $(".toggle-con").length > 0) {
			$(".toggle-header ").on("click", function() {
				var $title = $(this).find(".title");
				var $btn = $(this).find(".btn-toggle");
				var $con = $(this).siblings(".toggle-con");

				if ($title.hasClass("on")) {
					$title.removeClass("on");
					$btn.removeClass("on");
					$con.addClass("none");
				}
				else {
					$title.addClass("on");
					$btn.addClass("on");
					$con.removeClass("none");
				}
			});
		}
		
	}

	/**
	 * 금액단위에 따른 실제 금액 리턴
	 * @param amt 금액
	 * @param unt 단위
	 * @returns 변환금액
	 */
	function getAmtMulUnt(amt, unt) {
		unt = unt ? unt : 0;
		return amt ? Number(amt) * Math.pow(10, Number(unt)) : 0;
	}

	/**
	 * 금액단위에 따른 실제 금액 리턴
	 * @param amt 금액
	 * @param unt 단위
	 * @returns 변환금액
	 */
	function getAmtDivUnt(amt, unt) {
		unt = unt ? unt : 0;
		return amt ? Number(amt) / Math.pow(10, Number(unt)) : 0;
	}
	
	/** 
	 * convert Array to Object
	 * array : 대상 배열
	 * key : 기준 key
	 */
	function convertObj(array, key) {
		var object = array.reduce(function(obj, item) {
			obj[item[key]] = obj[item[key]] || [];
			obj[item[key]].push(item);
			return obj;
		}, {});
		
		return object;
	}
	
	/** 
	 * 기준일로부터 
	 * @param value 구분코드 ( 7일전 : d_7, 14일전 : d_14, 한달전 : m_1)
	 * 날짜를 표시한다
	 */
	function getPeriod(code) {
		code = code.split('_');
		return slctDate = dateUtil.addDate(dateUtil.getDate(), code[0], parseInt("-" +code[1]), '');
	}
	
	/** 
	 * 성별 한글명 리턴
	 * @param code 성별코드
	 */
	function getGenderNm(code) {
		var returnVal = '';
		if (!code) return returnVal;
		
		switch (code) {
			case '1' :
			case '3' :
			case '7' :
				returnVal = '남'; break;
			case '2' :
			case '4' :
			case '6' :
				returnVal = '여'; break;
			default : returnVal = ''; break;
		}
		return returnVal;
	}
	
	/**
	 * 보장기간, 납입기간 한글명 리턴
	 * @param val 
	 * @param sctn 년/세 구분코드 (년 : 1, 세 : 2)
	 * 
	 * @return ex) 99년, 80세 
	 */
	function getPridNm(val, sctn) {
		return val && sctn ? val + (sctn == '1' ? '년' : '세') : '';
	}
	
	/**
	 * 금액 , 표시
	 * @param val 
	 */
	function addCommas(val) {
		var rst = "";
		if (val) {
			rst = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}
		
		return rst;
	}
	
	/**
	 * 공통코드 조회
	 * @param selId 셀렉트박스id
	 * @param opCode 
	 * @param clsfcd 
	 * @param selFlag
	 * @param adHeader 
	 * @param apptYmdFlag
	 * @param fn_callback 
	 */
	function getCdList(selId,opCode,clsfcd,selFlag,adHeader,apptYmdFlag,fn_callback){
		
		var remote = convertUtil.getRemoteObj("CodeBean", opCode);
		
		var param = {	
			clsfcd:clsfcd,
			selFlag:selFlag,
			adHeader:adHeader,
			apptYmdFlag:apptYmdFlag,
			remote : remote
		};
			
		D.http.ajax('/common/codeBean', param).then(function(result) {
			
			//D.logger.debug('CodeBean  X_UDQ01 통신완료 후 콜백 호출!!!!!!!',globalDataKey);
			
			var DS_TEMP_CD= result.remoteResult.outDataSet.DS_TEMP_CD.data;
			
			if(!stringUtil.isNull(selId)){
				setCdSelect(null, DS_TEMP_CD,"#"+selId);
			}
			
			if(!stringUtil.isNull(fn_callback)){
				fn_callback(result);
			}
			
			
		});
	}

	/* 
	 * 분류코드리스트를 입력받아 해당 세부코드의 목록을 Dataset 에 담아 반환한다.
	 * ----------------------------------------------------------------------------	 
	 *  사용 예)
	 *	arr_codInfo : 불러올 코드 리스트 정보 
	 * 		형식 : 
	 * 		var arr_codInfo = [
	 *			{'cod' : "00695", 'codDs' : "DS_CMB_CTRINTP_XCLCLV" },
	 *			{'cod' : "00203", 'codDs' : "DS_CMB_DCKNCD" },
	 *			{'cod' : "00637", 'codDs' : "DS_CMB_LTAXYN" }
	 *		]
	 * 		dcUtil.cf_getCdListByMultiCatCd(arr_codInfo, function(result){
	 * 			D.logger.debug(result); //결과 값
	 * 		})
	 */
	function cf_getCdListByMultiCatCd(arr_codInfo, fn_callback){
		if(stringUtil.isNull(arr_codInfo)){
			D.logger.debug("DC-sample.js > funciton > cf_getCdListByMultiCatCd ::  param[arr_codInfo] is null ");
			return ; 
		}

		if(arr_codInfo.length < 1){
			D.logger.debug("DC-sample.js > funciton >  cf_getCdListByMultiCatCd ::  param[arr_codInfo] is null ");
			return ; 
		}


		var param  = {};
		

		/* 
		 *  전달 받은 배열은 아래와 같은 형태로 변환 한다. 
		 * 	"00695|00203|00637|00213|00011|01672|01725|01957|00007|10076"
		 *  "DS_CMB_CTRINTP_XCLCLV|DS_CMB_DCKNCD|DS_CMB_LTAXYN|DS_CMB_DIAGCD|DS_CMB_CTRINTP_CSRLP|DS_CMB_CAPN|DS_CMB_LGAMDCMETDCOD|DS_CMB_CHDADDCMETDCOD|DS_CMB_CTRINTP_CTLRLE|DS_CMB_MOJIB
		 */
		var strCod = "";
		var strCodDs = "";
		for(var i in arr_codInfo){
			if(typeof arr_codInfo[i] != "function"){
				if(stringUtil.isNull(arr_codInfo[i].cod) ){
					return; 
				}

				if(stringUtil.isNull(arr_codInfo[i].codDs)){
					return;  
				}

				strCod +=  arr_codInfo[i].cod;
				strCodDs += arr_codInfo[i].codDs;
				if(i != (arr_codInfo.length-1)){
					strCod += "|";
					strCodDs += "|";
				}
			}
		}	
		param.arrClsfcd  	= strCod;
		param.arrDsNm 		= strCodDs;
		param.selFlag 		= "N";
		param.adHeader 		= "";
		param.apptYmdFlag 	= "";

		var remote = convertUtil.getRemoteObj('CodeBean', 'X_UDQ11');
		param.remote = 	remote;
		D.http.ajax('/common/codeBean', param).then(function(result) {
			if(!stringUtil.isNull(fn_callback)){
				fn_callback(result);
			}
		});
	}
	
	
	/*
	 * object 배열에 지정한 필드 값을 중복을 제거해서 반환 
	 * 
	 * var ds_CtrIntpMtt = [
	 *     {
	 *         "ASRD_CTR_RLE_SECD": "나",
	 *         "CS_RLP_SECD": "1",
	 *         "ESTY_INP_YN": "0",
	 *         "GRST_AGE_STD_COD": "2",
	 *         "GRST_AGE": "60",
	 *         "SMST_AGE_STD_COD": "1",
	 *         "SMST_AGE": "15",
	 *         "UBC_NTRY_COD": "0",
	 *         "PRDCD": "102561"
	 *     },
	 *     {
	 *         "ASRD_CTR_RLE_SECD": "가",
	 *         "CS_RLP_SECD": "2",
	 *         "ESTY_INP_YN": "0",
	 *         "GRST_AGE_STD_COD": "2",
	 *         "GRST_AGE": "60",
	 *         "SMST_AGE_STD_COD": "1",
	 *         "SMST_AGE": "15",
	 *         "UBC_NTRY_COD": "0",
	 *         "PRDCD": "102563"
	 *     }
	 * ]
	 * 
	 *  cf_repetitionRemoval( ds_CtrIntpMtt, "CS_RLP_SECD");         //중복 제거 후 ["1", "2"] 반환
	 *  cf_repetitionRemoval( ds_CtrIntpMtt, "ASRD_CTR_RLE_SECD");   //중복 제거 후  ["가", "나"] 반환
	 * 
	 */
	function cf_repetitionRemoval (arr, fieldsNM){

	    if(stringUtil.isNull(arr)){
	        return ; 
	    }

	    if(stringUtil.isNull(fieldsNM)){
	        return; 
	    }

	    /* 
	     * 필드값들을 배열 형태로 만든다. 
	     */
	    var arrTmp=[];
	    for(var x in arr){ 
	        arrTmp.push(arr[x][fieldsNM]);
	    }

	    /*
	     * 배열 행태로 만든 필드 배열에서 중복 값들을 제거 한다. 
	     */
	    var uniq = arrTmp.reduce(function(a, b){
	        for(var x in a){
	            if(a.indexOf(b) == -1){
	                a.push(b);
	                return a; 
	            }
	        }
	        if(a.length < 1){
	            a.push(b);
	        }
	        return a;
	    }, []); 


	    //첫 배열로 문자 인지  숫자 인지 판단 
	    var str = uniq[0].replace(/^\s*|\s*$/g, ''); //좌우 공백 제거 split으로 대체 해도됨 
	    var numbericYN ;
	    if(str == '' || isNaN(str)){
	        numbericYN = false;
	    }else{
	        numbericYN = true;
	    }

	    if(numbericYN){ //숫자이면 
	        uniq.sort(function(a,b){return a - b }); //오름차순 정렬
	    }else{  //문자열이면 
	        uniq.sort()
	    }
	    return uniq; 
	}

	

	/**
	 * 객체 배열의 특정 속성 데이터의 중복을 제거한 새로운 객체 배열을 반환
	 * @author ikkim
	 * @param pArr(중복제거전배열)
	 * @param pDupKey(중복검사할속성키)
	 * @returns 중복제거한배열
	 * @description 
	   중복검사할속성키를 배열로 줄 경우 순차적으로 제거한다.
	   pDupKey = ["name", "age"]  =>  name이 중복되는 아이를 제거하고 name중복제거한 새로운 배열에서 다시 age가 중복되는 아이를 제거
	 * @example 
	    dcUtil.getDupRmvArr([{key1: "10", key2: "11"}, {key1: "10", key2: "12"}], "key1" 또는 ["key1"[, ...]])
	    ===> result :: [{key1: "10", key2: "11"}]
	 */
	function getDupRmvArr(pArr, pDupKey) {
		var rstArr = [];
		pDupKey = $.isArray(pDupKey) ? pDupKey : [pDupKey];
		if(typeof pDupKey == "undefined" || pDupKey.length == 0){
			rstArr = pArr;
		}
		else {
			var newArr = pArr;
			for (var i = 0; key = pDupKey[i]; i++) {
				newArr = newArr.reduce(function(nArr, current) {
					var dup = $.grep(nArr, function(n) {
						return n[key] == current[key] 
					});
					if(dup.length == 0){
						nArr.push(current)
					}
					return nArr;
				}, []);
			}
			rstArr = newArr;
		}
		return rstArr;
	}


	/**
	 * object 배열 중 특정 조건에 맞는 object들로 구성된 새로운 배열을 반환
	 * @author ikkim
	 * @param pArr (찾을배열 : [{"key1": "1", {"key2": "2"}, ....] )
	 * @param pCondi (조건문자열 : "key1 == '1' && key2 == '2'" )
	 * @returns 조건에 맞는 object array 또는 object
	 * @description
	 * 조건에 맞는 object와 원본배열에서의 index값을 가져온다.
	 */
	function getGrepCondi(pArr, pCondi) {
		// map의 두번째 인자인 익명함수의 매개변수명이 data이므로 data.속성명 으로 문자열을 replace
		pCondi = pCondi.replace(/\s+/gi, "").replace(/(\|\|){1}|(&&){1}/gi, "$1$2data.");	
		if (pCondi[0] == "(") {
			pCondi = "(data." + pCondi.slice(1);
		}
		else { 
			pCondi = "data." + pCondi;
		}

		var rtn = $.map(pArr, function(data, idx) {
			if (eval(pCondi)) {
				return { "idx": idx, "data":data };
			}
		}); 
		// 결과가 하나인 경우는 하나의 object로 리턴함
		if (rtn.length == 1) {
			rtn = rtn[0];
		}
		return rtn;
	}
	
	
	/**
	 * 공통코드 세팅 selectbox
	 * @param pCdInfoList   코드 데이터 object array
	 * @param pSelDomNm     id 또는 class 명
	 * @param pCod 		    [option] option value 값의 키명
	 * @param pCodNam       [option] option text 값의 키명
	 * @returns 인수로 받은 코드 데이터 object array를 그대로 돌려줌
	 */
	function setCdSelect(noData, pCdInfoList, pSelDomNm, pCod, pCodNam) {

		var cod = pCod || 'COD';
		var codNam = pCodNam || 'COD_NAM';
		var opts = '';	 	// option DOM

		if (!stringUtil.isNull(noData)) {
			var noDataArr = noData.split("|");
			opts += '<option value=' + noDataArr[0] + '>' + noDataArr[1] + '</option>';	
		}

		$.each(pCdInfoList, function(idx, item) {
			opts += '<option value=' + item[cod] + '>' + item[codNam] + '</option>';	
		});

		if ($(pSelDomNm).length > 0) {
			$(pSelDomNm).empty().html(opts);
		}
		return pCdInfoList; 
	}

	
	/**
	 * 공통코드 라디오박스 세팅
	 * @param pDataDs 		코드데이터 object list
	 * @param pNameNm		라디오input그룹 name속성명
	 * @param pTargetDom	dom을 추가할 타겟dom 식별명
	 * @param pInitVal		초기선택값
	 * @param pCod 		    [option] radio value 값의 키명
	 * @param pCodNam       [option] radio text 값의 키명
	 * @returns 인수로 받은 코드 데이터 object array를 그대로 돌려줌
	 * @description 라디오박스별 id는 pNameNm+코드값 로 명명됨  ex: "radioGrpName" + "3"
	 */
	function setCdRadio(pCdInfoList, pNameNm, pTargetDom, pInitVal, pCod, pCodNam) {
		var cod = pCod || 'COD';
		var codNam = pCodNam || 'COD_NAM';
		var opts = '';	 	// input DOM

		$.each(pCdInfoList, function(idx, item) {
			opts += '<input type="radio" id='+pNameNm+item[cod]+' name='+pNameNm+' value='+item[cod]+' />'
					+ '<label for='+pNameNm+item[cod]+'>'+item[codNam]+'</label> ';	
		});
		if ($(pTargetDom).length > 0) {
			$(pTargetDom).empty().html(opts);
		}

		if (typeof pInitVal != "undefined" && pInitVal != "") {
			$(pTargetDom).find("input[name="+pNameNm+"][value="+pInitVal+"]").prop("checked", true);
		} else {
			$(pTargetDom).find("input[name="+pNameNm+"]").eq(0).prop("checked", true);
		}

		return pCdInfoList; 
	}
	
	
	/**
	 * 지정한 자릿수만큼 단위를 줄인 숫자를 리턴
	 * @param aAmt 원본 숫자
	 * @param aUnt 줄일 자리수
	 * @examples amtDivUnt(500000, 4) => 50
	 */
	function amtDivUnt(aAmt, aUnt) {
		var untAmt = 1;
		if (stringUtil.isNull(aAmt) || Number(aAmt) == 0) {
			return "0";
		}
		var _aUnt = Number(aUnt); 
		if (_aUnt >= 1 && _aUnt <= 6) {
			untAmt = Math.pow(10, _aUnt);
		}
		return String(Number(aAmt) / untAmt);
	}
	
	
	/**
	 * 금액 , 제거
	 * @param val 
	 */
	function removeCommas(val) {
		return val.replace(/,/g, '');
	}
	
	
	/*******************************************************************************
	* 설명			:  사용자가 필요로 하는 COMBO DATA를 생성하여 반환한다.
	* parameter     : 
	* 				  opCode 			CmnsCodUtilController에 정의한 opCode 명을 입력한다.
	* 				  strInputParam 	파라미터 변수를 입력해야하는 경우 사용한다. ex => param{a:'1',b:'2'}
	* 				  selFlag       	첫번째 리스트에 공백노출여부(Y: 노출, N: 노출안함)
	*				  adHeader			추가헤더정보 (명:값)
	*				  apptYmdFlag 		적용일자(Y:현재일자기준, N: 적용안함)
	* 				  vallBack			코드값을 조회 한 후 함수를 호출한다.
	*
	* return value  : objPlarEmpNo    설계사번호 // objPlarBlnBzGrpNam  소속사업단명
	*				  objPlarBlnBrnm  소속지점명 // objPlarEmpNm        설계사명
	*				  objPlarDsmYmd   해촉일     // objPlarSocposSenm   신분명
	*				  objPlarDsmNm    재직구분명 // objPlarCsRlePk      고객역할고유번호
	* 사용법 		: (사용 예) dcUtil.sf_getCodeList("C_UDQ08", param, "N", "전체:_", "Y", function(result){
	* 												D.logger.debug(result); //결과 값
	* 											})
	* 변경로그 	    :
	*******************************************************************************/
	function sf_getCodeList(opCode, inputParam, selFlag, adHeader, apptYmdFlag, fn_callback ){
		
		var codeColNm = "COD";			//코드
		var dataColNm = "COD_NAM";		//코드명

		//opCode 'C_'제거
		switch ( opCode ) {
			case "C_UDQ08" : case "C_UDQ02" : case "C_UDQ03" :
			case "C_UDQ04" : case "C_UDQ05" : case "C_UDQ06" : case "C_UDQ07" : case "C_UDQ08" : case "C_UDQ09" :
				opCode = "UDQ" + stringUtil.subStr( opCode, '5', '2') ;
				break;
		}
		
		
		var remote = convertUtil.getRemoteObj("FG_DC_CmnsCodUtil", opCode);
		
		
		var param = {	
						codeColNm : codeColNm,
						dataColNm : dataColNm,
						selFlag   : selFlag,
						adHeader  : adHeader, 
						apptYmdFlag : apptYmdFlag,
						remote : remote
					};
		
		$.each(inputParam, function(key,value){
	
			param[key] = value;
			
		});
		
			
		D.http.ajax('/common/sec/cmnsCodUtil', param).then(function(result) {
			
			var DS_TEMP_CD= result.remoteResult.outDataSet.DS_TEMP_CD.data;
			
			if(!stringUtil.isNull(fn_callback)){
				fn_callback(result);
			}
			
			
		});
	}

	/* 
	 *  특겅 배열의 행을  현재 지정한 배열의 지정한 행의 위치에 데이터를 복사하는 함수 입니다. 
	 * --------------------------------------------------------------------------------------------
	 *  @	insertArr 	: 변경 될 배열 입니다. 
	 *  @ 	nToRow 		: 현재 배열에서 복사되어 변경 될 행의 위치(index) 입니다. 
	 *  @   targetArr   : 복사해 올 배열 입니다. 
	 *  @  	nFromRow 	: 복사해 올 배열의 복사할 행 번호(index) 입니다. 
	 *  @ 	option (JSON)	: 추가 옵션입니다.  (JSON 형태로 넘겨주셔야 합니다. )
	 * 		> overideFields :  현재 배열에 필드가 존재 하지 않을 경우 복사해올 배열의 필드 를 덮어 씌울지 여부 입니다. 
	 *  		- true 		[기본값] 	:  	복사해 올 필드 값을 전부 덮어 씌웁니다. 
	 * 			- false 				:  	현재 지정한 배열에 동일한 필드 값이 없을 경우 필드 값을 복사 하지 않습니다. 
	 * 		> strColInfo 	:  복사할 조건입니다. (ToFieldsID=FromFieldsID,ToFieldsID1=FromFieldsID1)
	 * 			- 값이 없을 경우[기본값]: 	복사할 배열 전체 필드들 복사합니다. 
	 * 			- 지정할 경우  			: 	복사할 배열의 지정한 필드만 복사 합니다 
	 * 		> combine 		:  option에 선언 안한 추가된 필드를 원본에 추가 할지 여부 
	 * 			- true 		:  [default] option.strColInfo 에 있는 필드와 조회한 필드 역시 복사
	 * 			- false 	:  option.strColInfo 에 있는 필드만 복사 [원본에 다른 필드 값이 있을 경우 그대로 남는다.]
	 */
	function copyArrayRow(insertArr,  nToRow, targetArr, nFromRow,  option){
	
	 	if(nToRow === ''  || nToRow === null || nToRow === undefined || nToRow === NaN ){
			return; 
		} 

		if(targetArr === ''  || targetArr === null || targetArr === undefined || targetArr === NaN ){
			return; 
		}

		if(nFromRow === ''  || nFromRow === null || nFromRow === undefined || nFromRow === NaN ){
			return;
		}

		var obj_insertRow =  insertArr[nToRow]; 

		if(obj_insertRow === ''  || obj_insertRow === null || obj_insertRow === undefined || obj_insertRow === NaN ){
			insertArr[nToRow] = {};	
			obj_insertRow = insertArr[nToRow];
		}

		var use_option = {};

		if(option == "undefined" || option == null || option == ""){ //값이 null 이면 option 설정을 초기화 한다. 
			use_option.overideFields 	= true;
			use_option.strColInfo 		= null;
		}else{
			use_option = option; 	
		}

		/* option은 있는데 [overideFields] 가  없을 때를 대비  */
		if(use_option.overideFields === ''  || use_option.overideFields === null || use_option.overideFields === undefined || use_option.overideFields === NaN){
			use_option.overideFields 	= true;
		}

		if(use_option.combine === ''  || use_option.combine === null || use_option.combine === undefined || use_option.combine === NaN){
			use_option.combine 	= true;
		}


		if(use_option.overideFields && use_option.strColInfo == null){
			var fromObj = targetArr[nFromRow];
			for(var i in fromObj){
				obj_insertRow[i] = stringUtil.isNull(fromObj[i])? "": fromObj[i];
			}
		}else if(!use_option.overideFields && use_option.strColInfo == null){
			var fromObj = targetArr[nFromRow];
			for(var i in fromObj){
				if(obj_insertRow[i]){
					obj_insertRow[i] = stringUtil.isNull(fromObj[i])? "": fromObj[i];;
				}
			}
		}else if(use_option.overideFields && use_option.strColInfo != null){
			if(!use_option.strColInfo){
				D.logger.debug("Array.copyRow()   use_option.strColInfo 값이 null 입니다. ");
				return; 
			}

			var str =  use_option.strColInfo ;
			var arrColStr =  str.split(",");
			for(var i in arrColStr){
				if(typeof arrColStr[i] != "function"){
					var insertFieldNM  =  arrColStr[i].split("=")[0]; 
					var targetFieldNM  =  arrColStr[i].split("=")[1]; 

					var fromObj = targetArr[nFromRow];
					obj_insertRow[insertFieldNM] =  stringUtil.isNull(fromObj[targetFieldNM])? "": fromObj[targetFieldNM];
				}
			}
		}else if(!use_option.overideFields && use_option.strColInfo != null){
			if(!use_option.strColInfo){
				D.logger.debug("Array.copyRow()   use_option.strColInfo 값이 null 입니다. ");
				return; 
			}

			var str =  use_option.strColInfo ;
			var arrColStr =  str.split(",");
			for(var i in arrColStr){
				if(typeof arrColStr[i] != "function"){
					var insertFieldNM  =  arrColStr[i].split("=")[0]; 
					var targetFieldNM  =  arrColStr[i].split("=")[1]; 

					var fromObj = targetArr[nFromRow];
					if(obj_insertRow[insertFieldNM]){
						obj_insertRow[insertFieldNM] = stringUtil.isNull(fromObj[targetFieldNM])?"":fromObj[targetFieldNM];		
					}
				}
			}
		}

		if(use_option.combine){
			var fromObj = targetArr[nFromRow];
			for(var i in fromObj){
				obj_insertRow[i] = stringUtil.isNull(fromObj[i])? "": fromObj[i];
			}
		}
	}

	/****************************************************************************
	 * 생년월일과 기준일자로 보험나이를 계산한다.
	 * parameter : brtYmd 생년월일(YYYYMMDD)
	 * parameter : strYmd 기준날짜(YYYYMMDD)
	 * return value 	: 보험나이
	 ****************************************************************************/
	function g_getInsAge(brtYmd,stdYmd)
	{	
		if (stdYmd.length < 1) {
			stdYmd = getDate();
		}
		
		var retVal = 0;
		var monthDiff = getOraMonthsBetween(brtYmd, stdYmd); 
		retVal = Math.round(monthDiff / 12);
		
		return retVal;
	}

	/****************************************************************************
	 * 주민번호에서 생년월일을 가져온다.
	 * parameter : rrn : 주민등록번호(최소 7자리)
	 * return value 	: 생년월일(YYYYMMDD)
	 ****************************************************************************/
	function g_getBirthDayByRegno(regno){

		regno = regno.replace(/-/g, "");

		var genderFlag = regno.substring(6, 1);
		var birthYear = ""; 
		
		switch(genderFlag)
		{
			case "1":
			case "2":
			case "5":
			case "6":
				birthYear = "19";
				break;
			case "3":	// 2000년 이후 출생 국내 남아
			case "4":	// 2000년 이후 출생 국내 여아
				birthYear = "20";
				break;
		}

		
		var val_currentDate = getDate();	
		if(stringUtil.isNull(birthYear)) {
			if( val_currentDate.substring(2, 6) <= regno.substring(0, 6) ) {
				birthYear = "19";
			} else {
				birthYear = "20";
			}
		}
		var birthDay = birthYear + regno.substring(0, 6);

		return birthDay;
	}

	/****************************************************************************
	 * 공통 메세지를 호출 한다. 
	 * -------------------------------------------------------------------------
	 * @ msgId 			: 공통 메세지 코드 
	 * @ devArg 		: 공통 메세지에 들어갈 메세지 파라미터 
	 * @ _callback 		: callback 함수
	 * 		> @ result : 콜백 함수 첫번째 파라미터는 메세지 호출 결과 값을 받는다. 
	 * ------------------------------------------------------------------------- 
	 * > 관련 테이블  	: X_MESSAGE
	 * > 사용예)
	 *  	- 메세지코드
	 *			>  LXXF004 :: 로그인 후, 이용하실 수 있습니다.
	 *			>  dcUtil.g_showMessage("LXXF004");
	 * 		- 메세지 코드 +  callback 
	 * 			dcUtil.g_showMessage("LXXF004", null, function(){ D.logger.debug("aaa")});
	 *
	 * 		-  메세지 코드 + 메세지 1개 
	 * 			> CCCE0002 :: 	"%s 대상상품이 아닙니다."
	 * 			> dcUtil.g_showMessage("CCCE0002", "주계약 납입기간");
	 *
	 * 		-  메세지 코드 + 메세지 1개 + callback
	 * 			> CCCE0002 :: 	"%s 대상상품이 아닙니다."
	 * 			> dcUtil.g_showMessage("CCCE0002", "주계약 납입기간", function(result){ D.logger.debug("callback")});
	 * 
	 * 		-  메세지 코드 + 메세지 2개  
	 *			> CCCW0009 :: 	"%s의 %s을(를) 입력하세요."
     * 			> dcUtil.g_showMessage("CCCW0009", "메세지1, 메세지2");
     * 
     * 		-  메세지 코드 + 메세지 2개  + callback 함수
     * 			> CCCW0009 :: 	"%s의 %s을(를) 입력하세요."
     * 			> dcUtil.g_showMessage("CCCW0009", "첫번째, 두번째", function(result){ D.logger.debug("callback")});
     * 
	 ****************************************************************************/
	function g_showMessage(msgId, devArg, _callback){
    	if( stringUtil.isNull( msgId)){	
    		D.pop.alert({
				title:'dcUtil.g_showMessage 호출 실패',
				message:'dcUtil.g_showMessage 호출 실패 [parameter: msgId 값이 null 입니다.]',
				buttons: ['확인'],
				callback: _callback
			});
    		return; 
    	}

    	/* 
    	 * 메세지 코드 세팅 
    	 */
	    var param = {};
    	param.msgId = msgId;

    	/* 
    	 * taskId, opcode 세팅
    	 */
    	var remote = convertUtil.getRemoteObj('CO_CmnsMessage', 'IQY');
    	param.remote = remote;

    	/* 
    	 * 공통 메세지 service 호출 
    	 */
    	D.http.ajax('/common/messageBean', param).then(function(result){
    		D.logger.debug(result);

    		var obj_DS_MESSAGE =  result.remoteResult.outDataSet.DS_MESSAGE.data ; 

    		if(obj_DS_MESSAGE.length < 1 ){
    			dialog.alert('dcUtil.g_showMessage 호출 실패 [' + msgId + ' 코드가 존재 하지 않습니다.]').then(_callback);
    			return ; 
    		}

    		var msgText = obj_DS_MESSAGE[0].PDT_TEXT;

    		/* 
    		 * 파라미터에 "," 가 들어가 있으면 배열로 만든다. 
    		 */
    		var msgValue = null;
    		var arr_devArg;
    		var message = ""; //리턴 할 값
    		var arr_msgText = msgText.split("%s");
    		if(devArg){
    			if(devArg instanceof Array  ||  devArg.indexOf(",") != -1){ //파라미터가 여러건 일 경우 
    				if(devArg.indexOf(",") != -1){
    					arr_devArg = devArg.split(",");
    				}else{
    					arr_devArg = devArg;
    				}
	    		 	
	    		 	for(var i = 0; i < arr_msgText.length; i++) {
		                if (i < arr_devArg.length) {
		                    message += arr_msgText[i] + arr_devArg[i];
		                } else {
		                    message += arr_msgText[i];
		                }
		            }
	    		}else{
					message = msgText.replace(/%s/g, devArg);	    			
	    		}
    		}else{
    			message = msgText.replace(/%s/g, devArg);
    		}
    		
    		dialog.alert(message).then(function(){
    			if(_callback){
    				_callback(result);		
    			}
    		});
    	});   
	}

	/****************************************************************************
	 * Oracle의 MONTHS_BETWEEN(toDate, fromDate)을 계산한다. (From/To 날짜순서주의)
	 * from DtUtil.java
	 ****************************************************************************/
	function getOraMonthsBetween(fromDate,toDate) {
		var monthsGap = 0;

		var divisor  = 31.0	;	//제수
		var dividend = 0.0	;	//피제수

		var yearGap  = parseInt(toDate.substring( 0, 4)) - parseInt(fromDate.substring(0, 4));
		var monthGap = parseInt(toDate.substring( 4, 2)) - parseInt(fromDate.substring(4, 2));
		var dayGap   = 0;
		
		// 두일자가 모두 말일이면 같은 일자로 간주한다.
		
		;

		if (dateUtil.addDate(fromDate, 'm', 1).substring(6, 2) != "01" 
		      || dateUtil.addDate(toDate, 'm', 1).substring(6, 2) != "01") {
			dayGap = parseInt(toDate.substring(6, 2)) - parseInt(fromDate.substring(6,2));
		}
		
		//계산한다.
		dividend = ( ( yearGap * 12 ) + monthGap ) * divisor + dayGap;
		
		//결과 계산
		monthsGap = ( dividend / divisor ) ;
		
		return monthsGap;
	}



	/****************************************************************************
	 * 문자열 값이 전체가 숫자인지 아닌지를 판단 
	 * --------------------------------------------------------------------------
	 * @ str  : 문자열 값 
 	 ****************************************************************************/ 
	function isNumberic(str){
		if(stringUtil.isNull(str)){
			return; 
		}
		return /^\d+$/.test(str); 
	}

	/****************************************************************************
	 * 객체 배열(object Array)을 정렬하는 함수 
	 * --------------------------------------------------------------------------
	 * @ array  	: 정렬할 대상 배열 	
	 * @ fieldNM 	: 정렬할 필드 
	 * @ option	: 
	 * 		option.type : 필드 타입 default  [number] (* 필드 값 타입이 일차 해야 한다. 다르면 제대로 정렬 안될수도 있음)
	 *			> 	"N" : 숫자형 [Number]
	 *			> 	"S" : 문자형 [String]
	 * 		option.sort : default 는 오름차순 이다. 
	 * 			> 	"A" : 오름차순(asc) 
	 * 			> 	"D" : 내림차순(desc) 
	 * 		options.copyYN : 배열을 copy 할 것인지 여부  [default: true];
	 * 			>  true : 배열을 copy [default]
	 * 			>  false: 전달 받은 배열 자체를 바꾼다. 
	 * @ return : 정렬한 배열을 리턴 해준다. 이때 배열은 copy된 배열이다. 
 	 ****************************************************************************/ 
 	function objectArraySort(array, fieldNM, option){
 		
 		if(stringUtil.isNull(array)){
 			return ; 
 		}

 		if(stringUtil.isNull(fieldNM)){
 			return; 
 		}

 		if(array.length < 1){
 			return ;
 		}

 		if(stringUtil.isNull(option)){
 			option = {};
 			option.type = "N";
 			option.sort = "A";
 			option.copyYN = true;
 		}

 		if(stringUtil.isNull(option.type)){
 			option.type = "N";
 		}

 		if(stringUtil.isNull(option.sort)){
 			option.type = "A";
 		}

 		if(stringUtil.isNull(option.copyYN)){
 			option.copyYN = true;
 		}

 		var copy_array; 
 		if(option.copyYN){
 			copy_array = $.extend([], array);	
 		}else{
 			copy_array = array; 
 		}

 		if(option.type == "N"){ 	//숫자형 정렬 일 때 
 			if(option.sort == "A"){	//오름차순이면
	 			return copy_array.sort(function(a, b){return a[fieldNM] - b[fieldNM]; });
 			}else{
 				return copy_array.sort(function(a, b){return b[fieldNM] - a[fieldNM]; });
 			}
 		}else{ 	//문자열 일때 
 			if(option.sort == "A"){	//오름차순이면
	 			return copy_array.sort(function(a, b){return a[fieldNM] < b[fieldNM] ? -1 : a[fieldNM] > b[fieldNM] ? 1 : 0; });
 			}else{
 				return copy_array.sort(function(a, b){return a[fieldNM] >	b[fieldNM] ? -1 : a[fieldNM] < b[fieldNM] ? 1 : 0; });
 			}
 		}
 	}
 	
 	
	/****************************************************************************
	 * 계좌정보관리 팝업
	 ****************************************************************************/
 	function cf_openPopAcc(param, callback){
 		 dialog.openPopup('/www/html/view/dc/DC-0231P', param).then(callback);
 	}
 	
 	/****************************************************************************
	 * 신용카드정보관리 팝업
	 ****************************************************************************/
 	function cf_openPopCrd(param, callback){
		 dialog.openPopup('/www/html/view/dc/DC-0232P', param).then(callback);
	}


	/****************************************************************************
	 * 보험료 계산
	 * @param dcKncdInf 할인정보 dw
	 * @param calcPrem 보험료 dw
	 * 
	 * @return {} 계산된 보험료obj
	 ****************************************************************************/
	function getCalcPrem(dcKncdInf, calcPrem) {

		var dcAmt = 0, dcAmt2 = 0; 
		if ( dcKncdInf.length > 0 ) {
			dcAmt = dcKncdInf.find(function(o) { return o.DC_KNCD == '3' }) ? parseInt(dcKncdInf.find(function(o) { return o.DC_KNCD == '3' }).DC_AMT) : 0;
			dcAmt2 = dcKncdInf.find(function(o) { return o.DC_KNCD == '15' }) ? parseInt(dcKncdInf.find(function(o) { return o.DC_KNCD == '15' }).DC_AMT) : 0;
		}
		
		var sumPrem = calcPrem ? calcPrem.SUM_PREM : 0;
		var realPyprm = parseInt(sumPrem) - dcAmt - dcAmt2; // 할인후 보험료
		var sumDcAmt = dcAmt + dcAmt2; // 할인보험료
		
		return {
			  sumPrem : sumPrem // 합계보험료
			, mhypymPrem : calcPrem.MHYPYM_STD_PREM // 월납 보험료
			, realPyprm : realPyprm // 할인후 보험료
			, sumDcAmt : sumDcAmt // 할인보험료
		}
	}


	/* 
	 * talk 약관 전송 
	 */
	/****************************************************************************
	 * 계좌정보관리 팝업
	 *--------------------------------------------------------------------------
	 * pr_no :  증권번호
	 ****************************************************************************/
	function talkTerm(pr_no , _callback){
		if(stringUtil.isNull(pr_no)){
			dialog.alert("증권번호를 입력해 주세요.");
			return;
		}
		
		var args = {};
		args.remote 	= {};
		args.pr_no 		= pr_no; 	//증권번호
		
		//파일생성위치를 저장
		//rootpath 를 가져온다.
		D.http.ajax("/common/share/termTalk", args).then(function(result){
			if(result.errorMsg){
				dialog.alert(result.errorMsg);
				return; 
			}
			if(_callback){
				_callback(result);
			}
		});
		
	}
	

	/****************************************************************************
	 *	약관 view
	 *--------------------------------------------------------------------------
	 * pr_no :  증권번호
	 ****************************************************************************/
	function viewTerm(pr_no , _callback){
		if(stringUtil.isNull(pr_no)){
			dialog.alert("증권번호를 입력해 주세요.");
			return;
		}
		
		var args = {};
		args.remote 	= {};
		args.pr_no 		= pr_no; 	//증권번호
		
		//파일생성위치를 저장
		//rootpath 를 가져온다.
		D.http.ajax("/common/share/termView", args).then(function(result){
			if(result.errorMsg){
				dialog.alert(result.errorMsg);
				return; 
			}
			if(_callback){
				_callback(result);
			}
		});
		
	}



	/****************************************************************************
	 *	부본 view
	 *--------------------------------------------------------------------------
	 * pr_no :  증권번호
	 ****************************************************************************/
	function viewBubun(pr_no , _callback){
		if(stringUtil.isNull(pr_no)){
			dialog.alert("증권번호를 입력해 주세요.");
			return;
		}
		
		
		
		
		var args = {};
		args.remote 	= {};
		args.pr_no 		= pr_no; 	//증권번호
		args.KEY = "viewBuBun"; // 부본 view 구분
	
		
		
		//파일생성위치를 저장
		//rootpath 를 가져온다.
		D.http.ajax("/common/share/viewBubun", args).then(function(result){
			if(result.errorMsg){
				dialog.alert(result.errorMsg);
				return; 
			}
	
		
		});
		
	}
	function talkTermTest(pr_no, phone_num , _callback){

		if(stringUtil.isNull(pr_no)){
			dialog.alert("증권번호를 입력해 주세요.");
			return ; 
		}

		if(stringUtil.isNull(phone_num)){
			dialog.alert("전화번호를 입력해 주세요.");
			return ; 
		}

		var args = {};
		args.remote 	= {};
		args.pr_no 			= pr_no; 		//증권번호
		args.PHONE_NUM 		= phone_num; 	//발송할전화번호
		
		//파일생성위치를 저장
		//rootpath 를 가져온다.
		D.http.ajax("/common/share/termTalkTest", args).then(function(result){
			if(result.errorMsg){
				dialog.alert(result.errorMsg);
				return; 
			}
			if(_callback){
				_callback(result);
			}
		});

	}


	/****************************************************************************
	 * talk 옴니를 발송 
	 *--------------------------------------------------------------------------
	 * pr_no :  증권번호
	 ****************************************************************************/

	function talkOmni(pr_no, phone_num, sign , _callback){

		if(stringUtil.isNull(pr_no)){
			dialog.alert("증권번호를 입력해 주세요.");
			return ; 
		}

		if(stringUtil.isNull(phone_num)){
			dialog.alert("전화번호를 입력해 주세요.");
			return ; 
		}

		if(stringUtil.isNull(sign)){
			dialog.alert("서명 값을 입력해 주세요.");
			return ; 
		}

		var args = {};
		args.remote 	= {};
		args.pr_no 		= pr_no; 		//증권번호 !!!!!!
		args.PHONE_NUM 	= phone_num; 	//발송할전화번호 !!!!!
		args.SIGN 		= sign; 		//서명데이터  
		
		//파일생성위치를 저장
		//rootpath 를 가져온다.
		D.http.ajax("/common/share/omniTalk", args).then(function(result){
			if(result.errorMsg){
				dialog.alert(result.errorMsg);
				return; 
			}
			if(_callback){
				_callback(result);
			}
		});
	}


	function testOmni(url,args, _callback){
		
		args.remote 	= {};
		//파일생성위치를 저장
		//rootpath 를 가져온다.
		D.http.ajax(url, args).then(function(result){
			if(result.errorMsg){
				dialog.alert(result.errorMsg);
				return; 
			}
			
			if(_callback){
				_callback(result);
			}
		});

	}
	

	/**************************************************************************** 
	 * talk Email 약관을 전송 
	 *--------------------------------------------------------------------------
	 * pr_no :  증권번호 
	 ****************************************************************************/
	function termEmailTalk(pr_no , _callback){
		if(stringUtil.isNull(pr_no)){
			dialog.alert("증권번호를 입력해 주세요.");
			return;
		}
		
		var args = {};
		args.remote 	= {};
		args.pr_no 		= pr_no; 	//증권번호
//		fn_eformProcess(args.pr_no , function(result){ //PDF 저장을 실행 
//			if(result.RESULT_CD == "99"){
//				dialog.alert(result.RESULT);
//				return; 
//			}
			//파일생성위치를 저장
			//rootpath 를 가져온다.
		D.http.ajax("/common/share/termEmailTalk", args).then(function(result){
			if(result.errorMsg){
				dialog.alert(result.errorMsg);
				return; 
			}
			if(_callback){
				_callback(result);
			}
		});
//		});
	}

	/**************************************************************************** 
	 * talk Email 부본을 전송 
	 *--------------------------------------------------------------------------
	 * pr_no :  증권번호 
	 ****************************************************************************/
	function bubunEmailTalk(pr_no , _callback){
		if(stringUtil.isNull(pr_no)){
			dialog.alert("증권번호를 입력해 주세요.");
			return;
		}
		
		var args = {};
		args.remote 	= {};
		args.pr_no 		= pr_no; 	//증권번호
//		fn_eformProcess(args.pr_no , function(result){ //PDF 저장을 실행 
//			if(result.RESULT_CD == "99"){
//				dialog.alert(result.RESULT);
//				return; 
//			}
			//파일생성위치를 저장
			//rootpath 를 가져온다.
		D.http.ajax("/common/share/bubunEmailTalk", args).then(function(result){
			if(result.errorMsg){
				dialog.alert(result.errorMsg);
				return; 
			}
			if(_callback){
				_callback(result);
			}
		});
//		});
	}

	/**************************************************************************** 
	 * talk 부본을 전송 
	 *--------------------------------------------------------------------------
	 * pr_no :  증권번호 
	 ****************************************************************************/
	function talkBubun(pr_no , _callback){
		if(stringUtil.isNull(pr_no)){
			dialog.alert("증권번호를 입력해 주세요.");
			return;
		}
		
		var args = {};
		args.remote 	= {};
		args.pr_no 		= pr_no; 	//증권번호
		args.reSend 		= 'N'; 	
//		fn_eformProcess(args.pr_no , function(result){ //PDF 저장을 실행 
//			if(result.RESULT_CD == "99"){
//				dialog.alert(result.RESULT);
//				return; 
//			}
			//파일생성위치를 저장
			//rootpath 를 가져온다.
		D.http.ajax("/common/share/bubunTalk", args).then(function(result){
			if(result.errorMsg){
				dialog.alert(result.errorMsg);
				return; 
			}
			if(_callback){
				_callback(result);
			}
		});
//		});
	}
	
	function talkBubunTest(pr_no, phone_num , _callback){

		if(stringUtil.isNull(pr_no)){
			dialog.alert("증권번호를 입력해 주세요.");
			return ; 
		}

		if(stringUtil.isNull(phone_num)){
			dialog.alert("전화번호를 입력해 주세요.");
			return ; 
		}

		var args = {};
		args.remote 	= {};
		args.pr_no 			= pr_no; 		//증권번호
		args.PHONE_NUM 		= phone_num; 	//발송할전화번호
		
		//파일생성위치를 저장
		//rootpath 를 가져온다.
		D.http.ajax("/common/share/bubunTalkTest", args).then(function(result){
			if(result.errorMsg){
				dialog.alert(result.errorMsg);
				return; 
			}
			if(_callback){
				_callback(result);
			}
		});

	}

	
	/**************************************************************************** 
	 * 부본 이메일을 전송한다.
	 *--------------------------------------------------------------------------
	 * pr_no :  증권번호 
	 ****************************************************************************/
	function bubunEmail( pr_no , _callback){
		
		if(stringUtil.isNull(pr_no)){
			dialog.alert("증권번호를 입력해 주세요.");
			return;
		}
		
		var args = {};
		args.remote 	= {};
		args.pr_no 		= pr_no; 	//증권번호
//		fn_eformProcess(args.pr_no , function(result){ //PDF 저장을 실행 
//			if(result.RESULT_CD == "99"){
//				dialog.alert(result.RESULT);
//				return; 
//			}
			//파일생성위치를 저장
			//rootpath 를 가져온다.
		D.http.ajax("/dc/IndvCsInqEJB/bubunEmail", args).then(function(result){
			if(result.errorMsg){
				dialog.alert(result.errorMsg);
				return; 
			}
			if(_callback){
				_callback(result);
			}
		});
//		});
	}

	
	/**************************************************************************** 
	 * 약관 이메일을 전송한다.
	 *--------------------------------------------------------------------------
	 * pr_no :  증권번호 
	 ****************************************************************************/
	function termEmail( pr_no , _callback){
		if(stringUtil.isNull(pr_no)){
			dialog.alert("상품코드를 입력해 주세요. ");
			return;
		}
		
		var args = {};
		args.remote 	= {};
		args.pr_no 		= pr_no; 	//증권번호
//		fn_eformProcess(args.pr_no , function(result){ //PDF 저장을 실행 
//			if(result.RESULT_CD == "99"){
//				dialog.alert(result.RESULT);
//				return; 
//			}
			//파일생성위치를 저장
			//rootpath 를 가져온다.
		D.http.ajax("/dc/IndvCsInqEJB/termEmail", args).then(function(result){
			if(result.errorMsg){
				dialog.alert(result.errorMsg);
				return; 
			}
			if(_callback){
				_callback(result);
			}
		});
//		});
	}
	
	/**************************************************************************** 
	 * 계약자에게 약관/부본 이메일을 전송한다.
	 * -  이메일여부선체크하여 발송
	 *--------------------------------------------------------------------------
	 * pr_no :  증권번호 
	 ****************************************************************************/
	function termBubunEmail( pr_no , insutCode,  _callback){
		if(stringUtil.isNull(pr_no)){
			dialog.alert("증권번호를 입력해 주세요.");
			return;
		}
		
		var args = {};
		args.remote 	= {};
		args.pr_no 		= pr_no; 	//증권번호
		args.insutCode	= insutCode;
		D.http.ajax("/common/share/termBubunEmail", args).then(function(result){
			if(result.errorMsg){
				dialog.alert(result.errorMsg);
				return; 
			}
			if(_callback){
				_callback(result);
			}
		});
	}


	function fn_eformProcess(p_pr_no, _callback){
		if(stringUtil.isNull(p_pr_no)){
			return; 
		}

		var param = {
			command 		: 'DEP',																			// TEMP : 전자서식 임시저장 / SAVE : 전자서식 최종저장 / SIGN : 디지털서명 삽입 / PDF : 저장된 PDF 파일 조회 (OutputStream)/ IMG : 이미지 시스템 전송 / DEP : 입금여부(DEP_YN) 수정  / PASS : PDF 에 암호 설정하여 출력 
			pr_no 			: p_pr_no,																			// 증권번호
			form_seq 		: '00',																				// 서식순번
			kubun			: 'SUB',																			// SUB / OMNI
			// json_data 		: '',																			// 서식데이터
			// eform_data 		: '',																			// 입력데이터
			inf_data 		: 'NP,01,' + p_pr_no + ',,,B711,00|00,IMG,,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',		// 이미지전송을 위한 정보(콤마 구분)
			// sign_data 		: '30820202020202121212',														// HEXA 전자서명값
			pdf_type		: 'FILEPATH'	, 
			// page_data 		: '',
			// pdf_password 	: ''																			// PDF 암호
		};

		clipUtil.eformProcess(param)
		.then(function(result){
			
			if(_callback){
				_callback(result);	
			}

		});
	}
	

	
	/**************************************************************************** 
	 * 보험 가입 바로 확인 서비스 (약관 + 부본 + 완전판매모니터링)
	 *--------------------------------------------------------------------------
	 * pr_no :  증권번호 
	 * bat_yn : 배치여부
	 ****************************************************************************/
	function totalTalk(pr_no , _callback, bat_yn){
		if(stringUtil.isNull(pr_no)){
			dialog.alert("증권번호를 입력해 주세요.");
			return;
		}
		
		var param = {};
		param.remote 	= {};
		param.pr_no 	= pr_no; 	//증권번호
		param.bat_yn  	= bat_yn; 		// 배치여부

		D.http.ajax("/common/share/totalTalk", param).then(function(result){
			if(result.errorMsg){
				dialog.alert(result.errorMsg);
				return; 
			}
			if(_callback){
				_callback(result);
			}
		});

	}
	
	/* 
	 * 클립보드로 주어진 값을 copy 한다. 
	 */ 
	function copyToClipBoard(text){
		if(stringUtil.isNull(text)){
			dialog.alert("클림보드로 copy 할 값이 없습니다.");
			return; 
		}
		var $textarea = $("<textarea/>").appendTo("body");
		$textarea.val(text);
		$textarea.select();
		document.execCommand('Copy');
		$textarea.remove();
	}
	function getInsCtrPrpsCheck(prdcdcd, insCtrPrps , fdcd){
		var result = true;

		//  fdcd A01401 글로벌AI플랫폼액티브형
		//  fdcd A01501 글로벌AI플랫폼밸런스형
		//  fdcd A01601 글로벌AI플랫폼세이프형		
		if(!/^(GW)/.test(prdcdcd)){
			return result;
		}
		
		// 적극투자형
		if(insCtrPrps == '07' && fdcd == 'A01401'){
			return false;
		}

		// 위험중립형
		if(insCtrPrps == '06' && (fdcd == 'A01401' || fdcd == 'A01501') ){
			return false;
		}
		
		// 안정추구형
		// 위험회피형
		if((insCtrPrps == '05' || insCtrPrps == '04')){
			return false;
		}

		return result;
	}
	
	return {
		bindMenuToggleEvent : bindMenuToggleEvent
		, getAmtMulUnt : getAmtMulUnt
		, getAmtDivUnt : getAmtDivUnt
		, convertObj : convertObj
		, getPeriod : getPeriod
		, getGenderNm : getGenderNm
		, getPridNm : getPridNm
		, addCommas : addCommas
		, getCdList : getCdList
		, setCdSelect : setCdSelect
		, setCdRadio : setCdRadio
		, amtDivUnt : amtDivUnt
		, removeCommas : removeCommas
		, cf_getCdListByMultiCatCd : cf_getCdListByMultiCatCd
		, sf_getCodeList : sf_getCodeList
		, getDupRmvArr : getDupRmvArr
		, getGrepCondi : getGrepCondi
		, copyArrayRow : copyArrayRow
		, g_getInsAge : g_getInsAge
		, g_getBirthDayByRegno : g_getBirthDayByRegno
		, g_showMessage : g_showMessage
		, getOraMonthsBetween : getOraMonthsBetween
		, isNumberic : isNumberic
		, objectArraySort : objectArraySort
		, cf_openPopAcc : cf_openPopAcc
		, cf_openPopCrd : cf_openPopCrd
		, splitAddSep : splitAddSep
		, getCalcPrem : getCalcPrem
		, talkTerm : talkTerm
		, talkBubun : talkBubun
		, bubunEmail : bubunEmail
		, termEmail : termEmail
		, termBubunEmail : termBubunEmail
		, copyToClipBoard : copyToClipBoard
		, talkTermTest : talkTermTest
		, talkBubunTest : talkBubunTest
		, talkOmni : talkOmni
		, testOmni : testOmni
		, viewTerm : viewTerm
		, viewBubun : viewBubun
		, bubunEmailTalk : bubunEmailTalk
		, termEmailTalk : termEmailTalk
		, getCnsgUserInfo : getCnsgUserInfo
		, totalTalk : totalTalk
		, getInsCtrPrpsCheck: getInsCtrPrpsCheck
	};
})(jQuery, window.Dcore);






