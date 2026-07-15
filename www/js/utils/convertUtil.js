/*******************************************************************************
 * Function List
 *******************************************************************************
 *
 *	getRemoteObj	: remote 객체 반환
 *	setRowObj		: inDataSet의 dataSet에 row Object 채우기
 *	setRowArray		: inDataSet의 dataSet에 row Array 채우기
 * 	
 ******************************************************************************/


var convertUtil = (function($, D){
	
	/**
	 * remote 객체 반환
	 */
	function getRemoteObj(taskId, opCode, dataSetNames) {
		taskId = taskId || '';
		opCode = opCode || '';
		
		var remote = {
			"taskId" : taskId,
			"opCode" : opCode,
			"inDataSet" : {}
		}
		
		if (dataSetNames && $.type(dataSetNames) == 'array') {
			remote.inDataSet = {};
			for (var i = 0; i < dataSetNames.length ; i++) {
				var dataSetName = dataSetNames[i];
				remote.inDataSet[dataSetName] = [];
			}
		}
		
		return remote;
	}
	
	
	/**
	 * inDataSet의 dataSet에 row Object 채우기
	 */
	function setRowObj(remoteObj, dataSetName, dataObj) {
		if (!remoteObj && !dataSetName && !dataObj) return false;
		if ($.type(remoteObj) != 'object' && $.type(dataObj) != 'object') return false;
		
		if (remoteObj.inDataSet) {
			if (!remoteObj.inDataSet[dataSetName]) {
				remoteObj.inDataSet[dataSetName] = [];
			}
		} else {
			remoteObj.inDataSet = {};
			remoteObj.inDataSet[dataSetName] = [];
		}
		
		remoteObj.inDataSet[dataSetName].push(dataObj);
		
		return true;
	}
	
	
	/**
	 * inDataSet의 dataSet에 row Array 채우기
	 */
	function setRowArray(remoteObj, dataSetName, dataArray) {
		if (!remoteObj && !dataSetName && !dataArray) return false;
		if ($.type(remoteObj) != 'object' && $.type(dataArray) != 'array') return false;
		
		if (!remoteObj.inDataSet) {
			remoteObj.inDataSet = {};
		}
		
		remoteObj.inDataSet[dataSetName] = dataArray;
		
		return true;
	}
	
	
	
	return {
		getRemoteObj : getRemoteObj,
		setRowObj : setRowObj,
		setRowArray : setRowArray
	}

})(jQuery, window.Dcore);