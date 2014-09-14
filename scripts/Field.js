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
