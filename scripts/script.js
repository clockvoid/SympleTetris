/*****************************************
Initialize.
HTMLのloadが完了する前にする初期化処理。
*****************************************/

var timer;

var SPACE;
var LEFT;
var TOP;
var RIGHT;
var DOWN;

var key;
var block;
var field;
var ui;
var tetris;

var highScore;

var blocks;
var gameoverImage;

var loadImages = function() {
	blocks = new Array();
	var loadCounter = 1;
	var loadBlocks = function() {
		var imgObj = new Image();
		imgObj.addEventListener('load', 
		function() {
			loadCounter ++;
			blocks.push(imgObj);
			if(loadCounter == 8) {
				return;
			}
			else loadBlocks();
		}, false);

		imgObj.src = 'images/' + loadCounter.toString() + '.png';
	};
	loadBlocks();
	gameoverImage = new Image();
	var loadGameOver = function() {
		var imgObj = new Image();
		imgObj.addEventListener('load', 
		function() {
			gameoverImage = imgObj;
			return;
		}, false);
		imgObj.src = 'images/gameover.png';
	}
	loadGameOver();
}

loadImages();

/*****************************************
   End of Initialize
*****************************************/

var newGame = function() {
	SPACE = false;
	LEFT = false;
	TOP = false;
	RIGHT = false;
	DOWN = false;
	key = new Key();
	block = new Block();
	field = new Field(block);
	var canvas = document.getElementById('canvas');
	if(!canvas || !canvas.getContext)return false;
	ui = new UI(canvas, blocks, document.getElementById('scoreBord'), gameoverImage, document.getElementById('result'));
	tetris = new Tetris(key, field, ui);
	timer = setInterval(function() {
		tetris.mainLoop();
	}, 0);
}

var replay = function() {
	key = null;
	block = null;
	field = null;
	ui = null;
	tetris = null;
	clearInterval(timer);
	timer = null;
	newGame();
}

onload = function() {
	var cookie = document.cookie;
	highScore = new Array(9);
	if(!cookie) {
		for(var i = 0; i < 9; i ++) {
			highScore[i] = 100 - i * 10;
		}
	} else {
		var cookies = cookie.split(';');
		for(var i = 0; i < cookies.length; i ++) {
			highScore[i] = parseInt(cookies[i].split('=')[1], 10);
		}
	}
	newGame();
}
