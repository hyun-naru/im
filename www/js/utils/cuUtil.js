/*******************************************************************************
 * Function List
 *******************************************************************************
 *
 * *** 고객관리 유틸 ***************************************************
 * np_inquiryLwrkChn    : 채널 조회
 * np_inquiryLwrkHq		: 하위본부조회
 * np_inquiryLwrkGrpofc : 하위지역단 조회
 * np_inquiryLwrkOfc	: 하위점포 조회
 * np_inquiryPlarInfo   : 소속설계사 조회
 * np_inquiryPlar		: 지점 소속 설계사 조회
 * cf_getCdList			: 공통코드 조회
 * setCdSelect			: 공통코드 세팅 (selectBox기준)
 * setSelectOpt			: selectbox option 세팅
 * cf_getCdListByMultiCatCd : 분류코드리스트를 입력받아 해당 세부코드의 목록을 반환한다(CodeBeanController 사용).
 * sf_getCodeList		: 사용자가 필요로 하는 COMBO DATA를 생성하여 반환한다.(CmnsCodUtilController 사용)
 * g_showMessage		: 
 * isAlpha				: 알파벳인지 체크
 * getSplitTelNum       : 연락처 split  000-0000 or 0000000 => {'000','0000')
 * clone 				: Object 를 Clone 하여 반환 한다.
 * getAmtSttDisp 		: 보장자산 준비 표시값 반환
 * getAgrmDisp 			: 마케팅 동의 여부 표시값 반환
 * getGndrSecdNm 		: 성별구하기
 * getCntadSecdNm 		: 우편물 수령지명 구하기
 * getPeriod			: 기준일로 부터 1주, 2주, 한달 이전 날짜 반환

 ******************************************************************************/

var cuUtil = (function($, D){
	
	var np_strCloseFlag = "01";	//운영여부
	
	/*******************************************************************************
	* 설명          : 채널 조회
	* parameter     : 
	*******************************************************************************/
	function np_inquiryLwrkChn (fn_callback)
	{	    
	    var remote = convertUtil.getRemoteObj("FG_WrbzCmnsInq", "UDQ07");

	   
	    
	    var param ={
	    		OFC_SECD : "02"	//채널코드
				,remote : remote
		}
		
		D.http.ajax('/sw/swAllNP', param).then(function(result) {
			
			
			if(!stringUtil.isNull(fn_callback)){
				fn_callback(result);
			}
			
			
		});
	    
	}
	
	
	/*******************************************************************************
	* 설명          : 하위본부 조회
	*  parameter     : objofcCod  채널코드  ofcSecd   점포구분코드
	*******************************************************************************/
	function np_inquiryLwrkHq (ofcCod,ofcSecd, fn_callback)
	{	    
	    var remote = convertUtil.getRemoteObj("FG_WrbzCmnsInq", "UDQ21");
	    
	    if(!stringUtil.nvl(ofcSecd)){
	    	ofcSecd = "02"; //본부
	    }
	    
	    var param ={
	    		ofcCod : ofcCod					//점포코드
	    		,ofcSecd : ofcSecd				//점포구분코드
	    		,strCloseYn : np_strCloseFlag	//운영여부
				,remote : remote	
		}
		
		D.http.ajax('/sw/swAllNP', param).then(function(result) {
			
			
			if(!stringUtil.isNull(fn_callback)){
				fn_callback(result);
			}
			
			
		});
	    
	}
	
	/*******************************************************************************
	* 설명          : 하위지역단 조회
	* parameter     : objofcCod  본부코드  ofcSecd   점포구분코드 
	*******************************************************************************/
	function np_inquiryLwrkGrpofc (ofcCod ,ofcSecd, fn_callback)
	{	    
	    var remote = convertUtil.getRemoteObj("FG_WrbzCmnsInq", "UDQ00");
	    
	    if(!stringUtil.nvl(ofcSecd)){
	    	ofcSecd = "03"; //사업단
	    }
	    
	    var param ={
	    		ofcCod : ofcCod					//점포코드
	    		,ofcSecd : ofcSecd				//점포구분코드
	    		,strCloseYn : np_strCloseFlag	//운영여부
				,remote : remote	
		}
		
		D.http.ajax('/sw/swAllNP', param).then(function(result) {
			
			
			if(!stringUtil.isNull(fn_callback)){
				fn_callback(result);
			}
			
			
		});
	    
	}
	
	/*******************************************************************************
	* 설명          : 하위점포 조회
	* parameter     : objofcCod  점포코드  ofcSecd   점포구분코드
	*******************************************************************************/
	function np_inquiryLwrkOfc (ofcCod ,ofcSecd, fn_callback)
	{	    
	    var remote = convertUtil.getRemoteObj("FG_WrbzCmnsInq", "UDQ01");
	    
	    if(!stringUtil.nvl(ofcSecd)){
	    	ofcSecd = "04"; //지점
	    }
	    
	    var param ={
	    		ofcCod : ofcCod					//점포코드
	    		,ofcSecd : ofcSecd				//점포구분코드
	    		,strCloseYn : np_strCloseFlag	//운영여부
				,remote : remote	
		}
		
		D.http.ajax('/sw/swAllNP', param).then(function(result) {			
			
			if(!stringUtil.isNull(fn_callback)){
				fn_callback(result);
			}
			
			
		});
	    
	}
	
	
	
	/*******************************************************************************
	* 설명          : 소속설계사 조회
	* parameter     : objofcCod  점포코드
	*******************************************************************************/
	function np_inquiryPlarInfo (ofcCod, ofcCsRlePk, fn_callback){
		
		var remote = convertUtil.getRemoteObj("FG_WrbzCmnsInq", "UDQ02");
		
		var param ={
				ofcCod : stringUtil.nvl(ofcCod,""),	//점포코드
				ofcCsRlePk : ofcCsRlePk,			//고객점포역할고유번호
				rdoInqSctn	: 2,					//설계사명:1 or 점포코드:2
				cmbInqCd : 40,						//재직구분(위촉:40 or 해촉 : 41 or 재위촉: 42)
				remote : remote
		}
		
		D.http.ajax('/sw/swAllNP', param).then(function(result) {
			
			
			if(!stringUtil.isNull(fn_callback)){
				fn_callback(result);
			}
			
			
		});
		
	}
	
	/*******************************************************************************
	* 설명			: 고객점포역할고유번호 조회 
	* parameter     : ofcCod		점포코드
	*			
	*******************************************************************************/
	function np_inquiryPlar (ofcCod, fn_callback){
		
		var remote = convertUtil.getRemoteObj("FG_WrbzCmnsInq", "UDQ03");
		
		var param ={
				ofcCod : stringUtil.nvl(ofcCod,""),	//점포코드
				remote : remote
		}
		
		D.http.ajax('/sw/swAllNP', param).then(function(result) {
			
			np_inquiryPlarInfo
			
			if(!stringUtil.isNull(fn_callback)){
				fn_callback(result);
			}
			
			
		});
		
	}
	
	/**
	 * 공통코드 조회
	 * @param globalDataKey 명 ex) D.global.getGlobalData(globalDataKey);	 * 
	 * @param clsfcd 
	 * @param selFlag
	 * @param adHeader 
	 * @param apptYmdFlag
	 * @param fn_callback
	 */
	function cf_getCdList(clsfcd,selFlag,adHeader,apptYmdFlag,fn_callback){
		
		var remote = convertUtil.getRemoteObj("CodeBean", "X_UDQ01");
		
		var param = {	
			clsfcd:clsfcd,
			selFlag:selFlag,
			adHeader:adHeader,
			apptYmdFlag:apptYmdFlag,
			remote : remote
		};
			
		D.http.ajax('/common/codeBean', param).then(function(result) {
			
			if(!stringUtil.isNull(fn_callback)){
				fn_callback(result);
			}
			
		});
	}
	
	/**
	 * 공통코드 세팅 selectbox
	 * @param dataset 명
	 * @param selId selectbox id 
	 */
	function setCdSelect(DS_TEMP_CD, selId, fn_callback){
	
		var DS_CODE = DS_TEMP_CD;
		//D.logger.debug(DS_CODE);
		
		var str ="";
		
		$.each(DS_CODE, function(key, value){
			
			str += "<option value="+value.COD+">"+value.COD_NAM+"</option>";		
			 				
		});
		
		$("#"+selId).html(str);
		
		if(!stringUtil.isNull(fn_callback)){
			fn_callback();
		}
	}
	
	/**
	 * selectbox option 세팅
	 * @param codeList : 코드 목록
	 * @param nam : option text값
	 * @param cod : option value값
	 * @param selId : selectbox id 
	 *  @param fn_callback 콜백
	 */
	function setSelectOpt(codeList,all,nam,cod, selId, fn_callback){
		
		var str ="";
		if(all=="전체"){
			str = "<option value=''>전체</option>";
		}
		if(!stringUtil.isNull(codeList)){
			$.each(codeList, function(key, value){
				
				str += "<option value="+value[cod]+">"+value[nam]+"</option>";		
				 				
			});
		}
		$("#"+selId).html(str);	
		
		if(!stringUtil.isNull(fn_callback)){
			fn_callback();
		}
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
	 * 		cuUtil.cf_getCdListByMultiCatCd(arr_codInfo, function(result){
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
	* 사용법 		: (사용 예) cuUtil.sf_getCodeList("C_UDQ08", param, "N", "전체:_", "Y", function(result){
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
			
			if(!stringUtil.isNull(fn_callback)){
				fn_callback(result);
			}
			
			
		});
	}
	
	/**
	 * 메세지 다이얼로그를 보여줍니다.
	 */
	function g_showMessage (msgId, devArg, pdtArg){
		
	}	
	
	/**
	 * 알파벳 체크
	 */
	function isAlpha (ch){
		var chUnicode = ch.charCodeAt(0);
		if(65 <= chUnicode && chUnicode <=90) return true; //대문자
		if(97 <= chUnicode && chUnicode <= 122) return true; //소문자
		return false;
	}
	
	/**
	 * 알파벳 체크(문자열)
	 */
	function isAlphaStr(str){
		
		for(var i=0; str.length < i; i++){
			if(isAlpha(str[i]) == false){
				return false;
			}
		}
		
		return true;
	}
	
	/**
	 * 연락처 split  10자리 000-000-0000 or 0000000000 => {'000','000','0000')
	 * 				 11자리 000-0000-0000 or 00000000000 => {'000','0000','0000')
	 */
	function getSplitTelNum(num){
		var result ={};
		
		if(num.length=='10'){
			result[0]=stringUtil.subStr(num,0,3);
			result[1]=stringUtil.subStr(num,3,3);
			result[2]=stringUtil.subStr(num,6,4);
		}else if(num.length=='11'){
			result[0]=stringUtil.subStr(num,0,3);
			result[1]=stringUtil.subStr(num,3,4);
			result[2]=stringUtil.subStr(num,7,4);
		}
		
		return result;
	}
	
	/**
	 * Object 를 Clone 하여 반환 한다.
	 * @param obj
	 * @returns
	 */
	function clone(obj) {
		
		if (typeof obj != "object") {
			message.alert('CO.0009');
			return obj;
		} else {
			return JSON.parse(JSON.stringify(obj));
		}
		
	};
	
	/**
	 * 보장자산 준비 표시값 반환
	 * @param obj
	 * @returns
	 */
	function getAmtSttDisp(val){
		if(val=="1"){
			return "O";
		}else if(val=="2"){
			return "△";
		}else if(val=="3"){
			return "X";
		}
	}
	
	/**
	 * 마케팅 동의 여부 표시값 반환
	 * @param obj
	 * @returns
	 */
	function getAgrmDisp(val){
		if(val=="Y"){
			return "O";
		}else{			
			return "X";
		}
	}
	
	/**
	 *  성별구하기
	 */
	function getGndrSecdNm(gndrSecd){
		var str ='';
		
		if(gndrSecd=='1'){
			str = '남';
		}else if(gndrSecd=='2'){
			str = '여';
		}else{
			str = '공통';
		}
		
		return str;
	}
	
	/**
	 * 우편물 수령지명 구하기
	 */
	function getCntadSecdNm(cntadSecd){
		
	var str ='';
		
		if(cntadSecd=='5'){
			str = '자택';
		}else if(cntadSecd=='6'){
			str = '직장';
		}else{
			str = '발행안함';
		}
		
		return str;
	}
	
	/** 
	 * 기준일로부터 
	 * @param code 구분코드 ( 7일전 : d_7, 14일전 : d_14, 한달전 : m_1)
	 * @param token 날짜 포멧 구분 값 
	 * ex) getPeriod('d-7','-') : '2017-01-01'
	 * 	   getPeriod('d-7','') : '20170101'
	 * 날짜를 표시한다
	 */
	function getPeriod(code,token) {
		code = code.split('_');
		
		var slctDate = dateUtil.addDate(dateUtil.getDate(), code[0], parseInt("-" +code[1]), '');
		
		if(!stringUtil.isNull(token)){
			slctDate = dateUtil.setFmDate(slctDate,token);
		}		
	
		return slctDate;
	}
	
	return {
		 np_inquiryLwrkChn : np_inquiryLwrkChn
		, np_inquiryPlarInfo : np_inquiryPlarInfo
		, np_inquiryPlar : np_inquiryPlar
		, cf_getCdList : cf_getCdList
		, setCdSelect : setCdSelect
		, cf_getCdListByMultiCatCd : cf_getCdListByMultiCatCd
		, sf_getCodeList : sf_getCodeList
		, g_showMessage : g_showMessage
		, isAlpha : isAlpha
		, isAlphaStr : isAlphaStr
		, getSplitTelNum : getSplitTelNum
		, clone : clone
		, getAmtSttDisp : getAmtSttDisp
		, getAgrmDisp : getAgrmDisp
		, getGndrSecdNm : getGndrSecdNm
		, getCntadSecdNm : getCntadSecdNm
		, np_inquiryLwrkHq : np_inquiryLwrkHq
		, np_inquiryLwrkGrpofc : np_inquiryLwrkGrpofc
		, np_inquiryLwrkOfc : np_inquiryLwrkOfc
		, setSelectOpt : setSelectOpt
		, getPeriod : getPeriod
		
	};
	
	
	
	

})(jQuery, window.Dcore);

