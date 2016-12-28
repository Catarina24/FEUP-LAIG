/**
* Yavalath
* @constructor
*/

var mode={
    HUMAN_VS_HUMAN: 1,
    HUMAN_VS_BOT:2,
    BOT_VS_BOT:3,
};

var level={
    EASY:1,
    NORMAL:2,
};

var state={
    MENU:1,
    INIT: 2,
    PLAYING:3,
    END:4,
};

var player={
    P1:1,
    P2:2,
};

function Yavalath(scene){
    
    this.scene = scene;
    this.board = new MyBoard(scene);
    this.client = new Client();

    this.state = state.INIT;
    this.level = null;

    this.winner = null;

    //add player

    this.currentPlayer = player.P1;
    
}


Yavalath.prototype.constructor=Yavalath;


Yavalath.prototype.init = function(name1, name2){
    
    //teste
    name1="player1";
    name2="player2";
    //
    var requestString = "init(" + name1 + "," + name2 + ")";
    this.client.getPrologRequest(requestString, function(data){

        var result = data.target.responseText;

    });
}

Yavalath.prototype.placePiecePlayer = function(x, y){

    var requestString = "movePlayer(" + x + "," + y + ")";
    this.client.getPrologRequest(requestString, function(data){

        var result = data.target.responseText;
        console.log(result);
        
/*
        switch(result){
            case '0':
                console.log("Invalid Move");
                break;
            case '1':
                console.log("Valid Move");
                //this.changePlayer();
                break;
            case '2':
                this.state = state.END;
                //this.changePlayer();
                console.log("Draw");
                break;
            case '3':
                this.state = state.END;
                //this.changePlayer();
                console.log("Lost");
                break;
            case '4':
                this.state = state.END;
                //this.changePlayer();
                console.log("Win");
                break;
            default:
                console.log(result);
                console.log("lol");
                break;
        }*/
    });

};

Yavalath.prototype.placePieceBot = function(x, y){

    var requestString = "moveBot(" + this.level + ")";
    this.client.getPrologRequest(requestString, function(data){

        var parsed = JSON.parse(data.target.responseText);
        var x = parsed[0];
        var y = parsed[1];
        var result = parsed[2];
        console.log("Result of move bot: ");
        console.log(x + y + result);

        this.handleDataReceived(result);
       
    });
};

Yavalath.prototype.handleDataReceived = function(result){
        console.log(result);
        switch(result){
            case 0:
                console.log("Invalid Move");
                break;
            case 1:
                console.log("Valid Move");
                this.changePlayer();
                break;
            case 2:
                this.state = state.END;
                this.changePlayer();
                console.log("Draw");
                break;
            case 3:
                this.state = state.END;
                this.changePlayer();
                console.log("Lost");
                break;
            case 4:
                this.state = state.END;
                this.changePlayer();
                console.log("Win");
                break;
            default:
                console.log("lol");
                break;
        }
};


Yavalath.prototype.changePlayer = function(){
    
    if (this.currentPlayer == player.P1)
        this.currentPlayer = player.P2;
    else if (this.currentPlayer == player.P2)
        this.currentPlayer = player.P1;

}

Yavalath.prototype.pickListenerGame = function()
{
    if (this.scene.pickMode == false) {
		if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
			for (var i=0; i< this.scene.pickResults.length; i++) {
				var obj = this.scene.pickResults[i][0];
				if (obj)
				{
					var customId = this.scene.pickResults[i][1];
                    this.pickHandler(this.board.getCoordFromIdofPickedCell(customId));		
				}
			}
			this.scene.pickResults.splice(0,this.scene.pickResults.length);
		}	
	}
}

Yavalath.prototype.pickHandler = function(Coords)
{
    console.log(Coords);
    this.board.selectedCoords = Coords;
    this.board.startAnimationTime = this.scene.elapsedTime;

    //teste
    this.placePiecePlayer(this.board.selectedCoords.y-1, this.board.selectedCoords.x-1);

    this.board.movePlayerPiece(0);
}



Yavalath.prototype.handleGameState = function(){
    switch(this.state){
        case state.MENU:
            break;
        case state.INIT:
            this.init();
            this.state = state.PLAYING;
            break;
        case state.PLAYING:
            this.board.display();
            this.pickListenerGame();
            break;
        case state.END:
            break;
    }
}