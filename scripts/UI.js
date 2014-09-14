/*****************************************
UIクラス
ユーザーインターフェイスに関することをやってくれる。
*****************************************/

var UI = function(arg0, arg1, arg2, arg3, arg4) {
	this.canvas = arg0;
	this.scoreBord = arg2;
	this.ctx = this.canvas.getContext('2d');
	this.oldField = new Array(21);
	for(var i = 0; i < 21; i ++) {
		this.oldField[i] = new Array(12);
	}
	this.x = 240;
	this.y = 20;
	this.nx = 604;
	this.ny = 64;
	this.px = 604;
	this.py = 364;
	this.blockSize = 28;
	this.blocks = arg1;
	this.gameOverImage = arg3;
	this.result = arg4;
	this.result.innerHTML = '';
	this.scoreBord.innerHTML = '0';
	this.ctx.clearRect(0, 0, 800, 600);
}

UI.prototype.output = function(field) {
	for(var i = 0; i < 20; i ++) {
		for(var j = 1; j < 11; j ++) {
			if(this.oldField[i][j] && (this.oldField[i][j] != field[i][j]))this.ctx.clearRect(this.x + this.blockSize * (j - 1), this.y + this.blockSize * i, this.blockSize, this.blockSize);
			if(field[i][j])this.ctx.drawImage(this.blocks[field[i][j] - 1], this.x + this.blockSize * (j - 1), this.y + this.blockSize * i);
		}
	}
	for(var i = 0; i < 21; i ++) {
		this.oldField[i] = field[i].concat();
	}
}

UI.prototype.updateNextBlock = function(arg0) {
	this.ctx.clearRect(this.nx, this.ny, this.blockSize * 4, this.blockSize * 4);
	for(var i = 0; i < 4; i ++) {
		for(var j = 0; j < 4; j ++) {
			if(arg0[i][j])this.ctx.drawImage(this.blocks[arg0[i][j] - 1], this.nx + this.blockSize * j, this.ny + this.blockSize * (i + 1));
		}
	}
}

UI.prototype.updatePoint = function(arg0) {
	this.scoreBord.innerHTML = arg0
}

UI.prototype.gameOver = function(arg0) {
	var ctx = this.ctx;
	var scores = '';
	var counter = 0;
	var gameOverImage = this.gameOverImage;
	var x = this.x;
	var y = this.y;
	var result = this.result;
	var fillTimer = setInterval(function() {
		if(counter <= 560) {
			ctx.clearRect(240, 20 + (560 - counter), 28 * 10, 1);
			counter ++;
		} else {
			ctx.drawImage(gameOverImage, x, y);
			var youFlag = true;
			for(var i = 0; i < 9; i ++) {
				scores += (i + 1).toString() + ':' + highScore[i].toString();
				if(highScore[i] == arg0 && youFlag) {
					scores += '   ←YOU!';
					youFlag = false;
				}
				scores += '<br>';
			}
			result.innerHTML = scores;
			clearInterval(fillTimer);
		}
	}, 0);
}

/*****************************************
        End of UI class
*****************************************/
