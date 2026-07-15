var susDsUdCol = (function($, D){

/**
 * 심사용 단일 파라미터 세팅을 가져온다.
 */
function getInitUdParam() {
    return {
		"sUd_Sctn"          : "",
		"sUd_Ymd"           : "",
		"sIndv_Grp"         : "",
		"sWinsu"            : "",
		"sGrpDlngNum"       : "",
		"sGrpDlngCsPk"      : "",
		"sPlyno"            : "",
		"sChnCod"           : "",
		"sHqCod"            : "",
		"sBzgrpCod"         : "",
		"sBrofcCod"         : "",
		"sCol_Plar_Empno"   : "",
		"sDlfg_Empno"       : "",
		"sPoymd"            : "",
		"sCrtn_Dlng_Yn"     : "",
		"sSusKncd"          : "",
		"sCsInf_Sfgd_Req23" : "",
		"sCsInf_Sfgd_Req24" : "",
		"sMPsn_CsInf_Sfgd_Req23" : "",  //주피_고객정보보호요청여부23
		"sMPsn_CsInf_Sfgd_Req24" : "",  //주피_고객정보보호요청여부24
		"sMPsn_CsInf_Sfgd_Req48" : "",
		"sSPsn_CsInf_Sfgd_Req23" : "",  //종피1_고객정보보호요청여부23
		"sSPsn_CsInf_Sfgd_Req24" : "",  //종피1_고객정보보호요청여부24
		"sSPsn_CsInf_Sfgd_Req48" : "",
		"sSPsn2_CsInf_Sfgd_Req23" : "",  //종피2_고객정보보호요청여부23
		"sSPsn2_CsInf_Sfgd_Req24" : "",  //종피2_고객정보보호요청여부24
		"sSPsn3_CsInf_Sfgd_Req23" : "",  //종피3_고객정보보호요청여부23
		"sSPsn3_CsInf_Sfgd_Req24" : "",  //종피3_고객정보보호요청여부24
		"sSPsn4_CsInf_Sfgd_Req23" : "",  //종피4_고객정보보호요청여부23
		"sSPsn4_CsInf_Sfgd_Req24" : "",  //종피4_고객정보보호요청여부24
		"sPdt_Indv_Inf_Hold_Yyct" : "",
		"sPdt_Indv_Inf_Ofr_Hold_Yyct" : "",
		"sExBnfc_CsInf_Sfgd_Req23" : "",  //만기시수익자_고객정보보호요청여부23
		"sDiBnfc_CsInf_Sfgd_Req23" : "",  //장해시수익자_고객정보보호요청여부23
		"sDtBnfc_CsInf_Sfgd_Req23" : "",  //사망시수익자_고객정보보호요청여부23
		"sCsInf_Sfgd_Req24_Ofr" : "",
		"sMPsn_CsInf_Sfgd_Req24_Ofr" : "",  //주피_고객정보보호요청여부24
		"sSPsn_CsInf_Sfgd_Req24_Ofr" : "",  //종피1_고객정보보호요청여부24
		"sSPsn2_CsInf_Sfgd_Req24_Ofr" : "",  //종피2_고객정보보호요청여부24
		"sSPsn3_CsInf_Sfgd_Req24_Ofr" : "",  //종피3_고객정보보호요청여부24
		"sSPsn4_CsInf_Sfgd_Req24_Ofr" : "",  //종피4_고객정보보호요청여부24
		"sCntc_MdTd_Tel_Yn" : "",
		"sCntc_MdTd_Sns_Yn": "",
		"sCntc_MdTd_Emal_Yn" : "",
		"sCntc_MdTd_Pmil_Yn" : "",
		"sBnfc_Dstn_Yn"	  : "",
		"sCnctrAgrmYn"      : "",
		"sRecgID"           : "",
		"sValdYmd"          : "",
		"sPyTrsfEmpno"      : "",
		"sCompNtcYn"        : "",
		"sCompPrbzPlyno"    : "",
		"sCompPrbzCtymd"    : "",
		"sChnDtlCod"        : "",
		"sSocposSecd"       : "",
		"sGrpBatDlngYn"     : "",
		"sPremRvopCod"      : "",
		"sPrpm_Numtm"       : "",
		"sAd_Prem"          : "",
		"sOblg_Pym_Mtcnt"   : "",
		"sMaiPrdcdPremModYn": "",
		"sPremClapdSecdChkYn":"",
		"sReShar"			  : "",
		"sAvgPtilIvst"	  : "",
		"sAdprmIncnYN"	  : "",
		"sGolPrfr"		  : "",
		"sBasAdrSctn"		  : "",
		"sLtaxApptCod"	  : "",
		"sUptSecd"		  : "",
		"sPdiadv"           : "",
		"sTot_Dc_Amt"       : "",
		"sRlpy_Prem"        : "",
		"sSmtl_Prem"        : "",
		"sDfrPesn"          : "",
		"sPohdCgrt"         : "",
		"sAsrdCgrt"         : "",
		"sFrtSecd"          : "",
		"sManFrtApptAge"    : "",
		"sFmlFrtApptAge"    : "",
		"sInspoSlcSctn"     : "",
		"sYyfrs_Conv"       : "",
		"sOyr_Conv"         : "",
		"sCanp_Conv"		  : "",
		"sCol_Alow"         : "",
		"sCtr_Admn_Alow"    : "",
		"sNmm_Prmtfe"       : "",
		"sNmm_Enco_Fee"     : "",
		"sMhypre"           : "",
		"sMprd_Mhypre"      : "",
		"sRcg_Trt_Mhypre"   : "",
		"sComp_Ntc_Plyno"   : "",
		"sPrpfrmKncd"       : "",
		"sConvPrm"   		: "",
		"sColCms"       	: "",
		"sRstCaclCd"        : "",
		"sCoopPlarEmpno"    : "",
		"sMhypymFtpr"       : "",
		"sYyfrs_Conv"       : "",
		"sCanp_Conv"        : "",
		"sNonMhypymStdprm"  : "",
		"sFnclCsYn"         : "",
		"sHdwrSignYn"       : "",
		"sCtrSecd"          : "",
		"sCrtnDlerTgtYn"    : "",
		"sColPlarCsPk"      : "",
		"sColPlarCsRlePk"   : "",
		"sJntPlarYn"        : "",
		"sJntPlarCsPk"      : "",
		"sJntPlarCsRlePk"   : "",
		"sJntPlarNum"       : "",
		"sJntPlarRto"       : "",
		"sTxpfApplYn"       : "",
		"sTxpfPosa"         : "",
		"sAdpymPosa"        : "",
		"sGrpDlngYn"        : "",
		"sMaigRvpl"         : "",
		"sInspoRvpl"        : "",
		"sEvntPdtKncd"      : "",
		"sMaigRcps"         : "",
		"sPdtPdtSecd"       : "",
		"sPdtRpsPrdcd"      : "",
		"sPdtMaiPrdcd"      : "",
		"sMaiCsNam"         : "",
		"sMaiCsRrn"         : "",
		"sTxpfSavgSecd"     : "",
		"sGolPrfrApplYn"    : "",
		"sQttno"            : "",
		"sPlyno"            : "",
		"sSusnum"           : "",
		"sGrpCsPk"          : "",
		"sGrpno"            : "",
		"sGrpSusForm"       : "",
		"sInspoSlcSecd"     : "",
		"sManSusCnt"        : "",
		"sFmlSusCnt"        : "",
		"sBnfcGrpExpi"      : "",
		"sBnfcGrpDias"      : "",
		"sBnfcGrpDth"       : "",
		"sGrpPlyno"         : "",
		"sGrpSusManPercnt"  : "",
		"sGrpSusFmlPercnt"  : "",
		"sGrpAccmPerCnt"    : "",
		"sGrpAccmSmasd"     : "",
		"sGrpAccmGspre"     : "",
		"sGrpAccmPdiadv"    : "",
		"sGrpAccmAdPrem"    : "",
		"sGrpAccmTotDcAmt"  : "",
		"sGrpAccmRlpyPrem"  : "",
		"sGrpAccmPdiadvDcAmt" : "",
		"sGrpLstGenDcAmt"   : "",
		"sAntyOpnYmd"		  : "",
		"sAntyOpnAge"		  : "",
		"sOageWelDgnCaptRto" : "",
		"sTmpPlarYn"		  : "",
		"sDcMetdSlcCod"     : "",
		"sIcpnSalPlarUdSecd" : "",
		"RLT_CD"            : "",
		"REQ_SYS"			  : "",
		"sAntySwtDfrmPrid"  : "",
		"sFixTrmDfrYn"      : "",
		"sExpoVisYmd"		  : "",	
		"sExpoCd"			  : "",	
		"sChkPerVar"		  : "",	
		"sPrbzYn"			  : ""
	};
}


/**
 * 저장용 단일파라미터 세팅
 */
function getAllParameter(data) {
	return {
		"sAceClbSecd":      data.sAceClbSecd || "",
		"sValdYmd":         data.sValdYmd || "",
		"sPyTrsfEmpno":     data.sPyTrsfEmpno || "",
		"sCompNtcYn":       data.sCompNtcYn || "",
		"sCompPrbzPlyno":   data.sCompPrbzPlyno || "",
		"sCompPrbzCtymd":   data.sCompPrbzCtymd || "",
		"sChnDtlCod":       data.sChnDtlCod || "",
		"sSocposSecd":      data.sSocposSecd || "",
		"sPdiadv":          data.sPdiadv || "",
		"sTot_Dc_Amt":      data.sTot_Dc_Amt || "",
		"sRlpy_Prem":       data.sRlpy_Prem || "",
		"sSmtl_Prem":       data.sSmtl_Prem || "",
		"sYyfrs_Conv":      data.sYyfrs_Conv || "",
		"sOyr_Conv":        data.sOyr_Conv || "",  // X
		"sCanp_Conv": 	  	data.sCanp_Conv || "",	// X
		"sCol_Alow":        data.sCol_Alow || "",
		"sCtr_Admn_Alow":   data.sCtr_Admn_Alow || "",
		"sNmm_Prmtfe":      data.sNmm_Prmtfe || "",
		"sNmm_Enco_Fee":    data.sNmm_Enco_Fee || "",
		"sCoopPlarEmpno":   data.sCoopPlarEmpno || "",
		"sMhypymFtpr":      data.sMhypymFtpr || "",
		"sYyfrs_Conv":      data.sYyfrs_Conv || "",
		"sNonMhypymStdprm": data.sNonMhypymStdprm || "",	 
		"sFnclCsYn":        data.sFnclCsYn || "",
		"sHdwrSignYn":      data.sHdwrSignYn || "",
		"sMhypre":          data.sMhypre || "",
		"sMprd_Mhypre":     data.sMprd_Mhypre || "",  // X
		"sRcg_Trt_Mhypre":  data.sRcg_Trt_Mhypre || "",  // X
		"sComp_Ntc_Plyno":  data.sComp_Ntc_Plyno || "", // X
		"sConvPrm":         data.sConvPrm || "",
		"sColCms":          data.sColCms || "",
		"sRstCaclCd":       data.sRstCaclCd || "",
		"sCtrSecd":         data.sCtrSecd || "",
		"sCrtnDlerTgtYn":   data.sCrtnDlerTgtYn || "",
		"sColPlarCsPk":     data.sColPlarCsPk || "",
		"sColPlarCsRlePk":  data.sColPlarCsRlePk || "",
		"sJntPlarYn":       data.sJntPlarYn || "",
		"sJntPlarCsPk":     data.sJntPlarCsPk || "",
		"sJntPlarCsRlePk":  data.sJntPlarCsRlePk || "",
		"sJntPlarNum":      data.sJntPlarNum || "",
		"sJntPlarRto":      data.sJntPlarRto || "",
		"sTxpfPosa":        data.sTxpfPosa || "",
		"sAdpymPosa":       data.sAdpymPosa || "",
		"sGrpDlngYn":       data.sGrpDlngYn || "",
		"sMaigRvpl":        data.sMaigRvpl || "",
		"sInspoRvpl":       data.sInspoRvpl || "",
		"sEvntPdtKncd":     data.sEvntPdtKncd || "",
		"sMaigRcps":        data.sMaigRcps || "",
		"sPdtPdtSecd":      data.sPdtPdtSecd || "",
		"sPdtRpsPrdcd":     data.sPdtRpsPrdcd || "",
		"sPdtMaiPrdcd":     data.sPdtMaiPrdcd || "",
		"sMaiCsNam":        data.sMaiCsNam || "",
		"sMaiCsRrn":        data.sMaiCsRrn || "",
		"sTxpfSavgSecd":    data.sTxpfSavgSecd || "",
		"sGolPrfrApplYn":   data.sGolPrfrApplYn || "",
		"sQttno":           data.sQttno || "",
		"sPlyno":           data.sPlyno || "",
		"sSusnum":          data.sSusnum || "",
		"sGrpCsPk":         data.sGrpCsPk || "",
		"sGrpno":           data.sGrpno || "",
		"sGrpSusForm":      data.sGrpSusForm || "",
		"sInspoSlcSecd":    data.sInspoSlcSecd || "",
		"sManSusCnt":       data.sManSusCnt || "",
		"sFmlSusCnt":       data.sFmlSusCnt || "",
		"sBnfcGrpExpi":     data.sBnfcGrpExpi || "",
		"sBnfcGrpDias":     data.sBnfcGrpDias || "",
		"sBnfcGrpDth":      data.sBnfcGrpDth || "",
		"sGrpPlyno":        data.sGrpPlyno || "",
		"sAntyOpnYmd":      data.sAntyOpnYmd || "",
		"sGrpSusManPercnt": data.sGrpSusManPercnt || "",
		"sGrpSusFmlPercnt": data.sGrpSusFmlPercnt || "",
		"sGrpAccmPerCnt":   data.sGrpAccmPerCnt || "",
		"sGrpAccmSmasd":    data.sGrpAccmSmasd || "",
		"sGrpAccmGspre":    data.sGrpAccmGspre || "",
		"sGrpAccmPdiadv":   data.sGrpAccmPdiadv || "",
		"sGrpAccmAdPrem":   data.sGrpAccmAdPrem || "",
		"sGrpAccmTotDcAmt": data.sGrpAccmTotDcAmt || "",
		"sGrpAccmRlpyPrem": data.sGrpAccmRlpyPrem || "",
		"sGrpAccmPdiadvDcAmt": data.sGrpAccmPdiadvDcAmt || "",	// X
		"sGrpLstGenDcAmt":  data.sGrpLstGenDcAmt || "",
		"RLT_CD":           data.RLT_CD || "",
		"sCsRaResultCd":     "",  // xfn_getLookupVar(this,"g_csRaResultCd"))
		"sAtcdEstyYn":      "",   // xfn_getLookupVar(this,"gAtcdEstyYn"))
		"sIcpnSalPlarUdSecd":  data.sIcpnSalPlarUdSecd || "",
		"sSgngCod":  data.sSgngCod || "",
		"sAntySwtDfrmPrid":   data.sAntySwtDfrmPrid || "",
	    "sFixTrmDfrYn":       data.sFixTrmDfrYn || "",
		"sExpoVisYmd":        data.sExpoVisYmd || "",	
		"sExpoCd": 			data.sExpoCd || "",
		"sChkPerVar": 			data.sChkPerVar || "",		// X
		"sPrbzYn": 			data.PrbzYn || ""
	}
}

/**
 * dcUtil.copyArrayRow 함수 사용시 인수로 넣는 컬럼정보를 가져온다.
 *
 */
function getColInfoForCopyArrayRow(dsNm){

    var rtn = '';

    switch(dsNm) {
        // DM사항(녹취번호)
        case 'DS_UD_DM_MTT':    
            rtn = [
                'RECG_PK=RECG_PK',
                'RECG_YMD=RECG_YMD',
                'BRDDT=BRDDT',
                'CNPN_ID=CNPN_ID',
                'CNPN_NAM=CNPN_NAM',
                'CSNUM=CSNUM',
                'CS_NAM=CS_NAM'
            ].join(',');
            break;
        // DM사항(고지사항)
        case 'DS_UD_DCLO_MTT':    
            rtn = [ 
				'CTR_RLE_SECD=CTR_RLE_SECD',
				'DCLO_SNT_COD=DCLO_SNT_COD',
				'DCLO_ANSW_COD=DCLO_ANSW_COD',
				'DCLO_ANSW_CTT=DCLO_ANSW_CTT',
				'ANSW_SEQN=ANSW_SEQN'
			].join(',');
            break;
        // 부활사항
        case 'DS_UD_RSTM_MTT':    
            rtn = [ 
				'RSTM_YMD=RSTM_YMD',
				'RSTM_CHN_COD=RSTM_CHN_COD',
				'RSTM_HQ_COD=RSTM_HQ_COD',
				'RSTM_BZGRP_COD=RSTM_BZGRP_COD',
				'RSTM_BROFC_COD=RSTM_BROFC_COD',
				'RSTM_PLAR_EMPN=RSTM_PLAR_EMPN'
			].join(',');
            break;
        // 수금사항
        case 'DS_UD_CTMN_MTT':    
            rtn = [ 
				'CS_CTR_ACT_PK=CS_CTR_ACT_PK',
				'CS_CTR_CRDCR_PK=CS_CTR_CRDCR_PK',
				'ACT_PK=ACT_PK',
				'CRDCR_PK=CRDCR_PK',
				'SUS_CTMN_SECD=SUS_CTMN_SECD',
				'CTMN_METD_COD=CTMN_METD_COD',
				'CRTN_CTY_DLNG_YN=CRTN_CTY_DLNG_YN',
				'CASH_SECD=CASH_SECD',
				'INST_MTCNT=INST_MTCNT',
				'TRSF_HPDY=TRSF_HPDY',
				'VALD_PRID=VALD_PRID',
				'OWAC_CS_RLP_SECD=OWAC_CS_RLP_SECD',
				'ACT_USGE_SECD=ACT_USGE_SECD',
				'CTMN_SAME_COD=CTMN_SAME_COD',
				'OWAC_CRDCO=OWAC_CRDCO',
				'OWAC_RES_REG_NO=OWAC_RES_REG_NO',
				'ACTNUM_CARDNUM=ACTNUM_CARDNUM',
				'HOFC_COD=HOFC_COD'
			].join(',');
            break;
        // 계약관계자
        case 'DS_UD_INCT_INTP':    
            rtn = [ 
				'INCT_INTPSCTN=INCT_INTPSCTN',
				'RES_REG_NO=RES_REG_NO',
				'CS_NAM=CS_NAM',
				'CSID=CSID',
				'CHN_CSID=CHN_CSID',
				'XCLCLV_YN=XCLCLV_YN',
				'MAIPSN_RLP=MAIPSN_RLP',
				'AGE=AGE',
				'FUL_AGE=FUL_AGE',
				'GENDER=GENDER',
				'DTH_BNFC_RTO=DTH_BNFC_RTO',
				'HMBD_OBS_COD=HMBD_OBS_COD',
				'OCPT_KND=OCPT_KND',
				'OCPT_PEL_GRDE_COD=OCPT_PEL_GRDE_COD',
				'OCPT_INJ_PEL_GRDE_COD=OCPT_INJ_PEL_GRDE_COD',
				'DRVG_SECD=DRVG_SECD',
				'DRVG_PEL_GRDE_COD=DRVG_PEL_GRDE_COD',
				'DRVG_INJ_PEL_GRDE_COD=DRVG_INJ_PEL_GRDE_COD',
				'PELGRD=PELGRD',
				'RFU_CD=RFU_CD',
				'DIAG_CD=DIAG_CD',
				'NATAL_SECD=NATAL_SECD',
				'STY_COD=STY_COD',
				'RLNM_CFMT_COD=RLNM_CFMT_COD',
				'MAIG_RVPL=MAIG_RVPL',
				'INSPO_RVPL=INSPO_RVPL',
				'PBLS_YMD=PBLS_YMD',
				'STY_PRID=STY_PRID'
			].join(',')
            break;
        // 주소사항
        case 'DS_UD_ADR_MTT':    
            rtn = [ 
				'INCT_INTPSCTN=INCT_INTPSCTN',
				'CS_PK=CS_PK',
				'BZ_SECD=BZ_SECD',
				'CNTAD_BLN_SECD=CNTAD_BLN_SECD',
				'CNTAD_SECD=CNTAD_SECD',
				'ZCD=ZCD',
				'GTED_ADR=GTED_ADR',
				'LSTD_ADR=LSTD_ADR',
				'TEL_AR_NUM=TEL_AR_NUM',
				'TEL_GUK_NUM=TEL_GUK_NUM',
				'TEL_SEQ=TEL_SEQ',
				'EMAL_ID_NAM=EMAL_ID_NAM',
				'DMN_SECD=DMN_SECD',
				'DMN_NAM=DMN_NAM',
				'NEW_OLD_SECD=NEW_OLD_SECD'
			].join(',');
            break;
        // 신주소사항
        case 'DS_UD_ADR_NEW_MTT':    
            rtn = [ 
				'INCT_INTPSCTN=INCT_INTPSCTN',
				'CS_PK=CS_PK',
				'BZ_SECD=BZ_SECD',
				'CNTAD_BLN_SECD=CNTAD_BLN_SECD',
				'CNTAD_SECD=CNTAD_SECD',
				'NEW_OLD_SECD1=NEW_OLD_SECD1',
				'ZCD1=ZCD1',
				'GTED_ADR1=GTED_ADR1',
				'LSTD_ADR1=LSTD_ADR1',
				'ROAD_ZCD_COD1=ROAD_ZCD_COD1',
				'NEW_OLD_SECD2=NEW_OLD_SECD2',
				'ZCD2=ZCD2',
				'GTED_ADR2=GTED_ADR2',
				'LSTD_ADR2=LSTD_ADR2',
				'ROAD_ZCD_COD2=ROAD_ZCD_COD2',
				'TEL_AR_NUM=TEL_AR_NUM',
				'TEL_GUK_NUM=TEL_GUK_NUM',
				'TEL_SEQ=TEL_SEQ',
				'EMAL_ID_NAM=EMAL_ID_NAM',
				'DMN_SECD=DMN_SECD',
				'DMN_NAM=DMN_NAM',
				'CLEAN_YN=CLEAN_YN'
			].join(',');
            break;
        // 가입상품
        case 'DS_UD_NTPRD':    
            rtn = [ 
				'PRDCD=PRDCD',
				'GDS_SECD=GDS_SECD',
				'TRMINS_SCTN=TRMINS_SCTN',
				'TRMINS=TRMINS',
				'PYPD_SCTN=PYPD_SCTN',
				'PYPD=PYPD',
				'PYCYC=PYCYC',
				'SMSU=SMSU',
				'CFINSU_PREM=CFINSU_PREM',
				'RENW_PR_YMD=RENW_PR_YMD',
				'YEAR_INS=YEAR_INS',
				'YEAR_PYPD=YEAR_PYPD',
				'MATYMD=MATYMD',
				'LSTPYM_YMD=LSTPYM_YMD',
				'LST_ORD=LST_ORD',
				'LTYM=LTYM',
				'YYFRS_CONV=YYFRS_CONV',
				'OYR_CONV=OYR_CONV',
				'CANP_CONV=CANP_CONV',
				'MHYPRE=MHYPRE',
				'PBACT_CNT=PBACT_CNT',
				'OBLG_PYM_MTCNT=OBLG_PYM_MTCNT',
				'MW_AD_PDT_YN=MW_AD_PDT_YN',
				'PDT_INQ_SEQNO=PDT_INQ_SEQNO',
				'CONVPRM=CONVPRM',
				'COLCMS=COLCMS',
				'COLCMRT=COLCMRT'
			].join(',');
            break;
        // 보험료할인정보
        case 'DS_UD_PREM_DC_INF':    
            rtn = [ 
				'PRDCD=PRDCD',
				'DC_SECD=DC_SECD',
				'DC_TGT_PREM=DC_TGT_PREM',
				'DC_PREM_RTO=DC_PREM_RTO',
				'DC_AMT=DC_AMT',
				'LSTPYM_YMD=LSTPYM_YMD',
				'LST_ORD=LST_ORD',
				'LTYM=LTYM'
			].join(',');
            break;
        // 연금사항
        case 'DS_UD_ANTY_MTT':    
            rtn = [ 
				'ANTY_OPYMD=ANTY_OPYMD',
				'ASAG=ASAG',
				'ANTY_DFR_TYP_COD=ANTY_DFR_TYP_COD',
				'INDTY_CPLTYP_SECD=INDTY_CPLTYP_SECD',
				'ANTY_DFR_CYCL_COD=ANTY_DFR_CYCL_COD',
				'ANTY_GUA_PRID_COD=ANTY_GUA_PRID_COD',
				'ANTY_CRTN_PRID_COD=ANTY_CRTN_PRID_COD',
				'ANTY_GI_PRID_COD=ANTY_GI_PRID_COD',
				'ANTY_GI_FORM_COD=ANTY_GI_FORM_COD',
				'ANTY_GRICRT_COD=ANTY_GRICRT_COD',
				'ANTY_RFD_RTO=ANTY_RFD_RTO',
				'PRDCD=PRDCD',
				'ERSTA_CNTRL_TYP_GN_MUL_COD=ERSTA_CNTRL_TYP_GN_MUL_COD'
			].join(',');
            break;
        // 변액사항
        case 'DS_UD_VAR_MTT':    
            rtn = [ 
				'FUND_INF_SEQNO=FUND_INF_SEQNO',
				'FDCD=FDCD',
				'FUND_SECD=FUND_SECD',
				'FUND_INP_RTO=FUND_INP_RTO',
				'RE_SHAR=RE_SHAR'
			].join(',');
            break;
        // 변액투자적합정보
        case 'DS_VAR_FIT_DIAG':    
            rtn = [ 
				'DIAG_YN=DIAG_YN',
				'RCM_INS_PDT=RCM_INS_PDT',
				'RCM_INS_PDT_NAM=RCM_INS_PDT_NAM',
				'INS_CTR_PRPS=INS_CTR_PRPS',
				'INS_CTR_PRPS_NAM=INS_CTR_PRPS_NAM',
				'RGST_YMD=RGST_YMD',
				'RE_RGST_YMD=RE_RGST_YMD',
				'SUS_CTR_VAR_FIT_PK=SUS_CTR_VAR_FIT_PK',
				'CHN_VAR_FIT_DIAG_PK=CHN_VAR_FIT_DIAG_PK',
				'CHN_CS_PK=CHN_CS_PK',
				'SYS_COD=SYS_COD',
				'CS_NAM=CS_NAM',
				'CSNUM=CSNUM',
				'CS_PK=CS_PK'
			].join(',');
			break;
		// 이력사항
		case 'DS_UD_HIS_MTT':
			rtn = [ 
				'INCT_INTPSCTN=INCT_INTPSCTN',
				'HIS_INF=HIS_INF'		
			].join(',');
			break;
		// 회차별 가입상품
		case 'DS_UD_ORD_BY_NTPRD':
			rtn = [ 
				'PRDCD=PRDCD',
				'GDS_SECD=GDS_SECD',
				'TRMINS_SCTN=TRMINS_SCTN',
				'TRMINS=TRMINS',
				'PYPD_SCTN=PYPD_SCTN',
				'PYPD=PYPD',
				'PYCYC=PYCYC',
				'SMSU=SMSU',
				'CFINSU_PREM=CFINSU_PREM',
				'RENW_PR_YMD=RENW_PR_YMD',
				'YEAR_INS=YEAR_INS',
				'YEAR_PYPD=YEAR_PYPD',
				'MATYMD=MATYMD',
				'LSTPYM_YMD=LSTPYM_YMD',
				'LST_ORD=LST_ORD',
				'LTYM=LTYM'
			].join(',');
			break;
		// 할인내역
		case 'DS_UD_DC_KNCD_INF':
		rtn = [ 
			'DC_KNCD=DC_KNCD',
			'PYPRM=PYPRM',
			'DC_AMT=DC_AMT'	
		].join(',');
			break;
		// 보장내역
		case 'DS_UD_GN_PTCL':
		rtn = [ 
			'PRDCD=PRDCD',
			'INCTRLP=INCTRLP',
			'GN_CTR_RLE_SECD=GN_CTR_RLE_SECD',
			'GNKND=GNKND',
			'GNAMT=GNAMT',
			'PRBZ_SMTL_GN_AMT=PRBZ_SMTL_GN_AMT',
			'PRD_GRST_LIMT=PRD_GRST_LIMT'	
		].join(',');
			break;
		// 추가진단내역 
		case 'DS_UD_DIAG_PTCL':
		rtn = [ 
			'PLYNO=PLYNO',
			'GN_KND=GN_KND',
			'DIAG_CD=DIAG_CD',
			'DIAG_AMT=DIAG_AMT'		
		].join(',');
			break;
		// 부속서류내역(보완내역)
		case 'DS_UD_ATCD_DOC':
		rtn = [ 
			'AD_DOC_KND_CD=AD_DOC_KND_CD',
			'AD_DOC_KND_NM=AD_DOC_KND_NM',
			'REPL_COD=REPL_COD',
			'REF_MSG=REF_MSG',
			'DOC_KNCD=DOC_KNCD',
			'REPL_PR_DY=REPL_PR_DY',
			'TYPE_CLSFCD=TYPE_CLSFCD',
			'CASE_CRT_ESTY_YN=CASE_CRT_ESTY_YN'	
		].join(',');
			break;
		// 보험료사항 
		case 'dw_calc_prem':
		rtn = [ 
			'SUM_PREM=SUM_PREM',
			'MAI_PREM=MAI_PREM',
			'MAI_TRT_PREM=MAI_TRT_PREM',
			'TRT_PREM=TRT_PREM',
			'CONV_FSTM_PREM=CONV_FSTM_PREM',
			'MHYPYM_STD_PREM=MHYPYM_STD_PREM',
			'CONVPRN=CONVPRN',
			'COLCMS=COLCMS',
			'COLCMRT=COLCMRT'	
		].join(',');
			break;
		// 진단대상정보
		case 'dw_TgtDiagInf':
		rtn = [ 
			'DIAG_TGT_PLYNO=DIAG_TGT_PLYNO',
			'PRDCD=PRDCD',
			'INCT_INTPSCTN=INCT_INTPSCTN',
			'DIAG_TGT_AMT_KNCD=DIAG_TGT_AMT_KNCD',
			'DIAG_TGT_AMT=DIAG_TGT_AMT'		
		].join(',');
			break;
		// 실명확인
		case 'DS_UD_RLNMCFMT':
		rtn = [ 
			'CS_PK=CS_PK',
			'CS_NAM=CS_NAM',
			'CSNUM=CSNUM',
			'rtnVal=rtnVal',
			'CS_CFMT_DTM=CS_CFMT_DTM'	
		].join(',');
			break;
		// 주의계약
		case 'dw_AttCtrInf':
		rtn = [ 
			'PREM_RELV_YN=PREM_RELV_YN',
			'GENDTH_RELV_YN=GENDTH_RELV_YN',
			'SPEC_PLAR_YN=SPEC_PLAR_YN',
			'ASRD_BNFC_RLP_YN=ASRD_BNFC_RLP_YN',
			'CHGANO_CTR_YN=CHGANO_CTR_YN',
			'FAM_CTR_YN=FAM_CTR_YN',
			'SAME_POHD_YN=SAME_POHD_YN',
			'ATT_PLAR_CANP_COD=ATT_PLAR_CANP_COD',
			'ATT_PLAR_CANP_AMT=ATT_PLAR_CANP_AMT'	
		].join(',');
			break;
		// 갱신상품정보
		case 'dw_RenwPdtInf':
		rtn = [ 
			'RENW_PRDCD=RENW_PRDCD',
			'RENW_CTYMD=RENW_CTYMD',
			'RENW_EXPI_YMD=RENW_EXPI_YMD',
			'RENW_DIFNUM=RENW_DIFNUM',
			'RENW_TGT_ASRD_COD=RENW_TGT_ASRD_COD',
			'RENW_ATIM_ASRD_AGE=RENW_ATIM_ASRD_AGE',
			'RENW_OPRG_YN=RENW_OPRG_YN',
			'SF_ERR_YN=SF_ERR_YN',
			'RENW_AFT_PRDCD=RENW_AFT_PRDCD'		
		].join(',');
			break;
		// 승환계약정보
		case 'dw_ChganoCtr':
		rtn = [ 
			'PLYNO=PLYNO',
			'CTYMD=CTYMD',
			'PREV_CTR_PLYNO=PREV_CTR_PLYNO',
			'PRBZ_CTYMD=PRBZ_CTYMD',
			'PRVZ_CTR_STCD=PRVZ_CTR_STCD',
			'INDV_GRP_SECD=INDV_GRP_SECD',
			'CTMN_CHN_COD=CTMN_CHN_COD',
			'LAST_PYM_NUMTM=LAST_PYM_NUMTM',
			'LAST_PYM_YYMM=LAST_PYM_YYMM',
			'MHYPYM_STD_LAST_PYM_ORD=MHYPYM_STD_LAST_PYM_ORD',
			'LAP_YMD=LAP_YMD',
			'JBEF_3_MM_YMD=JBEF_3_MM_YMD',
			'SRDR_YMD=SRDR_YMD',
			'CHGANO_PDT_SECD=CHGANO_PDT_SECD',
			'SEF_CTR_YN=SEF_CTR_YN',
			'CHGANO_STD_CACL_YMD=CHGANO_STD_CACL_YMD'		
		].join(',');
			break;
		// 변액 투자 적합성 진단 정보
		case 'INS_DS_VAR_FIT_DIAG':
		rtn = [ 
			'DIAG_YN=DIAG_YN',
			'RCM_INS_PDT=RCM_INS_PDT',
			'RCM_INS_PDT_NAM=RCM_INS_PDT_NAM',
			'INS_CTR_PRPS=INS_CTR_PRPS',
			'INS_CTR_PRPS_NAM=INS_CTR_PRPS_NAM',
			'RGST_YMD=RGST_YMD',
			'RE_RGST_YMD=RE_RGST_YMD',
			'SUS_CTR_VAR_FIT_PK=SUS_CTR_VAR_FIT_PK',
			'CHN_VAR_FIT_DIAG_PK=CHN_VAR_FIT_DIAG_PK',
			'CHN_CS_PK=CHN_CS_PK',
			'SYS_COD=SYS_COD',
			'CS_NAM=CS_NAM',
			'CSNUM=CSNUM',
			'CS_PK=CS_PK',
			'ANSW_7=ANSW_7'	
		].join(',');
			break;
		// 지정대리청구인정보
		case 'DS_DSTN_PX_CLMR':
		rtn = [ 
			'BRTYMD=BRTYMD',
			'COLOR_CHK=COLOR_CHK',
			'CPCD=CPCD',
			'CPNM=CPNM',
			'CS_NAM=CS_NAM',
			'CS_PK=CS_PK',
			'CS_RLP_SECD=CS_RLP_SECD',
			'CTR_RLE_SECD=CTR_RLE_SECD',
			'DRVG_INJ_PEL_GRDE_COD=DRVG_INJ_PEL_GRDE_COD',
			'DRVG_PEL_GRDE_COD=DRVG_PEL_GRDE_COD',
			'DRVG_PEL_GRDE_NAM=DRVG_PEL_GRDE_NAM',
			'DRVG_SECD=DRVG_SECD',
			'DRVG_SENM=DRVG_SENM',
			'ESTY_INP_YN=ESTY_INP_YN',
			'GNDR_SECD=GNDR_SECD',
			'GUBUN=GUBUN',
			'NATAL_SECD=NATAL_SECD',
			'NATAL_SENM=NATAL_SENM',
			'OBS_GRDE_COD=OBS_GRDE_COD',
			'OCPT_INJ_PEL_GRDE_COD=OCPT_INJ_PEL_GRDE_COD',
			'OCPT_PEL_GRDE_COD=OCPT_PEL_GRDE_COD',
			'OCPT_PEL_GRDE_NAM=OCPT_PEL_GRDE_NAM',
			'PBLS_YMD=PBLS_YMD',
			'PCAYMD=PCAYMD',
			'PRCMPAG=PRCMPAG',
			'PYMRT=PYMRT',
			'RRN=RRN',
			'STY_COD=STY_COD',
			'STY_NAM=STY_NAM',
			'STY_PRID=STY_PRID',
			'XCLC_OCPT_YN=XCLC_OCPT_YN',
			'XCLCLV_APPL_YN=XCLCLV_APPL_YN',
			'XCLCLV_PSPY_YN=XCLCLV_PSPY_YN', 
			'DSTN_PX_SLCT_YN=DSTN_PX_SLCT_YN',
			'DSTN_PX_NT_SLCT_INF_CD=DSTN_PX_NT_SLCT_INF_CD'
		].join(',');
			break;




    }// switch END

    return rtn;
}


return {
    getInitUdParam : getInitUdParam,
	getColInfoForCopyArrayRow : getColInfoForCopyArrayRow,
	getAllParameter : getAllParameter
};
})(jQuery, window.Dcore);