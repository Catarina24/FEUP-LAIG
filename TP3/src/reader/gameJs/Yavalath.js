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
    GAMEOVER_MENU:5,
};

function Yavalath(scene){
    
    this.scene = scene;
    this.board = new MyBoard(scene);
    this.client = new Client();

    this.state = state.MENU;
    this.level = null;

    this.winner = null;

    //add player
    this.player1 = null;
    this.player2 = null;

    this.currentPlayer = null;
    
}


Yavalath.prototype.constructor=Yavalath;


Yavalath.prototype.init = function(){
    
    this.client.getPrologRequest("init", function(data){

        var result = data.target.responseText;

    });
}


Yavalath.prototype.placePiecePlayer = function(x, y, piece){

    var game = this;
    var requestString = "movePlayer(" + x + "," + y + "," + piece + ")";

    var end = this.client.getPrologRequest(requestString, function(data){
        
        var result = data.target.responseText;
        console.log(result);
        game.handleDataReceived(result);

    });

};

Yavalath.prototype.placePieceBot = function(piece){

    var game = this;
    var requestString = "moveBot(" + this.level + "," + piece + ")";

    this.client.getPrologRequest(requestString, function(data){

        var parsed = JSON.parse(data.target.responseText);
        var x = parsed[0];
        var y = parsed[1];
        var result = parsed[2];

        game.handleDataReceived(result);
       
    });
};

Yavalath.prototype.handleDataReceived = function(result){
        switch(result){
            case '0':
                console.log("Invalid Move");
                break;
            case '1':
                console.log("Valid Move");
                this.changePlayer();
                break;
            case '2':
                this.state = state.END;
                console.log("Draw");
                break;
            case '3':
                this.state = state.END;
                console.log("Lost");
                break;
            case '4':
                this.state = state.END;
                console.log("Win");
                break;
        }
};


Yavalath.prototype.changePlayer = function(){
    
    if (this.currentPlayer == this.player1)
        this.currentPlayer = this.player2;
    else if (this.currentPlayer == this.player2)
        this.currentPlayer = this.player1;

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
    this.placePiecePlayer(this.board.selectedCoords.y-1, this.board.selectedCoords.x-1, this.currentPlayer.piece);

    if (this.currentPlayer.piece == 'black')
        this.board.movePlayerPiece(0);
    else if(this.currentPlayer.piece == 'white')
        this.board.movePlayerPiece(1);
}



Yavalath.prototype.handleGameState = function(){
    switch(this.state){
        case state.MENU:
            this.player1 = new Player('cat', 'black');
            this.player2 = new Player('ze', 'white');
            this.currentPlayer = this.player1;
            this.state = state.INIT;
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
            //this.finalize();
            this.state = state.GAMEOVER_MENU;
            break;
        case state.GAMEOVER_MENU:
            break;
    }
}