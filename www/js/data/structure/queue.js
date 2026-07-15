/**
 *	 queue 구조 구현
 */

function Queue() {
	var datas = [];
}

/**
 *	 데이터 넣기
 */
Queue.prototype.enqueue = function (data) {
	this.datas.push(data);
}

/**
 *	 데이터 가져오기
 */
Queue.prototype.dequeue = function () {
	var data = this.datas[0];
	this.datas.shift();
	
	return data;
}

/**
 *	 큐가 비었는지 체크
 */
Queue.prototype.isEmpty = function () {
	return (this.datas.length == 0) ? true : false;
}

/**
 *	 큐 길이 (데이타 갯수) 구하기
 */
Queue.prototype.length = function () {
	return this.datas.length;
}

/**
 *	 큐 비우기
 */
Queue.prototype.empty = function () {
	this.datas = [];
}

/**
 *	 toString
 */
Queue.prototype.toString = function () {
	var str = '';
	
	this.datas.forEach(function(data, index){
		str += data + ' ';
	});
	
	return str;
}