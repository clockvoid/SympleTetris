var timer;

var SPACE = false;
var LEFT = false;
var TOP = false;
var RIGHT = false;
var DOWN = false;

/*****************************************
Keyクラス。
キー入力イベントを拾ってブロックを動かすため
******************************************/

var Key = function() {
	if(window.addEventListener){ //EventListenerに対応しているか
		document.addEventListener("keydown" , this.onKeyevent); // キーボードを押したときに実行されるイベント
		document.addEventListener("keyup" , this.onKeyup); // キーボードを離したときに実行されるイベント
	} else if(window.attachEvent){ // アタッチイベントに対応している
		document.attachEvent("onkeydown" , this.onKeyevent);
		document.attachEvent("onkeyup" , this.onKeyup);
	}
}

Key.prototype.onKeyevent = function(e) {
	switch(e.keyCode) {
		case 32 : SPACE = true; break;
		case 37 : LEFT = true; break;
		case 38 : TOP = true; break;
		case 39 : RIGHT = true; break;
		case 40 : DOWN = true; break;
	}
}

Key.prototype.onKeyup = function(e) {
	switch(e.keyCode) {
		case 32 : SPACE = false; break;
		case 37 : LEFT = false; break;
		case 38 : TOP = false; break;
		case 39 : RIGHT = false; break;
		case 40 : DOWN = false; break;
	}
}

/***************************************
       End of  Key class
****************************************/

/*****************************************
Blockクラス
ブロックの制御関係を担当している。
Fieldと連携して働く。
******************************************/

var Block = function() {
	this.blocks =  [
		[[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
		[[0, 0, 0, 0], [0, 2, 0, 0], [0, 2, 2, 2], [0, 0, 0, 0]],
		[[0, 0, 0, 0], [0, 0, 3, 3], [0, 3, 3, 0], [0, 0, 0, 0]],
		[[0, 0, 0, 0], [4, 4, 0, 0], [0, 4, 4, 0], [0, 0, 0, 0]],
		[[0, 0, 0, 0], [0, 5, 0, 0], [5, 5, 5, 0], [0, 0, 0, 0]],
		[[0, 0, 0, 0], [0, 6, 6, 0], [0, 6, 6, 0], [0, 0, 0, 0]],
		[[0, 0, 0, 0], [0, 0, 0, 7], [0, 7, 7, 7], [0, 0, 0, 0]],
	];
	this.block = new Array(4);
	for(var i = 0; i < 4; i ++) {
		this.block[i] = new Array(4);
	}
	this.nextBlock = null;
}

Block.prototype.moveDown = function() {
	this.y ++;
}

Block.prototype.moveRight = function() {
	this.x ++;
}

Block.prototype.moveLeft = function() {
	this.x --;
}

Block.prototype.getBlock = function() {
	return this.block;
}

Block.prototype.getNextBlock = function() {
	return this.nextBlock;
}

Block.prototype.getX = function() {
	return this.x;
}

Block.prototype.getY = function() {
	return this.y;
}

Block.prototype.newBlock = function() {
	var swp = this.blocks[Math.ceil(Math.random() * 7 - 1)];
	if(!this.nextBlock) {
		this.block = new Array(4);
		for(var i = 0; i < 4; i ++) {
			this.block[i] = swp[i].concat();
		}
		swp = this.blocks[Math.ceil(Math.random() * 7 - 1)];
	} else {
		this.block = new Array(4);
		for(var i = 0; i < 4; i ++) {
			this.block[i] = this.nextBlock[i].concat();
		}
	}
	this.nextBlock = new Array(4);
	for(var i = 0; i < 4; i ++) {
		this.nextBlock[i] = swp[i].concat();
	}
	this.x = 4;
	this.y = -4;
}

Block.prototype.turnRight = function() {
	var block2 = new Array(this.block.length); //参照型だから複製しないとダメ!
	for(var i = 0; i < this.block.length; i ++) {
		block2[i] = this.block[i].concat();
	}
	for(var row = 0; row < this.block.length; row++){
		for(var col = 0; col < this.block[row].length; col++){
			this.block[col][3 - row] = block2[row][col];	//右回転：定式
		}
	}
}

Block.prototype.turnLeft = function() {
	var block2 = new Array(this.block.length); //参照型だから複製しないとダメ!
	for(var i = 0; i < this.block.length; i ++) {
		block2[i] = this.block[i].concat();
	}
	for(var row = 0; row < this.block.length; row++){
		for(var col = 0; col < this.block[row].length; col++){
			this.block[3 - col][row] = block2[row][col];	//左回転：定式
		}
	}
}

Block.prototype.clearBlock = function() {
	for(var i = 0; i < 4; i ++) {
		for(var j = 0; j < 4; j ++) {
			this.block[i][j] = 0;
		}
	}
}

/*****************************************
      End of Block class
*****************************************/

/*****************************************
Fieldクラス
フィールドに関することをやってくれる。
Blockオブジェクトを持っていて、彼の面倒を見てくれるのもこいつだ。
*****************************************/

var Field = function(arg0) {
	this.block = arg0;
	this.row = 21;
	this.cal = 12;
	this.delRow = new Array();
	this.field = new Array(this.row);
	for(var i = 0; i < this.row; i ++) {
		this.field[i] = new Array(this.cal);
	}
}

Field.prototype.newField = function() {
	this.block.newBlock();
	for(var i = 0; i < this.row; i ++) {
		for(var j = 0; j < this.cal; j ++) {
			this.field[i][j] = (i == 20 || j == 0 || j == 11 ? 9 : 0);
		}
	}
}

Field.prototype.isCollision = function(type) {
	var block2 = new Block();
	block2.block = new Array(4);
	for(var i = 0; i < 4; i ++) {
		block2.block[i] = this.block.getBlock()[i].concat();
	}
	block2.x = this.block.getX();
	block2.y = this.block.getY();
	//this.block.clone(block2);
	var flag = true;
	switch(type) {
		case 'TURN_RIGHT' : block2.turnRight(); break;
		case 'TURN_LEFT' : block2.turnLeft(); break;
		case 'MOVE_DOWN' : block2.moveDown(); break;
		case 'MOVE_RIGHT' : {
			block2.moveRight();
			if(block2.getY() + 1 < 0)flag = false;
			break;
		}
		case 'MOVE_LEFT' : {
			block2.moveLeft();
			if(block2.getY() + 1 < 0)flag = false;
			break;
		}
		case 'CREATE_NEW_BLOCK' : break;
		default : break;
	}
	
	for(var i = 0; i <= 3; i ++) {
		for(var j = 0; j <= 3; j ++) {
			if(i + block2.getY() < this.row && j + block2.getX() < this.cal && block2.getY() + i >= 0){
			if(this.field[i + block2.getY()][j + block2.getX()] && block2.getBlock()[i][j]) {
				flag = false;
			}
			}
		}
	}
	return flag;
}

Field.prototype.newBlock = function() {
	this.block.newBlock();
}

Field.prototype.addBlock = function() {
	var array = this.block.getBlock();
	var x = this.block.getX();
	var y = this.block.getY();
	for(var row=0; row < 4; row++){
		for(var col=0; col < 4; col++){
			if(array[row][col] != 0){
				var num = array[row][col];
				if(y + row >= 0)this.field[(y + row)][(x + col)] = num;
			}
		}
	}
	this.block.clearBlock();
}

Field.prototype.checkLine = function() {
	var delNum = 0;
	this.delRow = new Array();
		
	var cells;
		
	for(var row=1; row < this.row - 1; row++){
		cells = 0;
		
		//横ラインのブロック数をカウント
		for(var col=1; col < this.cal - 1; col++){
			if(this.field[row][col]){
				cells++;
			}else{
				break;
			}
		}//next col
			
		//横ラインが揃っているなら、その行番号をdelRow[]に格納
		if(cells == this.cal-2){
			this.delRow.push(row);
			delNum ++;
		}
	}//next row
		
	return delNum;
}

Field.prototype.deleteLine = function() {
	for(var n = 0; n < this.delRow.length; n++){
		for(var col=1; col < this.cal-1; col++){
			this.field[this.delRow[n]][col] = 0;
		}
	}
}

Field.prototype.killLine = function() {
	for(var n = 0; n < this.delRow.length; n ++) {
		for(var row = this.delRow[n]; row > 0; row --) {
			this.field[row] = this.field[row - 1].concat(); //参照をコピーしまくると、上の方の要素が全部同じアドレスに集中してしまう。そのため、実体のコピーを代入する。
		}
	}
	for(var i = 1; i < this.cal - 1; i ++) {
		this.field[0][i] = 0;
	}
}

Field.prototype.getField = function() {
	var ans = new Array(this.row);
	for(var i = 0; i < this.row; i ++) {
		ans[i] = this.field[i].concat();
	}
	for(var i = 0; i <= 3; i ++) {
		for(var j = 0; j <= 3; j ++) {
			if(this.block.getY() + i < this.row - 1 && this.block.getX() + j < this.cal - 1 && this.block.getY() + i >= 0) {
				if(this.block.getBlock()[i][j]) {
					ans[i + this.block.getY()][j + this.block.getX()] = this.block.getBlock()[i][j];
				}
			}
		}
	}
	return ans;
}

Field.prototype.isGameover = function() {
	var flag = false;
	for(var i = 1; i < this.cal - 1; i ++) {
		if(this.field[0][i])flag = true;
	}
	return flag;
}

Field.prototype.blockMoveDown = function() {
	this.block.moveDown();
}

Field.prototype.blockMoveRight = function() {
	this.block.moveRight();
}

Field.prototype.blockMoveLeft = function() {
	this.block.moveLeft();
}

Field.prototype.blockTurnRight = function() {
	this.block.turnRight();
}

Field.prototype.blockTurnLeft = function() {
	this.block.turnLeft();
}

Field.prototype.getNextBlock = function() {
	return this.block.getNextBlock();
}

/*****************************************
       End of Field class
*****************************************/

/*****************************************
UIクラス
ユーザーインターフェイスに関することをやってくれる。
*****************************************/

var UI = function(arg0, arg1, arg2) {
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
	this.counter = 0;
	this.ctx.font = '18px "MS P ゴシック"';
	this.ctx.fillStyle = 'white';
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
	//console.log(this.counter ++);
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

/*****************************************
        End of UI class
*****************************************/

/*****************************************
Tetrisクラス
メインモジュール。ループの中身。
ゲームの中核を担う。
*****************************************/

var Tetris = function(arg0, arg1, arg2) {
	this.key = arg0;
	this.field = arg1;
	this.field.newField();
	this.ui = arg2;
	this.counter = new Date().getTime();
	this.stopCounter = 0;
	this.terrainFlag = false;
	this.gameover = false;
	this.gamemode = 'GAME_PLAY';
	this.point = 0;
}

Tetris.prototype.mainLoop = function() {
	this.uiOutput();
	this.keyInput();
	this.game();
}

Tetris.prototype.keyInput = function() {
	if(this.gamemode == 'GAME_PLAY') {
		if(SPACE) {
			if(this.field.isCollision('TURN_LEFT')) {
				this.field.blockTurnLeft();
				this.sleep(200);
			}
		}
		if(LEFT) {
			if(this.field.isCollision('MOVE_LEFT')) {
				this.field.blockMoveLeft();
				this.sleep(120);
			}
		}
		if(TOP) {
			if(this.field.isCollision('TURN_RIGHT')) {
				this.field.blockTurnRight();
				this.sleep(200);
			}
		}
		if(RIGHT) {
			if(this.field.isCollision('MOVE_RIGHT')) {
				this.field.blockMoveRight();
				this.sleep(120);
			}
		}
		if(DOWN) {
			if(this.field.isCollision('MOVE_DOWN')) {
				this.field.blockMoveDown();
				//this.sleep(120);
			}
		}
	}
}

Tetris.prototype.game = function() {
	this.gameover = this.field.isGameover();
	if(this.gameover)alert("game over");
	switch(this.gamemode) {
		case 'GAME_PLAY' : {
			if(this.field.isCollision('MOVE_DOWN')){
				if(new Date().getTime() - this.counter > 500) {
					this.field.blockMoveDown();
					this.counter = new Date().getTime();
				}
			} else {
				if(this.stopCounter > 50) {
					this.gamemode = 'GAME_PLAY_addblock';
					this.stopCounter = 0;
				} else {
					this.stopCounter ++;
				}
			}
			break;
		} case 'GAME_PLAY_addblock' : {
			//add block to field
			this.field.addBlock();
			this.gamemode = 'GAME_PLAY_checkline';
			break;
		} case 'GAME_PLAY_checkline' : {
			var delNum = this.field.checkLine();
			if(delNum) {
				this.point += delNum;
				this.ui.updatePoint(this.point);
				this.gamemode = 'GAME_PLAY_deleteline';
			} else {
				this.gamemode = 'GAME_PLAY_newblock';
			}
			break;
		} case 'GAME_PLAY_deleteline' : {
			this.field.deleteLine();
			this.sleep(500);
			this.uiOutput();
			this.field.killLine();
			this.sleep(500);
			this.gamemode = 'GAME_PLAY_newblock';
			break;
		} case 'GAME_PLAY_newblock' : {
			this.sleep(500);
			this.field.newBlock();
			this.ui.updateNextBlock(this.field.getNextBlock());
			this.gamemode = 'GAME_PLAY';
			break;
		}
	}
}

Tetris.prototype.uiOutput = function() {
	var arg = this.field.getField();
	this.ui.output(arg);
}

Tetris.prototype.sleep = function(arg0) {
	var time1 = new Date().getTime();
	var time2 = new Date().getTime();

	while((time2 - time1) < arg0) {
		time2 = new Date().getTime();
	}
}

/*****************************************
      End of Tetris class
*****************************************/

onload = function() {
	var key = new Key();
	var block = new Block();
	var field = new Field(block);
	var blocks = new Array();
	var loadCounter = 1;
	var loadBlocks = function() {
		var imgObj = new Image();
		imgObj.addEventListener('load', 
		function() {
			loadCounter ++;
			blocks.push(imgObj);
			if(loadCounter == 8)return;
			else loadBlocks();
		}, false);
	
		imgObj.src = loadCounter.toString() + '.png';
	};
	loadBlocks();
	var canvas = document.getElementById('canvas');
	if(!canvas || !canvas.getContext)return false;
	var ui = new UI(canvas, blocks, document.getElementById('scoreBord'));
	var tetris = new Tetris(key, field, ui);
	timer = setInterval(function() {
		tetris.mainLoop();
		if(tetris.gameover)clearInterval(timer);
	}, 0);
}
