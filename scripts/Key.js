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
