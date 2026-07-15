/*******************************************************************************
 * 화면ID : susFeedIfoUtil 설명 : 청약정보입력Util 작성자 : 최훈희 작성일 : 2020-08-04 변경로그 :
 * 2020-08-13 gData 를 통한 화면 컨트롤 시 모든 컴포넌트에 대한 visible 은 show, hide 로 처리하기 위해 화면의
 * 모든 컴포넌트 (li 등 포함) 에 name 을 통한 addClass, removeClass 를 사용하여 none 을 처리하는 부분을
 * 삭제하였다. - 각 화면의 .js 에도 동일 처리됨. - 각 화면의 class=none 처리된 부분을 hidden 처리로 변경.
 * 
 ******************************************************************************/
var susFeedInfoUtil = (function($, D){
	// ----- variable declaration ----
	var gDS = {};					// DataSet 배열 저장 변수
	var global_FC_ADMN_CS_PK = "";
	
	// S : select
	// R : radio
	// I : input
	// C : checkbox
	// V : 화면에 보여지는 영역 (li, ul, div)
	var gDataCol = new Array(
		// 화면1:계약정보
		new Array('cmbCtymd|S', 		// 계약일
				'sMblSusSecd|R',		// 청약종류
				'dsps|R',		// 장애인전용보험
				'dspsCh|R',		// 장애인전용보험 대상
				'RL_OWNR_YN001|R',		// 주피보험자 장애여부
				'maipsn_end_date|I',		// 주피보험자 종료일자
				'RL_OWNR_YN011|R',		// 만기 장애여부
				'expi_end_date|I',		// 만기 종료일자
				'RL_OWNR_YN21|R',		// 입원장해 장애여부
				'hspz_end_date|I',		// 입원장해 종료일자
				'RL_OWNR_YN31|R',		// 사망시 장애여부
				'dth_end_date|I'       // 사망시 종료일자
				),		
		// 화면2:계약관계자
		new Array('txt_csPk_11|I', 		// 계약자명
				'sel_csRlpSecd_11|S',	// 계약자와의관계
				'txt_csPk_21|I',		// 피보험자명
				'sel_csRlpSecd_21|S',	// 피보험자관계
				'txt_csPk_31|I',		// 종피보험자명
				'sel_csRlpSecd_31|S',	// 종피보험자관계
				'sel_csPk_41|S',		// 만기수익자명
				'sel_csRlpSecd_41|S',	// 만기수익자관계
				'sel_csPk_42|S',		// 장해수익자명
				'sel_csRlpSecd_42|S',	// 장해수익자관계
				'sel_csPk_47|S',		// 사망수익자명
				'sel_csRlpSecd_47|S',	// 사망수익자관계
				'sel_rrn_41|S',			// 대표지정대리청구인 (만기, 장해)
				'sel_rrn_42|S',			// 지정대리청구인 (만기, 장해)
				'dstnPxNtSlctInfCd|S',	// 지정대리인미지정사유정보코드
				'rlpParentPk|S',		// 친권자명
				'rlpParentPkByPass|S'),	// sing 화면에서 필요한 msb_cs_pk 보관용
		// 화면3:수령정보
		new Array('cmbMaigRvpl|R', 		// 우편물수령
				'cmbInspoRvpl|R',		// 증권수령
				'sInsutrmsDlvryMthdCod|R', // 약관수령
				'GTED_ADR|I',			// 주소
				'LSTD_ADR|I'),			// 주소2
		// 화면4:개인정보 이용동의
		new Array('edtPdtIndvInfHoldYyct|I', 		// 개인(신용)정보 수집/이용에 관한 동의 년
				'edtPdtIndvInfHoldOfrYyct|I',		// 개인(신용)정보 제공에 관한 동의 년
				'PDT_AGDC_SD|R',		// 상품소개 상세요약 여부
				'mPsnChkCrinf24Y|R',		// 개인(신용)정보 수집/이용에 관한 동의 피보험자
				'chkCrinf24OfrAll|C',		// 개인(신용)정보 제공에 관한 동의 전체
				'mPsnChkCrinf24OfrY|R',		// 개인(신용)정보 제공에 관한 동의 피보험자
				'chkCntcMdTdAll|C',		// 상품소개를 위한 가입권유 연락방식 전체
				'chkCntcMdTdTel|C',		// 상품소개를 위한 가입권유 연락방식 전화
				'chkCntcMdTdSns|C',		// 상품소개를 위한 가입권유 연락방식 SMS
				'chkCntcMdTdEmal|C',		// 상품소개를 위한 가입권유 연락방식 이메일
				'ADVM_OFR_YN|R',            // 광고성 정보 수신동의
				'chkCntcMdTdPmil|C',		// 상품소개를 위한 가입권유 연락방식 우편
				'bChkBnfcDstnY|R',		// 보험계약자 사망 시 상속인 등 승계인이 보험수익자 지정,변경권을
										// 행사함
				'bChkCnctrAgrmY|R'),		// 통신수단을 이용한 철회 및 해지요청 동의
		// 화면5:FATCA
		new Array('edtCorgnoCon|S', 		// 국적
				'rdoUsCorYn|R',		// 해외 거주자여부 확인
				'rdoUsAmYn|R',		// 해외 거주자여부 예 인경우
				'rdoUsSeaYn|R',		// 대한민국 이외의 조세목적상 해외거주지 여부
				'edtCorgnoSur|I',		// 성(Surname)
				'edtCorgnoGiv|I',		// 명(Given name)
				'edtCorgnoCon1|S',		// 거주지국가1
				'edtCorgnoEnAdd1|I',		// 영문주소1
				'ch1|R',		// 납세자번호1
				'edtCorgnoTin1|I',		// (TIN):SSN or ITIN
				'rdoUsEXYn1|R',		// 미기재사유1
				'edtCorgnoETC1|I',		// 미기재사유1_기타일경우
				'edtCorgnoCon2|S',		// 거주지국가2
				'edtCorgnoEnAdd2|I',		// 영문주소2
				'ch2|R',		// 납세자번호2
				'edtCorgnoTin2|I',		// (TIN):SSN or ITIN
				'rdoUsEXYn2|R',		// 미기재사유2
				'edtCorgnoETC2|I'),		// 미기재사유2_기타일경우
		// 화면6:펀드정보
		new Array('chkFund1|C', 		// 펀드비율체크1
				'chkFund2|C',		// 펀드비율체크2
				'chkFund3|C',		// 펀드비율체크3
				'chkFund4|C',		// 펀드비율체크4
				'chkFund5|C',		// 펀드비율체크5
				'chkFund6|C',		// 펀드비율체크6
				'chkFund7|C',		// 펀드비율체크7
				'chkFund8|C',		// 펀드비율체크8
				'chkFund9|C',		// 펀드비율체크9
				'txtFund1|I',		// 펀드비율1
				'txtFund2|I',		// 펀드비율2
				'txtFund3|I',		// 펀드비율3
				'txtFund4|I',		// 펀드비율4
				'txtFund5|I',		// 펀드비율5
				'txtFund6|I',		// 펀드비율6
				'txtFund7|I',		// 펀드비율7
				'txtFund8|I',		// 펀드비율8
				'txtFund9|I',		// 펀드비율9
				'cmbAutReDst|S',		// 펀드자동재분배
				'chkAdprmYn|R',		// 추가보험료포함
				'cmbAvgPtilIvst|S',		// 평균분할투자
				'chkPerVar|R', // 부적합 보험계약 체결
				'cmbGolPrfr|I'), // 목표수익율
		// 화면7:KYC
		new Array('SEL_PARENTS|S', 		// 친권자선택
				'CUST_DTL_TYP_CD|R',		// 구분
				'INSU_JOB_CD|S',		// 직업(업종)
				'OFC_NM|I',		// 직장명
				'OFC_ORG_NM|I',		// 부서명
				'POSTN_NM|I',		// 직위
				'OFC_CNTC_REGON_NO|S',		// 직장연락처1
				'OFC_CNTC_OFC_NO|I',		// 직장연락처2
				'OFC_CNTC_INDIVI_NO|I',		// 직장연락처3
				'HANGL_NM|I',			// 성명
				'CNTRY_CD|S',		// 국적
// 'PASSPT_NO|I', // 여권번호 - 삭제
				'RLNM_CHK_MTHOD_CD|S',		// 신원확인증
				'RNNO_ISSUE_DT_|I',		// 면허번호
				'mskPblsYmd|I',		// 발급일자
				'serialNumber|I',		// 일련번호
				'RNNO_TRFLS_YN|I',		// 진위여부1
				'RNNO_MANUL_TRFLS_YN|I',		// 진위여부2
				'RL_OWNR_YN|R',		// 실제소유자
				'RL_OWNR_HANGL_NM|I',		// 실제소유자 아니오 성명
				'RL_OWNR_BRTHYMD|I',		// 실제소유자 아니오 생년월일
				'RL_OWNR_CNTRY_CD|I',		// 실제소유자 아니오 국적
				'TXFNOG_CD|R',		// 거래자금 원천 및 출처
				'NWCT_TXPR_CD|R',		// 거래목적(신계약)
				// 미성년 관련 데이터
				'INSU_JOB_CD_CHILD|S',		// 직업(업종)
				'CNTRY_CD_CHILD|S',		// 국적
				'RLNM_CHK_MTHOD_CD_CHILD|S',		// 신원확인증
				'la10-17-1|I',		// 발급일자
// 'la10-20-1|S', // 진위여부1 - 무조건 재실행해야 하므로 이력에 저장하지 않는다
// 'la10-20-2|S', // 진위여부2
				'RL_OWNR_YN_CHILD|R',		// 실제소유자
				'RL_OWNR_HANGL_NM_CHILD|I',		// 실제소유자 아니오 성명
				'RL_OWNR_BRTHYMD_CHILD|I',		// 실제소유자 아니오 생년월일
				'RL_OWNR_CNTRY_CD_CHILD|S',		// 실제소유자 아니오 국적
				'TXFNOG_CD_CHILD|R',		// 거래자금 원천 및 출처
				'NWCT_TXPR_CD_CHILD|R',		// 거래목적(신계약)
// 'RNNO_TRFLS_YN_TXT|I', // 진위체크
				'PRSN_CNTC_REGON_NO|S',		// 연락처
				'PRSN_CNTC_OFC_NO|I',		// 연락처2
				'PRSN_CNTC_INDIVI_NO|I',	// 연락처3
				'HOME_ZIPCD|I',				// 자택주소
				'HOME_ZIPCD_ADDR|I',		// 자택주소2
				'HOME_DTL_ADDR|I',			// 자택주소3
				'OFC_ZIPCD|I', 				// 직장주소
				'OFC_ZIPCD_ADDR|I',			// 직장주소2
				'OFC_DTL_ADDR|I',			// 직장주소3
				'TXFNOG_ETC_NM|I',			// 거래자금 원천및출처 기타
				'NWCT_TXPR_ETC_NM|I',		// 거래목적(신계약) 기타
				'RNNO_GBN_CD|R',			// 실명번호 구분
				'RNNO_GBN_CD_CHILD|R', 			// 실명번호 구분
				'HANGL_NM_CHILD|I',				// 성명
				'PRSN_CNTC_REGON_NO_CHILD|S',	// 연락처
				'PRSN_CNTC_OFC_NO_CHILD|I',		// 연락처2
				'PRSN_CNTC_INDIVI_NO_CHILD|I',	// 연락처3
				'HOME_ZIPCD_CHILD|I',			// 자택주소
				'HOME_ZIPCD_ADDR_CHILD|I',		// 자택주소2
				'HOME_DTL_ADDR_CHILD|I',		// 자택주소3
				'TXFNOG_ETC_NM_CHILD|I',		// 거래자금 원천 및 출처 기타
				'NWCT_TXPR_ETC_NM_CHILD|I'),	// 거래목적(신계약) 기타
		// 화면8:기타
		new Array('rdoHealth|R', 		// 헬스케어서비스
				'sHpclMetdCod|R',		// 해피콜종류
// 'selCpSecd|I', // 해피콜 모바일 시 휴대폰1
// 'edtCpGukn|I', // 해피콜 모바일 시 휴대폰2
// 'edtCpPk|I', // 해피콜 모바일 시 휴대폰3
				'POHD_HPCL_STRT_HMS|I',		// 통화가능시간1
				'POHD_HPCL_EN_HMS|I',		// 통화가능시간2
				'cmbMojib|S',		// 모집경로
				'txpfPosa|I',		// 세금우대금액
				'chkTxpf|R',		// 세금우대적용여부
				'spnPrpmNumtm|I',		// 선납횟수
				'cmbOblgPym|I',		// 의무납입기간
				'rdoLgamDcMetd|I',		// 고액할인방법
				'rdoChdAdDcMetd|I',		// 다자녀할인적립
				'edtChdCnt|I',		// 자녀 수
				'cmbFixtrmDfr|I',		// 정기지급신청
				'cmbInfMnbdSctn|I',	// 저율과세적용코드
				'elder|R')		// 고령층지정인알림서비스
	); 
	
	// visible 처리를 위한 컬럼
	var gDataColV = new Array(
		// 화면1:계약정보
		new Array('divDis',				// 장애인전용보험 영역
				'li_dsps',	// 장애인전용보험 신청시 영역
				'li_maipsn',	// 장애인전용보험 주피보험자 영역
				'li_expi',		// 장애인전용보험 만기 영역
				'li_hspz',		// 장애인전용보험 입원장해 영역
				'li_dth'),
		// 화면2:계약관계자
		new Array(''),		// 
		// 화면3:수령정보
		new Array(),
		// 화면4:개인정보 이용동의
		new Array(),		// 통신수단을 이용한 철회 및 해지요청 동의
		// 화면5:FATCA
		new Array('liRdoUsAmYn', 	// 미국세법상 미국인 예 영역
				'corgInfo', 		// 납세자정보 영역
				'liCorgnoCon1',		// 거주지국가 영문 영역1
				'liCorgnoCon2',		// 거주지국가 영문 영역2
				'edtCorgnoETC1',	// 미기재사유-기타1
				'edtCorgnoETC2'),	// 미기재사유-기타2
		// 화면6:펀드정보
		new Array(''), // 목표수익율
		// 화면7:KYC
		new Array('li_AML',		// AML 성인 영역
				'DIV_PARENTS',	// 친권자 영역
				'li_RNNO_ISSUE_DT_',		// 운전면허 선택시 면허번호 영역
				'li_mskPblsYmd',		// 운전면허 선택시 발급일자 영역
				'li_RL_OWNR_YN',		// 실제소유자 아니오 영역
				'li_serialNumber',		// 일련번호 영역
				'li_AML_parent',	// AML 미성년자 영역
				'la10-17-1',		// 발급일자 영역
				'li_RL_OWNR_YN_CHILD',		// 실제소유자 아니오 선택 영역
// 'li_TXFNOG_CD_NO_CHILD', // 고객확인 추가정보
				'TXFNOG_ETC_NM',		// 거래자금 원천 및 출처 기타
				'TXFNOG_ETC_NM_CHILD',		// 거래자금 원천 및 출처 기타 미성년
				'NWCT_TXPR_ETC_NM',		// 거래목적 신계약 기타
				'NWCT_TXPR_ETC_NM_CHILD'),		// 거래목적 신계약 기타 미성년
		// 화면8:기타
		new Array('divElder',		// 고령층 지정인 알림서비스 신청 영역
				'li_Txpf', 		// 세금우대 영역
				'pPrpmNumtm')		// 최대 선납횟수 영역
	); 

	// 화면 이력을 저장할 DataSet 배열 저장 변수
	var gData = {}; // 값 저장
	
	var gDisp = {}; // 속성 저장
	var gVisible = {}; // show/hide 저장

	var gVAL = {// 단일 데이터 저장 변수
		plyNo				: '',			// 증권번호
		susNum    			: '',	 		// 청약번호
		hisSusNum    		: '',	 		// 청약번호
		qttNo 	  			: '',	 		// 가입설계번호
		delYn 	  			: '',	 		// 삭제여부
		loadMode  			: '',	 		// N:신규등록, Q:가입설계조회, S:청약조회,
											// D:청약삭제조회
		plarNo	  			: '',	 		// 모집설계사번호
		plarBrofc 			: '',	 		// 지점번호
		stdYmd	  			: '',	 		// 계약일자
		crtnCsNam 			: '',	 		// 주계약자이름
		ctrnCsRrn 			: '',	 		// 주계약자주민번호
		isStaf    			: false,		// 사원여부 -- 잘못 사용되고 있는것 같으니 확인 후 수정
		isPohdStaf    		: false,		// 계약자가 사원 인지 여부
		isMaipsnStaf    	: false,		// 피보험자가 사원 인지 여부
		insCtrPrps 			: '',			// 보험계약성향(투자성향?)코드 (ASIS -
											// PatFund.xfdl:: this.INS_CTR_PRPS)
		rlpCd 				: '',			// 계,피,종피1 동일인 체크 코드
		maiPrdcd			: '',			// 주상품코드
		udProcCd			: '0', 			// 심사처리진행코드 (0 심사전, 1 심사완료저장가능, 2
											// 심사오류저장불가능)
		reqSys				: 'SFA',		// 요청시스템? 주석없음.
											// this.g_getParam("pReqSys", false)
		maiPrdcdPremModYn 	: '0',	// 주상품보험료수정여부? 주석없음. :: default/미수정 '0', 수정시
									// '1'
		csRaResultCd 		: '0',			// 고객위험평가결과 (0 대상아님/성년계약, 1 저위험, 2
											// 비영리단체고위험, 3 미성년계약 4 고위험)
		atcdEstyYn 			: 'N',			// AML금융의원회 첨부서류 필요여부
		amlExeYn 			: false, 		// AML 처리 실행 여부
		amlExeYn_child		: false,  	// AML 미성년자 처리 실행 여부
		csnum		: '',			// 고객주민번호
		csNam		: '',			// 고객명
		cmbPdtSecd	: '', 			// 상품구분 code
		cmbRpsPrdcd	: '',			// 대표상품 code
		cmbPrdcd 	: '', 	 		// 주상품 code
		isSave 		: false, 		// 청약저장여부
		g_remObj 	: null , 		// 가설 보험료 정보
		setDB 		: false,
		dsNtprdMttPos 	: 0,
		isModify 	: false,
		isPremCalc 	 : false,
		PdtPremInput : '',
		comparePerVar :  '',
		maiPdtChnYn  : false,
		/* check */
		csPkEmpty 		:  null,	// CS_PK [고객고유번호] null 여부
		sAceClbSecd 	: '0', 		// 이거 세팅하는 곳이 없음 ㅜㅜ -- 0값이 계속 넘어가니 확인
		fcYN 			: false, 	// 설계사 여부
		sPrpmPsbyNumtm 	: '0',		// 선납횟수
		happyCount 		: 0,
		antyTrimnsInput : '',
		// 고령층 지정인 알림 서비스 관련
		FulAge			: 0,
		Mhypym			: 0,
		VAR_PDT_KNCD	: '',
		AUTHRZT_WLIF_KNCD : '',
		HP_MAIPSN 		 : '',  // 주피보험자 핸드폰 번호
		HP_POHD 		 : '',  // 계약자 핸드폰 번호
		mhypymStdprm	: 0,	// 심사 이후 보험료
		realPyprm	: 0,	// 심사 이후 할인후보험료
		CHILD_EXE_YN : true,	// 미성년KYC여부
		DS_DETAIL_04_01 : {},	// 자택전화번호
		DS_DETAIL_04_02	: {},	// 직장전화번호
		DS_DETAIL_05	: {},	// 휴대전화번호
		DS_DETAIL_12	: {},	// FC별국적코드,체류코드
		DS_DETAIL_02	: {},
		DS_FNC_SPND_INF : {},
		AIB_INQPE		: '',
		AIB_CHKYN		: '',
		AIB_ERRMSG		: '',
		susInpHisPk		: '0',
		selfUw			: "N",
		obj_PARENTS		: {},
		fcAdmnCsPk : global_FC_ADMN_CS_PK
	};

	var gPARAM = {};
	var fcTel; // 설계사 전화번호
	var fcTelS;
	var sArarmYn = false;
	var cntAIB = 0; 		// 진위 여부 count
	
	var gViewNum = 1;
	var gMaxViewNum = 8;
	var flow = "";
	var jongpiYn = false;
	var HOExp = false;
	var HQExp = false;
	
	
	// ----------------KYC (start)------------------------------
	
	/**
	 * 초기화
	 * 
	 * @description: 가설번호, 청약번호 존재 유무에 따라 가설정보 조회 또는 청약정보 조회 호출
	 */
	function init() {
		dialog.handLoading(true);
		flow = "FIR";
		
		console.log("userinfo>>", D.global.getUserInfo());
		
		var aSusNum = D.move.getParam('p_SUSNUM');	// 청약번호
		var aQttNo  = D.move.getParam('p_QTTNO');	// 가입설계번호
		gVAL.delYn  = D.move.getParam('p_DELYN') || '0';	// 삭제여부
// dialog.alert("청약번호:"+aSusNum + ":: 가설번호::" + aQttNo);

		var t = Array.prototype.join.call(arguments);
		if(stringUtil.isNull(aSusNum) && stringUtil.isNull(aQttNo)){
			if(t.length == 7){
				aQttNo = t;
			}else{
				aSusNum = t;
			}		
		}
		
		// 공통코드 조회
		var codSet = [
	  		{cod: '00695', codDs: 'DS_CMB_CTRINTP_XCLCLV' },	// 우대적용코드
	  		{cod: '00203', codDs: 'DS_CMB_DCKNCD' },			// 할인정보
	  		{cod: '00637', codDs: 'DS_CMB_LTAXYN' },			// 저율과세적용여부
	  		{cod: '00213', codDs: 'DS_CMB_DIAGCD' },			// 진단종류코드
	  		{cod: '00011', codDs: 'DS_CMB_CTRINTP_CSRLP' },		// 계약관계
	  		{cod: '01672', codDs: 'DS_CMB_CAPN' },				// 캠페인명
	  		{cod: '01725', codDs: 'DS_CMB_LGAMDCMETDCOD' },		// 고액할인방법코드
	  		{cod: '01957', codDs: 'DS_CMB_CHDADDCMETDCOD' },	// 다자녀할인방법코드
	  		{cod: '10076', codDs: 'DS_CMB_MOJIB' },				// 모집경로
	  		{cod: '01236', codDs: 'DS_CMB_MAIGRVPL' },			// 우편물수령지
	  		{cod: '01375', codDs: 'DS_CMB_INSPORVPL' },			// 증권수령
	  		{cod: '00119', codDs: 'DS_NTPRD_SMASD' },			// 금액 단위
	  		{cod: '00018', codDs: 'DS_COUNTRY' },				// 국적
	  		{cod: '10111', codDs: 'DS_BZ_SECD' },				// 업무구분코드 // '01
																// 계약' 고정
	  		{cod: '10112', codDs: 'DS_CTR_RLE_SECD' },			// 계약관계구분코드 //
																// '01 본인' 고정
	  		{cod: '10113', codDs: 'DS_AML_JOB_CODE' },			// AML업종코드
	  		{cod: '10114', codDs: 'DS_SLAMT_COD' },				// 매출액코드
	  		{cod: '10115', codDs: 'DS_PERSCN_COD' },			// 종업원수코드
	  		{cod: '10120', codDs: 'DS_REALNM_VERF_MTHD' },		// 실명구분코드
	  		{cod: '00026', codDs: 'DS_CP_COD' },				// 휴대전화구분코드
	  		{cod: '00583', codDs: 'DS_TEL_AR_COD' },			// 전화지역번호코드
	  		{cod: '00021', codDs: 'DS_DMN_COD' },				// 도메인구분코드
	  		{cod: '00052', codDs: 'DS_CMB_INJ_PELGRD_COD' },	// 직업위험등급코드
	  		{cod: '00052', codDs: 'DS_CMB_PEL_SCTN_COD' },		// 일반위험등급
	  		{cod: '00045', codDs: 'DS_CMB_PEL_PRPS_COD' },		// 운전위험등급
	  		{cod: '10088', codDs: 'DS_CMB_MDHIS_SCTN_COD' },	// 병력구분코드
	  		{cod: '10089', codDs: 'DS_CMB_OBS_RSN_COD' },		// 장애사유코드
	  		{cod: '10285', codDs: 'DS_EST_PRPO_COD' },		// 설립목적코드
			{cod: '10298', codDs: 'DS_NATAL_COD' },		// KYC사용코드
			{cod: '10299', codDs: 'DS_INSU_JOB_CD' },		// KYC사용코드-직업코드
			{cod: '10305', codDs: 'DS_RNNO_GBN_CD' }		// KYC사용코드
	  	];

	  	// 공통 코드 조회
	  	dcUtil.cf_getCdListByMultiCatCd(codSet, function(result) {
	  		
	  		// 결과 DS 세팅
	  		fnSetGlobalDs(result.remoteResult.outDataSet);
			
			// 계약일자 당일로 셋팅
			gVAL.stdYmd = dateUtil.getDate();
  			
	  		if (!stringUtil.isNull(aQttNo)) {	// * 가입설계에서 넘어온 경우
	  			gVAL.loadMode = 'Q';
	  			gVAL.qttNo = aQttNo;
				// 가입설계정보 조회
				searchQTT(aQttNo); // 가입설계조회
	  		} else if (!stringUtil.isNull(aSusNum)) {	// * 청약진행현황에서 넘어 온 경우
	  			gVAL.loadMode = 'S';
	  			gVAL.susNum = aSusNum;
				// 청약정보 조회
				fnInqGetSusCtt(aSusNum);
	  		} else {
	  			dialog.alert('가입설계번호 또는 청약번호가 존재하지 않습니다.');
	  		}
	  		
	  	});
	};
	
	// 화면 Next 의 초기화
	function init2(obj) {
		console.log("test init2>>>",obj);
		flow = "SEC";
		
		gDS = obj.gDS;
		gData = obj.gData;
		gDisp = obj.gDisp;
		gVisible = obj.gVisible;
		gVAL = obj.gVAL;
		gPARAM = obj.gPARAM;
		fcTel = obj.fcTel;
		fcTelS = obj.fcTelS;
		gViewNum = obj.gViewNum;
		global_FC_ADMN_CS_PK = obj.global_FC_ADMN_CS_PK;
		
		setView(gViewNum, setViewWithgData);
		
		if(gViewNum == 1) {
			setView_NtMttInfo(); // 계약상세 그리기
		}
	};
	
	function rtnSusFeed() {
		var obj = susFeedInfoUtil;
		obj.gDS = gDS;
		obj.gData = gData;
		obj.gDisp = gDisp;
		obj.gVisible = gVisible;
		obj.gVAL = gVAL;
		obj.gPARAM = gPARAM;
		obj.fcTel = fcTel;
		obj.fcTelS = fcTelS;
		obj.gViewNum = gViewNum;
		obj.global_FC_ADMN_CS_PK = global_FC_ADMN_CS_PK;
		
		return obj;
	}
	
	
	/*
	 * 가입설계 조회
	 */ 
	function searchQTT(qttNum, _callback){ 
		
		var param = {}; // 파라미터 초기화
		/*
		 * inputDS 세팅
		 */
		var remote = convertUtil.getRemoteObj('FG_SusInp', 'UDQ05');	
		/*
		 * var DS_SEARCH = { PLYNO : fundNum } convertUtil.setRowObj(remoteObj,
		 * 'DS_SEARCH', DS_SEARCH);
		 */
		param.remote 			= remote;

		/*
		 * argument 세팅
		 */
		var tmpQTTNO 	=  qttNum; // 가입설계번호
		param.QTTNO 	= tmpQTTNO; // 가입제안번호 세팅
		param.REQ_SYS 	= "SFA"; 
		param.CTYMD = dateUtil.getDate();

		D.http.ajax('/su/mblSus/getSusInpDtlInf', param).then(function(result){
// D.http.ajax('/sw/swAllCC', param).then(function(result){
			var arr_DS =  result.remoteResult.outDataSet;
			console.log("test>>cs_list 가설>>>>>>>>", arr_DS);
			gDS['DS_QTT_BAS'] 				= stringUtil.isNull(arr_DS.DS_BAS)? []: arr_DS.DS_BAS.data;
			gDS['DS_QTT_CS_LIST'] 			= stringUtil.isNull(arr_DS.DS_CTR_INTP_LST)? []: arr_DS.DS_CTR_INTP_LST.data;
			gDS['DS_QTT_ANTY_INF'] 			= stringUtil.isNull(arr_DS.DS_INS_ANTY_INF)? []: arr_DS.DS_INS_ANTY_INF.data;
			gDS['DS_ANTY_MTT'] 				= stringUtil.isNull(arr_DS.DS_INS_ANTY_INF)? []: arr_DS.DS_INS_ANTY_INF.data;
			gDS['DS_QTT_FUND_INF'] 			= stringUtil.isNull(arr_DS.DS_INS_FUND_INF)? []: arr_DS.DS_INS_FUND_INF.data;
			gDS['DS_QTT_FUND_WKG_INF'] 		= stringUtil.isNull(arr_DS.DS_INS_FUND_WKG_INF)? []: arr_DS.DS_INS_FUND_WKG_INF.data;
			gDS['DS_QTT_PRD'] 				= stringUtil.isNull(arr_DS.DS_INS_PRD)? []: arr_DS.DS_INS_PRD.data;
			gDS['DS_QTT_MW_WDRW'] 			= stringUtil.isNull(arr_DS.DS_MW_WDRW)? []: arr_DS.DS_MW_WDRW.data;
			gDS['DS_QTT_AD_PYM'] 			= stringUtil.isNull(arr_DS.DS_FREE_PYM)? []: arr_DS.DS_FREE_PYM.data;
			gDS['DS_QTT_FREE_PYM'] 			= stringUtil.isNull(arr_DS.DS_FREE_PYM)? []: arr_DS.DS_FREE_PYM.data;
			gDS['DS_QTT_OTR_INF'] 			= stringUtil.isNull(arr_DS.DS_INS_OTR_INF)? []: arr_DS.DS_INS_OTR_INF.data;
			gDS['DS_CS_LIST'] 				= stringUtil.isNull(arr_DS.DS_CS_LIST)? []: arr_DS.DS_CS_LIST.data;
			gDS['DS_SUS_PDT_SECD'] 			= stringUtil.isNull(arr_DS.DS_QTT_PDT_SECD)? []: arr_DS.DS_QTT_PDT_SECD.data;
			gDS['DS_SUS_RES_PRDCD'] 		= stringUtil.isNull(arr_DS.DS_QTT_RES_PRDCD)? []: arr_DS.DS_QTT_RES_PRDCD.data;
			gDS['DS_SUS_MAI_PRDCD'] 		= stringUtil.isNull(arr_DS.DS_QTT_MAI_PRDCD)? []: arr_DS.DS_QTT_MAI_PRDCD.data;
			gDS['DS_SUS_ADR_POHD'] 			= stringUtil.isNull(arr_DS.DS_QTT_ADR_POHD)? []: arr_DS.DS_QTT_ADR_POHD.data;
			gDS['DS_SUS_ADR_MAIPSN'] 		= stringUtil.isNull(arr_DS.DS_QTT_ADR_MAIPSN)? []: arr_DS.DS_QTT_ADR_MAIPSN.data;
			gDS['DS_SUS_ADR_POHD_NEW'] 		= stringUtil.isNull(arr_DS.DS_QTT_ADR_POHD_NEW)? []: arr_DS.DS_QTT_ADR_POHD_NEW.data;
			gDS['DS_SUS_ADR_MAIPSN_NEW'] 	= stringUtil.isNull(arr_DS.DS_QTT_ADR_MAIPSN_NEW)? []: arr_DS.DS_QTT_ADR_MAIPSN_NEW.data;
			gDS['DS_JNT_PLAR'] 				= stringUtil.isNull(arr_DS.DS_QTT_JNT_PSBY)? []: arr_DS.DS_QTT_JNT_PSBY.data;
			gDS['ds_ProdtTypeMtt'] 			= stringUtil.isNull(arr_DS.DS_QTT_PDT_PRODT_TYPE)? []: arr_DS.DS_QTT_PDT_PRODT_TYPE.data;
			gDS['ds_CtrIntpMtt'] 			= stringUtil.isNull(arr_DS.DS_QTT_PDT_CTR_INTP)? []: arr_DS.DS_QTT_PDT_CTR_INTP.data;
			gDS['ds_AntyMtt'] 				= stringUtil.isNull(arr_DS.DS_QTT_PDT_ANTY)? []: arr_DS.DS_QTT_PDT_ANTY.data;
			gDS['ds_VarMtt'] 				= stringUtil.isNull(arr_DS.DS_QTT_PDT_VAR)? []: arr_DS.DS_QTT_PDT_VAR.data;
			gDS['ds_NtprdMtt'] 				= stringUtil.isNull(arr_DS.DS_QTT_PDT_NTPRD)? []: arr_DS.DS_QTT_PDT_NTPRD.data;
			gDS['ds_Pypd'] 					= stringUtil.isNull(arr_DS.DS_QTT_PDT_PYPD)? []: arr_DS.DS_QTT_PDT_PYPD.data;
			gDS['ds_Pycyc'] 				= stringUtil.isNull(arr_DS.DS_QTT_PDT_PYCYC)? []: arr_DS.DS_QTT_PDT_PYCYC.data;
			gDS['ds_CtmnMtt'] 				= stringUtil.isNull(arr_DS.DS_QTT_PDT_CTMN)? []: arr_DS.DS_QTT_PDT_CTMN.data;
			gDS['ds_OblgPymMtcntMtt'] 		= stringUtil.isNull(arr_DS.DS_QTT_PDT_OBLG_PYM)? []: arr_DS.DS_QTT_PDT_OBLG_PYM.data;
			gDS['ds_PregnMtt'] 				= stringUtil.isNull(arr_DS.DS_QTT_PDT_PREGN)? []: arr_DS.DS_QTT_PDT_PREGN.data;
			gDS['ds_GolPrfrMtt'] 			= stringUtil.isNull(arr_DS.DS_QTT_GOL_PRFR)? []: arr_DS.DS_QTT_GOL_PRFR.data;
			gDS['ds_PremSmasdMtt'] 			= stringUtil.isNull(arr_DS.DS_QTT_PDT_PREM_SMASD)? []: arr_DS.DS_QTT_PDT_PREM_SMASD.data;
			gDS['DS_CMB_CTYMD'] 			= stringUtil.isNull(arr_DS.DS_QTT_CTYMD)? []: arr_DS.DS_QTT_CTYMD.data;
			gDS['ds_DcloMtt'] 				= stringUtil.isNull(arr_DS.DS_QTT_PDT_DCLO)? []: arr_DS.DS_QTT_PDT_DCLO.data;
			gDS['dw_AntyFixPdtInf'] 		= stringUtil.isNull(arr_DS.dw_AntyFixPdtInf)? []: arr_DS.dw_AntyFixPdtInf.data;
			gDS['INS_DS_VAR_FIT_DIAG'] 		= stringUtil.isNull(arr_DS.INS_DS_VAR_FIT_DIAG)? []: arr_DS.INS_DS_VAR_FIT_DIAG.data;
			gDS['DS_EXPO_INF'] 				= stringUtil.isNull(arr_DS.DS_EXPO_INF)? []: arr_DS.DS_EXPO_INF.data;
			gDS['MFGS_SUS_INP_HIS'] 		= stringUtil.isNull(arr_DS.MFGS_SUS_INP_HIS)? []:arr_DS.MFGS_SUS_INP_HIS.data;
			gDS['ds_ctymd'] 				= stringUtil.isNull(arr_DS.ds_ctymd)? []:arr_DS.ds_ctymd.data;
			gDS['ds_pdtSalChnInf']			= stringUtil.isNull(arr_DS.ds_pdtSalChnInf)? [] : arr_DS.ds_pdtSalChnInf.data;
			gDS['ds_jijungInf']				= stringUtil.isNull(arr_DS.ds_jijungInf)? [] : arr_DS.ds_jijungInf.data;
			gDS['ds_SusAntyAdInf']			= stringUtil.isNull(arr_DS.ds_SusAntyAdInf)? [] : arr_DS.ds_SusAntyAdInf.data;
			
			// 청약입력 날짜 제어
			getArrDS_CMB_CTYMD();
			
			// 이력데이터 처리
			setHist(arr_DS.MFGS_SUS_INP_HIS.data);

			// fnSetGlobalDs 함수를 사용하면 원본 데이터가 지워지기 때문에 따로 선언
			gDS["DS_DSTN_PX_CLMR_INF"] 		= 	[];
			gDS["DS_CTR_INTP_MTT_LIST"]  	=  	[]; // 초기화
			gDS["DS_DSTN_CS_LIST"]  		=  	[]; // 초기화 (지정대리청구인)
			gDS["DS_DSTN_PX_CLMR_POP"]  	=  	[]; // 초기화 (지정대리청구인)
			gDS["DS_CMB_CS_LIST"]  			=  	[]; // 초기화 (지정대리청구인)
			gDS["DS_PYPD_TEMP"]  			=  	[]; 
			gDS["DS_TMP"] 					=	[];
			gDS["DS_NTPRD_PYCYC"] 			=	[];
			gDS["ds_PdtTrmins_Pk"] 			=	[];
			gDS["DS_UD_DC_KNCD_INF"] 		=	[];
			gDS["DS_SUS_CTR_INTP"] 			= 	[];
			gDS["DS_UD_INCT_INTP_AML"] 		= 	[];
			gDS["DS_UD_NTPRD"] 				= 	[];
			gDS["DS_OTR_INF_MNBD"] 			= 	[];
			gDS["DS_OTR"] 					= 	[];
			gDS["DS_MAI_INF"] 				= 	[];
			gDS["DS_PREM_PYPRM"] 			= 	[];
			gDS["DS_SUS_PLYNO"] 			= 	[];
			gDS['DS_ADDR_MAIPSN'] 			= 	[];
			gDS['DS_ADDR_POHD'] 			= 	[];
			gDS['DS_ADDR_POHD_VW'] 			= 	[];
			gDS['DS_ADDR_MAIPSN_VW'] 		= 	[];
			gDS['G_OP_Auth'] 				= 	[]; 
			gDS['G_Task_Auth'] 				= 	[];
			
			// self uw 세팅
			gVAL.selfUw = result.remoteResult.paramMap.selfUw;
			
			// 전역 변수에 [주 상품 코드] 넣기.
			gVAL["maiPrdcd"] = gDS["DS_QTT_BAS"][0].MPRD_PRDCD;
			
			if(gDS["DS_QTT_BAS"][0].RPS_PRDCD == "HO") {
				HOExp = true;
				var chkty = $.grep(gDS["DS_QTT_PRD"], function(obj){if(obj.PRDCD == "103990" || obj.PRDCD == "103989"){return true;}})[0];
				if(!stringUtil.isNull(chkty)) {
					jongpiYn = true;
				}
			}
			gVAL["jongpiYn"] = jongpiYn;
			gVAL["HOExp"] = HOExp;
			console.log("종피보험자 유무1 : " + gVAL["jongpiYn"]);
			console.log("스타트PRO 예외 : " + gVAL["HOExp"]);
			
			if(gDS["DS_QTT_BAS"][0].RPS_PRDCD == "HQ") {
				var chkty = $.grep(gDS["DS_QTT_PRD"], function(obj){if(obj.PRDCD == "103822"){return true;}})[0];
				if(!stringUtil.isNull(chkty)) { HQExp = true; }
			}
			gVAL["HQExp"] = HQExp;
			
			/* check */
			init_ctrIntp(); 	// 모집 설계사 정보 세팅
			
			init_kycExctInf();	// KYC 수행자 정보 세팅

			// 계약관계자
			setCtrIntpMttForData();

			// 상품데이터
			getNtMttInfo(callBack_ntMttInfo_Qtt);
			
		});
	};
	
	/**
	 * 현재 상품의 관련 정보 조회
	 */
	function getNtMttInfo(_callback) {
		// 피보험자 정보 세팅
		var pbData = $.grep(gDS['DS_CTR_INTP_MTT_LIST'],function(p){if('21' == p.CTR_RLE_SECD)return true;} )[0];

		var nRrn = '';			// 주민등록번호
		var nGndrSecd = '';		// 성별

		if ('1111111' == String(pbData.RRN).substring(0,7)) {
			nRrn 	  = '1111111111111';
			nGndrSecd = '1';
		} else {
			nRrn      = pbData.RRN;
			nGndrSecd = pbData.GNDR_SECD;
		}

		// TODO: 정보 validation 추후 진행 this.getNtMttInfo

		// 조회 :: arguments SET
		var insArgs = {
			"STD_YMD"			: gVAL.stdYmd,					// 계약일자
			"INDV_GRP_SECD"		: "1",							// 개인단체구분
			"PRDCD"				: gVAL.maiPrdcd,				// 상품코드
			"SAL_ORG_CS_NUM"	: gVAL.plarBrofc,				// 판매설계사지점코드
			"RES_REG_NO"		: nRrn,							// 주민번호
			"GNDR_APPT_COD"		: nGndrSecd,					// 성별
			"CPCD"				: pbData.CPCD,					// 직업코드
			"DRVG_COD"			: pbData.DRVG_SECD,				// 운전코드
			"ASRD_CTR_RLE_SECD"	: pbData.CTR_RLE_SECD,			// 피보험자계약역할구분코드
			"PLAR_NUM"			: gVAL.plarNo,						// 모집설계사번호
			"sTmpPlarYn"		: "8" == D.global.getUserInfo().csrlesecd ? "1":"0",
			"remote"    		: convertUtil.getRemoteObj('FG_CmpuUd_NtprdMtt', 'UDQ01')
		};

		// 통신
		D.http.ajax("/sw/swAllPD", insArgs)
		.then(function(result) {
			if (result.remoteResult) {
				if(_callback){
					_callback(result);
				}
				
			} else {
				D.logger.error('통신 중 에러가 발생했습니다. 에러메세지코드 [' + (result.errorMsg || '') + ']');
				dialog.handLoading(false);
			}
		});
	};
	
	/**
	 * 가입설계 상품조회 callback
	 */
	function callBack_ntMttInfo_Qtt(result){
		// 결과 DS 세팅 :: gDS에 청약조회 정보의 DS를 덮어쓰거나 기존에 없던 DS가 추가됨.
		fnSetGlobalDs_version2(result.remoteResult.outDataSet);

		// 상품정보 set
		fnct_susSetPdtLst();
				
		// 가입상품사항 설정
		setNtprdMtt();
		
    	/*
		 * // 납입기간 설정 setPypd();
		 *  // 납입주기 설정 setPycycCod();
		 */  

		var val_rpsPrdcd = gDS["DS_QTT_BAS"][0].RPS_PRDCD;
		
		// 20091231 :: 유상묵
		// 9U 노블레스 상품의 경우 주상품에 따라 선택된 특약의 보기가 바뀌어야 함.
		// 저장된 것을 불러올 경우 보기가 그대로 세팅되므로 주상품의 보기에 해당하는것을 가져오지 못함.
		if(val_rpsPrdcd != "9U" && val_rpsPrdcd != "A8"){
			setDbNtprdMtt("DS_QTT_PRD"); // 선택된 상품정보 set(가입설계)
		}
		
	    // 전체특약 보험료계
	    setDsCalcNtprd(-1);
	    excutePartPremCacl(function(){


			// 심사에 사용할 주소 정보 세팅
			setAddrInfo();

			// 수금방법 자동세팅
			autoSetCtmnMetdCod();

			// 거래자금실소유 dfault 값 세팅
			// fnSetAmlInfo();
			fnSetGzsilInfo();

			// 설계사인지 판단하는 전역 변수값 세팅
		    fn_getIsStaff();

			// 고객 정보를 가져온다.
		    fn_lodingCustInfoForData(function () {
		    	setMhypymStdprmRealPyprm(function () {
					setView(gViewNum, setViewWithgData);

					console.log("page set>>", flow + "::", gViewNum);
					if(flow == "FIR" && gViewNum > 1) {
						var obj = susFeedInfoUtil;
						obj.gDS = gDS;
						obj.gData = gData;
						obj.gDisp = gDisp;
						obj.gVisible = gVisible;
						obj.gVAL = gVAL;
						obj.gPARAM = gPARAM;
						obj.fcTel = fcTel;
						obj.fcTelS = fcTelS;
						obj.gViewNum = gViewNum;
						obj.global_FC_ADMN_CS_PK = global_FC_ADMN_CS_PK;
						
						SU1010E.setFlow(obj);
					}
		    	}); // 월납기준보험료, 할인후보험료 세팅

		    	// TODO 보험료 부분 수정필요
				/*
				 * var premObj = { sumPrem : 0 // 합계보험료 , mhypymPrem : 0 // 월납
				 * 보험료 , realPyprm : 0 // 할인후 보험료 , sumDcAmt : 0 // 할인보험료 }
				 * gVAL.g_remObj = premObj;
				 */
		    }); 
			// dialog.handLoading(false); //AML 활성화 하면 지울것
			
			if(gViewNum == 1) {
				setView_NtMttInfo(); // 계약상세 그리기
			}
	    });
		

	};
	
	
	
	/**
	 * 청약상품조회 callback
	 */
	function callBack_ntMttInfo_sus(result){
		
		// 결과 DS 세팅 :: gDS에 청약조회 정보의 DS를 덮어쓰거나 기존에 없던 DS가 추가됨.
		fnSetGlobalDs(result.remoteResult.outDataSet);

		setNtprdMtt(); 	
		
		/*
		 * setPypd(); // 납입기간 설정 setPycycCod(); // 납입주기 설정
		 */
		var val_rpsPrdcd = gDS["DS_SUS_CTR_BAS"][0].RPS_PRDCD;

		// 20091231 :: 유상묵
		// 9U 노블레스 상품의 경우 주상품에 따라 선택된 특약의 보기가 바뀌어야 함.
		// 저장된 것을 불러올 경우 보기가 그대로 세팅되므로 주상품의 보기에 해당하는것을 가져오지 못함.
		if(val_rpsPrdcd != "9U" && val_rpsPrdcd != "A8"){
			setDbNtprdMtt("DS_QTT_PRD"); // 선택된 상품정보 set(가입설계)
		}
		// 20100121:: 유상묵
		// 가설에서 청약으로 넘어올때 가입금액등을 가져와야 하므로,
		// gLoadMode = Q일때는 타도록 한다. (N:신규등록, Q:가입설계조회, S:청약조회, D:청약삭제조회)
		if((val_rpsPrdcd == "9U" || val_rpsPrdcd == "A8")){
			setDbNtprdMtt("DS_QTT_PRD"); // 선택된 상품정보 set(가입설계)
		}
		
		// 연금사항 설정
		fnSetAntyMtt();		
		
		
		// 전체특약 보험료계
	    setDsCalcNtprd(-1);
	    excutePartPremCacl(function(){

			// 수금사항 설정 :: 여기서 말고 심사태우기전에 함수를 호출하여 세팅.. 입력을 전자청약에서 하기 때문에 조회된 정보를
			// 심사,저장 DS로 만들기만 하면 됨
			fnSetGzsilInfo();		// 거래자금실소유
			
			// 설계사인지 판단하는 전역 변수값 세팅
		    fn_getIsStaff(function(result){
	// // * 청약종류 --------------------------------------------------------------
	// $("[name=sMblSusSecd][value=" + scbInfo.MBL_SUS_SECD +
	// "]").prop('checked', true);
	// $("[name=sMblSusSecd]").trigger('change');
		    });
			
			// dialog.handLoading(false); //AML 활성화 하면 지울것
	
			fn_lodingCustInfoForData(function () {
				setView(gViewNum, setViewWithgData);

				console.log("page set>>", flow + "::", gViewNum);
				if(flow == "FIR" && gViewNum > 1) {
					var obj = susFeedInfoUtil;
					obj.gDS = gDS;
					obj.gData = gData;
					obj.gDisp = gDisp;
					obj.gVisible = gVisible;
					obj.gVAL = gVAL;
					obj.gPARAM = gPARAM;
					obj.fcTel = fcTel;
					obj.fcTelS = fcTelS;
					obj.gViewNum = gViewNum;
					obj.global_FC_ADMN_CS_PK = global_FC_ADMN_CS_PK;
					
					SU1010E.setFlow(obj);
				}
			}); 	// 고객정보를 가져온다
			
			if(gViewNum == 1) {
				setView_NtMttInfo(); // 계약상세 그리기
			}
	    });
	}
	
	
	function setHist(obj) {
		// 계약일자 유효여부. 이력의 계약일자가 선택가능한 계약일자에 포함되지 않으면
		// 이력정보를 삭제하고 1페이지부터 시작한다.
		var validCtymdYn = false;
		if (!stringUtil.isNull(obj)) {
			var MFGS_SUS_INP_HIS = JSON.parse(gDS['MFGS_SUS_INP_HIS'][0].SUS_INF_INP_DATA);
			console.log("setHist>111>>",MFGS_SUS_INP_HIS.gData);
			gData = MFGS_SUS_INP_HIS.gData;
			gDisp = MFGS_SUS_INP_HIS.gDisp;
			gVisible = MFGS_SUS_INP_HIS.gVisible;
			
			$.each(MFGS_SUS_INP_HIS.gVisible, function(key, val){
				gVisible[key] = val;
			});
			
			var num = Number(gDS['MFGS_SUS_INP_HIS'][0].SUS_INP_PROG_ST);
// gViewNum = num==0?1:num;
			// 무조건 1페이지부터 시작한다.
			gViewNum = 1;
			// 진위체크를 반드시 해야하므로 8페이지인 경우 7페이지로 이동한다.
			if(gViewNum == 8) {
				gViewNum = 7;
			}
			gVAL.susInpHisPk = gDS['MFGS_SUS_INP_HIS'][0].SUS_INP_HIS_PK;
			
			var arr_filetered_DS_CMB_CTYMD = gDS['ds_CTYMD'];
			console.log("arr_filetered_DS_CMB_CTYMD>>>",arr_filetered_DS_CMB_CTYMD);
			console.log("gData.cmbCtymd>>>",gData.cmbCtymd);

			// 가입설계
			if(!stringUtil.isNull(gVAL.qttNo)){
				for (var i = 0; i < arr_filetered_DS_CMB_CTYMD.length; i++) {
					if (arr_filetered_DS_CMB_CTYMD[i].COD == gData.cmbCtymd) {
						validCtymdYn = true; return;
					}
				}
			} else {

				for (var i = 0; i < arr_filetered_DS_CMB_CTYMD.length; i++) {
					if (arr_filetered_DS_CMB_CTYMD[i].COD == gData.cmbCtymd) {
						validCtymdYn = true; return;
					}
				}
				
			}
		} else {
			console.log("setHist>222>>");
			validCtymdYn = true;
			
			// 청약진행현황에서 넘어왓는데 이력없을 때
			if(stringUtil.isNull(gVAL.qttNo)){
				// 전문 금융소비자setting
				gData.FNC_SPND_CD = gDS['dw_susCtrBasDtl'][0].FNC_SPND_CD;
				gData.FNC_SPND_YN = gDS['dw_susCtrBasDtl'][0].FNC_SPND_YN;
			}
		}
		
		if(!validCtymdYn) {
			console.log("setHist>333>>");
			gData.cmbCtymd = dateUtil.getDate();
// gData = {};
			gViewNum = 1;
		}
	}

	/*
	 * 기타 사항 정보를 구성한다.[비동기 처리는 제외함]
	 */
	function setEtc_QTT(){

		/*
		 * 모집경로
		 */
		dcUtil.setCdSelect('""|선택', gDS['DS_CMB_MOJIB'], '#cmbMojib');  // 신원확인
																		// 국적
		
		/*
		 * 의무납입기간 세팅
		 */
		// 의무납입기간 란을 show/hide
		var $li_cmbOblgPym = $("#cmbOblgPym").parent().parent();
		if((gDS['ds_OblgPymMtcntMtt'].length > 0)){
			$li_cmbOblgPym.show();		
		}else{
			$li_cmbOblgPym.hide();		
		}
		var oblgPymMtcnt 		= (gDS['ds_OblgPymMtcntMtt'].length > 0) ? gDS['ds_OblgPymMtcntMtt'][0].OBLG_PYM_MTCNT : "";  	// 의무납입개월수
		$("#cmbOblgPym").val(oblgPymMtcnt);
	};


	/*
	 * 월납기준보험료 , 할인후보험료 를 계산하기 위한 로직
	 */
	function setMhypymStdprmRealPyprm(_callback){
		// 초기화 없으면 undefinde 에러 남
		gDS['DS_UD_INCT_INTP'] 		= [];	// 계약관계자
		gDS['DS_UD_NTPRD'] 			= [];	// 가입상품
		gDS['DS_UD_Ntprt_Tmp'] 		= [];	// 가입상품

		// 월납기준보험료 와 할인후보험료를 값을 구하기 위해 미리 태움
		setUdInctIntp(); // 계약관계자 정보를 맞춘다. (심사시 사용하는 Dataset을 미리 구성 )
		setUdNtprd("DS_UD_NTPRD");
		
		var uptPsbyYn 			= (gDS['DS_QTT_PRD'].length > 0) ? gDS['DS_QTT_PRD'][0].ANTY_SWT_APPL_YN : "";  				// 연금전환여부
		var antyOpnAge 			= (gDS['DS_QTT_OTR_INF'].length > 0) ? gDS['DS_QTT_OTR_INF'][0].ANTY_OPN_AGE : "";  			// 연금개시나이
		var antySwtDfrmPrid 	= (gDS['DS_QTT_OTR_INF'].length > 0) ? gDS['DS_QTT_OTR_INF'][0].ANTY_SWT_DFRM_PRID : "";  		// 연금전환거치기간
		var dcMetdSlcCod 		= (gDS['ds_ProdtTypeMtt'].length > 0) ? gDS['ds_ProdtTypeMtt'][0].DC_METD_SLC_COD : "";  		// 고액할인방법코드
		var chdAdDcMetdSlcCod 	= (gDS['ds_ProdtTypeMtt'].length > 0) ? gDS['ds_ProdtTypeMtt'][0].CHD_AD_DC_METD_COD : "";  	// 다자녀할인방법코드
		var oblgPymMtcnt 		= (gDS['ds_OblgPymMtcntMtt'].length > 0) ? gDS['ds_OblgPymMtcntMtt'][0].OBLG_PYM_MTCNT : "";  	// 의무납입개월수

		gDS['ds_ProdtTypeMtt'][0].PDT_ATRB_COD;

		var remote = convertUtil.getRemoteObj('FG_NtryCdtBcseNtryDgn', 'EXE');
			
		for(var x in gDS["DS_UD_INCT_INTP"]){
			gDS["DS_UD_INCT_INTP"][x].DTH_BNFC_RTO = "";
			gDS["DS_UD_INCT_INTP"][x].PELGRD = "";
			gDS["DS_UD_INCT_INTP"][x].RFU_CD = "";
			gDS["DS_UD_INCT_INTP"][x].DIAG_CD = "";
		}

		convertUtil.setRowArray(remote, 'dw_Inct_intp', gDS["DS_UD_INCT_INTP"].filter(function(o){if(/11|21/.test(o.INCT_INTPSCTN))return true;}));	// 고객정보
		
		remote.inDataSet.dw_Inct_intp.forEach(function(o){if (o.MAIPSN_RLP == '') o.MAIPSN_RLP = '1'; });
		
		gDS["DS_UD_NTPRD"][0].DTH_BNFC_RTO = "";

		convertUtil.setRowArray(remote, 'dw_Ntprd',		gDS["DS_UD_NTPRD"]);		// 가입상품
		convertUtil.setRowArray(remote, 'dw_VarMtt', 	gDS['DS_QTT_FUND_INF']);	// 변액사항
		convertUtil.setRowArray(remote, 'dw_AntyMtt', 	gDS['DS_QTT_ANTY_INF']);	// 연금사항

		var arg = {
			  remote 				: remote	
			, 'sUd_Sctn' 			: '10'	// 심사구분
			, 'sUd_Ymd' 			: gVAL.stdYmd
			, 'sPoymd' 				: gVAL.stdYmd
			, 'sIndv_Grp' 			: '1'	// 개인: 1, 단체: 2
			, 'sWinsu' 				: '0'	// 단체취급여부
			, 'sChnCod'				: D.global.getUserInfo('chncod')
			, 'sHqCod'				: D.global.getUserInfo('hqcod')
			, 'sBzgrpCod'			: D.global.getUserInfo('beofccod')
			, 'sBrofcCod'			: D.global.getUserInfo('brofccod')
			, 'sCol_Plar_Empno' 	: D.global.getUserInfo('empno')		// 모집설계사번
			, 'sDlfg_Empno' 		: D.global.getUserInfo('empno')		// 처리사번
			, 'sCrtn_Dlng_Yn' 		: '0'	// 확정처리여부
			, 'sMaiPrdcdPremModYn' 	: '0'	// 주상품보험료변경여부
			, 'sPremClapdSecdChkYn' : '0'	// 보험료보험금역산구분체크여부
			, 'sUptSecd' 			: '1'	// 심사 0, 계산 1
			, 'sTmpPlarYn' 			: D.global.getUserInfo('csrlesecd') == '8' ? '1' : '0'	// 임시설계사여부
			, 'sAntySwtDfrmPrid' 	: uptPsbyYn == '1' ? antySwtDfrmPrid : '0'// 연금전환거치기간
			, 'sAntyOpnAge'			: uptPsbyYn == '1' ? antyOpnAge : ''	// 연금개시나이
			, 'sDcMetdSlcCod' 		: dcMetdSlcCod		// 고액할인방법코드
			, 'sChdAdDcMetdSlcCod' 	: chdAdDcMetdSlcCod	// 다자녀 할인 방법코드
			, 'sSmartYn'	 		: '1'
			, 'sOblg_Pym_Mtcnt'		: oblgPymMtcnt // 의무납입개월수
			, 'sOageWelDgnCaptRto'	: '' // 노후설계자금비율
			, 'sChdNcse'			: '' // 다자녀할인 자녀수
			, 'sAvgPtilIvst'		: $.isEmptyObject(gDS['DS_QTT_ANTY_INF']) ? '' : '0' // 변액상품일경우
																							// 0
		}
		
		console.log("arg>>", arg);

		D.http.ajax('/sw/swAllCC', arg).then(function(data){

			if(data.errorMsg){
				dialog.alert(data.text);
				return false;
			}

			D.logger.debug('합계보험료 산출 : ' , data);
			if (data.errorCode) {
				if (data.id) dialog.alert(data.text);
				return false;
			}
			
			data = data.remoteResult.outDataSet; // 2022-04-15 보장내역 추가
			
			if("FI" == gDS["DS_UD_NTPRD"][0].PRDCD.substring(0,2)){
				
			}else{
				// 월납기준보험료와 할인후보험료를 세팅한 후 심사 정보는 삭제
				gDS["DS_UD_INCT_INTP"]  = [];
				gDS["DS_UD_NTPRD"] 		= [];

				
				
				var premObj = dcUtil.getCalcPrem(data.dw_DcKncdInf.data, data.dw_Calc_prem.data[0]);
				gVAL.g_remObj = premObj;
				gVAL.g_remObj.CRNC_KND = data.dw_Ntprd.data[0].CRNC_KND;
			}
			
			// 2022-04-15 보장내역 추가
			gDS["dw_GnPtcl"] = data.dw_GnPtcl.data;
			

			D.logger.debug('합계보험료 data : ' , premObj);
			// realPyprm : 할인후 보험료 , mhypymPrem : 월납기준보험료
			
			if(!stringUtil.isNull(_callback)){
				_callback();
			}
		});
	};


	/**
	 * 심사,저장용 계약관계자 정보 SET
	 */
	function setUdInctIntp() {
		/**
		 * TODO: validate (앞으로 옮겨야 할듯!)
		 */
		// gDS['DS_UD_INCT_INTP'] 세팅
		
		$.each(gDS['DS_CTR_INTP_MTT_LIST'], function(mttIdx, row){
			// if((null != row.RES_REG_NO) && (undefined != row.RES_REG_NO) &&
			// ('undefined' != row.RES_REG_NO)){
				gDS['DS_UD_INCT_INTP'].push({
					"INCT_INTPSCTN": row.CTR_RLE_SECD,		// 계약관계자구분
					"RES_REG_NO": row.RRN,					// 주민번호
					"CS_NAM": row.CS_NAM,					// 고객명
					"CSID": "",								// 고객PK
					"CHN_CSID": row.CS_PK,					// 채널고객PK
					"XCLCLV_YN": row.XCLCLV_APPL_YN,		// 우량피보험체여부
					"MAIPSN_RLP": row.CS_RLP_SECD,			// 주피와의관계
					"AGE": row.PRCMPAG,						// 보험나이
					"FUL_AGE": "",							// 만나이
					"GENDER": row.GNDR_SECD,				// 성별
					"DTH_BNFC_RTO": row.PYMRT,				// 사망수익자비율
					"OCPT_KND": row.CPCD,					// 직업코드
					"OCPT_PEL_GRDE_COD": row.OCPT_PEL_GRDE_COD,			// 직업위험등급
					"OCPT_INJ_PEL_GRDE_COD": row.OCPT_INJ_PEL_GRDE_COD,	// 직업상해등급
					"DRVG_SECD": row.DRVG_SECD,							// 운전코드
					"DRVG_PEL_GRDE_COD": row.DRVG_PEL_GRDE_COD,			// 운전위험등급
					"HMBD_OBS_COD": row.OBS_GRDE_COD,					// 장애등급코드
					"NATAL_SECD": row.NATAL_SECD,						// 국적코드
					"STY_COD": row.STY_COD,								// 체류코드
					"MAIG_RVPL": '11' == row.CTR_RLE_SECD ? gData.cmbMaigRvpl : "",	// 우편물수령지
					"INSPO_RVPL": '11' == row.CTR_RLE_SECD ? gData.cmbInspoRvpl : "",	// 증권수령지
					"PBLS_YMD": row.PBLS_YMD,		// 발급일자
					"STY_PRID": row.STY_PRID,		// 체류기간
				});
			// }
			
				debugger;
			var sIntpExist = 'N';
			if ('1' == row.CTR_RLE_SECD.substring(0,1) || '4' == row.CTR_RLE_SECD.substring(0,1)) {
				if (!stringUtil.isNull(gDS['DS_UD_INCT_INTP_AML'])) {
					var aml = $.grep(gDS['DS_UD_INCT_INTP_AML'], function(p){if(p.RES_REG_NO == gDS['DS_CTR_INTP_MTT_LIST'][mttIdx].RRN)return true;} );
					if (aml.length > 0) sIntpExist = 'Y';
				}
				if ('N' == sIntpExist) {	// 위에서 push한 DS_UD_INCT_INTP의 데이터를
											// 복사하여 DS_UD_INCT_INTP_AML에 push
					gDS['DS_UD_INCT_INTP_AML'].push($.extend({},gDS['DS_UD_INCT_INTP'][mttIdx]));
				}
			}
		});
	};


	/*
	 * 심사시 필요한 수금방법코드를 [피보험자]가 설계사 인지 아닌지를 판단 하여 세팅
	 */
	function autoSetCtmnMetdCod(){

		var plarNam = gDS["DS_MAI_INF"][0].COL_PLAR_NAM;
		var plarRrs = gDS["DS_MAI_INF"][0].COL_PLAR_RRS;

		// 계약관계자에 모집인이 있으면 계속입금방법은 급여이체만 가능
		for (var i = 0; i < gDS["DS_CTR_INTP_MTT_LIST"].length; i++) {
			
			if ('10' == D.global.getUserInfo('chndtlcd') || '50' == D.global.getUserInfo('chndtlcd')) {// 내근,fc설계사만
				if(gDS["DS_CTR_INTP_MTT_LIST"][i].CTR_RLE_SECD == '11'){
					if (gDS["DS_CTR_INTP_MTT_LIST"][i].CS_NAM == plarNam) { 
						var isRrnMatchParam = {
								"rrn": gDS["DS_CTR_INTP_MTT_LIST"][i].RRN,
								"remote": {}
							};
						D.http.ajax("/sw/isRrnMatch", isRrnMatchParam)
						.then(function(isMatch) {
							if (isMatch.result == true || isMatch.result == 'true') {
								gVAL.fcYN = true;
							}
						});
					}
				}
			}
		}
	};

	// 소득공제 체크하기
	function checkInCdu() {
		var objDS= gDS['DS_NTPRD_MTT'];
		var objDSMTT= gDS['ds_NtprdMtt'];
		var re = "";
		var incdu = "";
		
		if(objDS != null) {
			for(var i=0; i<objDS.length; i++)
			{
				if( objDS[i].CHK == "1"){
					re = objDS[i].PRDCD ;
					for (var j = 0; j < objDSMTT.length; j++) {
						if (objDSMTT[j].PRDCD == re) {
							if(objDSMTT[j].INCDU_TYP_COD == "1"){
								incdu = "1"
							}
						}
					}
				}
			}
		}
		
		if(incdu == "1"){
			$("#divDis").show();
		}else{
			$("#divDis").hide();
		}
	};

	/*
	 * 주소 테이터 세팅
	 */ 
	function setAddrInfo(){
		var nRow = gDS["DS_CTR_INTP_MTT_LIST"].findIndex( function(o){if(o.CTR_RLE_SECD == "11")return true;} );
		
		var ctrRleSecd = gDS["DS_CTR_INTP_MTT_LIST"][nRow].CTR_RLE_SECD;
		var sCsNam = gDS["DS_CTR_INTP_MTT_LIST"][nRow].CS_NAM;
		var sCsRrn = gDS["DS_CTR_INTP_MTT_LIST"][nRow].RRN;
		var sCsPk = gDS["DS_CTR_INTP_MTT_LIST"][nRow].CS_PK;
		inq_susCsAddr(ctrRleSecd, sCsNam, sCsRrn, sCsPk, function(){
			
			var nRow = gDS["DS_CTR_INTP_MTT_LIST"].findIndex(function(o){if(o.CTR_RLE_SECD == "21")return true;});
			var ctrRleSecd = gDS["DS_CTR_INTP_MTT_LIST"][nRow].CTR_RLE_SECD;
			var sCsNam = gDS["DS_CTR_INTP_MTT_LIST"][nRow].CS_NAM;
			var sCsRrn = gDS["DS_CTR_INTP_MTT_LIST"][nRow].RRN;
			var sCsPk = gDS["DS_CTR_INTP_MTT_LIST"][nRow].CS_PK;
			inq_susCsAddr(ctrRleSecd, sCsNam, sCsRrn, sCsPk);
		});
	};


	function inq_susCsAddr(a_ctrRleSecd, a_csNam, a_csnum, a_chn_cs_pk, _callback) {
	    var nRrn, tRrn;
	    nRrn = gDS["DS_CTR_INTP_MTT_LIST"].find( function(o){if(o.CTR_RLE_SECD == a_ctrRleSecd)return true;} ).RRN;
	    
	    if (a_ctrRleSecd == "11") {
	        if (nRrn == "1111111111111") {
	        	gDS["DS_ADDR_POHD"] = [];
	            gDS["DS_ADDR_POHD_NEW"] = [];
	            call_setCsAddr(gDS["DS_ADDR_POHD"], "DS_ADDR_POHD_VW");
	            return;
	        } else {
	            tRrn = gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == "21")return true;}).RRN;
	            if (nRrn == tRrn) {
	                if (gDS["DS_ADDR_MAIPSN"].length > 0) {
	                	$.extend(true,gDS["DS_ADDR_POHD"] ,gDS["DS_ADDR_MAIPSN"]);
	                    call_setCsAddr(gDS["DS_ADDR_POHD"], "DS_ADDR_POHD_VW");
	                    return;
	                }
	            }
	        }
	    } else if (a_ctrRleSecd == "21") {
	        if (nRrn == "1111111111111") {

	            gDS["DS_ADDR_MAIPSN"] = [];
	            gDS["DS_ADDR_MAIPSN_VW"] = [];
	            call_setCsAddr(gDS["DS_ADDR_MAIPSN"], "DS_ADDR_MAIPSN_VW");
	            return;
	        } else {
	            tRrn = gDS["DS_CTR_INTP_MTT_LIST"].find( function(o){if(o.CTR_RLE_SECD == '11')return true;} ).RRN;
	            if (nRrn == tRrn) {
	                if (gDS["DS_ADDR_POHD"].length > 0) {
	                	$.extend(true, gDS["DS_ADDR_MAIPSN"], gDS["DS_ADDR_POHD"]);
	                    call_setCsAddr(gDS["DS_ADDR_MAIPSN"], "DS_ADDR_MAIPSN_VW");
	                    return;
	                }
	            }
	        }
	    }

	    var param = {};
	    param.STR_SECD="1";
	    param.CTR_RLE_SECD=a_ctrRleSecd ;
	    param.CSNUM=a_csnum;
	    param.CS_NAM=a_csNam;
	    param.CHN_CS_PK=a_chn_cs_pk;
	    param.PLAR_NUM=gVAL.plarNo;
	    param.REQ_SYS="SFA"
	   
	    var remote = convertUtil.getRemoteObj('FG_SusInp', 'UDQ03');
	   	param.remote = remote;
	   
	   	D.http.ajax('/sw/swAllCC', param).then(function(result){
	   		var mapDsName;

	   		/*
			 * DS 가 가변으로 넘어 와서 따로 처리 빈값을 덮어 씌우는 경우가 생겨서.
			 */
	   		
	   		if(!stringUtil.isNull(result.remoteResult.outDataSet.DS_POHD)){
	   			gDS["DS_ADDR_POHD"] = result.remoteResult.outDataSet.DS_POHD.data;
	   		}

			if(!stringUtil.isNull(result.remoteResult.outDataSet.DS_POHD_NEW)){
				gDS["DS_ADDR_POHD_NEW"] = result.remoteResult.outDataSet.DS_POHD_NEW.data;
			}   		

			if(!stringUtil.isNull(result.remoteResult.outDataSet.DS_MAIPSN)){
				gDS["DS_ADDR_MAIPSN"] = result.remoteResult.outDataSet.DS_MAIPSN.data;
			}

			if(!stringUtil.isNull(result.remoteResult.outDataSet.DS_MAIPSN_NEW)){
				gDS["DS_ADDR_MAIPSN_NEW"] = result.remoteResult.outDataSet.DS_MAIPSN_NEW.data;
			}

			// 계약자
			if (gDS["DS_ADDR_POHD"].length > 0) {
				// np_ShowDataset(DS_ADDR_POHD);
				call_setCsAddr(gDS["DS_ADDR_POHD"], "DS_ADDR_POHD_VW");
			} 
			
			// 주피
			if (gDS["DS_ADDR_MAIPSN"].length > 0) {
				// np_ShowDataset(DS_ADDR_MAIPSN);
				call_setCsAddr(gDS["DS_ADDR_MAIPSN"], "DS_ADDR_MAIPSN_VW");
				// isAddrEmp = false;
			}

			if(!stringUtil.isNull(_callback)){
				_callback();
			}
	   	});
	};


	function call_setCsAddr(a_scr_DS, a_tgt_DS) {
	    var val1, val2, val3, strVal;
	    var fix = new Array(2);
	    var nRow, bzSecd;
	    var isAddrEmp = true;
	    a_tgt_DS = gDS[a_tgt_DS];
	    a_tgt_DS.push({});
	    fix[0] = "MBS_";
	    fix[1] = "CHN_";
	    for (var i = 0; i < 2; i++) {
	        bzSecd = String(i + 1);
	        a_tgt_DS[0][fix[i] + "CS_PK"] = stringUtil.isNull(a_scr_DS.find(function(o){if(o.BZ_SECD == bzSecd)return true;}) )?  ""  : a_scr_DS.find(function(o){if(o.BZ_SECD == bzSecd)return true;}).CS_PK;
	        
	        nRow = fnct_findAddrRow(a_scr_DS, bzSecd, "5", "2");
	        if (nRow >= 0) {
	            strVal = "[" + a_scr_DS[nRow].ZCD + "] ";
	            strVal += a_scr_DS[nRow].GTED_ADR + " ";
	            strVal += a_scr_DS[nRow].LSTD_ADR;
	            isAddrEmp = false;
	        } else {
	            strVal = "";
	        }
	        a_tgt_DS[0][fix[i] + "HOM_ADR"] = strVal;
	        nRow = fnct_findAddrRow(a_scr_DS, bzSecd, "5", "3");
	        if (nRow >= 0) {
	            strVal = a_scr_DS[nRow].TEL_AR_NUM + "-";
	            strVal += a_scr_DS[nRow].TEL_GUK_NUM + "-";
	            strVal += a_scr_DS[nRow].TEL_SEQ;
	        } else {
	            strVal = "";
	        }
	        a_tgt_DS[0][fix[i] + "HOM_TEL"] = strVal;
	        nRow = fnct_findAddrRow(a_scr_DS, bzSecd, "6", "2");
	        if (nRow >= 0) {
	            strVal = "[" + a_scr_DS[nRow].ZCD + "] ";
	            strVal += a_scr_DS[nRow].GTED_ADR + " ";
	            strVal += a_scr_DS[nRow].LSTD_ADR;
	            isAddrEmp = false;
	        } else {
	            strVal = "";
	        }
	        a_tgt_DS[0][fix[i] + "CO_ADR"] = strVal;
	        nRow = fnct_findAddrRow(a_scr_DS, bzSecd, "6", "3");
	        if (nRow >= 0) {
	            strVal = a_scr_DS[nRow].TEL_AR_NUM + "-";
	            strVal += a_scr_DS[nRow].TEL_GUK_NUM + "-";
	            strVal += a_scr_DS[nRow].TEL_SEQ;
	        } else {
	            strVal = "";
	        }
	        a_tgt_DS[0][fix[i] + "CO_TEL"] = strVal;
	        nRow = fnct_findAddrRow(a_scr_DS, bzSecd, "", "22");
	        if (nRow >= 0) {
	            strVal = a_scr_DS[nRow].TEL_AR_NUM + "-";
	            strVal += a_scr_DS[nRow].TEL_GUK_NUM + "-";
	            strVal += a_scr_DS[nRow].TEL_SEQ;
	        } else {
	            strVal = "";
	        }
	        a_tgt_DS[0][fix[i] + "HPHN_TEL"] = strVal;
	        nRow = fnct_findAddrRow(a_scr_DS, bzSecd, "", "23");
	        if (nRow >= 0) {
	            strVal = a_scr_DS[nRow].EMAL_ID_NAM + "@";
	            strVal += a_scr_DS[nRow].DMN_NAM;
	        } else {
	            strVal = "";
	        }
	        a_tgt_DS[0][fix[i] + "EMAIL"] = strVal;
	    }
	};

	function fnct_findAddrRow(a_DS, a_bzSecd, a_cntadBlnSecd, a_cntadSecd) {
	    var cnt;
	    var row = -1;
	    cnt = a_DS.length;
	    for (var i = 0; i < cnt; i++) {
	        if (a_DS[i].BZ_SECD == a_bzSecd) {
	            if (stringUtil.isNull(a_cntadBlnSecd)) {
	                if (a_DS[i].CNTAD_SECD == a_cntadSecd) {
	                    row = i;
	                    break;
	                }
	            } else {
	                if (a_DS[i].CNTAD_BLN_SECD == a_cntadBlnSecd && a_DS[i].CNTAD_SECD == a_cntadSecd) {
	                    row = i;
	                    break;
	                }
	            }
	        }
	    }
	    return row;
	};

	/*
	 * 상품정보 셋팅
	 */
	function fnct_susSetPdtLst(){
		/*
		 * 상품정보 구성 ------------------------------------------------------------
		 * 인걸 대리가 "심사" 처리 할 때 아래 형식으로 사용함
		 */
		gDS['DS_MPRD_SECD'] 	= $.grep(gDS['DS_SUS_PDT_SECD'], 	function(p){if(p.PDT_SECD 	== gDS["DS_QTT_BAS"][0].MPRD_PDT_SECD)return true;} ); 	 // 상품구분
		gDS['DS_MPRD_RPSPDT'] 	= $.grep(gDS['DS_SUS_RES_PRDCD'], 	function(p){if(p.PRDCD 		== gDS["DS_QTT_BAS"][0].RPS_PRDCD)return true;});	 	 // 대표상품
		gDS['DS_MPRD_PDT'] 		= $.grep(gDS['DS_SUS_MAI_PRDCD'], 	function(p){if(p.PRDCD 		== gDS["DS_QTT_BAS"][0].MPRD_PRDCD)return true;});		 // 주상품
		
		gVAL.cmbPdtSecd 		= 	gDS["DS_QTT_BAS"][0].MPRD_PDT_SECD		// 상품구분
																			// cod
		gVAL.cmbRpsPrdcd 		= 	gDS["DS_QTT_BAS"][0].RPS_PRDCD			// 대표상품
																			// cod
		gVAL.cmbPrdcd 			= 	gDS["DS_QTT_BAS"][0].MPRD_PRDCD			// 주상품
																			// cod
	};

	// 모집설계사 정보 세팅 (즉 로그인한 이용자의 정보 )
	function init_ctrIntp() {
		var obj_userInfo =  D.global.getUserInfo(); 
		gDS["DS_MAI_INF"] = [];
		gDS["DS_MAI_INF"].push({});
		var nRow = gDS["DS_MAI_INF"].length-1;
		gDS["DS_MAI_INF"][nRow].COL_PLAR_CS_PK 		=  	obj_userInfo.cspk;
		gDS["DS_MAI_INF"][nRow].COL_PLAR_CS_RLE_PK 	= 	obj_userInfo.csrlepk;
		gDS["DS_MAI_INF"][nRow].COL_PLAR_NUM 		=   obj_userInfo.empno;
		gDS["DS_MAI_INF"][nRow].COL_PLAR_RRS 		=   obj_userInfo.csnum;
		gDS["DS_MAI_INF"][nRow].COL_PLAR_NAM 		=   obj_userInfo.username;
		gDS["DS_MAI_INF"][nRow].COL_PLAR_BROFC 		=   obj_userInfo.brofccod; 
		gDS["DS_MAI_INF"][nRow].COL_PLAR_BROFC_NAM 	=  	obj_userInfo.brofcnam;
		gDS["DS_MAI_INF"][nRow].COL_PLAR_BZGR 		=   obj_userInfo.bzgrpcod;
		gDS["DS_MAI_INF"][nRow].COL_PLAR_BZGR_NAM 	=  	obj_userInfo.bzgrpnam;
		gDS["DS_MAI_INF"][nRow].COL_PLAR_CHN 		=   obj_userInfo.chncod;
		gDS["DS_MAI_INF"][nRow].COL_PLAR_HQ 		=   obj_userInfo.hqcod;

		/* check */
		if(!stringUtil.isNull(gDS["DS_QTT_BAS"])){ 
			gDS["DS_MAI_INF"][nRow].COL_PLAR_HQ =   "";
			gDS["DS_MAI_INF"][nRow].CS_NAM 		=   gDS["DS_QTT_BAS"][0].MAI_CS_NAM;
			gDS["DS_MAI_INF"][nRow].CS_RRN 		=   gDS["DS_QTT_BAS"][0].MAI_CS_NUM;
		}
		
		
		authUtil.getPhoneNumberByEmpNoNice(obj_userInfo.empno)
		.then(function(authReturn){
		
			var cpSecd = authReturn.CP_SECD;
			var telGukNum = authReturn.TEL_GUK_NUM;
			var telSeq = authReturn.TEL_SEQ;
			
			fcTel =  cpSecd+telGukNum+telSeq;
			fcTelS = cpSecd+ "-" + telGukNum + " - " + telSeq;
		});
	};
	
	/**
	 * KYC 수행자 정보 세팅
	 */
	function init_kycExctInf() {
		gDS["DS_KYC_EXCT_INF"] = [];
		
		D.http.ajax('/sw/getKycExctorStgupInf').then(function(result) {
			gDS["DS_KYC_EXCT_INF"] =  result.remoteResult.outDataSet.DS_FG_KYC_EXCTOR_GA.data;
		});
	}

	
	/**
	 * 청약정보 조회 (this.inq_getSusCtt)
	 * 
	 * @param: pSusNum(청약번호)
	 * @description: 기존 청약입력 했던 정보들을 조회
	 */
	function fnInqGetSusCtt(pSusNum) {
		
		console.log("222222222222 fnInqGetSusCtt");
		
		// 청약정보 조회 :: arguments SET
		var args = {
			"INQ_SUSNUM": pSusNum,			// 청약번호
			"INQ_SECD"  : gVAL.loadMode,	// S : 청약수정
			"REQ_SYS"   : gVAL.reqSys,
			"CTYMD" 	: dateUtil.getDate(),
			"remote"    : convertUtil.getRemoteObj("FG_SusInp", "IQY")
		};

		// 통신
		D.http.ajax('/su/mblSus/getSusInpDtlInf', args)
		.then(function(result) {
			if(result.errorMsg){
				dcUtil.g_showMessage("CCCI0027", result.text, function(){
			      	D.move.back();	// 뒤로가기
			     });
				return false; 
			}


			if (result.remoteResult) { 
				/**
				 * 기존 ASIS는 화면DS와 서버DS명이 달랐기때문에 서버DS명을 화면DS명으로 교체해줘야 함. 서버DS명 :
				 * '화면DS명'
				 */
				var mapDsName = {
					DS_SUS_PREM_DC_LST: 	'DS_UD_DC_KNCD_INF',   // 서버DS명 :
																	// '화면DS명'
					DS_SUS_ANTY_APPL: 		'DS_QTT_ANTY_INF',
					DS_SUS_FUND_INF: 		'DS_QTT_FUND_INF',
					DS_SUS_FUND_WKG_INF: 	'DS_QTT_FUND_WKG_INF',
					DS_SUS_FUND_INF: 		'DS_QTT_FUND_INF',
					DS_SUS_INSCT_PDT: 		'DS_QTT_PRD',
					DS_SUS_ATCD_DOC: 		'DS_UD_ATCD_DOC',
					DS_SUS_JNT_PSBY: 		'DS_JNT_PLAR',
					DS_SUS_PDT_PRODT_TYPE: 	'ds_ProdtTypeMtt',
					DS_SUS_PDT_CTR_INTP: 	'ds_CtrIntpMtt',
					DS_SUS_PDT_ANTY: 		'ds_AntyMtt',
					DS_SUS_PDT_VAR: 		'ds_VarMtt',
					DS_SUS_PDT_NTPRD: 		'ds_NtprdMtt',
					DS_SUS_PDT_PYPD: 		'ds_Pypd',
					DS_SUS_PDT_PYCYC: 		'ds_Pycyc',
					DS_SUS_PDT_CTMN: 		'ds_CtmnMtt',
					DS_SUS_PDT_OBLG_PYM: 	'ds_OblgPymMtcntMtt',
					DS_SUS_PDT_PREGN: 		'ds_PregnMtt',
					DS_SUS_PDT_GOL_PRFR: 	'ds_GolPrfrMtt',
					DS_SUS_PDT_PREM_SMASD: 	'ds_PremSmasdMtt',
					DS_SUS_PDT_DCLO: 		'ds_DcloMtt',
					DS_SUS_CTYMD: 			'DS_CMB_CTYMD',
					dw_DstnPxClmr: 			'DS_DSTN_PX_CLMR',		// 지정대리청구인정보
					dw_DspsInsSwtAppl:      'ds_DspsInsSwtAppl',	// 장애인 조회 값
																	// 추가 필요
				    ds_pdtSalChnInf:		'ds_pdtSalChnInf',		// 상품판매채널정보
				    ds_jijungInf:			'ds_jijungInf',			// 지정대리청구인
																	// 제도성특약
																	// 상품정보
			    	ds_SusAntyAdInf:		'ds_SusAntyAdInf'		// 청약연금가산정보
				};

				/*
				 * 청약 재 조회시 필요
				 */
				gDS["DS_CTR_INTP_MTT_LIST"]  	=  	[]; // 초기화
				gDS["DS_DSTN_CS_LIST"]  		=  	[]; // 초기화 (지정대리청구인)
				gDS["DS_DSTN_PX_CLMR_POP"]  	=  	[]; // 초기화 (지정대리청구인)
				gDS["DS_CMB_CS_LIST"]  			=  	[]; // 초기화 (지정대리청구인)
				gDS["DS_UD_INCT_INTP_AML"] 		= 	[];
				gDS["DS_PYPD_TEMP"]  			=  	[]; 
				gDS["DS_TMP"] 					=	[];
				gDS["DS_NTPRD_PYCYC"] 			=	[];
				gDS["ds_PdtTrmins_Pk"] 			=	[];
				gDS["DS_UD_DC_KNCD_INF"] 		=	[];		
				gDS["DS_SUS_CTR_INTP"] 			= 	[];
				gDS["DS_UD_NTPRD"] 				= 	[];
				gDS["DS_OTR_INF_MNBD"] 			= 	[];
				gDS["DS_OTR"] 					= 	[];
				gDS["DS_MAI_INF"] 				= 	[];
				gDS["DS_PREM_PYPRM"] 			= 	[];
				gDS["DS_SUS_PLYNO"] 			= 	[];
				gDS['DS_ANTY_MTT'] 				= 	[];
				gDS['DS_ADDR_MAIPSN'] 			= 	[];
				gDS['DS_ADDR_POHD'] 			= 	[];
				gDS['DS_ADDR_POHD_VW'] 			= 	[];
				gDS['DS_ADDR_MAIPSN_VW'] 		= 	[];
				gDS['G_OP_Auth'] 				= 	[]; 
				gDS['G_Task_Auth'] 				= 	[];
				gDS['DS_DSTN_PX_CLMR_INF'] 		= 	[];
				gDS['ds_pdtSalChnInf']			=   [];
				gDS['ds_jijungInf']				=   [];
				gDS['ds_SusAntyAdInf']			=	[];
				
				// 결과 DS 세팅
				fnSetGlobalDs(result.remoteResult.outDataSet, mapDsName);
				
				// self uw 세팅
				gVAL.selfUw = result.remoteResult.paramMap.selfUw;
				
				// 청약일자 날짜제어
				getArrDS_CMB_CTYMD();
				
				// 이력데이터 처리
				setHist(result.remoteResult.outDataSet.MFGS_SUS_INP_HIS.data);
				

				// 연금고정상품정보 copy
				gDS['DS_ANTY_FIX_PDT_INF'] = $.extend([], gDS['dw_AntyFixPdtInf']);

				// DS_UD_Ntprt_Tmp 세팅
				fnSetAdPdt(gDS['DS_QTT_PRD']);

				// 청약정보 세팅 장애인 조회값 세팅하기
				fnInqGetSusCttCallBack();
				
				// 계약관계자
				setCtrIntpMttForData();
				
				// KYC 수행자 정보 세팅
				init_kycExctInf();
				
				// 상품데이터
				getNtMttInfo(callBack_ntMttInfo_sus);
				
			} else {
				D.logger.error('통신 중 에러가 발생했습니다. 에러메세지코드 [' + (result.errorMsg || '') + ']');
				dialog.handLoading(false);
				return false; 
			}
		});
		return true;
	};


	/**
	 * DS_UD_Ntprt_Tmp 세팅
	 */
	function fnSetAdPdt(targetDS) {
		// DS_QTT_PRD 로 뭔가를 세팅?

		gDS['DS_UD_Ntprt_Tmp'] = [];	// DS_UD_Ntprt_Tmp DS는 임시이기 때문에 다른 채널에서는
										// 다르게 구현할 수도 있다
		
		if ($.grep(targetDS, function(p){ if('5' == p.GDS_SECD || '5' == p.PDT_RLPCD)return true; }).length > 0) {
			gDS['DS_UD_Ntprt_Tmp'] = $.extend([], targetDS);
		}

		var isPass = false;
		$.each(targetDS, function(idx, row){
			if (!row.hasOwnProperty('GDS_SECD') && row.hasOwnProperty('PDT_RLPCD') && '5' == row.PDT_RLPCD) {
				isPass = true;
			}
		});

		if (isPass) {
			/**
			 * DB조회 후 호출시 컬럼명 변경 PDT_RLPCD -> GDS_SECD ORG_PRDNM : ds_NtprdMtt
			 * 에서 PRDNM 찾아서 설정 TTRMINS_UNT_COD -> RMINS_SCTN PYPD_UNT_COD ->
			 * PYPD_SCTN PYCYC_COD -> PYCYC SMASD -> SMSU GSPRE -> CFINSU_PREM
			 */
			 // 컬럼추가
			$.each(gDS['DS_UD_Ntprt_Tmp'], function(idx, row){
				$.extend(row, {
					GDS_SECD: '',
					TRMINS_SCTN: '',
					PYPD_SCTN: '',
					PYCYC: '',
					SMSU: '',
					CFINSU_PREM: ''
				});
			});

			var chnKey = '';
			$.each(gDS['DS_UD_Ntprt_Tmp'][0], function(key, val){
				if ('PDT_RLPCD' == key) {
					chnKey = 'GDS_SECD';
				} else if ('TRMINS_UNT_COD' == key) {
					chnKey = 'TRMINS_SCTN';
				} else if ('PYPD_UNT_COD' == key) {
					chnKey = 'PYPD_SCTN';
				} else if ('PYCYC_COD' == key) {
					chnKey = 'PYCYC';
				} else if ('SMASD' == key) {
					chnKey = 'SMSU';
				} else if ('GSPRE' == key) {
					chnKey = 'CFINSU_PREM';
				}
				
				if ('' != chnKey) {
					$.each(gDS['DS_UD_Ntprt_Tmp'], function(idx, row){
						row[chnKey] = row[key];
					});
				}
			});
		}		
		
	};
	
	/**
	 * 청약정보 세팅
	 * 
	 * @description: 조회된 청약 정보를 세팅한다.
	 */
	function fnInqGetSusCttCallBack() {
		var scbInfo = gDS['DS_SUS_CTR_BAS'][0];		// 조회된 청약계약기본 정보
		if (stringUtil.isNull(scbInfo)) {   
			return false;
		}

		var gMiDS = {};
		var gSpDS = {};		


		// * 주고객 --------------------------------------------------------------
		gMiDS.CS_NAM 	= scbInfo.MAI_CS_NAM;	// 주고객명
		gMiDS.CS_RRN 	= scbInfo.MAI_CS_RRN;	// 주고객주민번호
		gMiDS.PLYNO 	= scbInfo.PLYNO;		// 증권번호
		gMiDS.COL_ROT 	= scbInfo.SUSNUM;		// 청약서번호

		// 글로벌 값 SET
		gVAL.csNam = scbInfo.MAI_CS_NAM;
		gVAL.csnum = scbInfo.MAI_CS_RRN;
		gVAL.plyNo = scbInfo.PLYNO;
		
		// * 증권청약번호 ---------------------------------------------------------
		gSpDS.PLYNO  	= scbInfo.PLYNO;			
		gSpDS.SUSNUM	= scbInfo.SUSNUM;
		

		// * 설계사(모집인) --------------------------------------------------------
		var l_fnTmpSetDs = function(pPre, pData){
			if (stringUtil.isNull(pData)) { return };
			gMiDS[pPre + '_PLAR_CS_PK'] 	= pData.CS_PK;			// 고유번호
			gMiDS[pPre + '_PLAR_CS_RLE_PK']	= pData.CS_RLE_PK;		// 역할고유번호
			gMiDS[pPre + '_PLAR_NUM'] 		= pData.PLAR_NUM;		// 설계사번
			gMiDS[pPre + '_PLAR_RRS'] 		= pData.PLAR_RRN;		// 주민번호
			gMiDS[pPre + '_PLAR_NAM'] 		= pData.PLAR_NAM;		// 성명
			gMiDS[pPre + '_PLAR_BROFC'] 	= pData.PLAR_BROFC;		// 지점정보
			gMiDS[pPre + '_PLAR_BROFC_NAM']	= pData.PLAR_BROFC_NAM;	// 지저명
			gMiDS[pPre + '_PLAR_BZGR'] 		= pData.PLAR_BZGR;		// 사업단정보
			gMiDS[pPre + '_PLAR_BZGR_NAM'] 	= pData.PLAR_BZGR_NAM;	// 사업단명
			gMiDS[pPre + '_PLAR_CHN'] 		= pData.PLAR_CHN;		// 채널정보
			if ('COL' == pPre) {	// 주설계사
				gVAL.plarNo    = pData.PLAR_NUM;
				gVAL.plarBrofc = pData.PLAR_BROFC;
			}
		};

		l_fnTmpSetDs('COL', $.grep(gDS['DS_SUS_INSCT_PLAR'], function(p){if('51' == p.CTR_RLE_SECD)return true;})[0]);	// 주설계사
		l_fnTmpSetDs('JNT', $.grep(gDS['DS_SUS_INSCT_PLAR'], function(p){if('57' == p.CTR_RLE_SECD)return true;})[0]);	// 공동설계사
		
		gDS['DS_MAI_INF'] = [gMiDS];
		gDS['DS_SUS_PLYNO'] = [gSpDS];

		// 설계사 휴대전화번호
		authUtil.getPhoneNumberByEmpNoNice(gVAL.plarNo)
		.then(function(authReturn){
		
			var cpSecd = authReturn.CP_SECD;
			var telGukNum = authReturn.TEL_GUK_NUM;
			var telSeq = authReturn.TEL_SEQ;
			
			fcTel =  cpSecd+telGukNum+telSeq;
			fcTelS = cpSecd+ "-" + telGukNum + " - " + telSeq;
			
			
		});
		
		// * 상품조회정보 SET -------------------------------
		gDS['DS_MPRD_SECD'] = [$.grep(gDS['DS_SUS_PDT_SECD'], function(p){if(p.PDT_SECD == scbInfo.PDT_SECD)return true;})[0]];		 // 상품구분
		gDS['DS_MPRD_RPSPDT'] = [$.grep(gDS['DS_SUS_RES_PRDCD'], function(p){if(p.PRDCD == scbInfo.RPS_PRDCD)return true;})[0]];	 // 대표상품
		gDS['DS_MPRD_PDT'] = [$.grep(gDS['DS_SUS_MAI_PRDCD'], function(p){if(p.PRDCD == scbInfo.MAI_PRDCD)return true;} )[0]];		 // 주상품
		
		// 장애인 조회 주피인지 수익인지 가리기
		if( "0" != gDS['ds_DspsInsSwtAppl'].length){
			if("21" == gDS['ds_DspsInsSwtAppl'][0].CTR_RLE_SECD ){
				gDS['DS_DSPS_M'] = gDS['ds_DspsInsSwtAppl']; 	// 장애인 보험 데이터
																// 주피보험자
			
			}else{
				gDS['DS_DSPS_Y'] = gDS['ds_DspsInsSwtAppl'];    // 장애인 보험 데이터
																// 수익자
			}
		}
		
		gVAL.cmbPdtSecd 		= 	gDS['DS_MPRD_SECD'][0].PDT_SECD;		// 상품구분
																			// cod
		gVAL.cmbRpsPrdcd 		= 	gDS['DS_MPRD_RPSPDT'][0].PRDCD;			// 대표상품
																			// cod
		gVAL.cmbPrdcd 			= 	gDS["DS_MPRD_PDT"][0].PRDCD;			// 주상품
																			// cod
		gVAL.maiPrdcd = gDS['DS_MPRD_PDT'][0].PRDCD;	

		var basData = gDS['DS_SUS_CTR_BAS'][0];		// 청약계약기본정보

		// 상품합계정보
		gDS['dw_calc_prem'] = [{
			CONV_FSTM_PREM: 	basData.CONV_FTPR,		// 환산보험료
			MHYPYM_STD_PREM: 	basData.MHYPYM_STDPRM,	// 월납기준
			SUM_PREM: 			basData.SMPRM			// 초회
			
		}];
		// 납입보험료사항
		gDS['DS_PREM_PYPRM'] = [{
			SMPRM: 		basData.SMPRM,			// 1회보험료
			PDIADV: 	basData.PDIADV,			// 선납보험료
			ADPRM: 		basData.ADPRM,			// 추가납보험료
			DCAMT: 		basData.TOTL_DC_AMT,	// 총할인액
			RLPY_AMT: 	basData.REAL_PYPRM		// 실납입보험료
		}];
		
		var oSciDS = gDS['DS_SUS_CTR_INTP'];
		
		// * 계약자관계자 고객선택(DS_CS_LIST) 콤보 옵션 생성 :: 계약자, 피보험자, 법정상속인
		// ----------------------
		var infoList = dcUtil.getDupRmvArr($.grep(oSciDS,function(p){if('11' == p.CTR_RLE_SECD || '21' == p.CTR_RLE_SECD || '31' == p.CTR_RLE_SECD || '41' == p.CTR_RLE_SECD || '42' == p.CTR_RLE_SECD || ('47' == p.CTR_RLE_SECD && p.CS_PK != '1'))return true;}), 'CS_PK');	// 계/피
																																																																				// 해당
																																																																				// 정보
																																																																				// 가져오기
		
		infoList.push({
			BLN_GRP_PK:"", BRTYMD:"", CLBR_YN:"", CPCD:"", CPNM:"", CS_CFMT_DTM:"", CS_CFMT_YN:"", CS_NAM: '법정상속인', CS_PK: '1', 
			CS_RGST_METD_SECD:"", CS_RLP_SECD: '14', CS_RLP_SECD_NM:"", CS_SPEL_MTT:"", CS_STG_SECD:"", DEL_YN:"", DRVG_INJ_PEL_GRDE_COD:"", DRVG_INJ_PEL_GRDE_NAM:"",
			DRVG_PEL_GRDE_COD:"", DRVG_PEL_GRDE_NAM:"", DRVG_SECD:"", DRVG_SENM:"", EMAL_RCV_AGRM_YN:"", FC_EMPNO:"",
			GNDR_SECD:"", LAST_ACTV_YMD:"", LAST_ALCN_YMD:"", LAST_BZ_ACTV_PK:"", MAIG_RVPL_ADR_SECD:"", MARY_ANNI:"", 
			MARY_YN:"", NATAL_SECD:"", NATAL_SENM:"", OCPT_INJ_PEL_GRDE_COD:"", OCPT_INJ_PEL_GRDE_NAM:"", OCPT_PEL_GRDE_COD:"", 
			OCPT_PEL_GRDE_NAM:"", PBLS_YMD:"", PCAYMD:"", PRCMPAG:"", RGDT:"", RRN: '1111111111111', SFA_CS_PK:"", SMS_NTFY_YN:"", SMS_RCV_AGRM_YN:"", 
			SOLR_LUNA_SECD:"", STY_COD:"", STY_NAM:"", STY_PRID:"", USE_YN:"", VIP_YN:"", WPC_NAM:"",XCLC_OCPT_YN:""	
		});				// 법정상속인
		// option DOM 생성
		
// dcUtil.setCdSelect(null, infoList, '.DS_CS_LIST', 'CS_PK', 'CS_NAM');
		
		gDS['DS_CS_LIST'] = dcUtil.setCdSelect(null, infoList, '.DS_CS_LIST', 'CS_PK', 'CS_NAM');
		
		console.log("test>> gDS['DS_CS_LIST'] 청약>>", gDS['DS_CS_LIST']);

		// 만기수익자, 장해수익자는 법정상속인 제거
		$('.DS_CS_LIST').not(':last').find('option[value="1"]').remove();

		// * 계약관계사항 DS_CTR_INTP_MTT_LIST 데이터 SET
		// --------------------------------------------------------
		var data = null; 
		var estyYn = '';		// 필수입력여부
		var rleSecd = '';		// 계약관계코드
		var rlpSecd = '';		// 주피와의관계코드

		gDS['DS_CTR_INTP_MTT_LIST'] = [];
		for (var i = 0; oSci = oSciDS[i]; i++) {
			rleSecd = oSci.CTR_RLE_SECD;
			rlpSecd = oSci.CS_RLP_SECD;

			estyYn = $.grep(gDS['ds_CtrIntpMtt'], function(p){if( p.ASRD_CTR_RLE_SECD == rleSecd)return true;})[0].ESTY_INP_YN;

			data = {
				CTR_RLE_SECD: 		 	rleSecd,
				CS_PK: 				 	oSci.CS_PK,
				CS_NAM: 				oSci.CS_NAM,
				RRN: 					oSci.RRN,
				PRCMPAG: 				String(dateUtil.getLinaAge(gVAL.stdYmd, oSci.RRN)),
				CS_RLP_SECD: 			rlpSecd,
				CPCD: 				 	oSci.CPCD,
				CPNM: 				 	oSci.CPNM,
				OCPT_PEL_GRDE_COD:     	oSci.OCPT_PEL_GRDE_COD,
				OCPT_INJ_PEL_GRDE_COD: 	oSci.OCPT_INJ_PEL_GRDE_COD,
				DRVG_SECD: 			 	oSci.DRVG_SECD,
				DRVG_SENM: 			 	oSci.DRVG_SENM,
				DRVG_PEL_GRDE_COD:	 	oSci.DRVG_PEL_GRDE_COD,
				DRVG_INJ_PEL_GRDE_COD: 	oSci.DRVG_INJ_PEL_GRDE_COD,
				GNDR_SECD: 			 	oSci.GNDR_SECD,
				XCLC_OCPT_YN: 		 	oSci.XCLC_OCPT_YN,
				NATAL_SECD: 			oSci.NATAL_SECD,
				NATAL_SENM: 			oSci.NATAL_SENM,
				STY_COD: 				oSci.STY_COD,
				STY_NAM: 				oSci.STY_NAM,
				PYMRT: 					oSci.DTHT_DFR_RTO,
				XCLCLV_PSPY_YN: 		oSci.XCLCLV_PSPY_YN,
				XCLCLV_APPL_YN: 		oSci.XCLCLV_APPL_YN,
				ESTY_INP_YN: 			estyYn,
				PBLS_YMD: 			 	oSci.PBLS_YMD,
				STY_PRID: 			 	oSci.STY_PRID
			};

			if ('14' == rlpSecd) {   // 주피와의관계가 법정상속인일경우 CS_PK를 1로 SET
				data.CS_PK = '1';
			}

			gDS['DS_CTR_INTP_MTT_LIST'].push(data);

		}

		
		return true;
	};

	/*
	 * 계약자가 설계사 인지 판단 (OMNI 용)
	 */
	function fn_getIsStaff(_callback){
		/*
		 * 계약자가 설계사 인지 판단
		 */ 
	    var param  = {};
	    var pohdInfo  = $.grep(gDS['DS_CTR_INTP_MTT_LIST'],function(p){if('11' == p.CTR_RLE_SECD)return true;} )[0];
	    param.RRN       = pohdInfo.RRN;
	    param.PLAR_NAM  = pohdInfo.CS_NAM;
	    // 통신
	      
	    fn_selectPlarYnCount(param, function(result, _callback){
		    var plarCnt = result.PLAR_CNT; // 설계사 이면 1 이상으로 넘어 옴
		    if(parseInt(plarCnt) >  0){
		       gVAL.isPohdStaf = true;
		    }

	      	/*
			 * 피보험자 설계사 인지 판단
			 */ 
		    var param  = {};
		    var maipsnInfo  = $.grep(gDS['DS_CTR_INTP_MTT_LIST'],function(p){if('21' == p.CTR_RLE_SECD)return true;} )[0];
		    param.RRN       = maipsnInfo.RRN;
		    param.PLAR_NAM  = maipsnInfo.CS_NAM;
		    // 통신
		      
		    fn_selectPlarYnCount(param, function(result){
		      var plarCnt = result.PLAR_CNT; // 설계사 이면 1 이상으로 넘어 옴
		      if(parseInt(plarCnt) >  0){
		        gVAL.isMaipsnStaf = true;
		      }

		      if(_callback){
		      	var rtrn_obj = {};
		      	rtrn_obj.isPohdStaf 	= gVAL.isPohdStaf;
		      	rtrn_obj.isMaipsnStaf 	= gVAL.isMaipsnStaf;
		      	_callback(rtrn_obj);
		      }
		    });
	    });
	};

	function fn_selectPlarYnCount(param, _callback){
		if(stringUtil.isNull(param)){
			dialog.alert("fn_selectPlarYnCount 함수 호출시 파리미터를 안넘김");
			return ;
		}
		param.remote = {};
		D.http.ajax("/dc/elecSus/selectOmniPlarYnCount", param)
		.then(function(result) {
			if(result.errorMsg){
				dialog.alert(result.text);
				return ;
			}
			if(_callback){
				_callback(result);
			}
		});
	};

	/*
	 * 가입조건 변경
	 */
	function setNtprdMtt(){
// dialog.alert("setNtprdMtt S::");
		gDS["DS_NTPRD_MTT"] 	= 	[]; // 가입상품사항 초기화
		gDS["DS_NTPRD_TRMINS"] 	= 	[]; // 보험기간 콤보 초기화
		gDS["DS_NTPRD_TRMINS"] 	= 	[]; // 필터 원복
		gDS["DS_NTPRD_TYPCD"] 	= 	[]; // 유형상품 콤보 초기화.
		gDS["ds_PdtTrmins_Pk"] 	= 	[]; 		

		var nRow; 
		var arr_OBJ;

		arr_OBJ = gDS["ds_NtprdMtt"];
		
		for (var i = 0; i < arr_OBJ.length; i++) {
			// 보험기간
			if(arr_OBJ[i].MW_AD_PDT_YN != "1" ){
				gDS["DS_NTPRD_TRMINS"].push({}); 			// 새로운 추가
				nRow = gDS["DS_NTPRD_TRMINS"].length -1;
				var obj_option = {};
				obj_option.strColInfo = "COD=TRMINS,COD_NAM=TRMINS_DISPLAY,UNT_SECD=TRMINS_UNT_COD,AD_PRDCD=PRDCD,PK=PDT_TRMINS_PK";
				dcUtil.copyArrayRow(gDS["DS_NTPRD_TRMINS"], nRow, arr_OBJ, i, obj_option);
			}
			
			// 유형상품
			if($.grep(gDS["DS_NTPRD_TYPCD"], function(obj){ if(obj.COD == arr_OBJ[i].PRDCD){ return true } })  <= 0){
				gDS["DS_NTPRD_TYPCD"].push({}); 	// 새로운 추가
				nRow =  gDS["DS_NTPRD_TYPCD"].length - 1;
				var obj_option = {};
				obj_option.strColInfo = "COD=PRDCD,COD_NAM=TYP_NAM,TYP_RPSPRDCD=TYP_RPSPRDCD";
				dcUtil.copyArrayRow(gDS["DS_NTPRD_TYPCD"], nRow, arr_OBJ, i, obj_option);
			}
		}
		// this.xfn_sort(this.DS_NTPRD_TRMINS,"COD:A");
		var option = {};
		option.copyYN = false;  // 전달 받은 배열 자체를 수정하는 하는 옵션 true이면 전달 받은 객체를 변경
								// 하지 않고 복사하여 수정후 반환한다.
		dcUtil.objectArraySort(gDS["DS_NTPRD_TRMINS"], "COD", option ); // DS_NTPRD_TRMINS
																		// 배열의
																		// "COD"
																		// 필드
																		// 오름차순으로
																		// 정렬


		var arr_DS_NTPRD_MTT =  gDS["DS_NTPRD_MTT"];

		for (var i = 0; i < arr_OBJ.length; i++) {
			var nPdtRlpcd = arr_OBJ[i].PDT_RLPCD;
			var nPremClapdPdtSecd = arr_OBJ[i].PREM_CLAPD_PDT_SECD;

			
	        if ($.grep(gDS["DS_NTPRD_MTT"], function(obj){ if(obj.PRDCD == arr_OBJ[i].PRDCD ){ return true;} }).length < 1) {
	        
	        	// 유형의 상품이 있을 경우스킵한다. [중복 되는 유형의 데이터가 있음]
	        	if(!stringUtil.isNull(arr_OBJ[i].TYP_RPSPRDCD)){
	        		if($.grep(gDS["DS_NTPRD_MTT"], function(obj){if(obj.TYP_RPSPRDCD == arr_OBJ[i].TYP_RPSPRDCD){return true; } }).length > 0){
	        			return; 
	        		}
	        	}
	        	arr_DS_NTPRD_MTT.push({});
	        	nRow = arr_DS_NTPRD_MTT.length-1;
	        	arr_DS_NTPRD_MTT[nRow].PRDCD 			 				= arr_OBJ[i].PRDCD;
	        	arr_DS_NTPRD_MTT[nRow].PRDNM 			 				= arr_OBJ[i].PRDNM;
	        	arr_DS_NTPRD_MTT[nRow].ORG_PRDNM 		 				= arr_OBJ[i].ORG_PRDNM;
	        	arr_DS_NTPRD_MTT[nRow].TYP_YN 			 				= arr_OBJ[i].TYP_YN;
	        	arr_DS_NTPRD_MTT[nRow].TYP_RPSPRDCD 		 			= arr_OBJ[i].TYP_RPSPRDCD;
	        	arr_DS_NTPRD_MTT[nRow].TYP_PRDCD 		 				= arr_OBJ[i].TYP_PRDCD;
	        	arr_DS_NTPRD_MTT[nRow].TYP_NAM 			 				= arr_OBJ[i].TYP_NAM;
	        	arr_DS_NTPRD_MTT[nRow].PDT_RLPCD 		 				= arr_OBJ[i].PDT_RLPCD;
	        	arr_DS_NTPRD_MTT[nRow].GRST_NTRY_TRT_TNUM 				= arr_OBJ[i].GRST_NTRY_TRT_TNUM;
	        	arr_DS_NTPRD_MTT[nRow].PREM_CLAPD_PDT_SECD 				= arr_OBJ[i].PREM_CLAPD_PDT_SECD;
	        	arr_DS_NTPRD_MTT[nRow].SMASD_RLP_COD 					= arr_OBJ[i].SMASD_RLP_COD;
	        	arr_DS_NTPRD_MTT[nRow].TRMINS_RLPCD 					= arr_OBJ[i].TRMINS_RLPCD;
	        	arr_DS_NTPRD_MTT[nRow].PYPD_RLPCD 						= arr_OBJ[i].PYPD_RLPCD;
	        	arr_DS_NTPRD_MTT[nRow].NTRY_MUL_APPT_COD 				= arr_OBJ[i].NTRY_MUL_APPT_COD;
	        	arr_DS_NTPRD_MTT[nRow].MAI_PDT_NTRY_MUL_STD_AMT_KNCD 	= arr_OBJ[i].MAI_PDT_NTRY_MUL_STD_AMT_KNCD;
	        	arr_DS_NTPRD_MTT[nRow].MNR_PDT_NTRY_MUL_STD_AMT_KNCD 	= arr_OBJ[i].MNR_PDT_NTRY_MUL_STD_AMT_KNCD;
	        	arr_DS_NTPRD_MTT[nRow].MAI_PDT_STD_MUL 					= arr_OBJ[i].MAI_PDT_STD_MUL;
	        	arr_DS_NTPRD_MTT[nRow].AD_PDT_STD_MUL 					= arr_OBJ[i].AD_PDT_STD_MUL;
	        	arr_DS_NTPRD_MTT[nRow].PDT_TRMINS_PK 					= arr_OBJ[i].PDT_TRMINS_PK;

	        	if(arr_OBJ[i].PDT_RLPCD != "3"){
	        		arr_DS_NTPRD_MTT[nRow].TRMINS 				=  arr_OBJ[i].TRMINS;
	        		arr_DS_NTPRD_MTT[nRow].TRMINS_UNT_COD 		=  arr_OBJ[i].TRMINS_UNT_COD;
	        		arr_DS_NTPRD_MTT[nRow].TRMINS_DISPLAY 		=  arr_OBJ[i].TRMINS_DISPLAY;
	        	}

	        	arr_DS_NTPRD_MTT[nRow].SMASD_INP_AMT_UNT_COD 	= arr_OBJ[i].SMASD_INP_AMT_UNT_COD;
	        	arr_DS_NTPRD_MTT[nRow].PREM_INP_AMT_UNT_COD 	= arr_OBJ[i].PREM_INP_AMT_UNT_COD;
	        	arr_DS_NTPRD_MTT[nRow].UPT_PSBY_YN 				= arr_OBJ[i].UPT_PSBY_YN;
	        	arr_DS_NTPRD_MTT[nRow].PYCYC_RLPCD 				= arr_OBJ[i].PYCYC_RLPCD;
	        	arr_DS_NTPRD_MTT[nRow].PLOS_PDT_KNCD 			= arr_OBJ[i].PLOS_PDT_KNCD;
	        	arr_DS_NTPRD_MTT[nRow].SYCHR_TRT_KNCD 			= arr_OBJ[i].SYCHR_TRT_KNCD;
	        	arr_DS_NTPRD_MTT[nRow].SMASD_CALFM_COD 			= arr_OBJ[i].SMASD_CALFM_COD;
	        	arr_DS_NTPRD_MTT[nRow].YY_CONV_APPT_RLPCD 		= arr_OBJ[i].YY_CONV_APPT_RLPCD;

	            if (nPdtRlpcd == "1" || nPdtRlpcd == "2" || nPdtRlpcd == "4") {
	            	arr_DS_NTPRD_MTT[nRow].CHK = "1";
	                gVAL["isModify"] = true;
	            } else {
	                arr_DS_NTPRD_MTT[nRow].CHK="0";
	            }
	            if (arr_DS_NTPRD_MTT[nRow].CHK == "1") {
	                arr_DS_NTPRD_MTT[nRow].ANTY_SWT_APPL_YN="";
	            }
	        }
	    }

		// 납입기간 및 납입주기 SET인데 가입설계의 경우 연령변경등의 사유로 가입불가할수있으므로
		// 바로 납입기간등을 세팅하지 않고 납입기간 코드목록에서 한번더 매핑해서 set한듯
	    setPypd("ds_Pypd");
	    setPycycCod("ds_Pycyc");        

	    var nPypd = gDS["DS_NTPRD_MTT"][0].PYPD;
	    var sRow;
	    var nStdSmasd;
	    var nStdPrem;
	    var nPremClapdPdtSecd;
	    var nPrdcd;
	   	
	    for (var i = 0; i < gDS["DS_NTPRD_MTT"].length; i++) {
	        if (gDS["DS_NTPRD_MTT"][i].PDT_RLPCD != "3") {
	            sRow = findRowDsPremSmasdMtt(i);

	            if( sRow < 0 ){
	            	continue;
	            }
	            nPremClapdPdtSecd = gDS["DS_NTPRD_MTT"][i].PREM_CLAPD_PDT_SECD;
	            nStdSmasd = gDS["ds_PremSmasdMtt"][sRow].STD_SMASD;
				nStdPrem = gDS["ds_PremSmasdMtt"][sRow].STD_PREM;
				nPrdcd = gDS["DS_NTPRD_MTT"][i].PRDCD;
	            if (nPremClapdPdtSecd == "1") {
	                gDS["DS_NTPRD_MTT"][i].SMASD = nStdSmasd;
	            } else if (nPremClapdPdtSecd == "2") {
	                if (nStdPrem == 0 || stringUtil.isNull(nStdPrem) == true) {
	                    gDS["DS_NTPRD_MTT"][i].PREM = nStdSmasd;
	                } else {
	                    gDS["DS_NTPRD_MTT"][i].PREM = nStdPrem;
	                }
	            } else if (nPremClapdPdtSecd == "3") {
	                if (gDS["DS_NTPRD_MTT"][i].SMASD_CALFM_COD == "0") {
	                    gDS["DS_NTPRD_MTT"][i].SMASD = nStdSmasd;
	                } else {
	                    gDS["DS_NTPRD_MTT"][i].PREM = nStdSmasd;
	                }
	            }
	        }
	    }
	};

	function findRowDsPremSmasdMtt(arg1, arg2, arg3){
// dialog.alert("findRowDsPremSmasdMtt S::");

	    var resultRow = -1;
	    var nRow = arg1;


	    var sRow = $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD == gDS["DS_NTPRD_MTT"][nRow].YY_CONV_APPT_RLPCD){return index; } })[0];
	    if (stringUtil.isNull(gDS["DS_CTR_INTP_MTT_LIST"][sRow].RRN) == true ) {
	        sRow = $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD == "21"){return index; } })[0];
	    }

	    var sAge 			= gDS["DS_CTR_INTP_MTT_LIST"][sRow].PRCMPAG;
	    var sGndr 			= gDS["DS_CTR_INTP_MTT_LIST"][sRow].GNDR_SECD;
	    var sOcptPelCod 	= gDS["DS_CTR_INTP_MTT_LIST"][sRow].OCPT_PEL_GRDE_COD;
	    var sDrvgPelCod 	= gDS["DS_CTR_INTP_MTT_LIST"][sRow].DRVG_PEL_GRDE_COD;
	    var sOcptInjPelCod 	= gDS["DS_CTR_INTP_MTT_LIST"][sRow].OCPT_INJ_PEL_GRDE_COD;
	    var sDrvgInjPelCod 	= gDS["DS_CTR_INTP_MTT_LIST"][sRow].DRVG_INJ_PEL_GRDE_COD;
	    var nPrdcd 			= gDS["DS_NTPRD_MTT"][nRow].PRDCD;
	    var nTrmins 		= gDS["DS_NTPRD_MTT"][nRow].TRMINS;
	    var nTrminsUntCod 	= gDS["DS_NTPRD_MTT"][nRow].TRMINS_UNT_COD;
	    var nPypd 			= gDS["DS_NTPRD_MTT"][nRow].PYPD;
	    var nPypdUntCod 	= gDS["DS_NTPRD_MTT"][nRow].PYPD_UNT_COD;
	    var nPycycCod 		= gDS["DS_NTPRD_MTT"][nRow].PYCYC_COD;
	    
	    var sInjPdtKncd = $.grep(gDS["ds_ProdtTypeMtt"], function(obj){if(obj.PRDCD == nPrdcd){return obj.INJ_PDT_KNCD; }})[0];
	    
	    var sPelGrdeCod;
	    if (sInjPdtKncd == "1" || sInjPdtKncd == "3") {
	        if (parseInt(sOcptInjPelCod) < parseInt(sDrvgInjPelCod)) {
	            sPelGrdeCod = sOcptInjPelCod;
	        } else {
	            sPelGrdeCod = sDrvgInjPelCod;
	        }
	    } else {
	        if (parseInt(sOcptPelCod) < parseInt(sDrvgPelCod)) {
	            sPelGrdeCod = sOcptPelCod;
	        } else {
	            sPelGrdeCod = sDrvgPelCod;
	        }
	    }
	    var nYyTrmins = parseInt(cc_chkUntGod(nTrmins, nTrminsUntCod, sAge));
	    var nYyPypd = parseInt(cc_chkUntGod(nPypd, nPypdUntCod, sAge));
	    var min;
	    var max;
	    var minUntCod;
	    var maxUntCod;
	    var yyMin;
	    var yyMax;


	    for (var i = 0; i < gDS["ds_PremSmasdMtt"].length; i++) {
	        if (gDS["ds_PremSmasdMtt"][i].AD_PRDCD == nPrdcd) {
	            if (gDS["ds_PremSmasdMtt"][i].PREM_CLAPD_PDT_SECD == "2" || gDS["ds_PremSmasdMtt"][i].PREM_CLAPD_PDT_SECD == "3") {
	                if (gDS["ds_PremSmasdMtt"][i].MAIPSN_GNDR_APPT_COD != sGndr && gDS["ds_PremSmasdMtt"][i].MAIPSN_GNDR_APPT_COD != "0") {
	                    continue;
	                }
	                if (gDS["ds_PremSmasdMtt"][i].PEL_GRDE_COD < parseInt(sPelGrdeCod) && gDS["ds_PremSmasdMtt"][i].PEL_GRDE_COD != "00") {
	                    continue;
	                }
	                min = parseInt(gDS["ds_PremSmasdMtt"][i].MAIPSN_SMST_AGE);
	                max = parseInt(gDS["ds_PremSmasdMtt"][i].MAIPSN_GRST_AGE);
	                if (parseInt(sAge) < min || parseInt(sAge) > max) {
	                    continue;
	                }
	                min = gDS["ds_PremSmasdMtt"][i].SMST_TRMINS;
	                minUntCod = gDS["ds_PremSmasdMtt"][i].SMST_TRMINS_UNT_COD;
	                max = gDS["ds_PremSmasdMtt"][i].GRST_TRMINS;
	                maxUntCod = gDS["ds_PremSmasdMtt"][i].GRST_TRMINS_UNT_COD;
	                yyMin = parseInt(cc_chkUntGod(min, minUntCod, sAge));
	                yyMax = parseInt(cc_chkUntGod(max, maxUntCod, sAge));
	                if (nYyTrmins < yyMin || nYyTrmins > yyMax) {
	                    continue;
	                    
	                }
	                min = gDS["ds_PremSmasdMtt"][i].PYM_STRT_PRID;
	                minUntCod = gDS["ds_PremSmasdMtt"][i].PYM_STRT_PRID_UNT_COD;
	                max = gDS["ds_PremSmasdMtt"][i].PYM_EN_PRID;
	                maxUntCod = gDS["ds_PremSmasdMtt"][i].PYM_EN_PRID_UNT_COD;
	                yyMin = parseInt(cc_chkUntGod(min, minUntCod, sAge));
	                yyMax = parseInt(cc_chkUntGod(max, maxUntCod, sAge));
	                if (nYyPypd < yyMin || nYyPypd > yyMax) {
	                    continue;
	                }
	                min = gDS["ds_PremSmasdMtt"][i].PYM_STRT_CYCL_COD;
	                max = gDS["ds_PremSmasdMtt"][i].PYM_EN_CYCL_COD;
	                if (parseInt(nPycycCod) < min || parseInt(nPycycCod) > max) {
	                    continue;
	                }
	                resultRow = i;
	                break;
	            } else {
	                if (stringUtil.isNull(gDS["ds_PremSmasdMtt"][i].PEL_GRDE_COD) != true && stringUtil.isNull(gDS["ds_PremSmasdMtt"][i].PEL_GRDE_COD) != true) {

	                    if (gDS["ds_PremSmasdMtt"][i].ASRD_CTR_RLE_SECD == gDS["DS_NTPRD_MTT"][nRow].YY_CONV_APPT_RLPCD) {
	                        resultRow = i;
	                        break;
	                    }
	                } else {
	                    resultRow = i;
	                    break;
	                }
	            }
	        }
	    }
	    return resultRow;
	};
	
	
	/*
	 * 고객 정보를 로딩한다.
	 */ 
	function fn_lodingCustInfoForData(_callback){
		var val_11_RRN 		= gDS["DS_CTR_INTP_MTT_LIST"].find( function(o){if( o.CTR_RLE_SECD == '11')return true;}).RRN;
		var val_11_CS_NAM 	= gDS["DS_CTR_INTP_MTT_LIST"].find( function(o){if(o.CTR_RLE_SECD == '11')return true;}).CS_NAM;

		var val_21_RRN =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){ if(o.CTR_RLE_SECD == '21')return true;}).RRN; // 피보험자
																														// 정보
		
		getFcAdminCsPk(val_11_RRN,D.global.getUserInfo().empno, function(result){
			if(result.errorMsg){
				dialog.handLoading(false);
				return;
			}
			
			global_FC_ADMN_CS_PK = result.FC_ADMN_CS_PK;
			p_fcAdmnCsPk = result.FC_ADMN_CS_PK;
			
			fn_callIQY(result.FC_ADMN_CS_PK, val_11_CS_NAM, function(result){
				fn_loadingAML(function(){  	// KYC 초기화

					/*
					 * KYC 정보 세팅
					 */
					fn_checkKYCSaveInfo(function(result){
						if(result.errorMsg){
							dialog.alert(result.errorMsg);
							return; 
						}

						if(!stringUtil.isNull(result.kycinfo) || !stringUtil.isNull(result.kycinfo_child)){ // DB 에
																											// 저장된
																											// 값이
																											// 있으면
																											// DB 에
																											// 있는
																											// 정보를
																											// 화면에
																											// 세팅
							fn_setKycInfoFromDB(result);
						}
					});
					


					/* 계약자 핸드폰 번호를 조회 */

					fn_getHpInfo(p_fcAdmnCsPk, function(result){
						if(result.errorMsg){
							dialog.alert(result.text);
							return ;
						}

						gVAL.HP_POHD = result.HP; 
					});



					getFcAdminCsPk(val_21_RRN,D.global.getUserInfo().empno, function(result){
						if(result.errorMsg){
							if(_callback){
								console.log("월납기준보험료");
								_callback(result);
							}
							
							dialog.handLoading(false);
							return;
						}

						/* 주피보험자핸드폰 번호를 조회 */		
						fn_getHpInfo(result.FC_ADMN_CS_PK, function(result){
							if(result.errorMsg){
								if(_callback){
									console.log("월납기준보험료");
									_callback(result);
								}
								
								dialog.alert(result.text);
								return;
							}

							gVAL.HP_MAIPSN = result.HP;

							if(_callback){
								console.log("월납기준보험료");
								_callback(result);
							}
						});		
					});
					
				}); 
				
				// fn_loadingAML();
			});
			
// dialog.alert("fn_lodingCustInfoForData test::" + p_fcAdmnCsPk);
		});
	};
	
	
	/*
	 * 고객 정보를 로딩한다.
	 */ 
	function fn_lodingCustInfoForView(){
		if(fcTel == gVAL.HP_POHD){
			 // 계약자 번호와 설계사 번호 비교
			$("[name=sHpclMetdCod][value=01]").prop('disabled', true);
			$("[name=sHpclMetdCod][value=02]").prop('checked', true);
		}
		
		if(fcTel == gVAL.HP_MAIPSN){
			 // 피보험자 번호와 설계사 번호 비교
			$("[name=sHpclMetdCod][value=01]").prop('disabled', true);
			$("[name=sHpclMetdCod][value=02]").prop('checked', true);
		}
	};


	/* 고객 핸드폰 번흐를 가져온다. */
	function fn_getHpInfo(p_fc_admn_cs_pk , _callback) {

		var param = {};
		param.FC_ADMN_CS_PK  	= p_fc_admn_cs_pk;
		param.remote 			= {};
// dialog.alert("test::" + p_fc_admn_cs_pk);

		D.http.ajax("/su/mblSus/getCustHp", param).then(function(result){
			if(_callback){
				_callback(result);
			}
		});
	}


	/*
	 * KYC 호출
	 */
	function fn_loadingAML(_callback){
		console.log("test3");
		var obj_rtn =  gDS;
		
		// 직업코드 소트 가나다순
		/*
		 * obj_rtn.DS_INSU_JOB_CD.data.sort(function(a,b) { var nameA =
		 * a.COD_NAM; var nameB = b.COD_NAM; if(nameA < nameB) { return -1; }
		 * if(nameA > nameB) { return 1; }
		 * 
		 * return 0; });
		 */
		
		/*
		 * 코드 초기화
		 */ 
		dcUtil.setCdSelect('""|선택', gDS['DS_TEL_AR_COD'], 	'#PRSN_CNTC_REGON_NO');			// 연락처
		dcUtil.setCdSelect('""|선택', gDS['DS_TEL_AR_COD'], 	'#PRSN_CNTC_REGON_NO_CHILD');	// 연락처
																							// (미성년자)
		dcUtil.setCdSelect('""|선택', gDS['DS_TEL_AR_COD'], 	'#OFC_CNTC_REGON_NO');			// 연락처
		dcUtil.setCdSelect('""|선택', gDS['DS_INSU_JOB_CD'], 	'#INSU_JOB_CD');				// 직업(업종)

		dcUtil.setCdSelect('""|선택', gDS['DS_INSU_JOB_CD'], 	'#INSU_JOB_CD_CHILD');			// 직업(업종)
																							// (미성년자)
		dcUtil.setCdSelect('""|선택', gDS['DS_NATAL_COD'], 	'#CNTRY_CD');					// 국적
		dcUtil.setCdSelect('""|선택', gDS['DS_NATAL_COD'], 	'#CNTRY_CD_CHILD');				// 국적(미성년자)
		dcUtil.setCdSelect('""|선택', gDS['DS_NATAL_COD'], 	'#RL_OWNR_CNTRY_CD');			// 국적
		dcUtil.setCdSelect('""|선택', gDS['DS_NATAL_COD'], 	'#RL_OWNR_CNTRY_CD_CHILD');			// 국적

		/*
		 * =============================================================================================================================================================================================
		 * 정보를 구성하는 곳
		 * =============================================================================================================================================================================================
		 */	

		/***********************************************************************
		 * 계약자 정보
		 **********************************************************************/ 
		var obj_11 				=  $.grep(gDS["DS_CTR_INTP_MTT_LIST"], function(objTmp){if(objTmp.CTR_RLE_SECD == '11'){ return true; } })[0]; // 계약자
																																				// 정보
		var val_RRN_11 			=  obj_11.RRN;
		var val_CS_NAM_11 		=  obj_11.CS_NAM;
		var val_adult_YN_11  	=  (dateUtil.getRealAge(val_RRN_11) > 18) ? true : false ;	// 계약자
																							// 성인여부
		
		/*
		 * 휴대폰
		 */
		var obj_info_hp =  gDS["DS_ADDR_POHD"].find( function(o){if(o.BZ_SECD == '2' && o.CNTAD_SECD == '22')return true;} );
		var val_11_hp_TEL_AR_NUM;
		var val_11_hp_TEL_GUK_NUM;
		var val_11_hp_TEL_SEQ;

		if(!stringUtil.isNull(obj_info_hp)){
			val_11_hp_TEL_AR_NUM 	=  obj_info_hp.TEL_AR_NUM;
			val_11_hp_TEL_GUK_NUM 	=  obj_info_hp.TEL_GUK_NUM;
			val_11_hp_TEL_SEQ 		=  obj_info_hp.TEL_SEQ;
			gData.PRSN_CNTC_REGON_NO	=  obj_info_hp.TEL_AR_NUM;
			gData.PRSN_CNTC_OFC_NO		=  obj_info_hp.TEL_GUK_NUM;
			gData.PRSN_CNTC_INDIVI_NO	=  obj_info_hp.TEL_SEQ;
		}

		/*
		 * 자택
		 */
		var val_11_home_TEL_AR_NUM;
		var val_11_home_TEL_GUK_NUM;
		var val_11_home_TEL_SEQ;
		var obj_info_home = gDS["DS_ADDR_POHD"].find(function(o){if(o.BZ_SECD == '2' && o.CNTAD_SECD == '3')return true;}); // 휴대폰
																															// 번호가
																															// 없으면
																															// 자택
																															// 번호
																															// 가져온다.
		if(!stringUtil.isNull(obj_info_home)){
			val_11_home_TEL_AR_NUM 		=  obj_info_home.TEL_AR_NUM;
			val_11_home_TEL_GUK_NUM 	=  obj_info_home.TEL_GUK_NUM;
			val_11_home_TEL_SEQ 		=  obj_info_home.TEL_SEQ;
		}

		/*
		 * 직업
		 */
		var val_11_CPCD = obj_11.CPCD;
		
		/*
		 * 자택 주소
		 */
		var addrData_HOME 	= gDS['DS_ADDR_POHD'].find( function(p){if('2' == p.BZ_SECD && '5' == p.CNTAD_BLN_SECD && '2' == p.CNTAD_SECD)return true;} );
		
		var val_11_HOME_ZCD;
		var val_11_HOME_GTED_ADR;
		var val_11_HOME_LSTD_ADR;
			
		if(!stringUtil.isNull(addrData_HOME)){
			val_11_HOME_ZCD = addrData_HOME.ZCD;
			val_11_HOME_GTED_ADR 	= addrData_HOME.GTED_ADR;
			val_11_HOME_LSTD_ADR 	= addrData_HOME.LSTD_ADR;
		}

		/*
		 * 직장 주소
		 */
		var addrData_OFFC 	= gDS['DS_ADDR_POHD'].find( function(p){if('2' == p.BZ_SECD && '6' == p.CNTAD_BLN_SECD && '2' == p.CNTAD_SECD)return true;} );
		var val_11_OFFIC_ZCD;
		var val_11_OFFC_GTED_ADR;
		var val_11_OFFC_LSTD_ADR;
		
		if(!stringUtil.isNull(addrData_OFFC)){
			val_11_OFFIC_ZCD 		= addrData_OFFC.ZCD;
			val_11_OFFC_GTED_ADR 	= addrData_OFFC.GTED_ADR;
			val_11_OFFC_LSTD_ADR 	= addrData_OFFC.LSTD_ADR;
		}

		/*
		 * 직장 전화번호
		 */
		var phoneData_OFFC 	= gDS['DS_ADDR_POHD'].find( function(p){if('2' == p.BZ_SECD && '6' == p.CNTAD_BLN_SECD && '3' == p.CNTAD_SECD)return true;} );
		
		var val_11_offc_TEL_AR_NUM;
		var val_11_offc_TEL_GUK_NUM;
		var val_11_offc_TEL_SEQ;
		
		if(!stringUtil.isNull(phoneData_OFFC)){
			val_11_offc_TEL_AR_NUM 	=	phoneData_OFFC.TEL_AR_NUM;;
			val_11_offc_TEL_GUK_NUM =	phoneData_OFFC.TEL_GUK_NUM;;
			val_11_offc_TEL_SEQ 	=	phoneData_OFFC.TEL_SEQ;;
		}
		
		/*
		 * 국적
		 */
		var val_11_NATAL_SECD = obj_11.NATAL_SECD;
		
		
		/***********************************************************************
		 * 피보험자 정보
		 **********************************************************************/ 
		var obj_21 				=  $.grep(gDS["DS_CTR_INTP_MTT_LIST"], function(objTmp){if(objTmp.CTR_RLE_SECD == '21'){ return true; } })[0]; // 계약자
																																				// 정보
		var val_RRN_21 			=  obj_21.RRN;
		var val_adult_YN_21  	= (dateUtil.getRealAge(val_RRN_21) > 18) ? true : false ;	// 계약자
																							// 성인여부

		/*
		 * =============================================================================================================================================================================================
		 * 위에 조회한 정보를 화면에 매핑 한다.
		 * =============================================================================================================================================================================================
		 */	
		/*
		 * 계약자(미성년자) , 피보험자(미성년자) 둘다 미성년자 일 경우 진행하는 곳
		 */
		if( (!val_adult_YN_11 && !val_adult_YN_21) || (!val_adult_YN_11 && val_adult_YN_21)){
			/*
			 * [친권자 선택]을 show
			 */
			$("#DIV_PARENTS").show();

			/*
			 * 실명 번호 구분 ----------------- 주민등록번호 1, 2, 3, 4 의 경우 내국인 주민등록번호 5,
			 * 6, 7, 8 의 경우 외국인으로 ----------------- 01 : 주민등록번호 15 : 외국인 등록번호
			 * 국내거소 신고번호 20210423 변경
			 * 
			 */

			// 주민등록 번호를 파싱
			var val_nationGubun =  val_RRN_21.substring(6,7); 
			switch(val_nationGubun){
				// 주민등록번호 1,2,3,4 의 경우 내국인 (주민등록번호 [개인])
				case "1":
				case "2":
				case "3":
				case "4":
					$("[name=RNNO_GBN_CD_CHILD]").prop('checked', false);
					$("[name=RNNO_GBN_CD_CHILD][value=01]").prop('checked', true); // 주민등록번호(개인)
																					// ==
																					// 내국인
				break;
				// 주민등록번호 5,6,7,8 의 경우 외국인
				case "5":
				case "6":
				case "7":
				case "8":
					$("[name=RNNO_GBN_CD_CHILD]").prop('checked', false);
					$("[name=RNNO_GBN_CD_CHILD][value=15]").prop('checked', true); // 외국인
																					// 등록번호
																					// ==
																					// 내국인
				break;
			}

			$("[name=RNNO_GBN_CD_CHILD]").next().show();
			$("[name=RNNO_GBN_CD_CHILD]:not(:checked)").next().hide();

			/*
			 * 고객 정보에서 친권자 존재 여부를 체크 한다.
			 */
			var args = {
				"rrn": val_RRN_11,   		// 계약자주민번호
				"csnam": val_CS_NAM_11,   	// 계약자 이름
				"empno": D.global.getUserInfo('empno'), 
				"remote": {}
			};

			// 통신
			D.http.ajax("/cu/selectParentsInfo", args)
			.then(function(result){
				
				console.log("친권자>>", result);
				
				if(result.errorMsg){
					dialog.alert(result.errorMsg);
					return ; 
				}
				var arr_CHILDList =  result.result;

				var $SEL_PARENTS =  $("#SEL_PARENTS");
				$SEL_PARENTS.html("");
				for (var i = 0; i < arr_CHILDList.length; i++) {
					$("<option/>").attr({value: arr_CHILDList[i].FC_ADMN_CS_PK }).html( arr_CHILDList[i].CS_NAM).appendTo($SEL_PARENTS);
				}

				/*
				 * 친권자 정보가 있으면 화면에 친권자 정보를 세팅한다.
				 */
				if (arr_CHILDList.length > 0) {
					$("#SEL_PARENTS").trigger('change');   // <=== 이곳에서 친권자 정보를
															// 화면에 세팅

					/*
					 * ====================================================================================================================================
					 * 미성년자 정보를 세팅한다.
					 * ====================================================================================================================================
					 */  
					
					/*
					 * 친권자 kyc 실제소유자 디폴트값 '아니요' 설정
					 */	
					if(stringUtil.isNull(gData.RL_OWNR_YN)) {
						$("[name=RL_OWNR_YN][value='N']").prop("checked", true);
						$("[name=RL_OWNR_YN]").trigger('change'); 
					
						$("#RL_OWNR_HANGL_NM").val(val_CS_NAM_11); 	// 실제소유자 >
																	// 성명

						// 실제소유자 > 생년월일
// $("#RL_OWNR_BRTHYMD").val('20'+val_RRN_11.substring(0,6));
						$("#RL_OWNR_BRTHYMD").val(val_RRN_11);  		
						$("#RL_OWNR_BRTHYMD").trigger('focusout');

						$("#RL_OWNR_CNTRY_CD").val("KR");	// 실제소유자 > 국적
						
						$("[name=RL_OWNR_YN]").prop('disabled', true);
						$("#RL_OWNR_HANGL_NM").prop('disabled', true);
						$("#RL_OWNR_BRTHYMD").prop('disabled', true);
						$("#RL_OWNR_CNTRY_CD").prop('disabled', true);
					}

					/*
					 * 실명번호
					 */
					$("#RNNO_CHILD").val(val_RRN_11.replace(/(\d{6})(\d{1})(\d{6})/, '$1-$2******'));

					/*
					 * 성명
					 */ 
					$("#HANGL_NM_CHILD").val(val_CS_NAM_11);		

					/*
					 * 연락처
					 */
					// 휴대폰 정보를 먼저 찾는다. 있으면 세팅
					if(!stringUtil.isNull(val_11_hp_TEL_SEQ) && !stringUtil.isNull(val_11_hp_TEL_AR_NUM) && !stringUtil.isNull(val_11_hp_TEL_GUK_NUM)){
						$("#PRSN_CNTC_REGON_NO_CHILD").val(val_11_hp_TEL_AR_NUM);
						$("#PRSN_CNTC_OFC_NO_CHILD").val(val_11_hp_TEL_GUK_NUM);
						$("#PRSN_CNTC_INDIVI_NO_CHILD").val(val_11_hp_TEL_SEQ);
					// 그대음 자택 전화번호를 찾는다.
					}else if(!stringUtil.isNull(val_11_home_TEL_SEQ) && !stringUtil.isNull(val_11_home_TEL_GUK_NUM) && !stringUtil.isNull(val_11_home_TEL_AR_NUM)){
						$("#PRSN_CNTC_REGON_NO_CHILD").val(val_11_home_TEL_SEQ);
						$("#PRSN_CNTC_OFC_NO_CHILD").val(val_11_home_TEL_GUK_NUM);
						$("#PRSN_CNTC_INDIVI_NO_CHILD").val(val_11_home_TEL_AR_NUM);						
					}

					// 국적
					$("#CNTRY_CD_CHILD").val("KR"); // 대한민국으로 Default 세팅

					// 자택주소
					$("#HOME_ZIPCD_CHILD").val(val_11_HOME_ZCD);
					$("#HOME_ZIPCD_ADDR_CHILD").val(val_11_HOME_GTED_ADR);
					$("#HOME_DTL_ADDR_CHILD").val(val_11_HOME_LSTD_ADR);

					/*
					 * 직업
					 */
					$("#INSU_JOB_CD_CHILD").val("08"); // 미성년자로 고정 세팅

					/*
					 * 신원확인증
					 */ 
					$("#RLNM_CHK_MTHOD_CD_CHILD").val("01"); // 주민등록증으로 고정
					
					/*
					 * 거래자금 원천 및 출처 
					 */
					$("#la10-25-9").prop('checked', true);
					$("TXFNOG_CD_CHILD").val("99");
					$("#TXFNOG_ETC_NM_CHILD").show();
					if (stringUtil.isNull($('#TXFNOG_ETC_NM_CHILD').val())) {
						$('#TXFNOG_ETC_NM_CHILD').val('부모소득')
					}
					
					// 퍼블에서 자동으로 첫번째 input 박스에 check 되게 해놓아서 callback 이후에 체크 해제함
					// (미성년자는 입력 값이 없음)
					$("#la10-25-1-child").prop('checked', false);
					$("#la10-26-1-child").prop('checked', false);
					
					// 실제소유자 실명번호
					$("#RL_OWNR_BRTHYMD").val(val_RRN_11.replace(/(\d{6})(\d{1})(\d{6})/, '$1$2******'));
				
				} else {
					dcUtil.g_showMessage("CCCI0027", "미성년자 계약은 친권자 정보가 필요합니다. 친권자 정보를 고객정보에서 등록 하시기 바랍니다.", function(){
						dialog.handLoading(false); // AML 활성화 하면 지울것
				      	D.move.back();	// 뒤로가기
				    });
				}

				dialog.handLoading(false); 

				if(_callback){
					_callback();
				}
				

			});
		/*
		 * 일반 적으로 진행 하는 곳
		 */
		} else {
			/*
			 * [친권자 선택]을 hide
			 */
			$("#DIV_PARENTS").hide();

			/*
			 * 실명 번호 구분 ----------------- 주민등록번호 1, 2, 3, 4 의 경우 내국인 주민등록번호 5,
			 * 6, 7, 8 의 경우 외국인으로 ----------------- 01 : 주민등록번호 15 : 외국인 등록번호
			 * 국내거소 신고번호
			 */

			// 주민등록 번호를 파싱
			var val_nationGubun =  val_RRN_11.substring(6,7); 
			switch(val_nationGubun){
				// 주민등록번호 1,2,3,4 의 경우 내국인 (주민등록번호 [개인])
				case "1":
				case "2":
				case "3":
				case "4":
					$("[name=RNNO_GBN_CD]").prop('checked', false);
					$("[name=RNNO_GBN_CD][value=01]").prop('checked', true); // 주민등록번호(개인)
																				// ==
																				// 내국인
				break;
				// 주민등록번호 5,6,7,8 의 경우 외국인
				case "5":
				case "6":
				case "7":
				case "8":
					$("[name=RNNO_GBN_CD]").prop('checked', false);
					$("[name=RNNO_GBN_CD][value=15]").prop('checked', true); // 외국인
																				// 등록번호
																				// ==
																				// 내국인
				break;
			}

			$("[name=RNNO_GBN_CD]").next().show();
			$("[name=RNNO_GBN_CD]:not(:checked)").next().hide();

			/*
			 * 실명번호
			 */
			$("#RNNO").val(val_RRN_11.replace(/(\d{6})(\d{1})(\d{6})/, '$1-$2******'));
			$("#HANGL_NM").val(val_CS_NAM_11);												// 성명

			/*
			 * 연락처
			 */ 
			$("#PRSN_CNTC_REGON_NO").val(val_11_hp_TEL_AR_NUM); 	
			$("#PRSN_CNTC_OFC_NO").val(val_11_hp_TEL_GUK_NUM);
			$("#PRSN_CNTC_INDIVI_NO").val(val_11_hp_TEL_SEQ);

			/*
			 * 연락처
			 */
			// 휴대폰 정보를 먼저 찾는다. 있으면 세팅
			if(!stringUtil.isNull(val_11_hp_TEL_SEQ) && !stringUtil.isNull(val_11_hp_TEL_AR_NUM) && !stringUtil.isNull(val_11_hp_TEL_GUK_NUM)){
				$("#PRSN_CNTC_REGON_NO").val(val_11_hp_TEL_AR_NUM);
				$("#PRSN_CNTC_OFC_NO").val(val_11_hp_TEL_GUK_NUM);
				$("#PRSN_CNTC_INDIVI_NO").val(val_11_hp_TEL_SEQ);
			// 그대음 자택 전화번호를 찾는다.
			}else if(!stringUtil.isNull(val_11_home_TEL_SEQ) && !stringUtil.isNull(val_11_home_TEL_GUK_NUM) && !stringUtil.isNull(val_11_home_TEL_AR_NUM)){
				$("#PRSN_CNTC_REGON_NO").val(val_11_home_TEL_SEQ);
				$("#PRSN_CNTC_OFC_NO").val(val_11_home_TEL_GUK_NUM);
				$("#PRSN_CNTC_INDIVI_NO").val(val_11_home_TEL_AR_NUM);						
			}

			/*
			 * 연락처 (직장)
			 */ 
			if(!stringUtil.isNull(val_11_offc_TEL_AR_NUM) && !stringUtil.isNull(val_11_offc_TEL_GUK_NUM) && !stringUtil.isNull(val_11_offc_TEL_SEQ)){
				$("#OFC_CNTC_REGON_NO").val(val_11_offc_TEL_AR_NUM);
				$("#OFC_CNTC_OFC_NO").val(val_11_offc_TEL_GUK_NUM);
				$("#OFC_CNTC_INDIVI_NO").val(val_11_offc_TEL_SEQ);						
			}

			/*
			 * 직업(업종)
			 */
			$("#INSU_JOB_CD").val(""); 	
			if(!stringUtil.isNull(gVAL.DS_DETAIL_02[0].INSUJOBCOD)){
				$("#INSU_JOB_CD").val(gVAL.DS_DETAIL_02[0].INSUJOBCOD); 	
			}
			$("#INSU_JOB_CD").trigger('change');

			/*
			 * 국적
			 */
			 if( val_nationGubun == "5" || val_nationGubun == "6" || val_nationGubun == "7" || val_nationGubun == "8"  ){
	  			  $("#CNTRY_CD").val(""); // defalut 한국
			 }else{
				   $("#CNTRY_CD").val("KR"); // defalut 한국

			 }
			
			console.log("친권자주소val_11_HOME_ZCD>>",val_11_HOME_ZCD);
			console.log("val_11_HOME_GTED_ADR>>",val_11_HOME_GTED_ADR);
			console.log("val_11_HOME_LSTD_ADR>>",val_11_HOME_LSTD_ADR);
			
			/*
			 * 주소(자택)
			 */
			$("#HOME_ZIPCD").val(val_11_HOME_ZCD);
			$("#HOME_ZIPCD_ADDR").val(val_11_HOME_GTED_ADR);
			$("#HOME_DTL_ADDR").val(val_11_HOME_LSTD_ADR);

			/*
			 * 주소(직장)
			 */
			$("#OFC_ZIPCD").val(val_11_OFFIC_ZCD);
			$("#OFC_ZIPCD_ADDR").val(val_11_OFFC_GTED_ADR);
			$("#OFC_DTL_ADDR").val(val_11_OFFC_LSTD_ADR);

			console.log("test222222>>", val_11_HOME_ZCD);
			if(val_11_HOME_ZCD == null)	{
				$("#home_addr").hide();
				$("#offc_addr").show();
			}
			
			/*
			 * 신원확인증 의 경우
			 */
			var val_RNNO_GBN_CD =  $("#RNNO_GBN_CD").val();

			var $RLNM_CHK_MTHOD_CD =  $("#RLNM_CHK_MTHOD_CD"); // 신원확인증
			
			switch(val_RNNO_GBN_CD){
				case "01": // 내국인의 경우 [주민등록증] 기본
					$RLNM_CHK_MTHOD_CD.val("01");
				break;
				case "15": // 외국인등록번호의 경우 [운전면허증] 기본
					$RLNM_CHK_MTHOD_CD.val('05');
				break; 

			}
			
			// 외국인의 경우, 신원확인증은 외국인등록증/국내거소증만 선택
			if ( val_nationGubun == "5" || val_nationGubun == "6" || val_nationGubun == "7" || val_nationGubun == "8" ) {
				$("#RLNM_CHK_MTHOD_CD").val('05').prop('selected', true);
				$("#RLNM_CHK_MTHOD_CD option[value!='05']").hide();
			}
			
			$("#RLNM_CHK_MTHOD_CD").trigger('change');
			
			/*
			 * 거래자금 원천 및 출처 초기화
			 */
			 $("[name=TXFNOG_CD]:checked").trigger('change');
			 $("[name=TXFNOG_CD_CHILD]:checked").trigger('change');


			/*
			 * 거래목적(신계약) 초기화
			 */
			$("[name=NWCT_TXPR_CD]:checked").trigger('change');
			$("[name=NWCT_TXPR_CD_CHILD]:checked").trigger('change');
			
			$("#li_AML").show();
			$("#li_AML_parent").hide(); 
// $("#btn_CHILD_EXE").addClass("none");
			gVAL.CHILD_EXE_YN = false;

			dialog.handLoading(false); // AML 활성화 하면 지울것

			if(_callback){
				_callback();
			}
		}
	};

		
	/**
	 * 고객종합조회
	 */
	function fn_callIQY(p_fcAdmnCsPk, csNm , _callback) {
		var remote = convertUtil.getRemoteObj('FG_AC_CsOvrlInq', 'IQY');
		
		var param = {
			FC_ADMN_CS_PK 	: p_fcAdmnCsPk,
			CS_NAM 			: csNm,
			remote : remote
		};
			
		D.http.ajax('/cu/indvCsAdmn', param).then(function(result) {
			
			var rs=result.remoteResult.outDataSet;
			
			gVAL.DS_DETAIL_04_01 = rs.DS_DETAIL_04_01.data; 	// 자택전화번호
			gVAL.DS_DETAIL_04_02 = rs.DS_DETAIL_04_02.data; 	// 직장전화번호
			gVAL.DS_DETAIL_05 = rs.DS_DETAIL_05.data; 		// 휴대전화번호
			gVAL.DS_DETAIL_12 = rs.DS_DETAIL_12.data; 		// FC별국적코드,체류코드
			gVAL.DS_DETAIL_02 = rs.DS_DETAIL_02.data;
			gVAL.DS_FNC_SPND_INF = rs.DS_FNC_SPND_INF.data; // 전문금융소비자정보
			if(_callback){
				_callback(result);
			}
		});
	};
	
	
	/*
	 * 모바일, [자택 or 직장] 전화번호 중 한개를 가져오는 함수
	 */
	function getCallNumber(){
		var connectNumber = "";
		console.log("getCallNumber start");

		/*
		 * 계약자가 미성년일 때만 친권자 정보가 들어 옴
		 */
		if (!stringUtil.isNull(gVAL.obj_PARENTS.RRN)) {
			console.log("친권자 정보 있음");
			/*
			 * 연락처
			 */  
			if(!stringUtil.isNull(gVAL.obj_PARENTS.HPNO)){  	// 핸드폰 번호가 존재하면
																// 핸드폰 번호를 입력한다.
				console.log("핸드폰번호가 존재함");
				connectNumber = gVAL.obj_PARENTS.HPNO;
			}else if(!stringUtil.isNull(gVAL.obj_PARENTS.HOME_TLNO)){  
				console.log("HOME_TLNO 존재함");
				connectNumber = gVAL.obj_PARENTS.HOME_TLNO;
			}

			return connectNumber;
		}
		
		if(		!stringUtil.isNull(gVAL.DS_DETAIL_05[0].CP_SECD) 
			&&  !stringUtil.isNull(gVAL.DS_DETAIL_05[0].TEL_GUK_NUM) 
			&&  !stringUtil.isNull(gVAL.DS_DETAIL_05[0].TEL_SEQ) 
		){ 	// 휴대폰 번호 체크
			console.log("여기로옴111");
			return gVAL.DS_DETAIL_05[0].CP_SECD + gVAL.DS_DETAIL_05[0].TEL_GUK_NUM + gVAL.DS_DETAIL_05[0].TEL_SEQ;
		}else{
			console.log("여기로옴222");

			var val_cmbMaigRvpl =  gData.cmbMaigRvpl; // 5 : 자택 , 6 : 직장

			if(val_cmbMaigRvpl == "5"){  // 자택 이면
				console.log("자택임");
				if( 
						!stringUtil.isNull(gVAL.DS_DETAIL_04_01[0].TEL_AR_NUM) 
					&&  !stringUtil.isNull(gVAL.DS_DETAIL_04_01[0].TEL_GUK_NUM) 
					&&  !stringUtil.isNull(gVAL.DS_DETAIL_04_01[0].TEL_SEQ) 
				){ 			// 자택 전화 번호
					console.log("자택임222");
					return gVAL.DS_DETAIL_04_01[0].TEL_AR_NUM + gVAL.DS_DETAIL_04_01[0].TEL_GUK_NUM + gVAL.DS_DETAIL_04_01[0].TEL_SEQs; 
				}else if(!stringUtil.isNull(gVAL.obj_PARENTS.RRN)){ // 계약자가 미성년일
																	// 때 친권자 전화
																	// 번호 검색
					console.log("계약자가 미성년일 때 친권자 전화 번호 검색  ");
					if(!stringUtil.isNull(gVAL.obj_PARENTS.HPNO)){  	// 핸드폰
																		// 번호가
																		// 존재하면
																		// 핸드폰
																		// 번호를
																		// 입력한다.
						console.log("핸드폰 번호가 존재하면 핸드폰 번호를 입력한다.   ");
						connectNumber = gVAL.obj_PARENTS.HPNO;
					}else if(!stringUtil.isNull(gVAL.obj_PARENTS.HOME_TLNO)){
						connectNumber = gVAL.obj_PARENTS.HOME_TLNO;
					}
					return connectNumber;
				}
			}else{ 	// 직장이면
				if( 	// 직장 전화번호
						!stringUtil.isNull(gVAL.DS_DETAIL_04_02[0].TEL_AR_NUM) 
					&&  !stringUtil.isNull(gVAL.DS_DETAIL_04_02[0].TEL_GUK_NUM) 
					&&  !stringUtil.isNull(gVAL.DS_DETAIL_04_02[0].TEL_SEQ) 
				){
					return gVAL.DS_DETAIL_04_02[0].TEL_AR_NUM + gVAL.DS_DETAIL_04_02[0].TEL_GUK_NUM + gVAL.DS_DETAIL_04_02[0].TEL_SEQs; 
				}else if(!stringUtil.isNull(gVAL.obj_PARENTS.RRN)){ // 계약자가 미성년일 때 친권자 전화 번호 검색
					if(!stringUtil.isNull(gVAL.obj_PARENTS.HPNO)){  	// 핸드폰 번호가 존재하면 핸드폰 번호를 입력한다.
						
						connectNumber = gVAL.obj_PARENTS.HPNO;
					}else if(!stringUtil.isNull(gVAL.obj_PARENTS.OFFICE_TLNO)){
						connectNumber = gVAL.obj_PARENTS.OFFICE_TLNO;
					}
					return connectNumber;
				}
			}		
		} 

		return "";
	};

	/*
	 * FC_ADMN_CS_PK 를 얻기 위한 함수
	 */
	function getFcAdminCsPk(p_rrn, p_fc_empno, _callback ){
// dialog.alert("getFcAdminCsPk S");
		if(p_rrn == '1111111111111'){ // 태아는 전화번호가 없으므로 조회 하지 않는다.
			return; 
		}
// dialog.alert("getFcAdminCsPk test::" + p_rrn + ":::" + p_fc_empno);

		var args = {
			"RRN": p_rrn,
			"FC_EMPNO": p_fc_empno,
			"remote": {}
		};

		D.http.ajax("/su/mblSus/getFcAdminCsPk", args).then(function(result){
// dialog.alert("getFcAdminCsPk result::" + result.FC_ADMN_CS_PK);
			if(result.errorMsg){
				dialog.handLoading(false);
				dialog.alert(result.errorMsg);
				dialog.handLoading(false);
			}
			if(_callback){
				_callback(result);
			}
		});
	};
		
		
	/**
	 * FATCA 정보 설정 / TODO: 저장된 정보 불러오는 서비스 개발되면 처리
	 */
	function fnSetFatcaInfo(_callback) {
		// 계약자정보
		var polInfo = $.grep(gDS['DS_CTR_INTP_MTT_LIST'],function(p){if('11' == p.CTR_RLE_SECD)return true;})[0];
		
		// 국가 콤보 DS_COUNTRY 콤보 생성
		dcUtil.setCdSelect(null, gDS['DS_COUNTRY'], '#edtCorgnoCon');	// 국적

		if(gVAL.DS_DETAIL_12.length > 0){
			var val_NATAL_SECD =  gVAL.DS_DETAIL_12[0].NATAL_SECD;  // 고객정보 조회해서
																	// 가져온 국적을
																	// 로딩한다.
			if(!stringUtil.isNull(val_NATAL_SECD)){
				$("#edtCorgnoCon").val(val_NATAL_SECD);
			}else{
				$("#edtCorgnoCon").val('235');
			}
		}else{
			$("#edtCorgnoCon").val("235");
		}
		
		dcUtil.setCdSelect('""|선택', gDS['DS_COUNTRY'], '#edtCorgnoCon1');	// 거주지국가1
		$("#edtCorgnoCon1").trigger('change');
		dcUtil.setCdSelect('""|선택', gDS['DS_COUNTRY'], '#edtCorgnoCon2');	// 거주지국가2
		$("#edtCorgnoCon2").trigger('change');
		
		// 고객 주민번호가 존재 할 경우만 조회
		if (!stringUtil.isNull(polInfo.RRN)) {
			var args = {
				"CSNUM": polInfo.RRN,
				"remote": {}
			};

			// 통신
			D.http.ajax("/su/mblSus/getFatcaIndvInf", args)
			.then(function(result){

				if(result.errorMsg){ 
					alert(result.errorMsg); 
					return; 
				}

				if (result.DS_FATCA_INF) {
					gDS['DS_FATCA_INF'] = result.DS_FATCA_INF;
					
					if (gDS['DS_FATCA_INF'].length > 0) {	// 데이터가 있을 경우 각
															// 컴포넌트에 값 세팅
						var fatca = gDS['DS_FATCA_INF'][0];

							// 1. 고객 인적사항 -------------------------
							if(!stringUtil.isNull(fatca.FII_03)){
								$('#edtCorgnoCon').val(fatca.FII_03);	// 국적
							}

							// 2. 해외 거주자여부 확인 -------------------
							$('#rdoUsCorYn'+fatca.FII_06).prop('checked', true);	// 미국인해당여부
							$('#rdoUsAmYn'+fatca.FII_07).prop('checked', true);		// 미국인해당일경우 선택사항
							$('#rdoUsSeaYn'+fatca.FII_08).prop('checked', true);	// 대한민국 이외의 조세목적상...
							$("[name=rdoUsCorYn],[name=rdoUsSeaYn]").trigger('change');

							// 3. 납세자 정보 ----------------------------
							$('#edtCorgnoSur').val(fatca.FII_09||'');				// 성(Surname)::영문성명
							$('#edtCorgnoGiv').val(fatca.FII_10||'');				// 명(Given name)::영문성명

							$('#edtCorgnoCon1').val(fatca.FII_11||'');				// 거주지국가1
							$('#edtCorgnoEnAdd1').val(fatca.FII_12||'');			// 영문주소1
							if(gData.ch1 == 1){
								$('#ch1'+ (fatca.FII_13 ? '1' : '0')).prop('checked', true);		// 납세자번호유무
								$('#ch1'+ (fatca.FII_13 ? '1' : '0')).trigger('click');
								$("[name=rdoUsEXYn1]").prop('disabled', true);	// 미기재사유 체크 비활성화
							}
							$('#edtCorgnoTin1').val(fatca.FII_13||'');				// 납세자번호1
							$('#rdoUsEXYn1'+fatca.FII_14).prop('checked', true);	// 미기재사유1
							$('#edtCorgnoETC1').val(fatca.FII_15||'');				// 미기재사유1-기타사유입력

							$('#edtCorgnoCon2').val(fatca.FII_16||'');				// 거주지국가2
							$('#edtCorgnoEnAdd2').val(fatca.FII_17||'');			// 영문주소2
							if(gData.ch2 == 1){
								$('#ch2' + (fatca.FII_13 ? '1' : '0')).prop('checked', true);		// 납세자번호2유무
								$('#ch2'+ (fatca.FII_13 ? '1' : '0')).trigger('click');
								$("[name=rdoUsEXYn2]").prop('disabled', true);	// 미기재사유 체크 비활성화
							}
							$('#edtCorgnoTin2').val(fatca.FII_18||'');				// 납세자번호2
							$('#rdoUsEXYn2'+fatca.FII_19).prop('checked', true);	// 미기재사유2
							$('#edtCorgnoETC2').val(fatca.FII_20||'');				// 미기재사유2-기타사유입력
							
							// TODO: 김대근 과장님 UI Controll
							$("#edtCorgnoCon2").trigger('change');
							dialog.handLoading(false);
						}else{
							gDS['DS_FATCA_INF'].push({FII_28 : ""});
							$("[name=rdoUsCorYn],[name=rdoUsSeaYn]").trigger('change');
						}
						
						if(_callback){
				    		_callback();
				    	}
					} else {
						D.logger.error('통신 중 에러가 발생했습니다. 에러메세지코드 [' + (result.errorMsg || '') + ']');
						dialog.handLoading(false);
					}
					
				});

			}
	};


	/* 해피콜 대상건을 조회 한다. */
	function fn_checkHappyCall(){
		if(stringUtil.isNull(gVAL.maiPrdcd)){
			dialog.alert("해피콜 대상건 조회에 필요한 상품코드가 존재하지 않습니다.");
			return; 
		}

		var param = {};
		param.PRDCD  = gVAL.maiPrdcd;  // 대표 상품 코드
		param.remote = {};
		
		/* 해피콜 대상건 조회 */
		D.http.ajax("/su/mblSus/getCountHappyCall", param).then(function(result){

			var obj_11_RRN 		=  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){ if(o.CTR_RLE_SECD == '11')return true;}).RRN; // 계약자
																																// 정보
	        var obj_21_RRN 		=  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){ if(o.CTR_RLE_SECD == '21')return true;}).RRN; // 피보험자
																																// 정보
	        var val_11_realAge 	=  dateUtil.getRealAge(obj_11_RRN); 
	        var val_21_realAge 	=  dateUtil.getRealAge(obj_21_RRN); 

			gVAL.happyCount = result.HAPPY_COUNT;
			/* 01 : 모바일, 02 : 전화 */
			$("[name=sHpclMetdCod]").prop('checked', false);
			if(gVAL.happyCount == 0){ // 해피콜 대상건이 아니면 [전화] 만 가능
				$("[name=sHpclMetdCod]").prop('checked', false);
				$("[name=sHpclMetdCod][value=02]").prop('checked', true);

			}else{	// 해피콜 대상건이면 [모바일]로 DEFUALT 세팅
				if(parseInt(val_11_realAge) < 19  || parseInt(val_21_realAge)< 19 || parseInt(val_11_realAge) > 64  || parseInt(val_21_realAge) > 64){ // 미성년자이면
																																						// [전화]
																																						// 로 세팅
																																						// 아니면
																																						// default
																																						// 모바일
					$("[name=sHpclMetdCod]").prop('checked', false);
		            $("[name=sHpclMetdCod][value=02]").prop('checked', true);
		        }else{	        	
		    		$("[name=sHpclMetdCod]").prop('checked', false);
					$("[name=sHpclMetdCod][value=01]").prop('checked', true);    
		        }
			}
			fn_lodingCustInfoForView();
		});
	};
	
	
	/**
	 * 거래자금실소유자정보 조회 :: TrsCaptActlOnrCfmtIndvPop.xfdl
	 */
	function fnSetGzsilInfo(_callback) {
// dialog.alert("fnSetGzsilInfo S");
		
		var args = {
			"PLYNO": gVAL.plyNo,	// 증권번호
			"remote": convertUtil.getRemoteObj("FG_AC_TrsCaptActlOnrCfmtAdmn", "IQY")
		};
		
		// 통신
		D.http.ajax("/sw/swAllCC", args)
		.then(function(result){
			if(result.errorMsg){
				dialog.alert(result.text);
				return ;
			}
			if (result.remoteResult) {
	
				var dsDefault = [{
					TRS_CAPT_ACTL_ONR_PK: '',
					PLYNO: '',
					ACTONR_YN: '1',
					ACTONR_NAM: '',
					ACTONR_BRT: '',
					ACTONR_NATAL: '',
					CFMT_EXCN_YN: '',
					QTA_25_ABOV_YN: '',
					HALF_SHLD_YN: '',
					FCT_SUPT_YN: '',
					COPR_REPR_YN: '',
					LAST_LST_YN: '',
					DEL_YN: '',
					CRT_DT: '',
					MDF_DT: '',
					CRTR: '',
					AMDR: ''
				}];
	
				// 결과 DS 세팅 :: DS_ACTONR_INF
				fnSetGlobalDs(result.remoteResult.outDataSet);
				var info = gDS['DS_ACTONR_INF'];
				if (!stringUtil.isNull(info)) {
					info = info[0];
					if ('1' == info.ACTONR_YN) {	// 예
						gDS['DS_ACTONR_INF'] = dsDefault;
					}
				} else {
					gDS['DS_ACTONR_INF'] = dsDefault;
				}
			}

			if(!stringUtil.isNull(_callback)){
				_callback(result);
			}
		});
	
	};

	/**
	 * 연금사항 설정
	 */
	function fnSetAntyMtt() {
// dialog.alert("fnSetAntyMtt S");

		gDS['DS_ANTY_MTT'] = [];   // 연금사항데이터

		var pdtAtrbCod   = gDS['ds_ProdtTypeMtt'][0].PDT_ATRB_COD;
		var pdtAtrbDtlcd = gDS['ds_ProdtTypeMtt'][0].PDT_ATRB_DTLCD;

		// 연금/변액(연금)
		if ('G' == pdtAtrbCod || ('J' == pdtAtrbCod && '2' == pdtAtrbDtlcd)) {
			// TODO: $("#연금설정관련DOM").show();
			/**
			 * antyData => 연금유형코드(ANTY_DFR_TYP_COD)가 중복되지 않은 새배열을 취득 가입설계에서 연금을
			 * 하나만 선택 가능 (복수연금불가) => 연금지급유형은 하나!
			 */ 
			 // 연금기본정보 설정 (밑바탕정보)
			var antyData = dcUtil.getDupRmvArr(gDS['ds_AntyMtt'], 'ANTY_DFR_TYP_COD')[0];  
			// 조회된 연금사항 설정 (밑바탕정보를 조회된 정보로 update)
			if (gDS['DS_QTT_ANTY_INF'].length > 0) {
				var qttAntyData = $.grep(gDS['DS_QTT_ANTY_INF'], function(p){if( p.ANTY_DFR_TYP_COD == antyData.ANTY_DFR_TYP_COD)return true;})[0];
				antyData.INDTY_CPLTYP_SECD 	= qttAntyData.INDTY_CPLTYP_SECD;
				antyData.ANTY_GUA_PRID_COD 	= qttAntyData.ANTY_GUA_PRID_COD;
				antyData.ANTY_CRTN_PRID_COD = qttAntyData.ANTY_CRTN_PRID_COD;
				antyData.ANTY_GI_FORM_COD 	= qttAntyData.ANTY_GI_FORM_COD;
				antyData.ANTY_GI_PRID_COD  	= qttAntyData.ANTY_GI_PRID_COD;
				antyData.ANTY_GRICRT_COD	= qttAntyData.ANTY_GRICRT_COD;
				antyData.ANTY_DFR_CYCL_COD	= qttAntyData.ANTY_DFR_CYCL_COD;
				antyData.ANTY_RFD_RTO 		= qttAntyData.ANTY_RFD_RTO;
				antyData.PRDCD 				= qttAntyData.PRDCD;
			}
			gDS['DS_ANTY_MTT'].push(antyData);
		}
	};


	/**
	 * 기타정보 설정
	 */
	function fnSetEtcInfo() {
		
		var basData = gDS['DS_SUS_CTR_BAS'][0];		// 청약계약기본정보

		// TODO: 해피콜 종류, 연락처
		// TODO: 통화가능 시간
		
		// 모집경로
		dcUtil.setCdSelect(null, gDS['DS_CMB_MOJIB'], '#cmbMojib');
		$('#cmbMojib').val(basData.SUS_COL_CORS_KNCD);
	
		// 세금우대 금액
		if ('1' == gDS['ds_ProdtTypeMtt'][0].TXPF_TGT_YN) {	// 세금우대가능여부 존재
			// 심사시 필요한 정보를 세팅 한다.
			if(gDS["DS_OTR"].length < 1){
				gDS["DS_OTR"].push({});
				gDS["DS_OTR"][0].TXPF_POSA = basData.TXPF_POSA;
			}

			$('#txpfPosa').val(dcUtil.addCommas(basData.TXPF_POSA));		// 세금우대가능금액
		} else {	// 세금우대가능 여부 미존재
			$('#li_Txpf').hide();
			$('#cmbInfMnbdSctn').val('');
		}

		// 실손보험 청약시 의료급여 수급권자 세팅
		if (!stringUtil.isNull($.grep(gDS['DS_NTPRD_MTT'], function(p){if('5' == p.PLOS_PDT_KNCD)return true;}))) {
			$('input[name=rdoPlosSadr][value='+ basData.PLOS_SADR_YN +']').prop('checked', true);	
		} else {
// $('#li_rdoPlosSadr').addClass('none');
		}

		// 선납횟수 TODO: 최대선납횟수를 미리 조회하여 data-max에 세팅해놓아야 함
		$('#spnPrpmNumtm').data('max', basData.PRPM_NCSE || '0').val(basData.PRPM_NCSE || '0');

		// 의무납입기간
		if ('1' == gDS['ds_ProdtTypeMtt'][0].OBLG_PYM_YN) {	// 의무납입가능
			$('#cmbOblgPym').val(gDS['ds_OblgPymMtcntMtt'][0].OBLG_PYM_MTCNT || '');
		}

		// -- hidden value --
		$('#rdoLgamDcMetd').val(basData.LGAM_DC_METD_COD);		// 고액할인방법
		$('#rdoChdAdDcMetd').val(basData.CHD_AD_DC_METD_COD);	// 다자녀할인적립
		$('#edtChdCnt').val(basData.CHD_CNT);					// 자녀 수

		// TODO: 추가납입금액 :: 현재 사용 X? 최종 심사, 저장 시 ADPYM_POSA = '' 으로 세팅하면 됨
	};


	/**
	 * 펀드사항 설정
	 */
	function fnSetVarMtt(_callback) {
		// FIXME: 이 작업이 불필요 할 수도 있음..
		gDS['DS_FUND_INF'] = [];
		gDS['DS_FUND_WKG_INF'] = [];

		// 펀드관련 상품 아닌 경우 return
		if ('J' != gDS['ds_ProdtTypeMtt'][0].PDT_ATRB_COD) {
			return;
		}

		// 펀드운용옵션 :: 펀드자동재분배, 평균분할투자 콤보 데이터 조회 후 펀드 정보 세팅
		var codSet = [{cod: '00078', codDs: 'DS_FUND_COD' }];	
		dcUtil.cf_getCdListByMultiCatCd(codSet, function(result) {

			fnSetGlobalDs(result.remoteResult.outDataSet);
			
			// * ds_VarMtt(변액사항)로 기본 펀드선택 정보 DS_FUND_INF SET
			// -----------------------------------------------------
			gDS['DS_FUND_INF'] = dcUtil.getDupRmvArr(gDS['ds_VarMtt'], 'FDCD');	

	
			// 펀드 정렬
			if (gDS['DS_FUND_INF'].length > 0) {
				
				if ('HI' == gDS['DS_FUND_INF'][0].PRDCD.substring(0,2)) {
					// 마이솔루션S HI
					// AI액티브/AI밸런스/AI세이프/AI글로벌/버크셔/인덱스/글로벌채권/채권/MMF
					var sort = ["A01401", "A01501", "A01601", "A02101", "A02201", "U01501", "U01801", "U01101", "A02501"];
					$.each(gDS['DS_FUND_INF'], function(idx, o) {
						o["SEQ"] = sort.indexOf(o.FDCD);
					});
					gDS['DS_FUND_INF'].sort(function(a, b){return a["SEQ"] - b["SEQ"]; });
				}
			}
			
			
			// * 조회된 DS_QTT_FUND_INF 로 펀드선택(펀드비율)정보 DS_FUND_INF 를 update
			// ----------------------------------------
			if (gDS['DS_QTT_FUND_INF'].length > 0) {
				var qttFund 	 = {};	
				var fundInfoDom  = '';
				
				// 펀드비율 리스트 DOM 생성
				$.each(gDS['DS_FUND_INF'], function(idx, item){
					qttFund 		  = $.grep(gDS['DS_QTT_FUND_INF'], function(p){ return item.FDCD == p.FDCD })[0];
					item.CHK 		  = stringUtil.isNull(qttFund) ? '0' : '1';
					item.FUND_INP_RTO = stringUtil.isNull(qttFund) ? '0' : qttFund.FUND_INP_RTO;

					fundInfoDom += '<li data-fdcd="' + item.FDCD + '">';
					fundInfoDom +=		'<label class="w60p" for="chk_fund' + item.FDCD + '">';
					fundInfoDom += 			'<input type="checkbox" id="chkFund' + (idx+1) + '" value="' + (idx+1) + '" class="chkFund" ' + ((item.CHK=="1")? "checked":"") + ' />' + item.FUND_NAM;
					fundInfoDom += 		'</label>';
					fundInfoDom += 		'<div>';
					fundInfoDom += 			'<input id="txtFund' + (idx+1) + '" value="' + item.FUND_INP_RTO + '" title="' + item.FUND_NAM +' 입력" class="inp-wrap ta-r txtFund" type="tel"' + ((item.CHK=="1")? "":"disabled") + ' />';
					fundInfoDom += 			'<span class="dash">%</span>'
					fundInfoDom += 		'</div>';
					fundInfoDom += '</li>';
				});

				$('#DS_FUND_INF').append(fundInfoDom);
				
				// 펀드정보
				$("[id*=chkFund]").on('click', function() {
					console.log("click>>", $(this).prop('checked'));
					if($(this).prop('checked')) {
						$('#txtFund' + $(this).val()).prop('disabled', false);
					} else {
						$('#txtFund' + $(this).val()).val(0);
						$('#txtFund' + $(this).val()).prop('disabled', true);
					}
				});
			}
			
			// * 조회된 DS_QTT_FUND_WKG_INF 로 펀드운영옵션 정보 DS_FUND_WKG_INF 를 create
			// --------------------------------------

			dcUtil.setCdSelect(null, gDS['DS_FUND_COD'], '#cmbAutReDst');		// 펀드자동재분배
																				// 콤보
																				// SET
			$("#cmbAutReDst").val('0');
			dcUtil.setCdSelect(null, gDS['DS_FUND_COD'], '#cmbAvgPtilIvst');	// 평균분할투자
																				// 콤보
																				// SET
			
			if (gDS['DS_QTT_FUND_WKG_INF'].length > 0) {
				var srcWkgInf = gDS['DS_QTT_FUND_WKG_INF'][0];
				gDS['DS_FUND_WKG_INF'].push({
					AUT_RE_SHAR_CYCL_COD: srcWkgInf.AUT_RE_SHAR_CYCL_COD || '0',
					ADPRM_INCN_YN: srcWkgInf.ADPRM_INCN_YN || '0',
					AVG_PTIL_IVST_DLNG_SECD: srcWkgInf.AVG_PTIL_IVST_DLNG_SECD || '0'
				});
				// 펀드자동재분배, 추가보험료 포함, 평균분할투자 값 SET
				$('#cmbAutReDst').val(gDS['DS_FUND_WKG_INF'][0].AUT_RE_SHAR_CYCL_COD);
				$('input[name=chkAdprmYn][value="' + gDS['DS_FUND_WKG_INF'][0].ADPRM_INCN_YN + '"').prop('checked', true);
				$('#cmbAvgPtilIvst').val(gDS['DS_FUND_WKG_INF'][0].AVG_PTIL_IVST_DLNG_SECD);
			}

			// FIXME: ? ASIS주석 / 하드코딩 - 희망담은변액연금보험상품 일 경우 펀드자동재배분 콤보 disabled
			if ('FD' == gDS['DS_FUND_INF'][0].PRDCD.substring(0,2)) {
				// DS_FUND_WKG_INF / AUT_RE_SHAR_CYCL_COD
				$('#cmbAutReDst').prop('disabled', true);
			}
			// 1223 체크박스 1개 100%일 때 cmbAutReDst selectBox disabled처리
			var chkSum = 0;
			var chkCnt = gDS["DS_FUND_INF"].length;
			for(var i = 0; i < chkCnt; i++){
				var chkInfNum = parseInt(gDS["DS_FUND_INF"][i].CHK);
				chkSum += chkInfNum;
			}
			// 단일펀드 및 다중펀드중 1개의 펀드에 100% 설정했을 때
			if (chkSum == 1) { 
				$('#cmbAutReDst').prop('disabled', true);
			}else{
				$('#cmbAutReDst').prop('disabled', false);
			}
			
			 // 평균분할투자 1 가능 : 하지 않다면
			if ('1' != gDS['ds_ProdtTypeMtt'][0].AVG_PTIL_IVST_YN) { 
				// DS_FUND_WKG_INF / AVG_PTIL_IVST_DLNG_SECD
				$('#cmbAvgPtilIvst').prop('disabled', true);
			}

			// * 목표수익율 정보를 SET (컴포넌트는 일단 없음) FIXME:
			// -------------------------------------------------------------
			$('#cmbGolPrfr').val(gDS['DS_QTT_FUND_WKG_INF'][0].GOL_PRFR || '');	// cmbGolPrfr
																				// hidden
																				// input
			if ('1' == gDS['ds_ProdtTypeMtt'][0].GOL_PRFR_YN) {
				$('#cmbGolPrfr').val(gDS['ds_GolPrfrMtt'][0].GOL_PRFR);	
			}
		
			// * 적합성진단결과 정보를 SET
			// ------------------------------------------------------------------------------------------
			var polData = $.grep(gDS['DS_CTR_INTP_MTT_LIST'], function(p){if('11' == p.CTR_RLE_SECD)return true;} )[0];	// 계약자정보
			var polCsPk  = polData.CS_PK;
			var polCsNam = polData.CS_NAM;
			var polRrn   = polData.RRN;
			var prpsNam = '';		// 투자성향
			if (!stringUtil.isNull(gDS['DS_MAI_INF'][0].PLYNO)) {	// 증권번호가 존재
				// INS_DS_VAR_FIT_DIAG 변액투자적합정보
				var diagInfo_1 = $.grep(gDS['INS_DS_VAR_FIT_DIAG'], function(p){if(p.CS_PK == polCsPk && p.CS_NAM == polCsNam && p.CSNUM === polRrn)return true;})[0];

				if (!stringUtil.isNull(diagInfo_1)) {	
					// DIAG_YN 진단 여부?
					prpsNam = '0' == diagInfo_1.DIAG_YN ? '불원' : setInsCrtPrpsNam(diagInfo_1.INS_CTR_PRPS, diagInfo_1.RCM_INS_PDT);
				} else {
					diagInfo_1 = $.grep(gDS['INS_DS_VAR_FIT_DIAG'], function(p){if(p.CHN_CS_PK == polCsPk && p.CS_NAM == polCsNam && p.CSNUM === polRrn)return true;})[0];
					
					if (!stringUtil.isNull(diagInfo_1)) {	
						prpsNam = '0' == diagInfo_1.DIAG_YN ? '불원' : setInsCrtPrpsNam(diagInfo_1.INS_CTR_PRPS, diagInfo_1.RCM_INS_PDT);
					} 
				}
			} else {
				// 증권번호가 없는 경우는 채널 CS_PK, CS_NAM, CSNUM 로 존재유무 확인
				if (gDS['INS_DS_VAR_FIT_DIAG'].length > 0) {
					var diagInfo_2 = $.grep(gDS['INS_DS_VAR_FIT_DIAG'], function(p){if(p.CHN_CS_PK == polCsPk && p.CS_NAM == polCsNam && p.CSNUM === polRrn)return true;} )[0];
					
						if (!stringUtil.isNull(diagInfo_2)) {	
						prpsNam = '0' == diagInfo_2.DIAG_YN ? '불원' : setInsCrtPrpsNam(diagInfo_2.INS_CTR_PRPS, diagInfo_2.RCM_INS_PDT);
					}
				}
			}
			// dialog.alert("processing >> " + gData.FNC_SPND_CD + " / prpsNam >
			// " + prpsNam);
			// 전문금융소비자인경우 적합성진단결과 값 처리로직 추가, 전문금융소비자 > 데이터 없음
			if(gData.FNC_SPND_CD == '1'){
				$('#edtVarFit').val("");	// 전문금융소비자 빈값처리

			}else{	
				$('#edtVarFit').val(prpsNam);	// 적합성진단결과 텍스트
				$('#edtVarFit').css('width', 'auto');
			}
			if(prpsNam == '불원'){
				$('input[name=chkPerVar]').prop('disabled', true);
			}
			// INS_CTR_PRPS 보험계약성향(투자성향)코드 글로벌에 SET
			var csPkColNm = ('N' != gVAL.loadMode && 'Q' != gVAL.loadMode) ? 'CS_PK' : 'CHN_CS_PK';
			var arr_INS_DS_VAR_FIT_DIAG = $.grep(gDS['INS_DS_VAR_FIT_DIAG'], function(p){if(p[csPkColNm] == polCsPk && p.CS_NAM == polCsNam && p.CSNUM === polRrn)return true;});
			gVAL.insCtrPrps = arr_INS_DS_VAR_FIT_DIAG.length > 0 ? arr_INS_DS_VAR_FIT_DIAG[0].INS_CTR_PRPS : "";
			// 부적합 보험계약 체결 체크여부는 저장데이터가 아니여서 조회된 값이 없음. 스크립트 처리용
		});
		
		if(_callback){
    		_callback();
    	}
	};
	
	/**
	 * 위험성 등급명
	 */
	function setInsCrtPrpsNam(INS_CTR_PRPS, RCM_INS_PDT) {

		if(INS_CTR_PRPS == "08") { // 위험선호형
			return '위험선호형(1등급)';
		} else if(INS_CTR_PRPS == "07") { // 적극투자형
			if(RCM_INS_PDT >= 41 && RCM_INS_PDT <= 60){
				return '적극투자형(3등급)';
			} else if(RCM_INS_PDT >= 61 && RCM_INS_PDT <= 70){
				return '적극투자형(2등급)'
			}
		} else if(INS_CTR_PRPS == "06") { // 위험중립형
			return '위험중립형(4등급)';
		} else if(INS_CTR_PRPS == "05") { // 안정추구형
			return '안정추구형(5등급)';
		} else if(INS_CTR_PRPS == "04") { // 위험회피형
			return '위험회피형 (6등급)';
		} else if(INS_CTR_PRPS == "00") { // 변액보험 부적합자
			return '변액보험 부적합자';
		}
		return '';
	}
	
	/**
	 * 위험성 등급 (M스마트 전용)
	 */
	function getDgrsClz(INS_CTR_PRPS, RCM_INS_PDT) {

		if(INS_CTR_PRPS == "08") { // 위험선호형(1등급)
			return 1;
		} else if(INS_CTR_PRPS == "07") { // 적극투자형
			if(61 <= RCM_INS_PDT && RCM_INS_PDT <= 70){
				return 2; 		// 적극투자형(2등급)
			}
			else if(41 <= RCM_INS_PDT && RCM_INS_PDT <= 60){
				return 3; 		// 적극투자형(3등급)
			}
		} else if(INS_CTR_PRPS == "06") { // 위험중립형(4등급)
			return 4;
		} else if(INS_CTR_PRPS == "05") { // 안정추구형(5등급)
			return 5;
		} else if(INS_CTR_PRPS == "04") { // 위험회피형(6등급)
			return 6;
		} else if(INS_CTR_PRPS == "00") { // 변액보험 부적합자
			return 0;
		}
		return -1;
	}


	/**
	 * 우편물,증권,약관 수령 설정
	 */
	function fnSetPatAddr(_callback) {
		var maig;
		var inspo = '0'; // 기본은 방문수령

		if (!stringUtil.isNull(gDS['DS_SUS_CTR_INTP'])) {	// 청약에서 왔을때
			maig = gDS['DS_SUS_CTR_INTP'][0].MAIG_RVPL_COD;	// 우편물수령지 : 5자택, 6직장
		}

		// * 약관수령 -------------------------------------------
		// TODO: 추가된 정보...

		/**
		 * 주소,이메일 정보 -------------------------------------- 계약자 정보를 화면에 보여줌 정보
		 * 기간계를 디폴트 없으면 채널계 정보 보여줌
		 */
		// 계약자, 피보험자 주소사항 SET
		gDS['DS_ADDR_POHD'] = $.extend(true, [], gDS['DS_SUS_ADR_POHD']); 		// 계약자
		gDS['DS_ADDR_MAIPSN'] = $.extend(true, [], gDS['DS_SUS_ADR_MAIPSN']); 	// 피보험자


		/***********************************************************************
		 * 기간계를 먼저 체크하고 기간계 주소가 없을 시에 재널계 정보를 넣던 로직
		 **********************************************************************/

		/*
		 * --------------------------------------------------------------------------------------------------------------------------------------------------
		 * BZ_SECD
		 * --------------------------------------------------------------------------------------------------------------------------------------------------
		 * 1: 기간계, 2:채널계
		 * 
		 * --------------------------------------------------------------------------------------------------------------------------------------------------
		 * CNTAD_SECD 연락처 구분코드
		 * --------------------------------------------------------------------------------------------------------------------------------------------------
		 * 2 주소 , 3 : 전화번호 , 4 : 팩스 , 22: 휴대전화 , 23: 이메일 , 25: 자택주소 , 26: 직장주소 ,
		 * 35: 자택전화 , 36: 직장전화 , 99: 전체
		 * 
		 * --------------------------------------------------------------------------------------------------------------------------------------------------
		 * CNTAD_BLN_SECD
		 * --------------------------------------------------------------------------------------------------------------------------------------------------
		 * 5 자택, 6 직장
		 */

		// 이메일
		dcUtil.setCdSelect('""|선택', gDS['DS_DMN_COD'], '#dmnSecd'); 

		// 채널계 주소
	 	var maig = $("[name=cmbMaigRvpl]:checked").val();
	 	if(stringUtil.isNull(maig)){ // default는 자택으로 한다.
	 		maig= "5"; 
	 	}
		var addrData  = gDS['DS_ADDR_POHD'].find(function(o){if(o.BZ_SECD == '2' && o.CNTAD_SECD == '2' && o.CNTAD_BLN_SECD == maig)return true;});
		

		if(stringUtil.isNull(addrData)){ // 조회된 값이 없으면 자택주소를 가져온다.
			maig= "5"; 
			addrData = 	gDS['DS_ADDR_POHD'].find( function(o){if(o.BZ_SECD == '2' && o.CNTAD_SECD == '2' && o.CNTAD_BLN_SECD == maig)return true;} );
		}

		if(stringUtil.isNull(addrData)){ // 자택 주소가 없으면 [직장]주소를 가져온다.
			maig= "6"; 
			addrData = 	gDS['DS_ADDR_POHD'].find( function(o){if(o.BZ_SECD == '2' && o.CNTAD_SECD == '2' && o.CNTAD_BLN_SECD == maig)return true;} );
		}

		if(!stringUtil.isNull(gDS['DS_SUS_CTR_INTP']) && !stringUtil.isNull(gDS['DS_SUS_CTR_INTP'][0].MAIG_RVPL_COD)){
			$("[name=cmbMaigRvpl]").prop('checked', false);
			$("[name=cmbMaigRvpl][value=" + gDS['DS_SUS_CTR_INTP'][0].MAIG_RVPL_COD + "]").prop('checked', true);
			$("[name=cmbMaigRvpl][value=" + gDS['DS_SUS_CTR_INTP'][0].MAIG_RVPL_COD + "]").trigger('change');
		}else{
			$("[name=cmbMaigRvpl]").prop('checked', false);
			$("[name=cmbMaigRvpl][value=" + maig + "]").prop('checked', true);
			$("[name=cmbMaigRvpl][value=" + maig + "]").trigger('change');
		}


		// 채널계 이메일
		var emailData = gDS['DS_ADDR_POHD'].find(function(o){if(o.BZ_SECD == '2' && o.CNTAD_SECD =='23')return true;});
		
		if(!stringUtil.isNull(emailData)) {
		
			$('#div_email_show').text(emailData.EMAL_ID_NAM + '@' + emailData.DMN_NAM);
			$('#email_main').show();
		}else{
			$('#div_email_show').text("");
			$('#email_main').hide();
		}

		
		// 약관전달방법
		$("[name=sInsutrmsDlvryMthdCod]").prop('checked', false);
		if(!stringUtil.isNull(gDS["DS_SUS_CTR_BAS"])){
			var val_INSUTRMS_DLVRY_MTHD_COD =  stringUtil.isNull(gDS["DS_SUS_CTR_BAS"][0].INSUTRMS_DLVRY_MTHD_COD) ?  "01"  : gDS["DS_SUS_CTR_BAS"][0].INSUTRMS_DLVRY_MTHD_COD;
			var selected_sInsutrmsDlvryMthdCod = $("[name=sInsutrmsDlvryMthdCod]:checked").val();

			/*
			 * 약관수령 값이 [01 : 모바일 , 02 : 이메일 , 03 : 종이] 중에 없으면
			 */
			if(
				val_INSUTRMS_DLVRY_MTHD_COD != "01" && val_INSUTRMS_DLVRY_MTHD_COD != "02" && val_INSUTRMS_DLVRY_MTHD_COD != "03"
			){
				val_INSUTRMS_DLVRY_MTHD_COD = "01";
			}

			$("[name=sInsutrmsDlvryMthdCod][value=" + val_INSUTRMS_DLVRY_MTHD_COD + "]").prop('checked', true);
			
		}else{
			$("[name=sInsutrmsDlvryMthdCod][value=01]").prop('checked', true);
		}

		emailChange(); // 증권수령, 약관수령 중 하나라도 이메일 선택한 것이 있으면 이메일을 나타낸다.
		
		if(_callback){
    		_callback();
    	}
	};

	/**
	 * 개인정보동의 설정
	 */
	function fnSetIndInf(_callback) {

		if (stringUtil.isNull(gVAL.susNum)) {
			if(_callback){
	    		_callback();
	    	}
			return;
		}

		var args = {
			"_SUSNUM": gVAL.susNum,						// 청약번호
			"_PLYNO": gDS['DS_MAI_INF'][0].PLYNO || "",	// 증권번호
			"remote": convertUtil.getRemoteObj("FG_SusCrtn", "UDQ03")
		};
		
		// 통신 - OutDS : DS_CsInf24, DS_InsctIntp
		D.http.ajax("/sw/swAllCC", args)
		.then(function(result){
			if(result.errorMsg){ 
				alert(result.errorMsg); 
				return; 
			}
			if (result.remoteResult) {

				// 결과 DS 세팅
				fnSetGlobalDs(result.remoteResult.outDataSet);

				if (gDS['DS_CsInf24'].length > 0) { 

					// 계약관계자에 대한 동일인 체크코드 SET
					var ctrPk  = $.grep(gDS['DS_InsctIntp'],function(p){if('11' == p.CTR_RLE_SECD)return true;})[0].CS_PK;		// 계약자
																																// 고객번호
					var mpsnPk = $.grep(gDS['DS_InsctIntp'], function(p){if('21' == p.CTR_RLE_SECD)return true;})[0].CS_PK;		// 주피보험자
																																// 고객번호
					
					gVAL.rlpCd = ctrPk == mpsnPk ? '210' : '200';	// 210 계피동일,
																	// 200 계피상이
					
					var inf24 = gDS['DS_CsInf24'][0];
					
					// 보험수익자 지정, 변경관련 동의
					$('input[name=bChkBnfcDstnY][value=' + (Number(inf24.BNFC_DSTN_YN) > 0 ? '1':'0') + ']').prop('checked', true);

					// 통신수단을 이용한 해지 동의
					$('input[name=bChkCnctrAgrmY][value=' + (Number(inf24.CNCTR_AGRM_YN) > 0 ? '1':'0') + ']').prop('checked', true);
				
					$('input[name=PDT_AGDC_SD][value=' + (Number(inf24.PDT_AGDC_SD) > 1 ? '2':'1') + ']').prop('checked', true);
					// $('input[name=mPsnChkCrinf24Y][value=' +
					// (Number(inf24.mPsnChkCrinf24Y) > 0 ? '1':'0') +
					// ']').prop('checked', true);
					$('input[name=mPsnChkCrinf24Y][value=' + (Number(inf24.ARTCL24_AGRM_YN) > 0 ? '1':'0') + ']').prop('checked', true);
					
					$('input[name=ADVM_OFR_YN][value=' + (Number(inf24.ADVM_OFR_YN) > 0 ? '1':'0') + ']').prop('checked', true);
					
					// $('input[name=mPsnChkCrinf24OfrY][value=' +
					// (Number(inf24.mPsnChkCrinf24OfrY) > 0 ? '1':'0') +
					// ']').prop('checked', true);
					$('input[name=mPsnChkCrinf24OfrY][value=' + (Number(inf24.ARTCL24_OFR_YN) > 0 ? '1':'0') + ']').prop('checked', true);

					// 가입권유 연락방식
					$('#chkCntcMdTdTel').prop('checked', inf24.CNTC_MDTD_TEL_YN == '1');
					$('#chkCntcMdTdSns').prop('checked', inf24.CNTC_MDTD_SNS_YN == '1');
					$('#chkCntcMdTdEmal').prop('checked', inf24.CNTC_MDTD_EMAL_YN == '1');
					$('#chkCntcMdTdPmil').prop('checked', inf24.CNTC_MDTD_PMIL_YN == '1');

					$("[name=chkCntcMdTd]").trigger('change');
					
					if(_callback){
			    		_callback();
			    	}
				}
			} else {
				D.logger.error('통신 중 에러가 발생했습니다. 에러메세지코드 [' + (result.errorMsg || '') + ']');
				dialog.handLoading(false);
			}
		});
	};
	
	/**
	 * 헬스케어 설정
	 */
	function fnSetHealthMtt() {
		// FIXME:
		var pdtPculCod = "";
		var pdtPculDtlcd = "";
		if(gDS['ds_HealthMtt'].length > 0) {
			pdtPculCod = gDS['ds_HealthMtt'][0].PDT_PCUL_COD || '';
			pdtPculDtlcd = gDS['ds_HealthMtt'][0].PDT_PCUL_DTLCD || '';
		}
		
		// 조건이되면 헬스케어신청DOM show
		if ('006' == pdtPculCod && (Number(pdtPculDtlcd) >= 1 && Number(pdtPculDtlcd) <= 10)) { // pdtPculDtlcd
																								// 1 ~
																								// 8
			$('#divHealth').removeClass('none');
			$('input[name=rdoHealth][value=1]').prop('checked', true);
		}

		// 조건이되면 장애인전용보험DOM show
		if (true) { // pdtPculDtlcd 1 ~ 8
			$('#divDis').show();
			$('input[name=rdoDis][value=1]').prop('checked', true);
		}
		
		// SVC_NTRY_YN:1 => 체크박스0:신청 or 반대의 경우
		if(!stringUtil.isNull(gDS['DS_INSCT_SVC_INF'])){
			$.each(gDS['DS_INSCT_SVC_INF'], function(index, item){
				if ('26' == item.SVC_TRT_COD) {
					$('input[name=rdoHealth][value="' + (item.SVC_NTRY_YN == '1' ? '0':'1') + '"]').prop('checked', true);
					return;
				}
			})
		}
	};

	// 장애인 데이터 화면 세팅
	function setDspsData() {
		var opcode;

		if(undefined != gDS['DS_DSPS_M'] && null != gDS['DS_DSPS_M']){  // 피보험자
			
			var M_cs_pk = gDS['DS_DSPS_M'][0].CS_PK;
			var M_obs_yn = gDS['DS_DSPS_M'][0].OBS_YN;
			var M_rle_secd =  gDS['DS_DSPS_M'][0].CTR_RLE_SECD;
			var M_ymd = gDS['DS_DSPS_M'][0].END_YMD;
			var M_Aymd = gDS['DS_DSPS_M'][0].APPL_YMD;
			
			$("#dsps0").prop('checked', true);	
			dspsIn();
			$("#chdsps01").prop('checked', true);	
			$("#chdsps02").prop('checked', false);
		
			dspsCheck();
			
			if(M_obs_yn == "1"){ // 영구
				$("[name=RL_OWNR_YN001][value=Y]").prop('checked', true);
				$("#maipsn_end_date").val("9999-12-31");
				$("#maipsn_end_date").prop('disabled',true);
			}else{ // 한시
				$("[name=RL_OWNR_YN001][value=N]").prop('checked', true);
			   $("#maipsn_end_date").val(M_ymd.replace(/^([0-9]{4})([0-9]{2})([0-9]{2})/g, "$1-$2-$3"));
			   $("#maipsn_end_date").prop('disabled',false);
			}

		}else if(undefined != gDS['DS_DSPS_Y'] && null != gDS['DS_DSPS_Y']){  // 수익자

			var Y_cs_pkE = gDS['DS_DSPS_Y'][0].CS_PK;
			var Y_cs_pkH = gDS['DS_DSPS_Y'][1].CS_PK;
			var Y_cs_pkD = gDS['DS_DSPS_Y'][2].CS_PK;
		
			var Y_obs_ynE = gDS['DS_DSPS_Y'][0].OBS_YN;
			var Y_obs_ynH = gDS['DS_DSPS_Y'][1].OBS_YN;
			var Y_obs_ynD = gDS['DS_DSPS_Y'][2].OBS_YN;
			
			var Y_rle_secdE =  gDS['DS_DSPS_Y'][0].CTR_RLE_SECD;
			var Y_rle_secdH =  gDS['DS_DSPS_Y'][1].CTR_RLE_SECD;
			var Y_rle_secdD =  gDS['DS_DSPS_Y'][2].CTR_RLE_SECD;
			
			var Y_ymd_E = gDS['DS_DSPS_Y'][0].END_YMD;
			var Y_ymd_H = gDS['DS_DSPS_Y'][1].END_YMD;
			var Y_ymd_D = gDS['DS_DSPS_Y'][2].END_YMD;

			var Y_Aymd_E = gDS['DS_DSPS_Y'][0].APPL_YMD;
			var Y_Aymd_H = gDS['DS_DSPS_Y'][1].APPL_YMD;
			var Y_Aymd_D = gDS['DS_DSPS_Y'][2].APPL_YMD;
			
			$("#dsps0").prop('checked', true);
			dspsIn();
			$("#chdsps01").prop('checked', false);	
			$("#chdsps02").prop('checked', true);
			
			dspsCheck();

			if(Y_obs_ynE == "1"){ // 영구
				$("[name=RL_OWNR_YN011][value=Y]").prop('checked', true);
				$("#expi_end_date").val("9999-12-31");
				$("#expi_end_date").prop('disabled',true);
			}else{ // 한시
				$("[name=RL_OWNR_YN011][value=N]").prop('checked', true);
				$("#expi_end_date").val(Y_ymd_E.replace(/^([0-9]{4})([0-9]{2})([0-9]{2})/g, "$1-$2-$3"));
				$("#expi_end_date").prop('disabled',false);
			}
			
			if(Y_obs_ynH == "1"){
				$("[name=RL_OWNR_YN21][value=Y]").prop('checked', true);
				$("#hspz_end_date").val("9999-12-31");
				$("#hspz_end_date").prop('disabled',true);
			}else{
				$("[name=RL_OWNR_YN21][value=N]").prop('checked', true);
				$("#hspz_end_date").val(Y_ymd_H.replace(/^([0-9]{4})([0-9]{2})([0-9]{2})/g, "$1-$2-$3"));
				$("#hspz_end_date").prop('disabled',false);
			}

			if(Y_obs_ynD == "1"){
				$("[name=RL_OWNR_YN31][value=Y]").prop('checked', true);
				$("#dth_end_date").val("9999-12-31");
				$("#dth_end_date").prop('disabled',true);
			}else{
				$("[name=RL_OWNR_YN31][value=N]").prop('checked', true);
				$("#dth_end_date").val(Y_ymd_D.replace(/^([0-9]{4})([0-9]{2})([0-9]{2})/g, "$1-$2-$3"));
				$("#dth_end_date").prop('disabled',false);
			}
		}
	};
	
	function dspsIn() {
		$("[name=li_dsps]").hide();
		if($("[name=dsps]:checked").val() == "1"){
			$("[name=li_dsps]").show();
			$("#li_maipsn").show();
		}else{
			$("[name=li_dsps]").hide();
		}
	};
	
	/*
	 * 장애인전용보험 전환 [주피보험자,수익자]
	 */
	function dspsCheck(){
		$("#li_maipsn").hide();
		$("#li_expi").hide();
		$("#li_hspz").hide();
		$("#li_dth").hide();
		
		var csPk = $("#sel_csPk_47").val();
		
		var selected_dspsCh = $("[name=dspsCh]:checked").val();
		
		if(selected_dspsCh == "01" ){ 
			$("#li_maipsn").show();
		}else if(selected_dspsCh == "02" ){
			if(csPk == "1"){ // 일단해제
				$("#chdsps01").prop('checked',true);
				$("#chdsps02").prop('checked',false);
				dialog.alert("사망시 수익자가 법정상속인인 경우 신청이 불가합니다.");
				dspsCheck();
			}else{
			$("#li_expi").show();
			$("#li_hspz").show();
			$("#li_dth").show();
			}
		}
	};

	/**
	 * 지정대리청구인 가족고객리스트 세팅
	 */
	function fnSetClmrInfo() {
		console.log("fnSetClmrInfo>>");
		/*
		 * DESCRIPTION 지정대리청구인 가족 콤보 체인지 DS_FAM_CS의 CS_NAM, RRN, CS_RLP_SECD 를
		 * DS_CMB_CTRINTP_CSRLP :: $(this).val() ==> RRN 로 가져와서 DS_DSTN_PX_CLMR에
		 * 업데이트 지정대리청구인 지정하려면 만기,장해 둘다 선택필수. 지정안하려면 둘다 안해야 함. => DS_DSTN_PX_CLMR
		 * 를 [] 로 초기화
		 */
		
		/**
		 * 지정청구대리인 - 지정범위 계/피/수 동일경우만 지정가능 - 지정청구대리인 미성년 불가 - 지정가능 관계 : 배우자, 부모,
		 * 자녀, 조부모, 손주, 형제자매, 친척, 외조부모 (3촌까지)
		 */
		var arr_DS_CTR_INTP_MTT_LIST =  $.grep(gDS["DS_CTR_INTP_MTT_LIST"], function(obj){
			/* 계약역할구분코드 :: [11:계약자 , 21: 주피보험자, 41: 만기수익자, 42: 장해수익자, 47:사망수익자] */
			if((obj.CTR_RLE_SECD == '11' || obj.CTR_RLE_SECD == '21' || obj.CTR_RLE_SECD == '41' || obj.CTR_RLE_SECD == '42') && obj.CS_NAM != null){
	
				return true; 
			}
		});
		var sIdx     = $.map(arr_DS_CTR_INTP_MTT_LIST, function(obj, index){if(obj.CTR_RLE_SECD == '21'){return index; } })[0]; // 배열에서
																																// 주피보험자
																																// 배열
																																// 위치를
																																// 구한다.
		var jupi_NM  = arr_DS_CTR_INTP_MTT_LIST[sIdx].CS_NAM; // 주피보험자 이름을
																// 구한다.
		var arr_diff = $.grep(arr_DS_CTR_INTP_MTT_LIST, function(obj){if(obj.CS_NAM  != jupi_NM){return true; } }); // 주피보험자
																													// 이름과
																													// 틀린게
																													// 있는지
																												// 한다.
		var dstnPxClmrDemtYn = gDS['ds_ProdtTypeMtt'][0].DSTN_PX_CLMR_DEMT_YN; // 치매여부컬럼
																				// (1:
																				// 치매)
		var svcTrtCod = "";
		// * 지정대리청구인 저장값 SET ----------------------
		if (gDS['DS_DSTN_PX_CLMR_INF'].length > 0) {
			gDS['DS_DSTN_PX_CLMR'] = [
				{ CS_NAM: '', RRN: '', CS_RLP_SECD: '', DSTN_PX_SLCT_YN: '', DSTN_PX_NT_SLCT_INF_CD: '', GUBUN: '대표지정대리청구인 (만기, 장해)' },
				{ CS_NAM: '', RRN: '', CS_RLP_SECD: '', DSTN_PX_SLCT_YN: '', DSTN_PX_NT_SLCT_INF_CD: '', GUBUN: '지정대리청구인 (만기, 장해)' }
			];
			var cmb = [];
			// 대표지정대리청구인 (만기, 장해)
			var data = gDS['DS_DSTN_PX_CLMR_INF'][0];
			gDS['DS_DSTN_PX_CLMR'][0].CS_NAM 				 = data.EXPI_DSTN_PX_CLMR_NAM;
			gDS['DS_DSTN_PX_CLMR'][0].RRN 					 = data.EXPI_DSTN_PX_CLMR_RRN;
			gDS['DS_DSTN_PX_CLMR'][0].CS_RLP_SECD 			 = data.EXPI_DSTN_PX_CLMR_RLP;
			gDS['DS_DSTN_PX_CLMR'][0].DSTN_PX_SLCT_YN 		 = data.DSTN_PX_SLCT_YN;
			gDS['DS_DSTN_PX_CLMR'][0].DSTN_PX_NT_SLCT_INF_CD = data.DSTN_PX_NT_SLCT_INF_CD;
			cmb = $.grep(gDS['DS_CMB_CTRINTP_CSRLP'], function(p){if(p.COD_NAM == data.EXPI_DSTN_PX_CLMR_RLP)return true;})[0];
			
			gDS['DS_DSTN_PX_CLMR'][0].CS_RLP_SECD = cmb.COD;
			
			// 지정대리청구인 (만기, 장해)
			var data2 = gDS['DS_DSTN_PX_CLMR_INF'][1];
			gDS['DS_DSTN_PX_CLMR'][1].CS_NAM 				 = data2.EXPI_DSTN_PX_CLMR_NAM_2;
			gDS['DS_DSTN_PX_CLMR'][1].RRN 					 = data2.EXPI_DSTN_PX_CLMR_RRN_2;
			gDS['DS_DSTN_PX_CLMR'][1].CS_RLP_SECD 			 = data2.EXPI_DSTN_PX_CLMR_RLP_2;
			gDS['DS_DSTN_PX_CLMR'][1].DSTN_PX_SLCT_YN 		 = data2.DSTN_PX_SLCT_YN;
			gDS['DS_DSTN_PX_CLMR'][1].DSTN_PX_NT_SLCT_INF_CD = data2.DSTN_PX_NT_SLCT_INF_CD;
			cmb = $.grep(gDS['DS_CMB_CTRINTP_CSRLP'], function(p){if(p.COD_NAM == data2.EXPI_DSTN_PX_CLMR_RLP_2)return true;})[0];
			
			gDS['DS_DSTN_PX_CLMR'][1].CS_RLP_SECD = cmb.COD;

		} else {
			gDS['DS_DSTN_PX_CLMR'] = [];
			$("[name=mijijung]").val("");
		}
		if (gDS['ds_jijungInf'].length > 0) { // 지정대리청구인 제도성특약 상품정보 0
		
			try{
				gDS['ds_jijungInf'].forEach(function(o){ // 서비스 특약 코드 (19:제도성
															// 특약(치매, 간병 외 상품) /
															// 29:치매(간병)보험)
					
					if(o.SVC_TRT_COD == "29"){
						svcTrtCod = o.SVC_TRT_COD;
						throw new Error;
					}else if(o.SVC_TRT_COD == "19"){
						svcTrtCod = o.SVC_TRT_COD;
					}
				});
			}catch(e){
				
			}
// svcTrtCod = gDS['ds_jijungInf'][0].SVC_TRT_COD; //서비스 특약 코드 (19:제도성 특약(치매, 간병
// 외 상품) / 29:치매(간병)보험)
			/**
			 * 지정청구대리인 - 옴니청약이여도 선택 가능 - 선택 가능한 항목이 없으면 보여주지 않음 (2020-11-03)
			 */
			
			if(arr_diff.length >= 1) {
				console.log("계약관계자 다른경우 숨김", arr_diff);
				$("#ara_AdClmr").addClass("none");
				$("#mijijung").addClass("none");
			} else if(gDS.DS_CMB_CS_LIST == null || gDS.DS_CMB_CS_LIST.length == 0){
				console.log("계약관계자 리스트 없을경우 숨김", gDS.DS_CMB_CS_LIST);
				if(svcTrtCod == "19"){ 
					console.log("치매보험인 경우 없어도 보이게");
					$("#ara_AdClmr").removeClass("none");
					$("#mijijung").addClass("none");
					$("#famList").removeClass("none");
					$("[name=jijung_CS_NAM2]").attr('disabled', true);
				}else if(svcTrtCod == "29"){
					$("#ara_AdClmr").removeClass("none");
					$("#mijijung").removeClass("none");
					$("#famList").addClass("none");
				}else{
					$("#ara_AdClmr").addClass("none");
					$("#mijijung").addClass("none");
					$("#famList").addClass("none");
				}
			}else{
				if(svcTrtCod == "19"){ 
					console.log("치매보험인 경우 없어도 보이게");
					$("#ara_AdClmr").removeClass("none");
					$("#mijijung").addClass("none");
					$("#famList").removeClass("none");
					$("[name=jijung_CS_NAM2]").attr('disabled', true);
				}else if(svcTrtCod == "29"){
					$("#ara_AdClmr").removeClass("none");
					$("#mijijung").removeClass("none");
					$("#famList").addClass("none");
				}else{
					$("#ara_AdClmr").addClass("none");
					$("#mijijung").addClass("none");
					$("#famList").addClass("none");
				}
			}
			
		}
		
		// 개인고객정보 조회 :: arguments SET
		var conCsInfo = $.grep(gDS['DS_CTR_INTP_MTT_LIST'], function(p){if('11' == p.CTR_RLE_SECD)return true;})[0];	// 계약자고객
																														// 정보
		
		var indArgs = {
			"INQ_PLAN_NUM": gDS["DS_MAI_INF"][0].COL_PLAR_NUM,		// 주설계사 사번
			"INQ_CS_NAM"  : conCsInfo.CS_NAM,
			"INQ_RRN"     : conCsInfo.RRN,
			"remote": convertUtil.getRemoteObj("FG_AC_CsSrchPop", "UDQ01")
		};

		// 통신 1. 가족고객리스트르 조회하게 위해 개인고객의 정보를 조회...
		D.http.ajax("/cu/indvCsInq", indArgs)
		.then(function(indRst) {
			if(indRst.errorMsg){
				dialog.alert(indRst.text);
				return ;
			}
			if (indRst.remoteResult) {
				var maData = indRst.remoteResult.outDataSet.DS_MAI_CS.data;
				var rpsPrdcd = gDS['DS_MPRD_RPSPDT'][0].PRDCD;
				
				if (!stringUtil.isNull(maData)) {
					// 통신 2. 개인고객 CS_PK로 가족고객리스트 조회
					var famArgs = {
						"INQ_CS_PK"   : maData[0].CS_PK,
						"remote": convertUtil.getRemoteObj('FG_AC_CsSrchPop', 'UDQ02'),
						"PAGE" : "SUSFEEDINFOUTIL"
					};
					D.http.ajax('/cu/indvCsInq', famArgs)
					.then(function(famRst) {
						if(famRst.errorMsg){
							dialog.alert(famRst.text);
							return ;
						}
						if (famRst.remoteResult) {
							var famData = famRst.remoteResult.outDataSet.DS_FAM_CS.data;
							gDS['DS_FAM_CS'] = famData;
							if (famData.length > 0) {
								gDS["DS_DSTN_CS_LIST"]=gDS["DS_FAM_CS"];
								setCsListCmb(arr_diff); // 계약관계자 세팅
								if(!stringUtil.isNull(gData.dstnPxNtSlctInfCd)){ // 미지정
																					// 사유
																					// 있는
																					// 경우
									$("[name=mijijung]").val(gData.dstnPxNtSlctInfCd);
									$("[name=mijijung]").trigger('change');
								}else{ // 미지정 사유 없는 경우
									if(!stringUtil.isNull(gData.sel_rrn_41)) { // 지정대리청구인1
																				// 있는
																				// 경우
										$("[name=jijung_CS_NAM]").val(gData.sel_rrn_41);
										$("[name=jijung_CS_NAM]").trigger('change');
									} else if(gDS['DS_DSTN_PX_CLMR'].length > 0 && dateUtil.getRealAge(gDS["DS_DSTN_PX_CLMR"][0].RRN) > 18){ // 지정대리청구인
																																				// 정보
																																				// 있으면서
																																				// 미성년자가
																																				// 아닌
																																				// 경우
										$("[name=jijung_CS_NAM]").val(gDS['DS_DSTN_PX_CLMR'][0].RRN);
										$("[name=jijung_CS_NAM]").trigger('change');
									}
									if(!stringUtil.isNull(gData.sel_rrn_42)) { // 지정대리청구인2
																				// 있는
																				// 경우
										$("[name=jijung_CS_NAM2]").val(gData.sel_rrn_42);
										$("[name=jijung_CS_NAM2]").trigger('change');
									}
									if(svcTrtCod != "19" && svcTrtCod != "29"){ // 치매여부
																				// -
																				// 치매보험이
																				// 아닐
																				// 경우
										$("[name=jijung_CS_NAM2]").prop('disabled', true);
										$("[name=jijung_CS_NAM2]").val(""); // 만기수익자,
																			// 장해수익자
																			// clear
										$("[name=jijung_CS_NAM2]").closest("li").find('input').val("");
									}
								}
							}
						} else {
							D.logger.error('통신 중 에러가 발생했습니다. 에러메세지코드 [' + (famRst.errorMsg || '') + ']');
							dialog.handLoading(false);
						}
					});
				}
			} else {
				D.logger.error('통신 중 에러가 발생했습니다. 에러메세지코드 [' + (indRst.errorMsg || '') + ']');
				dialog.handLoading(false);
			}
		});
		
	};


	/*
	 * 
	 */ 
	function setCsListCmb(arr_diff){
		console.log("setCsListCmb in >>>>>>");
		
		gDS["DS_DSTN_PX_CLMR_POP"]  = gDS["DS_DSTN_PX_CLMR"];

	    var cnt 		     = gDS["DS_DSTN_CS_LIST"].length;
	    var rpsPrdcd 		 = gDS['DS_MPRD_RPSPDT'][0].PRDCD;
	    var dstnPxClmrDemtYn = gDS['ds_ProdtTypeMtt'][0].DSTN_PX_CLMR_DEMT_YN;	// 치매여부컬럼
																				// (1:
																				// 치매)
	    var svcTrtCod 		 = "";
        var $jijung_CS_NAM   = "";     // 대표지정대리청구인
        var $jijung_CS_NAM2  = "";   // 지정대리청구인
		if (gDS['ds_jijungInf'].length > 0) { // 지정대리청구인 제도성특약 상품정보
			try{
				gDS['ds_jijungInf'].forEach(function(o){ // 서비스 특약 코드 (19:제도성
															// 특약(치매, 간병 외 상품) /
															// 29:치매(간병)보험)
					if(o.SVC_TRT_COD == "29"){
						svcTrtCod = o.SVC_TRT_COD;
						throw new Error;
					}else if(o.SVC_TRT_COD == "19"){
						svcTrtCod = o.SVC_TRT_COD;
					}
				});
			}catch(e){
				
			}
		}	
	    gDS["DS_CMB_CS_LIST"] = [];
	    gDS["DS_CMB_CS_LIST"].push({});
		gDS["DS_CMB_CS_LIST"][0].RRN 	= "1";
		gDS["DS_CMB_CS_LIST"][0].CS_NAM = "선택안함";
	    
	    if (cnt > 0) {
	        for (var i = 0; i < cnt; i++) {
	            var CsRlpSecd = parseInt(stringUtil.nvl(gDS["DS_DSTN_CS_LIST"][i].CS_RLP_SECD, "0"));
	            if (CsRlpSecd >= 2 && CsRlpSecd <= 9 && dateUtil.getRealAge(gDS["DS_DSTN_CS_LIST"][i].RRN) > 18) {
	            	gDS["DS_CMB_CS_LIST"].push({});
	                var nRow = gDS["DS_CMB_CS_LIST"].length - 1;
	                gDS["DS_CMB_CS_LIST"][nRow].CS_NAM  		= 	gDS["DS_DSTN_CS_LIST"][i].CS_NAM;
	                gDS["DS_CMB_CS_LIST"][nRow].RRN  			= 	gDS["DS_DSTN_CS_LIST"][i].RRN;
	                gDS["DS_CMB_CS_LIST"][nRow].CS_RLP_SECD  	= 	gDS["DS_DSTN_CS_LIST"][i].CS_RLP_SECD;
	                gDS["DS_CMB_CS_LIST"][nRow].CS_RLP_SECD_NM  = 	gDS["DS_DSTN_CS_LIST"][i].CS_RLP_SECD_NM;
	              
	                $jijung_CS_NAM =  $("[name=jijung_CS_NAM]");     // 대표지정대리청구인
	                $jijung_CS_NAM2 =  $("[name=jijung_CS_NAM2]");   // 지정대리청구인
	                
	                // 중복등록 안되게 clear처리
	                $jijung_CS_NAM.html("");  							 // 대표지정대리청구인
																			// clear
	                $jijung_CS_NAM.closest("li").find('input').val("");  // 관계자
																			// 이름도
																			// 초기화
	                $jijung_CS_NAM2.html(""); 							 // 지정대리청구인
																			// clear
	                $jijung_CS_NAM2.closest("li").find('input').val(""); // 관계자
																			// 이름도
																			// 초기화
	                
	                $.grep(gDS["DS_CMB_CS_LIST"], function(obj){
	                	if(obj.RRN == "1"){
	                		 if(svcTrtCod == "29"){
	                			 $("<option/>").attr({value: obj.RRN}).html(obj.CS_NAM).appendTo($jijung_CS_NAM2); 
	                		 }else{
	                			 $("<option/>").attr({value: obj.RRN}).html(obj.CS_NAM).appendTo($jijung_CS_NAM); 
	                			 $("<option/>").attr({value: obj.RRN}).html(obj.CS_NAM).appendTo($jijung_CS_NAM2); 
	                		 }
	                	}else{
	                		$("<option/>").attr({value: obj.RRN}).html(obj.CS_NAM).appendTo($jijung_CS_NAM); 	
	                		$("<option/>").attr({value: obj.RRN}).html(obj.CS_NAM).appendTo($jijung_CS_NAM2); 	
	                	}
	                });
	            }
	        }
	        
            $jijung_CS_NAM.val(""); // 만기수익자, 장해수익자 clear
            $jijung_CS_NAM.closest("li").find('input').val(""); // 관계자 이름도 초기화
            $jijung_CS_NAM2.val(""); // 만기수익자, 장해수익자 clear
            $jijung_CS_NAM2.closest("li").find('input').val(""); // 관계자 이름도
																	// 초기화
            $("[name=mijijung]").val("");
	    }

	};


	// 계약관계자사항 data 설정
	function setCtrIntpMttForData(){
		console.log("setCtrIntpMttForData start");
		var  obj_userInfo = D.global.getUserInfo();
		gVAL["plarNo"] 		= obj_userInfo.empno; 				// 설계사번호
		gVAL["plarBrofc"] 	= obj_userInfo.brofccod; 			// 판매조직

		/***********************************************************************
		 * DS_CS_LIST 구성
		 * ----------------------------------------------------------------------------------------------------------------------------
		 * DS_CS_LIST 에 [본인]정보가 안넘어와 [법정상속인] 정보와 [본인] 정보를 추가
		 **********************************************************************/

		
		if(!stringUtil.isNull(gDS["DS_CS_LIST"]) && gDS["DS_CS_LIST"].findIndex( function(o){if(o.CS_PK == '1')return true;}) == -1){
			var objTmp = {};
			objTmp.CS_PK 		= 	"1";
			objTmp.CS_NAM 		= 	"법정상속인";
			objTmp.RRN 			= 	"1111111111111";
			objTmp.CS_RLP_SECD 	= 	"14";
			gDS["DS_CS_LIST"].push(objTmp);
		}
		D.logger.debug("-[가입설계 조회 완료]-");
		D.logger.debug(gDS);

		/*
		 * [상품명] 구성
		 */
		var val_mprdPrdcd = gVAL["maiPrdcd"]; // 주계약상품코드

		/***********************************************************************
		 * [DS_CTR_INTP_MTT_LIST] 를 구성한다. (계약정보 > 주계약관계자사항) 에 mapping 되는 정보
		 * ----------------------------------------------------------------------------------------
		 **********************************************************************/ 
		var str_DS_CS_LIST_INFO;
		if(!stringUtil.isNull(gVAL.qttNo)){ // 가설 번호가 있을 때는
			str_DS_CS_LIST_INFO = "DS_QTT_CS_LIST"; // 가설일때
		}else{
			str_DS_CS_LIST_INFO = "DS_CTR_INTP_MTT_LIST"; // 청약일때
		}

		var arr_DS_CS_LIST =  $.grep(gDS[str_DS_CS_LIST_INFO], function(obj){if(obj.CTR_RLE_SECD=='11'||obj.CTR_RLE_SECD=='21'||obj.CTR_RLE_SECD=='31'){return true;}});

		/* 계약자, 주피보험자 정보를 DS_CTR_INTP_MTT_LIST 에 넣는다. */
		var arr_DS_CTR_INTP_MTT_LIST_tmp = [];

		for(var i in arr_DS_CS_LIST){
		 	if(typeof arr_DS_CS_LIST[i] != "function" ){
				arr_DS_CS_LIST[i].PYMRT = "100"; // 지급율 (고정값으로 봄, 예외로 사망수익자2,
													// 사망수익자3 은 [0] 이지만 필요억다하여
													// 화면에 나타내지 않음)

				/*
				 * 아래 정의된 필드론
				 */
				var val_strColInfo = "";
				val_strColInfo 	+=	"CS_PK=CS_PK";
				val_strColInfo 	+=	",CS_NAM=CS_NAM";
				val_strColInfo 	+=	",RRN=RRN";
				val_strColInfo 	+=	",PRCMPAG=PRCMPAG";
				val_strColInfo 	+=	",CPCD=CPCD";
				val_strColInfo 	+=	",CPNM=CPNM";
				val_strColInfo 	+=	",OCPT_PEL_GRDE_COD=OCPT_PEL_GRDE_COD";
				val_strColInfo 	+=	",OCPT_INJ_PEL_GRDE_COD=OCPT_INJ_PEL_GRDE_COD";
				val_strColInfo 	+=	",DRVG_SECD=DRVG_SECD";
				val_strColInfo 	+=	",DRVG_SENM=DRVG_SENM";
				val_strColInfo 	+=	",DRVG_PEL_GRDE_COD=DRVG_PEL_GRDE_COD";
				val_strColInfo 	+=	",DRVG_INJ_PEL_GRDE_COD=DRVG_INJ_PEL_GRDE_COD";
				val_strColInfo 	+=	",GNDR_SECD=GNDR_SECD";
				val_strColInfo 	+=	",NATAL_SECD=NATAL_SECD";
				val_strColInfo 	+=	",NATAL_SENM=NATAL_SENM";
				val_strColInfo 	+=	",STY_COD=STY_COD";
				val_strColInfo 	+=	",STY_NAM=STY_NAM";
				val_strColInfo 	+=	",OBS_GRDE_COD=OBS_GRDE_COD";
				val_strColInfo 	+=	",XCLC_OCPT_YN=XCLC_OCPT_YN";
				val_strColInfo 	+=	",PBLS_YMD=PBLS_YMD";
				val_strColInfo 	+=	",STY_PRID=STY_PRID";
				val_strColInfo 	+=	",XCLCLV_PSPY_YN=XCLCLV_PSPY_YN";
				val_strColInfo 	+=	",XCLCLV_APPL_YN=XCLCLV_APPL_YN";
				val_strColInfo 	+=	",CTR_RLE_SECD=CTR_RLE_SECD";
				val_strColInfo 	+=	",PYMRT=PYMRT";
				
				var obj_option = {};
				obj_option.strColInfo = val_strColInfo;

				/* DS_CTR_INTP_MTT_LIST <= DS_CS_LIST 특정열 복사 */
				dcUtil.copyArrayRow(gDS["DS_CTR_INTP_MTT_LIST"], i, arr_DS_CS_LIST, i, obj_option);
		 	}
		}

		if(gDS["DS_CTR_INTP_MTT_LIST"].length != 5){
			/*
			 * 상품 가입조건 정보에서 [계약자, 주피보험자, 사망시수익자2 , 사망시수익자3] 을 제외한 중복 제거한 정보를
			 * 가져온다.
			 */
			var arr_ds_CtrIntpMtt_tmp  = $.grep(gDS["ds_CtrIntpMtt"], function(obj){
				if(obj.ASRD_CTR_RLE_SECD != "11" && 
						obj.ASRD_CTR_RLE_SECD != "21" && 
						obj.PRDCD == val_mprdPrdcd && 
						obj.CS_RLP_SECD =="1" && 
						obj.ESTY_INP_YN =='1'){
					
					return true;
				}
			});
			/*
			 * [DS_CTR_INTP_MTT_LIST]에 가입조건[계약역할구분코드, 우량체 선택여부, 지급율 , 필수입력 여부]
			 * default 값을 세팅 (만기수익자, 장해수익자, 사망수익자1)
			 */

			$.each(arr_ds_CtrIntpMtt_tmp, function(i, objTmp){
				var obj_ds_CtrIntpMtt_tmp = {};
				obj_ds_CtrIntpMtt_tmp.CTR_RLE_SECD 		=  objTmp.ASRD_CTR_RLE_SECD; 		// 계약역할구분코드
				obj_ds_CtrIntpMtt_tmp.XCLCLV_APPL_YN 	=  "0"; 										// 우량체
																										// 선택여부
				if(objTmp.ASRD_CTR_RLE_SECD == "47"){ 								
					obj_ds_CtrIntpMtt_tmp.PYMRT 			=  "100";  										// 지급율
				}else{
					obj_ds_CtrIntpMtt_tmp.PYMRT 			=  "0";  										// 지급율[사망수익자
																											// 일경우만
																											// "0"으로
				}
				obj_ds_CtrIntpMtt_tmp.ESTY_INP_YN 		=  objTmp.ESTY_INP_YN; 		// 필수입력
																					// 여부
				// 계약자 / 주피보험자 정보를 [DS_CTR_INTP_MTT_LIST] 에 카피
				var arr_tmp = [];
				arr_tmp.push(obj_ds_CtrIntpMtt_tmp);
				dcUtil.copyArrayRow(gDS["DS_CTR_INTP_MTT_LIST"], gDS["DS_CTR_INTP_MTT_LIST"].length, arr_tmp, 0);
			});
		}
		
		if(gVAL.loadMode == 'Q' && "FI" == val_mprdPrdcd.substring(0,2)){
			gDS["DS_CTR_INTP_MTT_LIST"].push({});
		    nRow = gDS["DS_CTR_INTP_MTT_LIST"].length-1;
		    gDS["DS_CTR_INTP_MTT_LIST"][nRow].CTR_RLE_SECD		= "47";
		    gDS["DS_CTR_INTP_MTT_LIST"][nRow].CS_PK				= "1";
		    gDS["DS_CTR_INTP_MTT_LIST"][nRow].CS_NAM			= "법정상속인";
		    gDS["DS_CTR_INTP_MTT_LIST"][nRow].RRN 				= "1111111111111";
		    gDS["DS_CTR_INTP_MTT_LIST"][nRow].PRCMPAG 			= "0",
		    gDS["DS_CTR_INTP_MTT_LIST"][nRow].CS_RLP_SECD 		= "14",
		    gDS["DS_CTR_INTP_MTT_LIST"][nRow].GNDR_SECD 		= "1",
		    gDS["DS_CTR_INTP_MTT_LIST"][nRow].PYMRT 			= "100",
		    gDS["DS_CTR_INTP_MTT_LIST"][nRow].XCLCLV_PSPY_YN 	= "0",
		    gDS["DS_CTR_INTP_MTT_LIST"][nRow].XCLCLV_APPL_YN 	= "0",
		    gDS["DS_CTR_INTP_MTT_LIST"][nRow].ESTY_INP_YN 		= "1"
		}
		/** *************************************************************************************************************************** */
		
		/**
		 * 최초 진입 시 페이지가 2페이지 이후 일때 2페이지에서 설정해주는 DS_CTR_INTP_MTT_LIST 의 정보들이 셋팅되지
		 * 않아 작업함. 2페이지의 일부 컴포넌트를 1페이지에 히든으로 가지고 있음.
		 */
		
		console.log("=============gData.sel_csRlpSecd_11========",gData);
		console.log("=============gData.sel_csRlpSecd_11========",gDS["DS_CTR_INTP_MTT_LIST"]);
		if(flow == "FIR" && gViewNum >= 2) {
			// 관계 셋팅 전
			if(!stringUtil.isNull(gData.sel_csPk_41)) {
				set1020bef(gData.sel_csPk_41, "41");
			}
			if(!stringUtil.isNull(gData.sel_csPk_42)) {
				set1020bef(gData.sel_csPk_42, "42");
			}
			if(!stringUtil.isNull(gData.sel_csPk_47)) {
				set1020bef(gData.sel_csPk_47, "47");
			}
			
			// 관계 셋팅
			if(!stringUtil.isNull(gData.sel_csRlpSecd_11)) {
				set1020(gData.sel_csRlpSecd_11, "11");
			}
			if(!stringUtil.isNull(gData.sel_csRlpSecd_21)) {
				set1020(gData.sel_csRlpSecd_21, "21");
			}
			if(!stringUtil.isNull(gData.sel_csRlpSecd_31)) {
				set1020(gData.sel_csRlpSecd_31, "31");
			}
			if(!stringUtil.isNull(gData.sel_csRlpSecd_41)) {
				set1020(gData.sel_csRlpSecd_41, "41");
			}
			if(!stringUtil.isNull(gData.sel_csRlpSecd_42)) {
				set1020(gData.sel_csRlpSecd_42, "42");
			}
			if(!stringUtil.isNull(gData.sel_csRlpSecd_47)) {
				set1020(gData.sel_csRlpSecd_47, "47");
			}

			/**
			 * 주소,이메일 정보 -------------------------------------- 계약자 정보를 화면에 보여줌
			 * 정보 기간계를 디폴트 없으면 채널계 정보 보여줌
			 */
			// 계약자, 피보험자 주소사항 SET
			gDS['DS_ADDR_POHD'] = $.extend(true, [], gDS['DS_SUS_ADR_POHD']); 		// 계약자
			gDS['DS_ADDR_MAIPSN'] = $.extend(true, [], gDS['DS_SUS_ADR_MAIPSN']); 	// 피보험자
			
		}
		 
		
		/*
		 * KYC 추가정보 정보 조회 에서 파라미터로 넘길때 필요
		 */
		var obj_Info =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == '11')return true;}); // 계약자
																												// 정보를
																												// 가져온다.
		gVAL.csNam =  obj_Info.CS_NAM;  // 계약자명
		gVAL.csnum =  obj_Info.RRN;  	// 계약자주민번호
		
		if (gViewNum >= 6) {
			fnSetVarMtt();
		}
	};
	
	function set1020bef(val_selectedCsPk, val_CTR_RLE_SECD) {
		
		var nRow = $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD == val_CTR_RLE_SECD){return index; }})[0];
		
		var cs_list_tmp =  $.grep(gDS["DS_CS_LIST"], function(obj){if(obj.CS_PK == val_selectedCsPk ){return true; } })[0];
		var obj_DS_CS_LIST = $.extend(true,{}, cs_list_tmp);
		var val_CS_RLP_SECD =  obj_DS_CS_LIST.CS_RLP_SECD;  // [주피와의 관계] 1 :본인
															// ,2 :배우자 ,3 :부모 ,4
															// :자녀 ,5 :조부모 ,6
															// :손주 ,7 :형제자매 ,8
															// :친척 ,9 :외조부모
															// ,10:처부모 ,11:시부모
															// ,12:사위 ,13:며느리
															// ,14:법정상속인
															// ,96:법인대표 ,97:단체
															// ,98:법인 ,99:기타
															// CPCD

		/*
		 * 사망수익자 일때
		 */
		if(val_CTR_RLE_SECD == "47"){
			if(val_CS_RLP_SECD != '1' && val_CS_RLP_SECD != '14'){
				$("#sel_csRlpSecd_47").show();
			}else{
				$("#sel_csRlpSecd_47").hide();
			}
		}
		
		if(!stringUtil.isNull(nRow)){
			var arr_tmp = [];
			
			obj_DS_CS_LIST.CTR_RLE_SECD 	= val_CTR_RLE_SECD; // [조피와의 관계]
			obj_DS_CS_LIST.XCLCLV_PSPY_YN  	= "0"; 		// 우량체 여부
			obj_DS_CS_LIST.XCLCLV_APPL_YN  	= "0"; 		// 우량체 선택여부
			obj_DS_CS_LIST.PYMRT 			= "100"; 	// 지급율
			
			arr_tmp.push(obj_DS_CS_LIST);
			// gDS["DS_CTR_INTP_MTT_LIST"][nRow] = {}; //DS_CS_LIST row를 copy하기전
			// 대상 row의 내용을 클리어 해준다.

			/*
			 * 배열 object 매핑
			 */
			var val_strColInfo = "";
			val_strColInfo 	+=	"CS_PK=CS_PK";
			val_strColInfo 	+=	",CS_NAM=CS_NAM";
			val_strColInfo 	+=	",RRN=RRN";
			val_strColInfo 	+=	",PRCMPAG=PRCMPAG";
			val_strColInfo 	+=	",CPCD=CPCD";
			val_strColInfo 	+=	",CPNM=CPNM";
			val_strColInfo 	+=	",OCPT_PEL_GRDE_COD=OCPT_PEL_GRDE_COD";
			val_strColInfo 	+=	",OCPT_INJ_PEL_GRDE_COD=OCPT_INJ_PEL_GRDE_COD";
			val_strColInfo 	+=	",DRVG_SECD=DRVG_SECD";
			val_strColInfo 	+=	",DRVG_SENM=DRVG_SENM";
			val_strColInfo 	+=	",DRVG_PEL_GRDE_COD=DRVG_PEL_GRDE_COD";
			val_strColInfo 	+=	",DRVG_INJ_PEL_GRDE_COD=DRVG_INJ_PEL_GRDE_COD";
			val_strColInfo 	+=	",GNDR_SECD=GNDR_SECD";
			val_strColInfo 	+=	",NATAL_SECD=NATAL_SECD";
			val_strColInfo 	+=	",NATAL_SENM=NATAL_SENM";
			val_strColInfo 	+=	",STY_COD=STY_COD";
			val_strColInfo 	+=	",STY_NAM=STY_NAM";
			val_strColInfo 	+=	",OBS_GRDE_COD=OBS_GRDE_COD";
			val_strColInfo 	+=	",XCLC_OCPT_YN=XCLC_OCPT_YN";
			val_strColInfo 	+=	",PBLS_YMD=PBLS_YMD";
			val_strColInfo 	+=	",STY_PRID=STY_PRID";
			val_strColInfo 	+=	",XCLCLV_PSPY_YN=XCLCLV_PSPY_YN";
			val_strColInfo 	+=	",XCLCLV_APPL_YN=XCLCLV_APPL_YN";
			val_strColInfo 	+=	",CTR_RLE_SECD=CTR_RLE_SECD";

			var obj_option = {};
			obj_option.strColInfo = val_strColInfo;

			/* DS_CTR_INTP_MTT_LIST <= DS_CS_LIST 특정열 복사 */
			dcUtil.copyArrayRow(gDS["DS_CTR_INTP_MTT_LIST"], nRow, arr_tmp, 0);
		}
	}
	
	function fnct_addBasUser(a_csPk) {
	    var nRow;
	    if (a_csPk == "1") {
	        if (gDS["DS_CS_LIST"].findIndex(function(o){if(o.CS_PK == "1")return true;}) < 0) {
	        	
	        	gDS["DS_CS_LIST"].push({});
	            nRow = gDS["DS_CS_LIST"].length - 1;
	            gDS["DS_CS_LIST"][nRow].CS_PK= "1";
	            gDS["DS_CS_LIST"][nRow].CS_NAM= "법정상속인";
	            gDS["DS_CS_LIST"][nRow].RRN= "1111111111111";
	            gDS["DS_CS_LIST"][nRow].CS_RLP_SECD= "14";
	        }
	    } else if (a_csPk == "2") {
	        if (gDS["DS_CS_LIST"].find( function(o){if(o.CS_PK == "2")return true;} ) < 0) {
	            nRow = gDS["DS_CS_LIST"].addRow();
	            gDS["DS_CS_LIST"][nRow].CS_PK= "2";
	            gDS["DS_CS_LIST"][nRow].CS_NAM= "태아";
	            gDS["DS_CS_LIST"][nRow].RRN= "1111111111111";
	            gDS["DS_CS_LIST"][nRow].PRCMPAG= "0";
	            gDS["DS_CS_LIST"][nRow].GNDR_SECD= "1";
	            gDS["DS_CS_LIST"][nRow].CPCD= "B6100";
	            gDS["DS_CS_LIST"][nRow].CPNM= "미취학아동";
	            gDS["DS_CS_LIST"][nRow].OCPT_PEL_GRDE_COD= "4";
	            gDS["DS_CS_LIST"][nRow].OCPT_INJ_PEL_GRDE_COD= "5";
	            gDS["DS_CS_LIST"][nRow].XCLC_OCPT_YN= "1";
	            gDS["DS_CS_LIST"][nRow].DRVG_SECD= "00";
	            gDS["DS_CS_LIST"][nRow].DRVG_SENM= "무";
	            gDS["DS_CS_LIST"][nRow].DRVG_PEL_GRDE_COD= "5";
	            gDS["DS_CS_LIST"][nRow].DRVG_INJ_PEL_GRDE_COD= "5";
	            gDS["DS_CS_LIST"][nRow].CS_RLP_SECD= "99";
	        }
	    }
	};
	
	// 4 : 11
	function set1020(newvalue, nCtrRle) {
		
		var eRow = gDS["DS_CTR_INTP_MTT_LIST"].findIndex(function(o){ if(o.CTR_RLE_SECD == nCtrRle)return true;} );
        var sRow, sCsPk;
        gDS["DS_CTR_INTP_MTT_LIST"][eRow].CS_RLP_SECD = newvalue;
		
		if (newvalue == "1") {
            sRow = gDS["DS_CTR_INTP_MTT_LIST"].findIndex(function(o){if(o.CTR_RLE_SECD == "21")return true;});
            
            if (sRow < 0) {
                return;
            }
        } else if (newvalue == "14") {
            fnct_addBasUser("1");

            gDS["DS_CTR_INTP_MTT_LIST"][eRow].CS_PK = "1";
            if (newvalue == "47") {
        		var sRow1 = gDS["DS_CTR_INTP_MTT_LIST"].findIndex(function(o){ if(o.CTR_RLE_SECD == "48")return true;} );
        		var sRow2 = gDS["DS_CTR_INTP_MTT_LIST"].findIndex(function(o){ if(o.CTR_RLE_SECD == "49")return true;} );
            	
                if (sRow1 >= 0) {
                    gDS["DS_CTR_INTP_MTT_LIST"][sRow1].CS_NAM = "";
                }
                if (sRow2 >= 0) {
                    gDS["DS_CTR_INTP_MTT_LIST"][sRow2].CS_NAM = "";
                }
                gDS["DS_CTR_INTP_MTT_LIST"][eRow].PYMRT = "100";
                gDS["DS_CTR_INTP_MTT_LIST"][sRow1].PYMRT = "0";
                gDS["DS_CTR_INTP_MTT_LIST"][sRow2].PYMRT = "0";
            }
        } else {
        	console.log("test111");
            var nCsPk = gDS["DS_CTR_INTP_MTT_LIST"][eRow].CS_PK;
            if (stringUtil.isNull(nCsPk)) {
	        	console.log("test222");
        		sRow = gDS["DS_CTR_INTP_MTT_LIST"].findIndex(function(o){ if(o.CS_RLP_SECD == newvalue)return true;} );
            } else {
	        	console.log("test333");
                sRow = gDS["DS_CS_LIST"].findIndex(function(o){if(o.CS_PK == nCsPk)return true;});
                
                gDS["DS_CS_LIST"][sRow].CS_RLP_SECD = newvalue;
                var cnt = gDS["DS_CTR_INTP_MTT_LIST"].length;
                for (var i = 0; i < cnt; i++) {
                    sCsPk = gDS["DS_CTR_INTP_MTT_LIST"][i].CS_PK;
                    if (!stringUtil.isNull(sCsPk) && nCsPk == sCsPk && i != eRow) {
        	        	console.log("TEST444");
                        gDS["DS_CTR_INTP_MTT_LIST"][i].CS_RLP_SECD = newvalue;
                        $("#sel_csRlpSecd_" + gDS["DS_CTR_INTP_MTT_LIST"][i].CTR_RLE_SECD).val(newvalue);
                    }
                }
            }
        }
	}
	
	function setDsCtrIntpMttList(val_CTR_RLE_SECD, val_selectedCsPk) {
		var cs_list_tmp =  $.grep(gDS["DS_CS_LIST"], function(obj){if(obj.CS_PK == val_selectedCsPk ){return true; } })[0];
		var obj_DS_CS_LIST = $.extend(true,{}, cs_list_tmp);
		
		// 계약역할구분코드와 일차하는 DS_CTR_INTP_MTT_LIST 의 index 번호를 return 한다.
		var nRow = $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD == val_CTR_RLE_SECD){return index; }})[0];

		/*
		 * 값이 있을경우는 DS_CTR_INTP_MTT_LIST <= DS_CS_LIST 카피한다.
		 */
		if(!stringUtil.isNull(nRow)){
			var arr_tmp = [];
			
			obj_DS_CS_LIST.CTR_RLE_SECD 	= val_CTR_RLE_SECD; // [조피와의 관계]
			obj_DS_CS_LIST.XCLCLV_PSPY_YN  	= "0"; 		// 우량체 여부
			obj_DS_CS_LIST.XCLCLV_APPL_YN  	= "0"; 		// 우량체 선택여부
			obj_DS_CS_LIST.PYMRT 			= "100"; 	// 지급율
			
			arr_tmp.push(obj_DS_CS_LIST);
			// gDS["DS_CTR_INTP_MTT_LIST"][nRow] = {}; //DS_CS_LIST row를 copy하기전
			// 대상 row의 내용을 클리어 해준다.

			/*
			 * 배열 object 매핑
			 */
			var val_strColInfo = "";
			val_strColInfo 	+=	"CS_PK=CS_PK";
			val_strColInfo 	+=	",CS_NAM=CS_NAM";
			val_strColInfo 	+=	",RRN=RRN";
			val_strColInfo 	+=	",PRCMPAG=PRCMPAG";
			val_strColInfo 	+=	",CPCD=CPCD";
			val_strColInfo 	+=	",CPNM=CPNM";
			val_strColInfo 	+=	",OCPT_PEL_GRDE_COD=OCPT_PEL_GRDE_COD";
			val_strColInfo 	+=	",OCPT_INJ_PEL_GRDE_COD=OCPT_INJ_PEL_GRDE_COD";
			val_strColInfo 	+=	",DRVG_SECD=DRVG_SECD";
			val_strColInfo 	+=	",DRVG_SENM=DRVG_SENM";
			val_strColInfo 	+=	",DRVG_PEL_GRDE_COD=DRVG_PEL_GRDE_COD";
			val_strColInfo 	+=	",DRVG_INJ_PEL_GRDE_COD=DRVG_INJ_PEL_GRDE_COD";
			val_strColInfo 	+=	",GNDR_SECD=GNDR_SECD";
			val_strColInfo 	+=	",NATAL_SECD=NATAL_SECD";
			val_strColInfo 	+=	",NATAL_SENM=NATAL_SENM";
			val_strColInfo 	+=	",STY_COD=STY_COD";
			val_strColInfo 	+=	",STY_NAM=STY_NAM";
			val_strColInfo 	+=	",OBS_GRDE_COD=OBS_GRDE_COD";
			val_strColInfo 	+=	",XCLC_OCPT_YN=XCLC_OCPT_YN";
			val_strColInfo 	+=	",PBLS_YMD=PBLS_YMD";
			val_strColInfo 	+=	",STY_PRID=STY_PRID";
			val_strColInfo 	+=	",XCLCLV_PSPY_YN=XCLCLV_PSPY_YN";
			val_strColInfo 	+=	",XCLCLV_APPL_YN=XCLCLV_APPL_YN";
			val_strColInfo 	+=	",CTR_RLE_SECD=CTR_RLE_SECD";

			var obj_option = {};
			obj_option.strColInfo = val_strColInfo;

			/* DS_CTR_INTP_MTT_LIST <= DS_CS_LIST 특정열 복사 */
			dcUtil.copyArrayRow(gDS["DS_CTR_INTP_MTT_LIST"], nRow, arr_tmp, 0);
		}
	}


	// 계약관계자사항 view 설정
	function setCtrIntpMttForView(_callback){
		console.log("setCtrIntpMttForView>>>",gData);
		var  obj_userInfo = D.global.getUserInfo();
		gVAL["plarNo"] 		= obj_userInfo.empno; 				// 설계사번호
		gVAL["plarBrofc"] 	= obj_userInfo.brofccod; 			// 판매조직

		/*
		 * [상품명] 구성
		 */
		var val_mprdPrdcd = gVAL["maiPrdcd"]; // 주계약상품코드

		/*
		 * 할인 후 보험료 [ 가설쪽에서 넘겨주기로 하였음 (우리) -> 청약에서 명칭은 [실제납입금액(원)]
		 */
		
		/*
		 * [계약자, 주피보험자, 만기수익자, 장해수익자, 사망수익자1, 사망수익자1,사망수익자1]을 구성한다. 관련 코드 :
		 * [00007] :: 계약역할구분코드 1: 단체 ,2: 단체취급특약가입단체 ,3: 신계약수당할인단체 ,9: 단체이력 ,11:
		 * 계약자 ,12: 친권자/후견인 ,13: 대표자 ,00: 전피보험자 ,21: 주피보험자 ,31: 종피 - 1 ,32: 종피 -
		 * 2 ,33: 종피 - 3 ,34: 종피 - 4 ,41: 만기수익자 ,42: 장해수익자 ,47: 사망수익자1 ,48:
		 * 사망수익자2 ,49: 사망수익자3 ,51: 모집사원 ,53: 관리설계사 ,54: 수금사원 ,56: 복지수당설계사 ,57:
		 * 모집사원2 ,58: 모집사원3 ,59: 수금사원2 ,60: 수금사원3 ,52: 모집영업소 ,55: 수금영업소
		 */	
		
		console.log("[DS_CTR_INTP_MTT_LIST] " + JSON.stringify(gDS["DS_CTR_INTP_MTT_LIST"]));
		
		var obj_custInfo_11 =  $.grep(gDS["DS_CTR_INTP_MTT_LIST"], function(obj){ if(obj.CTR_RLE_SECD == '11')return true;})[0];  // 계약자
																																	// 정보를
																																	// 가져온다.
		$("#txt_csPk_11").val(obj_custInfo_11.CS_NAM);
		gData.txt_csPk_11_ByPass = obj_custInfo_11.CS_PK;
		
		// 피보험자
		var obj_custInfo_21 =  $.grep(gDS["DS_CTR_INTP_MTT_LIST"], function(obj){ if(obj.CTR_RLE_SECD == '21')return true;})[0];  // 주피보험자
																																	// 정보를
																																	// 가져온다.
		$("#txt_csPk_21").val(obj_custInfo_21.CS_NAM);
		
		// 종피보험자
		if(gVAL["jongpiYn"]) {
			var obj_custInfo_31 =  $.grep(gDS["DS_CTR_INTP_MTT_LIST"], function(obj){ if(obj.CTR_RLE_SECD == '31')return true;})[0];
			if(!stringUtil.isNull(obj_custInfo_31)) {
				$("#txt_csPk_31").val(obj_custInfo_31.CS_NAM);
			}
		}
		
		var $sel_csRlpSecd_21 = $("#sel_csRlpSecd_21");
		$sel_csRlpSecd_21.html("");
		$("<option/>").attr({value:"1"}).html("본인").appendTo($sel_csRlpSecd_21);
			

		// 만기수익자 [41] tobe 관계 조건 변경 -> 지정가능 관계코드 : 배우자, 부모, 자녀, 조부모, 손주, 형제자매,
		// 외조모부
		// 피보험자가 미성년인 경우 수익자는 성인이거나 계약자
	// var arr_filetered_DS_CS_LIST_41 = $.grep(gDS["DS_CS_LIST"],
	// function(obj){if(obj.CS_PK!='1'&&obj.CS_PK!='2' && (obj.RRN ==
	// obj_custInfo_11.RRN || obj.RRN == obj_custInfo_21.RRN)){return true; }});
		var arr_filetered_DS_CS_LIST_41;
		// 미성년자
		if(dateUtil.getRealAge(obj_custInfo_21.RRN) <= 18) {
			arr_filetered_DS_CS_LIST_41 = $.grep(gDS["DS_CS_LIST"], 
					function(obj){if(obj.CS_PK!='1'&&obj.CS_PK!='2' && "1,2,3,4,5,6,7,9".indexOf(obj.CS_RLP_SECD) > -1){return true; }});
		} else {
			arr_filetered_DS_CS_LIST_41 = $.grep(gDS["DS_CS_LIST"], 
					function(obj){if(obj.CS_PK!='1'&&obj.CS_PK!='2' && "1,2,3,4,5,6,7,9".indexOf(obj.CS_RLP_SECD) > -1){return true; }});
		}
		
		console.log("20250821 수정-----------------------------------------------");
		console.log("41) 만기수익자 ");
		console.log("arr_filetered_DS_CS_LIST_41 :: " + JSON.stringify(arr_filetered_DS_CS_LIST_41));
		var $sel_csPk_41 = $("#sel_csPk_41");
		$sel_csPk_41.html("");
		for(var i in arr_filetered_DS_CS_LIST_41){
			$("<option/>").attr({value:arr_filetered_DS_CS_LIST_41[i].CS_PK}).html(arr_filetered_DS_CS_LIST_41[i].CS_NAM).appendTo($sel_csPk_41);
		}
		var val_sel_csPk_41 =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == "41")return true;}).CS_PK;
		
		if(!stringUtil.isNull(val_sel_csPk_41)){
			$sel_csPk_41.val(val_sel_csPk_41);		
		}


		// 장해수익자 [42] tobe 관계 조건 변경 -> 지정가능 관계코드 : 배우자, 부모, 자녀, 조부모, 손주, 형제자매,
		// 외조모부
		// 피보험자가 미성년인 경우 수익자는 성인이거나 계약자
// var arr_filetered_DS_CS_LIST_42 = $.grep(gDS["DS_CS_LIST"],
// function(obj){if(obj.CS_PK!='1'&&obj.CS_PK!='2' && (obj.RRN ==
// obj_custInfo_11.RRN || obj.RRN == obj_custInfo_21.RRN)){return true; }});
		var arr_filetered_DS_CS_LIST_42;
		if(dateUtil.getRealAge(obj_custInfo_21.RRN) <= 18) {
			arr_filetered_DS_CS_LIST_42 = $.grep(gDS["DS_CS_LIST"], 
					function(obj){if(obj.CS_PK!='1'&&obj.CS_PK!='2' && "1,2,3,4,5,6,7,9".indexOf(obj.CS_RLP_SECD) > -1 ){return true; }});
		} else {
			arr_filetered_DS_CS_LIST_42 = $.grep(gDS["DS_CS_LIST"], 
					function(obj){if(obj.CS_PK!='1'&&obj.CS_PK!='2' && "1,2,3,4,5,6,7,9".indexOf(obj.CS_RLP_SECD) > -1){return true; }});
		}
		var $sel_csPk_42 =  $("#sel_csPk_42");
		$sel_csPk_42.html("");

		for(var i in arr_filetered_DS_CS_LIST_42){
			$("<option/>").attr({value:arr_filetered_DS_CS_LIST_42[i].CS_PK}).html(arr_filetered_DS_CS_LIST_42[i].CS_NAM).appendTo($sel_csPk_42);
		}

		var val_sel_csPk_42 =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == "42")return true;}).CS_PK;
		if(!stringUtil.isNull(val_sel_csPk_42)){
			$sel_csPk_42.val(val_sel_csPk_42);		
		}
		
		// 사망수익자1 [47]
		// 지정가능범위 변경 : 수익자 지정범위와 동일 - 2020.10.21
		/*
		 * var arr_filetered_DS_CS_LIST_47 = $.grep(gDS["DS_CS_LIST"],
		 * function(obj){if(obj.CS_PK!='2'&&obj.CS_PK!='106110728' && (obj.CS_PK ==
		 * "1" || (obj.RRN != obj_custInfo_21.RRN && obj.RRN ==
		 * obj_custInfo_11.RRN) ) ){return true; }})
		 */
		
		var arr_filetered_DS_CS_LIST_47 = $.grep(gDS["DS_CS_LIST"], function(obj){if(obj.CS_PK == "1"&&obj.CS_PK!='106110728'){return true; }});
			
		var newarr_filetered_DS_CS_LIST_47 = arr_filetered_DS_CS_LIST_47;

		$.each(arr_filetered_DS_CS_LIST_42, function(index, item){
// console.log();
			if(item.CS_PK != obj_custInfo_21.CS_PK) { // 피보험자는 사망수익자가 될 수 없다.
				newarr_filetered_DS_CS_LIST_47.push(item);
			}
		})
		
		var $sel_csPk_47 = $("#sel_csPk_47");
		$sel_csPk_47.html("");

		for(var i in newarr_filetered_DS_CS_LIST_47){
			$("<option/>").attr({value:newarr_filetered_DS_CS_LIST_47[i].CS_PK}).html(newarr_filetered_DS_CS_LIST_47[i].CS_NAM).appendTo($sel_csPk_47);
		}
		
		var val_sel_csPk_47;
		val_sel_csPk_47 =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == "47")return true;}).CS_PK;
		
		if(!stringUtil.isNull(val_sel_csPk_47)){
			$sel_csPk_47.val(val_sel_csPk_47);
		}else{
			$sel_csPk_47.val("1");
		}
				
		var val_CS_PK =  gDS["DS_CTR_INTP_MTT_LIST"][0].CS_PK ; // 계약자의 [고객고유번호(CS_PK)]를 구한다.
		var val_CS_RLP_SECD = $.grep(gDS["DS_CS_LIST"], function(obj){if(obj.CS_PK == val_CS_PK){return true; } })[0].CS_RLP_SECD; // 값을
																																	// 구한
																																	// 고객고유번호로
																																	// [고객관계구분코드]를
																																	// 구한다.
																																	// [CS_RLP_SECD(고객관계구분코드)
																																	// :: 1
																																	// 본인
																																	// ,2
																																	// 배우자
																																	// ,3
																																	// 부모
																																	// ,4
																																	// 자녀
																																	// ,5
																																	// 조부모
																																	// ,6
																																	// 손주
																																	// ,7
																																	// 형제자매
																																	// ,8
																																	// 친척
																																	// ,9
																																	// 외조부모
																																	// ,10
																																	// 처부모
																																	// ,11
																																	// 시부모
																																	// ,12
																																	// 사위
																																	// ,13
																																	// 며느리
																																	// ,14
																																	// 법정상속인
																																	// ,95
																																	// 기타사업장
																																	// ,96
																																	// 법인대표
																																	// ,100
																																	// FC대리접수
																																	// ]
		
		/*
		 * [계약자]
		 */ 
		if(val_CS_RLP_SECD == '1'){  // 주피와의 관계가 [본인]이면
			fn_setOption_csRlpSecd("#sel_csRlpSecd_11", '1'); // [고객관계 구분코드]를 [본인]으로 세팅
			$("#sel_csRlpSecd_11").prop("disabled", true);  // 본인일때는 본인만 세팅 되므로
															// 다른 관계 코드로 바꾸지 못하게 한다.
		} else{
			fn_setOption_csRlpSecd("#sel_csRlpSecd_11", stringUtil.isNull(val_CS_RLP_SECD)? "0":val_CS_RLP_SECD  ); // [고객관계 구분코드]를 [전체]를 세팅
			$("#sel_csRlpSecd_11").val(stringUtil.isNull(val_CS_RLP_SECD)? "":val_CS_RLP_SECD);
		}
		
		/* [종피보험자] */
		if(gVAL["jongpiYn"]) {
			var val_CS_PK_31 =  gDS["DS_CTR_INTP_MTT_LIST"][2].CS_PK ;
			if(!stringUtil.isNull(val_CS_PK_31)) {
				var val_CS_RLP_SECD_31 = $.grep(gDS["DS_CS_LIST"], function(obj){if(obj.CS_PK == val_CS_PK_31){return true;}})[0].CS_RLP_SECD;
				fn_setOption_csRlpSecd("#sel_csRlpSecd_31", stringUtil.isNull(val_CS_RLP_SECD_31)? "0":val_CS_RLP_SECD  );
				$(".jongpi").removeClass("none");
			} else {
				$(".jongpi").addClass("none");
			}
		}
		
		
		/*
		 * [친권자] 계약자나 피보험자 중 미성년자가 있는 경우 계약자가 미성년 : 관계 부모만 피보험자가 미성년 : 관계 본인,
		 * 배우자
		 */
		console.log("계약자가미성년자인데>>",dateUtil.getRealAge(obj_custInfo_11.RRN) <= 18);
		console.log("피보가미성년자인데>>",dateUtil.getRealAge(obj_custInfo_21.RRN) <= 18);
		if(dateUtil.getRealAge(obj_custInfo_11.RRN) <= 18) {
			$("#rlpParent").removeClass("none");
			setParents(obj_custInfo_11, obj_custInfo_21, null, _callback);
		} else if(dateUtil.getRealAge(obj_custInfo_21.RRN) <= 18) {
			$("#rlpParent").removeClass("none");
			setParents(obj_custInfo_21, obj_custInfo_11, null, _callback);
		} else {
			if(_callback){
	    		_callback();
	    	}
		}

		/*
		 * [고객관계구분코드] 에서 [본인]을 제거 ( [아래 계약자, 피보험자, 만기수익자, 장해수익자, 사망수익자]의 고객관계구분
		 * combo를 구성할 때 필요한 데이터 )
		 */
		$("[id*=sel_csPk]").trigger('change');
	};
	
	/**
	 * 친권자 셋팅
	 */
	function setParents(obj1, obj2, obj3, _callback) {
		console.log(">>>>>>>>>> 친권자 셋팅 setParents");
		
		var obj;
		
		if(obj3 == null) {
			obj = obj1;
		} else {
			obj = obj3;
		}
		
		// 계피동일 미성년 여부
		var sameChildYn = false;
		if (obj1.RRN == obj2.RRN && dateUtil.getRealAge(obj1.RRN) <= 18) {
			sameChildYn = true;
		}
		
		var args = {
			"rrn": obj.RRN,   		// 미성년자 주민번호
			"csnam": obj.CS_NAM,   	// 미성년자 이름
			"empno": D.global.getUserInfo('empno'), 
			"remote": {}
		};
		
		// 통신
		D.http.ajax("/su/mblSus/selectParentsList", args)
		.then(function(result){
			console.log("친권자test>>", result);
			console.log("sameChildYn>>", sameChildYn);
			console.log("obj1>>", obj1);
			console.log("obj2>>", obj2);
			
			if(result.errorMsg){
				dialog.alert(result.errorMsg);
				return ; 
			}
			var arr_CHILDList =  result.result;

			var $SEL_PARENTS =  $("#rlpParentPk");
			$SEL_PARENTS.html("");
			var cnt = 0;
			for (var i = 0; i < arr_CHILDList.length; i++) {
				console.log("test>>", obj1.CS_NAM == arr_CHILDList[i].CS_NAM || obj2.CS_NAM == arr_CHILDList[i].CS_NAM);
				if(sameChildYn) {
					//계피동일
					cnt++;
					$("<option/>").attr({value: arr_CHILDList[i].FC_ADMN_CS_PK, name: arr_CHILDList[i].SFA_CS_PK }).html( arr_CHILDList[i].CS_NAM).appendTo($SEL_PARENTS);
				} else if (obj1.CS_NAM == arr_CHILDList[i].CS_NAM || obj2.CS_NAM == arr_CHILDList[i].CS_NAM) {
					//계피상이 : 계피중 친권자 있으면
					cnt++;
					$("<option/>").attr({value: arr_CHILDList[i].FC_ADMN_CS_PK, name: arr_CHILDList[i].SFA_CS_PK }).html( arr_CHILDList[i].CS_NAM).appendTo($SEL_PARENTS);
				} else if(gVAL["HOExp"]) {
					cnt++;
					$("<option/>").attr({value: arr_CHILDList[i].FC_ADMN_CS_PK, name: arr_CHILDList[i].SFA_CS_PK }).html( arr_CHILDList[i].CS_NAM).appendTo($SEL_PARENTS);
				}
			}
			
			// 선택가능한 친권자가 1명이면 자동선택 및 자동세팅
			if(cnt == 1) {
				$SEL_PARENTS.prop("disabled", true);
			}
			
    		var val_CS_11 = obj1.CS_PK;
    		var val_CS_21 = obj2.CS_PK;
			if(dateUtil.getRealAge(obj1.RRN) <= 18) {
				//계약자 미성년 = 피보확인
				if($SEL_PARENTS.find("option[value=" + val_CS_21 + "]").length > 0) {
        			console.log("sus 계약자 미성년 , 피보험자가 친권자");
					$SEL_PARENTS.val(val_CS_21);
	    			$SEL_PARENTS.prop("disabled", true);
				}
			} else if(dateUtil.getRealAge(obj2.RRN) <= 18) {
				if($SEL_PARENTS.find("option[value=" + val_CS_11 + "]").length > 0) {
        			console.log("sus 피보험자가 미성년 , 계약자 친권자");
					$SEL_PARENTS.val(val_CS_11);
	    			$SEL_PARENTS.prop("disabled", true);
				}
			} else {
				if($SEL_PARENTS.find("option[value=" + val_CS_11 + "]").length > 0) {
					$SEL_PARENTS.val(val_CS_11);
	    			$SEL_PARENTS.prop("disabled", true);
				} else if($SEL_PARENTS.find("option[value=" + val_CS_21 + "]").length > 0) {
					$SEL_PARENTS.val(val_CS_21);
	    			$SEL_PARENTS.prop("disabled", true);
				}
			}
			
			if(_callback){
	    		_callback();
	    	}
		});
	}
	
	/*
	 * 변경된 고객으로 ROW 정보를 수정
	 */ 
	function fnct_setCtrIntpCs(a_row, a_colId, a_value) {
		
		var val = new Array(23);
		var nRow = gDS["DS_CS_LIST"].findIndex( function(o){if(o[a_colId] == a_value)return true;} );
		if (nRow >= 0) {
			val[0]  = gDS["DS_CS_LIST"][nRow].CS_PK;
			val[1]  = gDS["DS_CS_LIST"][nRow].CS_NAM;
			val[2]  = gDS["DS_CS_LIST"][nRow].RRN;
			val[3]  = gDS["DS_CS_LIST"][nRow].PRCMPAG;
			val[4]  = gDS["DS_CS_LIST"][nRow].CPCD;
			val[5]  = gDS["DS_CS_LIST"][nRow].CPNM;
			val[6]  = gDS["DS_CS_LIST"][nRow].OCPT_PEL_GRDE_COD;
			val[7]  = gDS["DS_CS_LIST"][nRow].OCPT_INJ_PEL_GRDE_COD;
			val[8]  = gDS["DS_CS_LIST"][nRow].DRVG_SECD;
			val[9]  = gDS["DS_CS_LIST"][nRow].DRVG_SENM;
			val[10] = gDS["DS_CS_LIST"][nRow].DRVG_PEL_GRDE_COD;
			val[11] = gDS["DS_CS_LIST"][nRow].DRVG_INJ_PEL_GRDE_COD;
			val[12] = gDS["DS_CS_LIST"][nRow].GNDR_SECD;
			val[13] = gDS["DS_CS_LIST"][nRow].NATAL_SECD;
			val[14] = gDS["DS_CS_LIST"][nRow].NATAL_SENM;
			val[15] = gDS["DS_CS_LIST"][nRow].STY_COD;
			val[16] = gDS["DS_CS_LIST"][nRow].STY_NAM;
			val[17] = gDS["DS_CS_LIST"][nRow].OBS_GRDE_COD;
			val[18] = gDS["DS_CS_LIST"][nRow].XCLC_OCPT_YN;
			val[19] = gDS["DS_CS_LIST"][nRow].CS_RLP_SECD;
			val[20] = gDS["DS_CS_LIST"][nRow].PBLS_YMD;
			val[21] = gDS["DS_CS_LIST"][nRow].STY_PRID;
					
			if (val[0] == "1" || val[0] == "2") { // 상속인 태아는 제외
				val[3] = "0";
				val[12] = "1";
			} else {
				val[3] = String(dateUtil.getLinaAge(gVAL.stdYmd, val[2]))
			}
		}
		fnct_setCtrIntpRow(a_row, val, false);
	};
	
	function fnct_setCtrIntpRow (a_row, a_array, isInit) {
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].CS_PK					= a_array[0]; 	// 고유번호
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].CS_NAM					= a_array[1]; 	// 성명
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].RRN						= a_array[2]; 	// 주민등록번호
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].PRCMPAG					= a_array[3]; 	// 나이
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].CPCD						= a_array[4]; 	// 직업
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].CPNM						= a_array[5]; 	// 직업
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].OCPT_PEL_GRDE_COD		= a_array[6];	// 직업위험등급
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].OCPT_INJ_PEL_GRDE_COD	= a_array[7]; 	// 직업상해위험등급
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].DRVG_SECD				= a_array[8]; 	// 운전
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].DRVG_SENM				= a_array[9]; 	// 운전
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].DRVG_PEL_GRDE_COD		= a_array[10];	// 운전위험등급
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].DRVG_INJ_PEL_GRDE_COD	= a_array[11]; 	// 운전상해위험등급
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].GNDR_SECD				= a_array[12]; 	// 성별구분코드
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].NATAL_SECD				= a_array[13]; 	// 국적구분코드
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].NATAL_SENM				= a_array[14]; 	// 국적구분명
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].STY_COD					= a_array[15]; 	// 체류코드
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].STY_NAM					= a_array[16]; 	// 체류명
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].OBS_GRDE_COD				= a_array[17]; 	// 장애등급
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].XCLCLV_PSPY_YN			= 0; 	 		// 우량체여부
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].XCLCLV_APPL_YN			= 0; 	 		// 우량체선택여부
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].XCLC_OCPT_YN				= a_array[18];  	// 우량체직업여부
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].PBLS_YMD					= a_array[20];		// 발급일자
		gDS["DS_CTR_INTP_MTT_LIST"][a_row].STY_PRID					= a_array[21];		// 체류기간
		
		if (gDS["DS_CTR_INTP_MTT_LIST"][a_row].CTR_RLE_SECD != "21") {
			gDS["DS_CTR_INTP_MTT_LIST"][a_row].CS_RLP_SECD						= a_array[19];			// 주피와의
																										// 관계
		}
		
		if (isInit) { // 초기화시에만
			gDS["DS_CTR_INTP_MTT_LIST"][a_row].PYMRT						= "0";  	// 지급율
		}
		
		// 변액적합성진단 조회
// inquiryVarFitDiag(a_array[0], a_array[1], a_array[2], a_row);
	};
	
	// 변액적합성진단 조회
	function inquiryVarFitDiag(csPk, csNam, csnum, a_row)
	{
		console.log("inquiryVarFitDiag>>", csPk);
		console.log("inquiryVarFitDiag>>", csNam);
		console.log("inquiryVarFitDiag>>", csnum);
		console.log("inquiryVarFitDiag>>", a_row);
		// 계약자인 경우
		if(a_row != 0){
			return false;
		}
		
		if(csPk != "1111111111111" && stringUtil.isNull(csPk) != true && stringUtil.isNull(csPk) != true){
			gDS["DS_VAR_FIT_DIAG_TEMP"] = [];
			
			if(gDS["DS_MAI_INF"].length > 0 && !stringUtil.isNull(gDS["DS_MAI_INF"][0].PLYNO)){
				// 증권번호가 있는 경우는 CS_PK, CS_NAM, CSNUM 으로 존재하는지 체크 후 조회
				var arr_INS_DS_VAR_FIT_DIAG_filterd =  $.grep(gDS["INS_DS_VAR_FIT_DIAG"], function( o){if(o.CS_PK == csPk && o.CS_NAM == csNam && o.CSNUM == csnum ){return ; } });
				var cnt = arr_INS_DS_VAR_FIT_DIAG_filterd.length;
			}else{
				// 증권번호가 없는 경우는 채널 CS_PK, CS_NAM, CSNUM 로 존재유무 확인후 조회
				if(gDS["INS_DS_VAR_FIT_DIAG"].length > 0){
					var cnt = $.grep(gDS["INS_DS_VAR_FIT_DIAG"], function(objTmp){if(objTmp.CHN_CS_PK==csPk && objTmp.CS_NAM==csNam && objTmp.CSNUM==csnum){return true; } }).length
				}
			}
		
			if(gDS["DS_VAR_FIT_DIAG_TEMP"].length > 0 ){
				var pk = gDS["DS_VAR_FIT_DIAG_TEMP"][0].CHN_VAR_FIT_DIAG_PK;
				var sysCod = gDS["DS_VAR_FIT_DIAG_TEMP"][0].SYS_COD;
				var arr_INS_DS_VAR_FIT_DIAG_filterd = $.grep(gDS["INS_DS_VAR_FIT_DIAG"], function(objTmp){if(objTmp.CHN_VAR_FIT_DIAG_PK == pk && objTmp.SYS_COD == sysCod){return true; } });
	
				if(arr_INS_DS_VAR_FIT_DIAG_filterd.length < 1){
					gDS["INS_DS_VAR_FIT_DIAG"].push({});
					gDS["INS_DS_VAR_FIT_DIAG"].copyArrayRow(gDS["INS_DS_VAR_FIT_DIAG"],  gDS["INS_DS_VAR_FIT_DIAG"].length-1, gDS["DS_VAR_FIT_DIAG_TEMP"], 0);
				}
			}
			
			if(a_row == 0){
				// 계약자인 경우
				setVarFitDiagInf(csPk, csNam, csnum);
			}
			application.https.Sync = tempSync;
		}
	};
	
	/*
	 * 펀드 내역 세팅
	 */ 
	function setVarFitDiagInf(csPk, csNam, csnum)
	{
	 	var inValue = "";
	 	
	 	if(gDS["DS_MAI_INF"].length > 0 && !stringUtil.isNull(gDS["DS_MAI_INF"][0].PLYNO)){
	 		// 증권번호가 있는 경우는 CS_PK, CS_NAM, CSNUM 으로 존재하는지 체크
	 		var arr_INS_DS_VAR_FIT_DIAG_filterd  = $.grep(gDS["INS_DS_VAR_FIT_DIAG"], function(objTmp){if(objTmp.CS_PK == csPk && objTmp.CS_NAM == csNam && objTmp.CSNUM == csnum){return true; } });
	 		
	 		if(arr_INS_DS_VAR_FIT_DIAG_filterd.length > 0){
	 			if(arr_INS_DS_VAR_FIT_DIAG_filterd[0].DIAG_YN == "0"){
	 				inValue = "불원";
	 			}else{
	 				inValue = arr_INS_DS_VAR_FIT_DIAG_filterd[0].INS_CTR_PRPS_NAM;
	 			}
	 		}else{
	 			arr_INS_DS_VAR_FIT_DIAG_filterd = $.grep(gDS["INS_DS_VAR_FIT_DIAG"], function( objTmp){if(objTmp.CHN_CS_PK == csPk && objTmp.CS_NAM == csNam && objTmp.CSNUM == csnum ){return true ; } });
	 			
	 			if(arr_INS_DS_VAR_FIT_DIAG_filterd.length > 0){
	 				if(arr_INS_DS_VAR_FIT_DIAG_filterd[0].DIAG_YN == "0"){
	 					inValue = "불원";
	 				}else{
	 					inValue = arr_INS_DS_VAR_FIT_DIAG_filterd[0].INS_CTR_PRPS_NAM;
	 				}
	 			}
	 		}
	 	}else{
	 		// 증권번호가 없는 경우는 채널 CS_PK, CS_NAM, CSNUM 로 존재유무 확인
	 		if(gDS["INS_DS_VAR_FIT_DIAG"].length > 0){
	 			var arr_filterd_INS_DS_VAR_FIT_DIAG =  $.grep(gDS["INS_DS_VAR_FIT_DIAG"], function(objTmp){if(objTmp.CHN_CS_PK == csPk && objTmp.CS_NAM == csNam && objTmp.CSNUM == csnum){return true; } });
	 			if(arr_filterd_INS_DS_VAR_FIT_DIAG.length > 0){
	 				if(arr_filterd_INS_DS_VAR_FIT_DIAG[0].DIAG_YN == "0"){
	 					inValue = "불원";
	 				}else{
	 					inValue = arr_filterd_INS_DS_VAR_FIT_DIAG[0].INS_CTR_PRPS_NAM;
	 				}
	 			}
	 		}
	 	}
	 	 	
	 	var sCS_PK   = "CHN_CS_PK==";
	
		if(gVAL.loadMode != "N" && gVAL.loadMode != "Q"){
			sCS_PK = "CS_PK==";
		}
	 	
	 	var arr_filterd_INS_DS_VAR_FIT_DIAG = $.grep(gDS["INS_DS_VAR_FIT_DIAG"], function(objTmp){
	 		if(gVAL.loadMode != "N" && gVAL.loadMode != "Q"){
	 			if(		objTmp.CS_PK 		== gDS["DS_CTR_INTP_MTT_LIST"].find( function(o){if(o.CTR_RLE_SECD == "11")return true;}).CS_PK
	 				&&	objTmp.CS_NAM 		== gDS["DS_CTR_INTP_MTT_LIST"].find( function(o){if(o.CTR_RLE_SECD == "11")return true;}).CS_NAM
	 				&& 	objTmp.CSNUM 		== gDS["DS_CTR_INTP_MTT_LIST"].find( function(o){if(o.CTR_RLE_SECD == "11")return true;}).RRN
	 			){
	 				return true;	
	 			}
	 		}else{
	 			if(		objTmp.CHN_CS_PK 	== gDS["DS_CTR_INTP_MTT_LIST"].find( function(o){if(o.CTR_RLE_SECD == "11")return true;}).CS_PK 
	 				&&	objTmp.CS_NAM 		== gDS["DS_CTR_INTP_MTT_LIST"].find( function(o){if(o.CTR_RLE_SECD == "11")return true;}).CS_NAM
	 				&& 	objTmp.CSNUM 		== gDS["DS_CTR_INTP_MTT_LIST"].find( function(o){if(o.CTR_RLE_SECD == "11")return true;}).RRN
	 			){
	 				return true;	
	 			}
	 		}
			
	 	});
	};

	/*
	 * [계약자, 피보험자, 만기수익자, 장해수익자, 사망수익자] 고객관계 구분 combo를 구성
	 * ----------------------------------------------------------------------------------- @
	 * selBoxName : 고객관계구분코드 정보를 입력할 대상 select Box @ selfYN : 본인인지 아닌지의 여부 [0:
	 * 본인이 아닐 경우 , 1: 본인, 14: 법정상속인]
	 */
	function fn_setOption_csRlpSecd(selBoxName, selfYN){
		var $sel_csRlpSecd = $(selBoxName);
		$sel_csRlpSecd.html("");// combo 초기화
		$sel_csRlpSecd.prop('disabled', true);
		
		if(!stringUtil.isNull(selfYN) && selfYN == '1'){ // 고객관계구분코드가 [본인]이면
			$("<option/>").attr({value : "1"}).html("본인").appendTo($sel_csRlpSecd);	// [본인]목록을
																					// 추가해
																					// 주고
			$sel_csRlpSecd.prop('disabled', true); 		// 계약자 [고객관계구분코드]를 비활성화
		}else if(!stringUtil.isNull(selfYN) && selfYN == '14'){ // 고객관계구분코드가 [법정상속인]이면
			$("<option/>").attr({value : "14"}).html("법정상속인").appendTo($sel_csRlpSecd);	// [법정상속인]목록을추가해주고
			$sel_csRlpSecd.prop('disabled', true); 		// 계약자 [고객관계구분코드]를 비활성화
		}else{	// 고객관계구분코드가 [본인]이 아니면
			// [선택]목록을 추가 한다.
			$("<option/>").attr({value: ''}).html("주피와의관계").appendTo($sel_csRlpSecd);
			/*
			 * 고객관계구코드 정보를 타겟 combo에 구성한다. (단 본인은 제거한다.)
			 * ------------------------------------------------------------------------
			 * 2 : 배우자, 3 : 부모, 4 : 자녀, 5 : 조부모, 6 : 손주, 7 : 형제자매, 8 : 친척, 9 :
			 * 외조부모, 10 : 처부모, 11 : 시부모, 12 : 사위, 13 : 며느리, 14 : 법정상속인, 95 :
			 * 기타사업장, 96 : 법인대표, 97 : 단체, 98 : 법인, 99 : 기타, 999 : 직접입력, 100 :
			 * FC대리접수
			 */
			$.each(gDS["DS_CMB_CTRINTP_CSRLP"], function(index, obj){
				if(obj.COD != "1" && obj.COD != "999"){
					$("<option/>").attr({value : obj.COD}).html(obj.COD_NAM).appendTo($sel_csRlpSecd);				
				}
			});	
			$sel_csRlpSecd.prop('disabled', false); 		// 계약자 [고객관계구분코드]를
															// 활성화
		}
	};

	// 고령층 지정인 알림 서비스
	function elderCheck(){
		var obj_custInfo_11 = gDS["DS_CTR_INTP_MTT_LIST"][0]; // 계약자 정보
		var fulAge = dateUtil.getRealAge(obj_custInfo_11.RRN);	// 만나이
		var val_mhypym = gDS["DS_QTT_PRD"][0].MHYPYM_STDPRM;	// 월납 보험료
		
		console.log("obj_custInfo_11>>", obj_custInfo_11);
		console.log("fulAge>>", fulAge);
		console.log("val_mhypym>>", val_mhypym);

		console.log("gDS['ds_ProdtTypeMtt'][0].VAR_PDT_KNCD>>", gDS['ds_ProdtTypeMtt'][0].VAR_PDT_KNCD);
		console.log("gDS['ds_ProdtTypeMtt'][0].AUTHRZT_WLIF_KNCD>>", gDS['ds_ProdtTypeMtt'][0].AUTHRZT_WLIF_KNCD);

		if(gDS['ds_ProdtTypeMtt'][0].VAR_PDT_KNCD != "0" || gDS['ds_ProdtTypeMtt'][0].AUTHRZT_WLIF_KNCD != "0"){
			if("20" != D.global.getUserInfo('chndtlcd')){ // TM채널 제외
				if(fulAge >= 65 && parseInt(val_mhypym) > 50000){
					$("#divElder").show();
					sArarmYn = true;
				
				}else{
					$("#divElder").hide();
				}
			}else{
				$("#divElder").hide();
			}
		}else{
				$("#divElder").hide();
		}
	}

	/*
	 * 납입기간 설정
	 */
	function setPypd(ds_id) {
// dialog.alert("setPypd S");
	    var nRow;
	    var arr_DS;
	    if (stringUtil.isNull(ds_id)) {
	        arr_DS = gDS["ds_Pypd"];
	    } else {
	    	arr_DS = gDS[ds_id];
	    }


	    if (gDS["DS_PYPD_TEMP"].length > 0) {
	        for (var i = 0; i < gDS["DS_PYPD_TEMP"].length; i++) {
	            var adPrdcd = gDS["DS_PYPD_TEMP"][i].AD_PRDCD;
	            for (var j = arr_DS.length; j > 0; j--) {
	                if (arr_DS[j-1].AD_PRDCD == adPrdcd) {
	                    arr_DS.splice(j-1, 1);
	                }
	            }
	        }
	        for (var i = 0; i < gDS["DS_PYPD_TEMP"].length; i++) {
	        	arr_DS.push({});
	            nRow = arr_DS.length-1;
	           	dcUtil.copyArrayRow(arr_DS, nRow, gDS["DS_PYPD_TEMP"], i);
	        }
	    }
	    gDS["DS_NTPRD_PYPD"] = [];
	    var existYn = false;
	    for (var i = 0; i < arr_DS.length; i++) {
	        existYn = false;
	        for (var j = 0; j < gDS["DS_NTPRD_PYPD"].length; j++) {
	            if (arr_DS[i].PYPD == gDS["DS_NTPRD_PYPD"][j].COD && arr_DS[i].PYPD_UNT_COD == gDS["DS_NTPRD_PYPD"][j].UNT_SECD) {
	                existYn = true;
	                break;
	            }
	        }
	        if (existYn == false) {
	            gDS["DS_NTPRD_PYPD"].push({});
	           	nRow = gDS["DS_NTPRD_PYPD"].length-1;
	           	var option  = {};
	           	option.strColInfo = "COD=PYPD,COD_NAM=PYPD_DISPLAY,UNT_SECD=PYPD_UNT_COD";
	           	dcUtil.copyArrayRow(gDS["DS_NTPRD_PYPD"], nRow, arr_DS, i, option);
	        }
	    }



	    var option = {};
		option.copyYN = false;  // 전달 받은 배열 자체를 수정하는 하는 옵션 true이면 전달 받은 객체를 변경
								// 하지 않고 복사하여 수정후 반환한다.
	    dcUtil.objectArraySort(gDS["DS_NTPRD_PYPD"], "COD", option ); // DS_NTPRD_TRMINS
																		// 배열의
																		// "COD"
																		// 필드
																		// 오름차순으로
																		// 정렬

	    if ( gVAL["setDB"] == true &&  gVAL["maiPdtChnYn"] == false) {
	        gDS["DS_PYPD_TEMP"] = [];
	        return true;
	    }
	    
	    var mprdRow = $.map(gDS["DS_NTPRD_MTT"], function(obj, index){if(obj.PDT_RLPCD == "1"){return index; } })[0];
	    var mprdPrdcd 	= gDS["DS_NTPRD_MTT"][mprdRow].PRDCD;
	    var mprdPypd  	= gDS["DS_NTPRD_MTT"][mprdRow].PYPD;
	    var mprdPypdDis = gDS["DS_NTPRD_MTT"][mprdRow].PYPD_DISPLAY;

	    if (stringUtil.isNull(mprdPypd)) {
	        var sPypd = getMaxMaiTrminsPypd("2");
	        var sPypdDis = getMaxMaiTrminsPypd2("2");

	        var nRow_DS_NTPRD_PYPD = $.map(gDS["DS_NTPRD_PYPD"], function(obj, index){if(obj.COD_NAM == sPypdDis){return index; } })[0];
	        var sUntSecd =gDS["DS_NTPRD_PYPD"][nRow_DS_NTPRD_PYPD].UNT_SECD;
	        gDS["DS_NTPRD_MTT"][mprdRow].PYPD =	sPypd;
	        gDS["DS_NTPRD_MTT"][mprdRow].PYPD_UNT_COD =	sUntSecd;
	        gDS["DS_NTPRD_MTT"][mprdRow].PYPD_DISPLAY =	sPypdDis;
	        
	    } else {
	        var sChk = false;
	        for (var i = 0; i < arr_DS.length; i++) {
	            if (mprdPypdDis == arr_DS[i].PYPD_DISPLAY && mprdPrdcd == arr_DS[i].AD_PRDCD) {
	                sChk = true;
	                break;
	            }
	        }
	        if (!sChk) {
	            var sPypd = getMaxMaiTrminsPypd("2");
	            var sPypdDis = getMaxMaiTrminsPypd2("2");
	            var nRow_DS_NTPRD_PYPD = $.map(gDS["DS_NTPRD_PYPD"], function(obj, index){if(obj.COD_NAM == sPypdDis){return index; } })[0];
	            var sUntSecd = gDS["DS_NTPRD_PYPD"][nRow_DS_NTPRD_PYPD].UNT_SECD;
	            gDS["DS_NTPRD_MTT"][mprdRow].PYPD=sPypd;
	            gDS["DS_NTPRD_MTT"][mprdRow].PYPD_UNT_COD=sUntSecd;
	            gDS["DS_NTPRD_MTT"][mprdRow].PYPD_DISPLAY=sPypdDis;
	        }
	    }

	    mprdRow = $.map(gDS["DS_NTPRD_MTT"], function(obj, index){if(obj.PDT_RLPCD =="1"){return index; } })[0];
	    mprdPrdcd = gDS["DS_NTPRD_MTT"][mprdRow].PRDCD;
	    mprdPypd = gDS["DS_NTPRD_MTT"][mprdRow].PYPD;
	    mprdPypdDis = gDS["DS_NTPRD_MTT"][mprdRow].PYPD_DISPLAY;
	    var rowCnt = gDS["DS_PYPD_TEMP"].length;
	    var sPrdcd = "";
	    var sPypd = "";
	    var sUntSecd = "";
	    for (var i = 0; i < gDS["DS_NTPRD_MTT"].length; i++) {
	        sPrdcd = gDS["DS_NTPRD_MTT"][i].PRDCD;
	        var sPypd_ori = gDS["DS_NTPRD_MTT"][i].PYPD;
	        var sPypdUntCode_ori = gDS["DS_NTPRD_MTT"][i].PYPD_UNT_COD;
	        if (gDS["DS_NTPRD_MTT"][i].CHK != "1") {
	            continue;
	        }
	        if (gDS["DS_NTPRD_MTT"][i].PDT_RLPCD == "1") {
	            continue;
	        }
	        if (rowCnt > 0) {
	        	var index_DS_PYPD_TEMP = $.map(gDS["DS_PYPD_TEMP"], function(obj, index){ if(obj.AD_PRDCD == sPrdcd){ return index; }})[0];
	            if (index_DS_PYPD_TEMP < 0) {
	                continue;
	            }
	        }

	        sPypd 		= getGreatestPypd(sPrdcd);
	        sUntSecd 	= getHCPypd(sPrdcd, sPypd);

	        if( $.grep(gDS["ds_Pypd"], function(o){if(o.AD_PRDCD == sPrdcd && o.PYPD == sPypd_ori  && o.PYPD_UNT_COD == sPypdUntCode_ori)return true;} ).length > 0 ){
	        	
	        	sPypd 		=sPypd_ori;
	        	sUntSecd 	=sPypdUntCode_ori;
	        }

	        gDS["DS_NTPRD_MTT"][i].PYPD =sPypd;
	        gDS["DS_NTPRD_MTT"][i].PYPD_UNT_COD =  sUntSecd;
	        if (sPypd != "0") {
	            if (stringUtil.isNull(sPypd) != true && stringUtil.isNull(sPypd) != true) {
	                gDS["DS_NTPRD_MTT"][i].PYPD_DISPLAY = sPypd + (sUntSecd == "1"? "년": "세");
	            }
	        } else {
	            gDS["DS_NTPRD_MTT"][i].PYPD_DISPLAY =  "일시납";
	        }
	    }
	    gDS["DS_PYPD_TEMP"] = [];
	};

	function getHCPypd(sPrdcd,sPypd)
	{
		var	mprdRow = $.map(gDS["DS_NTPRD_MTT"], function(obj, index){ if(obj.PDT_RLPCD == "1"){return index; }})[0];
		var sUntSecd;
		
		if((gDS["DS_NTPRD_MTT"][mprdRow].PRDCD).substring(0,2)=="9I"&&gDS["DS_NTPRD_MTT"][mprdRow].TRMINS_DISPLAY =="20세"
		   &&(gDS["DS_NTPRD_MTT"][mprdRow].PRDCD =="YM4823AP0"||gDS["DS_NTPRD_MTT"][mprdRow].PRDCD =="YM4923AR4"
			||gDS["DS_NTPRD_MTT"][mprdRow].PRDCD =="YM5023AW4"||gDS["DS_NTPRD_MTT"][mprdRow].PRDCD =="YM5123AW1"
			||gDS["DS_NTPRD_MTT"][mprdRow].PRDCD =="YM5223AT2")){
				if(sPypd=="0"){
					sUntSecd = "1";
				}else{
					sUntSecd = "2";
				}
		}else if((gDS["DS_NTPRD_MTT"][mprdRow].PRDCD).substring(0,2)=="9H"&&gDS["DS_NTPRD_MTT"][mprdRow].TRMINS_DISPLAY =="20세"
		   &&(gDS["DS_NTPRD_MTT"][mprdRow].PRDCD =="YM4823AP0"||gDS["DS_NTPRD_MTT"][mprdRow].PRDCD =="YM4923AR4"
			||gDS["DS_NTPRD_MTT"][mprdRow].PRDCD =="YM5023AW4"||gDS["DS_NTPRD_MTT"][mprdRow].PRDCD =="YM5123AW1"
			||gDS["DS_NTPRD_MTT"][mprdRow].PRDCD =="YM5223AT2")){
				if(sPypd=="0"){
					sUntSecd = "1";
				}else{
					sUntSecd = "2";
				}
		} else{
				sUntSecd = getPypdUntSecd(sPrdcd, sPypd);
		}

		return sUntSecd;
	};
	
	function getPypdUntSecd(nPrdcd, nPypd) {
	    var rst = "";
	    for (var i = 0; i < gDS["ds_Pypd"].length; i++) {
	        if (nPrdcd == gDS["ds_Pypd"][i].AD_PRDCD) {
	            if (nPypd == gDS["ds_Pypd"][i].PYPD) {
	                rst = gDS["ds_Pypd"][i].PYPD_UNT_COD;
	                break;
	            }
	        }
	    }
	    return rst;
	};
	
	
	function getGreatestPypd(nPrdcd) {
	    var objDS = gDS["ds_Pypd"];
	    var curRow = $.map(gDS["DS_NTPRD_MTT"], function(obj, index){if(obj.PRDCD == nPrdcd){return index; } })[0];
	    var mprdRow = $.map(gDS["DS_NTPRD_MTT"], function(obj, index){if(obj.PDT_RLPCD  == "1" ){return index; } })[0];
	    var mprdCod = gDS["DS_NTPRD_MTT"][mprdRow].PYPD;
	    var mprdUntCod = gDS["DS_NTPRD_MTT"][mprdRow].PYPD_UNT_COD;
	    var csAge = $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD  == "21" ){return obj.PRCMPAG; } })[0];
	    var mprdYear = cc_chkUntGod(mprdCod, mprdUntCod, csAge);
	    var sCollAsrdCod = gDS["DS_NTPRD_MTT"][curRow].YY_CONV_APPT_RLPCD;
	    var sCollAsrdAge = $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD == sCollAsrdCod){return obj.PRCMPAG; } })[0];
	    
	    if (stringUtil.isNull(sCollAsrdAge)) {
	        D.logger.debug("담보피보험자 정보 없음");
	        return "";
	    }
	    gDS["DS_TMP"] = [];
	    var maxYear = "-1";
	    var tYear;
	    var mYear;

	    var tRlpcd = gDS["DS_NTPRD_MTT"][curRow].PYPD_RLPCD;

	    for (var i = 0; i < objDS.length; i++) {
	        if (objDS[i].AD_PRDCD == nPrdcd) {
	            var tCod = objDS[i].PYPD;
	            var tUntCod = objDS[i].PYPD_UNT_COD;
	           	gDS["DS_TMP"].push({});
	            var nRow = gDS["DS_TMP"].length-1;

	            gDS["DS_TMP"][nRow].M_COD= mprdCod;
	            gDS["DS_TMP"][nRow].M_YEAR= mprdYear;
	            gDS["DS_TMP"][nRow].T_PRDCD= nPrdcd;
	            gDS["DS_TMP"][nRow].T_COD= tCod;
	            gDS["DS_TMP"][nRow].T_YEAR= cc_chkUntGod(tCod, tUntCod, sCollAsrdAge);
	        }
	    }
	    if (tRlpcd == "1") {
	        for (var i = 0; i < gDS["DS_TMP"].length; i++) {
	            mYear = gDS["DS_TMP"][i].M_YEAR;
	            tYear = gDS["DS_TMP"][i].T_YEAR;
	            if (parseInt(mYear) > parseInt(tYear)) {
	                if (mprdCod == gDS["DS_TMP"][i].T_COD) {
	                    maxYear = tYear;
	                    break;
	                } else {
	                    if (parseInt(maxYear) < parseInt(tYear)) {
	                        maxYear = tYear;
	                    }
	                }
	            }
	        }
	    } else if (tRlpcd == "2") {
	        for (var i = 0; i < gDS["DS_TMP"].length; i++) {
	            mYear = gDS["DS_TMP"][i].M_YEAR;
	            tYear = gDS["DS_TMP"][i].T_YEAR;
	            if (parseInt(mYear) >= parseInt(tYear)) {
	                if (mprdCod == gDS["DS_TMP"][i].T_COD) {
	                    maxYear = tYear;
	                    break;
	                } else {
	                    if (parseInt(maxYear) < parseInt(tYear)) {
	                        maxYear = tYear;
	                    }
	                }
	            }
	        }
	    } else if (tRlpcd == "3") {
	        for (var i = 0; i < gDS["DS_TMP"].length; i++) {
	            mYear = gDS["DS_TMP"][i].M_YEAR;
	            tYear = gDS["DS_TMP"][i].T_YEAR;
	            if (parseInt(mYear) == parseInt(tYear)) {
	                if (mprdCod == gDS["DS_TMP"][i].T_COD) {
	                    maxYear = tYear;
	                    break;
	                } else {
	                    if (parseInt(maxYear) < parseInt(tYear)) {
	                        maxYear = tYear;
	                    }
	                }
	            }
	        }
	    } else if (tRlpcd == "4") {
	        for (var i = 0; i < gDS["DS_TMP"].length; i++) {
	            mYear = gDS["DS_TMP"][i].M_YEAR;
	            tYear = gDS["DS_TMP"][i].T_YEAR;
	            if (parseInt(mYear) <= parseInt(tYear)) {
	                if (mprdCod == gDS["DS_TMP"][i].T_COD) {
	                    maxYear = tYear;
	                    break;
	                } else {
	                    if (parseInt(maxYear) < parseInt(tYear)) {
	                        maxYear = tYear;
	                    }
	                }
	            }
	        }
	    } else if (tRlpcd == "5") {
	        for (var i = 0; i < gDS["DS_TMP"].length; i++) {
	            mYear = gDS["DS_TMP"][i].M_YEAR;
	            tYear = gDS["DS_TMP"][i].T_YEAR;
	            if (parseInt(mYear) == parseInt(tYear)) {
	                if (mprdCod == gDS["DS_TMP"][i].T_COD) {
	                    maxYear = tYear;
	                    break;
	                } else {
	                    if (parseInt(maxYear) < parseInt(tYear)) {
	                        maxYear = tYear;
	                    }
	                }
	            }
	        }
	    } else if (tRlpcd == "6") {
	        for (var i = 0; i < gDS["DS_TMP"].length; i++) {
	            mYear = gDS["DS_TMP"][i].M_YEAR;
	            tYear = gDS["DS_TMP"][i].T_YEAR;
	            if (parseInt(mYear) == parseInt(tYear)) {
	                if (mprdCod == gDS["DS_TMP"][i].T_COD) {
	                    maxYear = tYear;
	                    break;
	                } else {
	                    if (parseInt(maxYear) < parseInt(tYear)) {
	                        maxYear = tYear;
	                    }
	                }
	            }
	        }
	    } else if (tRlpcd == "7") {
	        for (var i = 0; i < gDS["DS_TMP"].length; i++) {
	            mYear = gDS["DS_TMP"][i].M_YEAR;
	            tYear = gDS["DS_TMP"][i].T_YEAR;
	            if (mYear == "0") {
	                if (tYear == "1") {
	                    maxYear = tYear;
	                    break;
	                }
	            } else {
	                if (parseInt(mYear) >= parseInt(tYear)) {
	                    if (mprdCod == gDS["DS_TMP"][i].T_COD) {
	                        maxYear = tYear;
	                        break;
	                    } else {
	                        if (parseInt(maxYear) < parseInt(tYear)) {
	                            maxYear = tYear;
	                        }
	                    }
	                }
	            }
	            if (mprdCod == gDS["DS_TMP"][i].T_COD) {
	                maxYear = tYear;
	                break;
	            } else {
	                if (parseInt(maxYear) < parseInt(tYear)) {
	                    maxYear = tYear;
	                }
	            }
	        }
	    } else if (tRlpcd == "8") {
	        for (var i = 0; i < gDS["DS_TMP"].length; i++) {
	            mYear = gDS["DS_TMP"][i].M_YEAR;
	            tYear = gDS["DS_TMP"][i].T_YEAR;
	            if (mprdCod == gDS["DS_TMP"][i].T_COD) {
	                maxYear = tYear;
	                break;
	            } else {
	                if (parseInt(maxYear) < parseInt(tYear)) {
	                    maxYear = tYear;
	                }
	            }
	        }
	    } else {
	        for (var i = 0; i < gDS["DS_TMP"].length; i++) {
	            mYear = gDS["DS_TMP"][i].M_YEAR;
	            tYear = gDS["DS_TMP"][i].T_YEAR;
	            if (mprdCod == gDS["DS_TMP"][i].T_COD) {
	                maxYear = tYear;
	                break;
	            } else {
	                if (parseInt(maxYear) < parseInt(tYear)) {
	                    maxYear = tYear;
	                }
	            }
	        }
	    }

	    var nRow = $.map(gDS["DS_TMP"], function(obj, index){if(obj.T_YEAR == maxYear){return index; } })[0];
	    var rstVar = gDS["DS_TMP"][nRow].T_COD;
	    return rstVar;
	};

	/*
	 * 납입주기 설정
	 */
	function setPycycCod(ds_id) {
// dialog.alert("setPycycCod S");
	    var nRow;
	    var DS_OBJ;
	    if (stringUtil.isNull(ds_id)) {
	        DS_OBJ = gDS["ds_Pycyc"];
	    } else {
	        DS_OBJ = gDS[ds_id];
	    }
	    
	    for (var i = 0; i < DS_OBJ.length; i++) {
	    	var nRow_DS_NTPRD_PYCYC = $.map(gDS["DS_NTPRD_PYCYC"], function(obj, index){if(obj.COD == DS_OBJ[i].PYCYC_COD){return index; } })[0];
	       	if(stringUtil.isNull(nRow_DS_NTPRD_PYCYC)){
	            gDS["DS_NTPRD_PYCYC"].push({});
				nRow = gDS["DS_NTPRD_PYCYC"].length-1;
	            gDS["DS_NTPRD_PYCYC"][nRow].COD 	= 	DS_OBJ[i].PYCYC_COD;
	            gDS["DS_NTPRD_PYCYC"][nRow].COD_NAM = 	DS_OBJ[i].PYCYC_COD_DISPLAY;
	            gDS["DS_NTPRD_PYCYC"][nRow].PRDCD 	= 	DS_OBJ[i].AD_PRDCD;
	        }
	    }

	    if (gVAL["setDB"] == true && gVAL["maiPdtChnYn"] == false) {
	        return true;
	    }


	    for (var i = 0; i < gDS["DS_NTPRD_MTT"].length; i++) {
	        if (!stringUtil.isNull(gDS["DS_NTPRD_MTT"][i].PYPD)) {
	            if (gDS["DS_NTPRD_MTT"][i].PYPD == "0") {
	                gDS["DS_NTPRD_MTT"][i].PYCYC_COD = "9";
	            } else {
	                gDS["DS_NTPRD_MTT"][i].PYCYC_COD = getPsbyPycyc(i);
	            }
	        }
	    }

	};

	function getPsbyPycyc(nRow) {
	    var resultVar = "";
	    var objDS = gDS["ds_Pycyc"];
	    var mprdRow = $.map(gDS["DS_NTPRD_MTT"], function(obj, index){if(obj.PDT_RLPCD == "1"){return index; } })[0];
	    var mprdPypd = gDS["DS_NTPRD_MTT"][mprdRow].PYPD;
	    var mprdPycycCod = gDS["DS_NTPRD_MTT"][mprdRow].PYCYC_COD;
	    var nPycycRlpcd = gDS["DS_NTPRD_MTT"][nRow].PYCYC_RLPCD;
	    var nPypd = gDS["DS_NTPRD_MTT"][nRow].PYPD;
	    var nPycycCod = gDS["DS_NTPRD_MTT"][nRow].PYCYC_COD;
	    if (nRow == mprdRow) {
	        if (stringUtil.isNull(mprdPycycCod)) {
	            for (var i = 0; i < objDS.length; i++) {
	                if (gDS["DS_NTPRD_MTT"][nRow].PRDCD == objDS[i].AD_PRDCD) {
	                    if ("1" == objDS[i].PYCYC_COD) {
	                        resultVar = objDS[i].PYCYC_COD;
	                        break;
	                    } else {
	                        resultVar = objDS[i].PYCYC_COD;
	                    }
	                }
	            }
	        } else {
	            var chkVal = false;
	            for (var i = 0; i < objDS.length; i++) {
	                if (gDS["DS_NTPRD_MTT"][nRow].PRDCD == objDS[i].AD_PRDCD) {
	                    if (mprdPycycCod == objDS[i].PYCYC_COD) {
	                        chkVal = true;
	                        break;
	                    }
	                }
	            }
	            if (!chkVal) {
	                for (var i = 0; i < objDS.length; i++) {
	                    if (gDS["DS_NTPRD_MTT"][nRow].PRDCD == objDS[i].AD_PRDCD) {
	                        if ("1" == objDS[i].PYCYC_COD) {
	                            mprdPycycCod = objDS[i].PYCYC_COD;
	                            break;
	                        } else {
	                            mprdPycycCod = objDS[i].PYCYC_COD;
	                        }
	                    }
	                }
	            }
	            if (mprdPypd == "0") {
	                mprdPycycCod = "9";
	            }
	            resultVar = mprdPycycCod;
	        }
	    }
	    if (mprdRow != nRow) {
	        resultVar = "";
	        if (nPycycRlpcd == "0") {
	            for (var i = 0; i < objDS.length; i++) {
	                if (gDS["DS_NTPRD_MTT"][nRow].PRDCD == objDS[i].AD_PRDCD) {
	                    if (mprdPycycCod == objDS[i].PYCYC_COD) {
	                        resultVar = objDS[i].PYCYC_COD;
	                        break;
	                    }
	                }
	            }
	        } else if (nPycycRlpcd == "1") {
	            for (var i = 0; i < objDS.length; i++) {
	                if (gDS["DS_NTPRD_MTT"][nRow].PRDCD == objDS[i].AD_PRDCD) {
	                    if ("9" == objDS[i].PYCYC_COD) {
	                        resultVar = objDS[i].PYCYC_COD;
	                        break;
	                    }
	                }
	            }
	        } else if (nPycycRlpcd == "2") {
	            for (var i = 0; i < objDS.length; i++) {
	                if (gDS["DS_NTPRD_MTT"][nRow].PRDCD == objDS[i].AD_PRDCD) {
	                    if ("8" == objDS[i].PYCYC_COD) {
	                        resultVar = objDS[i].PYCYC_COD;
	                        break;
	                    }
	                }
	            }
	        } else if (nPycycRlpcd == "3") {
	            if (mprdPycycCod == "9") {
	                for (var i = 0; i < objDS.length; i++) {
	                    if (gDS["DS_NTPRD_MTT"][nRow].PRDCD == objDS[i].AD_PRDCD) {
	                        if (mprdPycycCod == objDS[i].PYCYC_COD) {
	                            resultVar = objDS[i].PYCYC_COD;
	                            break;
	                        }
	                    }
	                }
	            } else {
	                for (var i = 0; i < objDS.length; i++) {
	                    if (gDS["DS_NTPRD_MTT"][nRow].PRDCD == objDS[i].AD_PRDCD) {
	                        if (mprdPycycCod == objDS[i].PYCYC_COD) {
	                            resultVar = objDS[i].PYCYC_COD;
	                        }
	                        if ("9" == objDS[i].PYCYC_COD) {
	                            resultVar = objDS[i].PYCYC_COD;
	                            break;
	                        }
	                    }
	                }
	            }
	        } else if (nPycycRlpcd == "4") {
	            if (mprdPycycCod == "9") {
	                for (var i = 0; i < objDS.length; i++) {
	                    if (gDS["DS_NTPRD_MTT"][nRow].PRDCD == objDS[i].AD_PRDCD) {
	                        if ("8" == objDS[i].PYCYC_COD) {
	                            resultVar = objDS[i].PYCYC_COD;
	                            break;
	                        }
	                    }
	                }
	            } else {
	                for (var i = 0; i < objDS.length; i++) {
	                    if (gDS["DS_NTPRD_MTT"][nRow].PRDCD == objDS[i].AD_PRDCD) {
	                        if (mprdPycycCod == objDS[i].PYCYC_COD) {
	                            resultVar = objDS[i].PYCYC_COD;
	                            break;
	                        }
	                    }
	                }
	            }
	        } else if (nPycycRlpcd == "5") {
	            for (var i = 0; i < objDS.length; i++) {
	                if (gDS["DS_NTPRD_MTT"][nRow].PRDCD == objDS[i].AD_PRDCD) {
	                    if ("1" == objDS[i].PYCYC_COD) {
	                        resultVar = objDS[i].PYCYC_COD;
	                        break;
	                    }
	                }
	            }
	            for (var i = 0; i < objDS.length; i++) {
	                if (gDS["DS_NTPRD_MTT"][nRow].PRDCD == objDS[i].AD_PRDCD) {
	                    if ("8" == objDS[i].PYCYC_COD) {
	                        resultVar = objDS[i].PYCYC_COD;
	                        break;
	                    }
	                }
	            }
	        }
	    }
	    return resultVar;
	};


	// *--------------------------------------------------------------------------
	// * 가입상품사항 설정(보험기간) : 수정화면
	// *--------------------------------------------------------------------------
	function setDbNtprdMtt(ds_id)
	{
	    var DS_OBJ;
		DS_OBJ = ( ds_id instanceof Array ) ? ds_id : gDS[ds_id]; 	
		
		if(DS_OBJ.length < 1){
			return;
		}
		
		var smasdAmt;
		var smasdUnt;
		var premAmt;
		var premUnt;
		var nDbPrdcd;
		var typRpsPrdcd;
		var nPrdcd;
		var nPycycCod;
		gDS["DS_CALC_NTPRD"] = [];

		for(var i=0; i< gDS["DS_NTPRD_MTT"].length; i++)
		{
		    nPrdcd 	= gDS["DS_NTPRD_MTT"][i].PRDCD;
			for(var j=0; j<DS_OBJ.length; j++)
			{
				nDbPrdcd   	= DS_OBJ[j].PRDCD;

				typRpsPrdcd = $.map(gDS["ds_NtprdMtt"], function(objTmp, index){if(objTmp.PRDCD == nDbPrdcd){return objTmp.TYP_RPSPRDCD; } })[0];
				
				if( nDbPrdcd == nPrdcd || typRpsPrdcd == nPrdcd) {
					
					smasdAmt = DS_OBJ[j].SMASD;
					smasdUnt = gDS["DS_NTPRD_MTT"][i].SMASD_INP_AMT_UNT_COD;
					premAmt  = DS_OBJ[j].GSPRE;
					premUnt  = gDS["DS_NTPRD_MTT"][i].PREM_INP_AMT_UNT_COD;
				
					if(typRpsPrdcd == nPrdcd){
						
						var nRow = $.map(gDS["ds_NtprdMtt"], function(objTmp, index){if(objTmp.PRDCD == nDbPrdcd){return index; } })[0];


						/* DS_CTR_INTP_MTT_LIST <= DS_CS_LIST 특정열 복사 */
						dcUtil.copyArrayRow(gDS["DS_NTPRD_MTT"], i, gDS["ds_NtprdMtt"], nRow);

					}

					gDS["DS_NTPRD_MTT"][i].CHK=         "1";
					gDS["DS_NTPRD_MTT"][i].PDT_RLPCD= 			DS_OBJ[j].PDT_RLPCD;
					gDS["DS_NTPRD_MTT"][i].SMASD=           String(cc_amtDivUnt(smasdAmt, smasdUnt));
					gDS["DS_NTPRD_MTT"][i].PREM=           	String(cc_amtDivUnt(premAmt, premUnt));
					gDS["DS_NTPRD_MTT"][i].PCAYMD_AFT_GSPRE=   DS_OBJ[j].PCAYMD_AFT_GSPRE;

					if(gVAL["maiPdtChnYn"] !=  true){
						gDS["DS_NTPRD_MTT"][i].ANTY_SWT_APPL_YN=	DS_OBJ[j].ANTY_SWT_APPL_YN == "0" ? "" : DS_OBJ[j].ANTY_SWT_APPL_YN;
					}
					gDS["DS_NTPRD_MTT"][i].YYFRS_CONV=      	DS_OBJ[j].COL_CONV_FTPR;
					gDS["DS_NTPRD_MTT"][i].OYR_CONV=        	DS_OBJ[j].MN_CONV_FTPR;
					gDS["DS_NTPRD_MTT"][i].MHYPRE=          	DS_OBJ[j].MHYPYM_STDPRM;
					gDS["DS_NTPRD_MTT"][i].PYPD_UNT_COD=       DS_OBJ[j].PYPD_UNT_COD;
					gDS["DS_NTPRD_MTT"][i].PYPD=           	DS_OBJ[j].PYPD;
					if(DS_OBJ[j].PYPD!=0){
						gDS["DS_NTPRD_MTT"][i].PYPD_DISPLAY=       DS_OBJ[j].PYPD+ (DS_OBJ[j].PYPD_UNT_COD=="1" ?"년" :"세");// 20090715
																															// 추가
					}else if(DS_OBJ[j].PYPD==0){
						gDS["DS_NTPRD_MTT"][i].PYPD_DISPLAY=       "일시납";// 20090715
																			// 추가
					}
					gDS["DS_NTPRD_MTT"][i].TRMINS_UNT_COD=     DS_OBJ[j].TRMINS_UNT_COD;
					gDS["DS_NTPRD_MTT"][i].TRMINS=           	DS_OBJ[j].TRMINS;
					gDS["DS_NTPRD_MTT"][i].TRMINS_DISPLAY=     DS_OBJ[j].TRMINS+ (DS_OBJ[j].TRMINS_UNT_COD=="1"?"년":"세");// 20090715
																															// 추가
					gDS["DS_NTPRD_MTT"][i].PYCYC_COD=       	DS_OBJ[j].PYCYC_COD;
					
					setPdtTrminsPk2(i, nPrdcd, gDS["DS_NTPRD_MTT"][i].TRMINS_DISPLAY);
					
			   }else{
					// 주상품 코드가 틀릴경우 처리(화면에서 주상품 변경시)
					if(gDS["DS_NTPRD_MTT"][i].PDT_RLPCD == "1"
											&& DS_OBJ[j].PDT_RLPCD == "1"){

						for(var k=0; k < gDS["ds_NtprdMtt"].length; k++){
							
							if(gDS["ds_NtprdMtt"][k].PRDCD == nPrdcd){
								if(gDS["ds_NtprdMtt"][k].TRMINS == DS_OBJ[j].TRMINS){
									
									gDS["DS_NTPRD_MTT"][i].TRMINS_UNT_COD= DS_OBJ[j].TRMINS_UNT_COD;
									gDS["DS_NTPRD_MTT"][i].TRMINS= DS_OBJ[j].TRMINS;
									if(stringUtil.isNull(DS_OBJ[j].TRMINS) != true&&stringUtil.isNull(DS_OBJ[j].TRMINS) != true){
										gDS["DS_NTPRD_MTT"][i].TRMINS_DISPLAY=     DS_OBJ[j].TRMINS+ (DS_OBJ[j].TRMINS_UNT_COD=="1"?"년":"세");// 20090715
																																				// 추가
									}
									gDS["DS_NTPRD_MTT"][i].PYPD_UNT_COD= DS_OBJ[j].PYPD_UNT_COD;
									gDS["DS_NTPRD_MTT"][i].PYPD= DS_OBJ[j].PYPD;
									if(stringUtil.isNull(DS_OBJ[j].PYPD) != true&&stringUtil.isNull(DS_OBJ[j].PYPD) != true){
										gDS["DS_NTPRD_MTT"][i].PYPD_DISPLAY=       DS_OBJ[j].PYPD+(DS_OBJ[j].PYPD_UNT_COD=="1"?"년":"세");// 20090715
																																		// 추가
									}
									gDS["DS_NTPRD_MTT"][i].PYCYC_COD= DS_OBJ[j].PYCYC_COD;
									if(stringUtil.isNull(DS_OBJ[j].TRMINS) != true&&stringUtil.isNull(DS_OBJ[j].TRMINS) != true){
										setPdtTrminsPk2(i, nPrdcd, gDS["DS_NTPRD_MTT"][i].TRMINS_DISPLAY);
									}else{
										setPdtTrminsPk(i, nPrdcd, gDS["DS_NTPRD_MTT"][i].TRMINS);// 20090715
									}
									gVAL["maiPdtChnYn"] = true;
									break;
								}
							}
						}
					}
			   }
			}
		}
		

		if(gDS["ds_PdtTrmins_Pk"].length > 0){
			getPypd();
		}
		
		updateGnasrdCtrRleSecd();

		/*
		 * for(var i=0; i<gDS["DS_NTPRD_MTT"].length; i++){
		 * if(gDS["DS_NTPRD_MTT"][i].CHK == "1"){
		 * setPartNtprd(gDS["DS_NTPRD_MTT"][i].PRDCD); excutePartPremCacl(); } }
		 */
		
		gVAL["MaiPdtChnYn"] = false
		DS_OBJ = [];
	};


	function cc_amtDivUnt(a_amt,a_unt) {
		var unt_amt;
		
		if(stringUtil.isNull(a_amt)||a_amt==0){
			return 0;
		}

		switch(a_unt) {
			case "1":
				unt_amt = 10;
				break;
			case "2":
				unt_amt = 100;
				break;
			case "3":
				unt_amt = 1000;
				break;
			case "4":
				unt_amt = 10000;
				break;
			case "5":
				unt_amt = 100000;
				break;
			case "6":
				unt_amt = 1000000;
				break;
			default:
				unt_amt = 1;
				break;
		}
		return parseInt(a_amt)/parseInt(unt_amt);

	};
	
	 // 실손보험 청약시 의료급여 수급권자 청약 입력사항 반영_2017.08.04
	function fnct_getPlosSadrYn()
	{

		for(var i=0; i<gDS["DS_NTPRD_MTT"].length ; i++)
		{
			if(gDS["DS_NTPRD_MTT"][i].CHK == "1")
			{
				if(gDS["DS_NTPRD_MTT"][i].PLOS_PDT_KNCD == "5")
				{				
					setPlosSadr("1");
					return;
				}
			}
		}			
		setPlosSadr("2");	
	};
	
	function updateGnasrdCtrRleSecd(){
// dialog.alert("updateGnasrdCtrRleSecd S");
		
		for(var i=0; i<gDS["DS_NTPRD_MTT"].length; i++){

			if(gDS["DS_NTPRD_MTT"][i].CHK == "1"){
				addGnasrdCtrRleSecd(gDS["DS_NTPRD_MTT"][i].PRDCD);
			}
		}
	};
	
	// 담보 피보험자 추가
	function addGnasrdCtrRleSecd(nPrdcd){
		var idx   = $.map(gDS["ds_CtrIntpMtt"], function(objTmp, index){if(objTmp.PRDCD == nPrdcd){return index ; } })[0];
		// 해당 상품이 존재할 경우
		if( !stringUtil.isNull(idx) ){
			var val_ESTY_INP_YN 		= $.map(gDS["ds_CtrIntpMtt"], function(objTmp, index){if(index == idx){return objTmp.ESTY_INP_YN; } })[0];
			var val_ASRD_CTR_RLE_SECD 	= $.map(gDS["ds_CtrIntpMtt"], function(objTmp, index){if(index == idx){return objTmp.ASRD_CTR_RLE_SECD; } })[0];
			addCtrIntp(val_ASRD_CTR_RLE_SECD, val_ESTY_INP_YN);
		}
	};


	// 계약관계자 추가
	function addCtrIntp(arg0,arg1){
		var nCtrRleSecd = arg0;
		var nRow = -1;
		// trace("계약관계자 추가로 옴");
		if (arg1 == "2") {
			// 계약자가 남자일 때만 필수입력으로 계약관계자를 추가시켜준다.
			var val_GNDR_SECD = $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(objTmp, index){if(objTmp.CTR_RLE_SECD == '21'){return objTmp.GNDR_SECD; } })[0];
			if (val_GNDR_SECD == "1") { 
				nRow = $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(objTmp, index){if(objTmp.CTR_RLE_SECD == nCtrRleSecd){return index; } })[0];
				if(nRow < 0){
					gDS["DS_CTR_INTP_MTT_LIST"].push({});
					nRow = gDS["DS_CTR_INTP_MTT_LIST"].length -1;
					gDS["DS_CTR_INTP_MTT_LIST"].setColumn(nRow, "CTR_RLE_SECD", nCtrRleSecd);
					gDS["DS_CTR_INTP_MTT_LIST"].setColumn(nRow, "ESTY_INP_YN" , arg1);
				}
			}
		} else {
			nRow = $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD == nCtrRleSecd){return index; }})[0];
			if(nRow < 0){
				if(arg1 == "3"){
					var gndrSecd 	= $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD  == "21" ){return obj.GNDR_SECD; } })[0];
					var val_CS_NAM 	= $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD  == "31" ){return obj.CS_NAM; } })[0];
					var val_RRN 	= $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD  == "31" ){return obj.RRN; } })[0];

					if(gndrSecd == "2"||val_CS_NAM !="태아"||val_RRN!="1111111111111")
					{
						return nRow;
					}
				} else if(arg1 == "4"){
					var val_CS_NAM 	= $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD  == "21" ){return obj.CS_NAM; } })[0];
					var val_RRN 	= $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD  == "21" ){return obj.RRN; } })[0];

					if(val_CS_NAM!="태아"||val_RRN!="1111111111111")
					{
						return nRow;
					}
				}
				// TYLI-SRM-20100825-0372//20100830 추가
				else if(arg1 == "5"){
					var val_CS_NAM 	= $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD  == "21" ){return obj.CS_NAM; } })[0];
					var val_RRN 	= $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD  == "21" ){return obj.RRN; } })[0];
					var gndrSecd 	= $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD  == "21" ){return obj.GNDR_SECD; } })[0];
					if((val_CS_NAM!="태아" || val_RRN!="1111111111111") || gndrSecd!="1")
					{
						return nRow;
					}
				}
				gDS["DS_CTR_INTP_MTT_LIST"].push({});
				nRow = gDS["DS_CTR_INTP_MTT_LIST"].length - 1;
				gDS["DS_CTR_INTP_MTT_LIST"][nRow].CTR_RLE_SECD = nCtrRleSecd;
				gDS["DS_CTR_INTP_MTT_LIST"][nRow].ESTY_INP_YN = arg1;
			} 
			// 20091231 :: 유상묵 수정 ::
			// 태아를 선택하고 엄마정보를 입력후 다시 태아를 출생아로 바꾸면 엄마정보입력된 종피1 or 종피2 정보가
			// 계약관계자에서 삭제가 되지 않는 현상으로 인한 수정
			else if(nRow > 0){
				if(arg1 == "3"){
					var gndrSecd = $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(objTmp, index){if(objTmp.CTR_RLE_SECD == "21"){return objTmp.GNDR_SECD; } })[0];
					var val_CS_NAM 	= $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD  == "31" ){return obj.CS_NAM; } })[0];
					var val_RRN 	= $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD  == "31" ){return obj.RRN; } })[0];
					if(gndrSecd == "2"||val_CS_NAM!="태아")
					{
						delCtrIntp(nCtrRleSecd);
					}else if(gndrSecd == "2"||val_CS_NAM!="태아"||val_RRN!="1111111111111")
					{

						delCtrIntp(nCtrRleSecd);
					}
				}else if(arg1 == "4"){
					var val_CS_NAM 	= $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD  == "21" ){return obj.CS_NAM; } })[0];
					var val_RRN 	= $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD  == "21" ){return obj.RRN; } })[0];
					if(val_CS_NAM!="태아")
					{
						delCtrIntp(nCtrRleSecd);
					}else if(val_CS_NAM!="태아"||val_RRN!="1111111111111")
					{
						delCtrIntp(nCtrRleSecd);
					}
				}
				// TYLI-SRM-20100825-0372 //20100830 추가
				else if(arg1 == "5"){

					var gndrSecd = $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(objTmp, index){if(objTmp.CTR_RLE_SECD == "31"){return objTmp.GNDR_SECD; } })[0];
					var val_CS_NAM 	= $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD  == "21" ){return obj.CS_NAM; } })[0];
					var val_RRN 	= $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD  == "21" ){return obj.RRN; } })[0];
					if(gndrSecd != "1" || val_CS_NAM!="태아" || val_RRN!="1111111111111"){
						delCtrIntp(nCtrRleSecd);
					}
				}//
				gDS["DS_CTR_INTP_MTT_LIST"][nRow].ESTY_INP_YN =  arg1;
			}
		}

		var option = {};
		option.copyYN = false;  // 전달 받은 배열 자체를 수정하는 하는 옵션 true이면 전달 받은 객체를 변경
								// 하지 않고 복사하여 수정후 반환한다.
		dcUtil.objectArraySort(gDS["DS_CTR_INTP_MTT_LIST"], "CTR_RLE_SECD", option ); // DS_NTPRD_TRMINS
																						// 배열의
																						// "COD"
																						// 필드
																						// 오름차순으로
																						// 정렬
		
		// 종피1 생성, 소멸시 신용정보 동의 관련 처리 추가_2011.10.25/최경락 yaki
		/* check */
		// this.draw_object("OTRMTT");
		return nRow;
	};

	// 계약관계자 삭제
	function delCtrIntp(arg){
		var nCtrRleSecd = arg;
		var nRow = $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(objTmp , index){if(objTmp.CTR_RLE_SECD == nCtrRleSecd){return index; } });

		if(!stringUtil.isNull(nRow)){
			gDS["DS_CTR_INTP_MTT_LIST"].splice(nRow, 1);
		}
	};

	function setPdtTrminsPk(nRow, nPrdcd, nTrmins) {
	    var objDS = gDS["ds_NtprdMtt"];
	    var sPrdcd;
	    var sTrmins;
	    var sPdtTrminsPk;
	    for (var i = 0; i < objDS.length; i++) {
	        sPrdcd = objDS[i].PRDCD;
	        sTrmins = objDS[i].TRMINS;
	        sPdtTrminsPk = objDS[i].PDT_TRMINS_PK;
	        if ((sPrdcd == nPrdcd) && (sTrmins == nTrmins)) {
	            gDS["ds_PdtTrmins_Pk"].push({});
	            var aRow = gDS["ds_PdtTrmins_Pk"].length - 1;
	            gDS["ds_PdtTrmins_Pk"][aRow].PDT_TRMINS_PK =  sPdtTrminsPk;
	            break;
	        }
	    }
	};
	
	// * 변경된 보험기간PK를 가입상품사항 화면 DS(DS_NTPRD_MTT)에 입력
	function setPdtTrminsPk2(nRow,nPrdcd,nTrminsDis)
	{
		// 상품정보 받아온 데이터셋(ds_NtprdMtt)을 조회하여 해당 상품의 보험기간의 PK값을 조회하여
		// 상품정보화면(DS_NTPRD_MTT) 데이터셋의 PK값을 변경해 준다
		var objDS= gDS["ds_NtprdMtt"];
		var sPrdcd;
		var sTrminsDis;
		var sPdtTrminsPk;
		for(var i=0; i<objDS.length; i++)
		{
			sPrdcd       = objDS[i].PRDCD; // 상품코드
			sTrminsDis      = objDS[i].TRMINS_DISPLAY; // 보험기간
			sPdtTrminsPk = objDS[i].PDT_TRMINS_PK; // 보험기간PK

			// this.xfn_trace("sPrdcd:"+sPrdcd
			// +",nPrdcd:"+nPrdcd+",sTrminsDis:"+sTrminsDis+",nTrminsDis:"+nTrminsDis);
			if((sPrdcd == nPrdcd) && (sTrminsDis == nTrminsDis)) {
				gDS["DS_NTPRD_MTT"][nRow].PDT_TRMINS_PK = sPdtTrminsPk;
				gDS["ds_PdtTrmins_Pk"].push({});
				var aRow = gDS["ds_PdtTrmins_Pk"].length -1;
				gDS["ds_PdtTrmins_Pk"][aRow].PDT_TRMINS_PK = sPdtTrminsPk;
				break;
			}
		}
	};

	/**
	 * 납입기간을 조회
	 */
	function getPypd(callback, ojson) {
	    var nRow = $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(objTmp, index){if(objTmp.CTR_RLE_SECD == '21'){return index; } })[0];
	    var nRrn, nAge, nGndrSecd;
	    nGndrSecd = gDS["DS_CTR_INTP_MTT_LIST"][nRow].GNDR_SECD;
	    nRrn = gDS["DS_CTR_INTP_MTT_LIST"][nRow].RRN;
	    var opCode = "UDQ03";
	    var svcId = opCode;
	    var strArg = "";

	    if (gDS["ds_PdtTrmins_Pk"].length < 1) {
	        return;
	    }

	    var param = {};
	    param.STD_YMD 			= gVAL["stdYmd"];
	    param.PLAR_NUM 			= gVAL["plarNo"];
	    param.SAL_ORG_CS_NUM 	= gVAL["plarBrofc"];
	    param.ASRD_CTR_RLE_SECD = "21";
	    param.RES_REG_NO 		= nRrn;
	    param.GNDR_APPT_COD 	= nGndrSecd;
	    param.INDV_GRP_SECD 	= "1";
	    param.sTmpPlarYn 		= D.global.getUserInfo().CSRLESECD == "8"? "1": "0";

	    var remote = convertUtil.getRemoteObj('FG_CmpuUd_NtprdMtt', 'UDQ03');	
	    convertUtil.setRowArray(remote, 'ds_PdtTrmins_Pk', gDS["ds_PdtTrmins_Pk"]);
	    param.remote = remote;

		D.http.ajax("/sw/swAllPD", param)
		.then(function(result){
	    	if(result.errorMsg){ 
				alert(result.errorMsg); 
				return; 
			}
	    	/*
			 * 받아 온 값을 전역 변수에 세팅해 준다.
			 */ 
	    	var rtn_outDatsets 	=  result.remoteResult.outDataSet;
			gDS["DS_PYPD_TEMP"]	= 	stringUtil.isNull(rtn_outDatsets.ds_Pypd)?[]: rtn_outDatsets.ds_Pypd.data; 	
	    	setPypd("ds_Pypd");        	// 납입기간 설정
	    	setPycycCod("ds_Pycyc");    // 납입주기 설정

	    	if(callback){
	    		callback(rtn_outDatsets); // 가입조건 입력 팝업에서 쓰일 콜백 (DC-0189L.js)
	    	}

	    	if(ojson){
	        	if (gVAL["setDB"] == false && ojson.nSmasdCalfmCod != "B200") {
	                if (ojson.nPdtRlpcd == "1") {
	                	gDS["DS_CALC_NTPRD"] = [];
	                    excutePartPremCacl(callback);
	                } else {
	                    getPremCalc(ojson.nPrdcd);
	                }
	            }
	    	}
	    });
	};

	
	function getPremCalc(nPrdcd, callback) {
// dialog.alert("getPremCalc S::");
		gDS["DS_CALC_NTPRD"] = [];
	    setPartNtprd(nPrdcd);
	    excutePartPremCacl(callback);
	};

	function setPartNtprd(sPrdcd) {
// dialog.alert("setPartNtprd S::");
	    var cRow;
	    var nRow;
	    var mPrdcd;
	    var smasdAmt, smasdUnt, premAmt, premUnt;

	    for (var i = 0; i < gDS["DS_NTPRD_MTT"].length; i++) {
	        if ("1" == gDS["DS_NTPRD_MTT"][i].CHK) {
	            if (gDS["DS_NTPRD_MTT"][i].PDT_RLPCD == "1" || gDS["DS_NTPRD_MTT"][i].PDT_RLPCD == "2" || gDS["DS_NTPRD_MTT"][i].PDT_RLPCD == "4") {
	                setDsCalcNtprd(i);
	            }
	        }
	    }

	    var nRow_DS_NTPRD_MTT = $.map(gDS["DS_NTPRD_MTT"], function(obj, index){ if(obj.PRDCD == sPrdcd){ return  index; } })[0];
	    setDsCalcNtprd(nRow_DS_NTPRD_MTT);
	};

	/**
	 * 보험료계산 ds SET
	 */
	function setDsCalcNtprd(argRow) {
// dialog.alert("setDsCalcNtprd S::");
	    var nRow = -1;
	    var smasdAmt, smasdUnt, premAmt, premUnt;
	    
	    if(argRow > -1){
	    	 var sPrdcd = gDS["DS_NTPRD_MTT"][argRow].PRDCD;
	    	 var nRow_DS_CALC_NTPRD =  $.map(gDS["DS_CALC_NTPRD"], function(obj, index){if(obj.PRDCD ==sPrdcd){return index ;}})[0];
	    	 if(!stringUtil.isNull(nRow_DS_CALC_NTPRD)){
	    		 return false;
	    	 }
	    }

	    gDS["DS_CALC_NTPRD"] 	= [];
	    for(var i=0; i< gDS["DS_NTPRD_MTT"].length; i++){ 
	    	
	    	// 특정특약만 계산시 해당 특약이 아니면 세팅안하도록
	    	if(argRow > -1 && i!= argRow){
	    		continue;
	    	}
	    	
	    	if(gDS["DS_NTPRD_MTT"][i].CHK == "1"){
	    	
	 	        smasdAmt = gDS["DS_NTPRD_MTT"][i].SMASD;
	 	        smasdUnt = gDS["DS_NTPRD_MTT"][i].SMASD_INP_AMT_UNT_COD;
	 	        premAmt = gDS["DS_NTPRD_MTT"][i].PREM;
	 	        premUnt = gDS["DS_NTPRD_MTT"][i].PREM_INP_AMT_UNT_COD;
	
	 	        gDS["DS_CALC_NTPRD"].push({});
	 	        nRow = gDS["DS_CALC_NTPRD"].length-1;
	 	        gDS["DS_CALC_NTPRD"][nRow].PRDCD 		= gDS["DS_NTPRD_MTT"][i].PRDCD;
	 	        gDS["DS_CALC_NTPRD"][nRow].GDS_SECD 	= gDS["DS_NTPRD_MTT"][i].PDT_RLPCD;
	 	        gDS["DS_CALC_NTPRD"][nRow].TRMINS_SCTN 	= gDS["DS_NTPRD_MTT"][i].TRMINS_UNT_COD;
	 	        gDS["DS_CALC_NTPRD"][nRow].TRMINS 		= gDS["DS_NTPRD_MTT"][i].TRMINS;
	 	        gDS["DS_CALC_NTPRD"][nRow].PYPD_SCTN 	= gDS["DS_NTPRD_MTT"][i].PYPD_UNT_COD;
	 	        gDS["DS_CALC_NTPRD"][nRow].PYPD 		= gDS["DS_NTPRD_MTT"][i].PYPD;
	 	        gDS["DS_CALC_NTPRD"][nRow].PYCYC 		= gDS["DS_NTPRD_MTT"][i].PYCYC_COD;
	 	        gDS["DS_CALC_NTPRD"][nRow].SMSU 		= stringUtil.isNull(smasdAmt) ? "0" : String(cc_amtMulUnt(smasdAmt, smasdUnt));
	 	        gDS["DS_CALC_NTPRD"][nRow].CFINSU_PREM 	= stringUtil.isNull(premAmt)? "0": String(cc_amtMulUnt(premAmt, premUnt));
	 	        gDS["DS_CALC_NTPRD"][nRow].RENEW_PR_YMD = "";
	 	        gDS["DS_CALC_NTPRD"][nRow].YEAR_INS 	= "";
	 	        gDS["DS_CALC_NTPRD"][nRow].YEAR_PYPD 	= "";
	 	        gDS["DS_CALC_NTPRD"][nRow].MATYMD 		= "";
	 	        gDS["DS_CALC_NTPRD"][nRow].LSTPYM_YMD 	= "";
	 	        gDS["DS_CALC_NTPRD"][nRow].LST_ORD 		= "";
	 	        gDS["DS_CALC_NTPRD"][nRow].LTYM 		= "";
	 	        gDS["DS_CALC_NTPRD"][nRow].CRNC_KND 	= gDS["ds_NtprdMtt"][0].CRNC_KND;
	    	}
	    }
	};

	function cc_amtMulUnt(a_amt, a_unt) {
	    var unt_amt;
	    if (stringUtil.isNull(a_amt)) {
	        return 0;
	    }
	    switch (a_unt) {
	    case "1":
	        unt_amt = 10;
	        break;
	    case "2":
	        unt_amt = 100;
	        break;
	    case "3":
	        unt_amt = 1000;
	        break;
	    case "4":
	        unt_amt = 10000;
	        break;
	    case "5":
	        unt_amt = 100000;
	        break;
	    case "6":
	        unt_amt = 1000000;
	        break;
	    default:
	        unt_amt = 1;
	        break;
	    }
	    return parseInt(a_amt) * parseInt(unt_amt);
	};

	
	function excutePartPremCacl(_callback) {
// dialog.alert("excutePartPremCacl S::");
	    
	    var dsNam;
	    var indvGrp = "1";
	    var dsId;

	    dsId = "DS_CTR_INTP_MTT_LIST";

	    if (!validatePartIntpIntp(dsId)) {
	        gDS["DS_CALC_NTPRD"] = [];
	        return false;
	    }
	    if (!validatePartNtPrdMtt()) {
	    	gDS["DS_CALC_NTPRD"] = [];
	        return false;
	    }

	    if (gDS["DS_NTPRD_MTT"].length < 1) {
	    	gDS["DS_CALC_NTPRD"] = [];
	        return false;
	    }

	    setPartIntpIntp(dsId);


	    if (gDS["DS_CALC_NTPRD"].length < 1) {
	        setUdNtprd("DS_CALC_NTPRD");
	    }
	    
	    var obj_userInfo = 	 D.global.getUserInfo();
		var param = {};
		param.STD_YMD 					= $.map(gDS["DS_CMB_CTYMD"], function(obj, index){if(obj.TO_DAY == "1"){return obj.COD; } })[0];
		param.SAL_ORG_CS_NUM 			= obj_userInfo.brofccod;
		param.PLAR_NUM 					= obj_userInfo.empno;
		param.INDV_GRP_SECD 			= "1"
		param.MAI_PRDCD_PREM_MOD_YN 	= gVAL["maiPrdcdPremModYn"];
		param.sMaiPremModYn 			= gVAL["maiPrdcdPremModYn"];
		param.sTmpPlarYn 				= obj_userInfo.CSRLESECD == "8"? "1": "0";

		var str_DS_CALC_INCT_INTP  = "";
		str_DS_CALC_INCT_INTP+="INCT_INTPSCTN=INCT_INTPSCTN";
		str_DS_CALC_INCT_INTP+=",RES_REG_NO=RES_REG_NO";
		str_DS_CALC_INCT_INTP+=",CS_NAM=CS_NAM";
		str_DS_CALC_INCT_INTP+=",CSID=CSID";
		str_DS_CALC_INCT_INTP+=",XCLCLV_YN=XCLCLV_YN";
		str_DS_CALC_INCT_INTP+=",MAIPSN_RLP=MAIPSN_RLP";
		str_DS_CALC_INCT_INTP+=",AGE=AGE";
		str_DS_CALC_INCT_INTP+=",FUL_AGE=FUL_AGE";
		str_DS_CALC_INCT_INTP+=",GENDER=GENDER";
		str_DS_CALC_INCT_INTP+=",DTH_BNFC_RTO=DTH_BNFC_RTO";
		str_DS_CALC_INCT_INTP+=",HMBD_OBS_COD=HMBD_OBS_COD";
		str_DS_CALC_INCT_INTP+=",OCPT_KND=OCPT_KND";
		str_DS_CALC_INCT_INTP+=",DRVG_SECD=DRVG_SECD";
		str_DS_CALC_INCT_INTP+=",PELGRD=PELGRD";
		str_DS_CALC_INCT_INTP+=",RFU_CD=RFU_CD";
		str_DS_CALC_INCT_INTP+=",DIAG_CD=DIAG_CD";
		str_DS_CALC_INCT_INTP+=",HIS_INF=HIS_INF";

		for (var i = 0; i < gDS["DS_CALC_INCT_INTP"].length; i++) {
			dcUtil.copyArrayRow(gDS["DS_CALC_INCT_INTP"], i, gDS["DS_CALC_INCT_INTP"], i, { 'strColInfo' : str_DS_CALC_INCT_INTP});	
		}

		var str_DS_CALC_NTPRD  = "";
		str_DS_CALC_NTPRD += "PRDCD=PRDCD";
		str_DS_CALC_NTPRD += ",GDS_SECD=GDS_SECD";
		str_DS_CALC_NTPRD += ",TRMINS_SCTN=TRMINS_SCTN";
		str_DS_CALC_NTPRD += ",TRMINS=TRMINS";
		str_DS_CALC_NTPRD += ",PYPD_SCTN=PYPD_SCTN";
		str_DS_CALC_NTPRD += ",PYPD=PYPD";
		str_DS_CALC_NTPRD += ",PYCYC=PYCYC";
		str_DS_CALC_NTPRD += ",SMSU=SMSU";
		str_DS_CALC_NTPRD += ",CFINSU_PREM=CFINSU_PREM";
		str_DS_CALC_NTPRD += ",RENW_PR_YMD=RENW_PR_YMD";
		str_DS_CALC_NTPRD += ",YEAR_INS=YEAR_INS";
		str_DS_CALC_NTPRD += ",YEAR_PYPD=YEAR_PYPD";
		str_DS_CALC_NTPRD += ",MATYMD=MATYMD";
		str_DS_CALC_NTPRD += ",LSTPYM_YMD=LSTPYM_YMD";
		str_DS_CALC_NTPRD += ",LST_ORD=LST_ORD";
		str_DS_CALC_NTPRD += ",LTYM=LTYM";
		str_DS_CALC_NTPRD += ",YYFRS_CONV=YYFRS_CONV";
		str_DS_CALC_NTPRD += ",OYR_CONV=OYR_CONV";
		str_DS_CALC_NTPRD += ",MHYPRE=MHYPRE";
		str_DS_CALC_NTPRD += ",CONVPRM=CONVPRM";
		str_DS_CALC_NTPRD += ",COLCMS=COLCMS";
		str_DS_CALC_NTPRD += ",COLCMRT=COLCMRT";
		for (var i = 0; i < gDS["DS_CALC_NTPRD"].length; i++) {
			dcUtil.copyArrayRow(gDS["DS_CALC_NTPRD"], i, gDS["DS_CALC_NTPRD"], i, { 'strColInfo' : str_DS_CALC_NTPRD});	
		}

		var remote = convertUtil.getRemoteObj('PD_CmpuUd_PremCalc', 'CAL');
	    convertUtil.setRowArray(remote, 'dw_Inct_intp', gDS["DS_CALC_INCT_INTP"]);
	    convertUtil.setRowArray(remote, 'dw_Ntprd', gDS["DS_CALC_NTPRD"]);
	    param.remote 					= remote;

	    console.log("===========================================================swAllPD :: ", param);
	    
		D.http.ajax("/sw/swAllPD", param)
		.then(function(result) {	
			if(result.errorMsg){
				dialog.handLoading(false);
				dialog.alert(result.id + " :^: " + result.title);
				return; 
			}

			var rtn_outDatsets  =  result.remoteResult.outDataSet; 
			console.log("rtn_outDatsets>>>>>>>>>>>>>", rtn_outDatsets);
			gDS["DS_CALC_NTPRD"] = rtn_outDatsets.dw_Ntprd.data;
			setPremCalcRst("DS_CALC_NTPRD","","1");
			gVAL["maiPrdcdPremModYn"] = "0";

			if(!stringUtil.isNull(_callback)){
				_callback(rtn_outDatsets);
			}
		});
		return ; 
	};

	function setPremCalcRst(ds_id1, ds_id2, clearYn) {
	    var OBJ_DS1 = (ds_id1 instanceof Array) ? ds_id1 : gDS[ds_id1];
	    var nRow;
	    var smasdAmt, smasdUnt, premAmt, premUnt;
	    var sumPrem = 0;
	    for (var i = 0; i < OBJ_DS1.length; i++) {
	        nRow = gDS["DS_NTPRD_MTT"].findIndex(function(o){if(o.PRDCD == OBJ_DS1[i].PRDCD)return true;});
	        smasdAmt = OBJ_DS1[i].SMSU;
	        smasdUnt = gDS["DS_NTPRD_MTT"][nRow].SMASD_INP_AMT_UNT_COD;
	        premAmt = OBJ_DS1[i].CFINSU_PREM;
	        premUnt = gDS["DS_NTPRD_MTT"][nRow].PREM_INP_AMT_UNT_COD;
	        sumPrem += cc_amtDivUnt(premAmt, premUnt);
	        gDS["DS_NTPRD_MTT"][nRow].SMASD= String(cc_amtDivUnt(smasdAmt, smasdUnt));
	        gDS["DS_NTPRD_MTT"][nRow].PREM= String(cc_amtDivUnt(premAmt, premUnt));
	       	gDS["DS_NTPRD_MTT"][nRow].YYFRS_CONV= OBJ_DS1[i].CANP_CONV;
	        gDS["DS_NTPRD_MTT"][nRow].OYR_CONV= OBJ_DS1[i].OYR_CONV;
	        gDS["DS_NTPRD_MTT"][nRow].MHYPRE= OBJ_DS1[i].MHYPRE;
	        gDS["DS_NTPRD_MTT"][nRow].YY_STD_TRMINS= OBJ_DS1[i].YEAR_INS;
	        gDS["DS_NTPRD_MTT"][nRow].YY_STD_PYPD= OBJ_DS1[i].YEAR_PYPD;
	        gDS["DS_NTPRD_MTT"][nRow].CONVPRM= OBJ_DS1[i].CONVPRM;
	    }


	    if ((OBJ_DS1[0].PRDCD).substring(0,2) == "G1") {
	    	gVAL["PdtPremInput"] = sumPrem;
	    	gVAL["antyTrimnsInput"] = gDS["DS_NTPRD_MTT"][0].TRMINS;
	    }
	    if (!stringUtil.isNull(ds_id2)) {
	        var OBJ_DS2 = (ds_id2 instanceof Array) ? ds_id2 : gDS[ds_id2];
	        for (var i = 0; i < OBJ_DS2.length; i++) {
	            nRow = gDS["DS_NTPRD_MTT"].findIndex(function(o){if(o.PRDCD ==OBJ_DS2[i].PRDCD)return true;});
	            gDS["DS_NTPRD_MTT"][nRow].PCAYMD_AFT_GSPRE= OBJ_DS2[i].CFINSU_PREM;
	        }
	    }
	    if (clearYn == "1") {
	        OBJ_DS1 = [];
	    }
	    gVAL["maiPrdcdPremModYn"] = "0";
	    calPrem();
	};

	function calPrem()
	{
		gDS["DS_DC_PREM"] = [];
		gDS["DS_DC_PREM"].push({});	
		// var sumPrem =
		// stringUtil.nvl(this.p_MainObj.divPdtLst.Div2.editSumPremGrp.value,
		// "0");
		var sumPrem 	= "0";
		var dcAmt     = $.map(gDS["DS_UD_DC_KNCD_INF"], function(objTmp, index){if(objTmp.DC_KNCD == "3"){return objTmp.DC_AMT; } })[0];
		var dcAmt2    = $.map(gDS["DS_UD_DC_KNCD_INF"], function(objTmp, index){if(objTmp.DC_KNCD == "15"){return objTmp.DC_AMT; } })[0]; // 다자녀할인
		var realPyprm = parseFloat(sumPrem) - parseFloat(dcAmt) - parseFloat(dcAmt2);
		var sumDcAmt  = parseFloat(dcAmt)+parseFloat(dcAmt2);
		gDS["DS_DC_PREM"][0].DC_PREM = sumDcAmt;
		gDS["DS_DC_PREM"][0].DC_AFTER_PREM = realPyprm;
	};

	function validatePartIntpIntp(ds_id) {
		var OBJ_DS = gDS[ds_id];
	    var nCtrRleSecd;

	    for (var i = 0; i < OBJ_DS.length; i++) {
	        nCtrRleSecd = OBJ_DS[i].CTR_RLE_SECD;
	        if (parseInt(nCtrRleSecd) >= 31 && parseInt(nCtrRleSecd) <= 34) {
	            if (stringUtil.isNull(OBJ_DS[i].RRN)) {
	                return false;
	            } else if (stringUtil.isNull(OBJ_DS[i].PRCMPAG)) {
	                return false;
	            } else if (stringUtil.isNull(OBJ_DS[i].GNDR_SECD)) {
	                return false;
	            }
	        }
	    }
	    return true;
	};

	function validatePartNtPrdMtt() {
// dialog.alert("validatePartNtPrdMtt S::");
	    for (var i = 0; i < gDS["DS_CALC_NTPRD"].length; i++) {
	        if (stringUtil.isNull(gDS["DS_CALC_NTPRD"][i].TRMINS)) {
	            return false;
	        }
	        ;if (stringUtil.isNull(gDS["DS_CALC_NTPRD"][i].TRMINS_SCTN)) {
	            return false;
	        }
	        ;if (stringUtil.isNull(gDS["DS_CALC_NTPRD"][i].PYPD)) {
	            return false;
	        }
	        ;if (stringUtil.isNull(gDS["DS_CALC_NTPRD"][i].PYPD_SCTN)) {
	            return false;
	        }
	        ;if (stringUtil.isNull(gDS["DS_CALC_NTPRD"][i].PYCYC)) {
	            return false;
	        }
	        ;
	    }
	    return true;
	};

	function setPartIntpIntp(ds_id) {
	    var OBJ_DS = (ds_id instanceof Object) ? ds_id : gDS[ds_id];
	    var nRow;
	    gDS["DS_CALC_INCT_INTP"] = [];
	    for (var i = 0; i < OBJ_DS.length; i++) {
	        gDS["DS_CALC_INCT_INTP"].push({});
			nRow = gDS["DS_CALC_INCT_INTP"].length -1;
	        gDS["DS_CALC_INCT_INTP"][nRow].INCT_INTPSCTN 	= OBJ_DS[i].CTR_RLE_SECD;
	        gDS["DS_CALC_INCT_INTP"][nRow].GENDER 			= OBJ_DS[i].GNDR_SECD;
	        gDS["DS_CALC_INCT_INTP"][nRow].AGE 				= OBJ_DS[i].PRCMPAG;
	        gDS["DS_CALC_INCT_INTP"][nRow].RES_REG_NO 		= OBJ_DS[i].RRN;
	    }
	};

	function setUdNtprd(ds_id) {
	    var DS_OBJ;
	    if (stringUtil.isNull(ds_id)) {
	        DS_OBJ = gDS["DS_UD_NTPRD"];
	    } else {
	       	DS_OBJ = gDS[ds_id];
	    }

	    DS_OBJ = [];
	    
	    gDS["ds_id"];
	    var nPrem, nSmasd, nSmasdUnt, nPremUnt;
	    for (var i = 0; i < gDS["DS_NTPRD_MTT"].length; i++) {
	        if (gDS["DS_NTPRD_MTT"][i].CHK == "1") {
	            nSmasd = gDS["DS_NTPRD_MTT"][i].SMASD;
	            nSmasdUnt = gDS["DS_NTPRD_MTT"][i].SMASD_INP_AMT_UNT_COD;
	            nPrem = gDS["DS_NTPRD_MTT"][i].PREM;
	            nPremUnt = gDS["DS_NTPRD_MTT"][i].PREM_INP_AMT_UNT_COD;

	            DS_OBJ.push({});

	            var nRow =  DS_OBJ.length -1;
	            DS_OBJ[nRow].PRDCD= gDS["DS_NTPRD_MTT"][i].PRDCD;
	            DS_OBJ[nRow].GDS_SECD= gDS["DS_NTPRD_MTT"][i].PDT_RLPCD;
	            DS_OBJ[nRow].ORG_PRDNM= gDS["DS_NTPRD_MTT"][i].ORG_PRDNM;
	            DS_OBJ[nRow].TRMINS_SCTN= gDS["DS_NTPRD_MTT"][i].TRMINS_UNT_COD;
	            DS_OBJ[nRow].TRMINS= gDS["DS_NTPRD_MTT"][i].TRMINS;
	            DS_OBJ[nRow].PYPD_SCTN= gDS["DS_NTPRD_MTT"][i].PYPD_UNT_COD;
	            DS_OBJ[nRow].PYPD= gDS["DS_NTPRD_MTT"][i].PYPD;
	            DS_OBJ[nRow].PYCYC= gDS["DS_NTPRD_MTT"][i].PYCYC_COD;
	            DS_OBJ[nRow].CRNC_KND= gDS["DS_CALC_NTPRD"][0].CRNC_KND;
	            DS_OBJ[nRow].SMSU = stringUtil.isNull(nSmasd)? "0": String(cc_amtMulUnt(nSmasd, nSmasdUnt));
	            DS_OBJ[nRow].CFINSU_PREM = stringUtil.isNull(nPrem)? "0": String(cc_amtMulUnt(nPrem, nPremUnt));
	            DS_OBJ[nRow].RENEW_PR_YMD= "";
	            DS_OBJ[nRow].YEAR_INS= "";
	            DS_OBJ[nRow].YEAR_PYPD= "";
	            DS_OBJ[nRow].MATYMD= "";
	            DS_OBJ[nRow].LSTPYM_YMD= "";
	            DS_OBJ[nRow].LST_ORD= "";
	            DS_OBJ[nRow].LTYM= "";
	            DS_OBJ[nRow].ANTY_SWT_APPL_YN= (gDS["DS_NTPRD_MTT"][i].ANTY_SWT_APPL_YN == "0")? "": gDS["DS_NTPRD_MTT"][i].ANTY_SWT_APPL_YN;
	            DS_OBJ[nRow].MW_AD_PDT_YN= "0";
	            DS_OBJ[nRow].PDT_INQ_SEQNO= "0";
	            
	            
	        }
	    }

	    if ((DS_OBJ[0].PRDCD).substring(0, 2) =="G1") {
	        var inpuPrem = parseInt(stringUtil.nvl(gVAL["PdtPremInput"], "0"));
	    }

	    if (stringUtil.isNull(ds_id)) {
	        gDS["DS_UD_NTPRD"] = DS_OBJ ;
	    } else {
	       	gDS[ds_id] = DS_OBJ;
	    }

	    return true;
	};

	// *--------------------------------------------------------------------------
	// * 실손보험 청약시 의료급여 수급권자 청약 입력사항 반영_2017.07.31
	// *--------------------------------------------------------------------------
	function setPlosSadr(check)
	{	
		var plosSadrYn = "";
			// 개인정보동의 탭이 열려있을 경우
			if(check == "1"){			
				$("[name=rdoPlosSadr]").show();
				$("#li_rdoPlosSadr").show();		
				if(gVAL.loadMode == "D" || gVAL.loadMode == "S"){
					plosSadrYn = stringUtil.nvl(gDS["DS_SUS_CTR_BAS"][0].PLOS_SADR_YN,"");				
					$("[name=rdoPlosSadr]").prop('checked',false);
					$("[name=rdoPlosSadr][value="  + plosSadrYn + "]").prop('checked', true);
				}								
			}else{				
				$("[name=rdoPlosSadr]").hide();
				$("#li_rdoPlosSadr").hide();
				$("[name=rdoPlosSadr]").prop('checked',false);
			}		
	};

	/*
	 * [증권수령, 약관수령] 둘중에 하나라도 이메일을 선택했을 때는 이메일 란을 보여준다.
	 * 
	 * 2019.11.21 약관 이메일 수령 선택 삭제 모바일 선택시 이메일이 등록되어있을 경우 모바일 이메일 둘다 전송
	 */ 
	function emailChange(){
		var selected_cmbInspoRvpl 			=	 $("[name=cmbInspoRvpl]:checked").val();
		
		if($("#div_email_show").text()==""){   // 주소가 등록되어있지 않을 때
			$("#email_main").addClass('none');

			if(selected_cmbInspoRvpl == "1"){
				$("#div_email_hide").removeClass('none');
			} else {
				$("#div_email_hide").addClass('none');
			}
		}else{
			$("#email_main").removeClass('none');
			$("#div_email_hide").addClass('none');
		}
	};
	
	
	/*
	 * DB에 있는 KYC 값을 세팅한다.
	 */
	function fn_setKycInfoFromDB(obj_param){
		console.log("obj_param>>", obj_param);
		
		if(stringUtil.isNull(obj_param)){
			return ; 
		}	

		/*
		 * KYC INFO
		 */
		if(!stringUtil.isNull(obj_param.kycinfo)){
			var selected_info =  obj_param.kycinfo;
			$("#INSU_JOB_CD").val(selected_info.INSU_JOB_CD); 				// 직업(업종)
			$("#INSU_JOB_CD").trigger('change');
			if(selected_info.INSU_JOB_CD == "26"){ 							// 급여
																			// 소득자
																			// 이면
				$("#OFC_NM").val(selected_info.OFC_NM); 					// 직장(회사)명
				$("#OFC_ORG_NM").val(selected_info.OFC_ORG_NM); 			// 부서명
				$("#POSTN_NM").val(selected_info.POSTN_NM); 				// 직위
			}
			
			$("#CNTRY_CD").val(selected_info.CNTRY_CD); 					// 국적
// $("#PASSPT_NO").val(selected_info.PASSPT_NO); //여권번호 - 삭제
			$("#RLNM_CHK_MTHOD_CD").val(selected_info.RLNM_CHK_MTHOD_CD); 	// 신원확인
			$("#RLNM_CHK_MTHOD_CD").trigger('change');
			
			if(selected_info.RLNM_CHK_MTHOD_CD == "02"){
				$("#RNNO_ISSUE_DT_").val(selected_info.RNNO_ISSUE_DT); 		// 면허번호
				$("#RNNO_ISSUE_DT_").trigger('focusout');	
			}else{
				$("#mskPblsYmd").val(selected_info.RNNO_ISSUE_DT); 			// 발급일자
				$("#mskPblsYmd").trigger('focusout');	
			}
			if(selected_info.RLNM_CHK_MTHOD_CD == "05"){
				$("#serialNumber").val(selected_info.serialNumber); 		// 일련번호
				$("#serialNumber").trigger('focusout');	
			}


			// 실제소유자
			if(stringUtil.isNull(gData.RL_OWNR_YN)) {
				$("[name=RL_OWNR_YN][value=" + selected_info.RL_OWNR_YN + "]").prop("checked", true);
				$("[name=RL_OWNR_YN][value=" + selected_info.RL_OWNR_YN + "]").trigger('change');

				if(selected_info.RL_OWNR_YN == "N" ){
					$("#RL_OWNR_HANGL_NM").val(selected_info.RL_OWNR_HANGL_NM); 	// 실제소유자
																					// > 성명

					// 실제소유자 > 생년월일
					$("#RL_OWNR_BRTHYMD").val(selected_info.RL_OWNR_BRTHYMD);  		
					$("#RL_OWNR_BRTHYMD").trigger('focusout');

					$("#RL_OWNR_CNTRY_CD").val(selected_info.RL_OWNR_CNTRY_CD);	// 실제소유자
																				// > 국적
				}
			}

			// 거래자금 원천 및 출처
			$("[name=TXFNOG_CD][value=" + selected_info.TXFNOG_CD + "]").prop("checked", true);
			$("[name=TXFNOG_CD][value=" + selected_info.TXFNOG_CD + "]").trigger('change');

			// 기타
			if(selected_info.TXFNOG_CD == "99" && selected_info.TXFNOG_ETC_NM){
				$("#TXFNOG_ETC_NM").val(selected_info.TXFNOG_ETC_NM);
			}
			
			// 거래목적(신계약)
			$("[name=NWCT_TXPR_CD][value=" + selected_info.NWCT_TXPR_CD + "]").prop("checked", true);
			$("[name=NWCT_TXPR_CD][value=" + selected_info.NWCT_TXPR_CD + "]").trigger('change');

			// 기타
			if(selected_info.NWCT_TXPR_CD == "99" && selected_info.NWCT_TXPR_ETC_NM){ 
				$("#NWCT_TXPR_ETC_NM").val(selected_info.NWCT_TXPR_ETC_NM);
			}
		}

		/*
		 * 미성년자
		 */
		if(!stringUtil.isNull(obj_param.kycinfo_child)){
			var selected_info =  obj_param.kycinfo_child;
			$("[name=RNNO_GBN_CD_CHILD][value=" + selected_info.RNNO_GBN_CD + "]").prop('checked', true); // 미성년자
																											// 실명번호
																											// 구분

			$("[name=RNNO_GBN_CD_CHILD]").next().show();
			$("[name=RNNO_GBN_CD_CHILD]:not(:checked)").next().hide();
			
			$("#CNTRY_CD_CHILD").val(selected_info.CNTRY_CD); // 국적
			
			// 실제소유자
			$("[name=RL_OWNR_YN_CHILD][value=" + selected_info.RL_OWNR_YN + "]").prop("checked", true);

			if(selected_info.RL_OWNR_YN == "N" ){
				$("#RL_OWNR_HANGL_NM_CHILD").val(selected_info.RL_OWNR_HANGL_NM); 	// 실제소유자
																					// > 성명

				// 실제소유자 > 생년월일
				$("#RL_OWNR_BRTHYMD_CHILD").val(selected_info.RL_OWNR_BRTHYMD);  		
				$("#RL_OWNR_BRTHYMD_CHILD").trigger('focusout');

				$("#RL_OWNR_CNTRY_CD_CHILD").val(selected_info.RL_OWNR_CNTRY_CD);	// 실제소유자
																					// > 국적
				
				$("[name=RL_OWNR_YN]").prop('disabled', false);
				$("#RL_OWNR_HANGL_NM").prop('disabled', false);
				$("#RL_OWNR_BRTHYMD").prop('disabled', false);
				$("#RL_OWNR_CNTRY_CD").prop('disabled', false);
				
				$("[name=li_RL_OWNR_YN_CHILD]").show();
			}else{
				$("[name=RL_OWNR_YN_CHILD][value=" + selected_info.RL_OWNR_YN + "]").trigger('change');

			}

			// 거래자금 원천 및 출처
			$("[name=TXFNOG_CD_CHILD][value=" + selected_info.TXFNOG_CD + "]").prop("checked", true);
			$("[name=TXFNOG_CD_CHILD][value=" + selected_info.TXFNOG_CD + "]").trigger('change');

			// 기타
			if(selected_info.TXFNOG_CD == "99" && selected_info.TXFNOG_ETC_NM){
				$("#TXFNOG_ETC_NM_CHILD").val(selected_info.TXFNOG_ETC_NM);
			}
			
			// 거래목적(신계약)
			$("[name=NWCT_TXPR_CD_CHILD][value=" + selected_info.NWCT_TXPR_CD + "]").prop("checked", true);
			$("[name=NWCT_TXPR_CD_CHILD][value=" + selected_info.NWCT_TXPR_CD + "]").trigger('change');

			// 기타
			if(selected_info.NWCT_TXPR_CD == "99" && selected_info.NWCT_TXPR_ETC_NM){ 
				$("#NWCT_TXPR_ETC_NM_CHILD").val(selected_info.NWCT_TXPR_ETC_NM);
			}
		}
	};

	/**
	 * 계약상세
	 */
	function setView_NtMttInfo(){
		var $list_ntprdMtt  = $("#list_ntprdMtt");
		var $list_ntprdMttH;
		var $li;
		var $li_div;
		var $li_div_div1;
		var $li_div_div1_span;
		var $li_div_div1_strong;
		var $li_div_div2;
		var $li_div_div2_div1;
		var $li_div_div2_div1_span1;
		var $li_div_div2_div1_span2;
		var $li_div_div2_div1_span2_span;
		var $li_div_div2_div2;
		var $li_div_div2_div2_div1;
		var $li_div_div2_div2_div1_span1;
		var $li_div_div2_div2_div1_span2;
		var $li_div_div2_div2_div1_span3;
		var $li_div_div2_div2_div2;
		var $li_div_div2_div2_div2_span1;
		var $li_div_div2_div2_div2_span2;
		
		var unitTxt = "원";
		
		// 가입설계
		if(!stringUtil.isNull(gVAL.qttNo)){
			if(gDS['ds_NtprdMtt'][0].CRNC_KND == '1'){ // 달러보험
				unitTxt = "USD";
			}
		} else { // 청약
			if(gDS['ds_NtprdMtt'][0].CRNC_KND =='1'){
				unitTxt = "USD";
			}
		}
		
		$list_ntprdMtt.html("");
		$list_ntprdMttH = $("<h3/>").attr({class:'h3-tit-st01'}).html("계약상세").appendTo($list_ntprdMtt);
		$list_ntprdMtt = $("<ul/>").attr({class:'insure-list-st02'}).appendTo($list_ntprdMtt); 

		$.each(gDS["DS_NTPRD_MTT"], function(index, obj){
			if(obj.CHK != 1){
				return ;
			}
			$li = $("<li/>").appendTo($list_ntprdMtt);
			
			// 당당한인생종신보험 추가납입 특약 무배당 화면 띄우기X
			if(obj.PDT_RLPCD == "2" && (gDS["DS_NTPRD_MTT"][0].PRDCD.substring(0,2) == "H7" || gDS["DS_NTPRD_MTT"][0].PRDCD.substring(0,2) == "H8" || 
					gDS["DS_NTPRD_MTT"][0].PRDCD.substring(0,2) == "HJ" || gDS["DS_NTPRD_MTT"][0].PRDCD.substring(0,2) == "HK" || 
					gDS["DS_NTPRD_MTT"][0].PRDCD.substring(0,2) == "HM" || gDS["DS_NTPRD_MTT"][0].PRDCD.substring(0,2) == "HP" ||
					gDS["DS_NTPRD_MTT"][0].PRDCD.substring(0,2) == "HV" || gDS["DS_NTPRD_MTT"][0].PRDCD.substring(0,2) == "HU")){
				var li_class = "item " + obj.PRDCD + " none"; 
			}else{
				var li_class = "item " + obj.PRDCD; 
			}
			
			$li_div = $("<div/>").attr({class:li_class}).appendTo($li);
			$li_div_div1 = $("<div/>").attr({class:'in-top'}).appendTo($li_div);
// var val_class = (index ==0 ? 'flag-c flag-b-st02' : 'flag-c flag-b-st03');
			var val_text = (index ==0 ? '주': '특약');
			var val_class = "bulet0" + obj.PDT_RLPCD;
			$li_div_div1_span = $("<span/>").attr({class:val_class}).html("").appendTo($li_div_div1);
// $li_div_div1_span =
// $("<span/>").attr({class:val_class}).html(val_text).appendTo($li_div_div1);
			$li_div_div1_strong = $("<strong/>").attr({class:'in-name'}).html(obj.PRDNM).appendTo($li_div_div1);

			$li_div_div2 = $("<div/>").attr({class:'in-info'}).appendTo($li_div);
			$li_div_div2_div1 = $("<div/>").attr({class:'info'}).appendTo($li_div_div2);

			$li_div_div2_div1_span1 = $("<span/>").attr({class:"stit"}).html("보험료").appendTo($li_div_div2_div1);
			
			// 보험료 [bind:PREM]
			var val_PREM = dcUtil.addCommas(String(obj.PREM)); // 금액단위에 콤마를
																// 붙인다.
			$li_div_div2_div1_span2 = $("<span/>").attr({class:"val"}).html(val_PREM + unitTxt).appendTo($li_div_div2_div1);
			
			// 상령일 후 보험료 [bind:PCAYMD_AFT_GSPRE]
			if(!stringUtil.isNull(gVAL.qttNo)){
				var val_PCAYMD_AFT_GSPRE = dcUtil.addCommas(String(obj.PCAYMD_AFT_GSPRE)); // 금액단위에 콤마를 붙인다.
				$li_div_div2_div1_span2_span = $("<span/>").html("(상령일 후 : " + val_PCAYMD_AFT_GSPRE + unitTxt + ")").appendTo($li_div_div2_div1_span2);
			}
			
			$li_div_div2_div2 = $("<div/>").attr({class:'detail'}).appendTo($li_div_div2);
			
			// 가입금액 [bind:SMASD] + (단위) bind:SMASD_INP_AMT_UNT_COD combo:
			// DS_NTPRD_SMASD
			var unitNM =  $.map(gDS["DS_NTPRD_SMASD"], function(objTmp){if(objTmp.COD ==obj.SMASD_INP_AMT_UNT_COD){return objTmp.COD_NAM;}})[0].replace(/단위/g, "");
			$li_div_div2_div2_div1 = $("<div/>").appendTo($li_div_div2_div2);
			var val_SMASD = dcUtil.addCommas(String(obj.SMASD));  // 금액단위에 콤마를붙인다

			// 연금상품 가입금액 삭제
			var pdtAtrbCod   = gDS['ds_ProdtTypeMtt'][0].PDT_ATRB_COD;
			var pdtAtrbDtlcd = gDS['ds_ProdtTypeMtt'][0].PDT_ATRB_DTLCD;
			
			if(pdtAtrbCod == "J" && pdtAtrbDtlcd == "2"){ 
				pdtAtrbCod = "G";
			}
			
			///마스터프로 입원특약 제어
			if(gVAL["HQExp"] && obj.PRDCD == '103822') {
				$li_div_div2_div2_div1_span1 = $("<span/>").html(val_SMASD + "" + unitNM).appendTo($li_div_div2_div2_div1);
			} else if(pdtAtrbCod == "G" || pdtAtrbCod == "H") {
				$li_div_div2_div2_div1_span1 = $("<span/>").html("").appendTo($li_div_div2_div2_div1);
			} else {
				$li_div_div2_div2_div1_span1 = $("<span/>").html(val_SMASD + "" + unitNM).appendTo($li_div_div2_div2_div1);
			}

			// 납입주기 [bind:PYCYC_COD] TRMINS_DISPLAY
			var val_PYCYC_NM = $.map(gDS["DS_NTPRD_PYCYC"], function(obj_map, index){if(obj_map.COD == obj.PYCYC_COD && obj_map.PRDCD == gVAL["maiPrdcd"]){return obj_map.COD_NAM; }})[0]; // 납입주기명
			$li_div_div2_div2_div1_span3 = $("<span/>").html(val_PYCYC_NM).appendTo($li_div_div2_div2_div1);

			$li_div_div2_div2_div2 = $("<div/>").appendTo($li_div_div2_div2);
			// 보험기간(보장기간) [bind:TRMINS_DISPLAY]
			$li_div_div2_div2_div2_span1 = $("<span/>").html(obj.TRMINS_DISPLAY).appendTo($li_div_div2_div2_div2);
			// 납입기간 [bind:PYPD_DISPLAY] PYPD_DISPLAY
			$li_div_div2_div2_div2_span2 = $("<span/>").html(obj.PYPD_DISPLAY).appendTo($li_div_div2_div2_div2);
			
		});
		
	}
	
	/**
	 * 스텝의 갯수를 동적으로 표기 1. 펀드관련 상품인 경우 '펀드정보' 메뉴를 추가하여 8스텝까지 표기 2. 펀드관련 상품이 아닌 경우
	 * '펀드정보' 메뉴를 제외한 7스텝까지 표기
	 */
	function viewStep() {
		console.log("n viewStep!");
		var stepLen = 8;
		var vNum = gViewNum;
		var $step  = $("#step");
		
		if ('J' != gDS['ds_ProdtTypeMtt'][0].PDT_ATRB_COD) {
			stepLen = 7;
			if (6 < vNum) {
				vNum--;
			}
		}
		
		for(var i = 1; i <= stepLen; i++) {
			if (i <= vNum) {
				$("<span/>").attr({class:'on'}).html(i).appendTo($step);
			} else {
				$("<span/>").html(i).appendTo($step);
			}
		}
		
		gMaxViewNum = stepLen;
	}
	
	/**
	 * 화면에 값을 셋팅한다. 1 : 계약정보 2 : 계약관계자 3 : 수령정보 4 : 개인정보 이용동의 5 : FATCA 6 : 펀드정보
	 * 7 : KYC 8 : 기타
	 */
	function setView(viewNum, _callback) {
		gViewNum = viewNum;
		viewStep();

		// * 청약종류 --------------------------------------------------------------
		var scbInfo;		// 조회된 청약계약기본 정보
		
		// * 상품명 --------------------------------------------------------------
		$('#divPrdcd').text(gDS['DS_MPRD_PDT'][0].PRDNM);
		var prdcd = gDS['DS_MPRD_PDT'][0].PRDCD;
		prdcd = prdcd.substring(0,2);
		// * 보험료사항 SET ---------------------------------

		// 가입설계
		if(!stringUtil.isNull(gVAL.qttNo)){
			if(gDS['ds_NtprdMtt'][0].CRNC_KND == '1'){ // 달러보험
				$("#mhypymStdprm").html(dcUtil.addCommas(maskUtil.round(gVAL.g_remObj.mhypymPrem,2) + "USD")); // 월납기준보험료
				$("#realPyprm").html(dcUtil.addCommas(maskUtil.round(gVAL.g_remObj.realPyprm,2) + "USD")); // 할인후보험료
																											// (실제납입금액)
			}else{
						
				if("FI" == prdcd){
					$("#mhypymStdprm").html("3,000원"); // 월납기준보험료
					$("#realPyprm").html("3,000원"); // 할인후보험료 (실제납입금액)
				}else{
					$("#mhypymStdprm").html(dcUtil.addCommas(gVAL.g_remObj.mhypymPrem + "원")); // 월납기준보험료
					$("#realPyprm").html(dcUtil.addCommas(gVAL.g_remObj.realPyprm + "원")); // 할인후보험료
																							// (실제납입금액)
				}
				
			}
		} else { // 청약
			console.log("set view>>", gDS);
			scbInfo = gDS['DS_SUS_CTR_BAS'][0];
			if(gDS['ds_NtprdMtt'][0].CRNC_KND =='1'){
				if (gVAL.mhypymStdprm > 0 || gVAL.realPyprm > 0) {
					$("#mhypymStdprm").html(dcUtil.addCommas(maskUtil.round(gVAL.mhypymStdprm,2)) + 'USD');	// 월납기준보험료
					$("#realPyprm").html(dcUtil.addCommas(maskUtil.round(gVAL.realPyprm,2)) + 'USD');			// 할인후보험료
																												// (실제납입금액)
				} else {
					$("#mhypymStdprm").html(dcUtil.addCommas(maskUtil.round(scbInfo.MHYPYM_STDPRM,2)) + 'USD');	// 월납기준보험료
					$("#realPyprm").html(dcUtil.addCommas(maskUtil.round(scbInfo.REAL_PYPRM,2)) + 'USD');			// 할인후보험료
																													// (실제납입금액)
				}
			}else{
				console.log("set view gVAL>>", gVAL);
				if (gVAL.mhypymStdprm != null && gVAL.mhypymStdprm > 0 && gVAL.realPyprm != null && gVAL.realPyprm > 0) {
					$("#mhypymStdprm").html(dcUtil.addCommas(gVAL.mhypymStdprm) + '원');	// 월납기준보험료
					$("#realPyprm").html(dcUtil.addCommas(gVAL.realPyprm) + '원');			// 할인후보험료
																							// (실제납입금액)
				} else {
					console.log("set view scbInfo>>", scbInfo);
					$("#mhypymStdprm").html(dcUtil.addCommas(scbInfo.MHYPYM_STDPRM) + '원');	// 월납기준보험료
					$("#realPyprm").html(dcUtil.addCommas(scbInfo.REAL_PYPRM) + '원');			// 할인후보험료
																								// (실제납입금액)
				}
			}
		}
		
		/**
		 * 임시 상품 Close 간편든든건강 FX 간편든든유니종신 GE 마음편한변액간편 GN 달러 GX
		 */
		
		if(D.global.getUserInfo('chncod') != "B0000005") {
			if(gDS.DS_MPRD_RPSPDT[0].PRDCD == "GK") {
				dialog.alert("해당 상품은 서비스 준비중입니다.").then(function () {
					D.move.back();	// 뒤로가기
				});
			}
		}

		switch (viewNum) {
			case 1 :
				// * 계약일자
				// --------------------------------------------------------------
				var arr_filetered_DS_CMB_CTYMD = gDS['ds_CTYMD'];
				var seleted_CTYMD = dateUtil.getDate();
				
				// 가입설계
				if(!stringUtil.isNull(gVAL.qttNo)){
					dcUtil.setCdSelect(null,  arr_filetered_DS_CMB_CTYMD, '#cmbCtymd');  // 계약일자
					
					$("#cmbCtymd").val(seleted_CTYMD);
					$("#cmbCtymd").trigger('change');
				} else { // 청약
					dcUtil.setCdSelect(null,  arr_filetered_DS_CMB_CTYMD, '#cmbCtymd'); 

					$("#cmbCtymd").val(seleted_CTYMD);
				}

				// 가입설계
				if(!stringUtil.isNull(gVAL.qttNo)){
				} else { // 청약
				    $("[name=sMblSusSecd][value=" + scbInfo.MBL_SUS_SECD  + "]").prop('checked', true);
				    $("[name=sMblSusSecd]").trigger('change');
				}
				// 장애인 조회(아코디언)
				checkInCdu();
				
				if(D.global.getUserInfo('chncod') != "B0000005") {
					$("#selfUw").addClass("none");
				}

				// self uw 설정
				if(gVAL.selfUw == "Y") {
// $("#selfUw").text("Self UW 완료");
				} else {
					$("#selfUw").text("Self UW");
					$("#selfUw").removeClass("btn-st01");
					$("#selfUw").addClass("btn-st24 ico-arr");
					
					var qttno = "";
					if(!stringUtil.isNull(gDS.DS_QTT_BAS)) {
						qttno = gDS.DS_QTT_BAS[0].QTTNO;;
					}

					// 청약이면
					if(stringUtil.isNull(qttno)){
						qttno = gDS.DS_SUS_CTR_BAS[0].QTTNO;
					}
					
					var pbData = $.grep(gDS['DS_CTR_INTP_MTT_LIST'],function(p){if('21' == p.CTR_RLE_SECD)return true;} )[0];
					var param = {
						CS_NAM		: pbData.CS_NAM,
						GNDR_SECD	: pbData.GNDR_SECD,
						PRCMPAG		: pbData.PRCMPAG,
						CS_PK		: pbData.CHN_CS_PK,
						RRN			: pbData.RRN,
						QTTNO		: qttno
					};
					
					console.log("pop param::",param);
					
					/*
					 * 계약일자 변경 param : 피보험자의 고객명/성별/나이/고객번호/주민번호/가입설계번호
					 */
					$("#selfUw").on('click', function(){
						D.move.next({
							url: "/www/html/view/uw/UW-1110E.html",
							param : param
						});
					});
				}
				
				if(_callback){
		    		_callback();
		    	}
				break;
			case 2 :
				// * 계약자관계자 주피와의관계(DS_CMB_CTRINTP_CSRLP) 콤보 옵션 생성
				// ---------------------------------------
				dcUtil.setCdSelect(null, gDS['DS_CMB_CTRINTP_CSRLP'], '.DS_CMB_CTRINTP_CSRLP');

				// 조회된 결과 DS_SUS_CTR_INTPD(보험계약관계자정보)의 정보를 가지고 고객명선택콤보를 생성하고
				// 계약관계자리스트를 데이터를 SET한다.
				var oSciDS = gDS['DS_SUS_CTR_INTP'];
				
				// * 계약관계사항 DS_CTR_INTP_MTT_LIST 데이터 SET
				// --------------------------------------------------------
				var data = null; 
				var estyYn = '';		// 필수입력여부
				var rleSecd = '';		// 계약관계코드
				var rlpSecd = '';		// 주피와의관계코드

				for (var i = 0; oSci = oSciDS[i]; i++) {
					rleSecd = oSci.CTR_RLE_SECD;
					rlpSecd = oSci.CS_RLP_SECD;
					
					estyYn = $.grep(gDS['ds_CtrIntpMtt'], function(p){if( p.ASRD_CTR_RLE_SECD == rleSecd)return true;})[0].ESTY_INP_YN;
					
					data = {
						CTR_RLE_SECD: 		 	rleSecd,
						CS_PK: 				 	oSci.CS_PK,
						CS_NAM: 				oSci.CS_NAM,
						RRN: 					oSci.RRN,
						PRCMPAG: 				String(dateUtil.getLinaAge(gVAL.stdYmd, oSci.RRN)),
						CS_RLP_SECD: 			rlpSecd,
						CPCD: 				 	oSci.CPCD,
						CPNM: 				 	oSci.CPNM,
						OCPT_PEL_GRDE_COD:     	oSci.OCPT_PEL_GRDE_COD,
						OCPT_INJ_PEL_GRDE_COD: 	oSci.OCPT_INJ_PEL_GRDE_COD,
						DRVG_SECD: 			 	oSci.DRVG_SECD,
						DRVG_SENM: 			 	oSci.DRVG_SENM,
						DRVG_PEL_GRDE_COD:	 	oSci.DRVG_PEL_GRDE_COD,
						DRVG_INJ_PEL_GRDE_COD: 	oSci.DRVG_INJ_PEL_GRDE_COD,
						GNDR_SECD: 			 	oSci.GNDR_SECD,
						XCLC_OCPT_YN: 		 	oSci.XCLC_OCPT_YN,
						NATAL_SECD: 			oSci.NATAL_SECD,
						NATAL_SENM: 			oSci.NATAL_SENM,
						STY_COD: 				oSci.STY_COD,
						STY_NAM: 				oSci.STY_NAM,
						PYMRT: 					oSci.DTHT_DFR_RTO,
						XCLCLV_PSPY_YN: 		oSci.XCLCLV_PSPY_YN,
						XCLCLV_APPL_YN: 		oSci.XCLCLV_APPL_YN,
						ESTY_INP_YN: 			estyYn,
						PBLS_YMD: 			 	oSci.PBLS_YMD,
						STY_PRID: 			 	oSci.STY_PRID
					};

					if ('14' == rlpSecd) {   // 주피와의관계가 법정상속인일경우 CS_PK를 1로
												// SET
						data.CS_PK = '1';
					}

					/* FIXME: 계약관계별 분기처리 */
					// 고객
					switch (rleSecd) {
						case '11': case '21': case '31':	// 계약자, 주피보험자, 종피보험자
							$('#txt_csPk_' + rleSecd).val(data.CS_NAM);
							if(rlpSecd == '1'){
								$('#txt_csPk_' + rleSecd).next().prop('disabled', true);
							}
							
							break;
						case '41': case '42': case '47':	// 만기, 장해, 사망수익자1
							data.PYMRT = '47' == rleSecd ? '100':'0';
							$('#sel_csPk_' + rleSecd).val(data.CS_PK);
							break;
					}
					// 주피와의관계
					$("#sel_csRlpSecd_" + rleSecd).val(rlpSecd);

					// 사망수익자 법정상속인 여부에 따른 UI변경
					if('47' == rleSecd) {	
						$('#sel_csRlpSecd_47').hide();
					}
				}

				// * 계약관계자사항 설정
				// --------------------------------------------------------------
				setCtrIntpMttForView(_callback);
				
				// * 지정대리청구인 가족고객리스트 세팅
				// --------------------------------------------------------------
				fnSetClmrInfo();
					 
				/**
				 * 주소,이메일 정보 -------------------------------------- 계약자 정보를 화면에
				 * 보여줌 정보 기간계를 디폴트 없으면 채널계 정보 보여줌
				 */
				// 계약자, 피보험자 주소사항 SET
				gDS['DS_ADDR_POHD'] = $.extend(true, [], gDS['DS_SUS_ADR_POHD']); 		// 계약자
				gDS['DS_ADDR_MAIPSN'] = $.extend(true, [], gDS['DS_SUS_ADR_MAIPSN']); 	// 피보험자
				
				break;
			case 3 :
				fnSetPatAddr(_callback); 		// 우편물,증권,약관 수령 설정
				emailChange();
				break;
			case 4 :
				fnSetIndInf(_callback);			// 개인정보동의
				break;
			case 5 :
				fnSetFatcaInfo(_callback);		// TODO: FATCA
				break;
			case 6 :
				fnSetVarMtt(_callback);			// 펀드
				break;
			case 7 :
				/*
				 * 핸드폰 주소 [CNTAD_SECD ] ::: 2: 주소 , 22: 휴대전화 ,23 이메일 ,25 자택주소
				 * ,26 직장주소 ,3 전화번호 ,35 자택전화 ,36 직장전화 ,4 팩스 ,99 전체
				 */
				var obj_info_hp =  gDS["DS_ADDR_POHD"].find( function(o){if(o.BZ_SECD == '2' && o.CNTAD_SECD == '22')return true;});
				
				if(!stringUtil.isNull(obj_info_hp)){
					// AML (일반전화번호)
					$("#PRSN_CNTC_REGON_NO").val(obj_info_hp.TEL_AR_NUM);
					$("#PRSN_CNTC_OFC_NO").val(obj_info_hp.TEL_GUK_NUM);
					$("#PRSN_CNTC_INDIVI_NO").val(obj_info_hp.TEL_SEQ);
				}
				
				// 거래자금실소유자정보 세팅
				var info = gDS['DS_ACTONR_INF'];
				if (!stringUtil.isNull(info)) {
					info = info[0];
					// 실제소유자 여부
					$('input[name= ][value='+info.ACTONR_YN+']').prop('checked', true);
				}
				
				console.log("test1");
				
				fn_loadingAML(function(){  	// KYC 초기화
					console.log("tets2");
					/*
					 * KYC 정보 세팅
					 */
					fn_checkKYCSaveInfo(function(result){ // 서비스콜
						if(result.errorMsg){
							dialog.alert(result.errorMsg);
							return; 
						}

						if(!stringUtil.isNull(result.kycinfo) || !stringUtil.isNull(result.kycinfo_child)){ // DB 에
																											// 저장된
																											// 값이
																											// 있으면
																											// DB 에
																											// 있는
																											// 정보를
																											// 화면에
																											// 세팅
							fn_setKycInfoFromDB(result);
						}
					});
				}); 
				
				if(_callback){
		    		_callback();
		    	}
				
				
				break;
			case 8 :
				fnSetHealthMtt(); // 헬스케어
				setDspsData(); // 장애인 데이터 화면 세팅
				// 가입설계인 경우에는 실손보험 청약시 의료급여 수급권자 청약 입력사항 사용안함. 2017.08.07
				fnct_getPlosSadrYn();

				/*
				 * 핸드폰 주소 [CNTAD_SECD ] ::: 2: 주소 , 22: 휴대전화 ,23 이메일 ,25 자택주소
				 * ,26 직장주소 ,3 전화번호 ,35 자택전화 ,36 직장전화 ,4 팩스 ,99 전체
				 */
				var obj_info_hp =  gDS["DS_ADDR_POHD"].find( function(o){if(o.BZ_SECD == '2' && o.CNTAD_SECD == '22')return true;});

				if(!stringUtil.isNull(obj_info_hp)){
					$("#selCpSecd").val(obj_info_hp.TEL_AR_NUM);
					$("#edtCpGukn").val(obj_info_hp.TEL_GUK_NUM);
					$("#edtCpPk").val(obj_info_hp.TEL_SEQ);
				}
				
				fn_checkHappyCall(); 	// 해피콜 대상 건 조회
				fn_lodingCustInfoForView(); 	// 고객정보를 세팅
				// 가입설계
				if(!stringUtil.isNull(gVAL.qttNo)){
					// 기타 정보 [가설용]
					setEtc_QTT();
					if(!stringUtil.isNull(gData.txpfPosa)) {
						gDS["DS_OTR"].push({});
						gDS["DS_OTR"][0].TXPF_POSA = gData.TXPF_POSA;
					}
				} else {
					fnSetEtcInfo();			// 기타 (AISIS this.setPremMtt)
				}
				// 고령층 지정인 알림서비스
				elderCheck();
				
				if(_callback){
		    		_callback();
		    	}
				break;
		}
		
	};
	
	
	// 청약일자 가져오기
	function getArrDS_CMB_CTYMD() {
		var ctymd = dateUtil.getDate();
		var arr_filetered_DS_CMB_CTYMD = [];
		
		if(!stringUtil.isNull(gDS['ds_ctymd'])){
			var valdPrid =gDS['ds_ctymd'][0].PRPFRM_VALD_PRID;
			if(valdPrid == ctymd){
				arr_filetered_DS_CMB_CTYMD = [];
				arr_filetered_DS_CMB_CTYMD.push({'COD' : ctymd , 'COD_NAM' : "[" + getDayText(ctymd) + "]"});
			} else {
				arr_filetered_DS_CMB_CTYMD = [];
				arr_filetered_DS_CMB_CTYMD.push({'COD' : ctymd , 'COD_NAM' : "[" + getDayText(ctymd) + "]"});
				arr_filetered_DS_CMB_CTYMD.push({'COD' : dateUtil.addDate(ctymd, 'd', 1) , 'COD_NAM' : "[" + getDayText(dateUtil.addDate(ctymd, 'd', 1)) + "]"});
			}
		}else{
			arr_filetered_DS_CMB_CTYMD = [];
			arr_filetered_DS_CMB_CTYMD.push({'COD' : ctymd , 'COD_NAM' : "[" + getDayText(ctymd) + "]"});
			arr_filetered_DS_CMB_CTYMD.push({'COD' : dateUtil.addDate(ctymd, 'd', 1) , 'COD_NAM' : "[" + getDayText(dateUtil.addDate(ctymd, 'd', 1)) + "]"});
			arr_filetered_DS_CMB_CTYMD.push({'COD' : dateUtil.addDate(ctymd, 'd', 2) , 'COD_NAM' : "[" + getDayText(dateUtil.addDate(ctymd, 'd', 2)) + "]"});
			
		}
		gDS['ds_CTYMD'] = arr_filetered_DS_CMB_CTYMD;
	}

	/*
	 * 화면 vissible 처리 as-is draw_object() 함수 연관됨
	 */
	function handlingVisible(){
		/***********************************************************************
		 * 세금우대 visible 처리
		 **********************************************************************/

		if(gDS["ds_ProdtTypeMtt"][0].TXPF_TGT_YN == "1") 
		{
			$("#li_Txpf").show();  // 세금우대란 show
		} 
		// 세금우대 가능여부가 존재하지 않을 경우
		else 
		{
			$("#li_Txpf").hide();
		}
	};
	
	/**
	 * 전산심사
	 */
	function callUdDlng() {
		// 전산심사
		if ('B0000001' == gDS['DS_MAI_INF'][0].COL_PLAR_CHN) { 	
			// 청약입력 확인 ALERT 표시 => 심사처리
			fnValidateSusInpChk();
		} else{	
			if(gDS['DS_MPRD_RPSPDT'][0].PRDCD == "FI"){
				// fiFnUdDlng();
				fnUdDlng();		// 심사처리
			}else{
				fnUdDlng();		// 심사처리
			}
			// fnUdDlng(); // 심사처리
		}
	};
	
	
	/**
	 * 전산심사 전 FC채널(B0000001) : 청약입력 확인 조회
	 */
	function fnValidateSusInpChk() {

		var pohdInfo = $.grep(gDS['DS_CTR_INTP_MTT_LIST'], function(p){if('11' == p.CTR_RLE_SECD)return true;})[0];	// 계약자
		var maiInfo = $.grep(gDS['DS_CTR_INTP_MTT_LIST'], function(p){if('11' == p.CTR_RLE_SECD)return true;})[0];	// 주피보험자
		
		var args = {
			"PLAR_NUM"	: gDS['DS_MAI_INF'][0].COL_PLAR_NUM,	// 설계사사번
			"MAI_RRN"	: maiInfo.RRN,							// 주피보험자 주민번호
			"POHD_RRN"	: pohdInfo.RRN,							// 계약자 주민번호
			"MAI_PRDCD"	: gVAL.maiPrdcd.substring(0,3),			// 상품코드 앞3자리
			"CTYMD"		: gVAL.stdYmd,							// 계약일자
			"remote": convertUtil.getRemoteObj('FG_SusInp', 'UDQ08')
		};
		
		
		// 통신
		D.http.ajax("/sw/swAllCC", args)
		.then(function(result){
			if(result.errorMsg){
				alert("전산심사 전 청약입력확인조회 에러:" + result.errorMsg); 
				return;
			}
			if (result.remoteResult) {
				// 결과 DS 세팅 DS_SUS_INP_CHK
				fnSetGlobalDs(result.remoteResult.outDataSet);

				var fam = gDS['DS_SUS_INP_CHK'][0].FAM;
				var tel = gDS['DS_SUS_INP_CHK'][0].TEL;
				var ins = gDS['DS_SUS_INP_CHK'][0].INS;
				
				// fnUdDlng 심사시작
				if ('1' == fam) {
					dialog.confirm('이 계약은 FC 본인 및 가족계약입니다.<br>계속 진행하시겠습니까?')
					.then(function(rst) {
						if ('YES' == rst) {
							if ('1' == ins) {
								dialog.confirm('오늘의 신계약 중 동일 상품, 동일 계약자/피보험자 계약건이 존재합니다.<br>계속 진행하시겠습니까?')
								.then(function(rst) {
									if ('YES' == rst) {
										if ('1' == tel && '0' == fam) {
											dialog.alert('계약자 전화번호가 FC 연락처와 동일합니다.<br>확인 후 수정해 주시기 바랍니다.')
										} else {
											fnUdDlng();
										}
									}
								}); 
							} else {
								fnUdDlng();
							}
						}
					}); 
				} else {
					fnUdDlng();
				}
			} else {
				D.logger.error('통신 중 에러가 발생했습니다. 에러메세지코드 [' + (result.errorMsg || '') + ']');
				dialog.handLoading(false);
			}
		});
	};


	/**
	 * 심사처리
	 */
	/* check */
	function fnUdDlng(){
		
		// FIXME: 상품코드가 제대로 세팅 됐는지 검사 (문구 수정 필요?)
		if (gVAL.maiPrdcd != $.grep(gDS['DS_NTPRD_MTT'], function(p){if('1' == p.PDT_RLPCD)return true;})[0].PRDCD) {
			dialog.alert('주계약정보의 상품과 가입조건의 상품정보가 일치하지 않습니다. 상품을 다시 확인해 주세요.');
			return;
		}

		if (fnct_validateFc(gDS["DS_MAI_INF"], "COL_PLAR_CHN",   "모집인 채널정보"))   return false; 
		if (fnct_validateFc(gDS["DS_MAI_INF"], "COL_PLAR_BZGR",  "모집인 사업단정보")) return false;
		if (fnct_validateFc(gDS["DS_MAI_INF"], "COL_PLAR_BROFC", "모집인 지점정보"))   return false;
		if (fnct_validateFc(gDS["DS_MAI_INF"], "COL_PLAR_NUM",   "모집인 설계사번"))   return false;

		
		/**
		 * TODO: validation 처리 날짜유효성 this.validateValdYmd("") 상품리스트
		 * this.divPdtLst.premCalc_Validate() 모집경로 선택 체크 cmbMojib 헬스케어체크
		 * checkHealthCare() 변액 적합성 진단 956 ~ 982 line 지정대리청구인정보 DS_DSTN_PX_CLMR
		 * 없으면 DS_DSTN_PX_CLMR 빈값으로 비워주기 (필요없을듯)
		 */ 

		// * DS 초기화

		// -------------------- 심사관련 DS 초기화 ----------------------
		
		// IN DataSet
		gDS['DS_UD_DM_MTT'] 		= [];	// DM사항(녹취번호)
		gDS['DS_UD_DCLO_MTT'] 		= [];	// DM사항(고지사항)
		gDS['DS_UD_RSTM_MTT'] 		= [];	// 부활사항
		gDS['DS_UD_CTMN_MTT'] 		= [];	// 수금사항
		gDS['DS_UD_INCT_INTP'] 		= [];	// 계약관계자
		gDS['DS_UD_ADR_MTT'] 		= [];	// 주소사항
		gDS['DS_UD_ADR_NEW_MTT'] 	= [];	// 신주소사항
		gDS['DS_UD_NTPRD'] 			= [];	// 가입상품
		gDS['DS_UD_PREM_DC_INF'] 	= [];	// 보험료할인정보
		gDS['DS_UD_ANTY_MTT'] 		= [];	// 연금사항
		gDS['DS_UD_VAR_MTT'] 		= [];	// 변액사항
		gDS['DS_VAR_FIT_DIAG']  	= [];	// 변액투자적합정보
		// 그외
		gDS['DS_UD_HIS_MTT']		= [];	// 이력사항
		gDS['DS_UD_ORD_BY_NTPRD']	= [];	// 회차별 가입상품
		gDS['DS_UD_GN_PTCL']		= [];	// 보장내역
		gDS['DS_UD_GN_PTCL_ERR']	= [];	// 보장내역 에러
		gDS['DS_UD_DIAG_PTCL']		= [];	// 추가진단내역
		gDS['DS_UD_ATCD_DOC']		= [];	// 부속서류내역(보완내역)
		gDS['DS_UD_ERR']			= [];	// 에러코드
		gDS['DS_UD_INCT_INTP_AML']	= [];	// AML 관련 DS? 주석이 없넹?
		gDS['dw_ChganoCtr']			= [];	// 승환계약정보
		// -------------------------------------------------------------

		// 단일 string Data
		var dsMaiInf = gDS['DS_MAI_INF'][0];				// 주계약 정보
		var dsProdTypeMtt = gDS['ds_ProdtTypeMtt'][0];		// 주상품유형사항 정보

		// ***** 단일파라미터 키이름은 UdUtil.js 참조
		var params = susDsUdCol.getInitUdParam(); // 심사, 저장시의 기본 단일 파라미터 세팅을
													// 가져온다.
		
		$.extend(params,{
			"sUd_Sctn"          		 : "20",												// 심사구분
			"sUd_Ymd"					 : dateUtil.getDate(),									// 심사일자(오늘날짜
																								// YYYYMMDD)
			"sIndv_Grp"					 : "1",													// 개인단체구분
																								// (1
																								// 개인)
			"sWinsu"					 : "",													// 단체취급여부
			"sGrpDlngNum"				 : "",													// 단체취급번호
			"sGrpDlngCsPk"			 	 : "",													// 단체취급고객번호
			"sChnCod"					 : stringUtil.nvl(dsMaiInf.COL_PLAR_CHN, ""),			// 채널코드
			"sHqCod"					 : stringUtil.nvl(dsMaiInf.COL_PLAR_HQ, ""),			// 본부코드
			"sBzgrpCod"					 : stringUtil.nvl(dsMaiInf.COL_PLAR_HQ, ""),			// 사업단코드
																								// as-is
																								// hqcod
																								// 이상하게
																								// 넘김.
																								// 확인
																								// 필요
			"sBrofcCod"					 : stringUtil.nvl(dsMaiInf.COL_PLAR_BROFC, ""),			// 지점코드
			"sCol_Plar_Empno"			 : stringUtil.nvl(dsMaiInf.COL_PLAR_NUM, ""),			// 모집설계사번
			"sDlfg_Empno"				 : D.global.getUserInfo().empno,						// 처리사번
			"sPoymd"					 : stringUtil.nvl(gVAL.stdYmd, ""),						// 계약일자
			"sCrtn_Dlng_Yn"				 : "0",													// 확정처리여부
			"sCsInf_Sfgd_Req23"			 : "1",													// 계약자_고객정보보호요청여부23
																								// (1 로
																								// 고정)
			"sMPsn_CsInf_Sfgd_Req23"	 : "1",													// 주피_고객정보보호요청여부23(1
																								// 로
																								// 고정)
			"sMPsn_CsInf_Sfgd_Req24"	 : gData.mPsnChkCrinf24Y,		// 주피_고객정보보호요청여부24
																		// (2 -
																		// (1))
			"sMPsn_CsInf_Sfgd_Req24_Ofr" : gData.mPsnChkCrinf24OfrY,	// 주피_고객정보보호요청여부24
																		// (2 -
																		// (2))
			"ADVM_OFR_YN" : gData.ADVM_OFR_YN,	// 광고성 정보 수신동의
			"PDT_AGDC_SD" : gData.PDT_AGDC_SD,	// 상품소개 상세 요약 여부
			"CTR_AGDC_SD" : "2",	// 계약체결 상세

		});

		/**
		 * FIXME: 보유년수 validation 체크... 1129 ~ 1170 ==> 앞에서 체크해도 될듯..
		 */ 

		if (gData.mPsnChkCrinf24Y == "1") {  
			params["sPdt_Indv_Inf_Hold_Yyct"] = gData.edtPdtIndvInfHoldYyct;				// 2-(1)
																							// 보유년수
		}else{
			params["sPdt_Indv_Inf_Hold_Yyct"] = "";				// 2-(1) 보유년수

		}
		if (gData.mPsnChkCrinf24OfrY == "1") {
			params["sPdt_Indv_Inf_Ofr_Hold_Yyct"] = gData.edtPdtIndvInfHoldOfrYyct;		// 2-(2)
																						// 보유년수
		}else{
			params["sPdt_Indv_Inf_Ofr_Hold_Yyct"] =  "";
		}
		
		// 고령층 지정인 알림 신청여부
		var sArarmSvc = gData.elder == "1" ? "Y":"N";
		console.log("sArarmSvc>>",sArarmSvc);
// if(!sArarmYn){
// sArarmSvc = "";
// }
		
		$.extend(params, {
			"sCntc_MdTd_Tel_Yn"			: gData.chkCntcMdTdTel, 	// 2-(3) 전화
			"sCntc_MdTd_Sns_Yn"			: gData.chkCntcMdTdSns,	// 2-(3) SNS
			"sCntc_MdTd_Emal_Yn"		: gData.chkCntcMdTdEmal,	// 2-(3) 이메일
			"sCntc_MdTd_Pmil_Yn"		: gData.chkCntcMdTdPmil,	// 2-(3) 우편
			"sExBnfc_CsInf_Sfgd_Req23"	: "1",												// 주피_고객정보보호요청여부23(항상
																							// '1'로
																							// 고정)
			"sDiBnfc_CsInf_Sfgd_Req23"	: "1",												// 주피_고객정보보호요청여부23(항상
																							// '1'로
																							// 고정)
																							// ?
																							// ASIS가
																							// 이렇게..
			"sDtBnfc_CsInf_Sfgd_Req23"	: "1",												// 주피_고객정보보호요청여부23(항상
																							// '1'로
																							// 고정)
																							// ?
																							// ASIS가
																							// 이렇게..
			"sBnfc_Dstn_Yn"				: gData.bChkBnfcDstnY,		// 3. 보험계약자
																	// 사망 시..
																	// 승계인의
																	// 보험수익자
																	// 지정여부
			"sCnctrAgrmYn"				: "1",	// 4. 통신수단을 이용한 철회/해지동의여부,
												// 동의안함버튼 비활성화로 '1'로 고정
			"sPrpm_Numtm"				: stringUtil.nvl(gData.spnPrpmNumtm, "0"),		// 선납횟수
			"sBasAdrSctn"				: "11",												// 기본주소구분
			"sOblg_Pym_Mtcnt"			: stringUtil.nvl(gData.cmbOblgPym, ""),		// 의무납입개월수
			/* check */
			"sPlyno"					: stringUtil.nvl(stringUtil.isNull(gDS["DS_SUS_PLYNO"])? "": gDS["DS_SUS_PLYNO"][0].PLYNO , ""),	// 증권번호
			"sMaiPrdcdPremModYn"		: "0",												// 주계약변경여부
																							// =>
																							// TOBE는
																							// 변경될일없으므로
																							// 0으로
																							// 고정?
																							// this.nvl(this.divPdtLst.getMaiPrdcdPremModYn(),
																							// "")
																							// ()
			"sPremClapdSecdChkYn"		: "0",												// 보험료역산구분체크여부
			"sExpoVisYmd"				: "",												// 박람회참여일자
			"sExpoCd"					: "0",												// 박람회코드?
			"sAceClbSecd"				: gVAL.sAceClbSecd,
			"dspsSwtYn"					: gData.dsps, // 장애인보험 신청여부
			"sArarmSvcYn"				: sArarmSvc,
			"FNC_SPND_CD" 				: gData.FNC_SPND_CD,  // 전문금융소비자 여부
			"FNC_SPND_YN" 				: gData.FNC_SPND_YN // 일반금융소비자 대우 여부
		}) ; 
		
		D.global.setGlobalData('sArarmSvcYn', params.sArarmSvcYn);

		/*
		 * // TODO [모바일고도화] : 당분간 전자청약으로 전산심사. if(gData.sMblSusSecd == '02'){
		 * $.extend(params, {"omniYn":"1"}); }
		 */

		// 고액할인방법
		if ('1' == dsProdTypeMtt.DC_METD_SLC_COD) {
			params["sDcMetdSlcCod"] = gData.rdoLgamDcMetd;
		} else {
			params["sDcMetdSlcCod"] = stringUtil.nvl(dsProdTypeMtt.DC_METD_SLC_COD, "");
		}

		var qttNoTmp = "";
		
		if(stringUtil.isNull(gVAL.qttNo)){ // 청약일때
			qttNoTmp = gDS.DS_SUS_CTR_BAS[0].QTTNO;
		}
		
		
		$.extend(params, {
			"sChdNcse"			: stringUtil.nvl(gData.edtChdCnt, ""),						// 다녀자할인
																							// 자녀수
			"sCtrSecd"			: "1",																// 계약구분코드
			"sCrtnDlerTgtYn"	: stringUtil.nvl(dsProdTypeMtt.SUS_CRTN_ND_COD, ""),				// 확정처리대상여부
			"sColPlarCsPk"		: stringUtil.nvl(dsMaiInf.COL_PLAR_CS_PK, ""),						// 주설계사
																									// 고유번호
			"sColPlarCsRlePk"	: stringUtil.nvl(dsMaiInf.COL_PLAR_CS_RLE_PK, ""),					// 주설계사
																									// 역할고유번호
			"sJntPlarYn"		: "0",																// 공동설계사
																									// 여부
																									// ::
																									// 공동설계사이제
																									// 불가능?
																									// ASIS도
																									// '1'로
																									// 세팅하는
																									// 코드가
																									// 없음..
																									// this.nvl(this.JNT_PSBY_YN,
																									// ""));
			"sJntPlarCsPk"		: stringUtil.nvl(dsMaiInf.JNT_PLAR_CS_PK, ""),						// 공동설계사
																									// 고유번호
			"sJntPlarCsRlePk"	: stringUtil.nvl(dsMaiInf.JNT_PLAR_CS_RLE_PK, ""),					// 공동설계사
																									// 역할고유번호
			"sJntPlarNum"		: stringUtil.nvl(dsMaiInf.JNT_PLAR_NUM, ""),						// 공동설계사
																									// 사원번호
			"sAdpymPosa"		: stringUtil.nvl((gDS['DS_PREM_PYPRM'].length == 0)? "": gDS['DS_PREM_PYPRM'][0].ADPRM, ""),  				// 추가납입가능금액
																																			// ::
																																			// 0원으로
																																			// 고정?
																																			// this.nvl(this.DS_PREM.getColumn(0,
																																			// "ADPYM_POSA"),
																																			// ""));
			"sGrpDlngYn"		: "",																// 단체취급가능여부
			"sMaigRvpl"			: stringUtil.nvl(gData.cmbMaigRvpl, ""),	// 우편물수령지
			"sInspoRvpl"		: stringUtil.nvl(gData.cmbInspoRvpl, ""),	// 증권수령지
			"sEvntPdtKncd"		: "",																// 이벤트상품여부
																									// ::
																									// FIXME:
																									// ?
																									// 이벤트상품없으므로
																									// ""
																									// 고정?
																									// this.nvl(this.ds_ProdtTypeMtt.getColumn(0,
																									// "EVNT_PDT_KNCD"),
																									// ""));
			"sMaigRcps"			: "",																// 증권수령자?
																									// ASIS도
																									// ""
			"sPdtPdtSecd"		: stringUtil.nvl(gDS['DS_MPRD_SECD'][0].PDT_SECD, ""),				// 상품구분
			"sPdtRpsPrdcd"		: stringUtil.nvl(gDS['DS_MPRD_RPSPDT'][0].PRDCD, ""),				// 대표상품코드
			"sPdtMaiPrdcd"		: stringUtil.nvl(gVAL.maiPrdcd, ""),								// 주상품코드
			"sMaiCsNam"			: stringUtil.nvl(dsMaiInf.CS_NAM, ""),								// 주고객명
			"sMaiCsRrn"			: stringUtil.nvl(dsMaiInf.CS_RRN, ""),								// 주고객주민번호
			"sTxpfSavgSecd"		: stringUtil.nvl(dsProdTypeMtt.TXPF_KNCD, ""),						// 저축종류코드
			"sQttno"			: stringUtil.nvl(gVAL.qttNo, qttNoTmp),								// 가입설계번호
			"sSusnum"			: stringUtil.nvl( (gDS['DS_SUS_PLYNO'] == 0)? "" :  gDS['DS_SUS_PLYNO'][0].SUSNUM, ""),				// 청약서번호
			"sSgngCod"			: "",																// 행정구역코드
		});
		// 다자녀할인적립 :: FIXME: 다자녀가 없다니까.. 그냥 else문의 처리를 하면 될듯..
		if ('2' == dsProdTypeMtt.CHD_AD_DC_METD_COD) {
			params["sChdAdDcMetdSlcCod"] = gData.rdoChdAdDcMetd;
		} else {
			params["sChdAdDcMetdSlcCod"] = dsProdTypeMtt.CHD_AD_DC_METD_COD;
		}

		// * 계약관계자 사항 SET -----------------------------------
		setUdInctIntp();	
		// * 구/신주소 사항 SET ------------------------------------
		setUdAdrMtt();
		// * 가입상품 사항 SET -------------------------------------
		setUdNtprd();
		// *수금 사항 SET -----------------------------------------
		setUdCtmnMtt();
		if(gDS['DS_MPRD_RPSPDT'][0].PRDCD == "FI"){
			// fiFnUdDlng();
			params["sTxpfApplYn"] = "";		// 세금우대신청여부
			params["sTxpfPosa"] = "";		// 세금우대가능금액
			params["sLtaxApptCod"] = "";	// 저율과세적용코드
			params['sFixTrmDfrYn'] = '0';	// 정기지급신청여부
		}
		

		// * 연금 사항 SET ------------------------------------------
		if (gDS['DS_ANTY_MTT'].length > 0) {
			setUdAntyMtt();		// getAntyMtt();
		}
		// * 변액 펀드 사항 SET ------------------------------------------
		var golYn = '0';
		var golPrfr = '';
		var reShar = '';
		var avgPtillvsg = '';

		console.log("심사gDS>>", gDS);
		
		if ('J' == gDS['ds_ProdtTypeMtt'][0].PDT_ATRB_COD) {	// 연금메뉴가 보이면 처리
			console.log("변액사항세팅>>>");
			// 펀드 SET
			if (!getUd_varMtt()) {
				console.log("리턴1>>>");
				return;
			}

			// 운영옵션정보 세팅
			var ret = getUdFndOption();
			if ('1' != ret[0]) {
				console.log("리턴2>>>");
				return;
			}
			
			params["sChkPerVar"] = gData.chkPerVar;

			reShar      = ret[1];
			avgPtillvsg = ret[2];
			golYn       = ret[3];
			golPrfr     = ret[4];
		}

		params["sReShar"] 		 = reShar;		// 자동제분배
		params["sAvgPtilIvst"] 	 = avgPtillvsg;	// 평균분할투자
		params["sGolPrfrApplYn"] = golYn; 		// 목표수익율신청여부
		params["sGolPrfr"] 		 = golPrfr; 	// 목표수익율
		console.log("심사param>>", params);

		// * 기티사항, 저율과세정보 SET
		// --------------------------------------------------------
		// TODO: !validate_Txpf() return
		if ('1' == dsProdTypeMtt.TXPF_TGT_YN) { 	// 세금우대가능
			params["sTxpfApplYn"] = gData.chkTxpf;			// 세금우대신청여부 :: TOBE는
															// 우대가능하면 무조건 신청인
															// 경우만 있음..
															// this.parent.tabIndInf.divForm2.divTxpf.chkTxpf.value
			var txpa = gData.txpfPosa;
			params["sTxpfPosa"] = stringUtil.isNull(txpa) ? "" : dcUtil.removeCommas(txpa);	// 세금우대가능금액
			
			// 저율과세적용코드 :: ASIS는 && LTAX_TGT_YN == '1' 조건도 있지만 신청필수 상품만 있으니 조건
			// 삭제
			params["sLtaxApptCod"] = '1' == dsProdTypeMtt.LTAX_TGT_YN ? gData.cmbInfMnbdSctn : "";
		} else {
			params["sTxpfApplYn"] = "";		// 세금우대신청여부
			params["sTxpfPosa"] = "";		// 세금우대가능금액
			params["sLtaxApptCod"] = "";	// 저율과세적용코드
		}
		params['sFixTrmDfrYn'] = gData.cmbFixtrmDfr || '0';	// 정기지급신청여부


		// * 고지사항 SET
		// ------------------------------------------------------------
		setUdDcloMtt();
		var rpsPrdcd = gDS['DS_MPRD_RPSPDT'][0].PRDCD;
		if(rpsPrdcd == "GW" || rpsPrdcd == "GJ" || rpsPrdcd == "GZ" || rpsPrdcd == "EE" || rpsPrdcd == "G4" ||
		   rpsPrdcd == "GL" || rpsPrdcd == "GN"	|| rpsPrdcd == "H2" || rpsPrdcd == "H6" || rpsPrdcd == "H4" || rpsPrdcd == "HI" || 
		   rpsPrdcd == "HQ" || rpsPrdcd == "HO" || rpsPrdcd == "HR"){
			setVarNtryPrpsInf();
		}
		// * 변액투자적합정보 구성 SET ------------------------------------------------
			

		// FIXME: 나머지 값 세팅 ------------------------------------
		params.sWinsu = "0";
		params.sAdpymPosa = "";
		params.sGrpDlngYn = "0";
		params.sEvntPdtKncd = "0";
		params.sCsRaResultCd = gVAL.csRaResultCd;		// 고객위험평가결과
		params.sAtcdEstyYn = gVAL.atcdEstyYn;			// AML금융의원회 첨부서류 필요여부

		// TODO: checkPlosSadr 실손보험 청약시 의료급여 수급권자 청약 입력사항 반영

		$.extend(params, {
			"REQ_SYS": gVAL.reqSys,
			"sChdCnt": stringUtil.nvl(gData.edtChdCnt, ""),	// 자녀수
			"sDspsDc": "",
			"HEALTH_SVC_NTRY_YN": stringUtil.nvl(gData.rdoHealth, "")// , //
																		// 헬스케어
// "PLOS_SADR_YN": stringUtil.nvl($('input[name=rdoPlosSadr]:checked').val(),
// "") // 의료수급권자
		});

		// ====================== 최종 보낼 데이터 SET ======================
		// null, undefined "" 값으로...
		$.each(params, function(key, val){
			if(null === val || undefined === val) {
				params[key] = "";
			}
		});

		var args = {};
		$.extend(args, params);							// 심사,저장 in 단일 값 세팅
		
		args.remote = convertUtil.getRemoteObj('FG_SusInp', 'EXE');
		args.remote.inDataSet = fnSetUdDsDefault('EXE');		// 심사 in DS 세팅

		// ================================================================
		gPARAM = $.extend({}, params);	// 저장때 사용하기 위해 단일 파라미터 SET 저장 FIXME: ?
		
		/*
		 * 헬스케어 체크
		 */
	    if (!setHealthC()) {
	    	return false;
	    }
		
		// 통신
		D.http.ajax("/sw/swAllCC", args)
		.then(function(result){
			
			if(result.errorMsg){
				// 21.10.12 PDS40061 문구변경_이선민대리 요청
				if (result.id == "PDS40061") {
					dialog.handLoading(false);
					dialog.alert("다음 사유로 처리가 불가능합니다. 금소법 상품숙지 미수강 상태입니다. 수강 완료 후 진행해 주세요.");
					return;
				}else{
					dialog.handLoading(false);
					dialog.alert("전산심사 중 오류:" + result.id + " : "+ result.title);
					return;
				}
			}

			if (result.remoteResult) {
				fnUdDlngCallback(result.remoteResult);	// 심사처리 콜백
			} else {
				D.logger.error('통신 중 에러가 발생했습니다. 에러메세지코드 [' + (result.errorMsg || '') + ']');
				dialog.handLoading(false);
			}
		});
	};
	
	/**
	 * 저가형심사처리
	 */
	/* check */
	function fiFnUdDlng(){

		// FIXME: 상품코드가 제대로 세팅 됐는지 검사 (문구 수정 필요?)
		if (gVAL.maiPrdcd != $.grep(gDS['DS_NTPRD_MTT'], function(p){if('1' == p.PDT_RLPCD)return true;})[0].PRDCD) {
			dialog.alert('주계약정보의 상품과 가입조건의 상품정보가 일치하지 않습니다. 상품을 다시 확인해 주세요.');
			return;
		}

		if (fnct_validateFc(gDS["DS_MAI_INF"], "COL_PLAR_CHN",   "모집인 채널정보"))   return false; 
		if (fnct_validateFc(gDS["DS_MAI_INF"], "COL_PLAR_BZGR",  "모집인 사업단정보")) return false;
		if (fnct_validateFc(gDS["DS_MAI_INF"], "COL_PLAR_BROFC", "모집인 지점정보"))   return false;
		if (fnct_validateFc(gDS["DS_MAI_INF"], "COL_PLAR_NUM",   "모집인 설계사번"))   return false;


		
		/**
		 * TODO: validation 처리 심사 처리 this.validate_ud() 날짜유효성
		 * this.validateValdYmd("") 상품리스트 this.divPdtLst.premCalc_Validate()
		 * 모집경로 선택 체크 cmbMojib 헬스케어체크 checkHealthCare() 변액 적합성 진단 956 ~ 982 line
		 * 지정청구대리인정보 DS_DSTN_PX_CLMR 없으면 DS_DSTN_PX_CLMR 빈값으로 비워주기 (필요없을듯)
		 */ 

		// * DS 초기화

		// -------------------- 심사관련 DS 초기화 ----------------------
		
		// IN DataSet
		gDS['DS_UD_DM_MTT'] 		= [];	// DM사항(녹취번호)
		gDS['DS_UD_DCLO_MTT'] 		= [];	// DM사항(고지사항)
		gDS['DS_UD_RSTM_MTT'] 		= [];	// 부활사항
		gDS['DS_UD_CTMN_MTT'] 		= [];	// 수금사항
		gDS['DS_UD_INCT_INTP'] 		= [];	// 계약관계자
		gDS['DS_UD_ADR_MTT'] 		= [];	// 주소사항
		gDS['DS_UD_ADR_NEW_MTT'] 	= [];	// 신주소사항
		gDS['DS_UD_NTPRD'] 			= [];	// 가입상품
		gDS['DS_UD_PREM_DC_INF'] 	= [];	// 보험료할인정보
		gDS['DS_UD_ANTY_MTT'] 		= [];	// 연금사항
		gDS['DS_UD_VAR_MTT'] 		= [];	// 변액사항
		gDS['DS_VAR_FIT_DIAG']  	= [];	// 변액투자적합정보
		// 그외
		gDS['DS_UD_HIS_MTT']		= [];	// 이력사항
		gDS['DS_UD_ORD_BY_NTPRD']	= [];	// 회차별 가입상품
		gDS['DS_UD_GN_PTCL']		= [];	// 보장내역
		gDS['DS_UD_GN_PTCL_ERR']	= [];	// 보장내역 에러
		gDS['DS_UD_DIAG_PTCL']		= [];	// 추가진단내역
		gDS['DS_UD_ATCD_DOC']		= [];	// 부속서류내역(보완내역)
		gDS['DS_UD_ERR']			= [];	// 에러코드
		gDS['DS_UD_INCT_INTP_AML']	= [];	// AML 관련 DS? 주석이 없넹?
		gDS['dw_ChganoCtr']			= [];	// 승환계약정보
		// -------------------------------------------------------------

		// 단일 string Data
		var dsMaiInf = gDS['DS_MAI_INF'][0];				// 주계약 정보
		var dsProdTypeMtt = gDS['ds_ProdtTypeMtt'][0];		// 주상품유형사항 정보

		// ***** 단일파라미터 키이름은 UdUtil.js 참조
		var params = susDsUdCol.getInitUdParam(); // 심사, 저장시의 기본 단일 파라미터 세팅을
													// 가져온다.
		
		$.extend(params,{
			"sUd_Sctn"          		 : "20",												// 심사구분
			"sUd_Ymd"					 : dateUtil.getDate(),									// 심사일자(오늘날짜
																								// YYYYMMDD)
			"sIndv_Grp"					 : "1",													// 개인단체구분
																								// (1
																								// 개인)
			"sWinsu"					 : "",													// 단체취급여부
			"sGrpDlngNum"				 : "",													// 단체취급번호
			"sGrpDlngCsPk"			 	 : "",													// 단체취급고객번호
			"sChnCod"					 : stringUtil.nvl(dsMaiInf.COL_PLAR_CHN, ""),			// 채널코드
			"sHqCod"					 : stringUtil.nvl(dsMaiInf.COL_PLAR_HQ, ""),			// 본부코드
			"sBzgrpCod"					 : stringUtil.nvl(dsMaiInf.COL_PLAR_HQ, ""),			// 사업단코드
																								// as-is
																								// hqcod
																								// 이상하게
																								// 넘김.
																								// 확인
																								// 필요
			"sBrofcCod"					 : stringUtil.nvl(dsMaiInf.COL_PLAR_BROFC, ""),			// 지점코드
			"sCol_Plar_Empno"			 : stringUtil.nvl(dsMaiInf.COL_PLAR_NUM, ""),			// 모집설계사번
			"sDlfg_Empno"				 : D.global.getUserInfo().empno,						// 처리사번
			"sPoymd"					 : stringUtil.nvl(gVAL.stdYmd, ""),						// 계약일자
			"sCrtn_Dlng_Yn"				 : "0",													// 확정처리여부
			"sCsInf_Sfgd_Req23"			 : "1",													// 계약자_고객정보보호요청여부23
																								// (1 로
																								// 고정)
			"sMPsn_CsInf_Sfgd_Req23"	 : "1",													// 주피_고객정보보호요청여부23(1
																								// 로
																								// 고정)
			"sMPsn_CsInf_Sfgd_Req24"	 : gData.mPsnChkCrinf24Y,		// 주피_고객정보보호요청여부24
																		// (2 -
																		// (1))
			"sMPsn_CsInf_Sfgd_Req24_Ofr" : gData.mPsnChkCrinf24OfrY,	// 주피_고객정보보호요청여부24
																		// (2 -
																		// (2))
			"ADVM_OFR_YN" : gData.ADVM_OFR_YN,	// 광고성 정보 수신동의
			"PDT_AGDC_SD" : gData.PDT_AGDC_SD,	// 상품소개 상세 요약 여부
			"CTR_AGDC_SD" : "2",	// 계약체결 상세
		});

		/**
		 * FIXME: 보유년수 validation 체크... 1129 ~ 1170 ==> 앞에서 체크해도 될듯..
		 */ 

		if (gData.mPsnChkCrinf24Y == "1") {  
			params["sPdt_Indv_Inf_Hold_Yyct"] = gData.edtPdtIndvInfHoldYyct;				// 2-(1)
																							// 보유년수
		}else{
			params["sPdt_Indv_Inf_Hold_Yyct"] = "";				// 2-(1) 보유년수

		}
		if (gData.mPsnChkCrinf24OfrY == "1") {
			params["sPdt_Indv_Inf_Ofr_Hold_Yyct"] = gData.edtPdtIndvInfHoldOfrYyct;		// 2-(2)
																						// 보유년수
		}else{
			params["sPdt_Indv_Inf_Ofr_Hold_Yyct"] =  "";
		}
		

		$.extend(params, {
			"sCntc_MdTd_Tel_Yn"			: gData.chkCntcMdTdTel, 	// 2-(3) 전화
			"sCntc_MdTd_Sns_Yn"			: gData.chkCntcMdTdSns,	// 2-(3) SNS
			"sCntc_MdTd_Emal_Yn"		: gData.chkCntcMdTdEmal,	// 2-(3) 이메일
			"sCntc_MdTd_Pmil_Yn"		: gData.chkCntcMdTdPmil,	// 2-(3) 우편
			"sExBnfc_CsInf_Sfgd_Req23"	: "1",												// 주피_고객정보보호요청여부23(항상
																							// '1'로
																							// 고정)
			"sDiBnfc_CsInf_Sfgd_Req23"	: "1",												// 주피_고객정보보호요청여부23(항상
																							// '1'로
																							// 고정)
																							// ?
																							// ASIS가
																							// 이렇게..
			"sDtBnfc_CsInf_Sfgd_Req23"	: "1",												// 주피_고객정보보호요청여부23(항상
																							// '1'로
																							// 고정)
																							// ?
																							// ASIS가
																							// 이렇게..
			"sBnfc_Dstn_Yn"				: gData.bChkBnfcDstnY,		// 3. 보험계약자
																	// 사망 시..
																	// 승계인의
																	// 보험수익자
																	// 지정여부
			"sCnctrAgrmYn"				: gData.bChkCnctrAgrmY,	// 4. 통신수단을 이용한
																// 철회/해지동의여부
			"sPrpm_Numtm"				: stringUtil.nvl(gData.spnPrpmNumtm, "0"),		// 선납횟수
			"sBasAdrSctn"				: "11",												// 기본주소구분
			"sOblg_Pym_Mtcnt"			: stringUtil.nvl(gData.cmbOblgPym, ""),		// 의무납입개월수
			/* check */
			"sPlyno"					: stringUtil.nvl(stringUtil.isNull(gDS["DS_SUS_PLYNO"])? "": gDS["DS_SUS_PLYNO"][0].PLYNO , ""),	// 증권번호
			"sMaiPrdcdPremModYn"		: "0",												// 주계약변경여부
																							// =>
																							// TOBE는
																							// 변경될일없으므로
																							// 0으로
																							// 고정?
																							// this.nvl(this.divPdtLst.getMaiPrdcdPremModYn(),
																							// "")
																							// ()
			"sPremClapdSecdChkYn"		: "0",												// 보험료역산구분체크여부
			"sExpoVisYmd"				: "",												// 박람회참여일자
			"sExpoCd"					: "0",												// 박람회코드?
			"sAceClbSecd"				: gVAL.sAceClbSecd,
			"dspsSwtYn"					: gData.dsps // 장애인보험 신청여부
			// "sArarmSvcYn" : sArarmSvc
		}); 

		
		D.global.setGlobalData('sArarmSvcYn', params.sArarmSvcYn);

		/*
		 * // TODO [모바일고도화] : 당분간 전자청약으로 전산심사. if(gData.sMblSusSecd == '02'){
		 * $.extend(params, {"omniYn":"1"}); }
		 */

		// 고액할인방법
		if ('1' == dsProdTypeMtt.DC_METD_SLC_COD) {
			params["sDcMetdSlcCod"] = gData.rdoLgamDcMetd;
		} else {
			params["sDcMetdSlcCod"] = stringUtil.nvl(dsProdTypeMtt.DC_METD_SLC_COD, "");
		}

		var qttNoTmp = "";
		
		if(stringUtil.isNull(gVAL.qttNo)){ // 청약일때
			qttNoTmp = gDS.DS_SUS_CTR_BAS[0].QTTNO;
		}

		$.extend(params, {
			"sChdNcse"			: stringUtil.nvl(gData.edtChdCnt, ""),						// 다녀자할인
																							// 자녀수
			"sCtrSecd"			: "1",																// 계약구분코드
			"sCrtnDlerTgtYn"	: stringUtil.nvl(dsProdTypeMtt.SUS_CRTN_ND_COD, ""),				// 확정처리대상여부
			"sColPlarCsPk"		: stringUtil.nvl(dsMaiInf.COL_PLAR_CS_PK, ""),						// 주설계사
																									// 고유번호
			"sColPlarCsRlePk"	: stringUtil.nvl(dsMaiInf.COL_PLAR_CS_RLE_PK, ""),					// 주설계사
																									// 역할고유번호
			"sJntPlarYn"		: "0",																// 공동설계사
																									// 여부
																									// ::
																									// 공동설계사이제
																									// 불가능?
																									// ASIS도
																									// '1'로
																									// 세팅하는
																									// 코드가
																									// 없음..
																									// this.nvl(this.JNT_PSBY_YN,
																									// ""));
			"sJntPlarCsPk"		: stringUtil.nvl(dsMaiInf.JNT_PLAR_CS_PK, ""),						// 공동설계사
																									// 고유번호
			"sJntPlarCsRlePk"	: stringUtil.nvl(dsMaiInf.JNT_PLAR_CS_RLE_PK, ""),					// 공동설계사
																									// 역할고유번호
			"sJntPlarNum"		: stringUtil.nvl(dsMaiInf.JNT_PLAR_NUM, ""),						// 공동설계사
																									// 사원번호
			"sAdpymPosa"		: stringUtil.nvl((gDS['DS_PREM_PYPRM'].length == 0)? "": gDS['DS_PREM_PYPRM'][0].ADPRM, ""),  				// 추가납입가능금액
																																			// ::
																																			// 0원으로
																																			// 고정?
																																			// this.nvl(this.DS_PREM.getColumn(0,
																																			// "ADPYM_POSA"),
																																			// ""));
			"sGrpDlngYn"		: "",																// 단체취급가능여부
			"sMaigRvpl"			: stringUtil.nvl(gData.cmbMaigRvpl, ""),	// 우편물수령지
			"sInspoRvpl"		: stringUtil.nvl(gData.cmbInspoRvpl, ""),	// 증권수령지
			"sEvntPdtKncd"		: "",																// 이벤트상품여부
																									// ::
																									// FIXME:
																									// ?
																									// 이벤트상품없으므로
																									// ""
																									// 고정?
																									// this.nvl(this.ds_ProdtTypeMtt.getColumn(0,
																									// "EVNT_PDT_KNCD"),
																									// ""));
			"sMaigRcps"			: "",																// 증권수령자?
																									// ASIS도
																									// ""
			"sPdtPdtSecd"		: stringUtil.nvl(gDS['DS_MPRD_SECD'][0].PDT_SECD, ""),				// 상품구분
			"sPdtRpsPrdcd"		: stringUtil.nvl(gDS['DS_MPRD_RPSPDT'][0].PRDCD, ""),				// 대표상품코드
			"sPdtMaiPrdcd"		: stringUtil.nvl(gVAL.maiPrdcd, ""),								// 주상품코드
			"sMaiCsNam"			: stringUtil.nvl(dsMaiInf.CS_NAM, ""),								// 주고객명
			"sMaiCsRrn"			: stringUtil.nvl(dsMaiInf.CS_RRN, ""),								// 주고객주민번호
			"sTxpfSavgSecd"		: stringUtil.nvl(dsProdTypeMtt.TXPF_KNCD, ""),						// 저축종류코드
			"sQttno"			: stringUtil.nvl(gVAL.qttNo, qttNoTmp),								// 가입설계번호
			"sSusnum"			: stringUtil.nvl( (gDS['DS_SUS_PLYNO'] == 0)? "" :  gDS['DS_SUS_PLYNO'][0].SUSNUM, ""),				// 청약서번호
			"sSgngCod"			: "",																// 행정구역코드
		});
		// 다자녀할인적립 :: FIXME: 다자녀가 없다니까.. 그냥 else문의 처리를 하면 될듯..
		if ('2' == dsProdTypeMtt.CHD_AD_DC_METD_COD) {
			params["sChdAdDcMetdSlcCod"] = gData.rdoChdAdDcMetd;
		} else {
			params["sChdAdDcMetdSlcCod"] = dsProdTypeMtt.CHD_AD_DC_METD_COD;
		}

		// * 계약관계자 사항 SET -----------------------------------
		setUdInctIntp();	
		// * 구/신주소 사항 SET ------------------------------------
		setUdAdrMtt();
		// * 가입상품 사항 SET -------------------------------------
		setUdNtprd();
		// *수금 사항 SET -----------------------------------------
		setUdCtmnMtt();

		params["sTxpfApplYn"] = "";		// 세금우대신청여부
		params["sTxpfPosa"] = "";		// 세금우대가능금액
		params["sLtaxApptCod"] = "";	// 저율과세적용코드
		params['sFixTrmDfrYn'] = '0';	// 정기지급신청여부

		// FIXME: 나머지 값 세팅 ------------------------------------
		params.sWinsu = "0";
		params.sAdpymPosa = "";
		params.sGrpDlngYn = "0";
		params.sEvntPdtKncd = "0";
		params.sCsRaResultCd = '0';		// 고객위험평가결과(0: 대상아님/성년계약, 1: 저위험, 2:
										// 비영리단체고위험, 3: 미성년계약2 4: 고위험)
		params.sAtcdEstyYn = 'N';		// AML금융의원회 첨부서류 필요여부

		// TODO: setHealthC 헬스케어 validation

		// TODO: checkPlosSadr 실손보험 청약시 의료급여 수급권자 청약 입력사항 반영

		$.extend(params, {
			"REQ_SYS": 'SFA',
			"sChdCnt": "",					// 자녀수
			"sDspsDc": "",
			"HEALTH_SVC_NTRY_YN":  "",		// 헬스케어
			"PLOS_SADR_YN": ""				// 의료수급권자
		});


		// ====================== 최종 보낼 데이터 SET ======================
		// null, undefined "" 값으로...
		$.each(params, function(key, val){
			if(null === val || undefined === val) {
				params[key] = "";
			}
		});

		var args = {};
		$.extend(args, params);							// 심사,저장 in 단일 값 세팅
		args.remote = convertUtil.getRemoteObj('FG_SusInp', 'EXE');
		args.remote.inDataSet = fnSetUdDsDefault('EXE');		// 심사 in DS 세팅
		
		// ================================================================
		gPARAM = $.extend({}, params);	// 저장때 사용하기 위해 단일 파라미터 SET 저장 FIXME: ?


		// 통신
		D.http.ajax("/sw/swAllCC", args)
		.then(function(result){
			
			if(result.errorMsg){
				dialog.handLoading(false)
				dialog.alert(result.id + " : "+ result.title);
				return;
			}

			if (result.remoteResult) {
				fnUdDlngCallback(result.remoteResult);	// 심사처리 콜백
			} else {
				D.logger.error('통신 중 에러가 발생했습니다. 에러메세지코드 [' + (result.errorMsg || '') + ']');
				dialog.handLoading(false)
			}
		});

	}
	
	/**
	 * 청약 저장 기존의 전산심사, 청약저장, KYC(미성년 포함)를 순차적으로 처리한다.
	 */
	function callSave() {
		console.log("======================청약저장 시작====================");
		if ('2' == gVAL.udProcCd) {
			dialog.alert('[임시문구] 전산심사에 오류가 있습니다.<br>청약내용을 확인 후 전산심사를 완료 해 주십시오.');
			return false;
		}
		
		// FATCA, AML, 청약처리 Validat 체크....
		// TODO: if (!this.validate_sus(opCode)) return;

		/**
		 * FATCA => AML => 청약 순으로 저장 함...
		 */
		var txt = stringUtil.isNull(gDS['DS_SUS_PLYNO']) || stringUtil.isNull(gDS['DS_SUS_PLYNO'][0].PLYNO) ? '저장' : '수정';
		
		fnSaveSus();
		/*
		 * if ('1' == $.grep(gDS['DS_UD_INCT_INTP'],function(p){if('47' ==
		 * p.INCT_INTPSCTN)return true;})[0].CSID) { dialog.alert('보험수익자 지정 관련
		 * 유의사항을 확인 하시기 바랍니다.') // 사망시 수익자(47)가 법정상속인(1)인 경우 안내
		 * .then(function(value){ dialog.confirm('청약을 ' + txt + '하시겠습니까?')
		 * .then(function(value) { if ('YES' == value) { fnSaveSus(); } }); }); }
		 * else { dialog.confirm('청약을 ' + txt + '하시겠습니까?') .then(function(value) {
		 * if ('YES' == value) { fnSaveSus(); } }); }
		 */
	};
	
	
	/**
	 * 청약 저장
	 */
	function fnSaveSus() {
		// 변액상품 아닐시 변액적합성진단정보 제거
		var rpsPrdcd = gDS['DS_MPRD_RPSPDT'][0].PRDCD;
		if(gDS["DS_QTT_BAS"] != null){
			var pdtSecd = gDS["DS_QTT_BAS"][0].MPRD_PDT_SECD;
			if(!(pdtSecd == '03' || pdtSecd == '06' || pdtSecd == '09')){
				if(gDS['INS_DS_VAR_FIT_DIAG'].length > 0){
					gDS['INS_DS_VAR_FIT_DIAG'] = [];
				}
			}
		}else{
			var pdtSecd = gDS["DS_MPRD_SECD"][0].PDT_SECD;
			if(!(pdtSecd == '03' || pdtSecd == '06' || pdtSecd == '09')){
				if(gDS['INS_DS_VAR_FIT_DIAG'].length > 0){
					gDS['INS_DS_VAR_FIT_DIAG'] = [];
				}
			}
		}
		dspsInSet();
			
		var txt = stringUtil.isNull(gDS['DS_SUS_PLYNO']) || stringUtil.isNull(gDS['DS_SUS_PLYNO'][0].PLYNO) ? '저장' : '수정';

		var susPlyNo = gDS['DS_SUS_PLYNO'][0];

		// 심사응답 단일파라미터로 inParams 초기화
		var params = $.extend({}, gPARAM);	// 단일 파라미터 key이름은 UdUtil.xjs 참조

		// setAllVarNtryPrpsInf ? 주석없음 :: 변액투자적합정보 데이터 가공?
		var intp = [], chnIntp = [];
		$.each(gDS['INS_DS_VAR_FIT_DIAG'], function(idx, row){
			intp = $.grep(gDS['DS_UD_INCT_INTP'], function(p){if(p.CHN_CSID == row.CS_PK && p.CS_NAM == row.CS_NAM && p.RES_REG_NO == row.CSNUM)return true;});
			chnIntp = $.grep(gDS['DS_UD_INCT_INTP'], function(p){if(p.CHN_CSID == row.CHN_CS_PK && p.CS_NAM == row.CS_NAM && p.RES_REG_NO == row.CSNUM)return true;});
			if (!(intp.length > 0 || chnIntp.length > 0)) {
				delete row;
			}
		});

		// 저장용 단일 파라미터 세팅
		$.extend(params, susDsUdCol.getAllParameter(gPARAM));

		// 수정 일 경우
		if (! (stringUtil.isNull(gDS['DS_SUS_PLYNO']) || stringUtil.isNull(gDS['DS_SUS_PLYNO'][0].PLYNO))) {
			params.sPlyno  = susPlyNo.PLYNO;	// 증권번호
			params.sQttno  = gVAL.qttNo ;		// 가입설계번호
			params.sSusnum = susPlyNo.SUSNUM;	// 청약번호
		}


		if(stringUtil.isNull(gVAL.qttNo)){ // 청약일때
			params.sQttno  = gDS.DS_SUS_CTR_BAS[0].QTTNO;		// 가입설계번호
		}


		params.sCsRaResultCd = gVAL.csRaResultCd;	// 고객위험평가결과
		params.sAtcdEstyYn = gVAL.atcdEstyYn;		// AML금융의원회 첨부서류 필요여부
		$.extend(params, {
			"DLNG_SCTN": "1",
			"REQ_SYS": stringUtil.nvl(gVAL.reqSys, ""),
			"SUS_COL_CORS_KNCD": stringUtil.nvl(gData.cmbMojib, ""),	// 모집경로
			"HEALTH_SVC_NTRY_YN": stringUtil.nvl(gData.rdoHealth, ""),	// 헬스케어신청
			"AD_PYM_YN": "",
			"ACT_PK": "",
			"AD_PYPRM": "",		// /추가납신청금액
			"FRST_ADPYM_APPL_STM": "",
			"sChdNcse": stringUtil.nvl(gData.edtChdCnt, ""),	// 자녀수
			"sDspsDc": "",		// 장애인할인구분 ?
			"sGubun2": "",		// ?
			"sMblSusSecd": gData.sMblSusSecd,							// 모바일청약구분코드
																		// [00:
																		// 해당없음,
																		// 01:
																		// 전자 ,
																		// 02 :
																		// 옴니]
			"sCopyDlvryMthdCod": 	 "01",													// 부본전달방법
																							// [00:
																							// 해당없음,
																							// 01:
																							// 모바일
																							// , 02
																							// :
																							// 이메일]
																							// -
																							// 전자청약에서
																							// 입력하는
																							// 곳이
																							// 있음
			"sInsutrmsDlvryMthdCod": gData.sInsutrmsDlvryMthdCod,		// 약관전달방법
																		// [00:
																		// 해당없음,
																		// 01:
																		// 모바일 ,
																		// 02 :
																		// 이메일
																		// ,03 :
																		// 종이]
			"sHpclMetdCod": gData.sHpclMetdCod,							// 해피콜종류
																		// [00:
																		// 해당없음,
																		// 01:
																		// 모바일 ,
																		// 02 :
																		// 전화]
			"pelVarCtrCcldApplYn": stringUtil.isNull(gData.chkPerVar) ? "" : stringUtil.nvl(gData.chkPerVar, ""),	// 부적합
																													// 보험계약
																													// 체결
																													// 체크
			"PLOS_SADR_YN": "",	// 의료수급권자유무 체크 -- 삭제됨
			"FNC_SPND_CD" 				: gData.FNC_SPND_CD,  // 전문금융소비자 여부
			"FNC_SPND_YN" 				: gData.FNC_SPND_YN  // 일반금융소비자 대우 여부
		});
		
		if (gDS['ds_SusAntyAdInf'] && gDS['ds_SusAntyAdInf'][0]) {
			params['sAIAntyCrtnPridCod'] = gDS['ds_SusAntyAdInf'][0]['ANTY_CRTN_PRID_COD']
		}

		// null, undefined "" 값으로...
		$.each(params, function(key, val){
			if(null === val || undefined === val) {
				params[key] = "";
			}
		});

		var args = {};
		
		$.extend(args, params);							// 심사,저장 in 단일 값 세팅
		args.remote = convertUtil.getRemoteObj('FG_SusInp', 'SAV');
		args.remote.inDataSet = fnSetUdDsDefault('SAV');		// 저장 in DS 세팅
		args.remote.inDataSet.dw_DspsInsSwtAppl = gDS['DS_DspsInsSwtAppl'];
		
// console.log('저장 넘어가는 데이터 ::::'+JSON.stringify(args));
		// 2021.12.14 개인정보 동의 값 체크
		var checkList = {	// 개인정보 동의 값 체크
			check : [
			    args.PDT_AGDC_SD,
			    args.sCnctrAgrmYn,
				args.sMPsn_CsInf_Sfgd_Req24,
				args.ADVM_OFR_YN,
				args.sMPsn_CsInf_Sfgd_Req24_Ofr,
				args.sBnfc_Dstn_Yn,
				args.sCsInf_Sfgd_Req23,
				args.sMPsn_CsInf_Sfgd_Req23,
				args.sExBnfc_CsInf_Sfgd_Req23,
				args.sDiBnfc_CsInf_Sfgd_Req23,
				args.sDtBnfc_CsInf_Sfgd_Req23
			],
			chkCntcMdTd : [	// 광고성 정보의 수신동의
				args.sCntc_MdTd_Tel_Yn,
				args.sCntc_MdTd_Sns_Yn,
				args.sCntc_MdTd_Emal_Yn,
			 	args.sCntc_MdTd_Pmil_Yn 
		    ]
			
		}
		// console.log('checkList:::',checkList);
		if(!psInfoValidCheck(checkList)){
			dialog.handLoading(false);
			return;
		}
		
		
		// 통신
		D.http.ajax("/sw/swAllCC", args)
		.then(function(result){
			
			if(result.errorMsg){
				dialog.handLoading(false);
				dialog.alert("청약 저장 중 오류:" + result.text);
				return; 
			}

			/*
			 * 송재문 부장 요청 2018.5.21
			 */
			if (result.remoteResult) {
				var rstParam = result.remoteResult.paramMap;	// 결과 단일 값
				
				gDS['DS_SUS_PLYNO'] = [{
					PLYNO: rstParam.SUS_PLYNO,		// 증권번호
					SUSNUM: rstParam.SUS_SUSNUM		// 청약번호
				}];
				gDS['DS_MAI_INF'][0].PLYNO = rstParam.SUS_PLYNO;
				gVAL.plyNo  = rstParam.SUS_PLYNO;
				gVAL.susNum  = rstParam.SUS_SUSNUM;

				D.global.setGlobalData('elecPlyno', rstParam.SUS_PLYNO);
				D.global.setGlobalData('elecSusnum', rstParam.SUS_SUSNUM);

				D.global.setGlobalData('elders', '');
				if("FI" != gDS['DS_SUS_MAI_PRDCD'][0].PRDCD.substring(0,2)){
					saveSusDcloMttInf(gVAL.plyNo); // 해피콜 정보를 저장
				}else if("FI" == gDS['DS_SUS_MAI_PRDCD'][0].PRDCD.substring(0,2)){
					// 청약입력이력 등록/수정
					var insArgs = {
						"SUS_INP_HIS_PK"	: gVAL.susInpHisPk, 	// 입력순번
						"SUSNUM"			: gVAL.susNum,	// 청약번호
						"AMDR"				: gVAL.plarNo,			// 수정자
						"PLYNO"				: gVAL.plyNo			// 증권번호
					};
					
					console.log("청약저장시 히스토리>>",insArgs);
					
					// 통신
					D.http.ajax("/su/mblSus/updateSusInpHis", insArgs)
					.then(function(data) {
						if (data.result > 0) {
							gVAL.susInpHisPk = String(data.result);
							gVAL.hisSusNum = gVAL.susNum;
							console.log("susInpHisPk>>", gVAL.susInpHisPk);
							updateDsasUdRst(gVAL.plyNo, gVAL.qttNo);
						}else{
							dialog.alert(data.errorMsg);
						}
					});
								
					dialog.alert("청약 저장이 완료 되었습니다.<br>(증권번호 : " + gVAL.plyNo + ")").then(function () {
						D.move.next({ 
							url: 'su/SU-1090E.html', 
							param: {'SUSNUM':gVAL.susNum, "MBL_SUS_SECD" : gData.sMblSusSecd, "PPAUTH_SFA_CS_PK" : gData.rlpParentPkByPass, 
								"CS_NAM" : gData.txt_csPk_11, "CS_PK" : gData.txt_csPk_11_ByPass}
						}); 
						console.log("완료 gVAL>>", gVAL);
						console.log("완료 param>>", gData);
					});
// $("#btnNext").text("청약진행");
					console.log("완료>>", gVAL.susNum + "::" + gData.sMblSusSecd);
				}
				 
			}
		});
	};
	


	/***************************************************************************
	 * 해피콜 정보를 저장한다.
	 * ---------------------------------------------------------------------------------------
	 * POHD_HPCL_STRT_HMS - 계약자해피콜시작시간 POHD_HPCL_EN_HMS - 계약자해피콜종료시간
	 **************************************************************************/
	function saveSusDcloMttInf(p_plyno) {
		/*
		 * 해피콜 정보 조회
		 */ 
		getSusDcloMttInf(p_plyno, function(){

			/*******************************************************************
			 * 해피콜 기본 정보를 세팅한다.
			 * ---------------------------------------------------------------------------------------
			 * [필요정보는 아래와 같다.] SUSNUM --청약번호 PLYNO --증권번호 CTR_RLE_SECD
			 * --계약역할구분코드 CS_NAM --고객명 CS_RRN --고객주민등록번호 PEL_SCTN_COD --위험구분코드
			 * INJ_PELGRD_COD --상해위험등급코드 CPCD --직업코드 DRVG_COD --운전코드
			 * PEL_PRPS_COD --위험성향코드 POHD_HPCL_STRT_HMS --계약자해피콜시작시간
			 * POHD_HPCL_EN_HMS --계약자해피콜종료기간 FC_EMPNO --설계자 번호
			 ******************************************************************/ 
			
			var param_HPCL = {};
			$.extend(param_HPCL , gDS["ds_DcloMtt"]);
			
			param_HPCL.SUSNUM 				= gVAL.susNum; 							// 청약번호
			param_HPCL.PLYNO 				= gVAL.plyNo; 							// 증권번호
			param_HPCL.CTR_RLE_SECD 		= '21'; 								// 계약역할구분코드(11:계약자/21:피보험자/31:종피)
			param_HPCL.POHD_HPCL_STRT_HMS 	= $("#POHD_HPCL_STRT_HMS").val(); 		// 계약자해피콜시작시간
			param_HPCL.POHD_HPCL_EN_HMS 	= $("#POHD_HPCL_EN_HMS").val(); 		// 계약자해피콜종료기간
			
			console.log("------------------------------고지사항 확인------------------------------");
			console.log(param_HPCL);
			
			var paramList = [];
			if(gVAL['jongpiYn']) {
				paramList = gDS['ds_DcloMttSndi'];
				paramList.forEach(function(item) {
					item.SUSNUM = gVAL.susNum;
					item.PLYNO = gVAL.plyNo;
					item.POHD_HPCL_STRT_HMS = $("#POHD_HPCL_STRT_HMS").val();
					item.POHD_HPCL_EN_HMS = $("#POHD_HPCL_EN_HMS").val();
				});
			} else {
				paramList.push(param_HPCL);
			}

			console.log("------------------------------고지사항 확인2------------------------------");
			console.log(paramList);
			
			D.http.ajax('/su/mblSus/updateSusDclo', initSusDcloMtt(paramList[0])).then(function(data){
				if (!stringUtil.isNull(data.result.SUS_DCLO_MTT_PK)) {
					if(paramList.length > 1 && gVAL['jongpiYn']) {
						D.http.ajax('/su/mblSus/updateSusDclo', initSusDcloMtt(paramList[1])).then(function(data2){
							if (!stringUtil.isNull(data2.result.SUS_DCLO_MTT_PK)) {
								// FATCA 저장에 필요한 CS_PK 를 가져온다.
								// FATCA 저장은 계약자
								fn_selectCustCsPk(function(result){
									fnGetFatca(result.CS_PK);
									fnSaveFatca(result.CS_PK); // fatca 저장 시작
								});
							} else {
								dialog.alert("청약 저장 중 에러(해피콜 정보 저장) : " + data2.errorMsg);
							}
						});
					} else {
						// FATCA 저장에 필요한 CS_PK 를 가져온다.
						fn_selectCustCsPk(function(result){
							fnGetFatca(result.CS_PK);
							fnSaveFatca(result.CS_PK); // fatca 저장 시작
						});
					}
				} else {
					dialog.alert("청약 저장 중 에러(해피콜 정보 저장) : " + data.errorMsg);
				}
			});
		});	
	};

	/**
	 * TODO: FATCA기간계 저장 및 호출
	 */
	function fnGetFatca(cspk, _callback) {
		// fatca 기간계 저장
		var addr = $.grep(gDS['DS_SUS_ADR_POHD_NEW'],function(p){if('2' == p.BZ_SECD && p.CNTAD_BLN_SECD == '5')return true;})[0];
		if(addr != undefined){
			var args = {
					"CSNUM"			 : gVAL.csnum,
					"CS_PK"			 : cspk,
					"BZ_SECD"		 : addr.BZ_SECD,
					"CNTAD_BLN_SECD" : addr.CNTAD_BLN_SECD,
					"CNTAD_SECD"	 : addr.CNTAD_SECD,
					"NEW_OLD_SECD1"	 : addr.NEW_OLD_SECD1,
					"ZCD1"			 : addr.ZCD1,
					"GTED_ADR1"		 : addr.GTED_ADR1,
					"LSTD_ADR1"		 : addr.LSTD_ADR1,
					"ROAD_ZCD_COD1"  : addr.ROAD_ZCD_COD1,
					"NEW_OLD_SECD2"  : addr.NEW_OLD_SECD2,
					"ZCD2"		     : addr.ZCD2,
					"GTED_ADR2"		 : addr.GTED_ADR2,
					"ROAD_ZCD_COD2"	 : addr.ROAD_ZCD_COD2,
					"remote": convertUtil.getRemoteObj("CI_AC_FatcaCRSRgstAdmn", "IQY")
			}
			
			// 통신
			D.http.ajax("/su/mblSus/inqueryFatca", args)
			.then(function(result){
				
				if(result.errorMsg){ 
					alert(result.errorMsg); 
					return; 
				}
				fatcaList = result.remoteResult.outDataSet.DS_LIST.data;
				if(fatcaList.length > 0){
					gData.fii28 = fatcaList[0].FII_28;
				}
			});
			
			if(_callback){
				_callback(result);
			}
			
		}

	}

	/**
	 * TODO: FATCA저장
	 */
	function fnSaveFatca(p_CSPK) {
		
		/*
		 * 여기 validation 처리 해춰야
		 */
		// TODO: if(!this.validate()){ return false; } validation 체크
		// var data = gDS['DS_FATCA_INF'][0];
		var data = $.grep(gDS["DS_CTR_INTP_MTT_LIST"], function(obj){ if(obj.CTR_RLE_SECD == '11')return true;})[0];
		// '('+$('#ZCD').val()+') '
		var fii04 = gData.GTED_ADR + ' ' + gData.LSTD_ADR;

		var fii05 = getCallNumber();

		var params = {
			"CSNUM"		: gVAL.csnum,											// 고객주민번호
			"FII_CS_PK"	: p_CSPK,												// 고객PK
			"FII_01"	: stringUtil.nvl(data.CS_NAM, ""),						// 성명
			"FII_02"	: stringUtil.nvl(g_getBirthDayByRegno(data.RRN), ""),	// 생년월일
			"FII_03"	: stringUtil.nvl(gData.edtCorgnoCon, ""),				// 국적코드
			"FII_04"	: stringUtil.nvl(fii04, ""),							// 주소
			"FII_05"	: stringUtil.nvl(fii05, ""),							// 전화번호
			"FII_06"	: stringUtil.nvl(gData.rdoUsCorYn, ""),					// 미국인해당여부
			"FII_07"	: stringUtil.nvl(gData.rdoUsAmYn, ""),					// 미국인해당일경우 해당사항 코드
			"FII_08"	: stringUtil.nvl(gData.rdoUsSeaYn, ""),					// 해외거주지여부
			"FII_09"	: stringUtil.nvl(gData.edtCorgnoSur, ""),				// 영문성명_성(Surname)
			"FII_10"	: stringUtil.nvl(gData.edtCorgnoGiv, ""),				// 영문성명_명(GivenName)
			"FII_11"	: stringUtil.nvl(gData.edtCorgnoCon1, ""),				// 거주지국가코드1
			"FII_12"	: stringUtil.nvl(gData.edtCorgnoEnAdd1, ""),			// 영문주소1
			"FII_13"	: stringUtil.nvl(gData.edtCorgnoTin1, ""),				// 납세자번호1
			"FII_14"	: stringUtil.nvl(gData.rdoUsEXYn1, ""),					// 미기재사유1
			"FII_15"	: stringUtil.nvl(gData.edtCorgnoETC1, ""),				// 기타사유1
			"FII_16"	: stringUtil.nvl(gData.edtCorgnoCon2, ""),				// 거주지국가코드2
			"FII_17"	: stringUtil.nvl(gData.edtCorgnoEnAdd2, ""),			// 영문주소2
			"FII_18"	: stringUtil.nvl(gData.edtCorgnoTin2, ""),				// 납세자번호2
			"FII_19"	: stringUtil.nvl(gData.rdoUsEXYn2, ""),					// 미기재사유1
			"FII_20"	: stringUtil.nvl(gData.edtCorgnoETC2, ""),				// 기타사유2
			"FII_28"	: stringUtil.nvl(gData.fii28, "")						// 영문주소(변환)
		};
		
		var args = {};
		
		$.extend(args, params);		// 단일 parameter SET
		args.remote = convertUtil.getRemoteObj("FG_AC_FatcaCRSRgstAdmn", "SAV");
		
		console.log("팩카 저장 인풋>>",args);
		// 통신
		D.http.ajax("/sw/swAllCI", args)
		.then(function(result){
			if(result.errorMsg){ 
				alert("청약 저장 중 에러(FATCA 저장실패):" + result.errorMsg);
				return; 
			}

			if (result.remoteResult) {
				// 거래자금실소유정보 저장
				fnSaveActonrInf();
			} else {
				dialog.alert('FATCA 저장 중 오류가 발생했습니다.');
			}
		});
		
		/*
		 * 기간계 직접 저장 $.extend(args, params); // 단일 parameter SET args.remote =
		 * {};
		 * 
		 * console.log("팩카 저장 인풋>>",args); //통신
		 * D.http.ajax("/su/mblSus/inqueryFatca", args) .then(function(result){
		 * 
		 * if (result.rtn == '1') { // 거래자금실소유정보 저장 fnSaveActonrInf(); } else {
		 * dialog.alert('FATCA 저장 중 오류가 발생했습니다.'); } });
		 */
	};


	/**
	 * 거래자금실소유정보 저장
	 */
	function fnSaveActonrInf() {
		
		// * 거래자금실소유정보 저장 =============================================
		var args = {
			"PLYNO": gVAL.plyNo,	// 증권번호
			"remote": convertUtil.getRemoteObj("FG_AC_TrsCaptActlOnrCfmtAdmn", "SAV")
		};
		args.remote.inDataSet = {
			"DS_ACTONR_INF": gDS["DS_ACTONR_INF"]
		};
		// * 저장 통신
		D.http.ajax("/sw/swAllCC", args)
		.then(function(result){
			if(result.errorMsg){ 
				alert("청약저장 중 에러(거래자금실소유정보 저장 에러):" + result.errorMsg); 
				return; 
			}
			if (result.remoteResult) {
				// * AML 모듈 호출 ===========================================
// $("#btnProg").prop('disabled', false); //청약약진행 현황을 사용할 수 있게 한다.
// dialog.alert("청약 저장이 완료 되었습니다.<br>(증권번호 : " + gVAL.plyNo + ")");

				/*
				 * 청약저장 여부 필요한 곳 ----------------------- - AML 란의 [처리]버튼
				 */
				gVAL.isSave 	= true;		

				/*
				 * 심사여부
				 */
				gVAL.udProcCd   = "1";
				
				callEXE();
				// 버튼처리
// $("#btnNext").text("KYC");
				
			}
		});
	};
	
	
	/**
	 * AML [처리] 버튼 (친권자 아님)
	 */
	function callEXE() {
		console.log("======================KYC 시작====================");

      	if ('0' == gVAL.udProcCd) {
	      	dialog.alert('전산심사가 완료되지 않았습니다.<br>먼저 심사처리를 하십시오.');
	      	return;
	    }

		EXE_onclick(function(result){
			if(result.errorMsg){
				dialog.alert("KYC 처리 중 에러 : " + result.text);
				dialog.handLoading(false);
				return; 
			}
// $("#btnProg").prop('disabled', false); //청약약진행 현황을 사용할 수 있게 한다.
			gVAL.amlExeYn = true;
			gVAL.udProcCd = "1";
			
			if (gVAL.CHILD_EXE_YN) {
// $("#btnNext").text("KYC(미)");
				callCHILDEXE();
			} else {
				// 청약입력이력 등록/수정
				var insArgs = {
					"SUS_INP_HIS_PK" : gVAL.susInpHisPk, // 입력순번
					"SUSNUM"		 : gVAL.susNum,		 // 청약번호
					"AMDR"			 : gVAL.plarNo,		 // 수정자
					"PLYNO"			 : gVAL.plyNo		 // 증권번호
				};
				
				console.log("청약저장시 히스토리>>",insArgs);
				
				// 통신
				D.http.ajax("/su/mblSus/updateSusInpHis", insArgs)
				.then(function(data) {
					if (data.result > 0) {
						gVAL.susInpHisPk = String(data.result);
						gVAL.hisSusNum = gVAL.susNum;
						console.log("susInpHisPk>>", gVAL.susInpHisPk);
						updateDsasUdRst(gVAL.plyNo, gVAL.qttNo);
					}else{
						dialog.alert(data.errorMsg);
					}
				});
						
				dialog.alert("청약 저장이 완료 되었습니다.<br>(증권번호 : " + gVAL.plyNo + ")").then(function () {
					D.move.next({ 
						url: 'su/SU-1090E.html', 
						param: {'SUSNUM':gVAL.susNum, "MBL_SUS_SECD" : gData.sMblSusSecd, "PPAUTH_SFA_CS_PK" : gData.rlpParentPkByPass, 
							"CS_NAM" : gData.txt_csPk_11, "CS_PK" : gData.txt_csPk_11_ByPass}
					}); 
					console.log("완료 gVAL>>", gVAL);
					console.log("완료 param>>", gData);
				});
// $("#btnNext").text("청약진행");
				console.log("완료>>", gVAL.susNum + "::" + gData.sMblSusSecd);
			}
			
			/*
			 * dialog.alert("KYC 저장 처리 되었습니다.").then(function() { if
			 * (gVAL.CHILD_EXE_YN) { $("#btnNext").text("KYC(미)"); } else { //
			 * $("#btnNext").text("청약진행"); console.log("완료>>", gVAL.susNum +
			 * "::" + gData.sMblSusSecd); D.move.next({ url: 'su/SU-1090E.html',
			 * param: {'SUSNUM':gVAL.susNum, "MBL_SUS_SECD" : gData.sMblSusSecd,
			 * "PPAUTH_SFA_CS_PK" : gData.rlpParentPkByPass, "CS_NAM" :
			 * gData.txt_csPk_11, "CS_PK" : gData.txt_csPk_11_ByPass} }); } });
			 */
		});
		
		/*
		 * dialog.confirm('처리 하시겠습니까? ') .then(function(value) { if ('YES' ==
		 * value) { EXE_onclick(function(result){ if(result.errorMsg){
		 * dialog.alert(result.text); dialog.handLoading(false) return; } //
		 * $("#btnProg").prop('disabled', false); //청약약진행 현황을 사용할 수 있게 한다.
		 * gVAL.amlExeYn = true; gVAL.udProcCd = "1"; dialog.alert("KYC 저장 처리
		 * 되었습니다.").then(function() { if (gVAL.CHILD_EXE_YN) {
		 * $("#btnNext").text("KYC(미)"); } else { // $("#btnNext").text("청약진행");
		 * console.log("완료>>", gVAL.susNum + "::" + gData.sMblSusSecd);
		 * D.move.next({ url: 'su/SU-1090E.html', param: {'SUSNUM':gVAL.susNum,
		 * "MBL_SUS_SECD" : gData.sMblSusSecd, "PPAUTH_SFA_CS_PK" :
		 * gData.rlpParentPkByPass, "CS_NAM" : gData.txt_csPk_11, "CS_PK" :
		 * gData.txt_csPk_11_ByPass} }); } });
		 * 
		 * }); } });
		 */
	};


	// KYC 처리
	function EXE_onclick(_callback){
	 	
	 	/*
		 * AML 처리는 청약 저장 이후에 처리 할 수 있음
		 */
		/*
		 * if(!gVAL.isSave){ dialog.alert("KYC 처리는 청약저장 이후에 처리 할 수 있습니다.");
		 * return ; }
		 */
	    
	   	// 처리
	    if (true) {
	        var taskId = "FG_KYC_KycDlngAdmn";
	        var opCode = "UDE01";
	        var svcId  = opCode;
	        var param  = {};

	        /*******************************************************************
			 * 계약자 기본 정보
			 ******************************************************************/ 
			var obj_11 = gDS["DS_CTR_INTP_MTT_LIST"].find( function(o){ if(o.CTR_RLE_SECD == '11')return true;} );  // 계약자
																													// 정보
	        param.RNNO_GBN_CD = gData.RNNO_GBN_CD;  // 실명구분
	        
	        // 직장 전화번호 추가
			var phoneData_OFFC = gDS['DS_ADDR_POHD'].find( function(p){if('2' == p.BZ_SECD && '6' == p.CNTAD_BLN_SECD && '3' == p.CNTAD_SECD)return true;} );
			
			gData.OFC_CNTC_REGON_NO  = !stringUtil.isNull(phoneData_OFFC) ? phoneData_OFFC.TEL_AR_NUM   : '';	// 직장연락처
																												// 1
			gData.OFC_CNTC_OFC_NO    = !stringUtil.isNull(phoneData_OFFC) ? phoneData_OFFC.TEL_GUK_NUM 	: '';	// 직장연락처
																												// 2
			gData.OFC_CNTC_INDIVI_NO = !stringUtil.isNull(phoneData_OFFC) ? phoneData_OFFC.TEL_SEQ 		: '';	// 직장연락처
																												// 3

			// 친권자 직장 연락처 추가
			console.log("gVAL.obj_PARENTS>>>", gVAL.obj_PARENTS);
	        if(!stringUtil.isNull(gVAL.obj_PARENTS.OFFICE_TLNO)){
	        	var officeTlno = gVAL.obj_PARENTS.OFFICE_TLNO.split("-");
	        	gData.OFC_CNTC_REGON_NO	 = officeTlno[0]; // 직장연락처 1
	        	gData.OFC_CNTC_OFC_NO	 = officeTlno[1]; // 직장연락처 2
	        	gData.OFC_CNTC_INDIVI_NO = officeTlno[2]; // 직장연락처
	        }
	        
	        if(!stringUtil.isNull(gVAL.obj_PARENTS.RRN)){
	        	param.RNNO = gVAL.obj_PARENTS.RRN;
	        }else{
	        	param.RNNO = stringUtil.isNull(obj_11.RRN) ? "" : obj_11.RRN;
	        }
	        
	        param.HANGL_NM			  = gData.HANGL_NM; // 성명
	        param.CNTRY_CD			  = gData.CNTRY_CD;
	        param.CUST_DTL_TYP_CD 	  = '11' ;
	        param.PRSN_CNTC_REGON_NO  = gData.PRSN_CNTC_REGON_NO;
	        param.PRSN_CNTC_OFC_NO	  = gData.PRSN_CNTC_OFC_NO;
	        param.PRSN_CNTC_INDIVI_NO = gData.PRSN_CNTC_INDIVI_NO;
	        param.HOME_ZIPCD		  = gData.HOME_ZIPCD;
	        param.HOME_ZIPCD_ADDR	  = gData.HOME_ZIPCD_ADDR;
	        param.HOME_DTL_ADDR		  = gData.HOME_DTL_ADDR;
	        param.INSU_JOB_CD		  = gData.INSU_JOB_CD;
	        if ( gData.INSU_JOB_CD == "08") { // 미성년자
	            param.PRSN_BZ_REG_NO   			= "";
	            param.PRSN_BZTYP_CD_01			= "";
	            param.PASSPT_NO					= "";
	            param.OFC_ZIPCD					= "";
	            param.OFC_ZIPCD_ADDR			= "";
	            param.OFC_DTL_ADDR				= "";
	            param.OFC_NM					= "";
	            param.OFC_ORG_NM				= "";
	            param.POSTN_NM					= "";
	            param.OFC_CNTC_REGON_NO			= "";
	            param.OFC_CNTC_OFC_NO			= "";
	            param.OFC_CNTC_INDIVI_NO		= "";
	            param.RLNM_CHK_MTHOD_CD			= "";
	            param.RNNO_ISSUE_DT				= "";
	            param.RL_OWNR_YN				= "";
	            param.RNNO_TRFLS_YN				= "";
	            param.RNNO_MANUL_TRFLS_YN		= "";
	            param.RL_OWNR_HANGL_NM			= "";
	            param.RL_OWNR_BRTHYMD			= "";
	            param.RL_OWNR_CNTRY_CD			= "";
	            param.TXFNOG_CD					= "";
	            param.TXFNOG_ETC_NM				= "";
	            param.NWCT_TXPR_CD				= "";
	            param.INSU_RLPS_CHG_TXPR_CD 	= "";
	            param.CUTBAK_GIV_TXPR_CD		= "";
	            param.CASH_PAY_TXPR_CD			= "";
	            param.NWCT_TXPR_ETC_NM			= "";
	            param.INSU_RLPS_CHG_TXPR_ETC_NM = "";
	            param.CUTBAK_GIV_TXPR_ETC_NM	= "";
	            param.CASH_PAY_TXPR_ETC_NM		= "";
	            param.AIB_INQPE					= "";
	            param.AIB_CHKYN					= "";
	            param.AIB_ERRMSG				= "";
	        } else {
	            param.PRSN_BZ_REG_NO		= ""; 												// 사업자
																								// 번호
	            param.PRSN_BZTYP_CD_01		= ""; 												// 업종
	            param.PASSPT_NO 			= ""; 												// 여권번호
																								// - 삭제
	            param.OFC_ZIPCD 			= gData.OFC_ZIPCD; 									// 직장주소
																								// 1
	            param.OFC_ZIPCD_ADDR 		= gData.OFC_ZIPCD_ADDR; 							// 직장주소
																								// 2
	            param.OFC_DTL_ADDR 			= gData.OFC_DTL_ADDR; 								// 직장주소
																								// 3
	            param.OFC_NM	 			= gData.OFC_NM; 									// 직장(회사)명
	            param.OFC_ORG_NM	 		= gData.OFC_ORG_NM; 								// 부서명
	            param.POSTN_NM	 			= gData.POSTN_NM; 	 								// 직위
	            param.OFC_CNTC_REGON_NO		= gData.OFC_CNTC_REGON_NO;							// 직장연락처
																								// 1
	            param.OFC_CNTC_OFC_NO	 	= gData.OFC_CNTC_OFC_NO; 							// 직장연락처
																								// 2
	            param.OFC_CNTC_INDIVI_NO	= gData.OFC_CNTC_INDIVI_NO; 						// 직장연락처
	            param.RLNM_CHK_MTHOD_CD	    = gData.RLNM_CHK_MTHOD_CD; 							// 신원확인증
	            if(gData.RLNM_CHK_MTHOD_CD == "02" ){  	// 신원확인증 [01: 주민등록증, 02:
														// 운전면허증]
	            	param.RNNO_ISSUE_DT 	= gData.RNNO_ISSUE_DT_.replace(/( |-)/g, ""); 		// 면허번호
	            }else{
	            	param.RNNO_ISSUE_DT 	= gData.mskPblsYmd.replace(/( |-)/g, ""); 			// 발급일자
	            }
	            if(gData.RLNM_CHK_MTHOD_CD == "05" ){  	// 신원확인증 [05: 외국인등록증]
	            	param.SERIAL_NUMBER 	= gData.serialNumber.replace(/( |-)/g, ""); 		// 일련번호
	            }
	            
	            // 실제소유자
	            param.RL_OWNR_YN 			= gData.RL_OWNR_YN; 								// 실제
																								// 소유자
	            param.RNNO_TRFLS_YN 		= gData.RNNO_TRFLS_YN; 								// 진위여부
	            param.RNNO_MANUL_TRFLS_YN 	= gData.RNNO_MANUL_TRFLS_YN; 						// 진위여부
																								// (수동)
	            param.RL_OWNR_HANGL_NM 		= gData.RL_OWNR_HANGL_NM; 							// 실제
																								// 소유자
																								// ::
																								// 성명
	            param.RL_OWNR_BRTHYMD 		= gData.RL_OWNR_BRTHYMD.replace(/(\-|\/)/g, ""); 	// 실제
																								// 소유자
																								// ::
																								// 생년월일
	            param.RL_OWNR_CNTRY_CD 		= gData.RL_OWNR_CNTRY_CD; 							// 실제
																								// 소유자
																								// ::
																								// 국적
	            param.TXFNOG_CD 			= gData.TXFNOG_CD;
	            param.TXFNOG_ETC_NM 		= gData.TXFNOG_ETC_NM;
	            // 실제소유자 end
	            
	            param.NWCT_TXPR_CD				= gData.NWCT_TXPR_CD;
	            param.NWCT_TXPR_ETC_NM		    = stringUtil.isNull(gData.NWCT_TXPR_ETC_NM) ? "" : gData.NWCT_TXPR_ETC_NM;
	            param.INSU_RLPS_CHG_TXPR_ETC_NM = "";
	            param.CUTBAK_GIV_TXPR_ETC_NM	= "";
	            param.CASH_PAY_TXPR_ETC_NM		= "";
	            param.AIB_INQPE	 				= stringUtil.isNull(gVAL.AIB_INQPE) ? "" : gVAL.AIB_INQPE;
	            param.AIB_CHKYN	 				= stringUtil.isNull(gVAL.AIB_CHKYN) ? "" : gVAL.AIB_CHKYN;
	            param.AIB_ERRMSG 				= stringUtil.isNull(gVAL.AIB_ERRMSG)? "" : gVAL.AIB_ERRMSG;
	        }

	        if(!stringUtil.isNull(gVAL.plyNo)){
	        	param.STOCK_NO= gVAL.plyNo;
	        }else{
	        	param.STOCK_NO= "00000" + gVAL.qttNo;
	        }

	        param.OCCUR_DT			= dateUtil.getDate();
	        param.OCCUR_TIME  		= dateUtil.getDateTime().substring(8);
	        param.READ_ONLY   		= "0";
	        param.TASK_GBN_CD 		= "CC" ; // 업무구분
	        param.PRD_CD 			= gVAL.maiPrdcd;
	        param.KYC_DATA_KIND_CD 	= '03';
	        
	        // 2025.03.31 변경(SR202502052887)
	        // 기존 : 로그인 된 설계사 정보
	        // 변경 : GA영업부장 정보
	        debugger;
	        console.log('gDS["DS_KYC_EXCT_INF"]',  gDS["DS_KYC_EXCT_INF"]);
	        console.log('gDS["DS_MAI_INF"]', gDS["DS_MAI_INF"]);
	        if (!stringUtil.isNull(gDS["DS_KYC_EXCT_INF"][0].BLN_OFC_COD) && 
	        	!stringUtil.isNull(gDS["DS_KYC_EXCT_INF"][0].PLAR_NUM)
	        ) {
	        	param.FULFIL_ORG_ID 	= gDS["DS_KYC_EXCT_INF"][0].BLN_OFC_COD; 		// 수행지점번호
	        	param.FULFIL_MMBORG_ID	= gDS["DS_KYC_EXCT_INF"][0].PLAR_NUM; 		 	// 수행인사번
	        } else {
	        	param.FULFIL_ORG_ID 	= gDS["DS_MAI_INF"][0].COL_PLAR_BROFC; 			// 수행지점번호
	        	param.FULFIL_MMBORG_ID	= gDS["DS_MAI_INF"][0].COL_PLAR_NUM; 		 	// 수행인사번
	        }
	        
	        var maiRow 				= gDS["DS_NTPRD_MTT"].findIndex( function(o){if(o.PDT_RLPCD == '1') return true;}  );
	        param.PAY_MTHOD_CD		= gDS["DS_NTPRD_MTT"][maiRow].PYCYC; 			// 납입방식
	        
	        if((gDS['ds_ProdtTypeMtt'][0].RPS_PRDCD == "FI")){  // 교통상해보험
	        	param.INSUF = gDS['DS_SUS_CTR_BAS'][0].SMPRM; 	// 보험료(원단위)
	        }else if(stringUtil.isNull(gDS['DS_SUS_CTR_BAS'])){ // 청약 보험료가 없으면
	        	param.INSUF = gVAL.g_remObj.realPyprm;
	        }else{
	        	param.INSUF = gDS['DS_SUS_CTR_BAS'][0].SMPRM; 	// 보험료(원단위)
	        }
	        
	        param.TXN_CHANL_CD = gDS["DS_MAI_INF"][0].COL_PLAR_CHN; // 거래채널
	        param.TXN_KIND_CD  = "01";

	        var pohdRow = gDS["DS_CTR_INTP_MTT_LIST"].findIndex( function(o){ if(o.CTR_RLE_SECD == '11') return true; } );
	        var csRrn = gDS["DS_CTR_INTP_MTT_LIST"][pohdRow].RRN;
	        var sKYC_CUST_CLS_CD 	= "";
	        var sAgtAddYn;
	        var csRrn 				= gDS["DS_CTR_INTP_MTT_LIST"][pohdRow].RRN;
	        
	        var curSysDaTe 			= dateUtil.getDateTime();
			var pohdAge 			= g_getFullAge(g_getBirthDayByRegno(csRrn), curSysDaTe.substring(0, 8));
			var p_ageYn = "false"; 
			var p_bizYn = "";
		    if (csRrn.length != 13) {
	            var sTa = csRrn.substring(3, 4);
	            if (sTa != "8") {
	                sKYC_CUST_CLS_CD = "01";
	                sINDV_GRP_SECD = "1";
	                p_bizYn = "Y";
	            } else {
	                sKYC_CUST_CLS_CD = "01";
	                sINDV_GRP_SECD = "2";
	                sAgtAddYn = "true";
	                p_bizYn = "N";
	            }
	        } else {
	            if (pohdAge < 19) {
	                sKYC_CUST_CLS_CD = "01";
	                sINDV_GRP_SECD = "1";
	                sAgtAddYn = "true";
	                p_ageYn = "Y";
	            } else {
	                sKYC_CUST_CLS_CD = "01";
	                sINDV_GRP_SECD = "1";
	                sAgtAddYn = "false";
	                p_ageYn = "N";
	            }
	        }

		    if (p_ageYn == "Y") {
	            param.KYC_CUST_CLS_CD 	= "02";
	            param.CSNUM 			= "";
	            param.CS_NAM 			= "";
	            param.CS_PK 			= "";
	        } else {
	            param.KYC_CUST_CLS_CD 	= "01";
	            param.CSNUM 			= gDS["DS_CTR_INTP_MTT_LIST"][pohdRow].CS_NUM;
	            param.CS_NAM 			= gDS["DS_CTR_INTP_MTT_LIST"][pohdRow].CS_NAM;
	            param.CS_PK 			= gDS["DS_CTR_INTP_MTT_LIST"][pohdRow].CS_PK;
	        }
	        param.INDV_GRP_SECD 	= sINDV_GRP_SECD;

	        if (sAgtAddYn == "true") {
	            param.PLYNO 			= gDS["DS_CTR_INTP_MTT_LIST"][pohdRow].PLYNO;
	            param.READ_ONLY 		= "0";
	            param.TASK_GBN_CD 		= "CC";
	            param.OCCUR_DT 			= curSysDaTe.substring(0, 8);
	            param.OCCUR_TIME 		= curSysDaTe.substring(8, 14);
	            param.PRD_CD 			= gDS["DS_CTR_INTP_MTT_LIST"][pohdRow].PRDCD;
	            param.KYC_DATA_KIND_CD 	= "03";
	            
		        // 2025.03.31 변경(SR202502052887)
		        // 기존 : 로그인 된 설계사 정보
		        // 변경 : GA영업부장 정보
		        if (!stringUtil.isNull(gDS["DS_KYC_EXCT_INF"][0].BLN_OFC_COD) && 
		        	!stringUtil.isNull(gDS["DS_KYC_EXCT_INF"][0].PLAR_NUM)
		        ) {
		        	param.FULFIL_ORG_ID 	= gDS["DS_KYC_EXCT_INF"][0].BLN_OFC_COD; 		// 수행지점번호
		        	param.FULFIL_MMBORG_ID	= gDS["DS_KYC_EXCT_INF"][0].PLAR_NUM; 		 	// 수행인사번
		        } else {
		        	param.FULFIL_ORG_ID 	= gDS["DS_CTR_INTP_MTT_LIST"][pohdRow].COL_RSTM_BRCD; 			// 수행지점번호
		        	param.FULFIL_MMBORG_ID	= gDS["DS_CTR_INTP_MTT_LIST"][pohdRow].COL_RSTM_PLARNO; 		// 수행인사번
		        }
	            
	            param.INSUF 			= gDS["DS_CTR_INTP_MTT_LIST"][pohdRow].SMPRM;
	            param.TXN_KIND_CD 		= "01";
	            param.KYC_CUST_CLS_CD 	= "01";
	            param.INDV_GRP_SECD 	= "1";
	            if (p_ageYn == "Y") {
	                param.CSNUM 	 = gDS["DS_CTR_INTP_MTT_LIST"][pohdRow].CS_NUM;
	                param.CS_PK 	 = gDS["DS_CTR_INTP_MTT_LIST"][pohdRow].CS_PK;
	                param.CS_NAM 	 = gDS["DS_CTR_INTP_MTT_LIST"][pohdRow].CS_NAM;
	                sKYC_CUST_CLS_CD = "02"; // 01로 재세팅 되던거 02로 다시
												// 세팅_21.07.09 허성렬 추가_친권자 대리인처리
	            } else {
	                param.CSNUM  = "";
	                param.CS_PK  = "";
	                param.CS_NAM = "";
	            }
	        }
	        param.KYC_CUST_CLS_CD	= sKYC_CUST_CLS_CD;
	        console.log("♣♣♣ HSR ♣♣♣ : checkData >>> " + param.KYC_CUST_CLS_CD);
	        var remote = convertUtil.getRemoteObj('FG_KYC_KycDlngAdmn', 'UDE01');	
	        param.remote = remote;
	        
	        console.log("kyc 처리 >>", param);
	        
	        // KYC 데이터 체크
			// 진위여부값 NULL일 때 리턴 추가
			if (stringUtil.isNull(param.RNNO_TRFLS_YN)) {
				dialog.alert("KYC 데이터 이상이 감지되었습니다(CDD / 진위여부)");
				return;
			}
			
			// 직업코드 값이 없을 때
			if(stringUtil.isNull(param.INSU_JOB_CD)) {
		    	dialog.alert("KYC 데이터 이상이 감지되었습니다(CDD / 직업코드)");
		    	return;
			}
			
			// 거래자금 및 거래목적 여부 체크 포인트
			if(stringUtil.isNull(param.TXFNOG_CD)) {
		    	dialog.alert("KYC 데이터 이상이 감지되었습니다(EDD / 거래자금 원천 및 출처)");
		    	return;
		   	}
		   	
			if(stringUtil.isNull(param.NWCT_TXPR_CD)) {	
		    	dialog.alert("KYC 데이터 이상이 감지되었습니다(EDD / 거래목적)");
		    	return;
		   	}
			
			// 2022.04.28 미성년 + 친권자 계약시
			var obj_11_rrn 	  =  $.grep(gDS["DS_CTR_INTP_MTT_LIST"], function(o){if(o.CTR_RLE_SECD == '11'){ return true; } })[0].RRN; // 계약자
																																		// 정보
			var obj_11_rrn_YN = (dateUtil.getRealAge(obj_11_rrn) > 18) ? true : false ;
			
			if(!obj_11_rrn_YN){	// 계약자 :: 미성년
				if(gData.RL_OWNR_YN_CHILD == "Y"){ 
					if(param.RL_OWNR_YN != "N"){ // 미성년 실소유자 여부 / 친권자 실소유자
													// 여부(Y/Y)
						dialog.alert("KYC 데이터 이상이 감지되었습니다(실제소유자)");
						return;
					}
				}else {
					if(param.RL_OWNR_YN == "N"){ // 미성년 실소유자 여부 / 친권자 실소유자
													// 여부(N/N)
						dialog.alert("KYC 데이터 이상이 감지되었습니다(실제소유자)");
						return;
					}
				}
			}
			
	        D.http.ajax("/sw/swAllCC", param).then(function(result){
	        	if(_callback){
	        		_callback(result);
	        	}
	        });
	    }
	};
	
	/**
	 * 신분증 진위여부 체크
	 */
	function btnIbChk_onclick(){
	    dialog.confirm(
	    	'신분증 진위확인을 5회이상 틀릴경우,<br/> 사용이 불가한 신분증으로 인식합니다. <br/> 신분증의 데이터를 재입력 하신후<br/> 확인을 눌러주시기 바랍니다. <br/> 처리하시겠습니까?'
	    	).then(function(value) {
			if ('YES' == value) {
			    if (validationCheck_trfls()) {
			        var param = {};
			        param.HANGL_NM = $("#HANGL_NM").val();
				  	var val_RRN_11 =  gDS["DS_CTR_INTP_MTT_LIST"].find( function(o){if(o.CTR_RLE_SECD == '11')return true;} ).RRN;
				  	var val_adult_YN_11  = (dateUtil.getRealAge(val_RRN_11) > 18) ? true : false ;  // 계약자
																									// 성인여부

				  	if( !val_adult_YN_11){ // 계약자가 미성년자 이면
				  		param.RNNO 	= gVAL.obj_PARENTS.RRN; // 친권자 주민정보를 넘겨야 함.
				  	}else{
				  		param.RNNO	= $.grep(gDS["DS_CTR_INTP_MTT_LIST"], function(objTmp){if(objTmp.CTR_RLE_SECD == '11'){ return true; } })[0].RRN;	
				  	}
			        
			        // 신원확인증 ( RLNM_CHK_MTHOD_CD :::: 01=주민등록증 / 02=운전면허증 /
					// 05=외국인등록증
				  	param.RLNM_CHK_MTHOD_CD		= $("#RLNM_CHK_MTHOD_CD").val();
			        if ("02" == $("#RLNM_CHK_MTHOD_CD").val()) {
			            param.RNNO_ISSUE_DT		=$("#RNNO_ISSUE_DT_").val().replace(/( |-)/g, "");
			        } else {
			            param.RNNO_ISSUE_DT		=$("#mskPblsYmd").val().replace(/-/g, "");
			        }
			        if("05" == $("#RLNM_CHK_MTHOD_CD").val()){
			        	param.SERIAL_NUMBER		=$("#serialNumber").val().replace(/-/g, "");
			        }
			        
			        var config = D.global.getConfigInfo();

					if (config.serverMode == 'local' || config.serverMode == 'dev') {  // 로컬 ,
																						// 개발
																						// 일때만
						gVAL.AIB_INQPE 	=  "P"; 
						gVAL.AIB_CHKYN 	=  "Y"; 
						gVAL.AIB_ERRMSG 	=  "로컬/개발 강제 패스 "; 
	                    if (gVAL.AIB_INQPE == "P" && gVAL.AIB_CHKYN == "Y") {
                 	        $("#mskPblsYmd").prop('disabled', true);
	                    	$("#RNNO_ISSUE_DT_").prop('disabled', true);
	                    	$("#serialNumber").prop('disabled', true);
	                        $("#RNNO_TRFLS_YN").val("02");
// $("#RNNO_MANUL_TRFLS_YN").prop('disabled', true);
	                        $("#RNNO_MANUL_TRFLS_YN").val("01");
	                        $("#RNNO_TRFLS_YN_TXT").text("일치");
	                        $("#RNNO_TRFLS_YN_TXT").removeClass("no-unity");
	                        $("#RNNO_TRFLS_YN_TXT").addClass("unity");
	                        dialog.alert("신분증 진위 여부 확인 성공");
	                    }
						return ;											
					} 

			        param.remote = convertUtil.getRemoteObj('FG_KYC_KycDlngAdmn', 'UDC01');	 
			        D.http.ajax('/sw/swAllCC', param).then(function(result){

			        	if(result.errorMsg){
			        		if(result.errorMsg){
			        			return result.text;
			        		}
			        		dialog.handLoading(false)
			        		dcUtil.g_showMessage("NPCI0015", "신분증진위여부 모듈 호출 에러");
			        		return;
			        	}

			        	var obj_paramMap =   result.remoteResult.paramMap;
			        	gVAL.AIB_INQPE 	=  obj_paramMap.AIB_INQPE; 
			        	gVAL.AIB_CHKYN 	=  obj_paramMap.AIB_CHKYN; 
			        	gVAL.AIB_ERRMSG 	=  obj_paramMap.AIB_ERRMSG; 
	                    if (gVAL.AIB_INQPE == "P" && gVAL.AIB_CHKYN == "Y") {
	                    	$("#mskPblsYmd").prop('disabled', true);
	                    	$("#RNNO_ISSUE_DT_").prop('disabled', true);
	                    	$("#serialNumber").prop('disabled', true);
	                        $("#RNNO_TRFLS_YN").val("02");
// $("#RNNO_MANUL_TRFLS_YN").prop('disabled', true);
	                        $("#RNNO_MANUL_TRFLS_YN").val("01");
	                        $("#RNNO_TRFLS_YN_TXT").text("일치");
	                        $("#RNNO_TRFLS_YN_TXT").removeClass("no-unity");
	                        $("#RNNO_TRFLS_YN_TXT").addClass("unity");
	                        dialog.alert("신분증 진위여부 확인을 성공하였습니다.");
	                    } else {
	                        if (cntAIB <= 0) {
	                            dcUtil.g_showMessage("NPCI0015", "진위 여부가 불일치입니다. 입력사항을 다시 확인해주세요. \n(에러메세지 : " + gVAL.AIB_ERRMSG + ")");
	                            cntAIB++;
	                        } else {
	                          
	                        	dcUtil.g_showMessage("NPCI0015", "[불일치에 따른 수동진위여부 등록 시]\n 신분증 결과 확인 후 반드시 신분증 스캔하여 첨부하세요.\n(준법감시부 담당자 확인사항)");
	                            $("#RNNO_TRFLS_YN").val("03");
		                        $("#RNNO_TRFLS_YN_TXT").text("불일치");
		                        $("#RNNO_TRFLS_YN_TXT").removeClass("unity");
		                        $("#RNNO_TRFLS_YN_TXT").addClass("no-unity");
// $("#RNNO_MANUL_TRFLS_YN").prop('disabled', false);
	                        }
	                    }
			        });
			    }
			}
		});
	};
	

	function validationCheck_trfls(){
	    if (stringUtil.isNull($("#HANGL_NM").val())) {
	        dcUtil.g_showMessage("NPSE0037", "성명이 입력되지 않았습니다.");
	        setFocus($("#HANGL_NM"));
	        return false;
	    }

	    if (stringUtil.isNull($("#RNNO").val())) {
	        dcUtil.g_showMessage("NPSE0037", "실명번호가 입력되지 않았습니다.");
	        setFocus($("#RNNO"));
	        return false;
	    }

	    if (stringUtil.isNull($("#RLNM_CHK_MTHOD_CD").val()) ) {
	        dcUtil.g_showMessage("NPSE0037", "신원확인증이 선택되지 않았습니다.");
	        setFocus($("#RLNM_CHK_MTHOD_CD"));
	        return false;
	    }
	    if("01" == $("#RLNM_CHK_MTHOD_CD").val()){ // 주민등록증
	    	if(stringUtil.isNull($("#mskPblsYmd").val())) {
	    		dcUtil.g_showMessage("NPSE0037", "발급일자 입력되지 않았습니다.");
	    		setFocus($("#mskPblsYmd"));
	    		return false;
	    	}
	    }else if ("02" == $("#RLNM_CHK_MTHOD_CD").val()) { // 운전면허증
		    if(stringUtil.isNull($("#RNNO_ISSUE_DT_").val())) {
		        dcUtil.g_showMessage("NPSE0037", "면허번호 입력되지 않았습니다.");
		        setFocus($("#RNNO_ISSUE_DT_"));
		        return false;
		    }
	    }else{ // 외국인등록증
	    	if(stringUtil.isNull($("#mskPblsYmd").val())) {
		        dcUtil.g_showMessage("NPSE0037", "발급일자 입력되지 않았습니다.");
		        setFocus($("#mskPblsYmd"));
		        return false;
		    }
	    }
	    return true;
	};
	
	
	/**
	 * 미성년자 KYC
	 */
	function callCHILDEXE() {
		console.log("======================KYC 미 시작====================");
		
		/*
		 * if ('0' == gVAL.udProcCd) { dialog.alert('전산심사가 완료되지 않았습니다.<br>먼저
		 * 심사처리를 하십시오.'); return; }
		 */
		
		EXE_CHILD_onclick(function(result){		// 미성년자 KYC 처리
			if(result.errorMsg){
				dialog.handLoading(false);
				dialog.alert("KYC(미) 처리 중 오류 : " + result.errorMsg);
				return;
			}
			
			// 청약입력이력 등록/수정
			var insArgs = {
				"SUS_INP_HIS_PK"	: gVAL.susInpHisPk, 	// 입력순번
				"SUSNUM"			: gVAL.susNum,	// 청약번호
				"AMDR"				: gVAL.plarNo,			// 수정자
				"PLYNO"				: gVAL.plyNo			// 증권번호
			};
			
			console.log("청약저장시 히스토리>>",insArgs);
			
			// 0913 KYC 체크 포인트 추가_최정규
			// 미성년자 직업코드 08이 아닐 때
			if(!gData.INSU_JOB_CD_CHILD == "08") {
				dialog.alert("KYC 데이터 이상이 감지되었습니다(CDD / 직업코드)");
		    	return;
			}
			
			// KYC 미성년 일 때 진위여부값 X, 거래자금 및 거래목적 여부 체크 포인트
			if(stringUtil.isNull(gData.TXFNOG_CD_CHILD)) {
		    	dialog.alert("KYC 데이터 이상이 감지되었습니다(EDD / 거래자금 원천 및 출처)");
		    	return;
		   	}
			
			if(stringUtil.isNull(gData.NWCT_TXPR_CD_CHILD)) {
				dialog.alert("KYC 데이터 이상이 감지되었습니다(EDD / 거래목적)");
				console.log("KYC 데이터 이상이 감지되었습니다(CDD / 직업코드)" + Ntcc);
		    	return;
		   	}
			
			// 통신
			D.http.ajax("/su/mblSus/updateSusInpHis", insArgs)
			.then(function(data) {
				if (data.result > 0) {
					gVAL.susInpHisPk = String(data.result);
					gVAL.hisSusNum = gVAL.susNum;
					console.log("susInpHisPk>>", gVAL.susInpHisPk);
					updateDsasUdRst(gVAL.plyNo, gVAL.qttNo);
				}else{
					dialog.alert(data.errorMsg);
				}
			});
			
			gVAL.amlExeYn_child = true;
			gVAL.udProcCd = "1";
// $("#btnNext").text("청약진행");
// dialog.alert("미성년자 KYC 저장 처리 되었습니다.").then(function() {
			dialog.alert("청약 저장이 완료 되었습니다.<br>(증권번호 : " + gVAL.plyNo + ")").then(function() {
				D.move.next({ 
					url: 'su/SU-1090E.html', 
					param: {'SUSNUM':gVAL.susNum, "MBL_SUS_SECD" : gData.sMblSusSecd, "PPAUTH_SFA_CS_PK" : gData.rlpParentPkByPass, 
						"CS_NAM" : gData.txt_csPk_11, "CS_PK" : gData.txt_csPk_11_ByPass}
				}); 
				console.log("완료 gVAL>>", gVAL);
				console.log("완료 gData>>", gData);
			});
		});
		
		/*
		 * dialog.confirm('처리 하시겠습니까? ') .then(function(value) { if ('YES' ==
		 * value) { EXE_CHILD_onclick(function(result){ //미성년자 KYC 처리
		 * if(result.errorMsg){ dialog.handLoading(false) return; }
		 * gVAL.amlExeYn_child = true; gVAL.udProcCd = "1"; //
		 * $("#btnNext").text("청약진행"); dialog.alert("미성년자 KYC 저장 처리
		 * 되었습니다.").then(function() { console.log("완료>>", gVAL.susNum + "::" +
		 * gData.sMblSusSecd); D.move.next({ url: 'su/SU-1090E.html', param:
		 * {'SUSNUM':gVAL.susNum, "MBL_SUS_SECD" : gData.sMblSusSecd,
		 * "PPAUTH_SFA_CS_PK" : gData.rlpParentPkByPass, "CS_NAM" :
		 * gData.txt_csPk_11, "CS_PK" : gData.txt_csPk_11_ByPass} }); }); }); }
		 * });
		 */
	};



	function EXE_CHILD_onclick(_callback) {

	 	/*
		 * AML 처리는 청약 저장 이후에 처리 할 수 있음
		 */
		/*
		 * if(!gVAL.isSave){ dialog.alert("KYC 처리는 청약저장 이후에 처리 할 수 있습니다.");
		 * return ; }
		 */

	    
	   	// 처리
	    if (true) {
	        var taskId = "FG_KYC_KycDlngAdmn";
	        var opCode = "UDE01";
	        var svcId = opCode;
	        var param = {};

	        /*******************************************************************
			 * 계약자 기본 정보
			 ******************************************************************/ 
			var obj_11 = gDS["DS_CTR_INTP_MTT_LIST"].find( function(o){ if(o.CTR_RLE_SECD == '11')return true;} );  // 계약자
																													// 정보
	        param.RNNO_GBN_CD		  = gData.RNNO_GBN_CD_CHILD;  		// 실명구분
	        param.RNNO				  = stringUtil.isNull(obj_11.RRN) ? "" : obj_11.RRN;
	        param.HANGL_NM			  = gData.HANGL_NM_CHILD; 			// 성명
	        param.CNTRY_CD			  = gData.CNTRY_CD_CHILD;
	        param.CUST_DTL_TYP_CD 	  = '11' ;
	        param.PRSN_CNTC_REGON_NO  = gData.PRSN_CNTC_REGON_NO_CHILD;
	        param.PRSN_CNTC_OFC_NO	  = gData.PRSN_CNTC_OFC_NO_CHILD;
	        param.PRSN_CNTC_INDIVI_NO = gData.PRSN_CNTC_INDIVI_NO_CHILD;
	        param.HOME_ZIPCD		  = gData.HOME_ZIPCD_CHILD;
	        param.HOME_ZIPCD_ADDR	  = gData.HOME_ZIPCD_ADDR_CHILD;
	        param.HOME_DTL_ADDR		  = gData.HOME_DTL_ADDR_CHILD;
	        param.INSU_JOB_CD		  = gData.INSU_JOB_CD_CHILD;
	        if ( gData.INSU_JOB_CD_CHILD == "08") {
	            param.PRSN_BZ_REG_NO= "";
	            param.PRSN_BZTYP_CD_01= "";
	            param.PASSPT_NO= "";
	            param.OFC_ZIPCD= "";
	            param.OFC_ZIPCD_ADDR= "";
	            param.OFC_DTL_ADDR= "";
	            param.OFC_NM= "";
	            param.OFC_ORG_NM= "";
	            param.POSTN_NM= "";
	            param.OFC_CNTC_REGON_NO= "";
	            param.OFC_CNTC_OFC_NO= "";
	            param.OFC_CNTC_INDIVI_NO= "";
	            param.RLNM_CHK_MTHOD_CD= "";
	            param.RNNO_ISSUE_DT= "";
	            param.RL_OWNR_YN= gData.RL_OWNR_YN_CHILD; 									 // 실제소유자
	            param.RNNO_TRFLS_YN= "";
	            param.RNNO_MANUL_TRFLS_YN= "";
	            param.RL_OWNR_HANGL_NM= gData.RL_OWNR_HANGL_NM_CHILD;	  					 // 실제소유자::성명
	            param.RL_OWNR_BRTHYMD=  gData.RL_OWNR_BRTHYMD_CHILD.replace(/(\-|\/)/g, ""); // 실제소유자::생년월일
	            param.RL_OWNR_CNTRY_CD= gData.RL_OWNR_CNTRY_CD_CHILD; 						 // 실제소유자::국적
	            param.TXFNOG_CD= gData.TXFNOG_CD_CHILD;
	            param.TXFNOG_ETC_NM= gData.TXFNOG_ETC_NM_CHILD;
	            
	            param.NWCT_TXPR_CD= gData.NWCT_TXPR_CD_CHILD;
	            param.NWCT_TXPR_ETC_NM= stringUtil.isNull(gData.NWCT_TXPR_ETC_NM_CHILD) ? "" : gData.NWCT_TXPR_ETC_NM_CHILD;
	            param.INSU_RLPS_CHG_TXPR_CD= "";
	            param.CUTBAK_GIV_TXPR_CD= "";
	            param.CASH_PAY_TXPR_CD= "";            
	            param.INSU_RLPS_CHG_TXPR_ETC_NM= "";
	            param.CUTBAK_GIV_TXPR_ETC_NM= "";
	            param.CASH_PAY_TXPR_ETC_NM= "";
	            param.AIB_INQPE= "";
	            param.AIB_CHKYN= "";
	            param.AIB_ERRMSG= "";
	        } else {
	            param.PRSN_BZ_REG_NO		= ""; 		// 사업자 번호
	            param.PRSN_BZTYP_CD_01		= ""; 		// 업종
	            param.PASSPT_NO 			= ""; 		// 여권번호
	            param.OFC_ZIPCD 			= ""; 		// 직장주소 1
	            param.OFC_ZIPCD_ADDR 		= ""; 		// 직장주소 2
	            param.OFC_DTL_ADDR 			= ""; 		// 직장주소 3
	            param.OFC_NM	 			= ""; 		// 직장(회사)명
	            param.OFC_ORG_NM	 		= ""; 		// 부서명
	            param.POSTN_NM	 			= ""; 	 	// 직위
	            param.OFC_CNTC_REGON_NO		= "";		// 직장연락처 1
	            param.OFC_CNTC_OFC_NO	 	= ""; 		// 직장연락처 2
	            param.OFC_CNTC_INDIVI_NO	= ""; 		// 직장연락처
	            param.RLNM_CHK_MTHOD_CD		= ""; 		// 신원확인증
	            param.RNNO_ISSUE_DT 		= "";
	            param.RL_OWNR_YN 			= ""; 		// 실제 소유자
	            param.RNNO_TRFLS_YN 		= ""; 		// 진위여부
	            param.RNNO_MANUL_TRFLS_YN 	= ""; 		// 진위여부 (수동)
	            param.RL_OWNR_HANGL_NM 		= ""; 		// 실제 소유자 :: 성명
	            param.RL_OWNR_BRTHYMD 		= ""; 		// 실제 소유자 :: 생년월일
	            param.RL_OWNR_CNTRY_CD 		= ""; 		// 실제 소유자 :: 국적
	            param.TXFNOG_CD 			= "";
	            param.TXFNOG_ETC_NM 		= "";
	            param.NWCT_TXPR_CD			= "";
	            param.INSU_RLPS_CHG_TXPR_CD = "";                        
				param.CUTBAK_GIV_TXPR_CD	= "";
	            param.CASH_PAY_TXPR_CD		= "";
	            param.NWCT_TXPR_ETC_NM		= "";
	            param.INSU_RLPS_CHG_TXPR_ETC_NM = "";
	            param.CUTBAK_GIV_TXPR_ETC_NM	= "";
	            param.CASH_PAY_TXPR_ETC_NM	    = "";
	            param.AIB_INQPE		= "";
	            param.AIB_CHKYN		= "";
	            param.AIB_ERRMSG	= "";
	        }
	        param.STOCK_NO			= gVAL.plyNo;
	        param.OCCUR_DT			= dateUtil.getDate();
	        param.OCCUR_TIME		= dateUtil.getDateTime().substring(8);;
	        param.TASK_GBN_CD		= "CC" ;										// 업무구분
	        param.PRD_CD			= gVAL.maiPrdcd;
	        param.KYC_DATA_KIND_CD  = '03';
	        
	        // 2025.03.31 변경(SR202502052887)
	        // 기존 : 로그인 된 설계사 정보
	        // 변경 : GA영업부장 정보
	        if (!stringUtil.isNull(gDS["DS_KYC_EXCT_INF"][0].BLN_OFC_COD) && 
	        	!stringUtil.isNull(gDS["DS_KYC_EXCT_INF"][0].PLAR_NUM)
	        ) {
	        	param.FULFIL_ORG_ID 	= gDS["DS_KYC_EXCT_INF"][0].BLN_OFC_COD; 		// 수행지점번호
	        	param.FULFIL_MMBORG_ID	= gDS["DS_KYC_EXCT_INF"][0].PLAR_NUM; 		 	// 수행인사번
	        } else {
	        	param.FULFIL_ORG_ID 	= gDS["DS_MAI_INF"][0].COL_PLAR_BROFC; 			// 수행지점번호
	        	param.FULFIL_MMBORG_ID	= gDS["DS_MAI_INF"][0].COL_PLAR_NUM; 		 	// 수행인사번
	        }
	        
	        var maiRow 				= gDS["DS_NTPRD_MTT"].findIndex( function(o){if(o.PDT_RLPCD == '1') return true;}  );
	        param.PAY_MTHOD_CD		= gDS["DS_NTPRD_MTT"][maiRow].PYCYC; 			// 납입방식

	        if(stringUtil.isNull(gDS['DS_SUS_CTR_BAS'])){ // 청약 보험료가 없으면
	        	param.INSUF = gVAL.g_remObj.realPyprm;
	        }else{
	        	param.INSUF = gDS['DS_SUS_CTR_BAS'][0].SMPRM; // 보험료(원단위)
	        }
	        
	        
	        param.TXN_CHANL_CD 	= gDS["DS_MAI_INF"][0].COL_PLAR_CHN; // 거래채널
	        param.TXN_KIND_CD 	= "01";

	        var pohdRow = gDS["DS_CTR_INTP_MTT_LIST"].findIndex( function(o){ if(o.CTR_RLE_SECD == '11') return true; } );
	        var csRrn   = gDS["DS_CTR_INTP_MTT_LIST"][pohdRow].RRN;
	        var sKYC_CUST_CLS_CD 	= "";
	        var sAgtAddYn;

	        var csRrn 		= gDS["DS_CTR_INTP_MTT_LIST"][pohdRow].RRN;
	        var curSysDaTe 	= dateUtil.getDateTime();
			var pohdAge 	= g_getFullAge(g_getBirthDayByRegno(csRrn), curSysDaTe.substring(0, 8));
	        param.KYC_CUST_CLS_CD = "01";

	        var remote = convertUtil.getRemoteObj('FG_KYC_KycDlngAdmn', 'UDE01');	
	        param.remote = remote;

	        D.http.ajax("/sw/swAllCC", param).then(function(result){

	        	if(_callback){
	        		_callback(result);
	        	}
	        });
	    }
	};
	

	/*
	 * =========================================================================
	 * 주민번호에서 생년월일을 가져온다. parameter : rrn : 주민등록번호(최소 7자리) return value :
	 * 생년월일(YYYYMMDD)
	 * ===========================================================================
	 */
	function g_getBirthDayByRegno(regno)
	{
		regno = regno.replace(/-/g, "");
		var genderFlag = regno.substring(6, 7);
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
			case "8":	// 2000년 이후 출생 외국인 남아
			case "9":	// 2000년 이후 출생 외국인 여아
				birthYear = "20";
				break;
		}

		if(stringUtil.isNull(birthYear)) {
			if( dateUtil.getDate().substring(2, 6) <= regno.substring(0, 6) ) {
				birthYear = "19";
			} else {
				birthYear = "20";
			}
		}
		var birthDay = birthYear + regno.substring(0, 6);
		return birthDay;
	};
	

	function g_getFullAge(brtYmd, stdYmd) {
	    if (stdYmd.length < 1) {
	        stdYmd = dateUtil.getDate();
	    }
	    var retVal = 0;
	    var monthDiff = getOraMonthsBetween(brtYmd, stdYmd);
	    retVal = parseFloat(monthDiff / 12);
	    return retVal;
	};

	// *--------------------------------------------------------------------------
	// * Oracle의 MONTHS_BETWEEN(toDate, fromDate)을 계산한다. (From/To 날짜순서주의)
	// * from DtUtil.java
	// *--------------------------------------------------------------------------
	function getOraMonthsBetween(fromDate,toDate) {

		var monthsGap = 0;

		var divisor  = 31.0	;	// 제수
		var dividend = 0.0	;	// 피제수


		var yearGap  = parseInt(toDate.substring(0, 4)) - parseInt(fromDate.substring(0, 4));
		var monthGap = parseInt(toDate.substring(4, 6)) - parseInt(fromDate.substring(4, 6));
		var dayGap   = 0;
		
		// 두일자가 모두 말일이면 같은 일자로 간주한다.
		if (dateUtil.addDate(fromDate, 'd', 1).substring(6,8) != "01" 
		      || dateUtil.addDate(toDate, 'd', 1).substring(6,8) != "01") {
			dayGap = parseInt(toDate.substring(6,8)) - parseInt(fromDate.substring(6, 8));
		}
		
		// 계산한다.
		dividend = ( ( yearGap * 12 ) + monthGap ) * divisor + dayGap;
		
		// 결과 계산
		monthsGap = ( dividend / divisor ) ;
		
		return monthsGap;
	};
	

	/*
	 * FATCA 저장에 필요한 CS_PK 를 가져온다.
	 */
	function fn_selectCustCsPk(_callback){
		var args = {
			"PLYNO": gVAL.plyNo,
			"remote": {}
		};

		D.http.ajax("/su/mblSus/selectCustCsPk", args).then(function(result){
			if(result.errorMsg){
				dialog.alert(result.errorMsg);
			}
			if(_callback){
				_callback(result);
			}
		});
	};


	function initSusDcloMtt(obj) {
		obj.KY 					= obj.KY 				? obj.KY : '0';
		obj.WGT 				= obj.WGT 				? obj.WGT : '0';
		obj.MDHIS_SCTN_COD 		= obj.MDHIS_SCTN_COD 	? obj.MDHIS_SCTN_COD : '';
		obj.DSNM 				= obj.DSNM 				? obj.DSNM : '';
		obj.MDATD_STRT_YMD 		= obj.MDATD_STRT_YMD	? obj.MDATD_STRT_YMD : '';
		obj.MDATD_EN_YMD 		= obj.MDATD_EN_YMD 		? obj.MDATD_EN_YMD : '';
		obj.MDATD_CTT 			= obj.MDATD_CTT 		? obj.MDATD_CTT : '';
		obj.MDATD_HSP 			= obj.MDATD_HSP 		? obj.MDATD_HSP : '';
		obj.RE_ORGT_EXPC_YN 	= obj.RE_ORGT_EXPC_YN 	? obj.RE_ORGT_EXPC_YN : '';
		obj.CPN_MDATD_YN 		= obj.CPN_MDATD_YN 		? obj.CPN_MDATD_YN : '';
		obj.PREGN_YN 			= obj.PREGN_YN 			? obj.PREGN_YN : '';
		obj.SMOK_1_DY_NUMTM 	= obj.SMOK_1_DY_NUMTM 	? obj.SMOK_1_DY_NUMTM : '';
		obj.SMOK_PRID 			= obj.SMOK_PRID 		? obj.SMOK_PRID : '';
		obj.SJB_CTT 			= obj.SJB_CTT 			? obj.SJB_CTT : '';
		obj.DFC_PRPO 			= obj.DFC_PRPO 			? obj.DFC_PRPO : '';
		obj.FCNT_DFC_STRT_YMD 	= obj.FCNT_DFC_STRT_YMD ? obj.FCNT_DFC_STRT_YMD : '';
		obj.FCNT_DFC_EN_YMD	 	= obj.FCNT_DFC_EN_YMD 	? obj.FCNT_DFC_EN_YMD : '';
		obj.DRNK_NUMTM 			= obj.DRNK_NUMTM 		? obj.DRNK_NUMTM : '';
		obj.TM1_DRKCP 			= obj.TM1_DRKCP 		? obj.TM1_DRKCP : '';
		obj.PEL_PRPS 			= obj.PEL_PRPS 			? obj.PEL_PRPS : '';
		obj.MDHIS_SCTN_COD_1 	= obj.MDHIS_SCTN_COD_1 	? obj.MDHIS_SCTN_COD_1 : '';
		obj.DSNM_1 				= obj.DSNM_1 			? obj.DSNM_1 : '';
		obj.MDATD_STRT_YMD_1 	= obj.MDATD_STRT_YMD_1 	? obj.MDATD_STRT_YMD_1 : '';
		obj.MDATD_EN_YMD_1 		= obj.MDATD_EN_YMD_1 	? obj.MDATD_EN_YMD_1 : '';
		obj.MDATD_CTT_1 		= obj.MDATD_CTT_1 		? obj.MDATD_CTT_1 : '';
		obj.MDATD_HSP_1 		= obj.MDATD_HSP_1 		? obj.MDATD_HSP_1 : '';
		obj.RE_ORGT_EXPC_YN_1 	= obj.RE_ORGT_EXPC_YN_1 ? obj.RE_ORGT_EXPC_YN_1 : '';
		obj.CPN_MDATD_YN_1 		= obj.CPN_MDATD_YN_1 	? obj.CPN_MDATD_YN_1 : '';
		obj.MDHIS_SCTN_COD_2 	= obj.MDHIS_SCTN_COD_2 	? obj.MDHIS_SCTN_COD_2 : '';
		obj.DSNM_2 				= obj.DSNM_2 			? obj.DSNM_2 : '';
		obj.MDATD_STRT_YMD_2 	= obj.MDATD_STRT_YMD_2 	? obj.MDATD_STRT_YMD_2 : '';
		obj.MDATD_EN_YMD_2 		= obj.MDATD_EN_YMD_2 	? obj.MDATD_EN_YMD_2 : '';
		obj.MDATD_CTT_2 		= obj.MDATD_CTT_2 		? obj.MDATD_CTT_2 : '';
		obj.MDATD_HSP_2 		= obj.MDATD_HSP_2 		? obj.MDATD_HSP_2 : '';
		obj.RE_ORGT_EXPC_YN_2 	= obj.RE_ORGT_EXPC_YN_2 ? obj.RE_ORGT_EXPC_YN_2 : '';
		obj.CPN_MDATD_YN_2 		= obj.CPN_MDATD_YN_2 	? obj.CPN_MDATD_YN_2 : '';
		obj.SKL_OBS_RSN_COD 	= obj.SKL_OBS_RSN_COD 	? obj.SKL_OBS_RSN_COD : '';
		obj.SKL_AD_INF 			= obj.SKL_AD_INF 		? obj.SKL_AD_INF : '';
		obj.HMBD_OBS_RSN_COD 	= obj.HMBD_OBS_RSN_COD 	? obj.HMBD_OBS_RSN_COD : '';
		obj.HMBD_AD_INF 		= obj.HMBD_AD_INF 		? obj.HMBD_AD_INF : '';
		obj.PREGN_MTCNT 		= obj.PREGN_MTCNT 		? obj.PREGN_MTCNT : '';
		obj.FCNT_DFC_AR 		= obj.FCNT_DFC_AR 		? obj.FCNT_DFC_AR : '';
		obj.MTHLY_INCM 			= obj.MTHLY_INCM 		? obj.MTHLY_INCM : '';
		obj.OTCM_NTRY_CO_NAM 	= obj.OTCM_NTRY_CO_NAM 	? obj.OTCM_NTRY_CO_NAM : '';
		obj.OTCM_NTRY_NCSE 		= obj.OTCM_NTRY_NCSE 	? obj.OTCM_NTRY_NCSE : '';
		obj.OTCM_NTRY_MM_PREM 	= obj.OTCM_NTRY_MM_PREM ? obj.OTCM_NTRY_MM_PREM : '';
		obj.POHD_HPCL_STRT_HMS 	= obj.POHD_HPCL_STRT_HMS ? obj.POHD_HPCL_STRT_HMS : '';
		obj.POHD_HPCL_EN_HMS 	= obj.POHD_HPCL_EN_HMS 	? obj.POHD_HPCL_EN_HMS : '';
		obj.MAIPSN_HPCL_STRT_HMS = obj.MAIPSN_HPCL_STRT_HMS ? obj.MAIPSN_HPCL_STRT_HMS : '';
		obj.MAIPSN_HPCL_EN_HMS 	= obj.MAIPSN_HPCL_EN_HMS ? obj.MAIPSN_HPCL_EN_HMS : '';
		obj.DCLO_YN_9 			= obj.DCLO_YN_9 		? obj.DCLO_YN_9 : '';
		obj.DRVG_VHCL_KND_1 	= obj.DRVG_VHCL_KND_1 	? obj.DRVG_VHCL_KND_1 : '';
		obj.DRVG_VHCL_KND_2 	= obj.DRVG_VHCL_KND_2 	? obj.DRVG_VHCL_KND_2 : '';
		obj.DRVG_VHCL_OTR 		= obj.DRVG_VHCL_OTR 	? obj.DRVG_VHCL_OTR : '';
		obj.SIMP_DCLO_YN_1 		= obj.SIMP_DCLO_YN_1 	? obj.SIMP_DCLO_YN_1 : '';
		obj.SIMP_DCLO_YN_2	 	= obj.SIMP_DCLO_YN_2 	? obj.SIMP_DCLO_YN_2 : '';
		obj.SIMP_DCLO_YN_3 		= obj.SIMP_DCLO_YN_3 	? obj.SIMP_DCLO_YN_3 : '';
		obj.JSON_CTT  			= obj.JSON_CTT  			? obj.JSON_CTT  : '{}';
		obj.ELEC_VHCL_YN  			= obj.ELEC_VHCL_YN  			? obj.ELEC_VHCL_YN  : '';
		return obj;
	};

	
	/*
	 * as-is 해피콜 조회
	 */

	function getSusDcloMttInf(plyno, _callback) {
		var param = {
			"PLYNO"	: plyno,
			"SNDI_YN" : (gVAL["jongpiYn"] ? 'Y' : 'N')
		};

		D.http.ajax('/su/mblSus/selectSusDclo', param).then(function(data){ 
			if(data.errorMsg){
	    		dialog.alert("청약저장 중 에러:" + data.errorMsg);
	    		return ;
	    	}
			if(gVAL["jongpiYn"]) {
				gDS['ds_DcloMttSndi'] = data.ds_DcloMttSndi;
			} else {
				gDS['ds_DcloMtt'] = data.map;
			}
			
			if(_callback){
				_callback(data);
			}
		});
	};


	// 장애인 저장 값
	function dspsInSet() {
		var opcode;
		
		if(gData.dsps == "1"){
			// ------------------------------ 주피보험자
			// ------------------------------
			if(gData.dspsCh == "01"){
				var YNM; // 영구(1), 한시(2)
				var end =  gData.maipsn_end_date.replace(/( |-)/g, ""); // 종료일자
				opcode; // 구분 코드 (INS,UPD,DEL)
				var ctr =  $.grep(gDS["DS_ADDR_MAIPSN"], function(obj){ if(obj.CNTAD_SECD == '22' && obj.BZ_SECD == '1' )return true;})[0]; // 고객고유번호
				
				if(gData.RL_OWNR_YN001 == "Y"){
					YNM = "1";
				}else{
					YNM = "2";
				}
				
				gDS['DS_DspsInsSwtAppl'] = [{
					"PLYNO":gVAL.plyNo, // 증권번호
					"CS_PK":ctr.CS_PK,
					"CTR_RLE_SECD":"21",
					"OBS_YN":YNM, 
					"APPL_YMD":gVAL.stdYmd,  // 계약일
					"END_YMD":end,
					"OP_CODE":"" // INS UPD 구분
				}];
				
				opcode = dspsOpcode();
				
				gDS['DS_DspsInsSwtAppl'][0].OP_CODE = opcode;
				
				if("INS" == opcode || "UPD" == opcode){
					gDS['DS_DSPS_Y'] = null;
					gDS['DS_DSPS_M'] = gDS['DS_DspsInsSwtAppl'];
				}
			} else if(gData.dspsCh == "02"){
				// ------------------------------ 수익자
				// ------------------------------
				// 만기
				var YNE; // 영구(1), 한시(2)
				var cs1 = $.grep(gDS["DS_UD_INCT_INTP"], function(obj){ if(obj.INCT_INTPSCTN == '41'  )return true;})[0]; // 고객고유번호
				var end1 =  gData.expi_end_date.replace(/( |-)/g, "");
				opcode; // 구분 코드 (INS,UPD,DEL)
				
				if(gData.RL_OWNR_YN011 == "Y"){
					YNE = "1";
				}else{
					YNE = "2";
				}
				
				// 장해
				var YNH; // 영구(1), 한시(2)
				var cs2 = $.grep(gDS["DS_UD_INCT_INTP"], function(obj){ if(obj.INCT_INTPSCTN == '42'  )return true;})[0]; // 고객고유번호
				var end2 =  gData.hspz_end_date.replace(/( |-)/g, "");
				
				
				if(gData.RL_OWNR_YN21 == "Y"){
					YNH = "1";
				}else{
					YNH = "2";
				}
				
				// 사망시
				var YND; // 영구(1), 한시(2)
				var cs3 = $.grep(gDS["DS_UD_INCT_INTP"], function(obj){ if(obj.INCT_INTPSCTN == '47' )return true;})[0]; // 고객고유번호
				var end3 =  gData.dth_end_date.replace(/( |-)/g, "");
			
				
				if(gData.RL_OWNR_YN31 == "Y"){
					YND = "1";
				}else{
					YND = "2";
				}
				
				gDS['DS_DspsInsSwtAppl'] = [{
					"PLYNO":gVAL.plyNo, // 증권번호
					"CS_PK":cs1.CSID,
					"CTR_RLE_SECD":"41",
					"OBS_YN":YNE,
					"APPL_YMD":gVAL.stdYmd,  // 계약일
					"END_YMD":end1,
					"OP_CODE":""
				}, 
				{
					"PLYNO":gVAL.plyNo, // 증권번호
					"CS_PK":cs2.CSID,
					"CTR_RLE_SECD":"42",
					"OBS_YN":YNH,
					"APPL_YMD":gVAL.stdYmd,  // 계약일
					"END_YMD":end2,
					"OP_CODE":""
				},
				{
					"PLYNO":gVAL.plyNo, // 증권번호
					"CS_PK":cs3.CSID,
					"CTR_RLE_SECD":"47",
					"OBS_YN":YND,
					"APPL_YMD":gVAL.stdYmd,  // 계약일
					"END_YMD":end3,
					"OP_CODE":""
				}];
	
				opcode = dspsOpcode();
				
				gDS['DS_DspsInsSwtAppl'][0].OP_CODE = opcode;
				gDS['DS_DspsInsSwtAppl'][1].OP_CODE = opcode;
				gDS['DS_DspsInsSwtAppl'][2].OP_CODE = opcode;
			
				if("INS" == opcode || "UPD" == opcode){
					gDS['DS_DSPS_M'] = null;
					gDS['DS_DSPS_Y'] = gDS['DS_DspsInsSwtAppl'];
				}
			}
		} else{
			gDS['DS_DspsInsSwtAppl'] = [];
			
			if(null != gDS['DS_DSPS_M'] && undefined != gDS['DS_DSPS_M']){
				opcode = "DEL";
				gDS['DS_DspsInsSwtAppl'] = gDS['DS_DSPS_M'];
				gDS['DS_DspsInsSwtAppl'][0].OP_CODE = opcode;
			}else if(null != gDS['DS_DSPS_Y'] && undefined != gDS['DS_DSPS_Y']){
				opcode = "DEL";
				gDS['DS_DspsInsSwtAppl'][0] = gDS['DS_DSPS_Y'][0];
				gDS['DS_DspsInsSwtAppl'][0].OP_CODE = opcode;
			}else{
				return;
			}
			
			if("DEL" == opcode){
				gDS['DS_DSPS_Y'] = null;
				gDS['DS_DSPS_M'] = null;
			}
		}
	};

	
	// 장애인 보험 opcode 구분
	function dspsOpcode() {
		var opcode; // 구분 코드 (INS,UPD,DEL)
		
		if((null != gDS['DS_DSPS_Y'] && undefined != gDS['DS_DSPS_Y'] || null != gDS['DS_DSPS_M'] && undefined != gDS['DS_DSPS_M']) && null == gDS['DS_DspsInsSwtAppl'] && undefined == gDS['DS_DspsInsSwtAppl']){
			  // 조회값 null X & 입력값 null == DEL
				opcode = "DEL";
		} else if((null == gDS['DS_DSPS_Y'] && undefined == gDS['DS_DSPS_Y'] && null == gDS['DS_DSPS_M'] && undefined == gDS['DS_DSPS_M']) && null != gDS['DS_DspsInsSwtAppl'] ){
			// 조회값 null & 입력값 null X == INS
				opcode = "INS";
		} else if((null != gDS['DS_DspsInsSwtAppl'] ||  undefined != gDS['DS_DspsInsSwtAppl']) && undefined != gDS['DS_DSPS_M'] && null != gDS['DS_DSPS_M']){  // 주피일때
					if(gDS['DS_DSPS_M'][0].CS_PK != gDS['DS_DspsInsSwtAppl'][0].CS_PK || gDS['DS_DSPS_M'][0].CTR_RLE_SECD != gDS['DS_DspsInsSwtAppl'][0].CTR_RLE_SECD
							|| gDS['DS_DSPS_M'][0].OBS_YN != gDS['DS_DspsInsSwtAppl'][0].OBS_YN || gDS['DS_DSPS_M'][0].APPL_YMD != gDS['DS_DspsInsSwtAppl'][0].APPL_YMD
							|| gDS['DS_DSPS_M'][0].END_YMD != gDS['DS_DspsInsSwtAppl'][0].END_YMD){
						opcode = "UPD";
					}else{
						opcode = "PAS";
					}
		} else if( (null == gDS['DS_DSPS_Y'] && undefined == gDS['DS_DSPS_Y'] || null == gDS['DS_DSPS_M'] && undefined == gDS['DS_DSPS_M']) && undefined != gDS['DS_DSPS_Y'] && null != gDS['DS_DSPS_Y']){  // 수익자일때
				if( "3" == gDS['DS_DspsInsSwtAppl'].length){
					for (var i = 0; i < gDS['DS_DSPS_Y'].length; i++) {
						if(gDS['DS_DSPS_Y'][i].CS_PK != gDS['DS_DspsInsSwtAppl'][i].CS_PK || gDS['DS_DSPS_Y'][i].CTR_RLE_SECD != gDS['DS_DspsInsSwtAppl'][i].CTR_RLE_SECD
								|| gDS['DS_DSPS_Y'][i].OBS_YN != gDS['DS_DspsInsSwtAppl'][i].OBS_YN || gDS['DS_DSPS_Y'][i].APPL_YMD != gDS['DS_DspsInsSwtAppl'][i].APPL_YMD
								|| gDS['DS_DSPS_Y'][i].END_YMD != gDS['DS_DspsInsSwtAppl'][i].END_YMD){
							opcode = "UPD";
							break;
						}else{
							opcode = "PAS";
						}
					}
				}else{
					opcode = "UPD";
				}
			}
		return opcode;
	};
	

	function comparePerVar(val2, answ7Val, pycycCodVal, pdtAtrbDtlcd, answ2Val) {
		console.log("comparePerVar >>>");
		// 전문 금융 소비자의 경우 모든 체크로직 패스
		if(gData.FNC_SPND_CD == '1'){
			return true;
		}
		
		var polData = $.grep(gDS['DS_CTR_INTP_MTT_LIST'], function(p){if('11' == p.CTR_RLE_SECD)return true;} )[0];	// 계약자정보
		var polCsPk  = polData.CS_PK;
		var polCsNam = polData.CS_NAM;
		var polRrn   = polData.RRN;
		var csPkColNm = ('N' != gVAL.loadMode && 'Q' != gVAL.loadMode) ? 'CS_PK' : 'CHN_CS_PK';
		var arr_INS_DS_VAR_FIT_DIAG = $.grep(gDS['INS_DS_VAR_FIT_DIAG'], function(p){if(p[csPkColNm] == polCsPk && p.CS_NAM == polCsNam && p.CSNUM === polRrn)return true;});
		gVAL.insCtrPrps = arr_INS_DS_VAR_FIT_DIAG.length > 0 ? arr_INS_DS_VAR_FIT_DIAG[0].INS_CTR_PRPS : ""; // 투자성향
		gVAL.rcmInsPdt = arr_INS_DS_VAR_FIT_DIAG.length > 0 ? arr_INS_DS_VAR_FIT_DIAG[0].RCM_INS_PDT : "";   // 변액적합성
																												// 검사
																												// 점수
	    
	    var msg = "";
	    msg += "고객의 투자성향보다 위험도가<br/> 높은 펀드를 선택하셨습니다. <br/>";
	    msg += "위험도에 맞는 펀드로 변경 하여야 합니다.";
	    var msg2 = "";
	    msg2 += "적합성 진단 7번문항에서 보험료 납입 가능 기간 '3년 미만' 선택시<br/>";
	    msg2 += "납입기간 3년미만(일시납 포함) 상품을 가입 하여야 합니다.";
	    var msg3 = "";
	    msg3 += "고객의 상품성향과 다른 상품을 선택하셨습니다.<br/>";
	    msg3 += "상품성향에 맞는 상품으로 변경 하여야 합니다.";
	    var msg4 = "";
	    msg4 += "고객의 투자성향보다 위험도가<br/> 높은 펀드를 선택하셨습니다.<br/>";
	    msg4 += "위험도에 맞는 펀드로 변경 하여야 합니다.";
	    
	    // 보험 성향이 변액보험 부적합인 경우 무조건 부적합 보험계약 체결을 선택해야함
	    if ( "00" == gVAL.insCtrPrps && $('input[name=chkPerVar]:checked').val() != "1") {
	        dialog.alert(msg3);
	        return false;
	    }
	    

	    var dgrsClz = getDgrsClz(gVAL.insCtrPrps, gVAL.rcmInsPdt); // 변액적합성 위험성
																	// 등급
		
	    if (dgrsClz == 6) {
	    	dialog.alert('적합성진단 결과 위험회피형(6등급)인 경우</br>변액보험 청약이 불가합니다.');
			return false;
	    }
	    
	    /*
	     * 펀드코드 \ 위험 등급					1등급				2등급				3등급				4등급				5등급				6등급
	     * 									
	     * 버크셔TOP10[A02201]				O				O				X				X				X				X
	     * 인덱스성장형[U01501]					O				O				X				X				X				X
	     * AI글로벌다이나믹[A02101]				O				O				X				X				X				X
	     * AI글로벌멀티에셋[A01901]				O				O				O				X				X				X
	     * 글로벌AI플랫폼액티브형[A01401]		 	O				O				O				X				X				X
	     * 글로벌AI플랫폼밸런스형[A01501]			O				O				O				O				X				X
	     * 글로벌AI플랫폼세이프형[A01601]			O				O				O				O				O				X
	     * 글로벌밸런스멀티인컴형[A02401]			O				O				O				X				X				X
	     * 글로벌멀티에셋자산배분형[A01301]		    O				O				O				O				X				X
	     * 글로벌멀티에셋자산배분형3[A02301]		O				O				O				X				X				X
	     * 글로벌채권형[U01801]					O				O				O				X				X				X
	     * 채권형[U01101]						O				O				O				O				O				X
	     * MMF형[A02501]						O				O				O				O				O				O
	     */
	    
	    var IDX_A02201 = gDS["DS_FUND_INF"].findIndex( function(o){if(o.FDCD == "A02201" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_U01501 = gDS["DS_FUND_INF"].findIndex( function(o){if(o.FDCD == "U01501" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_A02101 = gDS["DS_FUND_INF"].findIndex( function(o){if(o.FDCD == "A02101" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_A01901 = gDS["DS_FUND_INF"].findIndex( function(o){if(o.FDCD == "A01901" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_A01401 = gDS["DS_FUND_INF"].findIndex( function(o){if(o.FDCD == "A01401" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_A01501 = gDS["DS_FUND_INF"].findIndex( function(o){if(o.FDCD == "A01501" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_A01601 = gDS["DS_FUND_INF"].findIndex( function(o){if(o.FDCD == "A01601" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_A02401 = gDS["DS_FUND_INF"].findIndex( function(o){if(o.FDCD == "A02401" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_A01301 = gDS["DS_FUND_INF"].findIndex( function(o){if(o.FDCD == "A01301" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_A02301 = gDS["DS_FUND_INF"].findIndex( function(o){if(o.FDCD == "A02301" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_U01801 = gDS["DS_FUND_INF"].findIndex( function(o){if(o.FDCD == "U01801" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_U01101 = gDS["DS_FUND_INF"].findIndex( function(o){if(o.FDCD == "U01101" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_A02501 = gDS["DS_FUND_INF"].findIndex( function(o){if(o.FDCD == "A02501" && o.FUND_INP_RTO != "0")return true;} );
	    
	    
	    // 버크셔TOP10
	    if (IDX_A02201 > -1) {
	    	if (3 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // 인덱스성장형
	    if (IDX_U01501 > -1) {
	    	if (3 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // AI글로벌다이나믹
	    if (IDX_A02101 > -1) {
	    	if (3 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // AI글로벌멀티에셋
	    if (IDX_A01901 > -1) {
	    	if (4 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // 글로벌AI플랫폼액티브형
	    if (IDX_A01401 > -1) {
	    	if (4 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // 글로벌AI플랫폼밸런스형
	    if (IDX_A01501 > -1) {
	    	if (5 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // 글로벌AI플랫폼세이프형
	    if (IDX_A01601 > -1) {
	    	if (6 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // 글로벌밸런스멀티인컴형
	    if (IDX_A02401 > -1) {
	    	if (4 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // 글로벌멀티에셋자산배분형
	    if (IDX_A01301 > -1) {
	    	if (5 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // 글로벌멀티에셋자산배분형3
	    if (IDX_A02301 > -1) {
	    	if (5 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // 글로벌채권형
	    if (IDX_U01801 > -1) {
	    	if (4 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // 채권형
	    if (IDX_U01101 > -1) {
	    	if (6 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
		
		return true;
	};

	/**
	 * 심사처리 통신 콜백
	 */
	function fnUdDlngCallback(remoteResult) {

		// =================== OUT DATASET ==============================
		// DS_UD_DM_MTT=dw_DmMtt" // DM사항(녹취번호)
		// DS_UD_DCLO_MTT=dw_DcloMtt" // DM사항(고지사항)
		// DS_UD_RSTM_MTT=dw_RstmMtt" // 부할사항
		// DS_UD_CTMN_MTT=dw_CtmnMtt" // 수금사항
		// DS_UD_INCT_INTP=dw_Inct_intp" // 계약관계자
		// DS_UD_HIS_MTT=dw_HisMtt" // 이력사항
		// DS_UD_ADR_MTT=dw_AdrMtt" // 주소사항
		// DS_UD_ADR_NEW_MTT=dw_AdrNewMtt" // 신주소사항
		// DS_UD_NTPRD=dw_Ntprd" // 가입상품
		// DS_UD_ORD_BY_NTPRD=dw_OrdByNtprd" // 회차별 가입상품
		// DS_UD_PREM_DC_INF=dw_PremDcInf" // 보험료활인정보(회차별)
		// DS_UD_DC_KNCD_INF=dw_DcKncdInf" // 할인내역
		// DS_UD_ANTY_MTT=dw_AntyMtt" // 연금사항
		// DS_UD_VAR_MTT=dw_VarMtt" // 변액사항
		// DS_UD_GN_PTCL=dw_GnPtcl" // 보장내역
		// DS_UD_GN_PTCL_ERR=dw_GnPtclErr" // 보장내역 에러
		// DS_UD_DIAG_PTCL=dw_DiagPtcl" // 추가진단내역
		// DS_UD_ATCD_DOC=dw_AtcdDoc" // 부속서류내역(보완내역)
		// DS_UD_ERR=dw_Err" // 에러코드
		// DS_UD_RLNMCFMT=DS_RLNMCFMT" // 실명확인
		// dw_calc_prem=dw_Calc_prem" // 보험료사항
		// dw_TgtDiagInf=dw_TgtDiagInf" // 진단대상정보
		// dw_AttCtrInf=dw_AttCtrInf" // 주의계약
		// dw_RenwPdtInf=dw_RenwPdtInf" // 갱신상품정보
		// dw_ChganoCtr=dw_ChganoCtr"; // 승환계약정보:20100119
				
		var mapDsName = {
			dw_DmMtt: 		'DS_UD_DM_MTT',   // 서버DS명 : '화면DS명'
			dw_DcloMtt: 	'DS_UD_DCLO_MTT',
			dw_RstmMtt: 	'DS_UD_RSTM_MTT',
			dw_CtmnMtt: 	'DS_UD_CTMN_MTT',
			dw_Inct_intp: 	'DS_UD_INCT_INTP',
			dw_HisMtt: 		'DS_UD_HIS_MTT',
			dw_AdrMtt: 		'DS_UD_ADR_MTT',
			dw_AdrNewMtt:	'DS_UD_ADR_NEW_MTT',
			dw_Ntprd: 		'DS_UD_NTPRD',
			dw_OrdByNtprd: 	'DS_UD_ORD_BY_NTPRD',
			dw_PremDcInf: 	'DS_UD_PREM_DC_INF',
			dw_DcKncdInf: 	'DS_UD_DC_KNCD_INF',
			dw_AntyMtt: 	'DS_UD_ANTY_MTT',
			dw_VarMtt: 		'DS_UD_VAR_MTT',
			dw_GnPtcl: 		'DS_UD_GN_PTCL',
			dw_GnPtclErr: 	'DS_UD_GN_PTCL_ERR',
			dw_DiagPtcl: 	'DS_UD_DIAG_PTCL',
			dw_AtcdDoc: 	'DS_UD_ATCD_DOC',
			dw_Err: 		'DS_UD_ERR',
			DS_RLNMCFMT: 	'DS_UD_RLNMCFMT',
			dw_Calc_prem: 	'dw_calc_prem',
			dw_DstnPxClmr: 	'DS_DSTN_PX_CLMR'
		};
		// 결과 DS 세팅
		fnSetGlobalDs(remoteResult.outDataSet, mapDsName);

		// FIXMNE: ? 단일파라미터 결과
		// gPARAM = $.extend({}, remoteResult.paramMap);
		$.extend(gPARAM, remoteResult.paramMap);	// inParams과 outParams
													// Extend
								
		// 심사에서 계산된 보험료를 다시 set (아래 납입보험료 사항 정보로 그냥 세팅하면 될듯한데... 일단 함..)
		fnSetPremCalcRst(gDS['DS_UD_NTPRD']);
		
		// 납입보험료사항 다시 SET
		gDS['DS_PREM_PYPRM'] = [{
			SMPRM: gPARAM.sSmtl_Prem,	// 1회보험료
			PDIADV: gPARAM.sPdiadv,		// 선납보험료
			ADPRM: gPARAM.sAd_Prem,		// 추가납입보험료
			DCAMT: gPARAM.sTot_Dc_Amt,	// 총할인액
			RLPY_AMT: gPARAM.sRlpy_Prem	// 실납입금액
		}];
		
		/*
		 * if(gDS['ds_NtprdMtt'][0].CRNC_KND == '1'){ // 달러보험
		 * $("#realPyprm").html(dcUtil.addCommas(maskUtil.round(gDS['DS_PREM_PYPRM'][0].RLPY_AMT,2)) + '<em>USD</em>'); //
		 * 할인후보험료 (실제납입금액) $("#realPyprmKnd").text('USD');
		 * 
		 * }else{
		 * $("#realPyprm").html(dcUtil.addCommas(gDS['DS_PREM_PYPRM'][0].RLPY_AMT) + '<em>원</em>'); //
		 * 할인후보험료 (실제납입금액) }
		 */

		// 심사 이후 위 내용을 처리하기 위한 로직. 기존 한 페이지에서 STEP 으로 변경되어 처리함.
		if(!stringUtil.isNull(gVAL.qttNo) && (gDS['DS_SUS_MAI_PRDCD'][0].PRDCD.substring(0,2) != "FI")){
			gVAL.g_remObj.realPyprm = gDS["DS_PREM_PYPRM"][0].RLPY_AMT;
		} else {
			gVAL.realPyprm = gDS["dw_calc_prem"][0].MHYPYM_STD_PREM;
		}
		
		gDS['DS_DIAG'] = [];
		
		var inptInfo = $.grep(gDS['DS_UD_INCT_INTP'], function(p){
			return !stringUtil.isNull(p.DIAG_CD) && '0' != p.DIAG_CD;
		});
		
		$.each(inptInfo, function(idx, row){
			gDS['DS_DIAG'].push({
				CTR_RLE_SECD	: row.INCT_INTPSCTN,
				CS_NAM			: row.CS_NAM,
				RRN				: row.RES_REG_NO,
				DIAG_CD			: row.DIAG_CD,
			});
		});

		var err = gDS["DS_UD_ERR"];
		var param = {
			data : err
			, title : '심사처리결과'
		};

		// ?? 뭔소리? :: 상품관계가 5인 종속(화면에 보여지지는 않지만 심사시 필요한)을 가입상품 설정이 끝난후 추가해 주시기
		// 위해서 복사해 놓는다.
		fnSetAdPdt(gDS['DS_UD_NTPRD']);

		if (Number(gPARAM.RLT_CD) > 0) {	// 전산심사 미통과시 -1 로 옴
			gVAL.udProcCd = '1';
// $("#btnNext").text("청약저장");
			// 청약저장 시작
			callSave();
		} else {
			// dialog.alert('[임시문구] 심사처리실패! 저장불가');
			gVAL.udProcCd = '0';
			dialog.openPopup('/www/html/view/dc/DC-0170L', param);
		}
	};


	/**
	 * 조회된 보험료 정보로 update (심사 후)
	 */
	function fnSetPremCalcRst(pDS) {
		// DS_NTPRD_MTT SET
		var smasdAmt, smasdUnt, premAmt, premUnt;
		var sumPrem = 0;	// 합계보험료
		
		// * 받아온 가입상품별 가입금액, 보혐료를 세팅 -----------------------
		$.each(pDS, function(idx, pRow){
			var mttRow = $.grep(gDS['DS_NTPRD_MTT'],function(p){if(p.PRDCD == pRow.PRDCD)return true;});
			
			if (mttRow.length > 0) {
				mttRow = mttRow[0];
				sumPrem += Number(dcUtil.amtDivUnt(pRow.CFINSU_PREM, mttRow.PREM_INP_AMT_UNT_COD));		// 합계보험료

				mttRow.SMASD = dcUtil.amtDivUnt(pRow.SMSU, mttRow.SMASD_INP_AMT_UNT_COD);		// 가입금액
				mttRow.PREM = dcUtil.amtDivUnt(pRow.CFINSU_PREM, mttRow.PREM_INP_AMT_UNT_COD);	// 상품별보험료
				mttRow.OYR_CONV = pRow.OYR_CONV; 		// 차년도환산
				mttRow.MHYPRE = pRow.MHYPRE; 			// 월납기준보험료
				mttRow.YY_STD_TRMINS = pRow.YEAR_INS; 	// 년기준보험기간
				mttRow.YY_STD_PYPD = pRow.YEAR_PYPD; 	// 년기준납입기간
				mttRow.CONVPRM = pRow.CONVPRM; 			// 환산보험료
				mttRow.YYFRS_CONV = pRow['SFA' == gVAL.reqSys ? 'CANP_CONV':'YYFRS_CONV'];	// 초년도환산
			}
		});
		
		gVAL.maiPrdcdPremModYn = '0';	// 주상품보험료수정여부 - 수정하지않음

		// * 할인보험료 후 보험료 계산 및 세팅 ----------------
		var dcAmt = 0, dcAmt2 = 0;	// 다자녀할인
		var kncd3 = $.grep(gDS['DS_UD_DC_KNCD_INF'],function(p){if( '3' == p.DC_KNCD)return true;})[0];
		
		if (kncd3) dcAmt = Number(kncd3.DC_AMT) || 0;
		var kncd15 = $.grep(gDS['DS_UD_DC_KNCD_INF'], function(p){if('15' == p.DC_KNCD)return true;})[0];
		
		if (kncd15) dcAmt2 = Number(kncd15.DC_AMT) || 0;
		
		/*
		 * if(gDS['ds_NtprdMtt'][0].CRNC_KND =='1'){ //달러보험
		 * $('#mhypymStdprm').html(dcUtil.addCommas(maskUtil.round(gDS["dw_calc_prem"][0].MHYPYM_STD_PREM,2)) + "<em>USD</em>"); //
		 * 월납기준 보험료 $('#mhypymStdprmKnd').text('USD'); }else{
		 * $('#mhypymStdprm').html(dcUtil.addCommas(gDS["dw_calc_prem"][0].MHYPYM_STD_PREM) + "<em>원</em>"); //
		 * 월납기준 보험료 }
		 */
		// 심사 이후 위 내용을 처리하기 위한 로직. 기존 한 페이지에서 STEP 으로 변경되어 처리함.
		if(!stringUtil.isNull(gVAL.qttNo)){
			if("FI" != gDS["DS_UD_NTPRD"][0].PRDCD.substring(0,2)){
				gVAL.g_remObj.CRNC_KND = gDS['ds_NtprdMtt'][0].CRNC_KND;
				gVAL.g_remObj.mhypymPrem = gDS["dw_calc_prem"][0].MHYPYM_STD_PREM;
			}else{
				
			}
			
			
		} else {
			gVAL.mhypymStdprm = gDS["dw_calc_prem"][0].MHYPYM_STD_PREM;
		}
	};
	
	function setHealthC() {
	    var healthYn = $("[name=rdoHealth]:checked").val();
	    
	    $.grep(gDS["DS_UD_NTPRD"], function(objTmp){if(objTmp.GDS_SECD == "1"){return true; } })[0]
	    var fRow = $.map(gDS["DS_UD_NTPRD"], function(objTmp, index){if(objTmp.GDS_SECD == "1"){return index; }})[0];
	    var maiSmsu = gDS["DS_UD_NTPRD"][fRow].SMSU;
	    var maiPrdcd = gDS["DS_UD_NTPRD"][fRow].PRDCD;
	    var cfinsuPrem = gDS["DS_UD_NTPRD"][fRow].CFINSU_PREM;
	    var jgSmsu = "0";
	    if (healthYn == "0") {
	    	if(!stringUtil.isNull(gDS['ds_HealthMtt'])){
		    	var pdtPculDtlcd = gDS['ds_HealthMtt'][0].PDT_PCUL_DTLCD;
		        if (pdtPculDtlcd == "2") {
		            for (var i = 0; i < gDS["DS_UD_NTPRD"].length; i++) {
		                if (gDS["DS_UD_NTPRD"][i].PRDCD == "102909") {
		                    jgSmsu = gDS["DS_UD_NTPRD"][i].SMSU;
		                    break;
		                }
		            }
		            if (parseInt(maiSmsu) + parseInt(jgSmsu) < 100000000) {
		                dialog.alert("주계약과 정기특약의 가입금액 합계가 1억원 미만인 경우 헬스케어 서비스를 신청할 수 없습니다.");
		                return false;
		            }
		        }
		        if (pdtPculDtlcd == "4") {
		            if (parseInt(maiSmsu) < 100000000) {
		                dialog.alert("주계약이 1억원 미만인 경우 헬스케어 서비스를 신청할 수 없습니다.");
		                return false;
		            }
		        }
		        if (pdtPculDtlcd == "5") {
		            if (parseInt(maiSmsu) < 50000000) {
		                dialog.alert("주계약이 5천만원 미만인 경우 헬스케어 서비스를 신청할 수 없습니다.");
		                return false;
		            }
		        }
		        if (pdtPculDtlcd == "6") {
		            if (parseInt(maiSmsu) < 40000000) {
		                dialog.alert("주계약이 4천만원 미만인 경우 헬스케어 서비스를 신청할 수 없습니다.");
		                return false;
		            }
		        }
		        if (pdtPculDtlcd == "7") {
		            if (parseInt(maiSmsu) < 30000000) {
		                dialog.alert("주계약이 3천만원 미만인 경우 헬스케어 서비스를 신청할 수 없습니다.");
		                return false;
		            }
		        }
		        if (pdtPculDtlcd == "10") {
		            if (parseInt(cfinsuPrem) < 300000) {
		                dialog.alert("월납 기본보험료 30만원 미만인 경우 헬스케어 서비스를 신청할 수 없습니다.");
		                return false;
		            }
		        }
	    	}
	    }
	    
	    return true;
	};


	/**
	 * 심사, 저장 통신 in DS를 세팅함
	 */
	function fnSetUdDsDefault(opCode) {

		var rtnDs = {};

		var dsNmSet = {
			"dw_DmMtt": "DS_UD_DM_MTT",				// DM사항(녹취번호)
			"dw_DcloMtt": "DS_UD_DCLO_MTT",			// DM사항(고지사항)
			"dw_RstmMtt": "DS_UD_RSTM_MTT",			// 부활사항
			"dw_CtmnMtt": "DS_UD_CTMN_MTT",			// 수금사항
			"dw_Inct_intp": "DS_UD_INCT_INTP",		// 계약관계자
			"dw_AdrMtt": "DS_UD_ADR_MTT",			// 주소사항
			"dw_AdrNewMtt": "DS_UD_ADR_NEW_MTT",	// 신주소사항
			"dw_Ntprd": "DS_UD_NTPRD",				// 가입상품
			"dw_PremDcInf": "DS_UD_PREM_DC_INF",	// 보험료할인정보
			"dw_AntyMtt": "DS_UD_ANTY_MTT",			// 연금사항
			"dw_VarMtt": "DS_UD_VAR_MTT"	,		// 변액사항
			"dw_DstnPxClmr": "DS_DSTN_PX_CLMR"		// 지정대리청구인
				
		};

		switch (opCode) {

			case 'EXE':		// 심사
				$.extend(dsNmSet, { "dw_VarNtryPrpsInf": "DS_VAR_FIT_DIAG" });	// 변액투자적합정보
				break;

			case 'SAV':		// 저장
				$.extend(dsNmSet, {
					"dw_HisMtt": "DS_UD_HIS_MTT",					// 이력사항
					"dw_OrdByNtprd": "DS_UD_ORD_BY_NTPRD",			// 회차별 가입상품
					"dw_DcKncdInf": "DS_UD_DC_KNCD_INF",			// 할인내역
					"dw_GnPtcl": "DS_UD_GN_PTCL",					// 보장내역
					"dw_DiagPtcl": "DS_UD_DIAG_PTCL",				// 추가진단내역
					"dw_AtcdDoc": "DS_UD_ATCD_DOC",					// 부속서류내역(보완내역)
					"dw_calc_prem": "dw_calc_prem",					// 보험료사항
					"dw_TgtDiagInf": "dw_TgtDiagInf",				// 진단대상정보
					"DS_RLNMCFMT": "DS_UD_RLNMCFMT",		    	// 실명확인
					"dw_AttCtrInf": "dw_AttCtrInf",					// 주의계약
					"dw_RenwPdtInf": "dw_RenwPdtInf",				// 갱신상품정보
					"dw_ChganoCtr": "dw_ChganoCtr",					// 승환계약정보
					"dw_VarNtryPrpsInf": "DS_VAR_FIT_DIAG", 		// 변액 투자 적합성
																	// 진단 정보
					"dw_DstnPxClmr": "DS_DSTN_PX_CLMR",				// 지정대리청구인정보
					"ds_SusAntyAdInf": "ds_SusAntyAdInf",			// 청약연금가산정보
				});
				break;
		}

		/**
		 * getColInfoForCopyArrayRow 로 각 DS의 기본 속성세팅을 가져와 앞에서 세팅한 gDS[DS이름]에 빠진
		 * 기본속성을 추가하고 ""으로 값을 세팅한다.
		 * 
		 * gDS[DS이름]가 빈배열이면, 기본속성 row object를 하나 추가하고 추가한 row에 empty: "ture" 속성을
		 * 추가한다. => 이렇게 해야 서버단에서 DataWindow를 생성할때 기본속성 정보를 토대로 column정보를 세팅한다.
		 */
		var infoArr = [];
		$.each(dsNmSet, function(key, value){
			infoArr.push({
				newDsNm: key,
				dataDs: gDS[value],
				colInfo: susDsUdCol.getColInfoForCopyArrayRow(value)
			});
		});
		
		debugger;
		
		var dataDs = [];
		var dataDsLen = 0;
		var colInfo = '';
		$.each(infoArr, function(idx, item){
			dataDs = item.dataDs;
			dataDsLen = stringUtil.isNull(item.dataDs)? 0 : item.dataDs.length;
			colInfo = item.colInfo;
			var tempArr = [];
			if (dataDsLen > 0) {
				for (var i = 0; i < dataDsLen; i++) {
					dcUtil.copyArrayRow(tempArr, i, dataDs, i, {strColInfo: colInfo});
				}
			} else {
				/**
				 * 데이터가 없는 DS (빈배열 []) 는 첫번째 row에 컬럼정보와 empty:"true" 속성을 넣어줘야
				 * 서버에서 컬럼정보를 생성해 준다. => 컬럼정보가 필요한 처리가 있어 컬럼정보생성이 안되면 런타임에러가 난다.
				 */
				tempArr = [{}];
				dcUtil.copyArrayRow(tempArr, 0, [{}], 0, {strColInfo: colInfo});
				if (tempArr.length > 0) {
					tempArr[0].empty = 'true';
				}
			}
			rtnDs[item.newDsNm] = tempArr;
		});

		return rtnDs;
	};


	/**
	 * 변액투자적합정보 구성
	 */
	function setVarNtryPrpsInf() {
		var inctData = $.grep(gDS['DS_UD_INCT_INTP'], function(p){if('11' == p.INCT_INTPSCTN)return true;} )[0];
		
		var csPk = inctData.CHN_CSID;
		var csNam = inctData.CS_NAM;
		var csnum = inctData.RES_REG_NO;

		if (gDS['DS_MAI_INF'].length > 0 && !stringUtil.isNull(gDS['DS_MAI_INF'][0].PLYNO)) {
			var data1 = $.grep(gDS['INS_DS_VAR_FIT_DIAG'], function(p){
				return csPk == p.CS_PK && csNam == p.CS_NAM && csnum == p.CSNUM;
			});
			
			if (data1.length > 0) {
				gDS['DS_VAR_FIT_DIAG'] = $.extend([], data1);
			} else {
				var data2 = $.grep(gDS['INS_DS_VAR_FIT_DIAG'], function(p){
					return csPk == p.CHN_CS_PK && csNam == p.CS_NAM && csnum == p.CSNUM;
				});
				gDS['DS_VAR_FIT_DIAG'] = $.extend([], data2);
			}
		} else {
			var data3 = $.grep(gDS['INS_DS_VAR_FIT_DIAG'], function(p){
				return csPk == p.CHN_CS_PK && csNam == p.CS_NAM && csnum == p.CSNUM;
			});
			gDS['DS_VAR_FIT_DIAG'] = $.extend([], data3);
		}
	};


	/**
	 * 심사, 저장용 고지사항 SET
	 * 종피(31)있으면 종피도 setting
	 */
	function setUdDcloMtt() {

		var ctrRleSecd = '';
		var sDcloSntCod = '';
		var sDcloAnswCod = '';		
		debugger;
		var csPk2Data = $.grep(gDS['DS_CTR_INTP_MTT_LIST'], function(p){
			'2' == p.CS_PK;
		})
		ctrRleSecd = csPk2Data.length > 0 ? csPk2Data.CTR_RLE_SECD : '21';
		
		if (gDS['ds_PregnMtt'].length > 0) {
			sDcloSntCod = gDS['ds_PregnMtt'][0].DCLO_SNT_COD;
			var arr = $.grep(gDS['ds_DcloMtt'], function(p){if(sDcloSntCod == p.DCLO_SNT_COD)return true;});
			
			if (arr.length > 0) {
				$.each(arr, function(idx, row){
					if ('N' == row.DCLO_ANSW_COD_NAM) {
						sDcloAnswCod = row.DCLO_ANSW_COD;
					}
				});
			}
		}

		gDS['DS_UD_DCLO_MTT'] = [{
			"CTR_RLE_SECD": ctrRleSecd,
			"DCLO_SNT_COD": sDcloSntCod,
			"DCLO_ANSW_COD": sDcloAnswCod,
			"DCLO_ANSW_CTT": "N"
		}];
		
		//종피31추가
		if(gVAL["jongpiYn"]) {
			gDS['DS_UD_DCLO_MTT'].push({
				"CTR_RLE_SECD": "31",
				"DCLO_SNT_COD": sDcloSntCod,
				"DCLO_ANSW_COD": sDcloAnswCod,
				"DCLO_ANSW_CTT": "N"
			});
		}
	};

	
	/**
	 * 심사, 저장용 운용옵션정보 세팅
	 * 
	 * @returns 운용옵션정보 array
	 */
	function getUdFndOption() {

		var golYn = '';
		var golPrfr = '';
		var ret = new Array(5);
		
		ret[0] = '1';							// 정상여부
		ret[1] = gData.cmbAutReDst; 		// 자동제분배
		ret[2] = gData.cmbAvgPtilIvst; 	// 평균분할투자
				
		if ('1' == gDS['ds_ProdtTypeMtt'][0].GOL_PRFR_YN) {		// 목표수익율신청여부 -
																// 신청
			golPrfr = gData.cmbGolPrfr;
			if (stringUtil.isNull(golPrfr)) {
				dialog.alert('목표수익율 정보가 없습니다.');
				ret[0] = '-1'; // 정상여부
			} else {
				ret[3] = '1';
				ret[4] = golPrfr; 	// 목표수익율
			}		
		} else {
			ret[3] = '0';
			ret[4] = '';
		}
		
		return ret;
	};

	
	function getUd_varMtt(a_ds) {
	    var DS_OBJ;

	    if (gDS["ds_ProdtTypeMtt"][0].PDT_ATRB_COD != "J") {
	        return true;
	    }

	    if ($.grep(gDS["DS_FUND_INF"], function(objTmp){if(objTmp.CHK == 1){return true; } }).length <= 0) {
	        dcUtil.g_showMessage("CCCE0043", "펀드를");
	        return false;
	    }
	    if (stringUtil.isNull(a_ds)) {
	        DS_OBJ = gDS["DS_UD_VAR_MTT"];
	    } else {
	        DS_OBJ = (a_ds instanceof Array) ? a_ds : gDS[a_ds];
	    }
	    DS_OBJ =[];
	    var cnt, nRow;
	    var rto = 0;
	    var sumRto = 0;
	    cnt = gDS["DS_FUND_INF"].length;
	    for (var i = 0; i < cnt; i++) {
	        if (gDS["DS_FUND_INF"][i].CHK == "1") {
	            var ret = parseInt(gDS["DS_FUND_INF"][i].FUND_INP_RTO);
	            if (stringUtil.isNull(ret) || ret <= 0) {
	                dcUtil.g_showMessage("CCCE0073", "");
	                return false;
	            }
	            sumRto += ret;
	            DS_OBJ.push({});
	            nRow = DS_OBJ.length -1;
	            DS_OBJ[nRow].PRDCD =  gDS["DS_FUND_INF"][i].PRDCD;
	            DS_OBJ[nRow].FDCD =  gDS["DS_FUND_INF"][i].FDCD;
	            DS_OBJ[nRow].FUND_NAM =  gDS["DS_FUND_INF"][i].FUND_NAM;
	            DS_OBJ[nRow].FUND_INF_SEQNO =  i + 1;
	            DS_OBJ[nRow].FUND_SECD =  gDS["DS_FUND_INF"][i].FUND_SECD;
	            DS_OBJ[nRow].FUND_INP_RTO =  ret;
	        }
	    }
	 	if (sumRto != 100) {
	        dcUtil.g_showMessage("CCCE0042", "");
	        DS_OBJ = [];
	        return false;
	    }
	    if(DS_OBJ.length > 0) {
	        gVAL.RE_SHAR 		= gData.cmbAutReDst == ""? "0": gData.cmbAutReDst;
	        gVAL.AVG_PTIL_IVSG 	= gData.cmbAvgPtilIvst == ""? "0": gData.cmbAvgPtilIvst;
	        gVAL.ADPRM_INCN_YN 	= gData.chkAdprmYn == ""? "0": gData.chkAdprmYn;
	        gVAL.GOL_PRFR 		= "";
	    }


	    if (stringUtil.isNull(a_ds)) {

	        gDS["DS_UD_VAR_MTT"] = DS_OBJ;
	    } else {
	        (a_ds instanceof Array) ? a_ds = DS_OBJ : gDS[a_ds] = DS_OBJ;
	    }

	    return true;
	};


	/**
	 * 심사,저장용 연금사항 SET
	 */
	function setUdAntyMtt() {
		// DS_UD_ANTY_MTT 세팅

		$.each(gDS['DS_ANTY_MTT'], function(idx, row){
			gDS['DS_UD_ANTY_MTT'].push({
				"ANTY_OPYMD"					: "",								// 연금개시일자
				"ASAG"							: "",								// 연금개시연령
				"ANTY_DFR_TYP_COD"				: row.ANTY_DFR_TYP_COD,   			// 연금지급유형코드
				"INDTY_CPLTYP_SECD"				: row.INDTY_CPLTYP_SECD,  			// 개인형
																					// 부부형
																					// 구분
																					// 코드
				"ANTY_DFR_CYCL_COD"				: row.ANTY_DFR_CYCL_COD,  			// 연금지급주기
				"ANTY_GUA_PRID_COD"				: row.ANTY_GUA_PRID_COD,  			// 연금보증기간
				"ANTY_CRTN_PRID_COD"			: row.ANTY_CRTN_PRID_COD, 			// 연금확정기간
				"ANTY_GI_PRID_COD"				: row.ANTY_GI_PRID_COD,   			// 연금체증기간
				"ANTY_GI_FORM_COD"				: row.ANTY_GI_FORM_COD,   			// 연금체증형태
				"ANTY_GRICRT_COD"				: row.ANTY_GRICRT_COD,	   			// 체증율
				"ANTY_RFD_RTO"					: row.ANTY_RFD_RTO, 	   			// 연급지급비율
				"PRDCD"							: row.PRDCD, 	   					// 상품코드
				"ERSTA_CNTRL_TYP_GN_MUL_COD"	: row.ERSTA_CNTRL_TYP_GN_MUL_COD,	// 조기집중형보장배수
			});
		});
	};


	/**
	 * 입금방법 설정 :: PatWageInfo / setForm_CtmnMtt, setUd_CtmnMtt
	 * 
	 * @description 가입설계 -> 청약입력 :: 확정시처리 상태의 데이터로 DS를 세팅 청약진행현황 -> 청약입력 ::
	 *              전차청약에서 입력했던 데이터를 DS에 세팅
	 */
	function setUdCtmnMtt() {
		// DS_UD_CTMN_MTT 세팅
		var susCtmnData = gDS['DS_SUS_CTMN'];	// 조회된 수금사항 정보

		/* check */
		/*
		 * susCtmnData 값이 없을 때는 default 값으로 세팅 [가설 - 청약 으로 접근시 전자청약 전 ]
		 */
		if(stringUtil.isNull(susCtmnData)){

			/* 초회 입금방법 */
			gDS["DS_UD_CTMN_MTT"].push({});
			var nRow =  gDS["DS_UD_CTMN_MTT"].length-1	;
			gDS["DS_UD_CTMN_MTT"][nRow].CS_CTR_ACT_PK 		= 		"";
			gDS["DS_UD_CTMN_MTT"][nRow].CS_CTR_CRDCR_PK 	= 		"";
			gDS["DS_UD_CTMN_MTT"][nRow].ACT_PK 				= 		"";
			gDS["DS_UD_CTMN_MTT"][nRow].CRDCR_PK 			= 		"";
			gDS["DS_UD_CTMN_MTT"][nRow].SUS_CTMN_SECD 		= 		"1";
			gDS["DS_UD_CTMN_MTT"][nRow].CTMN_METD_COD 		= 		"13";
			gDS["DS_UD_CTMN_MTT"][nRow].CRTN_CTY_DLNG_YN 	= 		"1";
			gDS["DS_UD_CTMN_MTT"][nRow].CASH_SECD 			= 		"";
			gDS["DS_UD_CTMN_MTT"][nRow].INST_MTCNT 			= 		"";
			gDS["DS_UD_CTMN_MTT"][nRow].TRSF_HPDY 			= 		"";
			gDS["DS_UD_CTMN_MTT"][nRow].VALD_PRID 			= 		"";
			gDS["DS_UD_CTMN_MTT"][nRow].ACT_USGE_SECD 		= 		"1";
			gDS["DS_UD_CTMN_MTT"][nRow].CTMN_SAME_COD 		= 		"";
			gDS["DS_UD_CTMN_MTT"][nRow].OWAC_CRDCO 			= 		"";
			gDS["DS_UD_CTMN_MTT"][nRow].OWAC_RES_REG_NO 	= 		"";
			gDS["DS_UD_CTMN_MTT"][nRow].ACTNUM_CARDNUM 		= 		"";
			gDS["DS_UD_CTMN_MTT"][nRow].HOFC_COD 			= 		"";
			gDS["DS_UD_CTMN_MTT"][nRow].PY_TRSF_EMPNO 			= 		"";
			

			/* 계속수금방법 */
			if(gDS["DS_NTPRD_MTT"][0].PYPD != "0"){ // 일시납일 경우만
				gDS["DS_UD_CTMN_MTT"].push({});
				nRow =  gDS["DS_UD_CTMN_MTT"].length-1	;
				gDS["DS_UD_CTMN_MTT"][nRow].CS_CTR_ACT_PK 		= 		"";
				gDS["DS_UD_CTMN_MTT"][nRow].CS_CTR_CRDCR_PK 	= 		"";
				gDS["DS_UD_CTMN_MTT"][nRow].ACT_PK 				= 		"";
				gDS["DS_UD_CTMN_MTT"][nRow].CRDCR_PK 			= 		"";
				gDS["DS_UD_CTMN_MTT"][nRow].SUS_CTMN_SECD 		= 		"2";
				
				if(gVAL.fcYN){	// 설계사가 존재하면
					gDS["DS_UD_CTMN_MTT"][nRow].CTMN_METD_COD 		= 		"30"; 	// 급여이체
					gDS["DS_UD_CTMN_MTT"][nRow].ACT_USGE_SECD 		= 		"";
					gDS["DS_UD_CTMN_MTT"][nRow].CRTN_CTY_DLNG_YN 	= 		"";		// 확정시
																					// 처리
																					// 여부
					
				}else{			// 설계사가 존재하지 않으면
					gDS["DS_UD_CTMN_MTT"][nRow].CTMN_METD_COD 		= 		"20"; // 자동이체
					gDS["DS_UD_CTMN_MTT"][nRow].ACT_USGE_SECD 		= 		"5";
					gDS["DS_UD_CTMN_MTT"][nRow].CRTN_CTY_DLNG_YN 	= 		"1";// 확정시
																				// 처리
																				// 여부
				}
				
				gDS["DS_UD_CTMN_MTT"][nRow].CRTN_CTY_DLNG_YN 	= 		"1";
				gDS["DS_UD_CTMN_MTT"][nRow].CASH_SECD 			= 		"";
				gDS["DS_UD_CTMN_MTT"][nRow].INST_MTCNT 			= 		"";
				gDS["DS_UD_CTMN_MTT"][nRow].TRSF_HPDY 			= 		"";
				gDS["DS_UD_CTMN_MTT"][nRow].VALD_PRID 			= 		"";
				gDS["DS_UD_CTMN_MTT"][nRow].CTMN_SAME_COD 		= 		"";
				gDS["DS_UD_CTMN_MTT"][nRow].OWAC_CRDCO 			= 		"";
				gDS["DS_UD_CTMN_MTT"][nRow].OWAC_RES_REG_NO 	= 		"";
				gDS["DS_UD_CTMN_MTT"][nRow].ACTNUM_CARDNUM 		= 		"";
				gDS["DS_UD_CTMN_MTT"][nRow].HOFC_COD 			= 		"";
			}


			return ; 
		}

		
		// 약관대출입금수금구분코드 => 1: 초회, 2: 계속, '': 약관대출정보없음
		var nCtmnSameCod = stringUtil.isNull(susCtmnData) ? '' : susCtmnData[0].CTMN_SAME_COD;
		// 주계약자 이름, 주민번호 정보
		var polData = $.grep(gDS['DS_CTR_INTP_MTT_LIST'], function(p){if('11' == p.CTR_RLE_SECD)return true;})[0];
		
		gVAL.crtnCsNam = polData.CS_NAM;	// 이름
		gVAL.ctrnCsRrn = polData.RRN;		// 주민번호
		
		/**
		 * DS_UD_CTMN_MTT 에 push 할 수금사항 저장, 심사 데이터 이 기본 밑바탕에 업데이트 할 정보만 이 함수를 불러
		 * 세팅함
		 */ 
		var addRow = {
			CS_CTR_ACT_PK: '',		// 고객계약계좌 고유번호
			ACT_PK: '',				// 고객계좌고유번호
			CS_CTR_CRDCR_PK: '',	// 고객계약카드 고유번호
			CRDCR_PK: '',			// 고객신용카드고유번호
			SUS_CTMN_SECD: '',		// 수금대상코드
			CTMN_METD_COD: '',		// 수금방법코드
			CRTN_CTY_DLNG_YN: '',	// 확정처리시여부
			CASH_SECD: '',			// 현금구분
			INST_MTCNT: '',			// 할부개월수
			TRSF_HPDY: '',			// 이체희망일
			VALD_PRID: '',			// 유효기간
			OWAC_CS_RLP_SECD: '',	// 예금(소유)주고객관계
			ACT_USGE_SECD: '',		// 계좌의용도
			CTMN_SAME_COD: '',		// 약대입금수금구분코드
			OWAC_CRDCO: '',			// 소유주
			OWAC_RES_REG_NO: '',	// 주민번호
			ACTNUM_CARDNUM: '',		// 계좌번호(카드번호)
			PY_TRSF_EMPNO: '', 
			HOFC_COD: ''			// 은행코드(카드코드)

		};
		
		// * 1 초회입금
		// ================================================================================
		var srcFdData = $.grep(susCtmnData, function(p){if('1' == p.SUS_CTMN_SECD)return true;})[0];	// 초회입금정보
		
		if (!stringUtil.isNull(srcFdData)) {

			var fdRow = $.extend({}, addRow);	// 초회입금 Base data row
			var fdCtmnRow = {};					// 초회입금-약관대출 Base data row

			fdRow.SUS_CTMN_SECD 	= '1';
			fdRow.CRTN_CTY_DLNG_YN 	= srcFdData.CRTN_CTY_DLNG_YN;
			fdRow.CTMN_SAME_COD 	= nCtmnSameCod;

			fdRow.CTMN_METD_COD 	= srcFdData.CTMN_METD_COD;
			fdRow.OWAC_CS_RLP_SECD 	= '1';

			// 수금방법에 따라 세팅 분기 처리
			switch (srcFdData.CTMN_METD_COD) {

				// 방문 -------------------------------------
				case '11':	
					fdRow.CASH_SECD = srcFdData.CASH_SECD;
					break;
				
				// 실시간인출, 이체 --------------------------
				case '13': case '20':

					fdRow.OWAC_CS_RLP_SECD 	= srcFdData.OWAC_CS_RLP_SECD;
					fdRow.ACT_USGE_SECD 	= '1';

					if ('1' != srcFdData.CRTN_CTY_DLNG_YN) {  // 확정시처리가 아닐 경우
						fdRow.ACT_PK 			= srcFdData.ACT_PK;
						fdRow.CS_CTR_ACT_PK 	= srcFdData.CS_CTR_ACT_PK;
						fdRow.OWAC_CRDCO 		= srcFdData.OWAC_NAM || gVAL.crtnCsNam;
						fdRow.OWAC_RES_REG_NO 	= srcFdData.OWAC_RBRNO || gVAL.ctrnCsRrn;
						fdRow.ACTNUM_CARDNUM 	= srcFdData.ACTNUM;
						fdRow.HOFC_COD 			= srcFdData.ACT_PBLS_BANK_COD;
						
						// 약관대출정보입금수금정보 추가
						if ('1' == nCtmnSameCod) {
							fdCtmnRow = $.extend({}, addRow);	// 초회입금-약관대출
																// Base data row
							fdCtmnRow.SUS_CTMN_SECD 	= '4';
							fdCtmnRow.CTMN_METD_COD 	= srcFdData.CTMN_METD_COD;
							fdCtmnRow.ACT_PK 			= srcFdData.ACT_PK;
							fdCtmnRow.TRSF_HPDY 		= srcFdData.ACT_USE_DY;
							fdCtmnRow.OWAC_CS_RLP_SECD 	= srcFdData.OWAC_CS_RLP_SECD;
							fdCtmnRow.ACT_USGE_SECD		= '10';
							fdCtmnRow.CS_CTR_ACT_PK 	= srcFdData.CS_CTR_ACT_PK;
							fdCtmnRow.OWAC_CRDCO 		= srcFdData.OWAC_NAM || gVAL.crtnCsNam;
							fdCtmnRow.OWAC_RES_REG_NO 	= srcFdData.OWAC_RBRNO || gVAL.ctrnCsRrn;
							fdCtmnRow.ACTNUM_CARDNUM 	= srcFdData.ACTNUM;
							fdCtmnRow.HOFC_COD 			= srcFdData.ACT_PBLS_BANK_COD;
						}
					}

					break;

				// 카드납입 ----------------------------
				case '14': 

					if ('1' != srcFdData.CRTN_CTY_DLNG_YN) {  // 확정시처리 아닌 경우
						fdRow.CRDCR_PK 			= srcFdData.CRDCR_PK;
						fdRow.INST_MTCNT 		= srcFdData.INST_MTCNT;
						fdRow.TRSF_HPDY 		= dateUtil.getDate().substring(6);
						fdRow.VALD_PRID 		= srcFdData.CARD_VALD_PRID;
						fdRow.OWAC_CS_RLP_SECD 	= '1';
						fdRow.ACT_USGE_SECD 	= '2';
						fdRow.CTMN_SAME_COD	 	= nCtmnSameCod;
						fdRow.CS_CTR_CRDCR_PK 	= srcFdData.CS_CTR_CRDCR_PK;
						fdRow.OWAC_CRDCO 		= srcFdData.OWAC_NAM || gVAL.crtnCsNam;
						fdRow.OWAC_RES_REG_NO 	= srcFdData.OWAC_RBRNO || gVAL.ctrnCsRrn;
						fdRow.ACTNUM_CARDNUM 	= srcFdData.CRCDNO;
						fdRow.HOFC_COD 			= srcFdData.CRDCR_PK;
					}

					break;

			} // 초회입금정보 switch END
			
			// 세팅된 초회입금정보로 update
			gDS['DS_UD_CTMN_MTT'].push(fdRow);	
			if (!$.isEmptyObject(fdCtmnRow)) {
				gDS['DS_UD_CTMN_MTT'].push(fdCtmnRow);	
			}

		} // 초회입금 if END


		// * 2 계속수금
		// ================================================================================
		var srcCdData = $.grep(susCtmnData, function(p){if('2' == p.SUS_CTMN_SECD)return true;})[0];	// 계속수금정보
		
		if (!stringUtil.isNull(srcCdData)) {

			var cdRow = $.extend({}, addRow);	// 계속수금 Base data row
			var cdCtmnRow = {};					// 계속수금-약관대출 Base data row
					
			cdRow.SUS_CTMN_SECD = '2';
			cdRow.CRTN_CTY_DLNG_YN 	= srcCdData.CRTN_CTY_DLNG_YN;
			cdRow.CTMN_SAME_COD = nCtmnSameCod;
			cdRow.CTMN_METD_COD = srcCdData.CTMN_METD_COD;

			// 수금방법에 따라 세팅 분기 처리
			switch (srcCdData.CTMN_METD_COD) {

				// 실시간인출, 이체 ---------------------------------
				case "13": case "20":	

					cdRow.OWAC_CS_RLP_SECD 	= srcCdData.OWAC_CS_RLP_SECD || '1';
					cdRow.ACT_USGE_SECD 	= '5';
					if ('1' != srcCdData.CRTN_CTY_DLNG_YN) {  	// 확정시처리가 아닐 경우
						cdRow.ACT_PK 			= srcCdData.ACT_PK;
						cdRow.TRSF_HPDY 		= srcCdData.ACT_USE_DY;
						cdRow.CS_CTR_ACT_PK 	= srcCdData.CS_CTR_ACT_PK;
						cdRow.OWAC_CRDCO 		= srcCdData.OWAC_NAM || gVAL.crtnCsNam;
						cdRow.OWAC_RES_REG_NO 	= srcCdData.OWAC_RBRNO || gVAL.ctrnCsRrn;
						cdRow.ACTNUM_CARDNUM 	= srcCdData.ACTNUM;
						cdRow.HOFC_COD 			= srcCdData.ACT_PBLS_BANK_COD;

						// 약관대출정보입금수금정보 추가
						if ('2' == nCtmnSameCod) {
							cdCtmnRow = $.extend({}, addRow);	// 계속입금-약관대출
																// Base data row
							cdCtmnRow.SUS_CTMN_SECD 	= '4';	    						// 수금대상코드
							cdCtmnRow.CTMN_METD_COD 	= srcCdData.CTMN_METD_COD;			// 수금방법코드
							cdCtmnRow.ACT_PK 			= srcCdData.ACT_PK;				// 고객계좌고유번호
							cdCtmnRow.TRSF_HPDY 		= srcCdData.ACT_USE_DY;	// 이체희망일
							cdCtmnRow.OWAC_CS_RLP_SECD 	= srcCdData.OWAC_CS_RLP_SECD || '1';		// 예금(소유)주고객관계(본인)
							cdCtmnRow.ACT_USGE_SECD		= '10';							// 계좌의용도(기타)
							cdCtmnRow.CS_CTR_ACT_PK 	= srcCdData.CS_CTR_ACT_PK;				// 고객계약계좌
																								// 고유번호
							cdCtmnRow.OWAC_CRDCO 		= srcCdData.OWAC_NAM || gVAL.crtnCsNam;		// 소유주
							cdCtmnRow.OWAC_RES_REG_NO 	= srcCdData.OWAC_RBRNO || gVAL.ctrnCsRrn;	// 주민번호
							cdCtmnRow.ACTNUM_CARDNUM 	= srcCdData.ACTNUM;						// 계좌번호_카드번호
							cdCtmnRow.HOFC_COD 			= srcCdData.ACT_PBLS_BANK_COD;			// 은행코드_카드코드
						}
					}

					break;
					
				// 카드납입 --------------------------------
				case "14": 

					cdRow.OWAC_CS_RLP_SECD = srcCdData.OWNR_CS_RLP_SECD || '1';
					if ('1' != srcCdData.CRTN_CTY_DLNG_YN) {  	// 확정시처리가 아닌 경우
						cdRow.CRDCR_PK 			= srcCdData.CRDCR_PK;
						cdRow.INST_MTCNT 		= srcCdData.INST_MTCNT;
						cdRow.TRSF_HPDY 		= srcCdData.CRDCR_USE_DY;
						cdRow.VALD_PRID 		= srcCdData.CARD_VALD_PRID;
						cdRow.ACT_USGE_SECD 	= '7';
						cdRow.CS_CTR_CRDCR_PK 	= srcCdData.CS_CTR_CRDCR_PK;
						cdRow.OWAC_CRDCO 		= srcCdData.OWNR_NAM || gVAL.crtnCsNam;
						cdRow.OWAC_RES_REG_NO 	= srcCdData.OWAC_RBRNO || gVAL.ctrnCsRrn;
						cdRow.ACTNUM_CARDNUM	= srcCdData.CRCDNO;
						cdRow.HOFC_COD 			= srcCdData.CRDCR_PK;
					}

					break;
			} // 계속수금정보 switch END

			// 세팅된 계속수금정보로 update
			gDS['DS_UD_CTMN_MTT'].push(cdRow);	
			if (!$.isEmptyObject(cdCtmnRow)) {
				gDS['DS_UD_CTMN_MTT'].push(cdCtmnRow);	
			}
		} // 게속수금 if END

		// * 3 반환계좌
		// ================================================================================
		var srcRtnData = $.grep(susCtmnData, function(p){if('3' == p.SUS_CTMN_SECD)return true;})[0];	// 반환계좌정보
		if (!stringUtil.isNull(srcRtnData)) {
			var rtnRow = $.extend({}, addRow);
			rtnRow.SUS_CTMN_SECD 	= '3';
			rtnRow.CTMN_METD_COD 	= '13';
			rtnRow.ACT_PK 			= srcRtnData.ACT_PK;
			rtnRow.OWAC_CS_RLP_SECD = '1';
			rtnRow.ACT_USGE_SECD 	= '3';
			rtnRow.CTMN_SAME_COD 	= nCtmnSameCod;
			rtnRow.CS_CTR_ACT_PK 	= srcRtnData.CS_CTR_ACT_PK;
			rtnRow.OWAC_CRDCO		= srcRtnData.OWAC_NAM || gVAL.crtnCsNam;
			rtnRow.OWAC_RES_REG_NO 	= srcRtnData.OWAC_RBRNO || gVAL.ctrnCsRrn;
			rtnRow.ACTNUM_CARDNUM 	= srcRtnData.ACTNUM;
			rtnRow.HOFC_COD 		= srcRtnData.ACT_PBLS_BANK_COD;
			gDS['DS_UD_CTMN_MTT'].push(rtnRow);
		}

		// 정기지급신청 SET (1:즉시형연금, 2:선택안함) / (스크립트임의부여값! '':해당없음)
		var fixTrmData = $.grep(gDS['DS_SUS_CTMN'], function(p){if('3' == p.SUS_CTMN_SECD)return true;})[0];
		
		$('#cmbFixtrmDfr').val(stringUtil.isNull(fixTrmData) ? '' : fixTrmData.NP_FIXTRM_DFR_APPL_YN);
		gData.cmbFixtrmDfr = (stringUtil.isNull(fixTrmData) ? '' : fixTrmData.NP_FIXTRM_DFR_APPL_YN);
	};
	

	/**
	 * 심사/저장용 구주소, 신주소 정보 SET
	 */
	function setUdAdrMtt() {
		// DS_UD_ADR_MTT (구주소)

		// 기간계에 값이 없으면
		var addrData = $.grep(gDS['DS_ADDR_POHD'], function(p){if('1' == p.BZ_SECD && '2' == p.CNTAD_SECD)return true;});
		var position = gDS['DS_ADDR_POHD'].findIndex( function(p){if('1' == p.BZ_SECD && '2' == p.CNTAD_SECD)return true;} ); // 기간계
																																// 주소
																																// 위치
		if (stringUtil.isNull(addrData)) { // 채널계의 주소값을 대체 한다.
			// 채널계 주소
			addrData = $.grep(gDS['DS_ADDR_POHD'], function(p){if('2' == p.BZ_SECD && '2' == p.CNTAD_SECD)return true;});
			gDS['DS_ADDR_POHD'][position] = addrData;
		}
		$.each(gDS['DS_ADDR_POHD'], function(idx, row){
			// row 에 INCT_INTPSCTN 컬럼을 추가한 obj를 복사하여 DS_UD_ADR_MTT에 push
			gDS['DS_UD_ADR_MTT'].push($.extend(true, $.extend(true, {}, row), { "INCT_INTPSCTN": "11" }));
		});

		
		// 기간계에 값이 없으면
		var addrData = $.grep(gDS['DS_ADDR_MAIPSN'], function(p){if('1' == p.BZ_SECD && '2' == p.CNTAD_SECD)return true;} );
		var position = gDS['DS_ADDR_MAIPSN'].findIndex( function(p){if('1' == p.BZ_SECD && '2' == p.CNTAD_SECD)return true;}); // 기간계
																																// 주소
																																// 위치

		if (stringUtil.isNull(addrData)) { // 채널계의 주소 값을 대체 한다.
			// 채널계 주소
			addrData = $.grep(gDS['DS_ADDR_MAIPSN'], function(p){if('2' == p.BZ_SECD && '2' == p.CNTAD_SECD)return true;});
			gDS['DS_ADDR_MAIPSN'][position] = addrData;
		}	
		$.each(gDS['DS_ADDR_MAIPSN'], function(idx, row){
			gDS['DS_UD_ADR_MTT'].push($.extend(true, $.extend(true, {}, row), { "INCT_INTPSCTN": "21" }));
		});

		// DS_UD_ADR_NEW_MTT (신주소)
		/* check */
		if (!stringUtil.isNull(gDS['DS_ADDR_POHD_NEW'])) {
			$.each(gDS['DS_ADDR_POHD_NEW'], function(idx, row){
				gDS['DS_UD_ADR_NEW_MTT'].push($.extend(true, $.extend(true, {}, row), { "INCT_INTPSCTN": "11" }));
			});
		}
		/* check */
		if (!stringUtil.isNull(gDS['DS_ADDR_MAIPSN_NEW'])) {
			$.each(gDS['DS_ADDR_MAIPSN_NEW'], function(idx, row){
				gDS['DS_UD_ADR_NEW_MTT'].push($.extend(true, $.extend(true, {}, row), { "INCT_INTPSCTN": "21" }));
			});
		}
		
	};


	function validationCheck_child() {
	    if (stringUtil.isNull($("[name=RNNO_GBN_CD_CHILD]:checked").val()) ) {
	        dcUtil.g_showMessage("NPSE0037", "KYC(미성년자) 실명번호구분 입력필수");
	        setFocus($("[name=RNNO_GBN_CD_CHILD]"));
	        return false;
	    }
	    if (stringUtil.isNull($("#RNNO_CHILD").val())) {
	        dcUtil.g_showMessage("NPSE0037", "KYC(미성년자) 실명번호 입력필수");
	        return false;
	    }
	    if (stringUtil.isNull($("#HANGL_NM_CHILD").val()) ) {
	        dcUtil.g_showMessage("NPSE0037", "KYC(미성년자) 성명 입력필수");
	        setFocus($("#HANGL_NM_CHILD"));
	        return false;
	    }    
	    if (stringUtil.isNull($("#CNTRY_CD_CHILD").val())) {
	        dcUtil.g_showMessage("NPSE0037", "KYC(미성년자) 국적 입력필수");
	        setFocus($("#CNTRY_CD_CHILD"));
	        return false;
	    }

		var val_HOME_ZIPCD_CHILD 		= $("#HOME_ZIPCD_CHILD").val(); 			// 미성년
																					// 자택
																					// 우편번호
		var val_HOME_ZIPCD_ADDR_CHILD 	= $("#HOME_ZIPCD_ADDR_CHILD").val();		// 미성년
																					// 자택
																					// 주소 1
		var val_HOME_DTL_ADDR_CHILD 	= $("#HOME_DTL_ADDR_CHILD").val(); 			// 미성년
																					// 자택
																					// 주소 2

		/* 미성년자 자택 주소가 입력되지 않았으면 */
		if( 									
				stringUtil.isNull(val_HOME_ZIPCD_CHILD) 
			&& 	stringUtil.isNull(val_HOME_ZIPCD_ADDR_CHILD) 
			&& 	stringUtil.isNull(val_HOME_DTL_ADDR_CHILD) 
		){
			dialog.alert("고객정보수정에서 미성년자의 주소를 입력해 주세요.");
			setFocus($("#HOME_ZIPCD_CHILD"));
			return false;
		}
		
	   	if(stringUtil.isNull($("[name=TXFNOG_CD_CHILD]:checked").val())) {
	    	dialog.alert("(미성년 EDD)거래자금 원천 및 출처를 선택하세요.");
			setFocus($("#TXFNOG_CD_CHILD"));
	    	return false;
	   	}
	   
	    if($("[name=TXFNOG_CD_CHILD]:checked").val() == "99" && $("#TXFNOG_ETC_NM_CHILD").val().trim().length == 0){
	    	dialog.alert("거래자금 원천 및 출처의 기타소득 입력란을 입력해 주세요.");
	    	setFocus($("#TXFNOG_ETC_NM"));
	    	return false;
	    }
	   	
	   	if(stringUtil.isNull($("[name=NWCT_TXPR_CD_CHILD]:checked").val())) {
	    	dialog.alert("(미성년 EDD)거래목적을 선택하세요.");
			setFocus($("#NWCT_TXPR_CD_CHILD"));
	    	return false;
	   	}

	    if($("[name=NWCT_TXPR_CD_CHILD]:checked").val() == "99" && $("#NWCT_TXPR_ETC_NM_CHILD").val().trim().length == 0){
	    	dialog.alert("거래자금 원천 및 출처의 기타소득 입력란을 입력해 주세요.");
	    	setFocus($("#NWCT_TXPR_ETC_NM_CHILD"));
	    	return false;
	    }
	    
		
	    return true;
	};


	function validationChecks() {

	    if ($("[name=RNNO_GBN_CD]:checked").val() == "") {
	        dcUtil.g_showMessage("NPSE0037", "실명번호구분 입력필수");
	        setFocus($("[name=RNNO_GBN_CD]").eq(0));
	        return false;
	    }
	    if ($("#RNNO").val() == "") {
	        dcUtil.g_showMessage("NPSE0037", "실명번호 입력필수");
	        return false;
	    }
	    if ($("#HANGL_NM").val() == "") {
	        dcUtil.g_showMessage("NPSE0037", "성명 입력필수");
	        $("#HANGL_NM").focus();
	        setFocus($("#HANGL_NM"));
	        return false;
	    }

	    if ($("#INSU_JOB_CD").val() == "" && $("#RNNO_MANUL_TRFLS_YN").val() != "02") {
	        dcUtil.g_showMessage("NPSE0037", "KYC에서 직업을 선택하여 주시기 바랍니다.");
	        $("#INSU_JOB_CD").focus();
	        setFocus($("#INSU_JOB_CD"));
	        return false;
	    }
	    
	    // 체크로직 추가_21.07.02_허성렬
	    if ($("#INSU_JOB_CD").val() == "08" && $("#RNNO_MANUL_TRFLS_YN").val() != "02") {
	        dcUtil.g_showMessage("NPSE0037", "성년 계약자/친권자의 직업으로 미성년자를 선택할 수 없습니다.");
	        $("#INSU_JOB_CD").focus();
	        setFocus($("#INSU_JOB_CD"));
	        return false;
	    }

	    if ($("#CNTRY_CD").val() == "") {
	        dcUtil.g_showMessage("NPSE0037", "국적 입력필수");
	        setFocus($("#CNTRY_CD"));
	        return false;
	    }

	    /*
		 * 자택주소 정보
		 */ 
	    var val_HOME_ZIPCD 			=  $("#HOME_ZIPCD").val(); 			// 자택
																		// 우편번호
		var val_HOME_ZIPCD_ADDR    	=  $("#HOME_ZIPCD_ADDR").val();  	// 자택 주소
																		// 1
		var val_HOME_DTL_ADDR    	=  $("#HOME_DTL_ADDR").val();  		// 자택 주소
																		// 2

		/*
		 * 직장주소 정보
		 */
		var val_OFC_ZIPCD 			= $("#OFC_ZIPCD").val(); 			// 직장
																		// 우편번호
		var val_OFC_ZIPCD_ADDR 		= $("#OFC_ZIPCD_ADDR").val();  		// 직장 주소
																		// 1
		var val_OFC_DTL_ADDR 		= $("#OFC_DTL_ADDR").val();  		// 직장 주소
																		// 2


		if(	
			(stringUtil.isNull(val_HOME_ZIPCD) && 	stringUtil.isNull(val_HOME_ZIPCD_ADDR) && 	stringUtil.isNull(val_HOME_DTL_ADDR)) 		/*
																																			 * 자택
																																			 * 주소가
																																			 * null
																																			 * 이고
																																			 */ 
			&&(stringUtil.isNull(val_OFC_ZIPCD) && 	stringUtil.isNull(val_OFC_ZIPCD_ADDR) && 	stringUtil.isNull(val_OFC_DTL_ADDR)) 		/*
																																			 * 직장
																																			 * 주소가
																																			 * null
																																			 * 이면
																																			 */ 
		){
			dialog.alert("고객정보수정에서 주소를 입력해 주세요.");
			setFocus($("#HOME_ZIPCD"));
			return false;
		}
		
	        
	   // 외국인일경우 여권번호 필수에서 제외(2018.08.06 준법감시부 박상용님 요청사항 )
	   /*
		 * if (($("[name=RNNO_GBN_CD]:checked").val() == "02" ||
		 * $("[name=RNNO_GBN_CD]:checked").val() == "03") ||
		 * $("#CNTRY_CD").val() != "KR") { if ($("#PASSPT_NO").val() == "") {
		 * dcUtil.g_showMessage("NPSE0037", "여권번호 입력필수");
		 * setFocus($("#PASSPT_NO")); return true; } }
		 */
	    
	 	if ($("[name=RNNO_GBN_CD]:checked").val() == "15" ) {
	        if ($("#CNTRY_CD").val() == "KR" ) {
	            dialog.alert("외국인 고객은 대한민국 선택이 불가합니다.");
	            setFocus($("[name=RNNO_GBN_CD]"));
	            return false;
	        }
	    }
		
	    if ($("#HOME_ZIPCD").val() != "" && $("#HOME_ZIPCD_ADDR").val() != "" && $("#HOME_DTL_ADDR").val() != "") {
	        if ($("#PRSN_CNTC_REGON_NO").val() == "" || $("#PRSN_CNTC_OFC_NO").val() == "" || $("#PRSN_CNTC_INDIVI_NO").val() == "") {
	            dcUtil.g_showMessage("NPSE0037", "연락처 입력필수");
	            setFocus($("#HOME_ZIPCD"));
	            return false;
	        }
	    }


	    /*
		 * 급여소득자의 경우 필수
		 */
// if($("#INSU_JOB_CD").val() == "26" && $("#OFC_NM").val().trim().length == 0){
// dcUtil.g_showMessage("NPSE0037", "KYC에서 직장명을 입력하여 주시기 바랍니다.");
// setFocus($("#OFC_NM"));
// return true;
	// }
	    
	    // if ($("#OFC_ZIPCD").val() != "" && $("#OFC_ZIPCD_ADDR").val() != ""
		// && $("#OFC_DTL_ADDR").val() != "") {
	    // if ($("#OFC_CNTC_REGON_NO").val() == "" ||
		// $("#OFC_CNTC_OFC_NO").val() == "" || $("#OFC_CNTC_INDIVI_NO").val()
		// == "") {
	    // dcUtil.g_showMessage("NPSE0037", "직장연락처 입력필수");
	    // setFocus($("#OFC_ZIPCD"));
	    // return true;
	    // }
	    // }
	    
	    if ($("[name=RL_OWNR_YN]:checked").val() == "N") {
	        if ($("#RL_OWNR_HANGL_NM").val() == "" || $("#RL_OWNR_BRTHYMD").val() == "" || $("#RL_OWNR_CNTRY_CD").val() == "") {
	            if ($("#RL_OWNR_HANGL_NM").val().trim().length == 0 ) {
	            	dcUtil.g_showMessage("NPSE0037", "성명 입력필수");
	                setFocus($("#RL_OWNR_HANGL_NM"));
	                return false;
	            }
	            if ($("#RL_OWNR_BRTHYMD").val().trim().length == 0 ) {
	            	dcUtil.g_showMessage("NPSE0037", "생년월일 입력필수");
	                setFocus($("#RL_OWNR_BRTHYMD"));
	                return false;
	            }
	            if ($("#RL_OWNR_CNTRY_CD").val().trim().length == 0 ) {
	            	dcUtil.g_showMessage("NPSE0037", "국적 입력필수");
	                setFocus($("#RL_OWNR_CNTRY_CD"));
	                return false;
	            }
	            
	        }else{
	        	// else절 추가, 실제소유자와 동일하게 성명(KEY)입력하는 경우_허성렬_21.07.05
	        	if ($("#RL_OWNR_HANGL_NM").val() == $("#HANGL_NM").val() ) {
	        		var msgNew = "";
	        		msgNew += "실제소유자 여부에 '아니오'를 선택하셨습니다.";
	        		msgNew += "<br/>본인이 아닌 실제소유자 정보를 입력해주시기 바랍니다.";
	        		msgNew += "<br/>(본인일 경우 실제소유자 '예' 선택)";
	        		dcUtil.g_showMessage("NPSE0037", msgNew);
	        		// dcUtil.g_showMessage("NPSE0037", "실제소유자 여부에 '아니오'를
					// 선택하셨습니다. \n\n본인이 아닌 실제소유자 정보를 입력해주시기 바랍니다. \n\n(본인일 경우
					// 실제소유자 '예' 선택)");
	                setFocus($("#RL_OWNR_HANGL_NM"));
	                return false;
	        	}
	        }
	    }else{
	    	gData.RL_OWNR_HANGL_NM = "";
	    	gData.RL_OWNR_BRTHYMD  = "";
	    	gData.RL_OWNR_CNTRY_CD = "";
	    }
	    
	    if ($("[name=RL_OWNR_YN_CHILD]:checked").val() == "N") {
	        if ($("#RL_OWNR_HANGL_NM_CHILD").val() == "" || $("#RL_OWNR_BRTHYMD_CHILD").val() == "" || $("#RL_OWNR_CNTRY_CD_CHILD").val() == "") {
	            if ($("#RL_OWNR_HANGL_NM_CHILD").val().trim().length == 0 ) {
	            	dcUtil.g_showMessage("NPSE0037", "성명 입력필수");
	                setFocus($("#RL_OWNR_HANGL_NM_CHILD"));
	                return false;
	            }
	            if ($("#RL_OWNR_BRTHYMD_CHILD").val().trim().length == 0 ) {
	            	dcUtil.g_showMessage("NPSE0037", "생년월일 입력필수");
	                setFocus($("#RL_OWNR_BRTHYMD_CHILD"));
	                return false;
	            }
	            if ($("#RL_OWNR_CNTRY_CD_CHILD").val().trim().length == 0 ) {
	            	dcUtil.g_showMessage("NPSE0037", "국적 입력필수");
	                setFocus($("#RL_OWNR_CNTRY_CD_CHILD"));
	                return false;
	            }
	            
	        }
	        
	        // 미성년자 본인 입력 체크 추가_허성렬_21.07.12
        	if ($("#RL_OWNR_HANGL_NM_CHILD").val() == $("#HANGL_NM_CHILD").val() ) {
        		var msgNew = "";
        		msgNew += "실제소유자 여부에 '아니오'를 선택하셨습니다.";
        		msgNew += "<br/>본인이 아닌 실제소유자 정보를 입력해주시기 바랍니다.";
        		msgNew += "<br/>(본인일 경우 실제소유자 '예' 선택)";
        		dcUtil.g_showMessage("NPSE0037", msgNew);
        		// dcUtil.g_showMessage("NPSE0037", "실제소유자 여부에 '아니오'를 선택하셨습니다.
				// \n\n본인이 아닌 실제소유자 정보를 입력해주시기 바랍니다. \n\n(본인일 경우 실제소유자 '예'
				// 선택)");
                setFocus($("#RL_OWNR_HANGL_NM_CHILD"));
                return false;
        	}
	    }else{
	    	gData.RL_OWNR_HANGL_NM_CHILD = "";
	    	gData.RL_OWNR_BRTHYMD_CHILD  = "";
	    	gData.RL_OWNR_CNTRY_CD_CHILD = "";
	    }
	    
	    if ($("#INSU_JOB_CD").val() == "8") {
	        if($("#HANGL_NM").val() == "" || $("#RNNO").val() == "" || $("#CNTRY_CD").val() == "" || $("#HOME_ZIPCD").val() == "" || $("#HOME_ZIPCD_ADDR").val() == "" || $("#HOME_DTL_ADDR").val() == "" || $("#PRSN_CNTC_REGON_NO").val() == "" || $("#PRSN_CNTC_OFC_NO").val() == "" || $("#PRSN_CNTC_INDIVI_NO").val() == "") {
	            dcUtil.g_showMessage("NPSE0037", "직업코드가 미성년자인 경우 성명, 실명번호, 국적, 자택주소, 자택연락처 입력 필수");
	            setFocus($("#HANGL_NM"));
	            return false;
	        }
	    }
	    
	    console.log("진위여부체크>>>", $("#RNNO_TRFLS_YN").val());
	    console.log("진위여부체크>>>", $("#RNNO_MANUL_TRFLS_YN").val());

	    if ((stringUtil.isNull($("#RNNO_TRFLS_YN").val()) || $("#RNNO_TRFLS_YN").val() == "01")
	    		&& (stringUtil.isNull($("#RNNO_MANUL_TRFLS_YN").val()) || $("#RNNO_MANUL_TRFLS_YN").val() != "02")) {
	        dcUtil.g_showMessage("NPSE0037", "신분증 진위여부를 실행하여 주시기 바랍니다.");
	        setFocus($("#btnIbChk"));
	        return false;
	    }

	   	if($("#RNNO_TRFLS_YN").val() == "03" && $("#RNNO_MANUL_TRFLS_YN").val() != "02"){  // 진위여부가
																							// 안되었을
																							// 경우
			dcUtil.g_showMessage("NPSE0037", "진위여부가 [N] 입니다. 모바일 청약 진행이 불가합니다.");
			setFocus($("#RNNO_TRFLS_YN"));
			return false;
	   	}

	   	if ($("#RLNM_CHK_MTHOD_CD").val() == "") {
	        dcUtil.g_showMessage("NPSE0037", "신원확인증 입력 필수");
	        setFocus($("#RLNM_CHK_MTHOD_CD").eq(0));
	        return false;
	    }
	   	
	   	if(stringUtil.isNull($("[name=TXFNOG_CD]:checked").val())) {
	    	dialog.alert("(EDD)거래자금 원천 및 출처를 선택하세요.");
	    	setFocus($("#TXFNOG_CD"));
	    	return false;
	   	}

	    if($("[name=TXFNOG_CD]:checked").val() == "99" && $("#TXFNOG_ETC_NM").val().trim().length == 0){
	    	dialog.alert("거래자금 원천 및 출처의 기타소득 입력란을 입력해 주세요.");
	    	setFocus($("#TXFNOG_ETC_NM"));
	    	return false;
	    }
	   	
	   	if(stringUtil.isNull($("[name=NWCT_TXPR_CD]:checked").val())) {
	    	dialog.alert("(EDD)거래목적을 선택하세요.");
	    	setFocus($("#NWCT_TXPR_CD"));
	    	return false;
	   	}

	    if($("[name=NWCT_TXPR_CD]:checked").val() == "99" && $("#NWCT_TXPR_ETC_NM").val().trim().length == 0){
	    	dialog.alert("거래자금 원천 및 출처의 기타소득 입력란을 입력해 주세요.");
	    	setFocus($("#NWCT_TXPR_ETC_NM"));
	    	return false;
	    }
	    return true;
	};
	
	// FATCA validation check
	function validate_fatca() {
		
		// 주민번호 뒷자리 5이상일 경우 납세자 정보 활성화
		var rrnValid = "N";
		if(parseInt(gVAL.csnum.substring(6,7)) > 4){ 
			rrnValid = "Y";
		}
		
	    if ($("[name=rdoUsCorYn]:checked").val() == "1" && stringUtil.isNull($("[name=rdoUsAmYn]:checked").val())) {
	        dcUtil.g_showMessage("NPSE0037", "'예'인 경우 해당되는 사항을 체크하십시요.");

	        setFocus($("[name=rdoUsCorYn]:checked"));
	        return false;
	    }
	    
	
	    /* (1)국적이 대한민국이 아닌경우 (2)주민번호 뒷자리가 5이상인경우 = "Y" */
	    if ($("#edtCorgnoCon").val() != "235" || rrnValid === "Y"){
	    	// 영문 성명 valid
	    	if (stringUtil.isNull($("#edtCorgnoSur").val())) {
	    		dcUtil.g_showMessage("NPSE0037", "영문 성(SurName)을 입력해주세요.");
	    		setFocus($("#edtCorgnoSur"));
	    		return false;	
	    	}else{
	    		if(!/^[A-Z]+$/g.test($("#edtCorgnoSur").val())) {
	    			dcUtil.g_showMessage("NPSE0037", "성(SurName)을 영문대문자로 입력해주세요.");
	    			setFocus($("#edtCorgnoSur"));
	    			return false;
	    		}
	    	}
	    	
	    	if (stringUtil.isNull($("#edtCorgnoGiv").val())) {
	    		dcUtil.g_showMessage("NPSE0037", "영문 명(Given Name)을 입력해주세요.");
	    		setFocus($("#edtCorgnoGiv"));
	    		return false;
	    	}else{
	    		if(!/^[A-Z]+$/g.test($("#edtCorgnoGiv").val())) {
	    			dcUtil.g_showMessage("NPSE0037", "이름(Given Name)을 영문대문자로 입력해주세요.");
	    			setFocus($("#edtCorgnoGiv"));
	    			return false;
	    		}
	    	}
	    }
	    
	    // 고객확인사항이 하나라도 '예'인 경우
	    if(	$("[name=rdoUsCorYn]:checked").val() == "1"   	/* 미국세법상 미국인에 해당됩니까? */ 
	    	|| 	$("[name=rdoUsSeaYn]:checked").val() == "1"  	/*
																 * 대한민국 이외의
																 * 조세목적상 해외 거주지가
																 * 있습니까?
																 */ ){

	    	// 영문 성명 valid
	    	if (stringUtil.isNull($("#edtCorgnoSur").val())) {
	    		dcUtil.g_showMessage("NPSE0037", "영문 성(SurName)을 입력해주세요.");
	    		setFocus($("#edtCorgnoSur"));
	    		return false;	
	    	}else{
	    		if(!/^[A-Z]+$/g.test($("#edtCorgnoSur").val())) {
	    			dcUtil.g_showMessage("NPSE0037", "성(SurName)을 영문대문자로 입력해주세요.");
	    			setFocus($("#edtCorgnoSur"));
	    			return false;
	    		}
	    	}
	    	
	    	if (stringUtil.isNull($("#edtCorgnoGiv").val())) {
	    		dcUtil.g_showMessage("NPSE0037", "영문 명(Given Name)을 입력해주세요.");
	    		setFocus($("#edtCorgnoGiv"));
	    		return false;
	    	}else{
	    		if(!/^[A-Z]+$/g.test($("#edtCorgnoGiv").val())) {
	    			dcUtil.g_showMessage("NPSE0037", "이름(Given Name)을 영문대문자로 입력해주세요.");
	    			setFocus($("#edtCorgnoGiv"));
	    			return false;
	    		}
	    	}
	    	
	    	// 거주지국가1 valid
	    	var valid = "0";
	    	if(!stringUtil.isNull($("#edtCorgnoCon1").val())){  // 거주지국가 1 을 선택
																// 하였으면.
	    		valid = "1";
	    		if (stringUtil.isNull($("#edtCorgnoEnAdd1").val())) {
	    			dcUtil.g_showMessage("NPSE0037", "영문주소1을 입력해주세요.");
	    			setFocus($("#edtCorgnoEnAdd1"));
	    			return false;
	    		}else if(!/^[0-9a-zA-Z\s\-\,]+$/g.test($("#edtCorgnoEnAdd1").val())) {
	    			dcUtil.g_showMessage("NPSE0037", "주소를 영문으로 입력해주세요.");
	    			setFocus($("#edtCorgnoEnAdd1"));
	    			return false;
	    		}
	    		
	    		if (stringUtil.isNull($("#edtCorgnoTin1").val()) && stringUtil.isNull($("[name=rdoUsEXYn1]:checked").val())) {
	    			dcUtil.g_showMessage("NPSE0037", "납세자번호1 또는 납세자번호 미기재사유를 입력해주세요.");
	    			setFocus($("#edtCorgnoTin1"));
	    			return false;
	    		}
	    		
	    		// 납세자번호1 무, 미기재사유 기타 선택한 경우
	    		if(!stringUtil.isNull($("[name=ch1]").val()) && $("[name=ch1]:checked").val() === "0" 
	    			&& $("[name=rdoUsEXYn1]:checked").val()=="3" && stringUtil.isNull($("#edtCorgnoETC1").val())
	    		){
	    			dcUtil.g_showMessage("NPSE0037", "납세자번호1의 미기재사유 기타란을 입력해주세요.");
	    			return false;
	    		}
	    		
	    		// 납세자번호1 유 선택한 경우 미기재사유1 초기화
	    		if($("[name=ch1]:checked").val() === "1"){
	    			gData.rdoUsEXYn1 = "";
	    		}
	    	}
	    	
	    	// 거주지국가2 valid
	    	if(!stringUtil.isNull($("#edtCorgnoCon2").val())){  // 거주지국가 2 을 선택
																// 하였으면.
	    		valid = "1";
	    		if (stringUtil.isNull($("#edtCorgnoEnAdd2").val())) {
	    			dcUtil.g_showMessage("NPSE0037", "영문주소2를 입력해주세요.");
	    			setFocus($("#edtCorgnoEnAdd2"));
	    			return false;
	    		}else if(!/^[0-9a-zA-Z\s\-\,]+$/g.test($("#edtCorgnoEnAdd2").val())) {
	    			dcUtil.g_showMessage("NPSE0037", "주소를 영문으로 입력해주세요.");
	    			setFocus($("#edtCorgnoEnAdd2"));
	    			return false;
	    		}
	    		
	    		if (stringUtil.isNull($("#edtCorgnoTin2").val()) && stringUtil.isNull($("[name=rdoUsEXYn2]:checked").val())) {
	    			dcUtil.g_showMessage("NPSE0037", "납세자번호2 또는 납세자번호 미기재사유를 입력해주세요.");
	    			setFocus($("#edtCorgnoTin2"));
	    			return false;
	    		}
	    		
	    		if(!stringUtil.isNull($("[name=ch2]").val()) && $("[name=ch2]:checked").val() === "0" 
	    			&& $("[name=rdoUsEXYn2]:checked").val()=="3" 
	    				&& stringUtil.isNull($("#edtCorgnoETC2").val())
	    		){
	    			dcUtil.g_showMessage("NPSE0037", "납세자번호2의 미기재사유 기타란을 입력해주세요.");
	    			return false;
	    		}
	    		
	    		// 납세자번호2 유 선택한 경우 미기재사유2 초기화
	    		if($("[name=ch2]:checked").val() === "1"){
	    			gData.rdoUsEXYn2 = "";
	    		}
	    	}
	    	
	    	// 거주지국가 선택 안했을 경우
	    	if(valid != "1"){
	    		dcUtil.g_showMessage("NPSE0037", "거주지국가를 선택해주세요.");
	    		return false;
	    	}
	    }
	    // 고객확인 사항 전부 '아니오'일 경우 납세자정보-거주지국가 gData 초기화
	    else if($("[name=rdoUsCorYn]:checked").val() == "0"   	/*
																 * 미국세법상 미국인에
																 * 해당됩니까? N
																 */ 
	    	&& $("[name=rdoUsSeaYn]:checked").val() == "0"){  /*
																 * 대한민국 이외의
																 * 조세목적상 해외 거주지가
																 * 있습니까? N
																 */
	    	gData.edtCorgnoEnAdd1		= "";
	    	gData.edtCorgnoTin1			= "";
	    	gData.edtCorgnoEnAdd2		= "";
	    	gData.edtCorgnoTin2			= "";
	    	gData.edtCorgnoCon1			= "";
	    	gData.edtCorgnoCon2			= "";
	    	gData.rdoUsEXYn1			= "";
	    	gData.rdoUsEXYn2			= "";
	    	gData.ch1					= "";
	    	gData.ch2					= "";
	    }
	    
	    // 전부 해당 안될 경우 영문 성명 gData 초기화
	    if($("[name=rdoUsCorYn]:checked").val() == "0"   	/*
															 * 미국세법상 미국인에 해당됩니까?
															 * N
															 */ 
	    	&& $("[name=rdoUsSeaYn]:checked").val() == "0"    /*
																 * 대한민국 이외의
																 * 조세목적상 해외 거주지가
																 * 있습니까? N
																 */
	    		&& $("#edtCorgnoCon").val() == "235"  			/* 국적이 대한민국인경우 */ 
	    			&& rrnValid === "N"								/*
																	 * 주민번호 뒷자리가
																	 * 5이상이 아닌
																	 * 경우
																	 */
	    ){
	    	// 납세자정보 영문성명 gData 초기화
	    	gData.edtCorgnoSur = "";
	    	gData.edtCorgnoGiv = "";
	    }
	    	
	    return true;
	};

	// 필요값 체크
	function fnct_validateFc(a_DW,a_colId,a_errMsg) {
		if (stringUtil.isNull(a_DW[0][a_colId])) {
			dcUtil.g_showMessage("PDS40051", a_errMsg); // %s 값이 올바르지 않습니다.
			return true;
		}
		return false;
	};


	function required(argStr1,argStr2, argStr3) {
	    if(stringUtil.isNull(argStr1)) {
	        dcUtil.g_showMessage("COCE0001", argStr2);
	        if(!stringUtil.isNull(argStr3)){
	        	if(!stringUtil.isNull(argStr3)){
	        		$(".toggle-con").hide();
		        	$(argStr3).closest('.toggle-con').show();
		        	argStr3.focus();	
	        	}
	        }
	        return true;
	    } else {
	        return false;
	    }
	};

	
	// 다음화면호출
	function goNext(vNum, status, _callback) {
		// ds 세팅 및 이력등록
		saveHis(vNum, function () {
			if(status == "S" && gVAL.udProcCd == "0") {
				console.log("=======================전산심사 시작====================");
				callUdDlng();
			}
			
	    	if(_callback){
	    		_callback();
	    	}
		}, "NEXT");
		console.log("next gData>>",gData);
	};
	
	function initgVAL() {
		gVAL.udProcCd = "0";
		gVAL.amlExeYn = false;
		gVAL.isSave = false;
// $("#btnNext").text("전산심사");
	};
	
	// 이전화면호출
	function goPre(vNum, _callback) {
		saveHis(vNum, function () {
	    	if(_callback){
	    		console.log("pre callback>>", _callback);
	    		_callback();
	    	}
		}, "PRE");
	};
	
	/**
	 * 이력등록
	 */
	function saveHis(vNum, _callback, stat) {
		setgData();
		
		var pdtSecd = "";
		if(!stringUtil.isNull(gVAL.qttNo)){
			pdtSecd = gDS["DS_QTT_BAS"][0].MPRD_PDT_SECD;
		}else{
		    pdtSecd = gDS["DS_SUS_CTR_BAS"][0].PDT_SECD;
		}
	
		// 2022.05.06 kyc실소유자 체크
		if(vNum == '8'){
			var obj_11_rrn    = $.grep(gDS["DS_CTR_INTP_MTT_LIST"], function(o){if(o.CTR_RLE_SECD == '11'){ return true; } })[0].RRN; // 계약자
																																		// 정보
			var obj_11_rrn_YN = (dateUtil.getRealAge(obj_11_rrn) > 18) ? true : false ;
			if(!obj_11_rrn_YN){	// 계약자 :: 미성년
				if(gData.RL_OWNR_YN_CHILD == "Y"){ 
					if(gData.RL_OWNR_YN != "N"){ // 미성년 실소유자 여부 / 친권자 실소유자
													// 여부(Y/Y)
						dialog.alert("KYC 데이터 이상이 감지되었습니다(실제소유자)");
						return false;
					}
				}else {
					if(gData.RL_OWNR_YN == "N"){ // 미성년 실소유자 여부 / 친권자 실소유자
													// 여부(N/N)
						dialog.alert("KYC 데이터 이상이 감지되었습니다(실제소유자)");
						return false;
					}
				}
			}
		}
		
		gData.FNC_SPND_CD = gVAL.DS_FNC_SPND_INF[0].FNC_SPND_CD;
		if(gData.FNC_SPND_CD == 1){
			gData.FNC_SPND_YN = "N";
		}else{
			gData.FNC_SPND_YN = "";
		}
		// 변액상품의 경우
		// 전문금융소비자이자 일반금융소비자 동일 대우 아니요인 경우 적합성 validaion 패스
		if((pdtSecd == '03' || pdtSecd == '06' || pdtSecd == '09') && vNum == '2' && !(gData.FNC_SPND_CD == '1')){
			
					var paramCd = {};
		
					paramCd.FC_ADMN_CS_PK = global_FC_ADMN_CS_PK
					
					if(stringUtil.isNull(global_FC_ADMN_CS_PK)){ 
						dialog.alert("청약 입력 조회중 오류가 발생하였습니다.(FC_ADMN_CS_PK)");
						return false;
					}
		
					D.http.ajax('/su/mblSus/selectInsCtrPrpsCd',paramCd).then(function(data){
						
						if(stringUtil.isNull(data) || stringUtil.isNull(data.result)){
							dialog.alert("적합성 진단 결과 미존재시 변액상품을 선택할 수 없습니다.");
						    return false;
						}
						
						var answ2 = data.result.ANSW_2;
						var VER   = data.result.VER;
						
						// 이전으로 넘어갈때는 제외
						if(stat != "PRE"){
							if(stringUtil.isNull(data.result)){
								dialog.alert("「금융소비자보호에 관한 법률」시행에 따라 새로운 적합성 진단이 필요합니다.");
								return false;
							}
							if(VER != "T202107"){
								dialog.alert("「금융소비자보호에 관한 법률」시행에 따라 새로운 적합성 진단이 필요합니다.");
								return false;
							}
						}	
						
						var rsnb = "";
						if(answ2 == "2"){
							rsnb = "저축형"
						}else if(answ2 == "3"){
							rsnb = "연금형"
						}else if(answ2 == "4"){
							rsnb = "보장형"
						}
						
						var insCtrPrps  = data.result.INS_CTR_PRPS;
						var answ2 = data.result.ANSW_2;
						
						if(stat != "PRE"){
							if("00" == data.result.INS_CTR_PRPS){
								dialog.alert("변액보험계약이 적합하지 않은 고객입니다.");
								return false;
								
							}
							if(insCtrPrps  != "00" && pdtSecd == "03" && (answ2 == "2" || answ2 == "3")){
								dialog.alert("고객님은 변액보험 " + rsnb + "상품 가입을 희망하셨으므로 보장형 상품은 선택하실 수 없습니다");
								return false;
							}else if(insCtrPrps  != "00" && pdtSecd == "06" && (answ2 == "3" || answ2 == "4")){
								dialog.alert("고객님은 변액보험 " + rsnb + "상품 가입을 희망하셨으므로 저축형 상품은 선택하실 수 없습니다.");
								return false;
							}else if(insCtrPrps  != "00" && pdtSecd == "09" && (answ2 == "2" || answ2 == "4")){
								dialog.alert("고객님은 변액보험 " + rsnb + "상품 가입을 희망하셨으므로 연금형 상품은 선택하실 수 없습니다.");
								return false;
							}
						}

						// 2022.04.05 투자성향보다 위험도 높은 펀드
						// * 가입설계시 선택한 펀드 정보 gDS[DS_QTT_FUND_INF]로 valide chk
						// -----------------------------------------------------
						var noWant 			= stringUtil.isNull(gDS["INS_DS_VAR_FIT_DIAG"])? "" :  gDS["INS_DS_VAR_FIT_DIAG"][0].DIAG_YN; // 진단여부(1:진단0:불원)
					    var answ7Val 		= stringUtil.isNull(gDS["INS_DS_VAR_FIT_DIAG"])? "" :  gDS["INS_DS_VAR_FIT_DIAG"][0].ANSW_7;  // 보험료납입 가능기간(1:3년미만, 2:7년미만, 3:10년미만, 4:20년미만, 5:20년이상)
					    var pycycCodVal 	= stringUtil.isNull(gDS["ds_Pycyc"])? "" :  gDS["ds_Pycyc"][0].PYCYC_COD;					  // 납입주기코드값(1:월납,9:일시납)
					    var pdtAtrbDtlcd 	= stringUtil.isNull(gDS["ds_ProdtTypeMtt"])? "" :  gDS["ds_ProdtTypeMtt"][0].PDT_ATRB_DTLCD;  // 상품속성상세코드(변액(J)일떄 1:저축 2:연금)
					    var answ2Val = stringUtil.isNull(gDS["INS_DS_VAR_FIT_DIAG"])?  "" : gDS["INS_DS_VAR_FIT_DIAG"][0].ANSW_2;		  // 변액보험가입목적
																																			// (1:단기재산증식
																																			// 2:장기저축을통한목돈마련
																																			// 3:노후를위한긴급자산마련
																																			// 4:위험에대비한가족의보장자산마련)
						// 가입설계시 선택한 펀드 정보로 체크
						if(!stringUtil.isNull(gDS['DS_QTT_FUND_INF'])){
							if(!comparePerVar2(noWant, answ7Val, pycycCodVal, pdtAtrbDtlcd, answ2Val)){
								return;
							}
							
						}	

					if(stat != "PRE" && !validCheck()) {
						return;
					}
					
					// 2페이지만 이전으로 넘어갈때 valid 체크 한다.
					if(stat == "PRE" && vNum == 1 && !validateStep2("PRE")) {
						return;
					}
					
					var scbInfo;
					var susN = "";
			
					// 가입설계
					if(!stringUtil.isNull(gVAL.qttNo)){
						scbInfo = gDS['DS_QTT_BAS'][0];
						susN = gVAL.hisSusNum;
					} else { // 청약
						scbInfo = gDS['DS_SUS_CTR_BAS'][0];
						susN = gDS['DS_SUS_CTR_BAS'][0].SUSNUM;
					}
					
					console.log("saveHis gData>>>", gData);
					console.log("saveHis gDisp>>>", gDisp);
					
					
					var SUS_INF_INP_DATA = {
						"gData" 	: gData,
						"gDisp"	: gDisp,
						"gVisible"	: gVisible
					};
					
					var pn = "";
					if(scbInfo.PLYNO!=null) {
						pn = scbInfo.PLYNO;
					}
					if(stringUtil.isNull(pn)) {
						pn = gVAL.plyno;
					}
					
					// 청약입력이력 등록/수정
					var insArgs = {
						"QTTNO"				: scbInfo.QTTNO,				    // 가입설계번호
						"SUS_INP_HIS_PK"	: gVAL.susInpHisPk, 				// 입력순번
						"SUSNUM"			: susN == null ? "" : susN,	        // 청약번호
						"PLYNO"				: pn,								// 증권번호
						"CTYMD"				: gData.cmbCtymd,					// 계약일자
						"MBL_SUS_SECD"		: gData.sMblSusSecd,				// 모바일청약구분코드
						"SUS_INF_INP_DATA"	: JSON.stringify(SUS_INF_INP_DATA), // 청약입력데이터
						"SUS_INP_PROG_ST"	: vNum,								// 청약입력진행상태
						"CRTR"				: gVAL.plarNo,						// 생성자
						"AMDR"				: gVAL.plarNo						// 수정자
					};
					
					// 통신
					D.http.ajax("/su/mblSus/updateSusInpHis", insArgs)
					.then(function(data) {
						if (data.result > 0) {
							gVAL.susInpHisPk = String(data.result);
			
					    	if(_callback){
					    		_callback();
					    	}
						}else{
							dialog.alert(data.errorMsg);
						}
					});
					console.log("saveHis gData end1>>>", gData);
					});
			
		}else{
			// 변액상품이 아닌 경우
			
			if(stat != "PRE" && !validCheck()) {
				return;
			}
			
			// 2페이지만 이전으로 넘어갈때 valid 체크 한다.
			if(stat == "PRE" && vNum == 1 && !validateStep2("PRE")) {
				return;
			}
			
			var scbInfo;
			var susN = "";
	
			// 가입설계
			if(!stringUtil.isNull(gVAL.qttNo)){
				scbInfo = gDS['DS_QTT_BAS'][0];
				susN 	= gVAL.hisSusNum;
			} else { // 청약
				scbInfo = gDS['DS_SUS_CTR_BAS'][0];
				susN 	= gDS['DS_SUS_CTR_BAS'][0].SUSNUM;
			}
			
			console.log("saveHis gData>>>", gData);
			console.log("saveHis gDisp>>>", gDisp);
			
			var SUS_INF_INP_DATA = {
				"gData" 	: gData,
				"gDisp"	    : gDisp,
				"gVisible"	: gVisible
			};
			
			var pn = "";
			if(scbInfo.PLYNO!=null) {
				pn = scbInfo.PLYNO;
			}
			if(stringUtil.isNull(pn)) {
				pn = gVAL.plyno;
			}
			
			// 청약입력이력 등록/수정
			var insArgs = {
				"QTTNO"				: scbInfo.QTTNO,					// 가입설계번호
				"SUS_INP_HIS_PK"	: gVAL.susInpHisPk, 				// 입력순번
				"SUSNUM"			: susN == null ? "" : susN,			// 청약번호
				"PLYNO"				: pn,								// 증권번호
				"CTYMD"				: gData.cmbCtymd,					// 계약일자
				"MBL_SUS_SECD"		: gData.sMblSusSecd,				// 모바일청약구분코드
				"SUS_INF_INP_DATA"	: JSON.stringify(SUS_INF_INP_DATA), // 청약입력데이터
				"SUS_INP_PROG_ST"	: vNum,								// 청약입력진행상태
				"CRTR"				: gVAL.plarNo,						// 생성자
				"AMDR"				: gVAL.plarNo						// 수정자
			};
			
			// 통신
			D.http.ajax("/su/mblSus/updateSusInpHis", insArgs)
			.then(function(data) {
				if (data.result > 0) {
					gVAL.susInpHisPk = String(data.result);
	
			    	if(_callback){
			    		_callback();
			    	}
				}else{
					dialog.alert(data.errorMsg);
				}
			});
			console.log("saveHis gData end2>>>", gData);
		}
	};
	
	/**
	 * 컴포넌트의 값 과 속성을 저장한다.
	 */
	function setgData() {
		var colObj  = gDataCol[gViewNum-1];
		var colVObj = gDataColV[gViewNum-1];
		var nm 	    = "";
		var col; // 0 : 컬럼명, 1 : 컬럼타입
		
		for (var i = 0; i < colObj.length; i++) {
			col = colObj[i].split("|");
			console.log("col>>",col);
			
			// 값 저장
			if(col[1] == "R") {
				nm = col[0];
				if($("[name=" + nm + "]:checked").length > 0){
					gData[col[0]] = $("[name=" + nm + "]:checked").val();
					console.log("R data>>",gData[col[0]]);
				}
			} else if(col[1] == "C") {
				nm = "#" + col[0];
				gData[col[0]] = $(nm).is(':checked') ? "1":"0";
			} else {
				nm = "#" + col[0];
				gData[col[0]] = $(nm).val();
			}

			// 속성 저장
			// 속성은 값 뒤에 | 를 구분자로 disabled, readonly 순으로 붙인다.
			nm = "#" + col[0];
			gDisp[col[0]] = $(nm).prop('disabled') + "|" + $(nm).prop('readonly');
		}
		
		if (colVObj != null) {
			for (var i = 0; i < colVObj.length; i++) {
				col = colVObj[i];

				// show/hide 여부 저장
				nm = "#" + col;
				gVisible[col] = $(nm).is(':visible');
				console.log("disp>>", col+"::"+gVisible[col]);
			}
		}
		
		console.log("gdata>>", gData);
		console.log("gVisible>>", gVisible);
	}
	
	/**
	 * 컴포넌트의 값 과 속성 정보로 컴포넌트를 셋팅한다.
	 */
	function setViewWithgData() {
// if (gViewNum == 8) return;
		console.log("setViewWithgData>>>");
		var colObj = gDataCol[gViewNum-1];
		var colObjV = gDataColV[gViewNum-1];
		var col; // 0 : 컬럼명, 1 : 컬럼타입
		var val;
		var pVal; // 0 : disabled, 1 : readonly
		
		// show/hide 여부 셋팅
		for (var i = 0; i < colObjV.length; i++) {
			col = colObjV[i];
			console.log("visible>>", col + "::" + gVisible[col]);
			
			if(gVisible[col]==undefined) {
				continue;
			}

			if(gVisible[col] == true) {
				$("#" + col).show();
			} else {
				$("#" + col).hide();
			}
		}
		
		for (var i = 0; i < colObj.length; i++) {
			col = colObj[i].split("|");
			val = gData[col[0]];
			console.log("set col>>", colObj[i]);
			console.log("set val>>", val);

			// 속성 셋팅
			if (gDisp[col[0]] != null) {
				pVal = gDisp[col[0]].split("|");
				if(!stringUtil.isNull(pVal[0])) {
					if(pVal[0] == "true") {
						console.log("dis true>>", gDisp[col[0]] + "::" + pVal[0]);
						$("#" + col[0]).prop('disabled',true);
					} else {
						console.log("dis false>>", col[0] + "::" + pVal[0]);
						$("#" + col[0]).prop('disabled',false);
					}
				}
				
				if(!stringUtil.isNull(pVal[1])) {
					if(pVal[1] == "true") {
						$("#" + col[0]).prop('readonly',true);
					} else {
						$("#" + col[0]).prop('readonly',false);
					}
				}
			}

			// 값 셋팅
			if(val != null) {
				if(col[1] == "R") {
					console.log("radio>>", val);
					if (val != "undefined") {
						$("[name=" + col[0] + "][value=" + val + "]").prop('checked', true);
					} else { // 라디오일때 undefined 이면 체크해제 (라디오 버튼이 1개이고 기본값이
								// 체크일때 체크를 해제해주기 위함)
						$("[name=" + col[0] + "]").prop('checked', false);
					}
					
				} else if(col[1] == "C" && !stringUtil.isNull(val)) {
					console.log("C>>", col[0] + "::" + val);
					$("#" + col[0]).prop('checked', val == '1');
				} else if(!stringUtil.isNull(val)){
					// 계약관계자 별도 세팅
					if ("txt_csPk_11,sel_csRlpSecd_11,txt_csPk_21,sel_csRlpSecd_21,sel_csPk_41,sel_csRlpSecd_41,sel_csPk_42,sel_csRlpSecd_42,sel_csPk_47,sel_csRlpSecd_47,rlpParentPk".indexOf(col[0]) > -1) {
						// 관계 셋팅
						if($("#" + col[0]).find('option[value="' + val +'"]').length > 0) {
							$("#" + col[0]).val(val);
							console.log("별도>>", col[0] + "::" + val);
							console.log("계약관계자 별도 셋팅>>>", $("#" + col[0]).val());
							$("#" + col[0]).trigger('change');
						}
					} else if("RNNO_TRFLS_YN,RNNO_MANUL_TRFLS_YN".indexOf(col[0]) > -1) {
						// 신분증 진위체크 관련 데이터는 셋팅안함
					} else {
						console.log("else>>", col[0] + "::" + val);
						$("#" + col[0]).val(val);
					}
					
					// 신분증 진위여부 셋팅
					if(col[0] == "RNNO_TRFLS_YN_TXT") {
						if(val == "일치") {
							$("#" + col[0]).removeClass("no-unity");
							$("#" + col[0]).addClass("unity");
						} else {
							$("#" + col[0]).removeClass("unity");
							$("#" + col[0]).addClass("no-unity");
						}
					}
				}
			}
		}
	};
	
	function validCheck() {
		var rtnBool = false;

		switch(gViewNum){
			case 1 :
				rtnBool = validateStep1();
				break;
			case 2 :
				rtnBool = validateStep2();
				break;
			case 3 :
				rtnBool = validateStep3();
				break;
			case 4 :
				rtnBool = validateStep4();
				break;
			case 5 :
				rtnBool = validateStep5();
				break;
			case 6 :
				rtnBool = validateStep6();
				break;
			case 7 :
				rtnBool = validateStep7();
				break;
			case 8 :
				rtnBool = validateStep8();
				break;
		}
		
		return rtnBool;
	}

	/*
	 * KYC 고객정보를 로딩한다.
	 */
	function fn_checkKYCSaveInfo(_callback){
		// 증권번호가 없으면 KYC 정보가 없다고 판단 더이상 진행 하지 않는다.
		if(stringUtil.isNull(gVAL.plyNo)){
			return;
		}
		var args  = {};
	    args.stock_no = gVAL.plyNo;

	    D.http.ajax("/su/mblSus/selectKycInfo", args).then(function(result){
	    	if(_callback){
	    		_callback(result);
	    	}
	    });
	};

	/**
	 * 조회된 DS 데이터를 gDS객체에 추가하거나 기존 데이터를 갱신.
	 * 
	 * @param: dsJson - 조회된 DataSet json 데이터, mapKey - rename key 목록 json
	 */
	function fnSetGlobalDs(dsJson, mapKey) {
		var _dsJson = $.extend({}, dsJson);
		/*
		 * mapKey :: 화면DS명과 서버에서조회된DS명이 다를 경우에만 서버DS명을 화면DS명으로 바꿔줄 매핑정보를 받아
		 * 처리한다.
		 */
		if (mapKey) {	
			var js = JSON.stringify(_dsJson);
			$.each(mapKey, function(key, value){
				var arr = $.extend([], _dsJson[key]);	// 서버에서 조회온 arr데이터를 백업
				delete _dsJson[key];		// 서버명 DS명 arr를 제거
				_dsJson[value] = arr;	// 화면명 DS명으로 새로
			});
		}
		
		$.each(_dsJson, function(key, value) {
			gDS[key] = stringUtil.isNull(value.data)? [] : value.data ;
		});
	};

	function fnSetGlobalDs_version2(dsJson, mapKey){
		if (mapKey) {	
			var objTmp = {} ;
			var js = JSON.stringify(dsJson);
			$.each(mapKey, function(key, value){
				var arr = $.extend([], dsJson[key]);	// 서버에서 조회온 arr데이터를 백업
				// delete dsJson[key]; // 서버명 DS명 arr를 제거
				objTmp[value] = arr;	// 화면명 DS명으로 새로
			});
			$.each(objTmp, function(key, value) {
				gDS[key] = stringUtil.isNull(value)? [] : value ;
			});	
		}else{
			$.each(dsJson, function(key, value) {
				gDS[key] = stringUtil.isNull(value.data)? [] : value.data ;
			});	
		}
	};


	function getDayText(str){
		if(stringUtil.isNull(str)){
			return;
		}	
		
		var formatDate = str.replace(/(.{4})(.{2})(.{2})/, "$1-$2-$3");
		
		var arr_dayNm = ['일','월', '화', '수', '목', '금', '토'] ;
		
		var dayOfWeek = arr_dayNm[new Date(formatDate).getDay()];
		
		return formatDate +  "  " + dayOfWeek; 
	};
	
	function getMaxMaiTrminsPypd(nSecd) {
	    var arr_DS;
	    if (nSecd == "1") {
	       	arr_DS = gDS["ds_NtprdMtt"];
	    } else {
	        arr_DS = gDS["ds_Pypd"];
	    }
	    
	    var maiPrdcd = $.map(gDS["DS_NTPRD_MTT"], function(obj, index){if(obj.PDT_RLPCD == "1"){return obj.PRDCD; } })[0];
	    var csAge = $.map(gDS["DS_CTR_INTP_MTT_LIST"], function(obj, index){if(obj.CTR_RLE_SECD == "21"){return obj.PRCMPAG; } })[0];
	    var maxCod = "";
	    var maxYear = -1;
	    var sCod;
	    var sUntCod;
	    
	    for (var i = 0; i < arr_DS.length; i++) {
	        if (arr_DS[i][nSecd == "1"? "PRDCD": "AD_PRDCD"] == maiPrdcd) {
	            var sCod = arr_DS[i][nSecd == "1"? "TRMINS": "PYPD"];
	            var sUntCod = arr_DS[i][nSecd == "1"? "TRMINS_UNT_COD": "PYPD_UNT_COD"];

	            if (parseInt(cc_chkUntGod(sCod, sUntCod, csAge)) > maxYear) {
	                maxYear = cc_chkUntGod(sCod, sUntCod, csAge);
	                maxCod = sCod;
	            }
	        }
	    }
	    return maxCod;
	};

	function cc_chkUntGod(arg, untCod, age){
		if (untCod == "1") {
	        return parseInt(arg);
	    } else {
	        return parseInt(arg) - parseInt(age);
	    }
	};

	function getMaxMaiTrminsPypd2(nSecd) {
	    var arr_DS;
	    if (nSecd == "1") {
	        arr_DS = gDS["ds_NtprdMtt"];
	    } else {
	        arr_DS = gDS["ds_Pypd"];
	    }

	    var maiPrdcd = $.map(gDS["DS_NTPRD_MTT"],function(obj, index){if(obj.PDT_RLPCD == "1"){return obj.PRDCD; } })[0];        	
	    var csAge = $.map(gDS["DS_CTR_INTP_MTT_LIST"],function(obj, index){if(obj.CTR_RLE_SECD == "21"){return obj.PRCMPAG; } })[0]; 
	    var maxCod = "";
	    var maxYear = -1;
	    var sCod;
	    var sUntCod;
	    var maxCodNam = "";

	    for (var i = 0; i < arr_DS.length; i++) {
	        if (arr_DS[i][nSecd == "1"? "PRDCD": "AD_PRDCD"] == maiPrdcd) {
	            var sCod = arr_DS[i][nSecd == "1"? "TRMINS": "PYPD"];
	            var sUntCod = arr_DS[i][nSecd == "1"? "TRMINS_UNT_COD" : "PYPD_UNT_COD"];
	            var sCodNam = arr_DS[i][nSecd == "1" ? "TRMINS_DISPLAY": "PYPD_DISPLAY"];
	            if (parseInt(cc_chkUntGod(sCod, sUntCod, csAge)) > maxYear) {
	                maxYear = cc_chkUntGod(sCod, sUntCod, csAge);
	                maxCodNam = sCodNam;
	            }
	        }
	    }
	    return maxCodNam;
	};
	
	
	// 계약관계자 setting
	function setUd_InctIntp() {
		var nRow, cnt;
		var nCtrRleSecd, nXclclvApplYn, nCsPk, nName;
		var nNatalSenm, nStyNam, nGndr;
		var isGrop;
		var sOsNat; // 재외국민
	
		console.log("DS_CTR_INTP_MTT_LIST>>", gDS["DS_CTR_INTP_MTT_LIST"]);
		
		cnt = gDS["DS_CTR_INTP_MTT_LIST"].length;
		
		// validate
		if (cnt <= 0) {
			dcUtil.g_showMessage("NPCE0021","피보험자정보");	// 조회된 피보험자정보 없음
			return false;
		}
	
		gDS["DS_UD_INCT_INTP"] = [];
		
		// 우편물수령지/증권수령지
		var aMaig    = gData.cmbMaigRvpl; // 우편물수령지
		var aInspo   = gData.cmbInspoRvpl;// 증권수령지
		var aRleSecd = "11";				         // 계약자
		
		/*
		 * EVNT_PDT_KNCD :: 이벤트 상품 여부
		 */
		var msg, pGndr, gndr;
		var isEmpty;
		var pymRt;
		var sumRt = 0;
		var samangPymrt1 = 0;
		var samangPymrt2 = 0;
		var samangPymrt3 = 0;
		
		console.log("cnt>>", cnt);
		
		for (var i = 0; i < cnt; i ++) {
			gDS["DS_UD_INCT_INTP"].push({});
			nRow = gDS["DS_UD_INCT_INTP"].length - 1;
	
			nCtrRleSecd 	= gDS["DS_CTR_INTP_MTT_LIST"][i].CTR_RLE_SECD;
			console.log("start", nCtrRleSecd);
			nCsPk       	= gDS["DS_CTR_INTP_MTT_LIST"][i].CS_PK;
			gVAL.csPkEmpty 	= stringUtil.isNull(nCsPk);
			isGrop      	= (stringUtil.isNull(gDS["DS_CTR_INTP_MTT_LIST"][i].RRN)? "":gDS["DS_CTR_INTP_MTT_LIST"][i].RRN).length == 10 ? true: false;
	
			console.log("test111");
			if(nCtrRleSecd=="47"){
				console.log("test222");
				samangPymrt1 = parseInt(gDS["DS_CTR_INTP_MTT_LIST"][i].PYMRT);
			}else if(nCtrRleSecd=="48"){
				console.log("test333");
				samangPymrt2 = parseInt(gDS["DS_CTR_INTP_MTT_LIST"][i].PYMRT);
				if(samangPymrt2 != 0  && samangPymrt1 == 0){
					console.log("test444");
					msg = "사망수익자1의 지급율을";
					dcUtil.g_showMessage("COCE0001", msg);
					return false;
				}
			}else if(nCtrRleSecd=="49"){
				console.log("test555");
				samangPymrt3 = parseInt(gDS["DS_CTR_INTP_MTT_LIST"][i].PYMRT);
				if(samangPymrt3 != 0 && samangPymrt1 == 0){
					console.log("test666");
					msg = "사망수익자1의 지급율을";
					dcUtil.g_showMessage("COCE0001", msg);
					return false;
				}else if(samangPymrt3 != 0 && samangPymrt2 == 0){
					console.log("test777");
					msg = "사망수익자2의 지급율을";
					dcUtil.g_showMessage("COCE0001", msg);
					return false;
				}
			}
			console.log("test888");
	
			switch(gDS["DS_CTR_INTP_MTT_LIST"][i].ESTY_INP_YN) {
				case "1":
					break;
				case "3": 
				case "2": // 여자만 선택가능
					pGndr = gDS["DS_CTR_INTP_MTT_LIST"].lookup("CTR_RLE_SECD", "21", "GNDR_SECD");
	
					if (stringUtil.isNull(pGndr)) {
						dcUtil.g_showMessage("CCCW0028", "주피의 성별정보가 잘못되었습니다.");
						return false;
					} else if (pGndr == "1") { // 주피가 남자이면 종피2에 여자(엄마)를 받는다
						if (stringUtil.isNull(gDS["DS_CTR_INTP_MTT_LIST"][i].CS_PK)) {
							msg = getGubun_DS_CTR_INTP_MTT_LIST(i) + "을(를)";
							dcUtil.g_showMessage("COCE0002", msg); // 선택
							return false;
						}
						
						gndr = gDS["DS_CTR_INTP_MTT_LIST"][i].GNDR_SECD;
						
						if (stringUtil.isNull(gndr)) {
							msg = getGubun_DS_CTR_INTP_MTT_LIST(i) + "의 성별정보가 잘못되었습니다.";
							dcUtil.g_showMessage("CCCW0028", msg);
							return false;
						} else if (gndr != "2") {
							msg = getGubun_DS_CTR_INTP_MTT_LIST(i) + "은(는) 여자만 선택할 수 있습니다.";
							dcUtil.g_showMessage("CCCW0028", msg);
							return false;
						}
					}
					break;
				case "5":
					var rrn = gDS["DS_CTR_INTP_MTT_LIST"].lookup("CTR_RLE_SECD", "21", "RRN");
					var csnam = gDS["DS_CTR_INTP_MTT_LIST"].lookup("CTR_RLE_SECD", "21", "CS_NAM");
					var sCtrRleSecd = gDS["DS_CTR_INTP_MTT_LIST"][i].CTR_RLE_SECD;
					pGndr = gDS["DS_CTR_INTP_MTT_LIST"].lookup("CTR_RLE_SECD", "31", "GNDR_SECD");
					
					if (stringUtil.isNull(pGndr)) {
						dcUtil.g_showMessage("CCCW0028", "종피의 성별정보가 잘못되었습니다.");
						return false;
					} else if (pGndr == "1") { // 주피가 남자이면 종피2에 여자(엄마)를 받는다
						if (stringUtil.isNull(gDS["DS_CTR_INTP_MTT_LIST"][i].CS_PK)) {
							msg = getGubun_DS_CTR_INTP_MTT_LIST(i) + "을(를)";
							dcUtil.g_showMessage("COCE0002", msg); // 선택
							return false;
						}
						
						gndr = gDS["DS_CTR_INTP_MTT_LIST"][i].GNDR_SECD;
						if (stringUtil.isNull(gndr)) {
							msg = getGubun_DS_CTR_INTP_MTT_LIST(i) + "의 성별정보가 잘못되었습니다.";
							dcUtil.g_showMessage("CCCW0028", msg);
							return false;
	
	
						} else if (csnam == "태아" && rrn == "1111111111111" && gndr != "2" && sCtrRleSecd.substring(0, 1) != "4") {
							msg = getGubun_DS_CTR_INTP_MTT_LIST(i) + "은(는) 여자만 선택할 수 있습니다.";
							dcUtil.g_showMessage("CCCW0028", msg);
							return false;
						}
					}
					break;		
			}
			console.log("test999");
			
			if (!gVAL.csPkEmpty) {
				// 주피와의 관계
				if (stringUtil.isNull(gDS["DS_CTR_INTP_MTT_LIST"][i].CS_RLP_SECD)) {
					dcUtil.g_showMessage("COCE0002", getGubun_DS_CTR_INTP_MTT_LIST(i) + "의 주피와의관계를"); // 선택
					return false;
				}
				
				if (nCsPk != "1" && nCsPk != "2") {	
					// 직업
					// np_ShowDataset(DS_CTR_INTP_MTT_LIST);
					if (stringUtil.isNull(gDS["DS_CTR_INTP_MTT_LIST"][i].CPCD)) {
						dcUtil.g_showMessage("COCE0002", getGubun_DS_CTR_INTP_MTT_LIST(i) + "의 직업을"); // 선택
						return false;
					}
					
					if (!isGrop) { // 개인
						// 운전
						if (stringUtil.isNull(gDS["DS_CTR_INTP_MTT_LIST"][i].DRVG_SECD)) {
							dcUtil.g_showMessage("COCE0002", getGubun_DS_CTR_INTP_MTT_LIST(i) + "의 운전을"); // 선택
							return false;
						}
							
						// 국적
						nNatalSecd = gDS["DS_CTR_INTP_MTT_LIST"][i].NATAL_SECD;
						nGndr      = String(gDS["DS_CTR_INTP_MTT_LIST"][i].RRN).substring(6, 7);
						sOsNat     = String(gDS["DS_CTR_INTP_MTT_LIST"][i].RRN).substring(11, 12);
						var sCsName = gDS["DS_CTR_INTP_MTT_LIST"][i].CS_NAM;
						var sty_prid = gDS["DS_CTR_INTP_MTT_LIST"][i].STY_PRID;
						var pbls_ymd = gDS["DS_CTR_INTP_MTT_LIST"][i].PBLS_YMD;

						if (nGndr != "1" && nGndr != "2" && nGndr != "3" && nGndr != "4" && sOsNat != "8") { // 주민번호가
																												// 한국국적이
																												// 아니면
							if (stringUtil.isNull(nNatalSecd)) {
								dcUtil.g_showMessage("COCE0002", getGubun_DS_CTR_INTP_MTT_LIST(i) + "의 국적을"); // 선택
								return false;
							} else if (nNatalSecd != "235") {	// 국적이 한국이 아니면
								if (stringUtil.isNull(gDS["DS_CTR_INTP_MTT_LIST"][i].STY_NAM)) {
									dcUtil.g_showMessage("COCE0002", getGubun_DS_CTR_INTP_MTT_LIST(i) + "의 체류코드를"); // 선택
									return false;
								}
							}
							// 20091014 AML관련 체크 추가
							if (nNatalSecd == "235"){
								dcUtil.g_showMessage("CCSE0041",getGubun_DS_CTR_INTP_MTT_LIST(i)+"의 국적을 확인하시기 바랍니다.");	
								// this.parent.set_tabindex(0);
								return false;
							}
							
							if(stringUtil.isNull(sty_prid)||stringUtil.isNull(pbls_ymd)){
								dcUtil.g_showMessage("CCSE0041",getGubun_DS_CTR_INTP_MTT_LIST(i)+" 발행일자와 체류기간을 입력해주십시오.  외국인의 경우 발행일자와 체류기간은 필수입력 사항입니다.");	
								return false;
							}else if(pbls_ymd>sty_prid){
								dcUtil.g_showMessage("CCSE0041",getGubun_DS_CTR_INTP_MTT_LIST(i)+" 체류기간이 발행일자보다 빠를수는 없습니다.");	
								return false;
							}
							
							if(pbls_ymd > dateUtil.getDate()){
								dcUtil.g_showMessage("CCSE0041",getGubun_DS_CTR_INTP_MTT_LIST(i)+" 처리일이 발행일자보다 빠를수는 없습니다.");	
								return false;
							}
						} else {
							gDS["DS_CTR_INTP_MTT_LIST"][i].NATAL_SECD = "235";
							gDS["DS_CTR_INTP_MTT_LIST"][i].NATAL_SENM = "한국";
						}
					}
				}
				
				console.log("here>>", nCtrRleSecd);
				
				// 사망수익자 지급비율
				if (nCtrRleSecd == "47" || nCtrRleSecd == "48" || nCtrRleSecd == "49") {
					pymRt = parseInt(gDS["DS_CTR_INTP_MTT_LIST"][i].PYMRT);
					console.log("pymRt>>", pymRt + "::" + gVAL.csPkEmpty);
					if (!gVAL.csPkEmpty && pymRt <= 0) {
						msg = getGubun_DS_CTR_INTP_MTT_LIST(i) + "의";
						dcUtil.g_showMessage("CCCE0006", msg); // 지급율0
						return false;
					}
					sumRt += pymRt;
				}
			}
	
			gDS["DS_UD_INCT_INTP"][nRow].INCT_INTPSCTN 			=   nCtrRleSecd;												// 계약관계자구분
			gDS["DS_UD_INCT_INTP"][nRow].RES_REG_NO 			=   gDS["DS_CTR_INTP_MTT_LIST"][i].RRN;					// 주민번호
			gDS["DS_UD_INCT_INTP"][nRow].CS_NAM 				=   gDS["DS_CTR_INTP_MTT_LIST"][i].CS_NAM;													// 고객명
			gDS["DS_UD_INCT_INTP"][nRow].CSID 					=   "";														// 고객PK
			gDS["DS_UD_INCT_INTP"][nRow].CHN_CSID 				=   gDS["DS_CTR_INTP_MTT_LIST"][i].CS_PK;				// 채널고객PK
			gDS["DS_UD_INCT_INTP"][nRow].XCLCLV_YN 				=   gDS["DS_CTR_INTP_MTT_LIST"][i].XCLCLV_APPL_YN;		// 우량피보험체여부
			gDS["DS_UD_INCT_INTP"][nRow].MAIPSN_RLP 			=   gDS["DS_CTR_INTP_MTT_LIST"][i].CS_RLP_SECD;			// 주피와의관계
			gDS["DS_UD_INCT_INTP"][nRow].AGE 					=   gDS["DS_CTR_INTP_MTT_LIST"][i].PRCMPAG;				// 보험나이
			gDS["DS_UD_INCT_INTP"][nRow].FUL_AGE 				=   "";														// 만나이
			gDS["DS_UD_INCT_INTP"][nRow].GENDER 				=   gDS["DS_CTR_INTP_MTT_LIST"][i].GNDR_SECD;			// 성별
			gDS["DS_UD_INCT_INTP"][nRow].DTH_BNFC_RTO 			=   gDS["DS_CTR_INTP_MTT_LIST"][i].PYMRT;				// 사망수익자비율
			gDS["DS_UD_INCT_INTP"][nRow].OCPT_KND 				=   gDS["DS_CTR_INTP_MTT_LIST"][i].CPCD;				// 직업코드
			gDS["DS_UD_INCT_INTP"][nRow].OCPT_PEL_GRDE_COD 		=   gDS["DS_CTR_INTP_MTT_LIST"][i].OCPT_PEL_GRDE_COD;	// 직업위험등급
			gDS["DS_UD_INCT_INTP"][nRow].OCPT_INJ_PEL_GRDE_COD 	= 	gDS["DS_CTR_INTP_MTT_LIST"][i].OCPT_INJ_PEL_GRDE_COD;// 직업상해등급
			gDS["DS_UD_INCT_INTP"][nRow].DRVG_SECD 				=   gDS["DS_CTR_INTP_MTT_LIST"][i].DRVG_SECD;			// 운전코드
			gDS["DS_UD_INCT_INTP"][nRow].DRVG_PEL_GRDE_COD 		=   gDS["DS_CTR_INTP_MTT_LIST"][i].DRVG_PEL_GRDE_COD;	// 운전위험등급
			gDS["DS_UD_INCT_INTP"][nRow].HMBD_OBS_COD 			=   gDS["DS_CTR_INTP_MTT_LIST"][i].OBS_GRDE_COD;		// 장애등급코드
			gDS["DS_UD_INCT_INTP"][nRow].NATAL_SECD 			=   gDS["DS_CTR_INTP_MTT_LIST"][i].NATAL_SECD;			// 국적코드
			gDS["DS_UD_INCT_INTP"][nRow].STY_COD 				=   gDS["DS_CTR_INTP_MTT_LIST"][i].STY_COD;				// 체류코드
			gDS["DS_UD_INCT_INTP"][nRow].MAIG_RVPL 				=   nCtrRleSecd == aRleSecd ? aMaig : "";					// 우편물수령지
			gDS["DS_UD_INCT_INTP"][nRow].INSPO_RVPL 			=   nCtrRleSecd == aRleSecd ? aInspo: "";					// 증권수령지
			gDS["DS_UD_INCT_INTP"][nRow].PBLS_YMD 				=   gDS["DS_CTR_INTP_MTT_LIST"][i].PBLS_YMD;			// 발급일자
			gDS["DS_UD_INCT_INTP"][nRow].STY_PRID 				=   gDS["DS_CTR_INTP_MTT_LIST"][i].STY_PRID;			// 체류기간
			
			var sIntpExist = "N";
			var nRowAml = 0;
			
			if (String(gDS["DS_UD_INCT_INTP"][nRow].INCT_INTPSCTN).substring(0, 1) == "1" ||
				String(gDS["DS_UD_INCT_INTP"][nRow].INCT_INTPSCTN).substring(0, 1) == "4") {
	
				for (var x = 0 ; x < gDS["DS_UD_INCT_INTP_AML"].length ; x++) {
					if (gDS["DS_UD_INCT_INTP_AML"][x].RES_REG_NO == gDS["DS_CTR_INTP_MTT_LIST"][i].RRN) {
						sIntpExist  = "Y";
					}
				}
				if (sIntpExist == "N") {
					gDS["DS_UD_INCT_INTP_AML"].push({});
					nRowAml = gDS["DS_UD_INCT_INTP_AML"].length-1;
					dcUtil.copyArrayRow(gDS["DS_UD_INCT_INTP_AML"], nRowAml, gDS["DS_UD_INCT_INTP"], nRow);	
				}
			}
		}
	
		for (var xx = 0 ; xx < gDS["DS_UD_INCT_INTP_AML"].length ; xx++) {
			D.logger.debug("DS_UD_INCT_INTP_AML:"+ gDS["DS_UD_INCT_INTP_AML"][xx].RES_REG_NO)
		}
		if (sumRt != 100) {
			dcUtil.g_showMessage("CCCE0007", "사망수익자의"); // 지급율합은100
			return false;
		}
		return true;
	};
	
	/*
	 * 주계약관계자사항의 구분 컬럼 값을 가져온다.
	 */
	function getGubun_DS_CTR_INTP_MTT_LIST(i){
		switch(i){
			case "0":
			case 0:
				return "계약자";
			break;
			case "1":
			case 1:
				return "주피보험자";
			break;
			case "2":
			case 2:
				return "만기수익자";
			break;
			case "3":
			case 3:
				return "장해수익자";
			break;
			case "4":
			case 4:
				return "사망수익자";
			break;
		}
	};
	
	
	function setFocus(tag){
		if(!stringUtil.isNull(tag)){
	    	tag.focus();
		}
	}
	
	// 적합성 진단 조회
	function selectInsCtrPrpsCd() {
		var defer = $.Deferred();
		
		var pdtSecd = gDS["DS_QTT_BAS"][0].MPRD_PDT_SECD;
		if(pdtSecd == '03' || pdtSecd == '06' || pdtSecd == '09'){
			var paramCd = {};

			paramCd.FC_ADMN_CS_PK 	= global_FC_ADMN_CS_PK;
			
			if(stringUtil.isNull(global_FC_ADMN_CS_PK)){
				dialog.alert("청약 입력 조회중 오류가 발생하였습니다.(FC_ADMN_CS_PK)");
				return false;
				
			}

			D.http.ajax('/su/mblSus/selectInsCtrPrpsCd',paramCd).then(function(data){ 
				
				if(stringUtil.isNull(data.result.INS_CTR_PRPS_CD)){
					dialog.alert("적합성 진단 결과 미 존재시 변액상품을 선택할 수 없습니다.");
				     defer.reject();
					
				}
				
				if(pdtSecd != data.result.INS_CTR_PRPS_CD){
					dialog.alert("상품 성향과 맞는 상품을 선택 할 수 있습니다.[임시문구]");
				     defer.reject();
				}
				
                defer.resolve();

			});
		}

		return defer.promise();
	}// saveAcctCard(gFdBank).then(function() {

	
		/**
		 * 유효성검증 STEP 1
		 */
	function validateStep1(){
		var selected_dspsCh = $("[name=dspsCh]:checked").val();
		
	   	if(	$("#FNC_SPND_CD_Y").prop('checked') && $("[name=chkX]:checked").length == 0){
	   		
				dialog.alert("보험 계약자가 소속된 단체 &middot;법인/등록회사 유형을 선택해주세요.");
				setFocus($("[name=chkX]").eq(0));
		   		return false; 
		  }
		
		// 장애인 보험 validation 체크
		if($("[name=dsps]:checked").val() == "1"){
			
			 var stDate = $("#maipsn_end_date").val();
			 var stDate1 = $("#expi_end_date").val();
			 var stDate2 = $("#hspz_end_date").val();
			 var stDate3 = $("#dth_end_date").val();

			if(selected_dspsCh == "01"){
				
				if(dateUtil.getDate().replace(/^([0-9]{4})([0-9]{2})([0-9]{2})/g, "$1-$2-$3") == stDate){
					dialog.alert("계약일자를 포함한 이전 날짜로는 신청이 불가합니다.", "확인");
// setFocus($("#maipsn_end_date"));
					return false;
				}
				if(!dateUtil.isDate(stDate.replace(/( |-)/g, ""))){
					dialog.alert("유효하지 않은 날짜입니다", "확인");
// setFocus($("#maipsn_end_date"));
					return false;
				}
			
			}else if(selected_dspsCh == "02"){
				if(dateUtil.getDate().replace(/^([0-9]{4})([0-9]{2})([0-9]{2})/g, "$1-$2-$3") == stDate1){
					dialog.alert("계약일자를 포함한 이전 날짜로는 신청이 불가합니다.", "확인");
// setFocus($("#expi_end_date"));
					return false;
				}
				if(dateUtil.getDate().replace(/^([0-9]{4})([0-9]{2})([0-9]{2})/g, "$1-$2-$3") == stDate2){
					dialog.alert("계약일자를 포함한 이전 날짜로는 신청이 불가합니다.", "확인");
// setFocus($("#hspz_end_date"));
					return false;
				}
				if(dateUtil.getDate().replace(/^([0-9]{4})([0-9]{2})([0-9]{2})/g, "$1-$2-$3") == stDate3){
					dialog.alert("계약일자를 포함한 이전 날짜로는 신청이 불가합니다.", "확인");
// setFocus($("#dth_end_date"));
					return false;
				}
				if(!dateUtil.isDate(stDate1.replace(/( |-)/g, ""))){
					dialog.alert("유효하지 않은 날짜입니다.", "확인");
// setFocus($("#expi_end_date"));
					return false;
				}
				if(!dateUtil.isDate(stDate2.replace(/( |-)/g, ""))){
					dialog.alert("유효하지 않은 날짜입니다.", "확인");
					setFocus($("#hspz_end_date"));
					return false;
				}
				if(!dateUtil.isDate(stDate3.replace(/( |-)/g, ""))){
					dialog.alert("유효하지 않은 날짜입니다.", "확인");
// setFocus($("#dth_end_date"));
					return false;
				}
			
			}else{
				dialog.alert("장애인 전용보험 신청시 주피보험자 또는 수익자 중 하나를 선택하세요.", "확인");
// setFocus($("[name=dspsCh]").eq(0)[0]);
				return false;
			}
		}
		
		if($("[name=sMblSusSecd]:checked").val() == "02"){
			/*
			 * 계피 동일이므로 계약자만 설계사 인지 체크
			 */
			if (D.global.getUserInfo('empno') != 'A3993172'
				&& D.global.getUserInfo('empno') != 'A2993304' // A2993241 >허성렬 변경
				&& D.global.getUserInfo('empno') != 'A2993328' // A2993241 >이준호 변경
				&& D.global.getUserInfo('empno') != 'AA013169'
				&& D.global.getUserInfo('empno') != 'A3993160'
				&& D.global.getUserInfo('empno') != 'A3993202' // A3993269 >임경화 변경
					&& D.global.getUserInfo('empno') != 'A2993284'
						&& D.global.getUserInfo('empno') != 'A3993155') {	// 20180719 김혜진차장 요청 : 김혜진차장 사번은 설계사 본인계약되도록, 이 사번이 아닐 경우만 체크함
				
				if(D.global.getUserInfo('plarsocposcod') != "AE") { // 20201114 김혜진부장 요청 : GA 지점장 제외
					if(gVAL.isPohdStaf){ // 계약자가 설계사 이면
						dialog.alert("FC 본인계약은 옴니청약으로 처리가 불가합니다.");
						setFocus($("[name=sMblSusSecd]").eq(0)[0]);
						return false;
					}
				}
			}

/*
 * TODO [모바일고도화] : D+3일로 체크, 전자청약과 동일 콤보자체가 3일만 나오면 체크로직 없애면 됨 계약일자가 당일인 건만 체크
 * 
 * if(gVAL.stdYmd != dateUtil.getDate()){ dialog.confirm('옴니청약은 계약일자가 당일인 건만 처리가
 * 가능합니다. 현재 일자로 변경 하시겠습니까?').then(function(value) { if ('YES' == value) {
 * $("#cmbCtymd").val(dateUtil.getDate()); $("#cmbCtymd").trigger('change'); }
 * }); return false; }
 */
		}
		
		if(dateUtil.getDate() > $("#cmbCtymd").val() ){
			dialog.alert("계약일자는 현재일보다 이후 날짜만 가능합니다. \n\n 계약일자를 수정 또는 가입제안을 재처리한 후 청약입력진행하여 주시기바랍니다.");
			setFocus($("#cmbCtymd")[0]);
			return false;
		}

		// 상품정보
		if (required(gVAL.cmbPdtSecd,  "상품구분"))
		{
			return false;
		}
		if (required(gVAL.cmbRpsPrdcd, "대표상품"))
		{
			return false;
		}
		if (required(gVAL.cmbPrdcd,    "상품"))
		{
			return false;
		}
		if (required(gVAL.stdYmd, "계약일자"))
		{
			return false;
		}
		
		return true;
	};
	
	/**
	 * 유효성검증 STEP 2
	 */
	function validateStep2(stat){
		console.log("valid>>>", gDS["DS_CTR_INTP_MTT_LIST"]);
		
		var arr_CS_RLP_SECD_IS_NULL =  $.grep(gDS["DS_CTR_INTP_MTT_LIST"], function(objTmp){

			/*
			 * 계약자, 피보험자, 만기수익자, 장해수익자, 사망수익자 에서만 [고객관계구분코드]를 체크
			 */
			if(
				objTmp.CTR_RLE_SECD == "11"  ||				// 계약자
				objTmp.CTR_RLE_SECD == "21"  ||				// 피보험자
				(objTmp.CTR_RLE_SECD == "41"  && !stringUtil.isNull(objTmp.CS_PK)) ||	// 만기수익자
				(objTmp.CTR_RLE_SECD == "42"  && !stringUtil.isNull(objTmp.CS_PK)) ||	// 장해수익자
		 		objTmp.CTR_RLE_SECD == "47"  				// 사망수익자
			){
				if(objTmp.CS_PK != "1"){	// 계약자 이거나 피보험자 이고
					if(stringUtil.isNull(objTmp.CS_RLP_SECD)){ 	// 관계 코드가 null
																// 이면 반환
						return true;
					}
				}
			}
		});
		
		console.log("arr_CS_RLP_SECD_IS_NULL>>",arr_CS_RLP_SECD_IS_NULL);
		
		if(arr_CS_RLP_SECD_IS_NULL.length > 0 ) { // [고객관계구분코드]가 null 인게 있으면
			dialog.alert("주피와의 관계를 선택해주세요.");
			return false; 
		}

		// 계약관계자
		if (gDS["DS_CTR_INTP_MTT_LIST"].length <= 0 ) {
			dialog.alert("주피와의 관계를 선택해주세요.");
			return false;
		}

		// 계.피.수 주민번호 arr temp
		var arrCsRrnTmp = new Array();
		
		var val_RRN_11 =  gDS["DS_CTR_INTP_MTT_LIST"].find( function(o){if(o.CTR_RLE_SECD == '11')return true;} ).RRN;
		var val_adult_YN_11  = (dateUtil.getRealAge(val_RRN_11) > 18) ? true : false ;	// 계약자
																						// 성인여부
		arrCsRrnTmp.push(val_RRN_11);
		
		var val_RRN_21 =  gDS["DS_CTR_INTP_MTT_LIST"].find( function(o){if(o.CTR_RLE_SECD == '21')return true;} ).RRN;
		var val_adult_YN_21  = (dateUtil.getRealAge(val_RRN_21) > 18) ? true : false ;	// 피보험자
																						// 성인여부
		arrCsRrnTmp.push(val_RRN_21);
		
		var val_RRN_41 =  gDS["DS_CTR_INTP_MTT_LIST"].find( function(o){if(o.CTR_RLE_SECD == '41')return true;} ).RRN;
		var val_adult_YN_41  = (dateUtil.getRealAge(val_RRN_41) > 18) ? true : false ;	// 만기수익자
																						// 성인여부
		arrCsRrnTmp.push(val_RRN_41);
		
		var val_RRN_42 =  gDS["DS_CTR_INTP_MTT_LIST"].find( function(o){if(o.CTR_RLE_SECD == '42')return true;} ).RRN;
		var val_adult_YN_42  = (dateUtil.getRealAge(val_RRN_42) > 18) ? true : false ;	// 장해수익자
																						// 성인여부
		arrCsRrnTmp.push(val_RRN_42);
		
		var val_RRN_47_obj =  gDS["DS_CTR_INTP_MTT_LIST"].find( function(o){if(o.CTR_RLE_SECD == '47' && o.RRN != "1111111111111")return true;} );
		var val_adult_YN_47  = true;	// 사망수익자 성인여부
		if (!stringUtil.isNull(val_RRN_47_obj)) {
			val_adult_YN_47  = (dateUtil.getRealAge(val_RRN_47_obj.RRN) > 18) ? true : false ;	// 사망수익자성인여부
			arrCsRrnTmp.push(val_RRN_47_obj.RRN);
		}
		
		if( val_adult_YN_11 && val_adult_YN_21){ // 계약자(성인), 피보험자(성인)
			var val_CS_RLP_SECD_11 =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == '11')return true;}).CS_RLP_SECD;
			
			if(
					val_CS_RLP_SECD_11 != 1  	/* 본인 */ 
				&&	val_CS_RLP_SECD_11 != 2  	/* 배우자 */ 
				&&  val_CS_RLP_SECD_11 != 3  	/* 부모 */ 
				&&  val_CS_RLP_SECD_11 != 4  	/* 자녀 */ 
				&&  val_CS_RLP_SECD_11 != 5  	/* 조부모 */ 
				&&  val_CS_RLP_SECD_11 != 6  	/* 손주 */ 
				&&  val_CS_RLP_SECD_11 != 7  	/* 형제자매, 2020.10.16 추가 */
				&&  val_CS_RLP_SECD_11 != 9		/* 외조부모, 2025.08.29 추가*/ 
			){
				dialog.alert("모바일 계약관계자 허용 범위가 아닙니다.<br/>배우자 및 직계존비속, 형제자매만 가능합니다.");
				return false; 
			}
		}
		
		if( !val_adult_YN_11 && val_adult_YN_21){ // 계약자(미성년자) , 피보험자(성인)
			var val_CS_RLP_SECD_11 =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == '11')return true;}).CS_RLP_SECD; // 계약자관계[4:자녀]
			if(gVAL["HOExp"]) {
				/** 스타트 PRO 주계약
				 *	계약자:조부모/외조부모/부모 - 피보험자:미성년자녀/미성년손자
				 *	계약자:미성년자녀/미성년손자 - 피보험자:조부모/외조부모/부모 @
				 *	계약자:미성년손자 - 피보험자:조부모/외조부모 >> 수익자에 계/피 외 친권자만 가능
				 **/
				if(		val_CS_RLP_SECD_11 != "4"	/* 자녀 */
					&&  val_CS_RLP_SECD_11 != "6"	/* 손주 */
				){
					dialog.alert("모바일 미성년자 계약은 계피관계가 부모/자녀 또는 조부모/손자인 경우에 한해 청약 가능합니다.");
					return false;
				}
				
				//계약자:미성년손자 - 피보험자:조부모/외조부모 >> 수익자에 계/피 외 친권자만 가능(사망수익자는 법정대리인O)
				if(val_CS_RLP_SECD_11 == "6") {
					
					var csRlpChk47 = true;
					if (!stringUtil.isNull(val_RRN_47_obj)) {
						if( val_RRN_11 != val_RRN_47_obj.RRN && val_RRN_21 != val_RRN_47_obj.RRN && val_RRN_47_obj.RRN != '1111111111111') {
							csRlpChk47 = false;	//계피랑 다른사람
						}
					}
					
					var val_CS_PK_41 =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == '41')return true;}).CS_PK;
					var val_CS_PK_42 =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == '42')return true;}).CS_PK;
					var val_CS_PK_47 =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == '47')return true;}).CS_PK;
					
					var chk41 = false;
					var chk42 = false;
					var chk47 = false;
					if($("#rlpParentPk").find("option[value=" + val_CS_PK_41 + "]").length > 0) {
						chk41 = true;
			        }
					if($("#rlpParentPk").find("option[value=" + val_CS_PK_42 + "]").length > 0) {
						chk42 = true;
			        }
					if($("#rlpParentPk").find("option[value=" + val_CS_PK_47 + "]").length > 0) {
						chk47 = true;
			        }
					
					console.log("chk41 >> " + chk41);
					console.log("chk42 >> " + chk42);
					console.log("chk47 >> " + chk47);
					
					if(
							(val_RRN_11 != val_RRN_41 && val_RRN_21 != val_RRN_41 && !chk41)	/* 만기 */
						||  (val_RRN_11 != val_RRN_42 && val_RRN_21 != val_RRN_42 && !chk42)	/* 장해 */
						||  (!csRlpChk47 && !chk47 && val_CS_RLP_SECD_47 != "14")				/* 사망수익자 = 법정상속인 또는 부모 */
					){
						dialog.alert("iM스타트PRO변액연금보험의 계피 외 수익자는 미성년자의 부모만 가능합니다.");
						return false;
					}
				}
			} else {
				if(val_CS_RLP_SECD_11 != "4"){ // 계약자와의 관계는 [4: 자녀] 이어야만 함
					dialog.alert("모바일 미성년자 계약은 계피관계가 부모/자녀인 경우에 한해 청약 가능합니다.");
					return false;
				}
			}
		}
		
		if( val_adult_YN_11 && !val_adult_YN_21){ // 계약자(성인) , 피보험자(미성년자)
			var val_CS_RLP_SECD_11 =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == '11')return true;}).CS_RLP_SECD; // 계약자관계[4:자녀]
			
			if(gVAL["HOExp"]) {
				/** 스타트 PRO + 납입면제특약
				 *	계약자:조부모/외조부모/부모 - 피보험자:자녀/손자
				 *	계약자:미성년손자 - 피보험자:조부모/외조부모 >> 수익자에 계/피 외 친권자만 가능
				 **/
				if(
						val_CS_RLP_SECD_11 != 3	/* 부모 */ 
					&&	val_CS_RLP_SECD_11 != 5	/* 조부모 */ 
					&&	val_CS_RLP_SECD_11 != 9	/* 외조부모 */
				){
					dialog.alert("iM 스타트PRO변액연금 뉴보험료납입면제특약의 계약자(종피보험자)는 피보험자의 부모, 조부모, 외조부모만 가능합니다.");
					return false; 
				}
				
				//계약자:미성년손자 - 피보험자:조부모/외조부모 >> 수익자에 계/피 외 친권자만 가능
				if(val_CS_RLP_SECD_11 == "5" || val_CS_RLP_SECD_11 == "9") {

					var csRlpChk47 = true;
					if (!stringUtil.isNull(val_RRN_47_obj)) {
						if( val_RRN_11 != val_RRN_47_obj.RRN && val_RRN_21 != val_RRN_47_obj.RRN && val_RRN_47_obj.RRN != '1111111111111') {
							csRlpChk47 = false;	//계피랑 다른사람
						}
					}
					var val_CS_RLP_SECD_41 =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == '41')return true;}).CS_RLP_SECD;
					var val_CS_RLP_SECD_42 =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == '42')return true;}).CS_RLP_SECD;
					var val_CS_RLP_SECD_47 =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == '47')return true;}).CS_RLP_SECD;
					
					if(
							(val_RRN_11 != val_RRN_41 && val_RRN_21 != val_RRN_41 && val_CS_RLP_SECD_41 != "3")	/* 만기 */
						||  (val_RRN_11 != val_RRN_42 && val_RRN_21 != val_RRN_42 && val_CS_RLP_SECD_42 != "3")	/* 장해 */
						||  (!csRlpChk47 && val_CS_RLP_SECD_47 != "3" && val_CS_RLP_SECD_47 != "14")			/* 사망수익자 = 법정상속인 또는 부모 */
					){
						dialog.alert("iM스타트PRO변액연금보험의 계피 외 수익자는 미성년자의 부모만 가능합니다.");
						return false;
					}
				}
				
			} else {
				if(val_CS_RLP_SECD_11 != "3"){ // 계약자와의 관계는 [3: 직계부모] 이어야만 함
					dialog.alert("모바일 미성년자 계약의 경우 계약자는 부모로 한정 합니다.");
					return false;
				}
			}
		}
		
		// 계/피 외 제3자는 1명만 가능
		// 계.피.수 주민번호 arr
		var arrCsRrn = Array.from(new Set(arrCsRrnTmp));
		console.log("arrCsRrn<<",arrCsRrn);
		
		// 2021.04.29 계피동일과 계피상이 구분
		if( val_RRN_11 != val_RRN_21){
			if(arrCsRrn.length > 3) {
				dialog.alert("계약자/피보험자 외 제 3자 수익자 지정은 1명에 한해 가능합니다.");
				return false;
			}
		}else if(val_RRN_11 == val_RRN_21){
			if(arrCsRrn.length > 2) {
				dialog.alert("계약자/피보험자 외 제 3자 수익자 지정은 1명에 한해 가능합니다.");
				return false;
			}
		}
		// 피보험자가 미성년이면 수익자는 미성년일 수 없다.
		/*
		 * console.log("피보험자가미성년인경우>>", val_adult_YN_21 +"::" + val_adult_YN_41 +
		 * "::" +val_adult_YN_42); if(!val_adult_YN_21 && (!val_adult_YN_41 ||
		 * !val_adult_YN_42)){ // 피보험자(미성년자) , 수익자(미성년) dialog.alert("피보험자가
		 * 미성년자인 경우 수익자는 성인으로 한정 합니다."); return false; }
		 */
		

		// 1. 계피동일 수익자 미성년의 경우 피보가 본인 또는 부모
		if(val_RRN_11 == val_RRN_21) {
			if(!val_adult_YN_41){ // 만기수익자(미성년자)
				var val_CS_RLP_SECD_41 =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == '41')return true;});
				if(!(val_CS_RLP_SECD_41.CS_RLP_SECD == "4" || val_CS_RLP_SECD_41.RRN == val_RRN_21)){ 
					dialog.alert("미성년의 제 3자 수익자 지정은 피보험자와 '친권자/자녀' 관계일 경우에 한하여 가능합니다.");
					return false;
				}
			}
			if(!val_adult_YN_42){ // 장해수익자(미성년자)
				var val_CS_RLP_SECD_42 =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == '42')return true;});
				if(!(val_CS_RLP_SECD_42.CS_RLP_SECD == "4" || val_CS_RLP_SECD_42.RRN == val_RRN_21)){ 
					dialog.alert("장해수익자가 미성년인 경우 자녀이거나 피보험자여야 합니다.");
					return false;
				}
			}
			if(!val_adult_YN_47){ // 사망수익자(미성년자)
				var val_CS_RLP_SECD_47 =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == '47')return true;});
				if(val_CS_RLP_SECD_47.CS_RLP_SECD != "4"){ 
					dialog.alert("사망수익자가 미성년인 경우 자녀여야 합니다.");
					return false;
				}
			}
		} else {
			// 2. 계피상이 수익자 미성년인 경우 피보가 부모
			if(!val_adult_YN_41){ // 만기수익자(미성년자)
				var val_CS_RLP_SECD_41 =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == '41')return true;});
				if(!(val_CS_RLP_SECD_41.CS_RLP_SECD == "4"  || val_CS_RLP_SECD_41.RRN == val_RRN_21 || val_CS_RLP_SECD_41.RRN == val_RRN_11)){ 
					dialog.alert("미성년의 제 3자 수익자 지정은 피보험자와 '친권자/자녀' 관계일 경우에 한하여 가능합니다.");
					return false;
				}
			}
			if(!val_adult_YN_42){ // 장해수익자(미성년자)
				var val_CS_RLP_SECD_42 =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == '42')return true;});
				if(!(val_CS_RLP_SECD_42.CS_RLP_SECD == "4" || val_CS_RLP_SECD_42.RRN == val_RRN_21 || val_CS_RLP_SECD_42.RRN == val_RRN_11)){ 
					dialog.alert("장해수익자가 미성년인 경우 자녀여야 합니다.");
					return false;
				}
			}
			if(!val_adult_YN_47){ // 사망수익자(미성년자)
				var val_CS_RLP_SECD_47 =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == '47')return true;});
				if(val_CS_RLP_SECD_47.CS_RLP_SECD != "4"){ 
					dialog.alert("사망수익자가 미성년인 경우 자녀여야 합니다.");
					return false;
				}
			}
		}
		
		var val_CS_RLP_SECD_41 =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == '41')return true;}).CS_RLP_SECD;
		if(
				val_CS_RLP_SECD_41 != 1  	/* 본인 */ 
			&&	val_CS_RLP_SECD_41 != 2  	/* 배우자 */ 
			&&  val_CS_RLP_SECD_41 != 3  	/* 부모 */ 
			&&  val_CS_RLP_SECD_41 != 4  	/* 자녀 */ 
			&&  val_CS_RLP_SECD_41 != 5  	/* 조부모 */ 
			&&  val_CS_RLP_SECD_41 != 6  	/* 손주 */ 
			&&  val_CS_RLP_SECD_41 != 7  	/* 형제자매 */
			&&  val_CS_RLP_SECD_41 != 9  	/* 외조부모 */
		){
			dialog.alert("모바일 계약관계자 허용 범위가 아닙니다.<br/>배우자 및 직계존비속, 형제자매만 가능합니다.");
			return false; 
		}
		var val_CS_RLP_SECD_42 =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == '42')return true;}).CS_RLP_SECD;
		if(
				val_CS_RLP_SECD_42 != 1  	/* 본인 */ 
			&&	val_CS_RLP_SECD_42 != 2  	/* 배우자 */ 
			&&  val_CS_RLP_SECD_42 != 3  	/* 부모 */ 
			&&  val_CS_RLP_SECD_42 != 4  	/* 자녀 */ 
			&&  val_CS_RLP_SECD_42 != 5  	/* 조부모 */ 
			&&  val_CS_RLP_SECD_42 != 6  	/* 손주 */ 
			&&  val_CS_RLP_SECD_42 != 7  	/* 형제자매 */
			&&  val_CS_RLP_SECD_42 != 9  	/* 외조부모 */
		){
			dialog.alert("모바일 계약관계자 허용 범위가 아닙니다.<br/>배우자 및 직계존비속, 형제자매만 가능합니다.");
			return false; 
		}
		var val_CS_RLP_SECD_47 =  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){if(o.CTR_RLE_SECD == '47' && o.RRN != "1111111111111")return true;});
		if(!stringUtil.isNull(val_CS_RLP_SECD_47) 
			&&	val_CS_RLP_SECD_47.CS_RLP_SECD != 1  	/* 본인 */ 
			&&	val_CS_RLP_SECD_47.CS_RLP_SECD != 2  	/* 배우자 */ 
			&&  val_CS_RLP_SECD_47.CS_RLP_SECD != 3  	/* 부모 */ 
			&&  val_CS_RLP_SECD_47.CS_RLP_SECD != 4  	/* 자녀 */ 
			&&  val_CS_RLP_SECD_47.CS_RLP_SECD != 5  	/* 조부모 */ 
			&&  val_CS_RLP_SECD_47.CS_RLP_SECD != 6  	/* 손주 */ 
			&&  val_CS_RLP_SECD_47.CS_RLP_SECD != 7  	/* 형제자매 */
			&&  val_CS_RLP_SECD_47.CS_RLP_SECD != 9  	/* 외조부모 */
		){
			dialog.alert("모바일 계약관계자 허용 범위가 아닙니다.<br/>배우자 및 직계존비속, 형제자매만 가능합니다.");
			return false; 
		}
		
		var tmpIdx1 = gDS["DS_CTR_INTP_MTT_LIST"].findIndex( function(o){if(o.CTR_RLE_SECD == "41")return true;} );// 만기수익자
		var tmpIdx2 = gDS["DS_CTR_INTP_MTT_LIST"].findIndex( function(o){if(o.CTR_RLE_SECD == "42")return true;} );// 장해수익자
		var tmpIdx3 = gDS["DS_CTR_INTP_MTT_LIST"].findIndex( function(o){if(o.CTR_RLE_SECD == "47")return true;} );// 사망수익자
		
		var rowNum  = 0;
		// 계약관게자 체크 - 상품선택 후
		if( ( tmpIdx1 != -1 && stringUtil.isNull(gDS["DS_CTR_INTP_MTT_LIST"][tmpIdx1].CS_PK) )
		 || ( tmpIdx2 != -1 && stringUtil.isNull(gDS["DS_CTR_INTP_MTT_LIST"][tmpIdx2].CS_PK) )
		 || ( tmpIdx3 != -1 && stringUtil.isNull(gDS["DS_CTR_INTP_MTT_LIST"][tmpIdx3].CS_PK) ) )
		{
			rowNum = ( tmpIdx1 != -1 && stringUtil.isNull(gDS["DS_CTR_INTP_MTT_LIST"][tmpIdx1].CS_PK) ) ? tmpIdx1 :
			         ( tmpIdx2 != -1 && stringUtil.isNull(gDS["DS_CTR_INTP_MTT_LIST"][tmpIdx2].CS_PK) ) ? tmpIdx2 :
			         ( tmpIdx3 != -1 && stringUtil.isNull(gDS["DS_CTR_INTP_MTT_LIST"][tmpIdx3].CS_PK) ) ? tmpIdx3 : 0;
			dialog.alert('수익자 정보를 입력하시기 바랍니다.');
			return false;
		}
		
		// 이전으로 돌아갈땐 아래는 체크하지 않음
		if(!stringUtil.isNull(stat) && stat == "PRE") {
			return true;
		}
		
		// 장애인 보험 validation 체크
		if(gData.dsps == "1"){
			if(gData.dspsCh == "02"){
				if("1" == $("#sel_csPk_47").val()){
					dialog.alert("사망수익자가 법정상속인 인 경우<br>장애인전용보험 신청이 불가합니다.", "확인");
					return false;
				}
			}
		}

		// 친권자 정보가 입력되지않은 경우에 제어
  		var rpClassName = $("#rlpParent").attr("class")
		if(rpClassName.indexOf("none") < 0){
			var selectedRlp = $("#rlpParentPk option:selected").val();
			if(selectedRlp == null){
				dialog.alert("친권자 정보가 존재하지 않습니다. 피보험자와 수익자의 관계가 바르게 입력되었는지 확인해주시기 바랍니다.");
				return false;
			}
		}
		
	    // 해피콜 종류
	    /*
		 * 해피콜 종류
		 * -----------------------------------------------------------------------------------------------------------------------------
		 * 계피 동일에 && 핸드폰 번호가 없는경우 => 모바일 해피콜 진행 불가 계피 상이 && 둘다 성인 && 핸드폰 번호가 같으면 =>
		 * "계약자/피보험자 휴대폰번호가 동일 합니다. 고객정보에서 휴대폰 번호 수정 후 진행하시길 바랍니다."
		 */
	    var obj_11_RRN 		=  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){ if(o.CTR_RLE_SECD == '11')return true;}).RRN; // 계약자
																															// 정보
	    var obj_21_RRN 		=  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){ if(o.CTR_RLE_SECD == '21')return true;}).RRN; // 피보험자
																															// 정보
	    var val_11_realAge 	=  dateUtil.getRealAge(obj_11_RRN);
		var val_21_realAge 	=  dateUtil.getRealAge(obj_21_RRN);
		
		// 계피 동일에 && 계약자 핸드폰 번호가 없는 경우
		if(	
				(obj_11_RRN == obj_21_RRN) 		/* 계피동일 */
			&& 	(stringUtil.isNull(gVAL.HP_POHD))  	/*
													 * 계피동일이니 핸드폰이 같으므로 계약자 것만
													 * 확인
													 */
		) {
			dialog.alert("고객정보에서 휴대폰 번호 등록 후 진행하시길 바랍니다.");
			return false;
			
		}

		// 계피 상이 && 둘다 성인 && 핸드폰 번호가 같으면 => "계약자/피보험자 휴대폰번호가 동일 합니다. 고객정보에서 휴대폰
		// 번호 수정 후 진행하시길 바랍니다."
		if(
				(obj_11_RRN != obj_21_RRN)	
			&&  (parseInt(val_11_realAge) >= 19  && parseInt(val_21_realAge) >= 19)   
			&& 	(gVAL.HP_POHD == gVAL.HP_MAIPSN)
		){
			dialog.alert("계약자/피보험자 휴대폰번호가 동일 합니다. 고객정보에서 휴대폰 번호 수정 후 진행하시길 바랍니다.");
			return false;
		}
		
		return true;
	};

	/**
	 * 유효성검증 STEP 3
	 */
	function validateStep3() {
	    // 모바일 청약구분코드 체크
	    if (required($("#ZCD").val(), "고객정보수정에서 주소를", $("#searchAddr").eq(0))) {
	    	setFocus($("#ZCD"));
	        return false;
	    }

	    // 주소 1
	    if (required($("#GTED_ADR").val(), "고객정보수정에서 주소를", $("#searchAddr").eq(0))) {
	    	setFocus($("#GTED_ADR"));
	        return false;
	    }

	    // 주소 2
	    if (required($("#LSTD_ADR").val(), "고객정보수정에서 주소를", $("#searchAddr").eq(0))) {
	    	setFocus($("#LSTD_ADR"));
	        return false;
	    }

	    // 약관전달방법 체크
	    if (required($("[name=sInsutrmsDlvryMthdCod]:checked").val(), "약관수령", $("[name=sInsutrmsDlvryMthdCod]").eq(0))) {
	    	setFocus($("[name=sInsutrmsDlvryMthdCod]"));
	        return false;
	    }


	    if (required($("[name=cmbMaigRvpl]:checked").val(), "우편물수령지", $("[name=cmbMaigRvpl]").eq(0))) {
	        return false;
	    }
	    if (required($("[name=cmbInspoRvpl]").val(), "증권수령지", $("[name=cmbInspoRvpl]").eq(0))) {
	        return false;
	    }

	    /*
		 * 증권수령 이메일이 선택 되어 있으면 이메일 정보가 없다면 진행 할수 없도록 한다.
		 */
	    var val_cmbInspoRvpl 			=   $("[name=cmbInspoRvpl]:checked").val(); // 증권수령
	    if(val_cmbInspoRvpl  == "1"  && $("#div_email_show").text()==""){
	    	dialog.alert("고객 정보에 이메일 정보가 존재하지 않습니다. 고객정보에 이메일 등록 후 선택바랍니다.");
	    	return false;
	    }
		
		return true;
	};
	
	/**
	 * 유효성검증 STEP 4
	 */
	function validateStep4() {



	   	if(	$("#ADVM_OFR_YN1").prop('checked') 	&& $("[name=chkCntcMdTd]:checked").length == 0){
	   		
				dialog.alert("광고성 정보 수신 경로를 선택해주세요.");
				setFocus($("[name=chkCntcMdTd]").eq(0));
		   		return false; 
		   }
	


		if( !$("#chkDocAgdc").prop('checked') ){
				
				dialog.alert("계약체결이행을 위한 동의서 문서 확인을 진행해주세요.");
				setFocus($("[name=chkCntcMdTd]").eq(0));
		   		return false; 
		}
		
		// s 상품소개를 위한 동의사항 항목 확인
		if ($('input[name=mPsnChkCrinf24Y]:checked').val() == undefined) {
			dialog.alert('(1)개인(신용)정보 수집·이용에 관한 사항 항목을 확인해주세요.');
			setFocus($('name=mPsnChkCrinf24Y]').eq(0));
			return false;
		}
		
		if ($('input[name=ADVM_OFR_YN]:checked').val() == undefined) {
			dialog.alert('(1)-2광고성 정보의 수신 동의 항목을 확인해주세요.');
			setFocus($('name=ADVM_OFR_YN]').eq(0));
			return false;
		}
		
		if ($('input[name=mPsnChkCrinf24OfrY]:checked').val() == undefined) {
			dialog.alert('(2)개인(신용)정보 제공에 관한 사항 항목을 확인해주세요.');
			setFocus($('name=mPsnChkCrinf24OfrY]').eq(0));
			return false;
		}
		// e 상품소개를 위한 동의사항 항목 확인
	   
		if( !$("#chkDocCntc").prop('checked') ){
			
			dialog.alert("상품소개를 위한 동의서 문서 확인을 진행해주세요.");
			setFocus($("[name=chkCntcMdTd]").eq(0));
	   		return false; 
	  }
	     
	    return true;
	};

	
	/**
	 * 유효성검증 STEP 5
	 */
	function validateStep5() {
	    /*
		 * FATCA 체크
		 */
	    if(!validate_fatca()){
	    	return false;
	    }
		
		return true;
	};

	
	/**
	 * 유효성검증 STEP 6
	 */
	function validateStep6() {

		/*
		 * 펀드 체크
		 */
		if(!stringUtil.isNull(gDS['DS_FUND_INF'])){

			var noWant 			= stringUtil.isNull(gDS["INS_DS_VAR_FIT_DIAG"])? "" :  gDS["INS_DS_VAR_FIT_DIAG"][0].DIAG_YN; // 진단여부
																																// (1:진단
																																// 0:불원)
		    var answ7Val 		= stringUtil.isNull(gDS["INS_DS_VAR_FIT_DIAG"])? "" :  gDS["INS_DS_VAR_FIT_DIAG"][0].ANSW_7;
		    var pycycCodVal 	= stringUtil.isNull(gDS["ds_Pycyc"])? "" :  gDS["ds_Pycyc"][0].PYCYC_COD;
		    var pdtAtrbDtlcd 	= stringUtil.isNull(gDS["ds_ProdtTypeMtt"])? "" :  gDS["ds_ProdtTypeMtt"][0].PDT_ATRB_DTLCD;
		    var answ2Val = stringUtil.isNull(gDS["INS_DS_VAR_FIT_DIAG"])?  "" : gDS["INS_DS_VAR_FIT_DIAG"][0].ANSW_2;

		    var divPatFundYn = false;
		    
			if ('J' == gDS['ds_ProdtTypeMtt'][0].PDT_ATRB_COD) {	// 연금메뉴가 보이면
																	// 처리
				divPatFundYn = true;
			}
			
		    var passSim = divPatFundYn ? comparePerVar(noWant, answ7Val, pycycCodVal, pdtAtrbDtlcd, answ2Val) : true;
		    if (passSim == '0') {
		    	var $chkPerVar = $("input[name=chkPerVar]");
		    	$(".toggle-con").hide();
	        	$($chkPerVar).closest('.toggle-con').show();
	        	$chkPerVar.focus();	
		        return false;
		    }

			if (!getUd_varMtt()) {
				return false;
			}
		}
		
		return true;
	};

	
	/**
	 * 유효성검증 STEP 7
	 */
	function validateStep7() {
	   	/*
		 * KYC Validation Check
		 */
	   	if(!validationChecks()){
			return false; 
		}
	   	
		/*
		 * KYC validationCheck child
		 */
		if($("#li_AML_parent").is(':visible')){  // KYC 미성년자 일때만 validation
													// check 실행
			if(!validationCheck_child()){
				return false;
			}
		}
		
		return true;
	};

	
	/**
	 * 유효성검증 STEP 8
	 */
	function validateStep8() {
		if(gDS["ds_ProdtTypeMtt"][0].RPS_PRDCD == "FI"){
			return true;
		}
		/*
		 * 모바일 해피콜
		 */
	    if($("[name=sHpclMetdCod]:checked").val() == "01"){
			var obj_11_RRN 		=  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){ if(o.CTR_RLE_SECD == '11')return true;}).RRN; // 계약자
																																// 정보
		    var obj_21_RRN 		=  gDS["DS_CTR_INTP_MTT_LIST"].find(function(o){ if(o.CTR_RLE_SECD == '21')return true;}).RRN; // 피보험자
																																// 정보
		    var val_11_realAge 	=  dateUtil.getRealAge(obj_11_RRN); 
		    var val_21_realAge 	=  dateUtil.getRealAge(obj_21_RRN); 
		    
			if(parseInt(val_11_realAge) < 19  || parseInt(val_21_realAge)< 19 || parseInt(val_11_realAge) > 64  || parseInt(val_21_realAge) > 64){ // 해피콜
																																					// 대상건이
																																					// 아니고
																																					// [모바일]을
																																					// 선택
																																					// 했으면
																																					// 알림을
																																					// 띄워주고
																																					// 전화를
																																					// 자동으로
																																					// 선택
																																					// 하게
																																					// 한다.
		      	dcUtil.g_showMessage("CCCI0027", "모바일 해피콜 가능 대상 연령이 아닙니다." , function(){
		            $("[name=sHpclMetdCod][value=02]").prop('checked', true);
		        });
		        return false;
		    }
	    }

	    // 해피콜 종류
	    if (required($("[name=sHpclMetdCod]:checked").val(), "해피콜종류", $("[name=sHpclMetdCod]").eq(0))) {
	        return false;
	    }
	    
	   	// 모집경로 체크
	   	if (required($("#cmbMojib").val(), "모집경로", $("#cmbMojib"))) {
	        return false;
	    }

	   	
	    if (gDS["ds_ProdtTypeMtt"][0].TXPF_TGT_YN == "1") {
	    	
	    	if($("[name=chkTxpf]:checked").val() == "1"){
		        if (stringUtil.isNull(gDS["DS_OTR"]) || gDS["DS_OTR"].length <= 0) {
		            dcUtil.g_showMessage("CCCW0028", "세금우대한도금액을 조회하십시요.");
		            setFocus($("#inq_txpfLimt"));
		            return false;
		        } else if (gDS["DS_OTR"][0].TXPF_POSA === "0") {
		            dcUtil.g_showMessage("CCCW0028", "세금우대한도금액이 0원 입니다.");
		            setFocus($("#inq_txpfLimt"));
		            return false;
		        }
		        
		        if (gDS["ds_ProdtTypeMtt"][0].LTAX_TGT_YN == "1") {
		            if (required($("#cmbInfMnbdSctn").val() , "저율과세적용여부", $("#cmbInfMnbdSctn"))) {
		                return false;
		            }
		        }
	    	}
	    }
	   
	    if (gDS["ds_ProdtTypeMtt"][0].ANTY_PDT_KNCD == "1") {
	        if ($("#cmbFixtrmDfr").val() != "1" && $("#cmbFixtrmDfr").val() != "2") {
	            dcUtil.g_showMessage("COCE0002", "정기지급신청을");
	            setFocus($("#cmbFixtrmDfr"));
	            return false;
	        }
	    }
		return true;
	};
	
	/*
	 * 세금우대 한도조회
	 */
	function inq_txpfLimt() {
		var opCode 	= "UDQ02";
		var svcId	= opCode;
		var strArg	= "";
		
		// 상품코드
		if (required(gVAL.cmbPrdcd, "상품코드")) return false;
		
		// 계약자
		var nRow = gDS["DS_CTR_INTP_MTT_LIST"].findIndex(function(o){if(o.CTR_RLE_SECD == "11")return true;});
		if (nRow < 0 ){
			dcUtil.g_showMessage("COCE0002", "계약자를"); // 선택
			return;
		}
	
		if ((gDS["ds_ProdtTypeMtt"][0].TXPF_TGT_YN == "0") && (gDS["ds_ProdtTypeMtt"][0].RPS_PRDCD != "FI")) {	// 비대상
			// dcUtil.g_showMessage("CCCE0002", "세금우대"); //대상상품 아님
			dialog.alert('기타정보에서 세금우대한도금액을 조회하여 주시기 바랍니다.');
			return;
		}
		
		// 계약관계자 셋팅
		if(!setUd_InctIntp()) return;
	
		// 상품정보
		setUdNtprd("DS_UD_NTPRD");
	
		// 모듈 Call
		var param = {};
		param.CS_NAM 		= gDS["DS_CTR_INTP_MTT_LIST"][nRow].CS_NAM;
		param.RRN 			= gDS["DS_CTR_INTP_MTT_LIST"][nRow].RRN;
		param.INF_MNBD_SCTN = ""; // 저율과세적용코드
		param.PRDCD 		= gVAL.cmbPrdcd; // 주상품 코드
		param.sPoymd 		= gVAL.stdYmd; // 계약일자
		param.sStdYmd  		= dateUtil.getDate();
	
		var remote = convertUtil.getRemoteObj('FG_SusInp', 'UDQ02');
	    convertUtil.setRowArray(remote, 'dw_Inct_intp', gDS["DS_UD_INCT_INTP"]); 	// 계약관계자
	    convertUtil.setRowArray(remote, 'dw_Ntprd', gDS["DS_UD_NTPRD"]); 			// 가입상품
	    param.remote 					= remote;
	
	    console.log("세금우대>>", param);
	    
		D.http.ajax('/sw/swAllCC', param).then(function(result){ 
			gDS["DS_OTR_INF_MNBD"] =  result.remoteResult.outDataSet.DS_LIST.data;
			D.logger.debug("inq_txpfLimt() :: 세금우대한도조회");
			D.logger.debug(result); 
			
			// DS_OTR : 세금우대관련정보 Dataset
			if(gDS["DS_OTR"] < 1){
				gDS["DS_OTR"].push({});
			}
	
			if (gDS["DS_OTR_INF_MNBD"].length <= 0) {
				gDS["DS_OTR"][0].TXPF_POSA = "0";
	
	        } else {
	            var amt = parseInt(stringUtil.nvl(gDS["DS_OTR_INF_MNBD"][0].SAVG_KND_NUSE_AMT, 0));
	            gDS["DS_OTR"][0].TXPF_POSA =  amt; 	// 이거 하는 순간 as -is 는 화면에
													// 세금우대가능금액에 세팅 된다 바인딩 되어 있음
	           	$("#txpfPosa").val(dcUtil.addCommas(amt));
	            if (amt > 0) {
	            	/*
					 * 디버깅 했을 따 아무 값도 없었다.
					 */
	            } else {
	            	/*
					 * cmbInfMnbdSctn 는 원래 콤보 인데 hidden 태그로 선언 해 놨음 한번 확인해 봐야 할
					 * 듯
					 */
	            	$("#cmbInfMnbdSctn").val("5"); 
	                dcUtil.g_showMessage("CCCW0028", "세금우대한도금액이 0원 입니다.");
	            }
	        }
		});
						
		// Return
		// 주민(사업자)등록번호 RBRNO
		// 주민(사업자)등록번호 구분 RBRNO_SCTN
		// 한도조회 저축종류 LIMT_INQ_SAVG_KND
		// 정보주체(구 장애인)구분 INF_MNBD_SCTN
		// 저소득자 구분(농어가저축) LOW_INCR_SCTN
		// 상호(기업체명) ENTNM
		// 성명(대표자) REPR_NM
		// 해당 저축종류 중복 여부 RELV_SAVG_KND_DUP_YN
		// 저축종류별 가입 금액 SAVG_KND_NTRY_AMT
		// 저축종류별 미사용 금액 SAVG_KND_NUSE_AMT
		// 가입기관 점포코드 NTRY_INU_OFC_COD
	};
	
	
	// 선납 회수 조회
	function inq_prpmNumtm() {
	  if (gDS["ds_ProdtTypeMtt"].length <= 0) {
	      dcUtil.g_showMessage("COCE0002", "상품을");
	      return;
	  }
	
	  if (!setUd_InctIntp()) {
	      return;
	  }
	
	  setUdNtprd("DS_UD_NTPRD");
	
	  // 조회 :: arguments SET
	  var param = {};
	  param.sPoymd= 	gVAL.stdYmd;
	  param.sStdYmd=	dateUtil.getDate();
	  param.sOblg_Pym_Mtcnt= gDS["ds_ProdtTypeMtt"][0].OBLG_PYM_YN != "1"? "0": $("#cmbOblgPym").val(); // 의무납입기간
	  
	  var remote = convertUtil.getRemoteObj('FG_CmpuUd_NtprdMtt', 'UDQ12');
	  convertUtil.setRowArray(remote, 'dw_Ntprd', gDS["DS_UD_NTPRD"]);
	  convertUtil.setRowArray(remote, 'dw_Inct_intp', gDS["DS_UD_INCT_INTP"]);
	  param.remote = remote;
	
	  D.http.ajax('/sw/swAllPD', param).then(function(result){
	  	if(result.errorMsg){
	  		dialog.handLoading(false)
	  		dialog.alert(result.errorMsg);
	  		dialog.handLoading(false)
	  		return ;	
	  	}
	  	gVAL["sPrpmPsbyNumtm"] =  result.remoteResult.paramMap.sPrpmPsbyNumtm;
	
	  	if(parseInt(gVAL["sPrpmPsbyNumtm"]) < 0){
	  		gVAL["sPrpmPsbyNumtm"] = 0;
	  	}
	
	  	/*
		 * 최대선납횟수
		 */
	  	$("#pPrpmNumtm").show();
	  	$("#emPrpmNumtm").html(gVAL["sPrpmPsbyNumtm"]); 
	
	  	$("#spnPrpmNumtm").prop('disabled', false);
	  	$("#sbtn-minus").show();
	  	$("#sbtn-plus").show();
	  });
	};
	
	/**
	 * 친권자 선택
	 */
	function selParentsChg(result, pageCnt) {
		console.log("test>>>>>result>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", result);
		
		gVAL.obj_PARENTS =  result.PARENTS_INFO;
		console.log("친권자 체크",gVAL.obj_PARENTS.RRN);
		console.log("친권자 체크",!stringUtil.isNull(gVAL.obj_PARENTS.RRN));
		
		if (!stringUtil.isNull(gVAL.obj_PARENTS.RRN)) {
			console.log("친권자 있음");
			/*
			 * 실명 번호 구분 ----------------- 주민등록번호 1, 2, 3, 4 의 경우 내국인 주민등록번호 4,
			 * 5, 6, 7 의 경우 외국인으로 ----------------- 01 : 주민등록번호 15 : 외국인 등록번호
			 * 국내거소 신고번호
			 */

			// 주민등록 번호를 파싱
			var val_nationGubun =  gVAL.obj_PARENTS.RRN.substring(6,7); 
			switch(val_nationGubun){
				// 주민등록번호 1,2,3,4 의 경우 내국인 (주민등록번호 [개인])
				case "1":
				case "2":
				case "3":
				case "4":
					$("[name=RNNO_GBN_CD]").prop('checked', false);
					$("[name=RNNO_GBN_CD][value=01]").prop('checked', true); // 주민등록번호(개인)
																				// ==
																				// 내국인
				break;
				// 주민등록번호 5,6,7,8 의 경우 외국인
				case "5":
				case "6":
				case "7":
				case "8":
					$("[name=RNNO_GBN_CD]").prop('checked', false);
					$("[name=RNNO_GBN_CD][value=15]").prop('checked', true); // 외국인
																				// 등록번호
																				// ==
																				// 내국인
				break;
			}

			$("[name=RNNO_GBN_CD]").next().show();
			$("[name=RNNO_GBN_CD]:not(:checked)").next().hide();
			$("[name=RNNO_GBN_CD]:checked").trigger('change');


			if(pageCnt > 0 || stringUtil.isNull(gData.RLNM_CHK_MTHOD_CD)) {
				$("#RLNM_CHK_MTHOD_CD > option:visible").eq(0).select();
			}

			/*
			 * 실명번호
			 */
			$("#RNNO").val(gVAL.obj_PARENTS.RRN.replace(/(\d{6})(\d{1})(\d{6})/, '$1-$2******'));
			$("#HANGL_NM").val(gVAL.obj_PARENTS.CS_NAM);												// 성명


			/*
			 * 연락처
			 */ 
			var connectNumber = "";
			if(!stringUtil.isNull(gVAL.obj_PARENTS.HPNO)){  	// 핸드폰 번호가 존재하면
																// 핸드폰 번호를 입력한다.
				connectNumber = gVAL.obj_PARENTS.HPNO;
			}else if(!stringUtil.isNull(gVAL.obj_PARENTS.HOME_TLNO)){
				connectNumber = gVAL.obj_PARENTS.HOME_TLNO;
			}

			if(!stringUtil.isNull(connectNumber)){
				$("#PRSN_CNTC_REGON_NO").val(connectNumber.split("-")[0]); 	
				$("#PRSN_CNTC_OFC_NO").val(connectNumber.split("-")[1]);
				$("#PRSN_CNTC_INDIVI_NO").val(connectNumber.split("-")[2]);
			}

			if(!stringUtil.isNull(gVAL.obj_PARENTS.OFFICE_TLNO)){
				connectNumber = gVAL.obj_PARENTS.OFFICE_TLNO;
				$("#OFC_CNTC_REGON_NO").val(connectNumber.split('-')[0]);
				$("#OFC_CNTC_OFC_NO").val(connectNumber.split('-')[1]);
				$("#OFC_CNTC_INDIVI_NO").val(connectNumber.split('-')[2]);
			}

			/*
			 * 직업(업종)
			 */
			if(pageCnt > 0 || stringUtil.isNull(gData.INSU_JOB_CD)) {
				$("#INSU_JOB_CD").val(""); 	
				if(!stringUtil.isNull(gVAL.obj_PARENTS.DTL_COD)){
					$("#INSU_JOB_CD").val(gVAL.obj_PARENTS.DTL_COD); 	
				}
				
				$("#INSU_JOB_CD").trigger('change');
			}
			
			/*
			 * 국적
			 */
			if(pageCnt > 0 || stringUtil.isNull(gData.CNTRY_CD)) {
				$("#CNTRY_CD").val("KR"); // defalut 한국
			}
			
			/*
			 * 발급일자
			 */
			if(pageCnt > 0 || stringUtil.isNull(gData.mskPblsYmd)) {
				$("#mskPblsYmd").val(""); //
			}
			/*
			 * 주소(자택)
			 */
			$("#HOME_ZIPCD").val(gVAL.obj_PARENTS.HOME_ZCD);
			$("#HOME_ZIPCD_ADDR").val(gVAL.obj_PARENTS.HOME_GTED_ADR);
			$("#HOME_DTL_ADDR").val(gVAL.obj_PARENTS.HOME_LSTD_ADR);

			/*
			 * 주소(직장)
			 */
			$("#OFC_ZIPCD").val(gVAL.obj_PARENTS.OFFICE_ZCD);
			$("#OFC_ZIPCD_ADDR").val(gVAL.obj_PARENTS.OFFICE_GTED_ADR);
			$("#OFC_DTL_ADDR").val(gVAL.obj_PARENTS.OFFICE_LSTD_ADR);

			console.log("test111111>>", gVAL.obj_PARENTS);
			if(gVAL.obj_PARENTS.HOME_ZCD == null)	{
				$("#home_addr").hide();
				$("#offc_addr").show();
			}

			/*
			 * 신원확인증 의 경우
			 */
			var val_RNNO_GBN_CD =  $("#RNNO_GBN_CD").val(); 	// 실명번호 구분
			var $RLNM_CHK_MTHOD_CD =  $("#RLNM_CHK_MTHOD_CD"); // 신원확인증

			if(pageCnt > 0 || stringUtil.isNull(gData.RLNM_CHK_MTHOD_CD)) {
				switch(val_RNNO_GBN_CD){
					case "01": // 내국인의 경우 [주민등록증] 기본
						$RLNM_CHK_MTHOD_CD.val("01");
					break;
					case "15": // 외국인등록번호의 경우 [운전면허증] 기본
						$RLNM_CHK_MTHOD_CD.val('03');
					break; 

				}
				$("#RLNM_CHK_MTHOD_CD").trigger('change'); // 신원확인증 이벤트 처리
			}


			/* 주민등록번호 마스킹 */
			$("#li_AML").show();
			$("#li_AML_parent").show();
// $("#btn_CHILD_EXE").removeClass("none");
			gVAL.CHILD_EXE_YN = true;
			dialog.handLoading(false); // AML 활성화 하면 지울것
			
		}
	};
	
	function setCtrIntpCs() {
	    var nRow, sRow, nCsNam;
	    var isSync = false;
	    gDS["DS_CTR_INTP_MTT_LIST"] = [];
	    nRow = gDS["DS_CS_LIST"].findIndex(function(o){if(o.CS_RLP_SECD == "1")return true;})
	    gVAL.nCsPk = gDS["DS_CS_LIST"][nRow].CS_PK;


	    /*
		 * 계약자
		 */
		gDS["DS_CTR_INTP_MTT_LIST"].push({});
	    nRow = gDS["DS_CTR_INTP_MTT_LIST"].length-1;
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].CTR_RLE_SECD		= "11"; 					// DS_CTR_INTP_MTT_LIST_OnColumnChanged
																						// [처리
																						// 없음]
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].CS_PK				= gVAL.nCsPk; 				//
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].CS_RLP_SECD		= "1";
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].XCLCLV_APPL_YN	= "0";
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].PYMRT				= "0";
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].ESTY_INP_YN		= "1";
	    



	    /*
		 * 주피보험자
		 */
	    gDS["DS_CTR_INTP_MTT_LIST"].push({});
	    nRow = gDS["DS_CTR_INTP_MTT_LIST"].length-1;
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].CTR_RLE_SECD		= "21";
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].CS_PK				= gVAL.nCsPk;
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].CS_RLP_SECD		= "1";
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].XCLCLV_APPL_YN	= "0";
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].PYMRT				= "0";
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].ESTY_INP_YN		= "1";
	    

	    /*
		 * 만기수익자
		 */
	    gDS["DS_CTR_INTP_MTT_LIST"].push({});
	    nRow = gDS["DS_CTR_INTP_MTT_LIST"].length-1;
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].CTR_RLE_SECD		= "41";
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].CS_PK				= gVAL.nCsPk;
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].CS_RLP_SECD		= "1";
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].XCLCLV_APPL_YN	= "0";
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].PYMRT				= "100";
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].ESTY_INP_YN		= "1";
	    


	    /*
		 * 장해수익자
		 */ 
	    gDS["DS_CTR_INTP_MTT_LIST"].push({});
	    nRow = gDS["DS_CTR_INTP_MTT_LIST"].length-1;
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].CTR_RLE_SECD		= "42";
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].CS_PK				= gVAL.nCsPk;
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].CS_RLP_SECD		= "1";
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].XCLCLV_APPL_YN	= "0";
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].PYMRT				= "100";
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].ESTY_INP_YN		= "1";
	    


	    /*
		 * 사망수익자
		 */ 
	    gDS["DS_CTR_INTP_MTT_LIST"].push({});
	    nRow = gDS["DS_CTR_INTP_MTT_LIST"].length-1;
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].CTR_RLE_SECD		= "47";
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].CS_PK				= "1";
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].CS_NAM			= "법정상속인";
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].RRN 				= "1111111111111";
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].PRCMPAG 			= "0",
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].CS_RLP_SECD 		= "14",
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].GNDR_SECD 		= "1",
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].PYMRT 			= "100",
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].XCLCLV_PSPY_YN 	= "0",
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].XCLCLV_APPL_YN 	= "0",
	    gDS["DS_CTR_INTP_MTT_LIST"][nRow].ESTY_INP_YN 		= "1"


	    // isInit = (stringUtil.isNull(gDS["DS_MAI_INF"][0].CS_RRN))? false :
		// true;
	    // nRow = gDS["DS_CS_LIST"].findIndex(function(o){if(o.CS_RLP_SECD ==
		// "1")return true;});

	    /*
		 * DS_CS_LIST 에 있는 본인 정보를 gDS["DS_CTR_INTP_MTT_LIST"] 에 copy
		 */
	 	fnct_setCtrIntpCs(0, "RRN", gDS["DS_CS_LIST"][0].RRN); 		// 계약자
	 	fnct_setCtrIntpCs(1, "RRN", gDS["DS_CS_LIST"][0].RRN);    	// 조피보험자
	 	fnct_setCtrIntpCs(2, "RRN", gDS["DS_CS_LIST"][0].RRN);   	// 만기수익자
	 	fnct_setCtrIntpCs(3, "RRN", gDS["DS_CS_LIST"][0].RRN);    	// 장해수익자


	}
	
	function fnct_chkDthPnfc(a_ctrRleSecd, a_csPk, $sel) {
	    var sCtrRleSecd = new Array(3);
	    var sRow = new Array(3);
	    sCtrRleSecd[0] = a_ctrRleSecd;
	    if (sCtrRleSecd[0] == "47") {
	        sCtrRleSecd[1] = "48";
	        sCtrRleSecd[2] = "49";
	        sRow = gDS["DS_CTR_INTP_MTT_LIST"].findIndex( function(o){if(o.CTR_RLE_SECD == sCtrRleSecd)return true;} );
	        
	    } else if (sCtrRleSecd[0] == "48") {
	        sCtrRleSecd[1] = "47";
	        sCtrRleSecd[2] = "49";

	        sRow = gDSp["DS_CTR_INTP_MTT_LIST"].findIndex( function(o){if(o.CTR_RLE_SECD == sCtrRleSecd)return true;} );
	        if (sRow[1] >= 0 && stringUtil.isNull(gDSp["DS_CTR_INTP_MTT_LIST"][sRow[1]], "CS_PK")) {
	            dcUtil.g_showMessage("COCE0002", "사망수익자1을");
	            setFocus($sel);

	            return false;
	        }
	        if (a_csPk == "1") {
	            var msg = ["사망수익자2", "법정상속인"];
	            dcUtil.g_showMessage("CCCW0015", msg);
	            return false;
	        }
	    } else if (sCtrRleSecd[0] == "49") {
	        sCtrRleSecd[1] = "47";
	        sCtrRleSecd[2] = "48";
	        sRow = gDSp["DS_CTR_INTP_MTT_LIST"].findIndex( function(o){if(o.CTR_RLE_SECD == sCtrRleSecd)return true;});
	        
	        if (sRow[1] >= 0 && stringUtil.isNull(gDSp["DS_CTR_INTP_MTT_LIST"][sRow[1]], "CS_PK")) {
	            dcUtil.g_showMessage("COCE0002", "사망수익자1을");
	            setFocus($sel);
	            return false;
	        }
	        if (sRow[2] >= 0 && stringUtil.isNull(gDSp["DS_CTR_INTP_MTT_LIST"][sRow[2]], "CS_PK")) {
	            dcUtil.g_showMessage("COCE0002", "사망수익자2를");
	            setFocus($sel);
	            return false;
	        }
	        if (a_csPk == "1") {
	            var msg = ["사망수익자3", "법정상속인"];
	            dcUtil.g_showMessage("CCCW0015", msg);
	            return false;
	        }
	    } else {
	        return true;
	    }
	    if (!fnct_chkEqualCs(sRow, a_csPk, "사망수익자", 1)) {
	        return false;
	    }
	    return true;
	};

	function fnct_chkEqualCs(a_row, a_val, a_msg, start_row) {
	    var cnt = a_row.length;
	    var sRow = stringUtil.isNull(start_row)? 0: start_row;
	    if (stringUtil.isNull(a_val)) {
	        return false;
	    }
	    for (var i = sRow; i < cnt; i++) {
	        if ((a_row[i] >= 0) && (a_val == gDS["DS_CTR_INTP_MTT_LIST"][a_row[i]], "CS_PK")) {
				dcUtil.g_showMessage("CCCE0004", a_msg);
	            return false;
	        }
	    }
	    return true;
	};
	
	function psInfoValidCheck(list){
		var valid = true;
		$.each(list.check,function(idx,item){
			if (stringUtil.isNull(item)){
				dialog.alert('개인정보 이용동의를 확인해주세요.');
				valid = false;
				return false;
			}
		})
		
		if(list.check.ADVM_OFR_YN == '1'){	// 광고성정보 수신동의
			var count = 0;
			$.each(list.chkCntcMdTd,function(idx,item){
				if (item == '1'){
					count++;
					return false;
				}
			})
			
			if(count < 1) {
				dialog.alert('광고성 정보 수신 경로를 선택해주세요.');
				valid = false;
			}
		}
		
		return valid;
		
	}
	function comparePerVar2(noWant, answ7Val, pycycCodVal, pdtAtrbDtlcd, answ2Val){
		// 투자성향 setting
		var polData = $.grep(gDS['DS_CTR_INTP_MTT_LIST'], function(p){if('11' == p.CTR_RLE_SECD)return true;} )[0];	// 계약자정보
		var polCsPk  = polData.CS_PK;
		var polCsNam = polData.CS_NAM;
		var polRrn   = polData.RRN;
		var csPkColNm = ('N' != gVAL.loadMode && 'Q' != gVAL.loadMode) ? 'CS_PK' : 'CHN_CS_PK';
		var arr_INS_DS_VAR_FIT_DIAG = $.grep(gDS['INS_DS_VAR_FIT_DIAG'], function(p){if(p[csPkColNm] == polCsPk && p.CS_NAM == polCsNam && p.CSNUM === polRrn)return true;});
		gVAL.insCtrPrps = arr_INS_DS_VAR_FIT_DIAG.length > 0 ? arr_INS_DS_VAR_FIT_DIAG[0].INS_CTR_PRPS : ""; // 투자성향
		gVAL.rcmInsPdt = arr_INS_DS_VAR_FIT_DIAG.length > 0 ? arr_INS_DS_VAR_FIT_DIAG[0].RCM_INS_PDT : "";   // 변액적합성
																												// 검사
																												// 점수
		if(gData.FNC_SPND_CD == '1'){
			return true;
		}
	    
	    var msg3 = "";
	    msg3 += "고객의 상품성향과 다른 상품을 선택하셨습니다.<br/>";
	    msg3 += "상품성향에 맞는 상품으로 변경 하여야 합니다.";
	    
	    var msg4 = "";
	    msg4 += "고객의 투자성향보다 위험도가<br/> 높은 펀드가 포함된 상품을 선택하셨습니다.<br/>";
	    msg4 += "투자성향 확인 후 진행해주시기 바랍니다.";
	    
	    // 보험 성향이 변액보험 부적합인 경우 무조건 부적합 보험계약 체결을 선택해야함
	    if ( "00" == gVAL.insCtrPrps) {
	        dialog.alert(msg3);
	        return false;
	    }
	    
	    var dgrsClz = getDgrsClz(gVAL.insCtrPrps, gVAL.rcmInsPdt); // 변액적합성 위험성
																	// 등급
	    
	    if (dgrsClz == 6) {
	    	dialog.alert('적합성진단 결과 위험회피형(6등급)인 경우</br>변액보험 청약이 불가합니다.');
			return false;
	    }
		
	    /*
		 * 펀드코드 \ 위험 등급 1등급 2등급 3등급 4등급 5등급 6등급
		 * 
		 * 버크셔TOP10[A02201] O O X X X X 인덱스성장형[U01501] O O X X X X
		 * AI글로벌다이나믹[A02101] O O X X X X AI글로벌멀티에셋[A01901] O O O X X X
		 * 글로벌AI플랫폼액티브형[A01401] O O O X X X 글로벌AI플랫폼밸런스형[A01501] O O O O X X
		 * 글로벌AI플랫폼세이프형[A01601] O O O O X X 글로벌밸런스멀티인컴형[A02401] O O O X X X
		 * 글로벌멀티에셋자산배분형[A01301] O O O O X X 글로벌멀티에셋자산배분형3[A02301] O O O X X X
		 * 글로벌채권형[U01801] O O O O X X 채권형[U01101] O O O O X X MMF형[A02501] O O O
		 * O O O
		 */
	    
	    var IDX_A02201 = gDS["DS_QTT_FUND_INF"].findIndex( function(o){if(o.FDCD == "A02201" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_U01501 = gDS["DS_QTT_FUND_INF"].findIndex( function(o){if(o.FDCD == "U01501" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_A02101 = gDS["DS_QTT_FUND_INF"].findIndex( function(o){if(o.FDCD == "A02101" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_A01901 = gDS["DS_QTT_FUND_INF"].findIndex( function(o){if(o.FDCD == "A01901" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_A01401 = gDS["DS_QTT_FUND_INF"].findIndex( function(o){if(o.FDCD == "A01401" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_A01501 = gDS["DS_QTT_FUND_INF"].findIndex( function(o){if(o.FDCD == "A01501" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_A01601 = gDS["DS_QTT_FUND_INF"].findIndex( function(o){if(o.FDCD == "A01601" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_A02401 = gDS["DS_QTT_FUND_INF"].findIndex( function(o){if(o.FDCD == "A02401" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_A01301 = gDS["DS_QTT_FUND_INF"].findIndex( function(o){if(o.FDCD == "A01301" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_A02301 = gDS["DS_QTT_FUND_INF"].findIndex( function(o){if(o.FDCD == "A02301" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_U01801 = gDS["DS_QTT_FUND_INF"].findIndex( function(o){if(o.FDCD == "U01801" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_U01101 = gDS["DS_QTT_FUND_INF"].findIndex( function(o){if(o.FDCD == "U01101" && o.FUND_INP_RTO != "0")return true;} );
	    var IDX_A02501 = gDS["DS_QTT_FUND_INF"].findIndex( function(o){if(o.FDCD == "A02501" && o.FUND_INP_RTO != "0")return true;} );
	    

	    // 버크셔TOP10
	    if (IDX_A02201 > -1) {
	    	if (3 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // 인덱스성장형
	    if (IDX_U01501 > -1) {
	    	if (3 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // AI글로벌다이나믹
	    if (IDX_A02101 > -1) {
	    	if (3 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // AI글로벌멀티에셋
	    if (IDX_A01901 > -1) {
	    	if (4 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // 글로벌AI플랫폼액티브형
	    if (IDX_A01401 > -1) {
	    	if (4 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // 글로벌AI플랫폼밸런스형
	    if (IDX_A01501 > -1) {
	    	if (5 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // 글로벌AI플랫폼세이프형
	    if (IDX_A01601 > -1) {
	    	if (5 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // 글로벌밸런스멀티인컴형
	    if (IDX_A02401 > -1) {
	    	if (4 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // 글로벌멀티에셋자산배분형
	    if (IDX_A01301 > -1) {
	    	if (5 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // 글로벌멀티에셋자산배분형3
	    if (IDX_A02301 > -1) {
	    	if (5 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // 글로벌채권형
	    if (IDX_U01801 > -1) {
	    	if (5 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
	    // 채권형
	    if (IDX_U01101 > -1) {
	    	if (5 <= dgrsClz && dgrsClz <= 6) {
	    		dialog.alert(msg4);
	    		return false;
	    	}
	    }
		
		return true;
	}
	
	/**
	 * SEM_UD_RST_INF 테이블에 PLYNO, QTTNO를 업데이트 한다.
	 */
	function updateDsasUdRst(plyNo, qttNo) {
		var defer = $.Deferred();
		
		var remote = convertUtil.getRemoteObj('CC_AC_DsasUdDlng', 'UDM02'); 
		
		D.http.ajax('/uw/dsasUdDlng', {
			PLYNO : plyNo
			,QTTNO : qttNo
			,remote : remote
		}).then(function(result) {
			console.log("질병사전심사결과 증번 업데이트 >>>", result)
			defer.resolve();
		});					
		
		return defer.promise();
	}

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
				dialog.alert('청약을 진행할 수 없습니다.<br/>(사망자명의 금융거래 차단 대상입니다)');
				flag = false;
				defer.reject();
			}
			
			defer.resolve(flag);
			return defer.promise();
			
		});
		
		return defer.promise();
	}
	function selectCsNamByFcAdmnPk(fcAdmnPk,csNam) {
		var defer = $.Deferred();
		var flag = true;
		var resultCnt = 0;
		
		var dw_inqTgtPesn = [];
		
		var param = {
				FC_ADMN_CS_PK :fcAdmnPk
//				remote : remote
		};
		
		D.http.ajax('/cu/selectCsNamByFcAdmnPk', param).then(function(result){
			
			if(result.errorCode) {
				if (result) dialog.alert(result.text);
				defer.reject();
				return defer.promise();
			}
			
			
			if(result && result.CS_NAM != csNam && result.CS_NAM != null) {
				dialog.alert('등록된 고객정보가 상이합니다.<br/>고객정보 정정 후 가입제안/청약을 진행해주시기 바랍니다.');
				flag = false;
				defer.reject();
			}
			
			defer.resolve(flag);
			return defer.promise();
			
		});
		
		return defer.promise();
	}
	
	return {
		gVAL			: gVAL,
		gDS				: gDS,
		gPARAM			: gPARAM,
		gData			: gData,
		gDisp			: gDisp,
		gVisible		: gVisible,
		gViewNum		: gViewNum,
		init 			: init,
		init2			: init2,
		goNext			: goNext,
		goPre			: goPre,
		fnSetClmrInfo 	: fnSetClmrInfo,
		emailChange		: emailChange,
		setUdNtprd		: setUdNtprd,
		dspsCheck		: dspsCheck,
		setUd_InctIntp	: setUd_InctIntp,
		dspsIn			: dspsIn,
		required		: required,
		btnIbChk_onclick: btnIbChk_onclick,
		inq_txpfLimt	: inq_txpfLimt,
		inq_prpmNumtm	: inq_prpmNumtm,
		fnct_setCtrIntpCs : fnct_setCtrIntpCs,
		fn_setOption_csRlpSecd : fn_setOption_csRlpSecd,
		selParentsChg	: selParentsChg,
		setParents		: setParents,
		initgVAL		: initgVAL,
		fnct_chkDthPnfc	: fnct_chkDthPnfc,
		fnct_addBasUser	: fnct_addBasUser,
		rtnSusFeed		: rtnSusFeed,
		comparePerVar2  : comparePerVar2,
		fnInqDthPesnYn	: fnInqDthPesnYn,
		selectCsNamByFcAdmnPk : selectCsNamByFcAdmnPk
	};
	
})(jQuery, window.Dcore);