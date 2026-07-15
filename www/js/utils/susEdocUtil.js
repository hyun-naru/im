/******************************************************
 *  화면ID 	: susEdocUtil
 *  설명 	: 청약전자문서Util
 *  작성자 	: 최영미
 *  작성일	: 202004-05
 *  변경로그 : 
 ******************************************************/


var susEdocUtil = (function($, D){

	//청약서 문서별 가필화면정보 해당변수에 표시되지않은 문서는 서명1번만 받음
	//==> 가필없이 서명을 여러번 받아야하는 경우도 해당 목록에 표시   SIGN_1, SIGN_2, SIGN_3....
	//==> 알릴의무등 특정조건에따라 화면분기가 되는경우는 각 해당페이지에서 별도로 next처리하므로 별도정의안함.
	var gPrpfrmPgInf = {
			//청약서-계약자 : 근무처가필 ->  서명 -> 수금정보입력 -> 서명 -> 서명 
			"F254_11" 		: ["SU-1160E", "SIGN_1", "SU-1170E", "SIGN_2", "SIGN_3"]	
			//청약서-피보험자 : 근무처가필 ->  서명 
			, "F254_21"  	: ["SU-1160E", "SIGN_1"]	
	
			//알릴의무 
			//(청약서와 알릴의무가 합쳐져있기때문에 서명순번은 청약서다음순번으로)
			, "F252_11" 		: ["SU-1190E",  "GOJI", "SIGN_4"]	
			//알릴의무-피보험자 : 알릴의무(안내) -> 서명
			, "F252_21"  	: [ "SU-1190E", "GOJI", "SIGN_2"]		
			//상품설명서
			, "F173_11"		: ["SU-1290E", "SIGN_1"]		
			//설명의무확인서
			, "F503_11"		: ["SU-1401E", "SIGN_1"]	
			//보험계약사항 비교안내문	
			, "F157_11"		: ["SU-1350E"]
			//보험계약이동에 따른 비교안내문
			, "F415_11"		: ["SU-1310E","SIGN_1"] // ("SU-1320E","SU-1330E") <- 케이스에 따라 나옴.
			//금융소비자불이익우선사항설명확인서
			, "F427_11"		: ["SU-1380E", "SIGN_1"]
			//지정청구대리인
			, "F456_11"		: ["SU-1400E", "SIGN_1"]
	};
	
	// 상수
	var gConst	= {
		  SIGN_PAGE_ID 				: "SU-1180E"  	//공통서명페이지
	    , DOC_VIEW_PAGE_ID		: "SU-1181E"	//공통문서보기페이지	
		, SIGN_LOAD_PAGE_ID		: "SU-1183E"	//싸인불러오기페이지	(일괄서명용)		  
		, LAST_PAGE_ID			 	: "SU-1550E"	//최종문서확인	
		, RPS_PRPFRM_DOC_CD 	: "254"				//대표청약서문서코드
		, RPS_GOJI_DOC_CD 		: "252"				//대표고지문서코드
		, PDT_DESC_DOC_CD		: "173,455"		//상품설명서문서코드
	};

	
	/**
	 * 청약전자문서 초기화정보 globalData GET
	 * @param oGds			: 청약전자문서작성기본정보조회
	 * @param oDocInfo 	: 관계자별 청약출력 data 조회
	 * @param 
	 */
	function getInitGlobalDataSusEdoc(oGds, oDocInfo){	

		var oSusBas 			= oGds.DS_SUS_CTR_BAS[0];
		var oBasInf 				= oGds.DS_EDOC_WRT_CS_INF[0];
		var oMaiPrd 				= $.grep(oGds['DS_SUS_MAI_PRDCD'], 	function(o){
												return o.PRDCD 	== oSusBas.MAI_PRDCD;
											})[0];

		oBasInf.DS_SUS_CTR_INTP = oGds.DS_SUS_CTR_INTP; 					//계약관계자
		oBasInf.SUSNUM				= oSusBas.SUSNUM;											//청약번호
		oBasInf.RPS_PRDCD 			= oSusBas.RPS_PRDCD;									//대표상품코드
		oBasInf.MAI_PRDCD 			= oSusBas.MAI_PRDCD;									//주계약상품코드
		oBasInf.PROD_NM				= oMaiPrd.PRDNM;											//주계약상품명
		oBasInf.CTYMD					= oSusBas.CTYMD;											//계약일자
		oBasInf.UD_SECD				= oGds.ds_DcloMtt[0].UD_SECD;						//간편심사여부	(1:일반, 2:간편)	
		
		//모바일청약구분(01:전자청약, 02:옴니)	
		//고객별 모바일청약구분코드 oBasInf.CUS_MBL_SUS_SECD
		oBasInf.MBL_SUS_SECD	= oSusBas.MBL_SUS_SECD;				

		var oWrtInf = stringUtil.isNull(oBasInf.ELEC_DOC_INP_DATA) ? {} : JSON.parse(oBasInf.ELEC_DOC_INP_DATA);
		var oSignInf = stringUtil.isNull(oBasInf.ELEC_DOC_SIGN_DATA) ? {} : JSON.parse(oBasInf.ELEC_DOC_SIGN_DATA);
		
		oWrtInf.DOC_CTYMD 	= oSusBas.CTYMD.replace(/([\d]{4})([\d]{2})([\d]{2})/, "$1년 $2월 $3일"); //날짜변환
		oWrtInf.plar_sign 			= oBasInf.FC_SIGN_FILE_PK; 
		oWrtInf.POHD_NAM	 	=  $.grep(oGds.DS_SUS_CTR_INTP, function(p){ return p.CTR_RLE_SECD == '11'})[0].CS_NAM;
		oWrtInf.MAIPSN_NAM 	=  $.grep(oGds.DS_SUS_CTR_INTP, function(p){ return p.CTR_RLE_SECD == '21'})[0].CS_NAM;
		oWrtInf.PPAUTH_NAM 	= oBasInf.PPAUTH_CS_NAM;

		
		//청약전자문서DS
		var oSusEdocDs = {
				
				//문서정보 (문서목록, 리포트데이터)
				DOC_INF 			: oDocInfo 		
				
				//작성자정보 ( 계약기본정보 및 작성자 기본정보)
				, BAS_INF 		: oBasInf	 					
				
				//화면입력정보 (기필정보)
				, WRT_INF			: oWrtInf
		
				//서명정보
				, SIGN_INF		: oSignInf
				
				//청약정보 (계약상세보기 후 삭제)
				, SUS_INF			: oGds 
				
				//서명페이지 공통정보
				, PAGE_INF 		: null
		};

/*		var pageList 	= _createEdocPageListByCs(oSusEdocDs);
		oSusEdocDs.PAGE_INF = pageList;*/
		//이체신청서 페이지 SET
		//setActInfPage(oSusEdocDs);
		
		return oSusEdocDs;
	}
	
	/**
	 * 청약전자문서 globalData SET
	 */
	function setGlobalDataSusEdoc(oGSusEdocDs){
		D.global.setGlobalData('susEdocDs', oGSusEdocDs);
	};
	
	/**
	 * 청약전자문서 globalData GET
	 */
	function getGlobalDataSusEdoc(){
		
		var oSusEdocDs = D.global.getGlobalData('susEdocDs');
		
		D.logger.info("############ gDS############");
		D.logger.info(oSusEdocDs)
		D.logger.info("############ gDS############");
		
		if(oSusEdocDs == null || Object.keys(oSusEdocDs).length == 0){
			dialog.alert("잘못된 접근입니다.")
			.then(function(res){
				if(res == "OK"){
					
					if(D.isWebView){
						D.move.close({result: true});
					} else {
						window.close();
					}
				}
			});
		}
		
		return oSusEdocDs;
	};
	
	

	
	/**
	 * 고객전체의 가필정보 합산
	 */
	function createCustWrtAllInf(csList, currCsPk){
		if(csList == null || csList.length == 0){
			dialog.alert("문서작성정보가 존재하지 않습니다 관리자에게 문의하세요");
			return false;
		}
		
		var oSusEdocDs = {
				WRT_INF 		: {}
				, SIGN_INF 	: {}
		}
		
		var oWrtInf 	= {};
		var oSignInf 	= {};
		
		
		for(var i=0; i<csList.length; i++){

			//가필합산
			if (csList[i].ELEC_DOC_INP_DATA != null && csList[i].ELEC_DOC_INP_DATA != "") {
				if(currCsPk != csList[i].CS_PK){
					$.extend(oWrtInf, JSON.parse(csList[i].ELEC_DOC_INP_DATA));
				}	
			}
			
			//서명합산
			if (csList[i].ELEC_DOC_SIGN_DATA != null && csList[i].ELEC_DOC_SIGN_DATA != "") {
				if(currCsPk != csList[i].CS_PK){
					$.extend(oSignInf, JSON.parse(csList[i].ELEC_DOC_SIGN_DATA));
				}
			}
		}
		
		oSusEdocDs.WRT_INF = oWrtInf;
		oSusEdocDs.SIGN_INF = oSignInf;
		
		return oSusEdocDs;
	};
	

	/**
	 * 청약보고서호출
	 * gSusEdocDs 		- 청약전자문서 DS
	 * pDocCd 			- 미리볼 문서코드, 전체는 ""처리
	 * isSave				- 저장여부
	 * isAppFormData	- 입력data 적용여부
	 * _callBack			- callback
	 */
	function callSusReport(pSusEdocDs, pDocCd, isSave, isAppFormData, _callBack) {
		
		//청약서의경우 알릴의무 문서가 청약서와 합쳐져있기때문에 
		// 화면에서 문서별 보고서호출시 해당 문서코드를 청약서 문서코드로 바꿔준다.
		if(!stringUtil.isNull(pDocCd)){
			if(isGoJiDocCd(pDocCd)){
				pDocCd = getPrpfrmDocCdByGoji(pDocCd);
			}
		}
		
		var oSusEdocDs = $.extend(true, {}, pSusEdocDs);
		var allWrtObj =  createCustWrtAllInf(oSusEdocDs.DOC_INF.WRT_CS_LIST, oSusEdocDs.BAS_INF.CS_PK);
		$.extend(allWrtObj.WRT_INF, oSusEdocDs.WRT_INF);
		$.extend(allWrtObj.SIGN_INF, oSusEdocDs.SIGN_INF);
		oSusEdocDs.WRT_INF = allWrtObj.WRT_INF;
		oSusEdocDs.SIGN_INF = allWrtObj.SIGN_INF;
		

		var rptParam = getSusReportParam(oSusEdocDs
																, pDocCd
																, oSusEdocDs.BAS_INF.PLYNO
																, mblSusUtil.gConst.SUS_BZ_SECD_SUS
																, isAppFormData);
		
		rptParam.view_mode = "Y";
		
		D.logger.info("rptParam.json_data:::START");
		D.logger.info(rptParam.json_data);
		D.logger.info("rptParam.json_data:::END");
		
		D.move.next({
            url : '/solution/clip/CLIP.html',
            param : {clipParam:rptParam}
        });
	};
	
	
	/**
	 * 리포트param GET
	 * @ oSusEdocDs 		: 청약전자문서DS
	 * @ pDocCd	 			: 문서코드
	 * @ formSeq			: 00-청약 01-청약보완
	 * @ isAppFormData : 입력데이터 적용여부 (가필/서명)
	 */
	function getSusReportParam(pSusEdocDs, pDocCd, pPrNo, pSusBzSecd, isAppFormData){
		
		var oSusEdocDs = pSusEdocDs;
		
		var oBasInf	= oSusEdocDs.BAS_INF;
		var oSusInf	= oSusEdocDs.SUS_INF;
		var oDocInf	= oSusEdocDs.DOC_INF;
		var oWrtInf	= (isAppFormData ? oSusEdocDs.WRT_INF : {});
		var oSignInf	= oSusEdocDs.SIGN_INF;
		var docList 	= oDocInf.DS_FRMT_LIST;
		var kubun 	= (oBasInf.MBL_SUS_SECD == "01" ? "SUB" : "OMNI"); //전자청약옴니구분
		var oAddYns = _getReportAddInfYns(oSusInf, oDocInf, oBasInf, pSusBzSecd, oSignInf);

		var rptParam = {
			"title"				 : "",	
			"pr_no"				: pPrNo,												// 청약:증권번호, 보완:보완고유번호
			"form_seq"		: (pSusBzSecd == "01" ? "00" : "06"),	// 서식순번  (00-청약, 06-청약보완)
			"inf_data"			: "",														// 이미지 전송을 위한 정보
			"pdf_name"		: "",														//PDF명
			"save_yn"			: "N",													//저장여부
			"form_nm"		: "",														// 서식명
			"kubun"				: kubun,												//전자청약옴니구분
			"json_data"		: "",														// 매핑할 데이터
			"form_data"		: ""														// 이폼 입력데이터 셋(JsonData)
		}

		var sTitle 					= '';
		var form_nm 			= '';
		var json_data 			= '';
		var eFromData 		= {};
		var eSignInf				= {};

		//1. 화면입력data SET (+고지저장정보)
		if(isAppFormData){
			
			//1. 입력값 add (가필)
			$.extend(eFromData, oWrtInf);
			
			
			//==> 고객 서명 value fileid에서 경로로 치환
			if(!stringUtil.isNull(oSignInf)) {
				$.each(oSignInf, function(key, value){
					//bio는 bio이미지표시
					if(value == "BIO"){
						oSignInf[key] = getBioSignImgUrl();
					//bio_일련번호는 일련번호표시
					}else if(value.indexOf("BIO_") > -1){
						oSignInf[key] = value.split("_")[1];
					//그외는 서명값
					} else{
						oSignInf[key] =  D.http.getSignUrl(value);
					}	
				})
			}
			
			//==> FC서명SET
			if(pSusBzSecd != "02" && oAddYns.FGS_OMNI_YN != "Y"){
				if(stringUtil.isNull(oSignInf["plar_sign"])){
					oSignInf["plar_sign"] = D.http.getSignUrl(oWrtInf.plar_sign);
				}
			}
			
		}else{
			oSignInf = null;
		}
		
		//2. json data 및 파일명, 타이틀 SET
		for(var i = 0; i < docList.length; i++) {
			
			var docInf = docList[i];
			
			//고지
			if(docInf["PRPFRM_KNCD"] == "252"
				|| docInf["PRPFRM_KNCD"] == "437"
				|| docInf["PRPFRM_KNCD"] == "477"
				//고객면담보고서	
				|| docInf["PRPFRM_KNCD"] == "469"
				//보험상품체크리스 pass
				|| docInf["PRPFRM_KNCD"] == "488"
				//피보험자서면동의서
				|| docInf["PRPFRM_KNCD"] == "468"){
				continue;
			}

			if(!stringUtil.isNull(pDocCd)){
				if(pDocCd == docInf["PRPFRM_KNCD"]){
					sTitle = oDocInf["DS_FRMT_INF_"+docInf["PRPFRM_KNCD"]][0].FRMT_NAM;
					var curData = _getCvtReportData(pDocCd, oDocInf, oSusInf, oWrtInf, oSignInf, oAddYns, pSusBzSecd); 
					if(!stringUtil.isNull(curData)) {
						form_nm 		+= (curData.formStringNm + ','); 
						json_data 	+= (curData.formStringJson + ','); 
					}
					break;
				}
			} else {
				if(stringUtil.isNull(sTitle)){
					sTitle = oDocInf["DS_FRMT_INF_"+docInf["PRPFRM_KNCD"]][0].FRMT_NAM;
				}
				var curData = _getCvtReportData(docInf.PRPFRM_KNCD, oDocInf, oSusInf, oWrtInf, oSignInf, oAddYns, pSusBzSecd); 
				if(!stringUtil.isNull(curData)) {
					form_nm 		+= (curData.formStringNm + ','); 
					json_data 	+= (curData.formStringJson + ','); 
				}
			}
		}
		
		rptParam.title			= sTitle;
		rptParam.form_nm 	= form_nm.slice(0, -1);
		rptParam.json_data 	= '[' + json_data.slice(0, -1) + ']';
		rptParam.form_data 	= JSON.stringify(eFromData);
		// * 이미지 전송을 위한 정보 세팅!
		rptParam.inf_data 		= _getReportInfData(oSusEdocDs.SUS_INF, pSusBzSecd);

		return rptParam;
	};

	
	/**
	 * 고지문서코드 여부
	 */
	function isGoJiDocCd(sVal){
		return "252,437,477".indexOf(sVal) > -1 ? true : false;
	};
	
	/**
	 * 고지 청약서문서코드매핑값 리턴
	 */
	function getPrpfrmDocCdByGoji(sVal){
		if(isGoJiDocCd(sVal)){
			if(sVal == "252" || sVal == "477" ) return "254";
			else if(sVal == "437") return "436";
		} else {
			return sVal;
		}
	};
	
	/** 
	 *  바이어서명이미지 URL
	 */
	function getBioSignImgUrl(param) {
		return "/APPSRC/Msmart/msmart/app/WEB-INF/resources/default/bio-sign.png";
	}
	
	/**
	 * 고객별 전자서명 page 리스트 생성
	 */
	function _createEdocPageListByCs(oSusEdocDs){
		
		var pageList 			= [];
		
		var oSusBas			= oSusEdocDs.SUS_INF;
		var oBasInf			= oSusEdocDs.BAS_INF;
		var oDocList 		= oSusBas.DS_FRMT_LIST_CUS;
		var rleCd 				= oBasInf.FST_CTR_RLE_SECD;
		var gojiPageList 	= getGojiPageList(oBasInf, oSusBas.DS_PDT_ADD_INF[0]);
		var trtListCnt		= $.grep(oSusBas.DS_SUS_INSCT_PDT, function(o){
														return (o.PDT_RLPCD != '1' && o.PDT_RLPCD != '4')
										}).length;


		pageList.push({
				DOC_COD			: "001"
				, PAGE_ID 		: "SU-1150E"
				, PAGE_TITLE	: "청약정보확인^1^1"
				, IS_PASS			: "N"
		});

		//2021.01.13 대표서명 추가
		if(oBasInf.AUTHWAY && (oBasInf.AUTHWAY == '01' ||  oBasInf.AUTHWAY == '04')&& (rleCd == '11' || rleCd == '21')){
			pageList.push({
					DOC_COD			: "001"
					, PAGE_ID 		: "SU-1182E"
					, PAGE_TITLE	: "전자서명작성^1^1"
					, IS_PASS			: "N"
			});
		}
		//2021.01.13
		
		for(var i=0; i<oDocList.length; i++){
			
			var docObj 		= oDocList[i];
			
			
			//청약서 알릴의무 문서명(=화면명) 변경처리
			if(isPrpfrmDocCd(docObj.PRPFRM_KNCD)) docObj.ASATCD_DOC_NAM = "보험계약청약서";
			if(isGoJiDocCd(docObj.PRPFRM_KNCD)) docObj.ASATCD_DOC_NAM = "계약전알릴의무사항";
			
			
			//== st 가필영역은 일반/간편/치매 대표문서코드로 정의함 해당코드로 조회 ==/
			var tmpDocCd 	= docObj.PRPFRM_KNCD;
			if(isPrpfrmDocCd(docObj.PRPFRM_KNCD)){
				tmpDocCd = gConst.RPS_PRPFRM_DOC_CD;
			}
			if(isGoJiDocCd(docObj.PRPFRM_KNCD)){
				tmpDocCd = gConst.RPS_GOJI_DOC_CD;
			}
			
			var aPrpfrmList = gPrpfrmPgInf["F"+tmpDocCd +"_"+rleCd];
			//청약서에서 특약이 9개이상인경우 5번째서명추가
			if(aPrpfrmList != null && isPrpfrmDocCd(tmpDocCd) && trtListCnt > 9 ){
				aPrpfrmList.push("SIGN_5");
			}
			//== ed 가필영역은 일반/간편/치매 대표문서코드로 정의함 해당코드로 조회 ==/
			
			var pageObj = null;
			
			//해당 문서코드가 청약서폼목록에 없다면 공통서명페이지로 SET
			if(aPrpfrmList == null || aPrpfrmList == undefined){
				
				//20201031 김혜진부장님요청으로 삭제
				/*//==> 공통문서보기페이지
				pageObj = {
					DOC_COD			: docObj.PRPFRM_KNCD
					, PAGE_ID 		: gConst.DOC_VIEW_PAGE_ID
					, PAGE_TITLE 	: docObj.ASATCD_DOC_NAM +"^1^2"
					, IS_PASS			: "N"
				}
				pageList.push(pageObj);*/

				//==> 공통서명페이지
				pageObj = {
					DOC_COD			: docObj.PRPFRM_KNCD
					, PAGE_ID 		: "SIGN_1" 
					, PAGE_TITLE 	: docObj.ASATCD_DOC_NAM +"^1^1"
					, IS_PASS			: "N"
				}
				pageList.push(pageObj);

			} else{
				
				var currIdx =0;
				var totalCount = aPrpfrmList.length;

				//고지인경우 고지페이지 count를 추가 이때 1900E는 제외
				if(isGoJiDocCd(docObj.PRPFRM_KNCD)){
					currIdx 			= currIdx-2;
					totalCount 	= (totalCount+gojiPageList.length)-2;
				}
				
				for(var k=0; k<aPrpfrmList.length; k++){
					
					currIdx++;
					
					//고지는 조건에 따른 페이지 추가
					if(aPrpfrmList[k] == "GOJI"){
						for(var m=0; m<gojiPageList.length; m++){
							currIdx++;
							pageObj = {
									DOC_COD			: docObj.PRPFRM_KNCD
									, PAGE_ID 		: gojiPageList[m]
									, PAGE_TITLE 	: docObj.ASATCD_DOC_NAM +"^"+currIdx+"^"+totalCount
									, IS_PASS			: "N"
							}
							pageList.push(pageObj);
						}
					
					//그외는 폼목록에 있는페이지 SET
					} else{
						pageObj = {
								DOC_COD			: docObj.PRPFRM_KNCD
								, PAGE_ID 		: aPrpfrmList[k]
								, PAGE_TITLE 	: docObj.ASATCD_DOC_NAM +"^"+currIdx+"^"+totalCount
								, IS_PASS			: "N"
						}
						pageList.push(pageObj);
					}
				}
			}
		}
		
		//마지막 page push
		pageList.push({
			DOC_COD			: "000"
			, PAGE_ID 		: gConst.LAST_PAGE_ID
			, PAGE_TITLE	: "최종문서확인"
			, IS_PASS			: "N"
		});
		
		
		//이체페이지 SET
		return pageList;
		
	};
	
	/**
	 * 고지페이지목록 GET
	 */
	function getGojiPageList(oBasInf, oPdtAddInfo ){
		
		var ctrRleSecd 	= oBasInf.FST_CTR_RLE_SECD;
		var susBzSecd 	= oBasInf.SUS_BZ_SECD;
		var sUdSecd 	= oBasInf.UD_SECD;
		var rpsPrdcd = oBasInf.RPS_PRDCD;
		var list = [];
		
		if(oBasInf.FST_CTR_RLE_SECD == "11" 
			&& oBasInf.POHD_ASRD_SAME_YN != "1"){
			list.push("SU-1200E");
		} else{
			//치매
			if(oPdtAddInfo.isGH == "1"){
				list = ["SU-1280E"];
			}
			//간편
			else if(sUdSecd == "2"){
				list = ["SU-1270E"];
			}
			//저가형
			else if(rpsPrdcd == "FI"){
				list = ["SU-1217E"];
			}
			//일반
			else {
				//추가고지가 상품이라면 CI등등~~
				if(oPdtAddInfo["isBB"] =="1" || oPdtAddInfo["isGB"] =="1" 
					|| oPdtAddInfo["isCI"] =="1" || oPdtAddInfo["isSS"] =="1"){
					list =["SU-1210E", "SU-1211E", "SU-1212E", "SU-1214E", "SU-1215E", "SU-1216E"]
				} else {
					list =["SU-1210E", "SU-1211E",  "SU-1214E", "SU-1215E", "SU-1216E"];
				}
			}

			//계피동일일경우 계약자알릴의무 추가
			if(oBasInf.FST_CTR_RLE_SECD == "11"  && oBasInf.POHD_ASRD_SAME_YN  == "1"){
				list.push("SU-1200E");
			}
		}
		return list;
	};
	
	/**
	 * 보고서 addYns 
	 */
	function _getReportAddInfYns(oSusInf, oDocInf, oBasInf, sSusBzSecd, oSignInf){
		var yns = {
				OMNI_YN						: "Y",	// 옴니청약 여부 (옴니가 아니여도 가필때문에 옴니로 보내야함)
				MOBILE_YN					: "Y",	//모바일여부  (모바일일경우 Y를 넣어야 주소등이 나옴 무조건 Y)
				MOBILE_NW_YN			: "Y",	//모바일신규여부 
				
				POH_NAAM					: "",		// 계
				MAI_NAAM					: "",		// 피
				CHIN_NAAM					: "",		// 친권
				JIDAE_NAAM					: "",		// 지정대리청구
				PLAR_NAAM			 		: "",		// 주모집인	
				GAE_PI_SANGI_YN		: "Y",	// 계피상이여부
				
				//--서명과 관련 된 필드로 옴니는 서명값세팅을 옴니화면에서 처리, 별도세팅안함-//
				MISUNG_YN					: 'N',		// 미성년자포함여부
				CHINGWON_YN				: 'N',		// 친권자여부
				JIJUNG_YN					: 'N',		// 지정청구대리인여부
				POH_MAI_TYPE				: 'N',		// 계,피,친 (P 계약자, M 피보험자, N 그외)
				//--서명과 관련 된 필드로 옴니는 서명값세팅을 옴니화면에서 처리-//
				
				CD_ACT_POH_MAI 		: 'P',		// 계속계좌 피보험자꺼인지 여부
				FD_ACT_MISUNG_YN 	: 'N',		// 초회계좌 미성년자꺼인지 여부
				CD_ACT_MISUNG_YN 	: 'N',		// 계속계좌 미성년자꺼인지 여부
				DOC_CTYMD					: oSusInf['DS_SUS_CTR_BAS'][0].CTYMD,	// 계약일자
				IS_LOW_PRICE 				: 'N',		// 저가형여부 - 픽스
				FGS_OMNI_YN				: "N",	//옴니여부
				FGS_OMNI_DATA			: "",		//옴니인증data
					
			    DTH_BNFC_NAM			: "", 		//사망수익자
			    HSPZ_BNFC_NAM			: "",		//입원수익자
			    EXPI_BNFC_NAM			: "",		//만기수익자		
			    	
			    ONLY_PRPFRM_YN			: "N",	//보완-청약서만출력여부
			    ONLY_GOJI_YN				: "N",		//보완-고지만출력여부
			    REPL_YN 						: "N"	,	//보완여부
			    
			    //현재사용안함. (서명구분을 위해 사용할려했으나 동일한 컬럼에 이미지만 바꿔가는 형태로 필요없어짐 type만 01로)
			    SIGN_TYPE					: '01',	//서명구분
			    SIGN_BIO_DATA			: "",		//바이오서명시 들어가는 값	
			    
			    EXPI_BNFC_SIGN_YN 	: "N",
			    HSPZ_BNFC_SIGN_YN 	: "N",
			    DTH_BNFC_SIGN_YN 	: "N",
			};
			
			//계약관계자명 SET
			var pohCsPk = "";
			var maiCsPk = "";
			for(var  i=0; i<oSusInf['DS_SUS_CTR_INTP'].length; i++){	
				var  obj = oSusInf['DS_SUS_CTR_INTP'][i];
			
				if(obj.CTR_RLE_SECD == "11"){
					yns.POH_NAAM = obj.CS_NAM;
					pohCsPk = obj.CS_PK;
				} else if(obj.CTR_RLE_SECD == "21"){
					yns.MAI_NAAM = obj.CS_NAM;
					maiCsPk = obj.CS_PK;
				} else if(obj.CTR_RLE_SECD == "41"){
					yns.EXPI_BNFC_NAM = obj.CS_NAM;
				} else if(obj.CTR_RLE_SECD == "42"){
					yns.HSPZ_BNFC_NAM = obj.CS_NAM;
				} else if(obj.CTR_RLE_SECD == "47"){
					yns.DTH_BNFC_NAM = obj.CS_NAM;
				}
			}	
			// 계피상이여부
			if(pohCsPk == maiCsPk ){
				yns.GAE_PI_SANGI_YN		= "N";		
			}
			
			//청약만추가
			if(oBasInf.SUS_BZ_SECD == "01"){
				yns.PLAR_NAAM			= oSusInf['DS_SUS_INSCT_PLAR'][0].PLAR_NAM;
			}else if(oBasInf.SUS_BZ_SECD == "02"){
				yns.REPL_YN					= "Y"
				yns.ONLY_GOJI_YN 		= ("M002,M003,M004,M005".indexOf(oBasInf.REPL_RSNCD) > -1 ? "Y" : "N"); 
				yns.ONLY_PRPFRM_YN 	= ("M001".indexOf(oBasInf.REPL_RSNCD) > -1 ? "Y" : "N"); 
				yns.PLAR_NAAM			= oSusInf.PLAR_NAAM;
			}
			
			if(oDocInf['ETC_INFO'] != null && oDocInf['ETC_INFO'].length > 0){
				var oEtcInf = oDocInf['ETC_INFO'][0];
				yns.CHIN_NAAM			= oEtcInf.PPAUTH_CS_NAM;//친권자
				yns.CHIN_RLT				= oEtcInf.PPAUTH_CS_RLT;//친권자관계
				yns.POHD_MISUNG		= (oEtcInf.POH_PPAUTH_YN == "1" ? "Y" : "N");//계약자친권자여부
				yns.ASRD_MISUNG		= (oEtcInf.MAI_PPAUTH_YN == "1" ? "Y" : "N");//피보험자권자여부
				yns.OFCHF_NAM 			= oEtcInf.OFCHF_NAM;		  //지점장명
				
				//1. FGS에서 신청한 옴니청약일경우 요청일자 SET
				if(oBasInf.SUS_BZ_SECD == "01"){
					var fgsOmniYn = oSusInf["DS_SUS_CTR_BAS"][0].FGS_OMNI_YN;
					if(fgsOmniYn == "1"){
						yns.FGS_OMNI_YN 		= "Y";
						yns.FGS_OMNI_DATA 	= dateUtil.setFmDateTime(oEtcInf.CFMT_REQ_DTM);
					}
				}
			}
			
			//지정청구대리인 SET
			if(oSusInf['dw_DstnPxClmr'] != null && oSusInf['dw_DstnPxClmr'].length > 0){
				var objDstn = oSusInf['dw_DstnPxClmr'][0];
				yns.JIDAE_NAAM 			= objDstn.DISA_DSTN_PX_CLMR_NAM;
				yns.JIJUNG_YN				= "Y";
			}
			
			
			//서명이 안나오면 이름도 안나오게 처리
			if(oSignInf != null && !$.isEmptyObject(oSignInf)) {
				$.each(oSignInf, function(key, value){
					if(key.indexOf("EXPI_BNFC_SIGN_") > -1){
						yns.EXPI_BNFC_SIGN_YN = "Y";
					}
					if(key.indexOf("HSPZ_BNFC_SIGN_") > -1){
						yns.HSPZ_BNFC_SIGN_YN = "Y";
					}
					if(key.indexOf("DTH_BNFC_SIGN_") > -1){
						yns.DTH_BNFC_SIGN_YN = "Y";
					}
				});
				
			}
			
			return yns;
	};
	
	/**
	 * 리포트data 변환
	 *- 일부정보 추가등.
	 * @param docCd 	: 문서코드
	 * @param	data		: 보고서정보
	 * @paramo	SusInf  	: 청약정보
	 * @paramo	WrtInf	: 화면입력정보 - json에 말아야하는경우있음
	 * @paramo	 oSignInf : 서명정보, 미포함뷰일때는 null
	 * @paramo oAddYns : 공통 Yns정보
	 */
	function _getCvtReportData(docCd, data, oSusInf, oWrtInf, oSignInf, oAddYns, pSusBzSecd){
		
		D.logger.info("########### ST 리포트 param data #############");
		D.logger.info("::: docCd :::"+docCd);
		D.logger.info(data);
		D.logger.info(oSusInf);
		D.logger.info(oWrtInf);
		D.logger.info("########### ED 리포트 param data #############");
	
		//목록에는 있으나 frmt정보가 없는 문서는 pass
		var dsNm	= "DS_FRMT_INF_"+docCd;
		if(data[dsNm] == null || data[dsNm]== undefined){
			dialog.alert(dsNm +"보고서정보 조회시 오류가 발생하였습니다.");
			return false;
		}

		var oDocData 		= data[dsNm][0];
		var oDocInf			= 	$.grep(data.DS_FRMT_LIST, function(p) { return p.PRPFRM_KNCD == docCd})[0];
		var fCode 			=	 oDocInf.MPP_DOC_COD;
		var fNm		 		= '/' + (oDocData.ADMN_BZ_COD.toLowerCase()) + '/' + oDocData.FRMT_ID + '_' + oDocData.FRMT_VER_SEQNO;	// 파일 경로
		var jsonData 		=  oDocData.PRT_CTT; //'{"Main":{},"Sub":{}}';
		
		if(oWrtInf == null) oWrtInf = {};

		switch (dsNm) {
		
					
			// CC_FATCA_NTCFM :: FATCA 확인서
			case 'DS_FRMT_INF_426': 

				if(oSusInf['DS_FATCA_INF'].length > 0) {
					var dfi = oSusInf['DS_FATCA_INF'][0];
					//dfi.FII_05 = stringUtil.setTelFormat(dfi.FII_05);	// 전화번호 포맷팅
					if(!stringUtil.isNull(dfi.FII_05)) {
						var pre = dfi.FII_05.substr(0,3);
						if(pre == '010' || pre == '011' || pre == '018') {	// 핸드폰
							dfi.FII_05 = dfi.FII_05.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
						} else {
							if(dfi.FII_05.substr(0,2) == '02') {
								dfi.FII_05 = dfi.FII_05.replace(/(\d{2})(\d{3,4})(\d{4})/, '$1-$2-$3');
							} else {
								dfi.FII_05 = dfi.FII_05.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
							}
						}
						
					}
					
					var oriFatca = JSON.parse(oDocData.PRT_CTT);
					
					oriFatca.Main.CS_NAM = dfi.FII_01;
					oriFatca.Main.CS_ADR = dfi.FII_04;
					oriFatca.Main.CS_BIRTH = dfi.FII_02;
					oriFatca.Main.CS_CP_NUM_CTT = dfi.FII_05;
					
					$.extend(oriFatca.Main, dfi);
					jsonData = JSON.stringify(oriFatca);
				}
					
				break;
	
			// CR_CC_PRPFRMFC :: FC청약서 보험계약청약서(RD) + 고지사항
			case 'DS_FRMT_INF_254':	
				
				// 청약서 두번째장
				var ex254 = data['DS_254_EXTRA'];	
				if (!stringUtil.isNull(ex254)) {
					var dsExtra254 = ex254[0];
					if (!stringUtil.isNull(dsExtra254) && '' != dsExtra254) {
						if(data['ETC_INFO'] != null && data['ETC_INFO'].length > 0 && !stringUtil.isNull(data['ETC_INFO'][0].REV_DT)){
							var revDt = data['ETC_INFO'][0].REV_DT;
							if(revDt.length >= 12){
								$.extend(dsExtra254, {
									"REV_MON" 	: revDt.substr(4,2),
									"REV_DT"		: revDt.substr(6,2),
									"REV_MIN" 	: revDt.substr(8,2),
									"REV_SEC" 	: revDt.substr(10,2)
								});
							}
						}
						
						//2020.11.10 이메일주소추가
						//CNTAD_SECD / 주소 : 2 / 휴대전화 : 22 / 이메일 : 23
						if(oSusInf['DS_SUS_ADR_POHD'] != null){
							var email = $.grep(oSusInf['DS_SUS_ADR_POHD'], function(p) { return p.BZ_SECD == '2' && p.CNTAD_SECD =='23' });
							if(stringUtil.isNull(email)) {
								email = "-";
							} else {
								email = email[0].EMAL_ID_NAM + '@' + email[0].DMN_NAM; 
							}
							dsExtra254.email = email;
						}

						dsExtra254 = JSON.stringify(dsExtra254);
						dsExtra254 = dsExtra254.slice(0,-1);	// 양끝의 {, } 문자를 잘라냄
						dsExtra254 = dsExtra254.slice(1);
						jsonData = jsonData.replace(/(DW_BASE\":{)/gi, '$1' + dsExtra254 + ',');
						
						
						//고지저장 (2020.10.13 기존 eform data로 가던 고지를 json에 넣음)
						if(oSusInf.ds_DcloMtt != null && oSusInf.ds_DcloMtt.length > 0) {
							var goJisonString 	= oSusInf.ds_DcloMtt[0].JSON_CTT;
							var nwGogiObj = _setGojiEform(goJisonString, oSusInf);
							
							//창약보완의경우 변경여부 정보 추가
							if(oAddYns.REPL_YN == "Y"){
								$.extend(nwGogiObj, _getAddGijiChangeInfo(pSusBzSecd, oSusInf));
							}	
							
							var sNwGogiObj = JSON.stringify(nwGogiObj);
							sNwGogiObj = sNwGogiObj.slice(0,-1);	
							sNwGogiObj = sNwGogiObj.slice(1);
							jsonData = jsonData.replace(/(DW_BASE\":{)/gi, '$1' + sNwGogiObj + ',');	
						}
					}
				}

				break;

			// CR_CC_PRPFRM_AdDcloOblg :: 추가알릴의무(추가고지사항)
			case 'DS_FRMT_INF_408':
				
				var oPdtAddInf = oSusInf.DS_PDT_ADD_INF[0];
				
				// 데이터는 고지사항에서 다 세팅하므로 여기는 json_data를 체크박스 체크유무를 판단할 플래그만 보냄
				var addGoji = {
					"Main":{},
					"Sub":{
						isCI : oPdtAddInf.isCI,
						isGB : oPdtAddInf.isGB,
						isBB : oPdtAddInf.isBB,
						isSS : oPdtAddInf.isSS
					}
				};
				jsonData = JSON.stringify(addGoji);

				break;
				
			// 상품설명서
			case 'DS_FRMT_INF_173': 
				var PRT_CTT = (oDocData.PRT_CTT).replace(/\n/g,"\\n").replace(/\r/g,"\\r");
				var data1 = JSON.parse(PRT_CTT);
				var fgsOmniYn = oAddYns.FGS_OMNI_YN;
				if(fgsOmniYn == "Y"){
					var data2 = {
						"FGS_OMNI_YN" : "Y",
						"FGS_OMNI_DATA" : dateUtil.setFmDateTime(oAddYns.FGS_OMNI_DATA)
					}
					$.extend(data1.Main.DW_BASE, data2);
				}
				jsonData = JSON.stringify(data1);

				break;	

			//  전문금융소비자
			case 'DS_FRMT_INF_502': 
			
					if(oWrtInf != null){
						var mainJ = JSON.parse(oDocData.PRT_CTT);
						mainJ.Main.MOBILE_CORPRTNAM = oWrtInf.omni_form_data_01;
						jsonData = JSON.stringify(mainJ);
					}
				break;
			// CC_PRPFRMFC :: FC보험계약청약서 간편심사 + 고지사항
			case 'DS_FRMT_INF_436':

				// 청약서 데이터 ==========================
				var ex436 = data['DS_436_EXTRA'];	// 청약서 두번째장
				if (!stringUtil.isNull(ex436)) {
					var dsExtra436 = ex436[0];
					if (!stringUtil.isNull(dsExtra436) && '' != dsExtra436) {
						dsExtra436 = JSON.stringify(dsExtra436);
						
						//2020.11.10 이메일주소추가
						//CNTAD_SECD / 주소 : 2 / 휴대전화 : 22 / 이메일 : 23
						if(oSusInf['DS_SUS_ADR_POHD'] != null){
							var email = $.grep(oSusInf['DS_SUS_ADR_POHD'], function(p) { return p.BZ_SECD == '2' && p.CNTAD_SECD =='23' });
							if(stringUtil.isNull(email)) {
								email = "-";
							} else {
								email = email[0].EMAL_ID_NAM + '@' + email[0].DMN_NAM; 
							}
							dsExtra436.email = email;
						}
						
						dsExtra436 = dsExtra436.slice(0,-1);	// 양끝의 {, } 문자를 잘라냄
						dsExtra436 = dsExtra436.slice(1);
						jsonData = jsonData.replace(/(DW_BASE\":{)/gi, '$1' + dsExtra436 + ',');
					}
				}
				
				//고지저장 (2020.10.13 기존 eform data로 가던 고지를 json에 넣음)
				if(oSusInf.ds_DcloMtt != null && oSusInf.ds_DcloMtt.length > 0) {
					var goJisonString 	= oSusInf.ds_DcloMtt[0].JSON_CTT;
					var nwGogiObj = _setGojiEform(goJisonString, oSusInf);
					
					//창약보완의경우 변경여부 정보 추가
					if(pSusBzSecd == "02"){
						$.extend(nwGogiObj, _getAddGijiChangeInfo(pSusBzSecd, oSusInf));
					}	
					
					var sNwGogiObj = JSON.stringify(nwGogiObj);
					sNwGogiObj = sNwGogiObj.slice(0,-1);	
					sNwGogiObj = sNwGogiObj.slice(1);
					jsonData = jsonData.replace(/(DW_BASE\":{)/gi, '$1' + sNwGogiObj + ',');	
				}

				break;
	
			// CR_CC_AUT_RM_SVC_LTOAP :: 자동송금서비스 신청서
			case 'DS_FRMT_INF_434': 

				var oriGae = JSON.parse(oDocData.PRT_CTT);
				var addInfo = {};
				var autoInfoMod = $.grep(oSusInf['SUGEUM_INF'], function(p) { return '5' == p.SUS_CTMN_SECD});
				if(autoInfoMod.length > 0) autoInfoMod = autoInfoMod[0];
				 
				//CNTAD_SECD / 주소 : 2 / 휴대전화 : 22 / 이메일 : 23
				if(oSusInf['DS_SUS_ADR_POHD'] != null){
					var email = $.grep(oSusInf['DS_SUS_ADR_POHD'], function(p) { return p.BZ_SECD == '2' && p.CNTAD_SECD =='23' });
					if(stringUtil.isNull(email)) {
						email = "-";
					} else {
						email = email[0].EMAL_ID_NAM + '@' + email[0].DMN_NAM; 
					}
				}
				
				var addr = $.grep(oSusInf['DS_SUS_ADR_POHD'], function(p) { return p.BZ_SECD == '2' && p.CNTAD_SECD =='2' && p.CNTAD_BLN_SECD == '5' });
				if(stringUtil.isNull(addr)){
					var addr = $.grep(oSusInf['DS_SUS_ADR_POHD'], function(p) { return p.BZ_SECD == '2' && p.CNTAD_SECD =='2' && p.CNTAD_BLN_SECD == '6' });
					if(stringUtil.isNull(addr)){
						addr = "-";	
					}
					else{
						addr = "(" + addr[0].ZCD + ") " +  addr[0].GTED_ADR + addr[0].LSTD_ADR;
					}
					
				} else {
					addr = "(" + addr[0].ZCD + ") " +  addr[0].GTED_ADR + addr[0].LSTD_ADR;
				}
				
				var tel = $.grep(oSusInf['DS_SUS_ADR_POHD'], function(p) { return p.BZ_SECD == '2' && p.CNTAD_SECD =='22' });
				if(stringUtil.isNull(tel)){
					tel = "-";
				} else{
					tel = tel[0].TEL_AR_NUM  +"-"+ tel[0].TEL_GUK_NUM +"-"+ tel[0].TEL_SEQ;
				}
				
				addInfo = {
						"POHD_NAM" : oSusInf['DS_SUS_CTR_BAS'][0].MAI_CS_NAM,
						"POHD_RRN" : oSusInf['DS_SUS_CTR_BAS'][0].MAI_CS_RRN,
						"POHD_ADDR" : addr,
						"POHD_CP_NUM" : tel,
						"POHD_EMAIL" : email,
						"BANK_OWNR_NAM" : autoInfoMod.OWAC_NAM,
						"BANK_CO" : autoInfoMod.BANK_NAM,
						"BANK_ACTNUM" : autoInfoMod.ACTNUM
				}
				$.extend(oriGae.Main, addInfo);
				
				jsonData = JSON.stringify(oriGae);
				break;

			// NP_INSCT_CTT_COMP :: 보험계약사항 비교안내 자료
			case 'DS_FRMT_INF_157': 

				//입력정보가 있다면~
				if(oWrtInf != null){
					var mainJ = JSON.parse(oDocData.PRT_CTT);
					mainJ.Main.chck1 = oWrtInf.omni_form_data_27;
					mainJ.Main.chck2 = oWrtInf.omni_form_data_28;
					mainJ.Main.chck3 = oWrtInf.omni_form_data_29;
					mainJ.Main.chck4 = oWrtInf.omni_form_data_30;
					mainJ.Main.chck5 = oWrtInf.omni_form_data_31;
					mainJ.Main.chck6 = oWrtInf.omni_form_data_32;
					jsonData = JSON.stringify(mainJ);
				}
				break;
	
			// NP_PdtAdvmAgdc :: 상품소개 등을 위 한 동의서
			case 'DS_FRMT_INF_406': 

				// 청약입력에서 받은 동의 데이터 추가 세팅
				if (!stringUtil.isNull(oSusInf['DS_CsInf24'])) {
					var oriPrtCtt = JSON.parse(oDocData.PRT_CTT);
					$.extend(oriPrtCtt.Main, oSusInf['DS_CsInf24'][0]);
					jsonData = JSON.stringify(oriPrtCtt);
				}
	
				break;
	
			// CC_AUTRSF_NW_LTOAP :: 보험료이체신규신청서
			case 'DS_FRMT_INF_435':

				var oriGae = JSON.parse(oDocData.PRT_CTT);
				var addInfo = {};
				
				var cdInfoMod = $.grep(oSusInf['SUGEUM_INF'], function(p) { return '2' == p.SUS_CTMN_SECD});
				if(cdInfoMod.length > 0) cdInfoMod = cdInfoMod[0];
				
				if (!stringUtil.isNull(cdInfoMod)) {
					addInfo = {
						"ACTNUM"							: cdInfoMod.ACTNUM,
						"ACT_USE_DY"					: cdInfoMod.ACT_USE_DY,
						"OWAC_NAM"					: cdInfoMod.OWAC_NAM,
						"BANK_NAM"						: cdInfoMod.BANK_NAM,
						"OWAC_CS_RLP_SECD"	: cdInfoMod.OWAC_CS_RLP_SECD,
						"OWAC_RBRNO"				: cdInfoMod.OWAC_RBRNO,				// 예금주주민번호
						"OWAC_MISUNG"				: "0"
					};
					
					//예금주가 미성년이아니라면 친권자정보 삭제
					if(dateUtil.getRealAge(cdInfoMod.OWAC_RBRNO.replace(/-/gi,'')) < 19){
						addInfo.OWAC_MISUNG = "1"
					}
					
					//카드사용안함.
					/*if(!stringUtil.isNull(cdInfoMod.VALD_PRID)) {
						addInfo.VALD_PRID_YEAR 		= cdInfoMod.VALD_PRID.substr(0,4);	// 유효기간 년도
						addInfo.VALD_PRID_MONTH 	= cdInfoMod.VALD_PRID.substr(4,2);	// 유효기간 월
					}*/
				}
					
	
				/*// 예금주 계약자와의관계 코드 => 명칭으로
				var rlpNam = {
					'cd1': '본인',
					'cd2': '배우자',
					'cd3': '부모',
					'cd4': '자녀',
					'cd5': '조부모',
					'cd6': '손주',
					'cd7': '형제자매',
					'cd9': '외조부모'
				}['cd'+ addInfo.OWAC_CS_RLP_SECD] || '';
				addInfo.OWAC_CS_RLP_SECD = rlpNam;*/
	
				// 예금주주민번호
				var yeRrn = addInfo.OWAC_RBRNO;	
				if (!stringUtil.isNull(yeRrn)) {

					// 예금주생년월일
					addInfo.OWAC_BIRTH = yeRrn.substr(0,6);
					// 예금주연락처
					var csPKInfo = $.grep(oSusInf['DS_SUS_CTR_INTP'], function(p) {	// 예금주cspk
						return yeRrn == p.RRN;
					});
		
					if (!stringUtil.isNull(csPKInfo)) {
						csPK = csPKInfo[0].CS_PK;
						var a = $.grep(oSusInf['DS_SUS_ADR_POHD'], function(p1) {
							return csPK == p1.CS_PK && !stringUtil.isNull(p1.TEL_AR_NUM);
						});
						if (a.length > 0) {
							addInfo.TEL_NUM = a[0].TEL_AR_NUM+'-'+a[0].TEL_GUK_NUM+'-'+a[0].TEL_SEQ;
						} else {
							var b = $.grep(oSusInf['DS_SUS_ADR_MAIPSN'], function(p2) {
								return csPK == p2.CS_PK && !stringUtil.isNull(p2.TEL_AR_NUM);
							});
							if (b.length > 0) {
								addInfo.TEL_NUM = b[0].TEL_AR_NUM+'-'+b[0].TEL_GUK_NUM+'-'+b[0].TEL_SEQ;
							}
						}
						
						// DS_SUS_ADR_POHD에 값이 없을 경우 NEW에서 가져옴
						if(stringUtil.isNull(stringUtil.replaceAll(addInfo.TEL_NUM, '-', ''))){
							csPK = csPKInfo[0].CS_PK;
							var newAdrP = $.grep(gDS['DS_SUS_ADR_POHD_NEW'], function(o) {
								return csPK == o.CS_PK && !stringUtil.isNull(o.TEL_AR_NUM);
							})
							if (newAdrP.length > 0) {
								addInfo.TEL_NUM = newAdrP[0].TEL_AR_NUM+'-'+newAdrP[0].TEL_GUK_NUM+'-'+newAdrP[0].TEL_SEQ;
							}else{
								var newAdrM = $.grep(gDS['DS_SUS_ADR_MAIPSN_NEW'], function(o2) {
									return csPK == o2.CS_PK && !stringUtil.isNull(o2.TEL_AR_NUM);
								});
								if (newAdrM.length > 0) {
									addInfo.TEL_NUM = newAdrM[0].TEL_AR_NUM+'-'+newAdrM[0].TEL_GUK_NUM+'-'+newAdrM[0].TEL_SEQ;
								}
							}
						}
					} 
		
					$.extend(oriGae.Main, addInfo);
					oriGae.Main.CTMN_METD_COD = cdInfoMod.CTMN_METD_COD;	
				}
				
				console.log(oriGae);
				jsonData = JSON.stringify(oriGae);
	
				break;
	
			// CC_DSTN_PX_CLMR_DSTN :: 지정청구대리인 지정 신청서
			case 'DS_FRMT_INF_456': 
				
				var rleNm = "";
				if("dw_DstnPxClmr" in oSusInf && oSusInf['dw_DstnPxClmr'].length > 0){
					var objDstn 	= oSusInf['dw_DstnPxClmr'][0];
					rleNm 			= objDstn.DISA_DSTN_PX_CLMR_RLP;
				}
				
				var oriPx = JSON.parse(oDocData.PRT_CTT);
				oriPx.Main.DSTN_RLP_SECD = rleNm;
				oriPx.Main.DSTN_YN = 'N';
				// 지정청구대리인 찍어줄 정보를 추가
				if(!stringUtil.isNull(oSusInf['dw_DstnPxClmr'])) {
					$.extend(oriPx.Main, oSusInf['dw_DstnPxClmr'][0]);
					oriPx.Main.DSTN_YN = 'Y';
					// 주민번호 앞자리 짤라 생년월일로 세팅
					oriPx.Main.DISA_DSTN_PX_CLMR_RRN = oriPx.Main.DISA_DSTN_PX_CLMR_RRN.substr(0,6);	
					oriPx.Main.EXPI_DSTN_PX_CLMR_RRN = oriPx.Main.EXPI_DSTN_PX_CLMR_RRN.substr(0,6);
				}
				
				var pohInfo = $.grep(oSusInf.DS_SUS_CTR_INTP, function(p){ return p.CTR_RLE_SECD == '11'})[0];
				oriPx.Main.POH_NAM = pohInfo.CS_NAM;	// 계약자 이름
				oriPx.Main.POH_BIRTH = pohInfo.RRN.substr(0,6);	// 계약자 생년월일

				jsonData = JSON.stringify(oriPx);

				break;

			// 개인고객거래확인서 CR_CC_INDV_TRS_NTCFM (따로 조회한 값으로 매핑)
			case 'DS_FRMT_INF_460':

				var ggh = {"Main":{},"Sub":{}};
				if (!stringUtil.isNull(oSusInf['KYC_INFO'])) {
					$.extend(ggh.Main, oSusInf['KYC_INFO'][0]);
					
					var pa = {
								"OFC_NAM"	 : oSusInf['DS_SUS_INSCT_PLAR'][0].PLAR_BROFC_NAM,
								"PLAR_NAM"	 : oSusInf['DS_SUS_INSCT_PLAR'][0].PLAR_NAM,
								"PLYNO"		 : oSusInf['KYC_INFO'][0].STOCK_NO
							}
							
					$.extend(ggh.Main, pa);
				}
				jsonData = JSON.stringify(ggh);
				break;

			// 개인고객거래확인서 (친권자용) CR_CC_INDV_TRS_CTCFM_PP (따로 조회한 값으로 매핑)
			case 'DS_FRMT_INF_464':
				var gghc = {"Main":{},"Sub":{}};
				if (!stringUtil.isNull(oSusInf['KYC_INFO'])) {
					var ua = $.grep(oSusInf['KYC_INFO'], function(p) { return dateUtil.getRealAge(p.RNNO.replace(/-/gi,'')) >= 19; });
					if (!stringUtil.isNull(ua)) {
						$.extend(gghc.Main, ua[0]);
					}
					
					var pa = {
								"OFC_NAM" 	: oSusInf['DS_SUS_INSCT_PLAR'][0].PLAR_BROFC_NAM,
								"PLAR_NAM" : oSusInf['DS_SUS_INSCT_PLAR'][0].PLAR_NAM,
								"PLYNO" 		: oSusInf['KYC_INFO'][0].STOCK_NO
							}
							
					$.extend(gghc.Main, pa);
				}

				jsonData = JSON.stringify(gghc);

				break;
				
			// 개인신용정보 조회동의서
			case 'DS_FRMT_INF_326':
				var data1 = JSON.parse(oDocData.PRT_CTT);

		/*	
					var data2 = {
							"SIGN_CS"          		 : D.http.getSignUrl(signkey.csSignKey),											
							"SIGN_CC_PP"					 : csPpSignKeyU	,							
							"SIGN_CSNM_PP"					 : csNamPpSignKeyU	,							
							"MISUNG_YN"					 : ageResult	,							
							"MOBILE_NW_YN"					 : "Y"	,							
							"MOBILE_YN"					 : "Y"		
					}
					$.extend(data1.Main.DS_LIST, data2);
				*/
				jsonData = JSON.stringify(data1);

				break;	
			
			// 전자적 방식에 의한 보험계약자료 작성 및 제공에 대한 사전 동의서 (전자청약동의서)
			case 'DS_FRMT_INF_462':
				var jsonData462 = {
						"Main":{
							"PLYNO"							: oSusInf.DS_SUS_CTR_BAS[0].PLYNO,		// 증번
							"POHD_ASRD_SAME_YN"	: 'Y', // 계피동일 여부
							"POHD_MISUNG"				: 'N', // 계약자 미성년자 여부
							"ASRD_MISUNG"				: 'N' // 피보험자 미성년자 여부 
						},
						"Sub":{}
					};
				jsonData = JSON.stringify(jsonData462);
				break;
				
			//수익자지정동의서 관계명 SET	
			case 'DS_FRMT_INF_321': 	
				var ex321 = data['DS_321_EXTRA'];	
				if (!stringUtil.isNull(ex321) && ex321.length > 0) {
					var oTmpJson = JSON.parse(oDocData.PRT_CTT);
					
					//해당문서의 sign값만 SET
					var addInfo = {};
					$.each(ex321[0] , function(key, value) {
						if(key.indexOf("RLT_NM_") > -1){
							//2020.11.04 법정대리인은 삭제요청함.
							if(value == "법정상속인"){
								addInfo[key] = "";
							} else {
								addInfo[key] = value;
							}
						}
						//청약시 수익비율매핑
						if(key.indexOf("DTHT_DFR_RTO") > -1 
								&& pSusBzSecd == "01"
								&& !stringUtil.isNull(value)){
							addInfo[key] = value + "%";
						}
					});
					$.extend(oTmpJson.Main, addInfo);
					jsonData = JSON.stringify(oTmpJson);
				}
				break;	
		}
		
		
		//친권자정보 SET
		
		var nwAddYns = {};
		$.extend(nwAddYns, oAddYns);

		if(pSusBzSecd == mblSusUtil.gConst.SUS_BZ_SECD_SUS) {
			_removeChinInf(docCd, nwAddYns, oSignInf);
		}
		

		// 모바일여부 및 각종 여부 단일파라미터 추가
		var stringYns = JSON.stringify(nwAddYns).slice(0, -1).slice(1) + ',';
		// ==> 청약서는 DW_BASE 하위에 단일데이터가 오므로 분기함
		if ('DS_FRMT_INF_254' == dsNm || 'DS_FRMT_INF_436' == dsNm) {
			jsonData = jsonData.replace(/(DW_BASE\":{)/gi, '$1'+ stringYns);
		} else if('DS_FRMT_INF_326' == dsNm ) {
			jsonData = jsonData.replace(/(DS_LIST\":{)/gi, '$1'+ stringYns);
		}else {
			jsonData = jsonData.replace(/(Main\":{)/gi, '$1'+ stringYns);
		}
		

		//서명합산인경우 서명정보 들어감
		if(oSignInf != null){
			var nwObj 			= {};
			var stringSignInf 	=  "";
			
			//해당문서의 sign값만 SET
			$.each(oSignInf , function(key, value) {
				if(key.indexOf(_cvtSignDsNm(dsNm)) > -1){
					nwObj[key] = value;
				}
			});
			
			nwObj["plar_sign"] = oSignInf["plar_sign"];
			
			if(Object.keys(nwObj).length > 0){
				stringSignInf =  JSON.stringify(nwObj).slice(0, -1).slice(1) + ',';
			}
			
			// 모바일여부 및 각종 여부 단일파라미터 추가
			// ==> 청약서는 DW_BASE 하위에 단일데이터가 오므로 분기함
			if ('DS_FRMT_INF_254' == dsNm || 'DS_FRMT_INF_436' == dsNm) {
				jsonData = jsonData.replace(/(DW_BASE\":{)/gi, '$1'+ stringSignInf);
			}else if('DS_FRMT_INF_326' == dsNm ) {
				jsonData = jsonData.replace(/(DS_LIST\":{)/gi, '$1'+ stringSignInf);
			} else {
				jsonData = jsonData.replace(/(Main\":{)/gi, '$1'+ stringSignInf);
			}
			
		}
		
		

		var rtnData = {
			//formStringCode	: fCode,		// 서식코드
			formStringNm		: fNm,			// 서식파일경로
			formStringJson		: jsonData,	// 문서에 뿌릴 json 스트링 데이터
		};
	
		return rtnData;
	
	};
	
	/**
	 * 고지 리포트용 eform data 생성
	 * 
	 */
	function _setGojiEform(goJisonString, oSusInf){
		
		var eFormData = {};
		var oPdtAddInf = oSusInf.DS_PDT_ADD_INF[0];
		var rpsPrdcd 	= oSusInf.DS_SUS_CTR_BAS[0].RPS_PRDCD;

		if (goJisonString == null || '{}' == goJisonString) {
			goJisonString =  '{"Main":{},"Sub":{}}';
			
		} else {
			if (oPdtAddInf.isCI == '1' || oPdtAddInf.isGB == '1' || oPdtAddInf.isSS == '1' || oPdtAddInf.isBB == '1') {
				var nwGojiJson = JSON.parse(goJisonString);
				if(oPdtAddInf.isCI == '0') {
					nwGojiJson.Main.Q18 = '';
					nwGojiJson.Main.Q19 = '';
				}
				if(oPdtAddInf.isGB == '0') {
					nwGojiJson.Main.Q20 = '';
					nwGojiJson.Main.Q21 = '';
				}
				if(oPdtAddInf.isSS == '0') {
					nwGojiJson.Main.Q23 = '';
				}
				if(oPdtAddInf.isBB == '0') {
					nwGojiJson.Main.Q22 = '';
				}
				goJisonString = JSON.stringify(nwGojiJson);
			}
		}

		//치매
		if("1" == oPdtAddInf.isGH){
			eFormData = fnSetEformDataGH(JSON.parse(goJisonString));
		//그외
		}else{
			eFormData = fnSetEformData(JSON.parse(goJisonString));
		}
		
		return eFormData;
	};
	
	/**
	 *  치매 eForm 사용자입력 데이터 SET
	 */
	function fnSetEformDataGH(param) {
		var result = {};

		$.extend(result, param.Main);
		$.extend(result, param.Sub);

		if($.isEmptyObject(result)) {
			return result;
		}

		$.each(result, function(b,c) {
			var parent = b;
			if('object' == typeof c) {
				if($.isArray(c)) { 	// array
					$.each(c, function(idx, row) {
						$.each(row, function(i, j) {
							var azx = {};
							azx[parent+'_'+idx+'_'+i] = j;
							$.extend(result, azx);
						});
					});
					delete result[parent];
				} else {	// 그냥 object
					$.each(c, function(d,e) {
						var ozx = {};
						ozx[parent+'_'+d] = e;
						$.extend(result, ozx);
					});
					delete result[parent];
				}
			}
		});


		var arr1 = [
			result.ghextraQa01_0_strtYmd,
			result.ghextraQa01_1_strtYmd,
			result.ghextraQa01_2_strtYmd
		];
		var arr2 = [
			result.ghextraQa01_0_endYmd,
			result.ghextraQa01_1_endYmd,
			result.ghextraQa01_2_endYmd
		];



		// 날짜 포맷팅

		// start
		$.each(arr1, function(idx1, a1) {
			if(!stringUtil.isNull(a1)) {
				var b1 = a1.substr(0,4) +'년' + a1.substr(4,2) +'월'+ a1.substr(6,2) + '일';
				result['ghextraQa01_'+idx1+'_strtYmd'] = b1;
				result['ghextraQa01_'+idx1+'_name'] = result.MAI_CS_NAM;
			} else {
				result['ghextraQa01_'+idx1+'_name'] = '';
			}
		});
		// end
		$.each(arr2, function(idx2, a2) {
			if(!stringUtil.isNull(a2)) {
				var b2 = a2.substr(0,4) +'년' + a2.substr(4,2) +'월'+ a2.substr(6,2) + '일';
				result['ghextraQa01_'+idx2+'_endYmd'] = b2;
				result['ghextraQa01_'+idx2+'_name'] = result.MAI_CS_NAM;
			} else {
				result['ghextraQa01_'+idx2+'_name'] = '';
			}
		});


		// O X 로 만들기
		var expcArr = [
			result.ghextraQa01_0_expcYn,
			result.ghextraQa01_1_expcYn,
			result.ghextraQa01_2_expcYn
		];
		$.each(expcArr, function(idx3, a3) {
			if(!stringUtil.isNull(a3)) {
				if('1' == a3) {
					result['ghextraQa01_'+idx3+'_expcYn'] = 'O'; 
				} else{
					result['ghextraQa01_'+idx3+'_expcYn'] = 'X'; 
				}
			}
		});
		var mdatdArr = [
			result.ghextraQa01_0_mdatdYn,
			result.ghextraQa01_1_mdatdYn,
			result.ghextraQa01_2_mdatdYn
		];
		$.each(mdatdArr, function(idx4, a4) {
			if(!stringUtil.isNull(a4)) {
				if('1' == a4) {
					result['ghextraQa01_'+idx4+'_mdatdYn'] = 'O'; 
				} else{
					result['ghextraQa01_'+idx4+'_mdatdYn'] = 'X'; 
				}
			}
		});
		
		// =============================================================================
		
		// 생일 짜름
		if(!stringUtil.isNull(result.MAI_CS_BIRTH)) {
			result.MAI_CS_BIRTH = result.MAI_CS_BIRTH.substr(2);
		}
		/*
		result.Q13 = '0'
		result.Q16 = '0'
		// 월소득, 키 몸무게 입력시 예 체크 추가 2018-06-15 백경난 요청
		if(!stringUtil.isNull(result.Q13_mthlyIncm)) {	// 월소득
			result.Q13 = '1'
		}
		if(!stringUtil.isNull(result.Q16_ky) || !stringUtil.isNull(result.Q16_wgt)) { //  키 몸무게 
			result.Q16 = '1'
		} */

		return result;

	};
	
	/**
	 *  eForm 사용자입력 데이터 SET
	 */
	function fnSetEformData(param) {
		var result = {};
		
		$.extend(result, param.Main);
		$.extend(result, param.Sub);

		if($.isEmptyObject(result)) {
			return result;
		}

		$.each(result, function(b,c) {
			var parent = b;
			if('object' == typeof c) {
				if($.isArray(c)) { 	// array
					$.each(c, function(idx, row) {
						$.each(row, function(i, j) {
							var azx = {};
							azx[parent+'_'+idx+'_'+i] = j;
							$.extend(result, azx);
						});
					});
					delete result[parent];
				} else {	// 그냥 object
					$.each(c, function(d,e) {
						var ozx = {};
						ozx[parent+'_'+d] = e;
						$.extend(result, ozx);
					});
					delete result[parent];
				}
			}
		});


		var arr1 = [
			result.extraQa01_0_strtYmd,
			result.extraQa01_1_strtYmd,
			result.extraQa01_2_strtYmd
		];
		var arr2 = [
			result.extraQa01_0_endYmd,
			result.extraQa01_1_endYmd,
			result.extraQa01_2_endYmd
		];



		// 날짜 포맷팅

		// start
		$.each(arr1, function(idx1, a1) {
			if(!stringUtil.isNull(a1)) {
				var b1 = a1.substr(0,4) +'년' + a1.substr(4,2) +'월'+ a1.substr(6,2) + '일';
				result['extraQa01_'+idx1+'_strtYmd'] = b1;
				result['extraQa01_'+idx1+'_name'] = result.MAI_CS_NAM;
			} else {
				result['extraQa01_'+idx1+'_name'] = '';
			}
		});
		// end
		$.each(arr2, function(idx2, a2) {
			if(!stringUtil.isNull(a2)) {
				var b2 = a2.substr(0,4) +'년' + a2.substr(4,2) +'월'+ a2.substr(6,2) + '일';
				result['extraQa01_'+idx2+'_endYmd'] = b2;
				result['extraQa01_'+idx2+'_name'] = result.MAI_CS_NAM;
			} else {
				result['extraQa01_'+idx2+'_name'] = '';
			}
		});


		// O X 로 만들기
		var expcArr = [
			result.extraQa01_0_expcYn,
			result.extraQa01_1_expcYn,
			result.extraQa01_2_expcYn
		];
		$.each(expcArr, function(idx3, a3) {
			if(!stringUtil.isNull(a3)) {
				if('1' == a3) {
					result['extraQa01_'+idx3+'_expcYn'] = 'O'; 
				} else{
					result['extraQa01_'+idx3+'_expcYn'] = 'X'; 
				}
			}
		});
		var mdatdArr = [
			result.extraQa01_0_mdatdYn,
			result.extraQa01_1_mdatdYn,
			result.extraQa01_2_mdatdYn
		];
		$.each(mdatdArr, function(idx4, a4) {
			if(!stringUtil.isNull(a4)) {
				if('1' == a4) {
					result['extraQa01_'+idx4+'_mdatdYn'] = 'O'; 
				} else{
					result['extraQa01_'+idx4+'_mdatdYn'] = 'X'; 
				}
			}
		});

		// ========================== 실손, CI ,간병 보험인 경우 =============================================
		if(typeof result.extraQa02_0_dsnm != 'undefined') {
			
			var exArr1 = [
				result.extraQa02_0_strtYmd,
				result.extraQa02_1_strtYmd,
				result.extraQa02_2_strtYmd,
				result.extraQa02_3_strtYmd,
				result.extraQa02_4_strtYmd,
				result.extraQa02_5_strtYmd
			];
			var exArr2 = [
				result.extraQa02_0_endYmd,
				result.extraQa02_1_endYmd,
				result.extraQa02_2_endYmd,
				result.extraQa02_3_endYmd,
				result.extraQa02_4_endYmd,
				result.extraQa02_5_endYmd
			];
	
	
	
			// 날짜 포맷팅
	
			// start
			$.each(exArr1, function(exIdx1, exA1) {
				if(!stringUtil.isNull(exA1)) {
					var exB1 = exA1.substr(0,4) +'년' + exA1.substr(4,2) +'월'+ exA1.substr(6,2) + '일';
					result['extraQa02_'+exIdx1+'_strtYmd'] = exB1;
					result['extraQa02_'+exIdx1+'_name'] = result.MAI_CS_NAM;
				} else {
					result['extraQa02_'+exIdx1+'_name'] = '';
				}
			});
			// end
			$.each(exArr2, function(exIdx2, exA2) {
				if(!stringUtil.isNull(exA2)) {
					var exB2 = exA2.substr(0,4) +'년' + exA2.substr(4,2) +'월'+ exA2.substr(6,2) + '일';
					result['extraQa02_'+exIdx2+'_endYmd'] = exB2;
					result['extraQa02_'+exIdx2+'_name'] = result.MAI_CS_NAM;
				} else {
					result['extraQa02_'+exIdx2+'_name'] = '';
				}
			});
	
	
			// O X 로 만들기
			var exExpcArr = [
				result.extraQa02_0_expcYn,
				result.extraQa02_1_expcYn,
				result.extraQa02_2_expcYn,
				result.extraQa02_3_expcYn,
				result.extraQa02_4_expcYn,
				result.extraQa02_5_expcYn
			];
			$.each(exExpcArr, function(exIdx3, exA3) {
				if(!stringUtil.isNull(exA3)) {
					if('1' == exA3) {
						result['extraQa02_'+exIdx3+'_expcYn'] = 'O'; 
					} else{
						result['extraQa02_'+exIdx3+'_expcYn'] = 'X'; 
					}
				}
			});
			var exMdatdArr = [
				result.extraQa02_0_mdatdYn,
				result.extraQa02_1_mdatdYn,
				result.extraQa02_2_mdatdYn,
				result.extraQa02_3_mdatdYn,
				result.extraQa02_4_mdatdYn,
				result.extraQa02_5_mdatdYn
			];
			$.each(exMdatdArr, function(exIdx4, exA4) {
				if(!stringUtil.isNull(exA4)) {
					if('1' == exA4) {
						result['extraQa02_'+exIdx4+'_mdatdYn'] = 'O'; 
					} else{
						result['extraQa02_'+exIdx4+'_mdatdYn'] = 'X'; 
					}
				}
			});

		}
		// =============================================================================
		
		// 생일 짜름
		if(!stringUtil.isNull(result.MAI_CS_BIRTH)) {
			result.MAI_CS_BIRTH = result.MAI_CS_BIRTH.substr(2);
		}
		/*
		result.Q13 = '0'
		result.Q16 = '0'
		// 월소득, 키 몸무게 입력시 예 체크 추가 2018-06-15 백경난 요청
		if(!stringUtil.isNull(result.Q13_mthlyIncm)) {	// 월소득
			result.Q13 = '1'
		}
		if(!stringUtil.isNull(result.Q16_ky) || !stringUtil.isNull(result.Q16_wgt)) { //  키 몸무게 
			result.Q16 = '1'
		} 
		*/
		return result;

	};
	
	/**
	 * 각보고서의 json 친권자정보 삭제
	 * - 보고서에 친권자정보표시시 서명자에 따라 친권자정보삭제
	 */
	function _removeChinInf(docCd, oAddYns, oSignInf){
		
		//친권자정보 해당하느 케이스에만 세팅
		var isChin 	= true;
		var signKey 	= "DS_FRMT_INF_"+docCd+"_PPAUTH_SIGN_1";

		if(oSignInf != null && !$.isEmptyObject(oSignInf)) {
			if(!(signKey in oSignInf)){
				isChin = false;
			}
		}
		
		if(!isChin){
			oAddYns.CHIN_NAAM 	= "";
			oAddYns.CHIN_RLT 		= "";
		}
	};
	
	/**
	 * 서명dsNm 변경
	 * - 서명 임시저장등은 원래 문서 key로하고
	 *   예외값이나 문서코드가 변경되는경우를 대비 cvt실행해줌
	 *   서명key생성시 및  리포트호출시 각문서별 서명 filter시
	 */
	function _cvtSignDsNm(sVal){
		if(sVal == "DS_FRMT_INF_486") sVal = "DS_FRMT_INF_487";
		return sVal;
	};
	
	/**
	 * 보고서 이미지 전송data string [inf_data]
	 */
	function _getReportInfData(oSusInf, sSusBzSecd) {
		
		var oCtrBasInfo = oSusInf['DS_SUS_CTR_BAS'][0];
		
		var imgData = {
			// INFORMATION
			BZ_COD					: 'NP',												// 업무구분 NP신계약
			DTL_BZ_COD			: '01',												// 개인단체구분 01개인 02진단 03단체
			KEY							: oCtrBasInfo.PLYNO+'',						// 키값 증권번호
			CTYMD						: oCtrBasInfo.CTYMD,						// 계약일자
			WRK_SCTN				: sSusBzSecd == "01" ? "1" : "2",		// 신규여부 1신규 2보완 3추가
			SCAN_BRCD				: oCtrBasInfo.COL_RSTM_BZGRCD,	// 설계사지점코드 (스캔지점코드)
			RECP_BRCD				: '00|00',											// 접수지점코드 (모집사업단|모집지점)
			SCAN_EMPNO			: oCtrBasInfo.COL_RSTM_PLARNO,	// 스캔담당자사번
			OMR_EXST_YN			: '0',													// OMR 존재 여부
			GUBUN1					: '1',													// 개인1 단체2 사고''
			GUBUN2					: '1',													// 신규1 부활2
			GUBUN3					: '',													// 여유필드
			// OCR/OMR
			AutoAp						: 'N',													// 자동심사내용 (N or Y) : 현재 omr 필드 미사용
			DCLO_1_CHK_MTT	: '',
			DCLO_2_CHK_MTT	: '',
			DCLO_3_CHK_MTT	: '',
			DCLO_4_CHK_MTT	: '',
			DCLO_5_CHK_MTT	: '',
			DCLO_6_CHK_MTT	: '',
			DCLO_7_CHK_MTT	: '',
			DCLO_8_CHK_MTT	: '',
			DCLO_9_CHK_MTT	: '',
			DCLO_10_CHK_MTT	: '',
			DCLO_11_CHK_MTT	: '',
			DCLO_12_CHK_MTT	: '',
			DCLO_13_CHK_MTT	: '',
			MAIPSN_DRVG_CHK_MTT				: '',
			SNDINSPSN_1_DRVG_CHK_MTT	: '',
			SNDINSPSN_2_DRVG_CHK_MTT	: '',
			SNDINSPSN_1_NAM_SIGN_YN		: '',
			SNDINSPSN_2_NAM_SIGN_YN		: '',
			DCLO_MDF_YN								: '',
			ONLY_GOJI_YN								: "",	
			ONLY_PRPFRM								: ""	
		};
		
		var imgDataString = '';
		$.each(imgData, function(key, value){
			imgDataString += (value + ',');
		});
		
		return imgDataString.slice(0, -1);
	};
	
	return {
		gConst									:gConst
		, getInitGlobalDataSusEdoc 	: getInitGlobalDataSusEdoc
		, setGlobalDataSusEdoc 		: setGlobalDataSusEdoc
		, getGlobalDataSusEdoc			: getGlobalDataSusEdoc
		, callSusReport						: callSusReport
		, isGoJiDocCd						: isGoJiDocCd
		, getPrpfrmDocCdByGoji		: getPrpfrmDocCdByGoji
		, getBioSignImgUrl					: getBioSignImgUrl
	}
	
})(jQuery, window.Dcore);