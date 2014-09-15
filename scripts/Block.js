/*****************************************
Blockクラス
ブロックの制御関係を担当している。
Fieldと連携して働く。
******************************************/

var Block = function() {
	this.blocks =  [
		[[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
		[[2, 0, 0], [2, 2, 2], [0, 0, 0]],
		[[0, 3, 3], [3, 3, 0], [0, 0, 0]],
		[[4, 4, 0], [0, 4, 4], [0, 0, 0]],
		[[0, 5, 0], [5, 5, 5], [0, 0, 0]],
		[[6, 6], [6, 6]],
		[[0, 0, 7], [7, 7, 7], [0, 0, 0]],
	];
	this.block = null;
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
		this.block = new Array(swp.length);
		for(var i = 0; i < swp.length; i ++) {
			this.block[i] = swp[i].concat();
		}
		swp = this.blocks[Math.ceil(Math.random() * 7 - 1)];
	} else {
		this.block = new Array(this.nextBlock.length);
		for(var i = 0; i < this.nextBlock.length; i ++) {
			this.block[i] = this.nextBlock[i].concat();
		}
	}
	this.nextBlock = new Array(swp.length);
	for(var i = 0; i < swp.length; i ++) {
		this.nextBlock[i] = swp[i].concat();
	}
	this.x = this.block.length == this.blocks[5].length ? 5 : 4;
	this.y = this.block.length == this.blocks[0].length ? -1 : 0;
}

Block.prototype.turnRight = function() {
	var block2 = new Array(this.block.length); //参照型だから複製しないとダメ!
	for(var i = 0; i < this.block.length; i ++) {
		block2[i] = this.block[i].concat();
	}
	for(var row = 0; row < this.block.length; row++){
		for(var col = 0; col < this.block[row].length; col++){
			this.block[col][(this.block.length - 1) - row] = block2[row][col];	//右回転：定式
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
			this.block[(this.block.length - 1) - col][row] = block2[row][col];	//左回転：定式
		}
	}
}

Block.prototype.clearBlock = function() {
	for(var i = 0; i < this.block.length; i ++) {
		for(var j = 0; j < this.block.length; j ++) {
			this.block[i][j] = 0;
		}
	}
}

/*****************************************
      End of Block class
*****************************************/
