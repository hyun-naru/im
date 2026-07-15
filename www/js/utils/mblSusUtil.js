/******************************************************
 *  화면ID 	: mblSusUtil 
 *  설명 		: 모바일청약공통Util
 *  작성자 	: 최영미
 *  작성일	: 2020-07-13
 *  변경로그 : 
 ******************************************************/
var mblSusUtil = (function($, D){
	
	
	/**
	 * 공통
	 */
	var gConst  = {
			
		//요청업무구분
		REQ_SYS 			: "SFA"
			
		, MBL_SUS_SECD_ELEC	: "01"		//전자청약
		, MBL_SUS_SECD_OMNI	: "02"		//옴니		
			
		//계약처리코드
		, CTR_DLNG_COD_TMP	: "10"		//청약가입력	
		, CTR_DLNG_COD_CRTN : "11"		//청약확정
		, CTR_DLNG_COD_DPS	: "12"		//청약입금
		, CTR_DLNG_COD_CNCS	: "13"		//청약성립
			
		//청약업무구분	
		, SUS_BZ_SECD_SUS 	: "01"		//청약
		, SUS_BZ_SECD_REPL 	: "02"		//보완
			
		
		//문서작성상태
		, WRT_ST_BF			: "01"		//작성전
		, WRT_ST_ING		: "02"		//작성중
		, WRT_ST_CMPT		: "03"		//작성완료
		, WRT_ST_APP		: "04"		//승인완료
	}
	

	/**
	 * 계약관계자리턴
	 * @param dsCtrInptMttLis 계약관계자목록
	 * @param sCtrRleSecd 계약역할구분코드
	 * @returns 
	 */
	function getCtrIntp(aDsCtrInptMttLis, sCtrRleSecd){
		var arr = $.grep(aDsCtrInptMttLis,function(p){
			if(sCtrRleSecd == p.CTR_RLE_SECD) return true;
		 });
		
		return arr;
	}
	
	/**
	 * 청약talk 옴니를 발송 
	 * @param option {SUSNUM,  SUS_BZ_SECD, REPL_PK, CS_PK}
	 * 
	 * @param _callback
	 * @returns 
	 */
	function susOmniTalk(option, _callback){

		if(stringUtil.isNull(option.SUSNUM)){
			dialog.alert("청약번호를 입력해 주세요.");
			return ; 
		}
		if(stringUtil.isNull(option.SUS_BZ_SECD)){
			dialog.alert("청약업무구분코드를 확인하여 주십시오.");
			return ; 
		}

		var args = {};
		//args.remote 				= {};
		args.SUSNUM 				= option.SUSNUM; 				//청약번호
		args.SUS_BZ_SECD		= option.SUS_BZ_SECD		//청약업무구분코드
		args.CS_PK					= option.CS_PK						//청약업무구분코드
		args.REPL_PK				= option.REPL_PK					//보완고유번호
		
		//파일생성위치를 저장
		//rootpath 를 가져온다.
		D.http.ajax("/common/share/susOmniTalk", args).then(function(result){
			if(result.errorMsg){
				dialog.alert(result.errorMsg);
				return; 
			}
			if(_callback){
				_callback(result);
			}
		});
	};
	
	/**
	 * 계좌변경옴니를 발송 
	 * @param option {PLYNO}
	 * 
	 * @param _callback
	 * @returns 
	 */
	function susActOmniTalk(option, _callback){

		if(stringUtil.isNull(option.PLYNO)){
			dialog.alert("증권번호를 입력해 주세요.");
			return ; 
		}
		
		var args = {PLYNO : option.PLYNO};
		D.http.ajax("/common/share/susActOmniTalk", args).then(function(result){
			if(result.errorMsg){
				dialog.alert(result.errorMsg);
				return; 
			}
			if(_callback){
				_callback(result);
			}
		});
	};
	
	
	/**
	 * 조회된 DS 데이터를 화면글러별변수에 추가하거나 기존 데이터를 갱신.
	 * @param: dsJson - 조회된 DataSet json 데이터, mapKey - rename key 목록 json
	 */
	function fnMoveDs(oDs, dsJson, mapKey) {
		/* 
		mapKey :: 화면DS명과 서버에서조회된DS명이 다를 경우에만 
		서버DS명을 화면DS명으로 바꿔줄 매핑정보를 받아 처리한다.
		*/
		if (mapKey) {	
			var js = JSON.stringify(dsJson);
			$.each(mapKey, function(key, value){
				var arr = $.extend([], dsJson[key]);	// 서버에서 조회온 arr데이터를 백업
				delete dsJson[key];		// 서버명 DS명 arr를 제거
				dsJson[value] = arr;	// 화면명 DS명으로 새로
			});
		}
		$.each(dsJson, function(key, value) {
			oDs[key] = value.data;
		});
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
	 * 공통코드조회 
	 */
	function cf_getCdListByMultiCatCd(arr_codInfo, fn_callback){

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
		D.http.ajax('/web/omnicom/codeBean', param).then(function(result) {
			if(!stringUtil.isNull(fn_callback)){
				fn_callback(result);
			}
		});
	};
	
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
    	D.http.ajax('/web/omnicom/messageBean', param).then(function(result){
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
	
	
	/**
	 * 청약확정
	 */
	function procSusCrtn(data, _callBack) {
		
		dialog.confirm('청약을 확정 하시겠습니까?').then(function(value){
			if (value == "YES"){
				
				// --s-- 2025.11 사망자명의 금융거래차단
				fnInqDthPesnYn([{ 'RES_REG_NO' : data.MAI_CS_RRN }]).then(function(res) {
					
					D.http.ajax("/su/mblSus/procSusCrtn", data).then(function(result){
						
						// DS_UD_ERR=DS_UD_ERR DS_UD_GN_PTCL_ERR=DS_UD_GN_PTCL_ERR
						if (result.remoteResult) {  
		
							var isPass = false;
							var resInf = result.remoteResult.outDataSet.DS_RES_INF.data[0];

							var rltCd = result.remoteResult.paramMap.RLT_CD;
							var txt = '';

							if ('-1' == rltCd) {		// 확정 심사 미통과
								txt = '청약 확정이 불가합니다.';
							} else {
								isPass = true;
								txt = '청약 확정이 완료됐습니다!';
							}

							dialog.alert(txt).then(function(){
								
								if(isPass){
									_callBack({"isPass" : isPass, "DS_RES_INF" : resInf });
								}else{
									var err = result.remoteResult.outDataSet.DS_UD_ERR.data;
									var param = { data : err, title : '확정처리 결과' };
									dialog.openPopup('/www/html/view/dc/DC-0170L', param);
								}
							});
						} else {
							dialog.alert(result.text).then(function() {
								_callBack({"isPass" : isPass});
							});
						}
					});
				});
				// --e-- 2025.11 사망자명의 금융거래차단
			}
		});
	}

	/**
	 * 청약 확정 취소
	 */
	function procSusCancel(oParam, _callBack) {
		
		dialog.confirm('청약 확정을 취소하시겠습니까?')
		.then(function(value){
			if (value == "YES"){

				//2. 확정대상건 조회
				var param  = {
					PLYNO 	: oParam.PLYNO,
					SUSNUM 	: oParam.SUSNUM
				};

				D.http.ajax('/su/mblSus/getSusCrtnRecsEa', param).then(function(result1){

					if (result1.remoteResult == null) {
						dialog.alert('청약 확정건이 아닙니다. 청약을 확인 해 주세요.');
						return;
					}

					var data = result1.remoteResult;

					var param  = {};
					param.SUS_CRTN_PK 	= data.SUS_CRTN_PK; 		//청약확정고유번호 
					param.CRTN_CTYMD 	= data.CRTN_CTYMD; 		//확정계약일자
					param.SUSNUM 		= data.SUSNUM; 			//청약서번호 
					param.COL_RSTM_BRCD = data.COL_RSTM_BRCD;	//모집부활지점코드 
					param.PLYNO 		= data.PLYNO; 			//증권번호 
					param.VALD_YMD 		= data.VALD_YMD; 		//유호일자 
					var remote = convertUtil.getRemoteObj('CC_SusCrtnRecs', 'UDI01');
					param.remote = remote;
				
					//3. 확정취소처리
					D.http.ajax('/sw/swAllCC', param).then(function(result) {
						if (result.errorCode) {
							if (result.id) dialog.alert(result.text);
						} else {
							dialog.alert('청약 확정이 취소 되었습니다.')
							.then(function(){
								_callBack(true);
							})
						} 
					});
				});
			}
		});
	};
	
	
	/**
	 * 전자청약으로이동
	 */
	function goEelecSus(pSusnum, pCspk, pEmpno, _callBack) {
		var sUrl = D.http.getServerOrigin()+"/web/su/mblElecSus?";
			sUrl += 'SUSNUM='+pSusnum+'&CS_PK='+pCspk+"&EMPNO="+pEmpno;
		//dialog.alert(sUrl);
		
		D.move.webview({
			className: 'EmptyAcityvity',
			param: {
			    url 		: sUrl
			    , trType 	: 'GET'
			}
		})
		.then(function(aResult) {
			
			if('string' == typeof aResult){
				aResult = JSON.parse(aResult);
			}
			
			if(aResult != null && !stringUtil.isNull(aResult.result)){
				if(aResult.result == "2"){
					D.move.next({ // 청약진행대상 화면
						url : "/su/SU-1700E.html",param : {}
					});
				} else {
					_callBack(aResult);
				}	
			}
		});
	}
	
	/**
	 * 보험료 표시 (달러일 경우 소수점 2자리까지 표시) 
	 */
	function getPremKndStr(crncKnd, prem) {
		var result = '';
		if(crncKnd == '1'){
			result = maskUtil.addCommas(maskUtil.round(prem,2))+"USD";
		}else{
			result = maskUtil.addCommas(prem)+"원";
		}
		return result;
	};
	
	//2025.11 사망자명의 금융거래차단
	function fnInqDthPesnYn(paramData) {
		var defer = $.Deferred();
		var flag = true;
		var resultCnt = 0;
		
		var dw_inqTgtPesn = [];
		if ( paramData.length > 0 ) {
			for(var i=0; i<paramData.length; i++) {
				dw_inqTgtPesn.push({
					'RRN' : paramData[i].RES_REG_NO,
					'FC_ADMN_CS_PK' : ''
				});
			}
		}
		
		var remote = convertUtil.getRemoteObj('FG_AC_DthPesnAdmn', 'UDQ01');
		convertUtil.setRowArray(remote, 'dw_inqTgtPesn', dw_inqTgtPesn);
		
		var param = {
			  remote : remote
		};
		
		D.http.ajax('/cu/inqDthPesnYn', param).then(function(result){
			
			if(result.errorCode) {
				if (result) dialog.alert(result.text);
				defer.reject();
				return defer.promise();
			}
			
			var DS_DTH_PESN_YN = result.remoteResult.outDataSet.DS_DTH_PESN_YN.data;//DTH_PESN_YN
			for(var idx=0; idx<DS_DTH_PESN_YN.length; idx++) {
				
				var res_DTH_PESN_YN = DS_DTH_PESN_YN[idx].DTH_PESN_YN;
				if(res_DTH_PESN_YN == 'Y') {
					resultCnt++;
				}
			}
			
			if(resultCnt > 0) {
				dialog.alert('청약 확정을 진행할 수 없습니다.<br/>(사망자명의 금융거래 차단 대상입니다)');
				flag = false;
				defer.reject();
			}
			
			defer.resolve(flag);
			return defer.promise();
			
		});
		
		return defer.promise();
	}
	
	return {
		gConst							: gConst
		, getCtrIntp 					: getCtrIntp
		, susOmniTalk					: susOmniTalk
		, susActOmniTalk				: susActOmniTalk
		, fnMoveDs 						: fnMoveDs
		, splitAddSep					: splitAddSep
		, setCdRadio					: setCdRadio
		, setCdSelect					: setCdSelect
		, cf_getCdListByMultiCatCd 		:cf_getCdListByMultiCatCd
		, g_showMessage					: g_showMessage
		//확정처리
		, procSusCrtn					: procSusCrtn
		//확정취소
		, procSusCancel					: procSusCancel
		, goEelecSus					: goEelecSus
		, getPremKndStr					: getPremKndStr
		, fnInqDthPesnYn				: fnInqDthPesnYn
	};	
	
})(jQuery, window.Dcore);