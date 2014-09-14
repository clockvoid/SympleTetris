/*****************************************
Tetrisクラス
メインモジュール。ループの中身。
ゲームの中核を担う。
*****************************************/

var Tetris = function(arg0, arg1, arg2) {
	this.key = arg0;
	this.field = arg1;
	this.field.newField();
	this.field.newBlock();
	this.ui = arg2;
	this.counter = new Date().getTime();
	this.stopCounter = 0;
	this.terrainFlag = false;
	this.gameover = false;
	this.first = false;
	this.gamemode = 'GAME_PLAY_newblock';
	this.point = 0;
}

Tetris.prototype.mainLoop = function() {
	if(this.gameover) {
		this.gameOver();
	} else if(blocks.length != 7 || !gameoverImage) {
	} else {
		this.uiOutput();
		this.keyInput();
		this.game();
	}
}

Tetris.prototype.gameOver = function() {
	for(var i = 0; i < 9; i ++) {
		if(this.point >= highScore[i]) {
			for(var j = 8; j > i; j --) {
				highScore[j] = highScore[j - 1];
			}
			highScore[i] = this.point;
			break;
		}
	}
	for(var i = 0; i < 9; i ++) {
		document.cookie = 'score' + i.toString() + '=' + highScore[i].toString();
	}
	clearInterval(timer);
	this.ui.gameOver(this.point);
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
				this.sleep(50);
			}
		}
	}
}

Tetris.prototype.game = function() {
	this.gameover = this.field.isGameover();
	switch(this.gamemode) {
		case 'GAME_PLAY' : {
			if(this.field.isCollision('MOVE_DOWN')){
				if(new Date().getTime() - this.counter > 1000) {
					this.field.blockMoveDown();
					this.counter = new Date().getTime();
				}
			} else {
				if(this.stopCounter > 100) {
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
				this.point += 5 * (delNum - 1) + delNum * 5;
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
			if(this.first) {
				this.sleep(500);
			} else {
				this.first = true;
			}
			this.field.newBlock();
			this.ui.updateNextBlock(this.field.getNextBlock());
			this.gamemode = 'GAME_PLAY';
			break;
		}
	}
}

Tetris.prototype.uiOutput = function() {
	if(this.gamemode == 'GAME_PLAY' || this.gamemode == 'GAME_PLAY_deleteline') {
		var arg = this.field.getField();
		this.ui.output(arg);
	}
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
